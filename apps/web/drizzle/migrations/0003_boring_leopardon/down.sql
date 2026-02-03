-- Down migration for: 0003_boring_leopardon
-- Generated: 2026-02-02T16:41:00Z
-- 
-- This file reverses the changes made in 0003_boring_leopardon.sql
-- Review carefully before executing in production
--
-- WARNINGS:
-- - Dropping "claims", "claim_sources", and "fact_checks" tables will permanently delete all claim and fact-check data
-- - Dropping claim_status and evidence_type enums will remove type safety
-- - This operation cannot be reversed once executed

-- ==========================================
-- REVERSE INDEX OPERATIONS (LAST FIRST)
-- ==========================================

-- Reverse: CREATE INDEX "fact_checks_source_id_idx"
DROP INDEX IF EXISTS "fact_checks_source_id_idx";

-- Reverse: CREATE INDEX "fact_checks_claim_id_idx"
DROP INDEX IF EXISTS "fact_checks_claim_id_idx";

-- Reverse: CREATE INDEX "claims_investigation_id_idx"
DROP INDEX IF EXISTS "claims_investigation_id_idx";

-- ==========================================
-- REVERSE FOREIGN KEY CONSTRAINTS
-- ==========================================

-- Reverse: ALTER TABLE "fact_checks" ADD CONSTRAINT "fact_checks_source_id_sources_id_fk"
ALTER TABLE IF EXISTS "fact_checks" DROP CONSTRAINT IF EXISTS "fact_checks_source_id_sources_id_fk";

-- Reverse: ALTER TABLE "fact_checks" ADD CONSTRAINT "fact_checks_claim_id_claims_id_fk"
ALTER TABLE IF EXISTS "fact_checks" DROP CONSTRAINT IF EXISTS "fact_checks_claim_id_claims_id_fk";

-- Reverse: ALTER TABLE "claims" ADD CONSTRAINT "claims_investigation_id_investigations_id_fk"
ALTER TABLE IF EXISTS "claims" DROP CONSTRAINT IF EXISTS "claims_investigation_id_investigations_id_fk";

-- Reverse: ALTER TABLE "claim_sources" ADD CONSTRAINT "claim_sources_source_id_sources_id_fk"
ALTER TABLE IF EXISTS "claim_sources" DROP CONSTRAINT IF EXISTS "claim_sources_source_id_sources_id_fk";

-- Reverse: ALTER TABLE "claim_sources" ADD CONSTRAINT "claim_sources_claim_id_claims_id_fk"
ALTER TABLE IF EXISTS "claim_sources" DROP CONSTRAINT IF EXISTS "claim_sources_claim_id_claims_id_fk";

-- ==========================================
-- REVERSE TABLE OPERATIONS
-- ==========================================

-- Reverse: CREATE TABLE "fact_checks"
DROP TABLE IF EXISTS "fact_checks";

-- Reverse: CREATE TABLE "claims"
DROP TABLE IF EXISTS "claims";

-- Reverse: CREATE TABLE "claim_sources"
DROP TABLE IF EXISTS "claim_sources";

-- ==========================================
-- REVERSE ENUM OPERATIONS
-- ==========================================

-- Reverse: CREATE TYPE "evidence_type"
DROP TYPE IF EXISTS "public"."evidence_type";

-- Reverse: CREATE TYPE "claim_status"
DROP TYPE IF EXISTS "public"."claim_status";
