import React from 'react';
import { BookOpen } from 'lucide-react';

export const NarrativeLayer: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900 bg-opacity-20 mb-4">
          <BookOpen className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Narrative Layer</h2>
        <p className="text-gray-400 mb-6">
          Track the rise and fall of empires, pivotal wars, trade routes, disasters, revolutions, and diplomatic intrigue.
        </p>
        <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Create Narrative Timeline
        </button>
      </div>
    </div>
  );
};