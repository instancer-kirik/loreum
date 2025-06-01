import React, { useState } from 'react';
import { AssetDesigner } from '../components/AssetDesigner';
import { Box, Book, LayoutGrid, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type AssetType = 'all' | 'tech' | 'item' | 'magic' | 'enchantment';

export const AssetManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [assetType, setAssetType] = useState<AssetType>('all');
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [designerInitialMode, setDesignerInitialMode] = useState<'tech' | 'item' | 'magic' | 'enchantment'>('tech');

  // Mock assets for demonstration
  const mockAssets = [
    { id: 'tech1', name: 'Quantum Computing', type: 'tech', description: 'Advanced computing technology' },
    { id: 'tech2', name: 'Graviton Manipulation', type: 'tech', description: 'Control of gravity fields' },
    { id: 'item1', name: 'Plasma Rifle', type: 'item', description: 'Energy-based projectile weapon' },
    { id: 'item2', name: 'Neural Interface', type: 'item', description: 'Direct brain-computer connection' },
    { id: 'magic1', name: 'Arcane Manifestation', type: 'magic', description: 'Fundamental magical energy manipulation' },
    { id: 'magic2', name: 'Elemental Binding', type: 'magic', description: 'Control over natural elements' },
    { id: 'enchant1', name: 'Quantum Stabilization', type: 'enchantment', description: 'Maintains quantum coherence' },
    { id: 'enchant2', name: 'Elemental Attunement', type: 'enchantment', description: 'Enhances elemental affinity' },
  ];

  // Filter assets based on selected type
  const filteredAssets = assetType === 'all' 
    ? mockAssets 
    : mockAssets.filter(asset => asset.type === assetType);

  const openDesigner = (mode: 'tech' | 'item' | 'magic' | 'enchantment') => {
    setDesignerInitialMode(mode);
    setIsDesignerOpen(true);
  };

  // Get the appropriate color for each asset type
  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'tech': return 'bg-blue-500';
      case 'item': return 'bg-green-500';
      case 'magic': return 'bg-purple-500';
      case 'enchantment': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
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
          
          {/* Asset Type Filter */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
            <div className="flex space-x-4">
              <button
                onClick={() => setAssetType('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  assetType === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                All Assets
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
                <Book className="inline-block mr-2 h-4 w-4" />
                Magic Systems
              </button>
              <button
                onClick={() => setAssetType('enchantment')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  assetType === 'enchantment' ? 'bg-amber-900 bg-opacity-30 text-amber-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Book className="inline-block mr-2 h-4 w-4" />
                Enchantments
              </button>
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
              <button
                onClick={() => openDesigner('magic')}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
              >
                New Magic System
              </button>
              <button
                onClick={() => openDesigner('enchantment')}
                className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700"
              >
                New Enchantment
              </button>
            </div>
          </div>
          
          {/* Asset Display */}
          <div className="flex-1 overflow-auto p-6 bg-gray-900">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAssets.map(asset => (
                  <div 
                    key={asset.id}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <div className={`h-2 ${getAssetTypeColor(asset.type)}`} />
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-medium text-white">{asset.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          asset.type === 'tech' ? 'bg-blue-900 bg-opacity-30 text-blue-400' :
                          asset.type === 'item' ? 'bg-green-900 bg-opacity-30 text-green-400' :
                          asset.type === 'magic' ? 'bg-purple-900 bg-opacity-30 text-purple-400' :
                          'bg-amber-900 bg-opacity-30 text-amber-400'
                        }`}>
                          {asset.type}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">{asset.description}</p>
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredAssets.map(asset => (
                      <tr key={asset.id} className="hover:bg-gray-750 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{asset.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            asset.type === 'tech' ? 'bg-blue-900 bg-opacity-30 text-blue-400' :
                            asset.type === 'item' ? 'bg-green-900 bg-opacity-30 text-green-400' :
                            asset.type === 'magic' ? 'bg-purple-900 bg-opacity-30 text-purple-400' :
                            'bg-amber-900 bg-opacity-30 text-amber-400'
                          }`}>
                            {asset.type}
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