import React, { useState, useEffect } from 'react';
import { AssetDesigner } from '../components/AssetDesigner';
import { Box, Book, LayoutGrid, List, Database, Link } from 'lucide-react';
import { ipsumariumService, templateInstanceService } from '../integrations/supabase/database';
import { IpsumTemplate, TemplateInstanceWithTemplate } from '../types';

type ViewMode = 'grid' | 'list';
type AssetType = 'all' | 'tech' | 'item' | 'magic' | 'species' | 'culture';
type AssetSource = 'all' | 'templates' | 'instances';

export const AssetManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [assetType, setAssetType] = useState<AssetType>('all');
  const [assetSource, setAssetSource] = useState<AssetSource>('all');
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [designerInitialMode, setDesignerInitialMode] = useState<'tech' | 'item'>('tech');
  
  // Data state
  const [templates, setTemplates] = useState<IpsumTemplate[]>([]);
  const [instances, setInstances] = useState<TemplateInstanceWithTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const [templatesData, instancesData] = await Promise.all([
        ipsumariumService.getAll().catch(() => []),
        templateInstanceService.getAll().catch(() => [])
      ]);
      setTemplates(templatesData);
      setInstances(instancesData);
    } catch (err) {
      console.error('Failed to load assets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  // Combined assets for display
  const allAssets = [
    ...templates.map(template => ({
      id: template.id,
      name: template.name,
      type: template.type,
      description: template.description,
      source: 'template' as const,
      data: template
    })),
    ...instances.map(instance => ({
      id: instance.id,
      name: instance.instanceName,
      type: instance.template.type,
      description: instance.instanceDescription || instance.template.description,
      source: 'instance' as const,
      data: instance
    }))
  ];

  // Filter assets based on selected type and source
  const filteredAssets = allAssets.filter(asset => {
    const matchesType = assetType === 'all' || asset.type === assetType;
    const matchesSource = assetSource === 'all' || asset.source === assetSource;
    return matchesType && matchesSource;
  });

  const openDesigner = (mode: 'tech' | 'item') => {
    setDesignerInitialMode(mode);
    setIsDesignerOpen(true);
  };

  // Get the appropriate color for each asset type
  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'tech': return 'bg-blue-500';
      case 'item': return 'bg-green-500';
      case 'magic': return 'bg-purple-500';
      case 'species': return 'bg-cyan-500';
      case 'culture': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSourceIcon = (source: string) => {
    return source === 'template' ? <Database size={16} /> : <Link size={16} />;
  };

  return (
    <div className="h-full flex flex-col">
      {isDesignerOpen ? (
        <>
          <div className="p-2 bg-gray-900 border-b border-gray-800 flex justify-between">
            <h2 className="text-lg font-medium text-white">Asset Designer</h2>
            <button 
              onClick={() => setIsDesignerOpen(false)}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-md"
            >
              Back to Assets
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <AssetDesigner initialMode={designerInitialMode} />
          </div>
        </>
      ) : (
        <>
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Asset Manager</h1>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  <LayoutGrid size={18} className="text-gray-300" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  <List size={18} className="text-gray-300" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Asset Filters */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
            <div className="flex flex-wrap gap-4">
              {/* Type Filter */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setAssetType('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    assetType === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setAssetType('tech')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    assetType === 'tech' ? 'bg-blue-900 bg-opacity-30 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Box className="inline-block mr-2 h-4 w-4" />
                  Technologies
                </button>
                <button
                  onClick={() => setAssetType('item')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    assetType === 'item' ? 'bg-green-900 bg-opacity-30 text-green-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Box className="inline-block mr-2 h-4 w-4" />
                  Items
                </button>
                <button
                  onClick={() => setAssetType('magic')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    assetType === 'magic' ? 'bg-purple-900 bg-opacity-30 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Box className="inline-block mr-2 h-4 w-4" />
                  Magic
                </button>
                <button
                  onClick={() => setAssetType('species')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    assetType === 'species' ? 'bg-cyan-900 bg-opacity-30 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Box className="inline-block mr-2 h-4 w-4" />
                  Species
                </button>
                <button
                  onClick={() => setAssetType('culture')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    assetType === 'culture' ? 'bg-yellow-900 bg-opacity-30 text-yellow-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Box className="inline-block mr-2 h-4 w-4" />
                  Cultures
                </button>
              </div>
              
              {/* Source Filter */}
              <div className="flex space-x-2 border-l border-gray-600 pl-4">
                <button
                  onClick={() => setAssetSource('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    assetSource === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  All Sources
                </button>
                <button
                  onClick={() => setAssetSource('templates')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    assetSource === 'templates' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Database className="inline-block mr-2 h-4 w-4" />
                  Templates
                </button>
                <button
                  onClick={() => setAssetSource('instances')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    assetSource === 'instances' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Link className="inline-block mr-2 h-4 w-4" />
                  Instances
                </button>
              </div>
            </div>
          </div>
          
          {/* Create Buttons */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
            <div className="flex space-x-3">
              <button
                onClick={() => openDesigner('tech')}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                New Technology
              </button>
              <button
                onClick={() => openDesigner('item')}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
              >
                New Item
              </button>
            </div>
          </div>
          
          {/* Asset Display */}
          <div className="flex-1 overflow-auto p-6 bg-gray-900">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-400">Loading assets...</div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-lg text-red-400 mb-2">Error loading assets</div>
                <div className="text-sm text-gray-400 mb-4">{error}</div>
                <button 
                  onClick={loadAssets}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-lg text-gray-400 mb-2">No assets found</div>
                <div className="text-sm text-gray-500">
                  {assetType !== 'all' || assetSource !== 'all' 
                    ? 'Try adjusting your filters or create new assets'
                    : 'Create your first template or instance'
                  }
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAssets.map(asset => (
                  <div 
                    key={`${asset.source}-${asset.id}`}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <div className={`h-2 ${getAssetTypeColor(asset.type)}`} />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-white">{asset.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            asset.type === 'tech' ? 'bg-blue-900 bg-opacity-30 text-blue-400' :
                            asset.type === 'item' ? 'bg-green-900 bg-opacity-30 text-green-400' :
                            asset.type === 'magic' ? 'bg-purple-900 bg-opacity-30 text-purple-400' :
                            asset.type === 'species' ? 'bg-cyan-900 bg-opacity-30 text-cyan-400' :
                            asset.type === 'culture' ? 'bg-yellow-900 bg-opacity-30 text-yellow-400' :
                            'bg-gray-900 bg-opacity-30 text-gray-400'
                          }`}>
                            {asset.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                            asset.source === 'template' 
                              ? 'bg-gray-900 bg-opacity-30 text-gray-400' 
                              : 'bg-blue-900 bg-opacity-30 text-blue-400'
                          }`}>
                            {getSourceIcon(asset.source)}
                            <span className="ml-1">{asset.source}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{asset.description}</p>
                      {asset.source === 'instance' && asset.data && 'template' in asset.data && (
                        <div className="mt-2 text-xs text-gray-500">
                          Based on: {asset.data.template.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Source</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredAssets.map(asset => (
                      <tr key={`${asset.source}-${asset.id}`} className="hover:bg-gray-750 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{asset.name}</div>
                          {asset.source === 'instance' && asset.data && 'template' in asset.data && (
                            <div className="text-xs text-gray-500">
                              Based on: {asset.data.template.name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            asset.type === 'tech' ? 'bg-blue-900 bg-opacity-30 text-blue-400' :
                            asset.type === 'item' ? 'bg-green-900 bg-opacity-30 text-green-400' :
                            asset.type === 'magic' ? 'bg-purple-900 bg-opacity-30 text-purple-400' :
                            asset.type === 'species' ? 'bg-cyan-900 bg-opacity-30 text-cyan-400' :
                            asset.type === 'culture' ? 'bg-yellow-900 bg-opacity-30 text-yellow-400' :
                            'bg-gray-900 bg-opacity-30 text-gray-400'
                          }`}>
                            {asset.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center w-fit ${
                            asset.source === 'template' 
                              ? 'bg-gray-900 bg-opacity-30 text-gray-400' 
                              : 'bg-blue-900 bg-opacity-30 text-blue-400'
                          }`}>
                            {getSourceIcon(asset.source)}
                            <span className="ml-1">{asset.source}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-400">{asset.description}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};