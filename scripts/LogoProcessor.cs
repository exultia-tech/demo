using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class LogoProcessor
{
    private static void HslToRgb(double h, double s, double l, out byte r, out byte g, out byte b)
    {
        if (s == 0)
        {
            r = g = b = (byte)(l * 255);
            return;
        }

        double q = l < 0.5 ? l * (1.0 + s) : l + s - (l * s);
        double p = 2.0 * l - q;

        Func<double, double, double, double> hueToRgb = (pVal, qVal, t) =>
        {
            if (t < 0) t += 1.0;
            if (t > 1) t -= 1.0;
            if (t < 1.0 / 6.0) return pVal + (qVal - pVal) * 6.0 * t;
            if (t < 1.0 / 2.0) return qVal;
            if (t < 2.0 / 3.0) return pVal + (qVal - pVal) * (2.0 / 3.0 - t) * 6.0;
            return pVal;
        };

        r = (byte)Math.Round(hueToRgb(p, q, h + 1.0 / 3.0) * 255.0);
        g = (byte)Math.Round(hueToRgb(p, q, h) * 255.0);
        b = (byte)Math.Round(hueToRgb(p, q, h - 1.0 / 3.0) * 255.0);
    }

    public static Bitmap Process(Bitmap src, double? targetHue)
    {
        int w = src.Width;
        int h = src.Height;
        double cx = w / 2.0;
        double cy = h / 2.0;
        double maxRadius = 506.0;

        Bitmap dst = new Bitmap(w, h, PixelFormat.Format32bppArgb);

        BitmapData srcData = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        BitmapData dstData = dst.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);

        int bytes = Math.Abs(srcData.Stride) * h;
        byte[] srcRgba = new byte[bytes];
        byte[] dstRgba = new byte[bytes];

        Marshal.Copy(srcData.Scan0, srcRgba, 0, bytes);

        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w; x++)
            {
                int idx = y * srcData.Stride + x * 4;
                byte b = srcRgba[idx];
                byte g = srcRgba[idx + 1];
                byte r = srcRgba[idx + 2];

                double dx = x - cx;
                double dy = y - cy;
                double dist = Math.Sqrt(dx * dx + dy * dy);

                if (dist > maxRadius + 4.0)
                {
                    dstRgba[idx] = 0;
                    dstRgba[idx + 1] = 0;
                    dstRgba[idx + 2] = 0;
                    dstRgba[idx + 3] = 0;
                    continue;
                }

                byte alpha = 255;
                if (dist > maxRadius)
                {
                    alpha = (byte)Math.Max(0, (int)(255 * (1.0 - (dist - maxRadius) / 4.0)));
                }

                if (!targetHue.HasValue)
                {
                    dstRgba[idx] = b;
                    dstRgba[idx + 1] = g;
                    dstRgba[idx + 2] = r;
                    dstRgba[idx + 3] = alpha;
                }
                else
                {
                    double rNorm = r / 255.0;
                    double gNorm = g / 255.0;
                    double bNorm = b / 255.0;

                    double max = Math.Max(rNorm, Math.Max(gNorm, bNorm));
                    double min = Math.Min(rNorm, Math.Min(gNorm, bNorm));
                    double l = (max + min) / 2.0;

                    double s = 0.0;
                    if (max != min)
                    {
                        s = l <= 0.5 ? (max - min) / (max + min) : (max - min) / (2.0 - max - min);
                    }

                    byte outR, outG, outB;
                    HslToRgb(targetHue.Value, s, l, out outR, out outG, out outB);

                    dstRgba[idx] = outB;
                    dstRgba[idx + 1] = outG;
                    dstRgba[idx + 2] = outR;
                    dstRgba[idx + 3] = alpha;
                }
            }
        }

        Marshal.Copy(dstRgba, 0, dstData.Scan0, bytes);
        src.UnlockBits(srcData);
        dst.UnlockBits(dstData);

        return dst;
    }
}
