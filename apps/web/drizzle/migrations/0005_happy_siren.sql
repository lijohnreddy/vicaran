ALTER TYPE "public"."investigation_status" ADD VALUE 'partial' BEFORE 'failed';--> statement-breakpoint
ALTER TABLE "investigations" ADD COLUMN "partial_reason" text;--> statement-breakpoint
ALTER TABLE "investigations" ADD COLUMN "started_at" timestamp with time zone;