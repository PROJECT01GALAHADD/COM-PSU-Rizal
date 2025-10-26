import postgres from "postgres";

async function testConnection() {
  console.log("Testing Replit PostgreSQL connection...");
  
  // Build connection string from Replit PG variables
  const host = process.env.PGHOST;
  const port = process.env.PGPORT || '5432';
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE;
  
  if (!host || !user || !password || !database) {
    console.error("Missing Replit database credentials!");
    console.log("Available vars:", {
      PGHOST: !!host,
      PGUSER: !!user,
      PGPASSWORD: !!password,
      PGDATABASE: !!database
    });
    process.exit(1);
  }
  
  const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
  console.log(`Connecting to: postgres://${user}:***@${host}:${port}/${database}`);
  
  try {
    const sql = postgres(connectionString, { max: 1 });
    const result = await sql`SELECT NOW() as current_time, version()`;
    console.log("✓ Connection successful!");
    console.log("Current time:", result[0].current_time);
    console.log("PostgreSQL version:", result[0].version.split(' ').slice(0, 2).join(' '));
    await sql.end();
    
    console.log("\nReplit DATABASE_URL should be:");
    console.log(connectionString);
    
    return connectionString;
  } catch (error) {
    console.error("✗ Connection failed:", error);
    throw error;
  }
}

testConnection()
  .then((connStr) => {
    console.log("\n✓ Test passed! Replit database is accessible.");
  })
  .catch((error) => {
    console.error("\n✗ Test failed!");
    process.exit(1);
  });
