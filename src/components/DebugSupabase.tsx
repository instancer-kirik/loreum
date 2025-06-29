import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { multiverseService } from '../integrations/supabase/database';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
  timestamp?: string;
}

export const DebugSupabase: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: any) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      const timestamp = new Date().toLocaleTimeString();
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.details = details;
        existing.timestamp = timestamp;
        return [...prev];
      } else {
        return [...prev, { name, status, message, details, timestamp }];
      }
    });
  };

  const runTest = async (name: string, testFn: () => Promise<void>) => {
    updateTest(name, 'pending', 'Running...');
    try {
      await testFn();
      updateTest(name, 'success', 'Passed');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      updateTest(name, 'error', errorMsg, error);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Get connection info
    try {
      setConnectionInfo({
        url: supabase.supabaseUrl,
        key: supabase.supabaseKey?.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to get connection info:', err);
    }

    // Test 1: Basic connection
    await runTest('Connection Test', async () => {
      const { data, error, count } = await supabase
        .from('loreum_multiverses')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        throw new Error(`Connection failed: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      }
      updateTest('Connection Test', 'success', `Connected successfully. Row count: ${count}`);
    });

    // Test 2: Table structure
    await runTest('Table Exists', async () => {
      const { data, error } = await supabase
        .from('loreum_multiverses')
        .select('id, name, description, created_at, updated_at')
        .limit(1);
      
      if (error) {
        throw new Error(`Table query failed: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      }
      updateTest('Table Exists', 'success', `Table accessible. Sample data: ${data?.length || 0} rows`);
    });

    // Test 3: Authentication status
    await runTest('Authentication', async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        throw new Error(`Auth check failed: ${error.message}`);
      }
      updateTest('Authentication', 'success', user ? `Signed in as ${user.email}` : 'Anonymous access');
    });

    // Test 4: Row Level Security
    await runTest('RLS Policies', async () => {
      const { data, error } = await supabase
        .from('loreum_multiverses')
        .select('*')
        .limit(5);
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('row-level security')) {
          throw new Error(`RLS blocking access: ${error.message}. Try disabling RLS or adding proper policies.`);
        }
        throw new Error(`Query failed: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      }
      
      updateTest('RLS Policies', 'success', `Query returned ${data?.length || 0} rows`);
    });

    // Test 5: Service Layer Test
    await runTest('Service Layer', async () => {
      try {
        const multiverses = await multiverseService.getAll();
        updateTest('Service Layer', 'success', `Service returned ${multiverses.length} multiverses`);
      } catch (error: any) {
        throw new Error(`Service failed: ${error.message}`);
      }
    });

    // Test 6: Insert capability
    await runTest('Insert Test', async () => {
      const testData = {
        name: `Debug Test ${Date.now()}`,
        description: 'Test multiverse created by debug component'
      };

      const { data, error } = await supabase
        .from('loreum_multiverses')
        .insert(testData)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Insert failed: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      }

      // Clean up
      const { error: deleteError } = await supabase
        .from('loreum_multiverses')
        .delete()
        .eq('id', data.id);
      
      if (deleteError) {
        console.warn('Failed to clean up test record:', deleteError);
      }
      
      updateTest('Insert Test', 'success', 'Insert and delete successful');
    });

    // Test 7: Raw API call
    await runTest('Raw API', async () => {
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/loreum_multiverses?select=count&limit=1`, {
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Raw API failed: ${response.status} ${response.statusText} - ${text}`);
      }

      const data = await response.json();
      updateTest('Raw API', 'success', `API responded with: ${JSON.stringify(data).substring(0, 100)}...`);
    });

    setIsRunning(false);
  };

  // Auto-run tests on mount
  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Supabase Debug Dashboard</h2>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className={`px-4 py-2 rounded-md font-medium ${
              isRunning 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? 'Running Tests...' : 'Re-run Tests'}
          </button>
        </div>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getStatusIcon(test.status)}</span>
                  <h3 className="font-semibold text-gray-800">{test.name}</h3>
                </div>
                <span className={`font-medium ${getStatusColor(test.status)}`}>
                  {test.status.toUpperCase()}
                </span>
              </div>
              
              <p className={`mt-2 ${getStatusColor(test.status)}`}>
                {test.message}
              </p>
              
              {test.timestamp && (
                <p className="text-xs text-gray-500 mt-1">
                  {test.timestamp}
                </p>
              )}

              {test.details && test.status === 'error' && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    Show Error Details
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(test.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Connection Info</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>URL:</strong> {connectionInfo?.url || 'Loading...'}</p>
            <p><strong>Key:</strong> {connectionInfo?.key || 'Loading...'}</p>
            <p><strong>Test Time:</strong> {connectionInfo?.timestamp ? new Date(connectionInfo.timestamp).toLocaleString() : 'Loading...'}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Troubleshooting Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• If "Table Exists" fails, run the SQL schema scripts in Supabase dashboard</li>
            <li>• If "RLS Policies" fails, check Row Level Security settings</li>
            <li>• If "Authentication" shows anonymous, that's normal for public access</li>
            <li>• If "Raw API" fails, check your Supabase project URL and API key</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugSupabase;