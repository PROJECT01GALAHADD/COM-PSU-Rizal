import type { Config } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL?.startsWith('postgresql') 
  ? process.env.DATABASE_URL 
  : `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`;

export default {
  schema: "./lib/database/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: databaseUrl,
    ssl: true,
  },
  verbose: true,
  strict: true,
} satisfies Config;
