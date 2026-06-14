CREATE TYPE "public"."calendar_chunk_type" AS ENUM('summary', 'details');--> statement-breakpoint
CREATE TABLE "calendar_event_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"account_id" text NOT NULL,
	"chunk_type" "calendar_chunk_type" NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"event_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar_event_metadata" (
	"event_id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"calendar_id" text,
	"i_cal_uid" text,
	"summary" text,
	"description" text,
	"location" text,
	"status" text,
	"event_type" text,
	"start_at" timestamp,
	"end_at" timestamp,
	"time_zone" text,
	"all_day" boolean DEFAULT false NOT NULL,
	"organizer_email" text,
	"organizer_name" text,
	"attendees" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"raw_event" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calendar_event_chunks" ADD CONSTRAINT "calendar_event_chunks_event_id_calendar_event_metadata_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."calendar_event_metadata"("event_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_event_chunks" ADD CONSTRAINT "calendar_event_chunks_account_id_corsair_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."corsair_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_event_metadata" ADD CONSTRAINT "calendar_event_metadata_account_id_corsair_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."corsair_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "calendar_event_chunks_embedding_idx" ON "calendar_event_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "calendar_event_chunks_account_date_idx" ON "calendar_event_chunks" USING btree ("account_id","event_at");--> statement-breakpoint
CREATE INDEX "calendar_event_chunks_type_idx" ON "calendar_event_chunks" USING btree ("account_id","chunk_type");