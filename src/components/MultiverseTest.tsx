import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MultiverseTestProps {
  className?: string;
}

interface TestResult {
  test: string;
  success: boolean;
  data?: any;
  error?: string;
}

const MultiverseTest: React.FC<MultiverseTestProps> = ({ className }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    const testResults: TestResult[] = [];

    // Test 1: Basic Supabase connection
    try {
      const { data, error } = await supabase
        .from('loreum_multiverses')
        .select('count')
        .single();
      
      testResults.push({
        test: 'Basic Connection',
        success: !error,
        data: data,
        error: error?.message
      });
    } catch (err) {
      testResults.push({
        test: 'Basic Connection',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }

    // Test 2: Select all multiverses
    try {
      const { data, error } = await supabase
        .from('loreum_multiverses')
        .select('*');
      
      testResults.push({
        test: 'Select All Multiverses',
        success: !error,
        data: data,
        error: error?.message
      });
    } catch (err) {
      testResults.push({
        test: 'Select All Multiverses',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }

    // Test 3: Test auth state
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      testResults.push({
        test: 'Auth State',
        success: !error && !!user,
        data: user ? { email: user.email, id: user.id } : null,
        error: error?.message
      });
    } catch (err) {
      testResults.push({
        test: 'Auth State',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }

    // Test 4: Test with raw fetch
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      
      const response = await fetch('https://lxohxewitissdhgzhjtj.supabase.co/rest/v1/loreum_multiverses?select=*', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4b2h4ZXdpdGlzc2RoZ3poanRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjgxNDIsImV4cCI6MjA1ODk0NDE0Mn0.M_pbKwpvfVvR_KfpLllVJRaZySPSTEbWQy84EUqSdqs'
        }
      });
      
      const data = await response.json();
      
      testResults.push({
        test: 'Raw Fetch API',
        success: response.ok,
        data: data,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      });
    } catch (err) {
      testResults.push({
        test: 'Raw Fetch API',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }

    // Test 5: Insert test data
    try {
      const { data, error } = await supabase
        .from('loreum_multiverses')
        .insert({
          name: 'Test Multiverse ' + Date.now(),
          description: 'Test multiverse created by debug component'
        })
        .select()
        .single();
      
      testResults.push({
        test: 'Insert Test Data',
        success: !error,
        data: data,
        error: error?.message
      });
    } catch (err) {
      testResults.push({
        test: 'Insert Test Data',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }

    setResults(testResults);
    setIsLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Multiverse Debug Test
          </h1>
          <p className="text-muted-foreground mt-2">
            Testing multiverse loading and database connectivity
          </p>
        </div>
        <Button 
          onClick={runTests} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Testing...' : 'Run Tests'}
        </Button>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={index} className={result.success ? 'border-green-200' : 'border-red-200'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                {result.test}
              </CardTitle>
              <CardDescription>
                {result.success ? 'Passed' : 'Failed'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    <strong>Error:</strong> {result.error}
                  </AlertDescription>
                </Alert>
              )}
              
              {result.data && (
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="text-sm font-medium text-gray-700 mb-2">Data:</div>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No test results yet. Click "Run Tests" to start.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiverseTest;