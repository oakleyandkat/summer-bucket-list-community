import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

async function main() {
  const url = process.env.DATABASE_URL ?? "pglite://./local.db";
  if (!url.startsWith("pglite://")) {
    console.error(
      "migrate-local is for PGlite only. Set DATABASE_URL to a pglite://... value, " +
        "or use `drizzle-kit migrate` for Postgres."
    );
    process.exit(1);
  }

  const path = url.replace("pglite://", "");
  const client = new PGlite(path);
  const db = drizzle(client);

  await migrate(db, { migrationsFolder: "./db/migrations" });
  await client.close();
  console.log("✓ migrations applied to", path);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
