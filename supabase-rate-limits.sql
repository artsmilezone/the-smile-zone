-- Run this in Supabase SQL Editor before first deploy.
-- Creates the rate_limits table used by lib/rate-limiter.ts.

CREATE TABLE IF NOT EXISTS rate_limits (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash    TEXT        NOT NULL,
  action     TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON rate_limits (ip_hash, action, created_at);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
-- Service role key bypasses RLS; no anon policies needed.

-- Optional: cleanup cron via pg_cron (requires pg_cron extension enabled in Supabase)
-- SELECT cron.schedule(
--   'prune-rate-limits',
--   '0 */6 * * *',
--   'DELETE FROM rate_limits WHERE created_at < NOW() - INTERVAL ''48 hours'''
-- );
