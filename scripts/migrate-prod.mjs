import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}
if (url.startsWith("pglite://")) {
  console.log("DATABASE_URL is a PGlite URL — skipping prod migrate.");
  process.exit(0);
}

// Drizzle's migrator only needs one connection
const client = postgres(url, { max: 1 });
const db = drizzle(client);
await migrate(db, { migrationsFolder: "./db/migrations" });
await client.end();
console.log("✓ migrations applied to prod");
