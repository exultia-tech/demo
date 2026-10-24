'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CrucibleRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    router.replace(`/app/eris${search}`);
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: '#060A13', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1rem', color: '#F1F5F9' }}>Redirecting to Eris Lab...</p>
        <p style={{ fontSize: '0.85rem' }}>Crucible has been renamed to Eris (Goddess of Chaos &amp; Strife).</p>
      </div>
    </div>
  );
}
