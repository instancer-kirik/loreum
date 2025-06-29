import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  PlusCircle, 
  Search, 
  Filter, 
  ChevronRight, 
  Settings, 
  Layers, 
  Sun, 
  Moon, 
  CloudCog,
  Camera,
  Orbit,
  ChevronDown,
  X,
  Database,
  Link
} from 'lucide-react';
import { ipsumariumService, templateInstanceService } from '../integrations/supabase/database';
import { IpsumTemplate, TemplateInstanceWithTemplate } from '../types';

interface StructureData {
  id: string;
  name: string;
  description: string;
  type: string;
  diameter: number;
  habitableArea: number;
  gravity: number;
  atmosphere: string;
  technology: string[];
  population: number;
  energyOutput: number;
  materials: string[];
  constructionTime: number;
  maintenanceCost: number;
  stability: number;
  environmentalImpact: number;
  imageUrl?: string;
}

export const PlanetaryStructuresEnhanced: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'form' | '3d' | 'specs'>('form');
  const [viewSource, setViewSource] = useState<'all' | 'templates' | 'instances'>('all');
  const [newStructure, setNewStructure] = useState<StructureData | null>(null);
  const [showNewStructureForm, setShowNewStructureForm] = useState(false);
  const [structures, setStructures] = useState<StructureData[]>([]);
  
  // Template data
  const [structureTemplates, setStructureTemplates] = useState<IpsumTemplate[]>([]);
  const [structureInstances, setStructureInstances] = useState<TemplateInstanceWithTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    {
      id: 'ringworlds',
      name: 'Ringworlds',
      description: 'Massive ring-shaped habitats encircling stars',
      color: 'from-blue-500 to-purple-500',
      icon: <Orbit size={20} />,
      baseStats: {
        diameter: 3000000, // 3 million km - large enough to encircle a star
        habitableArea: 30000000000, // 30 billion square km
        gravity: 1, // Earth-like
        population: 1000000000000, // 1 trillion
        energyOutput: 10000000000000, // 10 trillion GW
        constructionTime: 1000, // years
        stability: 90,
        environmentalImpact: 30
      }
    },
    {
      id: 'dyson_spheres',
      name: 'Dyson Spheres',
      description: 'Star-encompassing energy collection structures',
      color: 'from-amber-500 to-red-500',
      icon: <Sun size={20} />,
      baseStats: {
        diameter: 300000000, // 300 million km - enclosing a star
        habitableArea: 100000000, // smaller living area
        gravity: 0, // zero gravity
        population: 1000000, // 1 million
        energyOutput: 100000000000000, // 100 trillion GW
        constructionTime: 5000, // years
        stability: 75,
        environmentalImpact: 10
      }
    },
    {
      id: 'orbital_habitats',
      name: 'Orbital Habitats',
      description: 'Space stations and artificial worlds',
      color: 'from-emerald-500 to-cyan-500',
      icon: <Moon size={20} />,
      baseStats: {
        diameter: 10, // 10 km
        habitableArea: 500, // 500 square km
        gravity: 0.8, // slightly below Earth
        population: 500000, // 500,000
        energyOutput: 10000, // 10,000 GW
        constructionTime: 20, // years
        stability: 95,
        environmentalImpact: 5
      }
    },
    {
      id: 'planetary_terraforming',
      name: 'Planetary Terraforming',
      description: 'Reshaping planets for habitability',
      color: 'from-green-500 to-blue-500',
      icon: <CloudCog size={20} />,
      baseStats: {
        diameter: 12000, // 12,000 km (Earth-like)
        habitableArea: 500000000, // 500 million square km
        gravity: 1, // Earth-like
        population: 10000000000, // 10 billion
        energyOutput: 1000000, // 1 million GW
        constructionTime: 200, // years
        stability: 98,
        environmentalImpact: 60
      }
    }
  ];

  // Load template data
  useEffect(() => {
    loadStructureData();
  }, []);

  const loadStructureData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [templatesData, instancesData] = await Promise.all([
        ipsumariumService.getAll().then(data => data.filter(t => 
          t.type === 'structure' || t.tags.some(tag => 
            ['ringworld', 'dyson_sphere', 'habitat', 'terraforming', 'megastructure'].includes(tag)
          )
        )).catch(() => []),
        templateInstanceService.getAll().then(data => data.filter(i => 
          i.template.type === 'structure' || i.template.tags.some(tag => 
            ['ringworld', 'dyson_sphere', 'habitat', 'terraforming', 'megastructure'].includes(tag)
          )
        )).catch(() => [])
      ]);
      setStructureTemplates(templatesData);
      setStructureInstances(instancesData);
    } catch (err) {
      console.error('Failed to load structure data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load structure data');
    } finally {
      setLoading(false);
    }
  };

  // Initialize new structure when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory);
      if (category) {
        const baseStats = category.baseStats;
        setNewStructure({
          id: `${category.id}_${Date.now()}`,
          name: `New ${category.name.slice(0, -1)}`,
          description: '',
          type: category.id,
          diameter: baseStats.diameter,
          habitableArea: baseStats.habitableArea,
          gravity: baseStats.gravity,
          atmosphere: 'Artificial atmosphere with Earth-like composition',
          technology: [],
          population: baseStats.population,
          energyOutput: baseStats.energyOutput,
          materials: [],
          constructionTime: baseStats.constructionTime,
          maintenanceCost: baseStats.energyOutput * 0.001,
          stability: baseStats.stability,
          environmentalImpact: baseStats.environmentalImpact
        });
      }
    }
  }, [selectedCategory]);

  // Sample structures
  useEffect(() => {
    setStructures([
      {
        id: 'ringworld_alpha',
        name: 'Halo Alpha',
        description: 'A massive habitable ring with diverse biomes and self-sustaining ecosystems',
        type: 'ringworlds',
        diameter: 10000,
        habitableArea: 3200000,
        gravity: 1.02,
        atmosphere: 'Terraformed atmosphere with enhanced oxygen content',
        technology: ['Gravity generators', 'Weather control', 'Biome stabilizers'],
        population: 12000000000,
        energyOutput: 50000000000,
        materials: ['Neutronium alloy', 'Carbon nanostructures', 'Quantum-stable elements'],
        constructionTime: 842,
        maintenanceCost: 7800000000,
        stability: 94,
        environmentalImpact: 22,
        imageUrl: 'https://placeholder.com/ringworld'
      },
      {
        id: 'dyson_beta',
        name: 'Sol Harvester',
        description: 'Partial Dyson swarm collecting 32% of the star\'s energy output',
        type: 'dyson_spheres',
        diameter: 150000000,
        habitableArea: 50000,
        gravity: 0,
        atmosphere: 'None (vacuum with contained habitats)',
        technology: ['Photon collectors', 'Energy transmission arrays', 'Heat dissipation systems'],
        population: 500000,
        energyOutput: 40000000000000,
        materials: ['Solar collectors', 'Heat-resistant alloys', 'Gravitational tethers'],
        constructionTime: 120,
        maintenanceCost: 200000000000,
        stability: 82,
        environmentalImpact: 8,
        imageUrl: 'https://placeholder.com/dyson'
      }
    ]);
  }, []);

  const addNewStructure = () => {
    if (newStructure) {
      setStructures([...structures, newStructure]);
      setShowNewStructureForm(false);
    }
  };

  const renderStructureForm = () => {
    if (!newStructure) return null;
    
    return (
      <div className="bg-gray-800 rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">New Structure Details</h3>
          <button 
            onClick={() => setShowNewStructureForm(false)} 
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={newStructure.name}
              onChange={(e) => setNewStructure({...newStructure, name: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
            <select
              value={newStructure.type}
              onChange={(e) => setNewStructure({...newStructure, type: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              value={newStructure.description}
              onChange={(e) => setNewStructure({...newStructure, description: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Diameter (km)</label>
            <input
              type="number"
              value={newStructure.diameter}
              onChange={(e) => setNewStructure({...newStructure, diameter: parseFloat(e.target.value)})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Habitable Area (km²)</label>
            <input
              type="number"
              value={newStructure.habitableArea}
              onChange={(e) => setNewStructure({...newStructure, habitableArea: parseFloat(e.target.value)})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Gravity (Earth = 1)</label>
            <input
              type="number"
              step="0.01"
              value={newStructure.gravity}
              onChange={(e) => setNewStructure({...newStructure, gravity: parseFloat(e.target.value)})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Atmosphere</label>
            <input
              type="text"
              value={newStructure.atmosphere}
              onChange={(e) => setNewStructure({...newStructure, atmosphere: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Population</label>
            <input
              type="number"
              value={newStructure.population}
              onChange={(e) => setNewStructure({...newStructure, population: parseFloat(e.target.value)})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Energy Output (GW)</label>
            <input
              type="number"
              value={newStructure.energyOutput}
              onChange={(e) => setNewStructure({...newStructure, energyOutput: parseFloat(e.target.value)})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Construction Time (years)</label>
            <input
              type="number"
              value={newStructure.constructionTime}
              onChange={(e) => setNewStructure({...newStructure, constructionTime: parseFloat(e.target.value)})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Maintenance Cost (GW/year)</label>
            <input
              type="number"
              value={newStructure.maintenanceCost}
              onChange={(e) => setNewStructure({...newStructure, maintenanceCost: parseFloat(e.target.value)})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Stability (0-100)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={newStructure.stability}
              onChange={(e) => setNewStructure({...newStructure, stability: parseFloat(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Unstable</span>
              <span>Stable</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Environmental Impact (0-100)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={newStructure.environmentalImpact}
              onChange={(e) => setNewStructure({...newStructure, environmentalImpact: parseFloat(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button 
            onClick={addNewStructure}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Structure
          </button>
        </div>
      </div>
    );
  };

  const render3DView = () => {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="h-96 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">3D visualization would render here</p>
            <p className="text-gray-500 text-sm mt-2">Using WebGL or Three.js to display structure</p>
          </div>
        </div>
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <button className="p-2 rounded bg-gray-700 text-gray-300">
                <Layers size={18} />
              </button>
              <button className="p-2 rounded bg-gray-700 text-gray-300">
                <Settings size={18} />
              </button>
            </div>
            <div>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                Export Model
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSpecifications = () => {
    const selectedStructureData = structures.find(s => s.type === selectedCategory);
    if (!selectedStructureData) return null;
    
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6">Technical Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">PHYSICAL PROPERTIES</h4>
              <div className="bg-gray-700 rounded-lg p-4 mt-2">
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Diameter</span>
                  <span className="text-white font-medium">{selectedStructureData.diameter.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Habitable Area</span>
                  <span className="text-white font-medium">{selectedStructureData.habitableArea.toLocaleString()} km²</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Gravity</span>
                  <span className="text-white font-medium">{selectedStructureData.gravity}g</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">Atmosphere</span>
                  <span className="text-white font-medium">{selectedStructureData.atmosphere.length > 20 ? selectedStructureData.atmosphere.substring(0, 20) + '...' : selectedStructureData.atmosphere}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-400">DEMOGRAPHIC DATA</h4>
              <div className="bg-gray-700 rounded-lg p-4 mt-2">
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Population</span>
                  <span className="text-white font-medium">{selectedStructureData.population.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Population Density</span>
                  <span className="text-white font-medium">{(selectedStructureData.population / selectedStructureData.habitableArea).toFixed(2)} per km²</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">Resource Sufficiency</span>
                  <span className="text-white font-medium">92%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">ENERGY & MAINTENANCE</h4>
              <div className="bg-gray-700 rounded-lg p-4 mt-2">
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Energy Output</span>
                  <span className="text-white font-medium">{selectedStructureData.energyOutput.toLocaleString()} GW</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Per Capita Energy</span>
                  <span className="text-white font-medium">{(selectedStructureData.energyOutput / selectedStructureData.population).toFixed(2)} GW</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Maintenance Cost</span>
                  <span className="text-white font-medium">{selectedStructureData.maintenanceCost.toLocaleString()} GW/year</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">Efficiency</span>
                  <span className="text-white font-medium">{(100 - (selectedStructureData.maintenanceCost / selectedStructureData.energyOutput * 100)).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-400">STABILITY & ENVIRONMENT</h4>
              <div className="bg-gray-700 rounded-lg p-4 mt-2">
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Structural Stability</span>
                  <div className="w-32 bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedStructureData.stability > 80 ? 'bg-green-500' : 
                        selectedStructureData.stability > 50 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`} 
                      style={{width: `${selectedStructureData.stability}%`}}
                    />
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-600">
                  <span className="text-gray-300">Environmental Impact</span>
                  <div className="w-32 bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedStructureData.environmentalImpact < 30 ? 'bg-green-500' : 
                        selectedStructureData.environmentalImpact < 70 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`} 
                      style={{width: `${selectedStructureData.environmentalImpact}%`}}
                    />
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">Projected Lifespan</span>
                  <span className="text-white font-medium">
                    {Math.floor(10000 * (selectedStructureData.stability / 100))} years
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex">
      {/* Categories Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search structures..."
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
                <span className="ml-auto text-xs">{structureTemplates.length + structureInstances.length}</span>
              </button>
              <button
                onClick={() => setViewSource('templates')}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  viewSource === 'templates' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Database size={14} className="mr-2" />
                Templates
                <span className="ml-auto text-xs">{structureTemplates.length}</span>
              </button>
              <button
                onClick={() => setViewSource('instances')}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  viewSource === 'instances' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Link size={14} className="mr-2" />
                Instances
                <span className="ml-auto text-xs">{structureInstances.length}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-400">STRUCTURE CATEGORIES</h2>
            <button className="text-gray-400 hover:text-white" onClick={loadStructureData}>
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
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-400">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
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
          
          {selectedCategory && structures.filter(s => s.type === selectedCategory).length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">EXISTING STRUCTURES</h3>
              <div className="space-y-2">
                {structures
                  .filter(s => s.type === selectedCategory)
                  .map(structure => (
                    <div key={structure.id} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{structure.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate">{structure.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {selectedCategory ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h1>
                  <p className="text-gray-400">
                    {categories.find(c => c.id === selectedCategory)?.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setViewMode('form')} 
                    className={`p-2 rounded ${viewMode === 'form' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    <Settings size={18} className="text-gray-300" />
                  </button>
                  <button 
                    onClick={() => setViewMode('3d')} 
                    className={`p-2 rounded ${viewMode === '3d' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    <Globe size={18} className="text-gray-300" />
                  </button>
                  <button 
                    onClick={() => setViewMode('specs')} 
                    className={`p-2 rounded ${viewMode === 'specs' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    <Layers size={18} className="text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {showNewStructureForm ? (
                renderStructureForm()
              ) : viewMode === 'form' ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900 bg-opacity-20 mb-4">
                    <Globe className="h-8 w-8 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Structure Designer</h2>
                  <p className="text-gray-400 mb-6">
                    Create and modify megastructures with detailed specifications and properties.
                  </p>
                  <button 
                    onClick={() => setShowNewStructureForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Design New Structure
                  </button>
                </div>
              ) : viewMode === '3d' ? (
                render3DView()
              ) : (
                renderSpecifications()
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900 bg-opacity-20 mb-4">
                <Globe className="h-8 w-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Select a Structure Type</h2>
              <p className="text-gray-400 mb-6">
                Choose a structure category from the sidebar to begin designing megastructures.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};