import React, { useState, useEffect } from 'react';
import { Package, PlusCircle, Search, Filter, ChevronRight, Database, Link } from 'lucide-react';
import { ipsumariumService, templateInstanceService } from '../integrations/supabase/database';
import { IpsumTemplate, TemplateInstanceWithTemplate } from '../types';

export const ItemEditor: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewSource, setViewSource] = useState<'all' | 'templates' | 'instances'>('all');
  
  // Data state
  const [templates, setTemplates] = useState<IpsumTemplate[]>([]);
  const [instances, setInstances] = useState<TemplateInstanceWithTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const [templatesData, instancesData] = await Promise.all([
        ipsumariumService.getAll().then(data => data.filter(t => t.type === 'item')).catch(() => []),
        templateInstanceService.getAll().then(data => data.filter(i => i.template.type === 'item')).catch(() => [])
      ]);
      setTemplates(templatesData);
      setInstances(instancesData);
    } catch (err) {
      console.error('Failed to load items:', err);
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from loaded data
  const allCategories = [
    ...new Set([
      ...templates.flatMap(t => t.tags),
      ...instances.flatMap(i => [...i.template.tags, ...i.tags])
    ])
  ].filter(Boolean);

  const categories = [
    {
      id: 'all',
      name: 'All Items',
      description: 'All item templates and instances',
      count: templates.length + instances.length
    },
    ...allCategories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      description: `Items tagged with ${category}`,
      count: templates.filter(t => t.tags.includes(category)).length + 
             instances.filter(i => i.template.tags.includes(category) || i.tags.includes(category)).length
    }))
  ];

  // Filter items based on category and source
  const filteredItems = [
    ...(viewSource === 'instances' ? [] : templates.map(t => ({ ...t, source: 'template' as const }))),
    ...(viewSource === 'templates' ? [] : instances.map(i => ({ ...i, source: 'instance' as const })))
  ].filter(item => {
    if (selectedCategory === 'all' || !selectedCategory) return true;
    if (item.source === 'template') {
      return item.tags.includes(selectedCategory);
    } else {
      return item.template.tags.includes(selectedCategory) || item.tags.includes(selectedCategory);
    }
  }).filter(item => {
    if (!searchQuery) return true;
    const name = item.source === 'template' ? item.name : item.instanceName;
    const description = item.source === 'template' ? item.description : (item.instanceDescription || item.template.description);
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           description.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
            
          {/* Source Filter */}
          <div className="mb-4">
            <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Source</h3>
            <div className="space-y-1">
              <button
                onClick={() => setViewSource('all')}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  viewSource === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                All Sources
                <span className="ml-auto text-xs">{templates.length + instances.length}</span>
              </button>
              <button
                onClick={() => setViewSource('templates')}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  viewSource === 'templates' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Database size={14} className="mr-2" />
                Templates
                <span className="ml-auto text-xs">{templates.length}</span>
              </button>
              <button
                onClick={() => setViewSource('instances')}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  viewSource === 'instances' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Link size={14} className="mr-2" />
                Instances
                <span className="ml-auto text-xs">{instances.length}</span>
              </button>
            </div>
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
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{category.count}</span>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-1">{category.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Items'}
                </h1>
                <p className="text-gray-400">
                  {selectedCategory ? categories.find(c => c.id === selectedCategory)?.description : 'Manage your item templates and instances'}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {filteredItems.length} items
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-400">Loading items...</div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-lg text-red-400 mb-2">Error loading items</div>
                <div className="text-sm text-gray-400 mb-4">{error}</div>
                <button 
                  onClick={loadItems}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900 bg-opacity-20 mb-4">
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Items Found</h2>
                <p className="text-gray-400 mb-6">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or category filters'
                    : 'Create your first item template to get started'
                  }
                </p>
                <button 
                  onClick={() => window.location.href = '#ipsumarium'}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Create Item Template
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                  <div 
                    key={`${item.source}-${item.id}`}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="h-2 bg-green-500" />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-white">
                          {item.source === 'template' ? item.name : item.instanceName}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs px-2 py-1 bg-green-900 bg-opacity-30 text-green-400 rounded-full">
                            item
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                            item.source === 'template' 
                              ? 'bg-gray-900 bg-opacity-30 text-gray-400' 
                              : 'bg-blue-900 bg-opacity-30 text-blue-400'
                          }`}>
                            {item.source === 'template' ? <Database size={12} /> : <Link size={12} />}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        {item.source === 'template' ? item.description : (item.instanceDescription || item.template.description)}
                      </p>
                      {item.source === 'instance' && (
                        <div className="text-xs text-gray-500 mb-2">
                          Based on: {item.template.name}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {(item.source === 'template' ? item.tags : [...item.template.tags, ...item.tags])
                          .slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};