-- Down migration for: 0002_wise_roulette
-- Generated: 2026-02-02T16:40:00Z
-- 
-- This file reverses the changes made in 0002_wise_roulette.sql
-- Review carefully before executing in production
--
-- WARNINGS:
-- - Dropping "sources" table will permanently delete all source data
-- - This will cascade delete to any dependent data
-- - This operation cannot be reversed once executed

-- ==========================================
-- REVERSE CONSTRAINT OPERATIONS (LAST FIRST)
-- ==========================================

-- Reverse: ALTER TABLE "sources" ADD CONSTRAINT "sources_investigation_url_unique"
ALTER TABLE IF EXISTS "sources" DROP CONSTRAINT IF EXISTS "sources_investigation_url_unique";

-- ==========================================
-- REVERSE INDEX OPERATIONS
-- ==========================================

-- Reverse: CREATE INDEX "sources_investigation_id_idx"
DROP INDEX IF EXISTS "sources_investigation_id_idx";

-- ==========================================
-- REVERSE FOREIGN KEY CONSTRAINTS
-- ==========================================

-- Reverse: ALTER TABLE "sources" ADD CONSTRAINT "sources_investigation_id_investigations_id_fk"
ALTER TABLE IF EXISTS "sources" DROP CONSTRAINT IF EXISTS "sources_investigation_id_investigations_id_fk";

-- ==========================================
-- REVERSE TABLE OPERATIONS
-- ==========================================

-- Reverse: CREATE TABLE "sources"
-- WARNING: This will permanently delete all sources data
DROP TABLE IF EXISTS "sources";
