import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import PaymentModal from "@/components/billing/PaymentModal";

export const metadata: Metadata = {
  title: "Exultia | Workstation Security, Threat Intelligence & Open Records",
  description: "Exultia builds tools for engineering teams and researchers: secure IDE packaging (PureIDE), global vulnerability feeds (UVI), and open-records request management (Inquest).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <AuthModal />
          <PaymentModal />
        </AuthProvider>
      </body>
    </html>
  );
}
