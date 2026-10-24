"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SubscribedProduct {
  product: string;
  tier: string;
  status: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isImpersonating?: boolean;
  impersonatedBy?: string | null;
  subscriptions: SubscribedProduct[];
}

export type ProductId = "pureide" | "uvi" | "axiom" | "praxis" | "pureos" | "kinetic" | "argent" | "eris" | "valkyrie";

export interface PaymentModalOptions {
  product: ProductId | string;
  tier: "free" | "pro" | "enterprise" | string;
  price: number;
  billingCycle: "monthly" | "annual";
  planName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Impersonation
  isImpersonating: boolean;
  impersonatedBy: string | null;
  impersonate: (email: string) => Promise<{ success: boolean; error?: string }>;
  revertImpersonation: () => Promise<{ success: boolean; error?: string }>;

  // Modals
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  
  isPaymentModalOpen: boolean;
  paymentOptions: PaymentModalOptions | null;
  openPaymentModal: (options: PaymentModalOptions) => void;
  closePaymentModal: () => void;
  
  // Helpers
  getUserTier: (product: ProductId | string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<PaymentModalOptions | null>(null);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to check auth state:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get("auth");
      if (authParam === "restricted" || authParam === "error") {
        setIsAuthModalOpen(true);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to sign in" };
      }
      setUser(data.user);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to create account" };
      }
      setUser(data.user);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  const impersonate = async (email: string) => {
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to impersonate user" };
      }
      if (data.user) {
        setUser(data.user);
      } else {
        await refreshUser();
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };

  const revertImpersonation = async () => {
    try {
      const res = await fetch("/api/admin/impersonate", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to restore administrator session" };
      }
      if (data.user) {
        setUser(data.user);
      } else {
        await refreshUser();
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openPaymentModal = (options: PaymentModalOptions) => {
    if (!user) {
      openAuthModal("register");
      return;
    }
    setPaymentOptions(options);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentOptions(null);
  };

  const getUserTier = (product: ProductId | string): string => {
    if (!user) return "free";
    // Check if user has an active overarching platform subscription
    const platformSub = user.subscriptions?.find(
      s => (s.product === "platform" || s.product === "multipass") && s.status === "active"
    );
    const specificSub = user.subscriptions?.find(s => s.product === product && s.status === "active");

    const platformTier = platformSub?.tier?.toLowerCase();
    const specificTier = specificSub?.tier?.toLowerCase();

    if (platformTier === "enterprise" || specificTier === "enterprise") {
      return "enterprise";
    }
    if (platformTier === "pro" || specificTier === "pro" || specificTier === "legal") {
      return specificTier === "enterprise" ? "enterprise" : "pro";
    }
    return specificTier || "free";
  };

  const isImpersonating = !!user?.isImpersonating;
  const impersonatedBy = user?.impersonatedBy || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isImpersonating,
        impersonatedBy,
        impersonate,
        revertImpersonation,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isPaymentModalOpen,
        paymentOptions,
        openPaymentModal,
        closePaymentModal,
        getUserTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
