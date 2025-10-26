#!/usr/bin/env node

/**
 * Supabase Database Connection Setup
 * 
 * This script helps you configure your DATABASE_URL for Supabase.
 * Run: node scripts/update-database-url.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔧 PSU Rizal - Supabase Database Setup');
  console.log('=====================================\n');

  const envPath = join(process.cwd(), '.env.local');
  
  try {
    // Read current .env.local
    let envContent = readFileSync(envPath, 'utf8');
    
    console.log('📝 Please enter your Supabase database password:');
    console.log('   (You can find this in your Supabase dashboard)');
    console.log('   Dashboard: https://supabase.com/dashboard/project/xiarltiaucakojvvtvmi');
    console.log('   → Settings → Database → Connection String\n');
    
    const password = await question('Database password: ');
    
    if (!password || password.trim() === '') {
      console.log('\n❌ Password cannot be empty!');
      process.exit(1);
    }
    
    // Update DATABASE_URL
    const newDatabaseUrl = `postgresql://postgres.xiarltiaucakojvvtvmi:${password.trim()}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
    
    // Replace the DATABASE_URL line
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=${newDatabaseUrl}`
    );
    
    // Write back to file
    writeFileSync(envPath, envContent, 'utf8');
    
    console.log('\n✅ DATABASE_URL has been updated!\n');
    console.log('📋 Next steps:');
    console.log('   1. Run: pnpm init-db');
    console.log('      (This will create all database tables)');
    console.log('');
    console.log('   2. Run: pnpm dev');
    console.log('      (This will start the development server)');
    console.log('');
    console.log('   3. Visit: http://localhost:3000');
    console.log('      (Create your first account!)\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\nPlease ensure:');
    console.log('   - .env.local file exists in the project root');
    console.log('   - You have write permissions');
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
