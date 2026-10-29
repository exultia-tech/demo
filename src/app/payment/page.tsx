"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const target = params ? `/checkout?${params}` : "/checkout";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div style={{ minHeight: "80vh", display: "grid", placeItems: "center", color: "#94A3B8" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "1rem", color: "#38BDF8", fontWeight: 700 }}>Connecting to Secure Payment Terminal...</div>
      </div>
    </div>
  );
}

export default function PaymentRedirectPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh" }} />}>
      <PaymentRedirectContent />
    </Suspense>
  );
}
