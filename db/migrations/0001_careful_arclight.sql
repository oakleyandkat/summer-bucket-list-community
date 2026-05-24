CREATE TABLE "memory" (
	"account_id" text NOT NULL,
	"idea_key" text NOT NULL,
	"photo" text NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "memory_account_id_idea_key_pk" PRIMARY KEY("account_id","idea_key")
);
--> statement-breakpoint
ALTER TABLE "memory" ADD CONSTRAINT "memory_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;