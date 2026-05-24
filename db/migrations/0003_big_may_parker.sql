CREATE TABLE "account_pack" (
	"account_id" text NOT NULL,
	"pack_slug" text NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "account_pack_account_id_pack_slug_pk" PRIMARY KEY("account_id","pack_slug")
);
--> statement-breakpoint
ALTER TABLE "account_pack" ADD CONSTRAINT "account_pack_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;