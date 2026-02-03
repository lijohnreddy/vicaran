CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"investigation_id" uuid NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"content_snippet" text,
	"credibility_score" integer,
	"bias_score" text,
	"is_user_provided" boolean DEFAULT false NOT NULL,
	"analyzed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sources_investigation_url_unique" UNIQUE("investigation_id","url")
);
--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_investigation_id_investigations_id_fk" FOREIGN KEY ("investigation_id") REFERENCES "public"."investigations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sources_investigation_id_idx" ON "sources" USING btree ("investigation_id");