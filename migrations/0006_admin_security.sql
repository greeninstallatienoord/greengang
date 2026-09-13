-- Admin security hardening: durable login throttling, audit events, session idle tracking.
-- Do not DROP tables. Apply with wrangler d1 migrations apply.

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  key TEXT PRIMARY KEY,
  fail_count INTEGER NOT NULL DEFAULT 0,
  window_started_at TEXT NOT NULL,
  locked_until TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS security_events (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  ip_hash TEXT,
  admin_id TEXT,
  detail TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_security_events_created ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_event ON security_events(event);

-- Idle tracking for authenticated sessions (absolute expiry remains on expires_at).
ALTER TABLE sessions ADD COLUMN last_seen_at TEXT;

UPDATE sessions
SET last_seen_at = created_at
WHERE last_seen_at IS NULL;
