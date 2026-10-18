import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { DoomThemeProvider } from "@/context/DoomThemeContext";
import CrtScanlineOverlay from "@/components/CrtScanlineOverlay";
import AuthModal from "@/components/auth/AuthModal";
import PaymentModal from "@/components/billing/PaymentModal";
import OperatorPreviewBanner from "@/components/OperatorPreviewBanner";
import AiSupportWidget from "@/components/support/AiSupportWidget";

export const metadata: Metadata = {
  title: "Exultia Technologies | Practical. Transparent. Secure.",
  description: "Software engineering environments, real-time threat intelligence feeds, and security automation built for verifiable integrity and transparency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-doom-palette="cyan" suppressHydrationWarning style={{ colorScheme: 'dark' }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=['cyan','orange','green','magenta'];var r=p[Math.floor(Math.random()*p.length)];document.documentElement.setAttribute('data-doom-palette',r);}catch(e){}})();`,
          }}
        />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <DoomThemeProvider>
          <AuthProvider>
            <Navbar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
            <AuthModal />
            <PaymentModal />
            <OperatorPreviewBanner />
            <AiSupportWidget />
            <CrtScanlineOverlay />
          </AuthProvider>
        </DoomThemeProvider>
      </body>
    </html>
  );
}
