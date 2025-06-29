import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Database, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseTestProps {
  className?: string;
}

interface TableCheck {
  name: string;
  exists: boolean;
  count?: number;
  error?: string;
}

const DatabaseTest: React.FC<DatabaseTestProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [tables, setTables] = useState<TableCheck[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const expectedTables = [
    'loreum_multiverses',
    'loreum_universes',
    'loreum_timelines',
    'loreum_worlds',
    'loreum_civilizations',
    'loreum_regions',
    'loreum_characters',
    'loreum_species',
    'loreum_governments',
    'loreum_tech_trees',
    'loreum_lore_nodes',
    'loreum_star_systems',
    'loreum_magic_systems',
    'loreum_enchantments',
    'loreum_character_instances',
    'loreum_items',
    'loreum_powers',
    'loreum_magic_abilities',
    'loreum_magic_progression_rules',
    'loreum_character_abilities',
    'loreum_item_enchantments',
    'loreum_ipsumarium_templates'
  ];

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('unknown');
    
    try {
      // Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('loreum_multiverses')
        .select('count', { count: 'exact', head: true });
      
      if (connectionError) {
        console.error('Connection error:', connectionError);
        setConnectionStatus('error');
        setTables([]);
        return;
      }
      
      setConnectionStatus('connected');
      
      // Test each table
      const tableResults: TableCheck[] = [];
      
      for (const tableName of expectedTables) {
        try {
          const { data, error, count } = await supabase
            .from(tableName as any)
            .select('*', { count: 'exact', head: true });
          
          if (error) {
            tableResults.push({
              name: tableName,
              exists: false,
              error: error.message
            });
          } else {
            tableResults.push({
              name: tableName,
              exists: true,
              count: count || 0
            });
          }
        } catch (err) {
          tableResults.push({
            name: tableName,
            exists: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      }
      
      setTables(tableResults);
      setLastChecked(new Date());
      
    } catch (error) {
      console.error('Database test failed:', error);
      setConnectionStatus('error');
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Connection Failed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const existingTables = tables.filter(t => t.exists);
  const missingTables = tables.filter(t => !t.exists);
  const totalRecords = existingTables.reduce((sum, table) => sum + (table.count || 0), 0);

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Connection Test
          </h1>
          <p className="text-muted-foreground mt-2">
            Test your Supabase connection and verify table creation
          </p>
        </div>
        <Button 
          onClick={testConnection} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Testing...' : 'Test Again'}
        </Button>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(connectionStatus)}
            Connection Status
          </CardTitle>
          <CardDescription>
            Current status of your Supabase database connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(connectionStatus)}`}>
                {getStatusText(connectionStatus)}
              </div>
              {lastChecked && (
                <p className="text-sm text-muted-foreground mt-2">
                  Last checked: {lastChecked.toLocaleString()}
                </p>
              )}
            </div>
            {connectionStatus === 'connected' && (
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{existingTables.length}</div>
                <div className="text-sm text-muted-foreground">Tables Found</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table Status */}
      {tables.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Existing Tables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Existing Tables ({existingTables.length})
              </CardTitle>
              <CardDescription>
                Tables that exist and are accessible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {existingTables.length === 0 ? (
                <p className="text-muted-foreground italic">No tables found</p>
              ) : (
                existingTables.map((table) => (
                  <div key={table.name} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                    <span className="font-mono text-sm">{table.name}</span>
                    <Badge variant="secondary">
                      {table.count} records
                    </Badge>
                  </div>
                ))
              )}
              {existingTables.length > 0 && (
                <div className="mt-4 p-3 bg-green-100 rounded border border-green-200">
                  <div className="font-semibold text-green-800">
                    Total Records: {totalRecords}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Missing Tables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Missing Tables ({missingTables.length})
              </CardTitle>
              <CardDescription>
                Tables that need to be created
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {missingTables.length === 0 ? (
                <p className="text-green-600 font-medium">All tables exist! ✅</p>
              ) : (
                missingTables.map((table) => (
                  <div key={table.name} className="p-2 bg-red-50 rounded border border-red-200">
                    <div className="font-mono text-sm font-medium text-red-800">
                      {table.name}
                    </div>
                    {table.error && (
                      <div className="text-xs text-red-600 mt-1">
                        Error: {table.error}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions */}
      {missingTables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Setup Instructions
            </CardTitle>
            <CardDescription>
              Steps to fix missing tables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Open Supabase SQL Editor</h4>
              <p className="text-sm text-muted-foreground">
                Go to your Supabase project dashboard → SQL Editor
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">2. Run Schema Creation Scripts</h4>
              <p className="text-sm text-muted-foreground">
                Execute these files in order:
              </p>
              <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                <li>• <code className="bg-gray-100 px-1 rounded">loreum/sql/001_create_loreum_schema.sql</code></li>
                <li>• <code className="bg-gray-100 px-1 rounded">loreum/sql/002_fixes_for_supabase.sql</code></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">3. Test Connection Again</h4>
              <p className="text-sm text-muted-foreground">
                Click "Test Again" button after running the SQL scripts
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {connectionStatus === 'connected' && missingTables.length === 0 && existingTables.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-800">Database Setup Complete!</h3>
                <p className="text-green-700">
                  All {existingTables.length} tables are created and accessible. Your Loreum database is ready to use.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseTest;