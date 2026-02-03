CREATE TYPE "public"."claim_status" AS ENUM('verified', 'unverified', 'contradicted');--> statement-breakpoint
CREATE TYPE "public"."evidence_type" AS ENUM('supporting', 'contradicting');--> statement-breakpoint
CREATE TABLE "claim_sources" (
	"claim_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	CONSTRAINT "claim_sources_claim_id_source_id_pk" PRIMARY KEY("claim_id","source_id")
);
--> statement-breakpoint
CREATE TABLE "claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investigation_id" uuid NOT NULL,
	"claim_text" text NOT NULL,
	"status" "claim_status" DEFAULT 'unverified' NOT NULL,
	"evidence_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fact_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claim_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"evidence_type" "evidence_type" NOT NULL,
	"evidence_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "claim_sources" ADD CONSTRAINT "claim_sources_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_sources" ADD CONSTRAINT "claim_sources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_investigation_id_investigations_id_fk" FOREIGN KEY ("investigation_id") REFERENCES "public"."investigations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fact_checks" ADD CONSTRAINT "fact_checks_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fact_checks" ADD CONSTRAINT "fact_checks_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "claims_investigation_id_idx" ON "claims" USING btree ("investigation_id");--> statement-breakpoint
CREATE INDEX "fact_checks_claim_id_idx" ON "fact_checks" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "fact_checks_source_id_idx" ON "fact_checks" USING btree ("source_id");