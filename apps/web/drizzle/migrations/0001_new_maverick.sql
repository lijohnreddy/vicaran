CREATE TYPE "public"."investigation_mode" AS ENUM('quick', 'detailed');--> statement-breakpoint
CREATE TYPE "public"."investigation_status" AS ENUM('pending', 'active', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "investigations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" text NOT NULL,
	"title" text NOT NULL,
	"brief" text NOT NULL,
	"mode" "investigation_mode" NOT NULL,
	"status" "investigation_status" DEFAULT 'pending' NOT NULL,
	"summary" text,
	"overall_bias_score" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "investigations" ADD CONSTRAINT "investigations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "investigations_user_id_idx" ON "investigations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "investigations_status_idx" ON "investigations" USING btree ("status");