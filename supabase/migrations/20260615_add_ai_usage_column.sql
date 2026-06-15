-- Store AI provider usage data per audit for cost & performance monitoring
ALTER TABLE audits ADD COLUMN IF NOT EXISTS ai_usage JSONB;

-- Index for future analytics by model
CREATE INDEX IF NOT EXISTS idx_audits_ai_model
  ON audits ((ai_usage->>'model'))
  WHERE ai_usage IS NOT NULL;
