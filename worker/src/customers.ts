import type { WorkerEnv } from './env'

export async function findOrCreateCustomer(
  env: WorkerEnv,
  input: { name: string; email: string; phone?: string; address?: string },
): Promise<string> {
  const now = new Date().toISOString()
  const existing = await env.DB.prepare(
    'SELECT id, phone, address FROM customers WHERE lower(email) = lower(?) LIMIT 1',
  )
    .bind(input.email)
    .first<{ id: string; phone: string | null; address: string | null }>()

  if (existing) {
    await env.DB.prepare(
      `UPDATE customers
       SET name = ?, phone = ?, address = ?, updated_at = ?
       WHERE id = ?`,
    )
      .bind(
        input.name,
        input.phone || existing.phone,
        input.address || existing.address,
        now,
        existing.id,
      )
      .run()
    return existing.id
  }

  const id = crypto.randomUUID()
  await env.DB.prepare(
    `INSERT INTO customers (id, name, email, phone, address, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, input.name, input.email, input.phone || null, input.address || null, now, now)
    .run()
  return id
}
