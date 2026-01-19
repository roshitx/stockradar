CREATE TABLE "api_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"endpoint" text NOT NULL,
	"data" jsonb NOT NULL,
	"cached_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "api_cache_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watchlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"symbol" text NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	CONSTRAINT "watchlists_user_id_symbol_unique" UNIQUE("user_id","symbol")
);
--> statement-breakpoint
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;