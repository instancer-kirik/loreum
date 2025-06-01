import React from 'react';
import { Palette } from 'lucide-react';

export const CultureDesigner: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900 bg-opacity-20 mb-4">
          <Palette className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Culture Designer</h2>
        <p className="text-gray-400 mb-6">
          Create fashion, architecture, rituals, cuisine, and art styles tied to climate, social class, and technology levels.
        </p>
        <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Start Designing Culture
        </button>
      </div>
    </div>
  );
};