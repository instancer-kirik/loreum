import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file if it exists
try {
  const envContent = readFileSync(join(__dirname, '.env'), 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=');
        process.env[key] = value;
      }
    }
  });
} catch (err) {
  console.log('No .env file found or error reading it, using environment variables');
}

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runMigration(migrationFile) {
  try {
    console.log(`🚀 Running migration: ${migrationFile}`);
    
    // Read the SQL file
    const sqlPath = join(__dirname, 'sql', migrationFile);
    const sqlContent = readFileSync(sqlPath, 'utf8');
    
    // Split the SQL content into individual statements
    // This is a simple approach - for complex migrations you might need a more sophisticated parser
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements or comments
      if (!statement || statement.startsWith('--')) {
        continue;
      }
      
      try {
        console.log(`  Executing statement ${i + 1}/${statements.length}...`);
        
        // Use RPC to execute raw SQL
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        });
        
        if (error) {
          // If RPC doesn't work, try direct execution via REST API
          const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql_query: statement + ';' })
          });
          
          if (!response.ok) {
            // As a fallback, try to create tables individually using schema operations
            // This is limited but might work for basic CREATE TABLE statements
            console.warn(`    ⚠️  Direct SQL execution failed, statement might be complex: ${error.message}`);
            console.log(`    Statement: ${statement.substring(0, 100)}...`);
            errorCount++;
            continue;
          }
        }
        
        successCount++;
        console.log(`    ✅ Success`);
        
      } catch (err) {
        console.error(`    ❌ Error executing statement:`, err.message);
        console.log(`    Statement: ${statement.substring(0, 100)}...`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Migration Results:`);
    console.log(`  ✅ Successful: ${successCount}`);
    console.log(`  ❌ Failed: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log(`🎉 Migration completed successfully!`);
    } else {
      console.log(`⚠️  Migration completed with ${errorCount} errors. You may need to run these statements manually in your Supabase SQL editor.`);
    }
    
  } catch (err) {
    console.error('❌ Migration failed:', err);
    console.error('\n💡 Alternative approach:');
    console.error('1. Open your Supabase dashboard');
    console.error('2. Go to SQL Editor');
    console.error(`3. Copy and paste the content of sql/${migrationFile}`);
    console.error('4. Run the SQL manually');
    process.exit(1);
  }
}

async function listMigrations() {
  try {
    const { readdirSync } = await import('fs');
    const sqlDir = join(__dirname, 'sql');
    const files = readdirSync(sqlDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log('📁 Available migrations:');
    files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
    
    return files;
  } catch (err) {
    console.error('❌ Error listing migrations:', err);
    return [];
  }
}

async function testConnection() {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    const { data, error } = await supabase
      .from('loreum_multiverses')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Connection test error:', err.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🗂️  Loreum Database Migration Runner\n');
  
  // Test connection first
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('\n💡 Make sure your .env file has the correct Supabase credentials');
    process.exit(1);
  }
  
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('\n📋 Usage:');
    console.log('  node run-migration.js <migration-file>');
    console.log('  node run-migration.js --list');
    console.log('  node run-migration.js --all');
    console.log('\nExamples:');
    console.log('  node run-migration.js 004_template_instancing_system.sql');
    console.log('  node run-migration.js --list');
    console.log('  node run-migration.js --all');
    
    await listMigrations();
    return;
  }
  
  if (args[0] === '--list') {
    await listMigrations();
    return;
  }
  
  if (args[0] === '--all') {
    const migrations = await listMigrations();
    console.log(`\n🚀 Running all ${migrations.length} migrations...\n`);
    
    for (const migration of migrations) {
      await runMigration(migration);
      console.log(''); // Add spacing between migrations
    }
    
    console.log('🎉 All migrations completed!');
    return;
  }
  
  // Run specific migration
  const migrationFile = args[0];
  await runMigration(migrationFile);
}

main().catch(err => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});