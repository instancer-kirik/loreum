import React, { useState, useEffect } from 'react';
import {
  FaDatabase,
  FaLink,
  FaUsers,
  FaCog,
  FaGem,
  FaMagic,
  FaPalette,
  FaGlobe,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { templateInstanceService } from '../integrations/supabase/database';
import { TemplateInstanceWithTemplate } from '../types';

export const InstanceViewer: React.FC = () => {
  const [instances, setInstances] = useState<TemplateInstanceWithTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedInstance, setSelectedInstance] = useState<TemplateInstanceWithTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const typeOptions = [
    { id: 'all', name: 'All Types', icon: <FaDatabase />, color: 'text-glyph-bright' },
    { id: 'species', name: 'Species', icon: <FaUsers />, color: 'text-flame-blue' },
    { id: 'tech', name: 'Technology', icon: <FaCog />, color: 'text-circuit-energy' },
    { id: 'item', name: 'Items', icon: <FaGem />, color: 'text-flame-orange' },
    { id: 'magic', name: 'Magic Systems', icon: <FaMagic />, color: 'text-circuit-magic' },
    { id: 'culture', name: 'Cultures', icon: <FaPalette />, color: 'text-glyph-accent' },
    { id: 'civilization', name: 'Civilizations', icon: <FaGlobe />, color: 'text-flame-blue' }
  ];

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateInstanceService.getAll();
      setInstances(data);
    } catch (err) {
      console.error('Failed to load instances:', err);
      setError(err instanceof Error ? err.message : 'Failed to load instances');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstances = instances.filter(instance => {
    const matchesType = selectedType === 'all' || instance.template.type === selectedType;
    const matchesSearch = 
      instance.instanceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instance.instanceDescription && instance.instanceDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      instance.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    const typeOption = typeOptions.find(opt => opt.id === type);
    return typeOption ? React.cloneElement(typeOption.icon, { 
      className: `${typeOption.color}`,
      size: 24 
    }) : <FaDatabase className="text-glyph-bright" size={24} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-circuit-energy';
      case 'inactive': return 'text-glyph-accent';
      case 'deprecated': return 'text-flame-orange';
      default: return 'text-glyph-accent';
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
            <FaDatabase className="text-glyph-accent animate-spin" size={32} />
          </div>
          <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
            Loading Instances
          </h3>
          <p className="text-glyph-accent">
            Fetching your template instances...
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
            <FaDatabase className="text-flame-orange" size={32} />
          </div>
          <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
            Error Loading Instances
          </h3>
          <p className="text-glyph-accent mb-6">{error}</p>
          <button 
            onClick={loadInstances}
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
              Template Instances
            </h1>
            <p className="text-glyph-accent">
              View and manage your instantiated templates across all contexts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-glyph-accent text-sm">
              {filteredInstances.length} of {instances.length} instances
            </span>
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
              placeholder="Search instances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
            />
          </div>
          <button className="p-2 glass-panel text-glyph-accent hover:text-glyph-bright transition-colors">
            <FaFilter size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Type Filter Sidebar */}
        <div className="w-64 bg-cosmic-deep border-r border-cosmic-light border-opacity-20 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-glyph-accent mb-3 font-serif tracking-wider">
              INSTANCE TYPES
            </h3>
            <div className="space-y-1">
              {typeOptions.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    selectedType === type.id
                      ? "glass-panel text-glyph-bright border border-flame-blue border-opacity-30"
                      : "text-glyph-accent hover:glass-panel hover:text-glyph-bright"
                  }`}
                >
                  <span className={`mr-3 ${selectedType === type.id ? "text-flame-blue" : type.color}`}>
                    {type.icon}
                  </span>
                  <span className="font-serif">{type.name}</span>
                  <span className="ml-auto text-xs text-glyph-accent">
                    {type.id === 'all' 
                      ? instances.length 
                      : instances.filter(i => i.template.type === type.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {filteredInstances.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-cosmic-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <FaLink className="text-glyph-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
                No Instances Found
              </h3>
              <p className="text-glyph-accent mb-6">
                {searchQuery
                  ? `No instances match "${searchQuery}" in the ${selectedType === "all" ? "database" : selectedType + " category"}`
                  : `No ${selectedType === "all" ? "" : selectedType + " "}instances available yet`}
              </p>
              <button 
                onClick={() => window.location.href = '#ipsumarium'}
                className="btn-glowing"
              >
                <FaPlus className="mr-2" size={16} />
                Create from Templates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredInstances.map((instance) => (
                <div
                  key={instance.id}
                  className="glass-panel border border-cosmic-light border-opacity-20 overflow-hidden hover:border-flame-blue hover:border-opacity-50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedInstance(instance)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {getTypeIcon(instance.template.type)}
                        <div className="ml-3">
                          <h3 className="font-medium text-glyph-bright font-serif">
                            {instance.instanceName}
                          </h3>
                          <span className="text-xs text-glyph-accent capitalize">
                            {instance.template.type} Instance
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full bg-cosmic-light bg-opacity-30 ${getStatusColor(instance.status)}`}>
                        {instance.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-glyph-accent mb-1">Based on:</div>
                      <div className="text-sm text-circuit-energy font-medium">
                        {instance.template.name}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-glyph-accent mb-1">Context:</div>
                      <div className="text-xs text-glyph-primary">
                        {formatContextPath(instance)}
                      </div>
                    </div>

                    {instance.instanceDescription && (
                      <p className="text-sm text-glyph-accent mb-3 line-clamp-2">
                        {instance.instanceDescription}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {instance.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {instance.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full">
                          +{instance.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-glyph-accent">
                      <span>
                        Created {instance.createdAt.toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInstance(instance);
                          }}
                          className="text-flame-blue hover:text-flame-cyan transition-colors flex items-center"
                          title="View Details"
                        >
                          <FaEye size={12} className="mr-1" />
                          View
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Open edit modal
                          }}
                          className="text-circuit-energy hover:text-circuit-magic transition-colors flex items-center"
                          title="Edit Instance"
                        >
                          <FaEdit size={12} className="mr-1" />
                          Edit
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

      {/* Instance Detail Modal */}
      {selectedInstance && (
        <div className="fixed inset-0 bg-cosmic-deepest bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="glass-panel border border-cosmic-light border-opacity-30 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex-shrink-0 p-6 border-b border-cosmic-light border-opacity-20">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {getTypeIcon(selectedInstance.template.type)}
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-glyph-bright font-serif">
                      {selectedInstance.instanceName}
                    </h2>
                    <p className="text-glyph-accent">
                      {selectedInstance.template.type} instance based on "{selectedInstance.template.name}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInstance(null)}
                  className="text-glyph-accent hover:text-glyph-bright transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">Instance Details</h3>
                    <div className="glass-panel p-4 space-y-3">
                      <div>
                        <label className="text-xs text-glyph-accent">Status</label>
                        <div className={`text-sm font-medium ${getStatusColor(selectedInstance.status)}`}>
                          {selectedInstance.status}
                        </div>
                      </div>
                      
                      {selectedInstance.instanceDescription && (
                        <div>
                          <label className="text-xs text-glyph-accent">Description</label>
                          <div className="text-sm text-glyph-primary">
                            {selectedInstance.instanceDescription}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-glyph-accent">Context Path</label>
                        <div className="text-sm text-glyph-primary">
                          {formatContextPath(selectedInstance)}
                        </div>
                      </div>

                      {selectedInstance.discoveredYear && (
                        <div>
                          <label className="text-xs text-glyph-accent">Discovered Year</label>
                          <div className="text-sm text-glyph-primary">
                            {selectedInstance.discoveredYear}
                          </div>
                        </div>
                      )}

                      {selectedInstance.originLocation && (
                        <div>
                          <label className="text-xs text-glyph-accent">Origin Location</label>
                          <div className="text-sm text-glyph-primary">
                            {selectedInstance.originLocation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstance.tags.map((tag) => (
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
                  <div>
                    <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">Template Source</h3>
                    <div className="glass-panel p-4 space-y-3">
                      <div>
                        <label className="text-xs text-glyph-accent">Template Name</label>
                        <div className="text-sm text-circuit-energy font-medium">
                          {selectedInstance.template.name}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-glyph-accent">Template Description</label>
                        <div className="text-sm text-glyph-primary">
                          {selectedInstance.template.description}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-glyph-accent">Template Tags</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedInstance.template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-circuit-energy bg-opacity-20 text-circuit-energy rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {Object.keys(selectedInstance.localVariations).length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">Local Variations</h3>
                      <div className="glass-panel p-4">
                        <div className="max-h-48 overflow-y-auto">
                          <pre className="text-xs text-glyph-primary whitespace-pre-wrap">
                            {JSON.stringify(selectedInstance.localVariations, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 p-6 border-t border-cosmic-light border-opacity-20">
              <div className="flex justify-between items-center">
                <div className="text-xs text-glyph-accent">
                  Created {selectedInstance.createdAt.toLocaleDateString()}, 
                  Updated {selectedInstance.updatedAt.toLocaleDateString()}
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      // TODO: Open edit modal
                    }}
                    className="px-4 py-2 bg-circuit-energy text-cosmic-deepest rounded-md hover:bg-circuit-magic transition-colors flex items-center"
                  >
                    <FaEdit className="mr-2" size={14} />
                    Edit Instance
                  </button>
                  <button 
                    onClick={() => {
                      // TODO: Navigate to template
                    }}
                    className="px-4 py-2 glass-panel text-glyph-bright hover:text-flame-blue transition-colors flex items-center"
                  >
                    <FaExternalLinkAlt className="mr-2" size={14} />
                    View Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};