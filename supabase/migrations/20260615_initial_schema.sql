-- CYA CV AUDITOR — Initial Schema V1
-- Applied via Supabase MCP on 2026-06-15

-- Utility: auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TABLE: audits
CREATE TABLE audits (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id        TEXT UNIQUE NOT NULL,
  target_role      TEXT NOT NULL,
  experience_level TEXT NOT NULL
    CHECK (experience_level IN ('Fresh Graduate', 'Junior', 'Mid-Level', 'Senior')),
  cv_filename      TEXT,
  cv_storage_path  TEXT,
  cv_text          TEXT,
  status           TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created', 'uploaded', 'payment_pending', 'payment_verified', 'processing', 'completed')),
  result           JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ
);

CREATE INDEX idx_audits_public_id  ON audits (public_id);
CREATE INDEX idx_audits_status     ON audits (status);
CREATE INDEX idx_audits_created_at ON audits (created_at DESC);

CREATE TRIGGER trg_audits_updated_at
  BEFORE UPDATE ON audits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TABLE: payments
CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id            UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  xendit_payment_id   TEXT,
  xendit_external_id  TEXT UNIQUE,
  amount              INTEGER NOT NULL DEFAULT 1000,
  currency            TEXT NOT NULL DEFAULT 'IDR',
  payment_method      TEXT,
  status              TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
  webhook_payload     JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_audit_id           ON payments (audit_id);
CREATE INDEX idx_payments_xendit_external_id ON payments (xendit_external_id);
CREATE INDEX idx_payments_status             ON payments (status);

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE audits   ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_completed_audits"
  ON audits FOR SELECT
  USING (status = 'completed');
