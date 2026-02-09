import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Lazy DB initialization — defers connection until first use
// This prevents build failures on Vercel when DATABASE_URL isn't set at build time
let _db: PostgresJsDatabase | null = null;

function getDb(): PostgresJsDatabase {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    // Disable prefetch as it is not supported for "Transaction" pool mode
    const client = postgres(process.env.DATABASE_URL, { prepare: false });
    _db = drizzle(client);
  }
  return _db;
}

// Proxy that lazily initializes the DB on first property access
export const db = new Proxy({} as PostgresJsDatabase, {
  get(_target, prop, receiver) {
    const realDb = getDb();
    const value = Reflect.get(realDb, prop, receiver);
    if (typeof value === "function") {
      return value.bind(realDb);
    }
    return value;
  },
});
