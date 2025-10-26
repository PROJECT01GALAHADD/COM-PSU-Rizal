#!/usr/bin/env node

/**
 * Apply database migrations to Supabase
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
function loadEnv() {
  const envPath = join(__dirname, '..', '.env.local');
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

async function main() {
  loadEnv();
  
  console.log('\n🚀 Applying database migrations to Supabase...\n');

  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('📡 Connecting to Supabase...');
  
  // Use pooler connection for runtime
  const sql = postgres(DATABASE_URL, {
    max: 1,
    onnotice: () => {}, // Suppress notices
  });

  try {
    // Read the migration SQL file
    const migrationPath = join(__dirname, '..', 'drizzle', '0000_uneven_may_parker.sql');
    console.log('📄 Reading migration file...');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Split by statement breakpoint and execute each statement
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await sql.unsafe(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
        } catch (error) {
          // Ignore errors for already existing objects
          if (error.message.includes('already exists') || 
              error.code === '42P07' ||  // duplicate_table
              error.code === '42710') {  // duplicate_object
            console.log(`⏭️  Statement ${i + 1}/${statements.length} skipped (already exists)`);
          } else {
            throw error;
          }
        }
      }
    }

    console.log('\n✅ All migrations applied successfully!');
    console.log('\n📊 Database tables created:');
    
    // List all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });

    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: pnpm dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Create your first account!\n');

  } catch (error) {
    console.error('\n❌ Error applying migrations:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
