ALTER TABLE "account" ADD COLUMN "coins" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "personal_check" ADD COLUMN "coins_awarded" integer DEFAULT 0 NOT NULL;