'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArgentLegacyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/uvi?category=Vendor+Security+Disclosures');
  }, [router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
      <div style={{ width: '24px', height: '24px', border: '2px solid #A855F7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div>Argent vendor errata has been absorbed into Vantage. Redirecting to Vantage...</div>
    </div>
  );
}
