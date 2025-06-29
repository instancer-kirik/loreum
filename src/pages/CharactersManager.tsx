import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaUser,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaHeart,
  FaBrain,
  FaStar,
  FaMap,
  FaGlobe,
  FaDatabase,
  FaLink,
  FaTheaterMasks,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { ipsumariumService, templateInstanceService } from '../integrations/supabase/database';
import { IpsumTemplate, TemplateInstanceWithTemplate } from '../types';
import { useAppContext } from '../context/AppContext';

export const CharactersManager: React.FC = () => {
  const { setCurrentPage } = useAppContext();
  const [characters, setCharacters] = useState<IpsumTemplate[]>([]);
  const [characterInstances, setCharacterInstances] = useState<TemplateInstanceWithTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewSource, setViewSource] = useState<'all' | 'templates' | 'instances'>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<IpsumTemplate | TemplateInstanceWithTemplate | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const [templatesData, instancesData] = await Promise.all([
        ipsumariumService.getAll().then(data => data.filter(t => t.type === 'character')).catch(() => []),
        templateInstanceService.getAll().then(data => data.filter(i => i.template.type === 'character')).catch(() => [])
      ]);
      setCharacters(templatesData);
      setCharacterInstances(instancesData);
    } catch (err) {
      console.error('Failed to load characters:', err);
      setError(err instanceof Error ? err.message : 'Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from loaded data
  const allCategories = [
    ...new Set([
      ...characters.flatMap(c => c.tags),
      ...characterInstances.flatMap(c => [...c.template.tags, ...c.tags])
    ])
  ].filter(Boolean);

  const categories = [
    { id: 'all', name: 'All Characters', count: characters.length + characterInstances.length },
    { id: 'heroes', name: 'Heroes', count: 0 },
    { id: 'villains', name: 'Villains', count: 0 },
    { id: 'npcs', name: 'NPCs', count: 0 },
    { id: 'leaders', name: 'Leaders', count: 0 },
    ...allCategories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: characters.filter(c => c.tags.includes(category)).length + 
             characterInstances.filter(c => c.template.tags.includes(category) || c.tags.includes(category)).length
    }))
  ];

  // Combined characters for display
  const allCharacters = [
    ...(viewSource === 'instances' ? [] : characters.map(c => ({ ...c, source: 'template' as const }))),
    ...(viewSource === 'templates' ? [] : characterInstances.map(c => ({ ...c, source: 'instance' as const })))
  ];

  // Filter characters
  const filteredCharacters = allCharacters.filter(character => {
    // Category filter
    if (selectedCategory !== 'all') {
      const tags = character.source === 'template' 
        ? character.tags 
        : [...character.template.tags, ...character.tags];
      if (!tags.includes(selectedCategory)) return false;
    }

    // Search filter
    if (searchQuery) {
      const name = character.source === 'template' ? character.name : character.instanceName;
      const description = character.source === 'template' 
        ? character.description 
        : (character.instanceDescription || character.template.description);
      const searchTerm = searchQuery.toLowerCase();
      if (!name.toLowerCase().includes(searchTerm) && 
          !description.toLowerCase().includes(searchTerm)) return false;
    }

    return true;
  });

  const getCharacterIcon = (character: any) => {
    if (character.source === 'template') {
      return <FaTheaterMasks className="text-flame-blue" size={24} />;
    } else {
      return <FaUser className="text-circuit-energy" size={24} />;
    }
  };

  const formatContextPath = (instance: TemplateInstanceWithTemplate) => {
    const parts = [];
    if (instance.multiverseName) parts.push(instance.multiverseName);
    if (instance.universeName) parts.push(instance.universeName);
    if (instance.timelineName) parts.push(instance.timelineName);
    if (instance.worldName) parts.push(instance.worldName);
    if (instance.civilizationName) parts.push(instance.civilizationName);
    
    return parts.length > 0 ? parts.join(' › ') : 'No context';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-cosmic-light bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaUsers className="text-glyph-accent animate-spin" size={32} />
          </div>
          <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
            Loading Characters
          </h3>
          <p className="text-glyph-accent">
            Gathering character templates and instances...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-flame-orange bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaUsers className="text-flame-orange" size={32} />
          </div>
          <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
            Error Loading Characters
          </h3>
          <p className="text-glyph-accent mb-6">{error}</p>
          <button 
            onClick={loadCharacters}
            className="btn-glowing"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-cosmic-light border-opacity-20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-glyph-bright font-serif mb-2">
              Characters Studio
            </h1>
            <p className="text-glyph-accent">
              Manage character templates and their instances across all realities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-glyph-accent">
              {filteredCharacters.length} of {allCharacters.length} characters
            </div>
            <button 
              onClick={() => setCurrentPage('ipsumarium')}
              className="btn-glowing"
            >
              <FaPlus className="mr-2" size={16} />
              New Character
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-glyph-accent"
              size={16}
            />
            <input
              type="text"
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
            />
          </div>
          
          {/* Source Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewSource('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                viewSource === 'all' ? 'glass-panel text-glyph-bright' : 'text-glyph-accent hover:text-glyph-bright'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setViewSource('templates')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                viewSource === 'templates' ? 'glass-panel text-glyph-bright' : 'text-glyph-accent hover:text-glyph-bright'
              }`}
            >
              <FaDatabase size={14} className="mr-1" />
              Templates
            </button>
            <button
              onClick={() => setViewSource('instances')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                viewSource === 'instances' ? 'glass-panel text-glyph-bright' : 'text-glyph-accent hover:text-glyph-bright'
              }`}
            >
              <FaLink size={14} className="mr-1" />
              Instances
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Categories Sidebar */}
        <div className="w-64 bg-cosmic-deep border-r border-cosmic-light border-opacity-20 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-glyph-accent mb-3 font-serif tracking-wider">
              CHARACTER TYPES
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "glass-panel text-glyph-bright border border-flame-blue border-opacity-30"
                      : "text-glyph-accent hover:glass-panel hover:text-glyph-bright"
                  }`}
                >
                  <span className="font-serif">{category.name}</span>
                  <span className="ml-auto text-xs text-glyph-accent">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {filteredCharacters.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-cosmic-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <FaUsers className="text-glyph-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
                No Characters Found
              </h3>
              <p className="text-glyph-accent mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? `No characters match your current filters`
                  : `Create your first character template to get started`}
              </p>
              <button 
                onClick={() => setCurrentPage('ipsumarium')}
                className="btn-glowing"
              >
                <FaPlus className="mr-2" size={16} />
                Create Character Template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCharacters.map((character) => (
                <div
                  key={`${character.source}-${character.id}`}
                  className="glass-panel border border-cosmic-light border-opacity-20 overflow-hidden hover:border-flame-blue hover:border-opacity-50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {getCharacterIcon(character)}
                        <div className="ml-3">
                          <h3 className="font-medium text-glyph-bright font-serif">
                            {character.source === 'template' ? character.name : character.instanceName}
                          </h3>
                          <span className="text-xs text-glyph-accent capitalize">
                            {character.source === 'template' ? 'Template' : 'Instance'}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        character.source === 'template' 
                          ? 'bg-flame-blue bg-opacity-20 text-flame-blue' 
                          : 'bg-circuit-energy bg-opacity-20 text-circuit-energy'
                      }`}>
                        {character.source === 'template' ? 'Template' : 'Instance'}
                      </span>
                    </div>

                    {character.source === 'instance' && (
                      <div className="mb-3">
                        <div className="text-xs text-glyph-accent mb-1">Based on:</div>
                        <div className="text-sm text-circuit-energy font-medium">
                          {character.template.name}
                        </div>
                      </div>
                    )}

                    {character.source === 'instance' && (
                      <div className="mb-3">
                        <div className="text-xs text-glyph-accent mb-1">Context:</div>
                        <div className="text-xs text-glyph-primary">
                          {formatContextPath(character)}
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-glyph-accent mb-3 line-clamp-2">
                      {character.source === 'template' 
                        ? character.description 
                        : (character.instanceDescription || character.template.description)}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {(character.source === 'template' 
                        ? character.tags 
                        : [...character.template.tags, ...character.tags]
                      ).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs text-glyph-accent">
                      <span>
                        {character.source === 'template' 
                          ? `Created ${character.createdAt.toLocaleDateString()}`
                          : `Created ${character.createdAt.toLocaleDateString()}`
                        }
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCharacter(character);
                          }}
                          className="text-flame-blue hover:text-flame-cyan transition-colors flex items-center"
                          title="View Details"
                        >
                          <FaEye size={12} className="mr-1" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Character Detail Modal */}
      {selectedCharacter && (
        <div className="fixed inset-0 bg-cosmic-deepest bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="glass-panel border border-cosmic-light border-opacity-30 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  {getCharacterIcon(selectedCharacter)}
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-glyph-bright font-serif">
                      {selectedCharacter.source === 'template' ? selectedCharacter.name : selectedCharacter.instanceName}
                    </h2>
                    <p className="text-glyph-accent">
                      {selectedCharacter.source === 'template' 
                        ? 'Character Template'
                        : `Character Instance based on "${selectedCharacter.template.name}"`
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCharacter(null)}
                  className="text-glyph-accent hover:text-glyph-bright transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">Character Details</h3>
                    <div className="glass-panel p-4 space-y-3">
                      <div>
                        <label className="text-xs text-glyph-accent">Description</label>
                        <div className="text-sm text-glyph-primary">
                          {selectedCharacter.source === 'template' 
                            ? selectedCharacter.description
                            : (selectedCharacter.instanceDescription || selectedCharacter.template.description)
                          }
                        </div>
                      </div>

                      {selectedCharacter.source === 'instance' && (
                        <>
                          <div>
                            <label className="text-xs text-glyph-accent">Context Path</label>
                            <div className="text-sm text-glyph-primary">
                              {formatContextPath(selectedCharacter)}
                            </div>
                          </div>

                          {selectedCharacter.discoveredYear && (
                            <div>
                              <label className="text-xs text-glyph-accent">Discovered Year</label>
                              <div className="text-sm text-glyph-primary">
                                {selectedCharacter.discoveredYear}
                              </div>
                            </div>
                          )}

                          {selectedCharacter.originLocation && (
                            <div>
                              <label className="text-xs text-glyph-accent">Origin Location</label>
                              <div className="text-sm text-glyph-primary">
                                {selectedCharacter.originLocation}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {(selectedCharacter.source === 'template' 
                        ? selectedCharacter.tags 
                        : [...selectedCharacter.template.tags, ...selectedCharacter.tags]
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedCharacter.source === 'instance' && (
                    <div>
                      <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">Template Source</h3>
                      <div className="glass-panel p-4 space-y-3">
                        <div>
                          <label className="text-xs text-glyph-accent">Template Name</label>
                          <div className="text-sm text-circuit-energy font-medium">
                            {selectedCharacter.template.name}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs text-glyph-accent">Template Description</label>
                          <div className="text-sm text-glyph-primary">
                            {selectedCharacter.template.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedCharacter.source === 'instance' && Object.keys(selectedCharacter.localVariations).length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">Local Variations</h3>
                      <div className="glass-panel p-4">
                        <pre className="text-xs text-glyph-primary overflow-auto">
                          {JSON.stringify(selectedCharacter.localVariations, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-cosmic-light border-opacity-20">
                <div className="text-xs text-glyph-accent">
                  Created {selectedCharacter.createdAt.toLocaleDateString()}
                  {selectedCharacter.source === 'instance' && 
                    `, Updated ${selectedCharacter.updatedAt.toLocaleDateString()}`
                  }
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      // TODO: Open edit modal
                    }}
                    className="px-4 py-2 bg-circuit-energy text-cosmic-deepest rounded-md hover:bg-circuit-magic transition-colors flex items-center"
                  >
                    <FaEdit className="mr-2" size={14} />
                    Edit Character
                  </button>
                  {selectedCharacter.source === 'instance' && (
                    <button 
                      onClick={() => {
                        // TODO: Navigate to template
                      }}
                      className="px-4 py-2 glass-panel text-glyph-bright hover:text-flame-blue transition-colors flex items-center"
                    >
                      <FaExternalLinkAlt className="mr-2" size={14} />
                      View Template
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};