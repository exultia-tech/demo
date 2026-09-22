"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      openAuthModal("login");
    }
  }, [user, router, openAuthModal]);

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94A3B8" }}>Redirecting to sign in...</p>
    </div>
  );
}
