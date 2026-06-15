-- Fix RLS: allow public read of any audit that has passed the payment stage.
-- 'created' and 'uploaded' remain private (pre-payment).
-- Result page needs to show processing/failed states, not just completed.
DROP POLICY IF EXISTS "public_read_completed_audits" ON audits;

CREATE POLICY "public_read_post_payment_audits"
  ON audits FOR SELECT
  USING (status IN ('payment_pending', 'payment_verified', 'processing', 'completed', 'failed'));
