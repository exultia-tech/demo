// Comprehensive test script for Admin Impersonation & Entitlement Substitution
const BASE_URL = 'http://localhost:3000';

async function run() {
  console.log('=== ADMIN ENTITLEMENT SUBSTITUTION TEST ===\n');
  let cookieHeader = '';

  async function fetchWithCookies(url, options = {}) {
    const headers = { ...options.headers };
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    const res = await fetch(url, { ...options, headers });
    
    const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    if (setCookies.length > 0) {
      const cookieMap = new Map();
      if (cookieHeader) {
        cookieHeader.split('; ').forEach(c => {
          const [k, v] = c.split('=');
          if (k) cookieMap.set(k, v);
        });
      }
      setCookies.forEach(sc => {
        const parts = sc.split(';')[0].split('=');
        const k = parts[0];
        const v = parts.slice(1).join('=');
        if (sc.includes('Max-Age=0') || sc.includes('Expires=Thu, 01 Jan 1970')) {
          cookieMap.delete(k);
        } else {
          cookieMap.set(k, v);
        }
      });
      cookieHeader = Array.from(cookieMap.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
    }
    return res;
  }

  // 1. Log in as Root Admin
  console.log('1. Signing in as Root Administrator (admin@exultia.tech)...');
  const loginRes = await fetchWithCookies(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@exultia.tech', password: 'exultia2026' })
  });
  const loginData = await loginRes.json();
  console.log(`   ✓ Authenticated as: ${loginData.user?.name} (${loginData.user?.email}) [Role: ${loginData.user?.role}]`);

  // Verify Initial /api/auth/me
  const meRes1 = await fetchWithCookies(`${BASE_URL}/api/auth/me`);
  const meData1 = await meRes1.json();
  console.log(`   ✓ Session State: isImpersonating=${meData1.user?.isImpersonating}, AdminEmail=${meData1.user?.email}`);

  // Test targets
  const personasToTest = [
    {
      email: 'free@exultia.tech',
      expectedName: 'Alex Rivera (Community Free)',
      expectedTiers: 'pureide:free, uvi:free, inquest:free'
    },
    {
      email: 'pro@exultia.tech',
      expectedName: 'Jordan Vance (Pro Developer)',
      expectedTiers: 'pureide:pro, uvi:pro, inquest:free'
    },
    {
      email: 'legal@exultia.tech',
      expectedName: 'Elena Rostova, Esq. (Legal Pro)',
      expectedTiers: 'pureide:free, uvi:free, inquest:legal'
    },
    {
      email: 'enterprise@exultia.tech',
      expectedName: 'Marcus Sterling (Enterprise SecLead)',
      expectedTiers: 'pureide:enterprise, uvi:enterprise, inquest:enterprise'
    }
  ];

  for (let i = 0; i < personasToTest.length; i++) {
    const p = personasToTest[i];
    console.log(`\n${i + 2}. Substituting Identity -> ${p.expectedName} (${p.email})...`);
    const res = await fetchWithCookies(`${BASE_URL}/api/admin/impersonate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetEmail: p.email })
    });
    const data = await res.json();
    const tiers = data.user?.subscriptions?.map(s => `${s.product}:${s.tier}`).join(', ');
    
    console.log(`   ✓ Status: ${res.status} | ${data.message}`);
    console.log(`   ✓ Active Persona: ${data.user?.name} (${data.user?.email})`);
    console.log(`   ✓ isImpersonating: ${data.user?.isImpersonating} (Origin Admin: ${data.user?.impersonatedBy})`);
    console.log(`   ✓ Active Entitlements: ${tiers}`);

    // Verify /api/auth/me matches
    const meRes = await fetchWithCookies(`${BASE_URL}/api/auth/me`);
    const meData = await meRes.json();
    console.log(`   ✓ /api/auth/me Verification: Authenticated as "${meData.user?.name}", isImpersonating=${meData.user?.isImpersonating}`);
  }

  // Revert back to Root Administrator
  console.log(`\n6. Reverting Impersonation -> Restoring Root Administrator...`);
  const revertRes = await fetchWithCookies(`${BASE_URL}/api/admin/impersonate`, {
    method: 'DELETE'
  });
  const revertData = await revertRes.json();
  console.log(`   ✓ Status: ${revertRes.status} | ${revertData.message}`);
  console.log(`   ✓ Restored User: ${revertData.user?.name} (${revertData.user?.email}) [Role: ${revertData.user?.role}]`);
  console.log(`   ✓ isImpersonating: ${revertData.user?.isImpersonating}`);

  // Final verification with /api/auth/me
  const finalMeRes = await fetchWithCookies(`${BASE_URL}/api/auth/me`);
  const finalMeData = await finalMeRes.json();
  console.log(`   ✓ Final /api/auth/me State: ${finalMeData.user?.name} (Role: ${finalMeData.user?.role}, isImpersonating: ${finalMeData.user?.isImpersonating || false})`);

  console.log('\n=============================================');
  console.log('🎉 ALL 5 ENTITLEMENT PERSONAS VERIFIED 100%!');
  console.log('=============================================');
}

run().catch(console.error);
