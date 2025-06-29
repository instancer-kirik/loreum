import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://lxohxewitissdhgzhjtj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4b2h4ZXdpdGlzc2RoZ3poanRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjgxNDIsImV4cCI6MjA1ODk0NDE0Mn0.M_pbKwpvfVvR_KfpLllVJRaZySPSTEbWQy84EUqSdqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

console.log('Starting Supabase connection test...');
console.log('Supabase URL:', SUPABASE_URL);
console.log('API Key (first 20 chars):', SUPABASE_PUBLISHABLE_KEY.substring(0, 20) + '...');

// Test 1: Basic connection test
async function testConnection() {
  try {
    console.log('\n=== Test 1: Basic Connection ===');
    const { data, error } = await supabase.from('loreum_multiverses').select('count', { count: 'exact' });
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    } else {
      console.log('Connection successful! Row count:', data);
      return true;
    }
  } catch (err) {
    console.error('Connection test exception:', err);
    return false;
  }
}

// Test 2: List all tables
async function testTableExists() {
  try {
    console.log('\n=== Test 2: Check if loreum_multiverses table exists ===');
    const { data, error } = await supabase
      .from('loreum_multiverses')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Table test failed:', error);
      console.error('Error details:', {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message
      });
      return false;
    } else {
      console.log('Table exists! Sample data:', data);
      return true;
    }
  } catch (err) {
    console.error('Table test exception:', err);
    return false;
  }
}

// Test 3: Test authentication
async function testAuth() {
  try {
    console.log('\n=== Test 3: Authentication Status ===');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth test failed:', error);
    } else {
      console.log('Auth status:', user ? 'Signed in' : 'Anonymous', user?.email || 'No email');
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session status:', session ? 'Active session' : 'No session');
    
  } catch (err) {
    console.error('Auth test exception:', err);
  }
}

// Test 4: Raw API call test
async function testRawAPI() {
  try {
    console.log('\n=== Test 4: Raw API Call ===');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/loreum_multiverses?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Raw API Response status:', response.status);
    console.log('Raw API Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Raw API Response body:', text);
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log('Parsed data:', data);
      } catch (parseErr) {
        console.error('Failed to parse JSON:', parseErr);
      }
    }
  } catch (err) {
    console.error('Raw API test exception:', err);
  }
}

// Test 5: Check RLS policies
async function testRLS() {
  try {
    console.log('\n=== Test 5: Row Level Security Check ===');
    
    // Try to insert a test record
    const { data: insertData, error: insertError } = await supabase
      .from('loreum_multiverses')
      .insert({
        name: 'Debug Test Multiverse',
        description: 'Test multiverse created by debug script'
      })
      .select();
    
    if (insertError) {
      console.error('Insert test failed:', insertError);
    } else {
      console.log('Insert successful:', insertData);
      
      // Clean up - delete the test record
      if (insertData && insertData.length > 0) {
        const { error: deleteError } = await supabase
          .from('loreum_multiverses')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.error('Failed to clean up test record:', deleteError);
        } else {
          console.log('Test record cleaned up successfully');
        }
      }
    }
  } catch (err) {
    console.error('RLS test exception:', err);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive Supabase debug tests...\n');
  
  const connectionOk = await testConnection();
  const tableOk = await testTableExists();
  await testAuth();
  await testRawAPI();
  await testRLS();
  
  console.log('\n=== Summary ===');
  console.log('Connection test:', connectionOk ? '✅ PASS' : '❌ FAIL');
  console.log('Table test:', tableOk ? '✅ PASS' : '❌ FAIL');
  
  if (!connectionOk || !tableOk) {
    console.log('\n🔥 Issues detected! Check the error messages above.');
  } else {
    console.log('\n✅ All basic tests passed! The issue might be in your React app.');
  }
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  window.debugSupabase = {
    runAllTests,
    testConnection,
    testTableExists,
    testAuth,
    testRawAPI,
    testRLS,
    supabase
  };
  
  console.log('Debug functions added to window.debugSupabase');
  console.log('Run window.debugSupabase.runAllTests() to start debugging');
} else {
  // Node.js environment
  runAllTests();
}