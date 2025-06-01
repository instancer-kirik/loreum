import React, { useState, useEffect } from 'react';
import { GitBranch, Package, Wand2, ScrollText, PlusCircle, Search, Filter, ChevronRight } from 'lucide-react';
import { TechItem, MagicSystem, Enchantment, MagicalItemProperties, TechDomain, Technology } from '../../types';

// Types for the unified designer
type DesignerMode = 'tech' | 'item' | 'magic' | 'enchantment';
type AssetCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
  type?: string; // Optional specific type within the category
  magicSystem?: string; // ID of magic system if relevant
};

interface AssetDesignerProps {
  initialMode?: DesignerMode;
  onSave?: (data: any) => void;
}

export const AssetDesigner: React.FC<AssetDesignerProps> = ({ 
  initialMode = 'tech',
  onSave
}) => {
  // State for the current mode (tech, item, magic, enchantment)
  const [designerMode, setDesignerMode] = useState<DesignerMode>(initialMode);
  
  // Common states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Categories for each mode
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  
  // Current editing asset
  const [currentAsset, setCurrentAsset] = useState<any>(null);
  
  // Load appropriate categories based on mode
  useEffect(() => {
    // Reset selection when changing modes
    setSelectedCategory(null);
    
    // Load the appropriate categories based on the current mode
    switch (designerMode) {
      case 'tech':
        setCategories([
          {
            id: 'quantum',
            name: 'Quantum Technologies',
            description: 'Advanced quantum manipulation and computation systems',
            color: 'from-blue-500 to-purple-500'
          },
          {
            id: 'temporal',
            name: 'Temporal Engineering',
            description: 'Time manipulation and causality preservation devices',
            color: 'from-emerald-500 to-cyan-500'
          },
          {
            id: 'gravitic',
            name: 'Gravitic Systems',
            description: 'Gravity manipulation and spatial warping technologies',
            color: 'from-amber-500 to-red-500'
          }
        ]);
        break;
        
      case 'item':
        setCategories([
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
        ]);
        break;
        
      case 'magic':
        setCategories([
          {
            id: 'arcane',
            name: 'Arcane Magic',
            description: 'Knowledge-based magic drawing on cosmic energies',
            color: 'from-indigo-500 to-purple-500'
          },
          {
            id: 'elemental',
            name: 'Elemental Forces',
            description: 'Magic derived from control of natural elements',
            color: 'from-red-500 to-yellow-500'
          },
          {
            id: 'divine',
            name: 'Divine Channeling',
            description: 'Powers granted by deities or cosmic entities',
            color: 'from-yellow-300 to-white'
          },
          {
            id: 'technomancy',
            name: 'Technomancy',
            description: 'Fusion of magical energies with technological systems',
            color: 'from-cyan-400 to-blue-700'
          }
        ]);
        break;
        
      case 'enchantment':
        setCategories([
          {
            id: 'enhancement',
            name: 'Enhancement Enchantments',
            description: 'Improve existing properties of items',
            color: 'from-green-400 to-emerald-600'
          },
          {
            id: 'transmutation',
            name: 'Transmutation Enchantments',
            description: 'Change the fundamental nature of items',
            color: 'from-amber-400 to-orange-600'
          },
          {
            id: 'conjuration',
            name: 'Conjuration Enchantments',
            description: 'Summon entities or create matter',
            color: 'from-purple-400 to-indigo-600'
          },
          {
            id: 'binding',
            name: 'Binding Enchantments',
            description: 'Contain energies or entities within items',
            color: 'from-rose-400 to-red-600'
          }
        ]);
        break;
    }
  }, [designerMode]);
  
  // Get the appropriate icon based on the current mode
  const getModeIcon = () => {
    switch (designerMode) {
      case 'tech': return <GitBranch className="h-8 w-8 text-blue-400" />;
      case 'item': return <Package className="h-8 w-8 text-blue-400" />;
      case 'magic': return <Wand2 className="h-8 w-8 text-purple-400" />;
      case 'enchantment': return <ScrollText className="h-8 w-8 text-amber-400" />;
    }
  };
  
  // Get the title for the current mode
  const getModeTitle = () => {
    switch (designerMode) {
      case 'tech': return 'Tech Tree Designer';
      case 'item': return 'Item Designer';
      case 'magic': return 'Magic System Designer';
      case 'enchantment': return 'Enchantment Designer';
    }
  };
  
  // Get the sidebar title for the current mode
  const getSidebarTitle = () => {
    switch (designerMode) {
      case 'tech': return 'TECH DOMAINS';
      case 'item': return 'ITEM CATEGORIES';
      case 'magic': return 'MAGIC DISCIPLINES';
      case 'enchantment': return 'ENCHANTMENT TYPES';
    }
  };
  
  // Get the search placeholder for the current mode
  const getSearchPlaceholder = () => {
    switch (designerMode) {
      case 'tech': return 'Search technologies...';
      case 'item': return 'Search items...';
      case 'magic': return 'Search magic systems...';
      case 'enchantment': return 'Search enchantments...';
    }
  };
  
  // Get the create button text for the current mode
  const getCreateButtonText = () => {
    switch (designerMode) {
      case 'tech': return 'Add Technology';
      case 'item': return 'Create New Item';
      case 'magic': return 'Create Magic System';
      case 'enchantment': return 'Create Enchantment';
    }
  };
  
  // Get the empty state message for the current mode
  const getEmptyStateMessage = () => {
    switch (designerMode) {
      case 'tech': return 'Select a Tech Domain';
      case 'item': return 'Select an Item Category';
      case 'magic': return 'Select a Magic Discipline';
      case 'enchantment': return 'Select an Enchantment Type';
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Mode Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 px-4">
        <div className="flex">
          <button
            onClick={() => setDesignerMode('tech')}
            className={`px-4 py-3 font-medium text-sm border-b-2 ${
              designerMode === 'tech'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <GitBranch className="inline-block mr-2 h-4 w-4" />
            Tech Tree
          </button>
          <button
            onClick={() => setDesignerMode('item')}
            className={`px-4 py-3 font-medium text-sm border-b-2 ${
              designerMode === 'item'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Package className="inline-block mr-2 h-4 w-4" />
            Items
          </button>
          <button
            onClick={() => setDesignerMode('magic')}
            className={`px-4 py-3 font-medium text-sm border-b-2 ${
              designerMode === 'magic'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Wand2 className="inline-block mr-2 h-4 w-4" />
            Magic Systems
          </button>
          <button
            onClick={() => setDesignerMode('enchantment')}
            className={`px-4 py-3 font-medium text-sm border-b-2 ${
              designerMode === 'enchantment'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <ScrollText className="inline-block mr-2 h-4 w-4" />
            Enchantments
          </button>
        </div>
      </div>
      
      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Categories Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={getSearchPlaceholder()}
                className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-400">{getSidebarTitle()}</h2>
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
                      ? designerMode === 'magic' || designerMode === 'enchantment'
                        ? 'bg-purple-900 bg-opacity-50 text-purple-300'
                        : 'bg-blue-900 bg-opacity-50 text-blue-300'
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
                <span>Add New {designerMode === 'tech' ? 'Domain' : designerMode === 'item' ? 'Category' : designerMode === 'magic' ? 'Discipline' : 'Type'}</span>
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
                    {getModeIcon()}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{getModeTitle()}</h2>
                  <p className="text-gray-400 mb-6">
                    {designerMode === 'tech' && 'The interactive tech tree visualization will be displayed here, showing dependencies, requirements, and progression paths.'}
                    {designerMode === 'item' && 'The interactive item designer will be displayed here, allowing you to create and modify items with detailed specifications and properties.'}
                    {designerMode === 'magic' && 'The magic system designer will be displayed here, allowing you to define how magic works in your world, its sources, limitations, and interactions.'}
                    {designerMode === 'enchantment' && 'The enchantment designer will be displayed here, allowing you to create magical effects that can be applied to items, creatures, or locations.'}
                  </p>
                  <button 
                    className={`inline-flex items-center px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors ${
                      designerMode === 'magic' || designerMode === 'enchantment' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <PlusCircle size={18} className="mr-2" />
                    {getCreateButtonText()}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900 bg-opacity-20 mb-4">
                  {getModeIcon()}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{getEmptyStateMessage()}</h2>
                <p className="text-gray-400 mb-6">
                  {designerMode === 'tech' && 'Choose a technology domain from the sidebar to view and edit its tech tree.'}
                  {designerMode === 'item' && 'Choose a category from the sidebar to begin creating or modifying items.'}
                  {designerMode === 'magic' && 'Choose a magic discipline from the sidebar to begin defining your magic system.'}
                  {designerMode === 'enchantment' && 'Choose an enchantment type from the sidebar to begin creating magical effects.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};