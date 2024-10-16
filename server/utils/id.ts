import crypto from 'node:crypto';

export function generateRandomId() {
  const bytes = crypto.randomBytes(12);
  return bytes.toString('hex');
}
