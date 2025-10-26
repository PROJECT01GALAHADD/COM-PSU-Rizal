import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let cachedReplitDb: ReturnType<typeof drizzle> | null = null;

export function getReplitDb() {
  if (cachedReplitDb) {
    return cachedReplitDb;
  }

  // Build connection string from Replit PG variables
  const host = process.env.PGHOST;
  const port = process.env.PGPORT || '5432';
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE;
  
  if (!host || !user || !password || !database) {
    throw new Error("Replit database environment variables not found. Make sure PGHOST, PGUSER, PGPASSWORD, and PGDATABASE are set.");
  }
  
  const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
  const client = postgres(connectionString, { max: 10, prepare: true });
  
  cachedReplitDb = drizzle(client, { schema });
  return cachedReplitDb;
}

export { schema as replitSchema };
