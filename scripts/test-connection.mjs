#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
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

async function testConnection(connectionString, description) {
  console.log(`\n🔍 Testing: ${description}`);
  console.log(`   Connection: ${connectionString.replace(/:([^:@]+)@/, ':***@')}\n`);
  
  const sql = postgres(connectionString, {
    max: 1,
    connect_timeout: 10,
  });

  try {
    const result = await sql`SELECT version()`;
    console.log(`✅ SUCCESS!`);
    console.log(`   PostgreSQL: ${result[0].version.split(' ')[1]}`);
    await sql.end();
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    try { await sql.end(); } catch (e) {}
    return false;
  }
}

async function main() {
  loadEnv();
  
  console.log('\n🧪 Testing Supabase Direct Connection\n');
  console.log('=' .repeat(60));

  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env.local');
    process.exit(1);
  }

  console.log(`\nUsing DATABASE_URL from .env.local\n`);
  
  const success = await testConnection(DATABASE_URL, 'Direct Connection');
  
  if (success) {
    console.log('\n🎯 Connection successful!');
    console.log('\n📋 Next step: Apply migrations');
    console.log('   Run: node scripts/apply-migrations.mjs\n');
  } else {
    console.log('\n❌ Connection failed');
    console.log('\n💡 Possible issues:');
    console.log('   1. Database password might be incorrect');
    console.log('   2. Database might be paused (check Supabase dashboard)');
    console.log('   3. IPv6 connectivity issue (Supabase uses IPv6 for direct connections)');
    console.log('   4. Firewall or network restrictions\n');
    console.log('📋 Alternative: Apply migrations via Supabase SQL Editor');
    console.log('   See: MANUAL-DATABASE-SETUP.md\n');
  }

  console.log('='.repeat(60) + '\n');
}

main();
