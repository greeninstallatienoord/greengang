/**
 * Hash an admin password with the same PBKDF2 settings as the Worker.
 *
 * Interactive (preferred):
 *   node scripts/hash-password.mjs
 *
 * Non-interactive (avoid if password may leak into shell history):
 *   node scripts/hash-password.mjs "<password>"
 *
 * Prints salt/hash + UPSERT SQL for D1. Does not store plaintext.
 */

import readline from 'node:readline'
import { stdin as input, stdout as output, stderr } from 'node:process'

async function readPasswordHidden(prompt) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input, output: stderr })
    const wasRaw = input.isRaw
    stderr.write(prompt)
    const chars = []

    const onData = (chunk) => {
      const text = chunk.toString('utf8')
      for (const char of text) {
        if (char === '\n' || char === '\r' || char === '\u0004') {
          cleanup()
          stderr.write('\n')
          resolve(chars.join(''))
          return
        }
        if (char === '\u0003') {
          cleanup()
          reject(new Error('Cancelled'))
          return
        }
        if (char === '\u007f' || char === '\b') {
          chars.pop()
          continue
        }
        chars.push(char)
      }
    }

    function cleanup() {
      input.off('data', onData)
      if (input.setRawMode) input.setRawMode(Boolean(wasRaw))
      rl.close()
    }

    if (input.setRawMode) input.setRawMode(true)
    input.on('data', onData)
  })
}

let password = process.argv[2]
if (!password) {
  try {
    password = await readPasswordHidden('Choose admin password (hidden): ')
  } catch {
    stderr.write('\nPassword entry cancelled.\n')
    process.exit(1)
  }
}

if (!password || password.length < 8) {
  console.error('Password must be at least 8 characters.')
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
const email = 'info@greeninstallatienoord.nl'

password = ''

console.log('Generated hash for', email)
console.log('Use this UPSERT on D1 (remote):')
console.log(`
INSERT INTO admins (id, email, password_hash, password_salt, created_at, updated_at)
VALUES ('${id}', '${email}', '${hashHex}', '${saltHex}', '${now}', '${now}')
ON CONFLICT(email) DO UPDATE SET
  password_hash = excluded.password_hash,
  password_salt = excluded.password_salt,
  updated_at = excluded.updated_at;
`.trim())
