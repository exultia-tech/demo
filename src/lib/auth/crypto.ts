import crypto from 'crypto';

/**
 * Secure PBKDF2 Password Hashing (Edge & Serverless Compatible)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

const HMAC_SECRET = process.env.TURSO_AUTH_TOKEN || process.env.PAYPAL_CLIENT_SECRET || 'exultia-internal-hmac-secret-2026';

export function signPayload(data: string): string {
  const hmac = crypto.createHmac('sha256', HMAC_SECRET).update(data).digest('hex');
  return `${data}.${hmac}`;
}

export function verifySignedPayload(signedData: string): string | null {
  if (!signedData || !signedData.includes('.')) return null;
  const parts = signedData.split('.');
  if (parts.length !== 2) return null;
  const [data, signature] = parts;
  try {
    const expectedHmac = crypto.createHmac('sha256', HMAC_SECRET).update(data).digest('hex');
    if (signature.length !== expectedHmac.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
