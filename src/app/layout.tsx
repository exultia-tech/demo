import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { DoomThemeProvider } from "@/context/DoomThemeContext";
import CrtScanlineOverlay from "@/components/CrtScanlineOverlay";
import AuthModal from "@/components/auth/AuthModal";
import PaymentModal from "@/components/billing/PaymentModal";
import AiSupportWidget from "@/components/support/AiSupportWidget";

export const metadata: Metadata = {
  title: "Exultia Technologies | Autonomous & Accessible Self-Healing Linux",
  description: "Autonomous threat remediation, real-time vulnerability intelligence feeds, and continuous self-healing for Linux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-doom-palette="cyan" suppressHydrationWarning style={{ colorScheme: 'dark' }}>
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
            <AiSupportWidget />
            <CrtScanlineOverlay />
          </AuthProvider>
        </DoomThemeProvider>
      </body>
    </html>
  );
}
