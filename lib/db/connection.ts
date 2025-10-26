import fs from "node:fs";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// Creates a Postgres client using DATABASE_URL and optional SSL CA.
// Production-ready: reads SSL CA when SUPABASE_SSL_CERT_PATH is set.
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const caPath = process.env.SUPABASE_SSL_CERT_PATH;
  const ssl = caPath
    ? {
        ca: fs.readFileSync(caPath, "utf8"),
        rejectUnauthorized: true,
      }
    : undefined;

  const client = postgres(url, {
    ssl,
    max: 10,
    prepare: true,
  });

  return drizzle(client);
}
