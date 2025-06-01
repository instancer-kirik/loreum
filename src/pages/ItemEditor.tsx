import React, { useState } from 'react';
import { Package, PlusCircle, Search, Filter, ChevronRight } from 'lucide-react';
import { TechItem } from '../types';

export const ItemEditor: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'mobility',
      name: 'Mobility Systems',
      description: 'Transportation and movement technologies',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'temporal',
      name: 'Temporal Devices',
      description: 'Time manipulation equipment',
      color: 'from-emerald-500 to-cyan-500'
    },
    {
      id: 'quantum',
      name: 'Quantum Tech',
      description: 'Quantum manipulation devices',
      color: 'from-amber-500 to-red-500'
    }
  ];

  return (
    <div className="h-full flex">
      {/* Categories Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-400">ITEM CATEGORIES</h2>
            <button className="text-gray-400 hover:text-white">
              <Filter size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-900 bg-opacity-50 text-blue-300'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.name}</span>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
                <p className="text-sm text-gray-400 mt-1">{category.description}</p>
              </button>
            ))}
            
            <button className="w-full flex items-center justify-center p-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-colors">
              <PlusCircle size={18} className="mr-2" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {selectedCategory ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h1 className="text-2xl font-bold text-white mb-2">
                {categories.find(c => c.id === selectedCategory)?.name}
              </h1>
              <p className="text-gray-400">
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900 bg-opacity-20 mb-4">
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Item Designer</h2>
                <p className="text-gray-400 mb-6">
                  The interactive item designer will be displayed here, allowing you to create
                  and modify items with detailed specifications and properties.
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusCircle size={18} className="mr-2" />
                  Create New Item
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900 bg-opacity-20 mb-4">
                <Package className="h-8 w-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Select an Item Category</h2>
              <p className="text-gray-400 mb-6">
                Choose a category from the sidebar to begin creating or modifying items.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};