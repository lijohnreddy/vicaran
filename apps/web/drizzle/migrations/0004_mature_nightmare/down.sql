-- Down migration for: 0004_mature_nightmare
-- Generated: 2026-02-02T16:43:00Z
-- 
-- This file reverses the changes made in 0004_mature_nightmare.sql
-- Review carefully before executing in production
--
-- WARNINGS:
-- - Dropping "timeline_events" table will permanently delete all timeline data
-- - This operation cannot be reversed once executed

-- ==========================================
-- REVERSE INDEX OPERATIONS (LAST FIRST)
-- ==========================================

-- Reverse: CREATE INDEX "timeline_events_event_date_idx"
DROP INDEX IF EXISTS "timeline_events_event_date_idx";

-- Reverse: CREATE INDEX "timeline_events_investigation_id_idx"
DROP INDEX IF EXISTS "timeline_events_investigation_id_idx";

-- ==========================================
-- REVERSE FOREIGN KEY CONSTRAINTS
-- ==========================================

-- Reverse: ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_source_id_sources_id_fk"
ALTER TABLE IF EXISTS "timeline_events" DROP CONSTRAINT IF EXISTS "timeline_events_source_id_sources_id_fk";

-- Reverse: ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_investigation_id_investigations_id_fk"
ALTER TABLE IF EXISTS "timeline_events" DROP CONSTRAINT IF EXISTS "timeline_events_investigation_id_investigations_id_fk";

-- ==========================================
-- REVERSE TABLE OPERATIONS
-- ==========================================

-- Reverse: CREATE TABLE "timeline_events"
-- WARNING: This will permanently delete all timeline events data
DROP TABLE IF EXISTS "timeline_events";
