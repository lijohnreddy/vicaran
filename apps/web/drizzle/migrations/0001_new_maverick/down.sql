-- Down migration for: 0001_new_maverick
-- Generated: 2026-02-02T16:33:00Z
-- 
-- This file reverses the changes made in 0001_new_maverick.sql
-- Review carefully before executing in production
--
-- WARNINGS:
-- - Dropping "investigations" table will permanently delete all investigation data
-- - Dropping investigation_mode and investigation_status enums will remove type safety
-- - This operation cannot be reversed once executed

-- ==========================================
-- REVERSE INDEX OPERATIONS (LAST FIRST)
-- ==========================================

-- Reverse: CREATE INDEX "investigations_status_idx"
DROP INDEX IF EXISTS "investigations_status_idx";

-- Reverse: CREATE INDEX "investigations_user_id_idx"
DROP INDEX IF EXISTS "investigations_user_id_idx";

-- ==========================================
-- REVERSE FOREIGN KEY CONSTRAINTS
-- ==========================================

-- Reverse: ALTER TABLE "investigations" ADD CONSTRAINT "investigations_user_id_users_id_fk"
ALTER TABLE IF EXISTS "investigations" DROP CONSTRAINT IF EXISTS "investigations_user_id_users_id_fk";

-- ==========================================
-- REVERSE TABLE OPERATIONS
-- ==========================================

-- Reverse: CREATE TABLE "investigations"
-- WARNING: This will permanently delete all investigations and related data
DROP TABLE IF EXISTS "investigations";

-- ==========================================
-- REVERSE ENUM OPERATIONS
-- ==========================================

-- Reverse: CREATE TYPE "investigation_status"
DROP TYPE IF EXISTS "public"."investigation_status";

-- Reverse: CREATE TYPE "investigation_mode"  
DROP TYPE IF EXISTS "public"."investigation_mode";
