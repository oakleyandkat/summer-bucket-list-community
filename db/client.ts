import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import postgres from "postgres";
import path from "node:path";
import * as schema from "./schema";

type Schema = typeof schema;

// In dev, Next.js re-evaluates this module on every request. Without a global
// pin, each evaluation opens a new PGlite instance against the same .db file,
// and only the first one keeps a valid WASM handle — subsequent queries crash.
const globalForDb = globalThis as unknown as {
  __sbl_pglite?: PGlite;
  __sbl_db?: PgliteDatabase<Schema> | ReturnType<typeof drizzlePg<Schema>>;
};

function buildDb() {
  const url = process.env.DATABASE_URL ?? "pglite://./local.db";
  if (url.startsWith("pglite://")) {
    // PGlite wraps the path in `new URL(p)` internally; a relative path with
    // no base throws. Resolve to absolute before handing it over.
    const absPath = path.resolve(process.cwd(), url.replace("pglite://", ""));
    const client = globalForDb.__sbl_pglite ?? new PGlite(absPath);
    if (!globalForDb.__sbl_pglite) globalForDb.__sbl_pglite = client;
    return drizzlePglite(client, { schema });
  }
  return drizzlePg(postgres(url), { schema });
}

export const db = globalForDb.__sbl_db ?? buildDb();
if (process.env.NODE_ENV !== "production") globalForDb.__sbl_db = db;

export type DB = typeof db;
