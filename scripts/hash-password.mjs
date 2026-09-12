/**
 * Hash an admin password with the same PBKDF2 settings as the Worker.
 * Usage: node scripts/hash-password.mjs "your-password"
 * Then insert the printed salt + hash into D1. Do not commit real hashes
 * that belong to a production password if the password is also stored elsewhere.
 */

const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "<password>"')
  process.exit(1)
}

const salt = crypto.getRandomValues(new Uint8Array(16))
const key = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(password),
  'PBKDF2',
  false,
  ['deriveBits'],
)
const bits = await crypto.subtle.deriveBits(
  { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 210_000 },
  key,
  256,
)

function hex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const saltHex = hex(salt)
const hashHex = hex(bits)
const id = crypto.randomUUID()
const now = new Date().toISOString()

console.log('Use this SQL on D1 (replace the email):')
console.log(
  `INSERT INTO admins (id, email, password_hash, password_salt, created_at, updated_at)
VALUES ('${id}', 'info@greeninstallatienoord.nl', '${hashHex}', '${saltHex}', '${now}', '${now}');`,
)
