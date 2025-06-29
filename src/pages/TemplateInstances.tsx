import React, { useState, useEffect } from 'react';
import { 
  FaDatabase,
  FaLink,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCode
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { templateInstanceService } from '../integrations/supabase/database';
import { InstanceViewer } from './InstanceViewer';

export const TemplateInstances: React.FC = () => {
  const { navigationContext } = useAppContext();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      setIsCheckingSetup(true);
      // Try to load instances to check if setup is complete
      await templateInstanceService.getAll();
      setIsSetupComplete(true);
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : 'Setup check failed');
      setIsSetupComplete(false);
    } finally {
      setIsCheckingSetup(false);
    }
  };

  if (isCheckingSetup) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-cosmic-light bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaDatabase className="text-glyph-accent animate-spin" size={32} />
          </div>
          <p className="text-glyph-accent">Checking template instancing setup...</p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-cosmic-light border-opacity-20">
          <h1 className="text-3xl font-bold text-glyph-bright font-serif mb-2">
            Template Instances Setup
          </h1>
          <p className="text-glyph-accent">
            The template instancing system needs to be set up in your database.
          </p>
        </div>

        {/* Setup Instructions */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Warning */}
            <div className="p-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-lg flex items-start">
              <FaExclamationTriangle className="text-yellow-400 mr-3 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="text-yellow-200 font-medium mb-1">Database Setup Required</h3>
                <p className="text-yellow-300 text-sm">
                  The template instancing tables haven't been created yet. Follow the steps below to set them up.
                </p>
              </div>
            </div>

            {/* Error Display */}
            {setupError && (
              <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg flex items-start">
                <FaExclamationTriangle className="text-red-400 mr-3 mt-1 flex-shrink-0" size={16} />
                <div>
                  <h3 className="text-red-200 font-medium mb-1">Setup Check Failed</h3>
                  <p className="text-red-300 text-sm">{setupError}</p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="glass-panel border border-cosmic-light border-opacity-30">
              <div className="p-6">
                <h2 className="text-xl font-bold text-glyph-bright font-serif mb-4 flex items-center">
                  <FaDatabase className="mr-3 text-flame-blue" />
                  Setup Instructions
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-flame-blue text-cosmic-deepest rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium text-glyph-bright mb-2">Open your Supabase Dashboard</h3>
                      <p className="text-glyph-accent text-sm">
                        Navigate to your Supabase project dashboard and go to the SQL Editor.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-flame-blue text-cosmic-deepest rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium text-glyph-bright mb-2">Run the Migration SQL</h3>
                      <p className="text-glyph-accent text-sm">
                        Open the file <code className="text-circuit-energy">sql/004_template_instancing_system.sql</code> in your project, 
                        copy its contents, and paste them into your Supabase SQL Editor, then run it.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-flame-blue text-cosmic-deepest rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium text-glyph-bright mb-2">Refresh This Page</h3>
                      <p className="text-glyph-accent text-sm">
                        After running the SQL, refresh this page to start using the template instancing system.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-cosmic-light border-opacity-20">
                  <button
                    onClick={checkSetup}
                    className="btn-glowing flex items-center"
                  >
                    <FaCheckCircle className="mr-2" size={16} />
                    Check Setup Status
                  </button>
                </div>
              </div>
            </div>

            {/* Full Migration SQL File Link */}
            <div className="glass-panel border border-cosmic-light border-opacity-30">
              <div className="p-6">
                <h2 className="text-xl font-bold text-glyph-bright font-serif mb-4 flex items-center">
                  <FaCode className="mr-3 text-circuit-energy" />
                  Complete Migration File
                </h2>
                <p className="text-glyph-accent mb-4">
                  For the full migration including all type-specific tables, use the complete SQL file:
                </p>
                <div className="bg-cosmic-deep p-4 rounded border border-cosmic-light border-opacity-20">
                  <code className="text-circuit-energy">sql/004_template_instancing_system.sql</code>
                </div>
                <p className="text-glyph-accent text-sm mt-2">
                  This file includes the complete migration with all tables for species, technology, item, 
                  magic system, and culture instances, plus validation functions and triggers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If setup is complete, show the instance viewer
  return <InstanceViewer />;
};