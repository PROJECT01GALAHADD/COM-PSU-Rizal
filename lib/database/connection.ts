import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let cachedDb: ReturnType<typeof drizzle> | null = null;

function createDatabaseConnection() {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(url, {
    max: 10,
    prepare: true,
  });

  return drizzle(client, { schema });
}

function getDb() {
  if (!cachedDb) {
    cachedDb = createDatabaseConnection();
  }
  return cachedDb;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});

export { schema };