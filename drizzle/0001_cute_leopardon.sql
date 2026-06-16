ALTER TABLE "email_ai_metadata" ALTER COLUMN "action_items" SET DATA TYPE jsonb USING action_items::jsonb;
ALTER TABLE "email_ai_metadata" ALTER COLUMN "entities" SET DATA TYPE jsonb USING entities::jsonb;
ALTER TABLE "email_ai_metadata" ADD COLUMN "priority_score" integer DEFAULT 50 NOT NULL;