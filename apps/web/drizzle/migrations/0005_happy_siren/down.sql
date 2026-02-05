-- Down migration for: 0005_happy_siren
-- Generated: 2026-02-04
-- 
-- This file reverses the changes made in 0005_happy_siren.sql
-- Review carefully before executing in production
--
-- WARNINGS:
-- - Enum values cannot be easily removed in PostgreSQL
-- - Consider if data using 'partial' status exists before running

-- Drop the new columns first
ALTER TABLE "investigations" DROP COLUMN IF EXISTS "started_at";
ALTER TABLE "investigations" DROP COLUMN IF EXISTS "partial_reason";

-- Note: PostgreSQL does not support DROP VALUE from enums easily
-- You would need to:
-- 1. Create a new enum without 'partial'
-- 2. Update all rows using 'partial' to another status (e.g., 'failed')
-- 3. Alter the column to use new enum
-- 4. Drop old enum
-- 
-- For simplicity, we leave the 'partial' value in the enum as it doesn't harm anything
-- If you need to fully remove it, run:
-- UPDATE investigations SET status = 'failed' WHERE status = 'partial';
-- Then recreate enum without 'partial'
