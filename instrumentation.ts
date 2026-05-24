// Runs once when the Next.js server boots. Used here to apply DB migrations
// against the production Postgres on first start, so we don't have to remember
// to do it manually after each deploy.

export async function register() {
  // Only run in the Node.js runtime (not edge / browser).
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[instrumentation] DATABASE_URL not set — skipping migration.");
    return;
  }
  if (url.startsWith("pglite://")) {
    // PGlite is dev-only; local migrations are handled by `npm run db:migrate`.
    return;
  }

  try {
    const postgres = (await import("postgres")).default;
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const { migrate } = await import("drizzle-orm/postgres-js/migrator");

    const client = postgres(url, { max: 1 });
    const db = drizzle(client);
    await migrate(db, { migrationsFolder: "./db/migrations" });
    await client.end();
    console.log("[instrumentation] ✓ migrations applied on startup");
  } catch (err) {
    // Don't crash the whole server if migrations fail — log loudly and let
    // request-time errors surface the real issue.
    console.error("[instrumentation] Migration failed on startup:", err);
  }
}
