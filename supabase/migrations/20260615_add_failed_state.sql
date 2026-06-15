-- Add 'failed' status and failure_reason to audits table
ALTER TABLE audits DROP CONSTRAINT IF EXISTS audits_status_check;
ALTER TABLE audits ADD CONSTRAINT audits_status_check
  CHECK (status IN ('created', 'uploaded', 'payment_pending', 'payment_verified', 'processing', 'completed', 'failed'));

ALTER TABLE audits ADD COLUMN IF NOT EXISTS failure_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_audits_failed ON audits (status, created_at DESC)
  WHERE status = 'failed';
