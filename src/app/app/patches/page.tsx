'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatchesLegacyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/praxis');
  }, [router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
      <div style={{ width: '24px', height: '24px', border: '2px solid #F59E0B', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div>Kinetic has been consolidated into Praxis. Redirecting to Praxis...</div>
    </div>
  );
}
