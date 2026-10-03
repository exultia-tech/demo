import { client } from '../src/lib/db';
import { hashPassword, verifyPassword } from '../src/lib/auth/crypto';

const ADMIN_EMAIL = 'admin@exultia.tech';
const ADMIN_NAME = 'Root System Administrator';
const ADMIN_PASSPHRASE = 'Exultia-SecOps#2026!k9P$vB7q';

async function main() {
  console.log('>>> Starting Production Account Cleanup & Admin Setup...');

  // 1. Find all demo / preview accounts
  const demoEmails = [
    'developer@exultia.tech',
    'invited@exultia.tech',
    'free@exultia.tech',
    'pro@exultia.tech',
    'legal@exultia.tech',
    'enterprise@exultia.tech',
    'demo-free',
    'demo-paid@exultia.com',
    'google.account@exultia.tech',
    'admin@exultia.tech'
  ];

  console.log('>>> Purging existing demo and preview accounts from database...');
  for (const email of demoEmails) {
    const userRes = await client.execute({
      sql: `SELECT id FROM users WHERE email = ?`,
      args: [email]
    });

    for (const row of userRes.rows) {
      const userId = row.id as string;
      await client.execute({ sql: `DELETE FROM sessions WHERE user_id = ?`, args: [userId] });
      await client.execute({ sql: `DELETE FROM subscriptions WHERE user_id = ?`, args: [userId] });
      await client.execute({ sql: `DELETE FROM api_tokens WHERE user_id = ?`, args: [userId] });
      await client.execute({ sql: `DELETE FROM pureide_workstations WHERE user_id = ?`, args: [userId] });
      await client.execute({ sql: `DELETE FROM oauth_accounts WHERE user_id = ?`, args: [userId] }).catch(() => {});
      await client.execute({ sql: `DELETE FROM github_workflows WHERE user_id = ?`, args: [userId] }).catch(() => {});
      await client.execute({ sql: `DELETE FROM users WHERE id = ?`, args: [userId] });
      console.log(`    [PURGED] User ${email} (${userId}) and associated records.`);
    }
  }

  // 2. Provision Official Root Administrator
  console.log('>>> Creating Official Root Administrator Account...');
  const now = Math.floor(Date.now() / 1000);
  const adminId = 'usr_admin_root_prod';
  const passwordHash = hashPassword(ADMIN_PASSPHRASE);

  await client.execute({
    sql: `INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, 'admin', ?, ?)`,
    args: [adminId, ADMIN_EMAIL, ADMIN_NAME, passwordHash, now, now]
  });
  console.log(`    [CREATED] Root Administrator: ${ADMIN_EMAIL} (${adminId})`);

  // 3. Provision Enterprise Subscriptions across all 6 Exultia products
  const products = ['pureide', 'uvi', 'inquest', 'axiom', 'fixlist', 'pureos'];
  for (const prod of products) {
    const subId = `sub_${prod}_admin_prod`;
    await client.execute({
      sql: `INSERT INTO subscriptions (id, user_id, product, tier, status, created_at)
            VALUES (?, ?, ?, 'enterprise', 'active', ?)`,
      args: [subId, adminId, prod, now]
    });
    console.log(`    [ENTITLEMENT] Product: ${prod.toUpperCase()} -> ENTERPRISE (Active)`);
  }

  // 4. Verify password verification works correctly
  const verifyRes = await client.execute({
    sql: `SELECT password_hash FROM users WHERE id = ?`,
    args: [adminId]
  });
  const storedHash = verifyRes.rows[0].password_hash as string;
  const isMatch = verifyPassword(ADMIN_PASSPHRASE, storedHash);
  console.log(`>>> Verification check: ${isMatch ? 'PASSED (Ready for login)' : 'FAILED'}`);

  console.log('\n======================================================');
  console.log('OFFICIAL PRODUCTION ADMIN CREDENTIALS');
  console.log('======================================================');
  console.log(`Portal URL:  https://exultia.tech (or http://localhost:3000)`);
  console.log(`Email/Login: ${ADMIN_EMAIL}`);
  console.log(`Passphrase:  ${ADMIN_PASSPHRASE}`);
  console.log(`Role:        admin (Universal Enterprise Privileges)`);
  console.log('======================================================\n');

  process.exit(0);
}

main().catch(err => {
  console.error('Failed to configure admin:', err);
  process.exit(1);
});
