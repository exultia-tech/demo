/**
 * Exultia Pre-Launch Validation & Operator Access Control
 * 
 * When PRIVATE_VALIDATION_MODE is active (default: true during validation),
 * all public sign-ins and new user registrations are blocked EXCEPT for
 * authorized administrators and operators.
 */

export const DEFAULT_AUTHORIZED_EMAILS: string[] = [
  'admin@exultia.tech',
  'wstrika2@gmail.com',
  'wstrika@users.noreply.github.com',
];

/**
 * Returns true if the site is in private pre-launch validation mode.
 * Set PRIVATE_VALIDATION_MODE="false" or PUBLIC_LAUNCH="true" when ready for general public release.
 */
export function isValidationModeActive(): boolean {
  if (process.env.PRIVATE_VALIDATION_MODE === 'false' || process.env.PUBLIC_LAUNCH === 'true') {
    return false;
  }
  return true;
}

/**
 * Returns the normalized list of all authorized operator emails.
 */
export function getAuthorizedEmails(): string[] {
  const customList = (process.env.AUTHORIZED_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  const envAdmin = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

  const all = new Set([
    ...DEFAULT_AUTHORIZED_EMAILS.map(e => e.toLowerCase()),
    ...(envAdmin ? [envAdmin] : []),
    ...customList,
  ]);

  return Array.from(all);
}

/**
 * Checks if a given email or role is authorized to access the system during validation mode.
 */
export function isAuthorizedOperator(email: string | null | undefined, role?: string | null): boolean {
  if (role === 'admin') return true;
  if (!email) return false;

  const cleanEmail = email.trim().toLowerCase();
  const authorized = getAuthorizedEmails();

  return authorized.includes(cleanEmail);
}

export const RESTRICTED_ACCESS_MESSAGE =
  'Private Pre-Launch Validation: Registration and sign-in are restricted exclusively to authorized operators during site validation. Please check back at official launch.';
