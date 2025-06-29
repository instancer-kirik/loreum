import React, { useState, useEffect } from 'react';
import { GitBranch, PlusCircle, Search, Filter, ChevronRight, Database, Link, Cog } from 'lucide-react';
import { ipsumariumService, templateInstanceService } from '../integrations/supabase/database';
import { IpsumTemplate, TemplateInstanceWithTemplate } from '../types';

export const TechTreeDesigner: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewSource, setViewSource] = useState<'all' | 'templates' | 'instances'>('all');
  
  // Data state
  const [techTemplates, setTechTemplates] = useState<IpsumTemplate[]>([]);
  const [techInstances, setTechInstances] = useState<TemplateInstanceWithTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTechData();
  }, []);

  const loadTechData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [templatesData, instancesData] = await Promise.all([
        ipsumariumService.getAll().then(data => data.filter(t => t.type === 'tech')).catch(() => []),
        templateInstanceService.getAll().then(data => data.filter(i => i.template.type === 'tech')).catch(() => [])
      ]);
      setTechTemplates(templatesData);
      setTechInstances(instancesData);
    } catch (err) {
      console.error('Failed to load tech data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tech data');
    } finally {
      setLoading(false);
    }
  };

  // Get unique domains from loaded data
  const allDomains = [
    ...new Set([
      ...techTemplates.flatMap(t => t.tags),
      ...techInstances.flatMap(i => [...i.template.tags, ...i.tags])
    ])
  ].filter(Boolean);

  const techDomains = [
    {
      id: 'all',
      name: 'All Technologies',
      description: 'All technology templates and instances',
      color: 'from-gray-500 to-gray-600',
      count: techTemplates.length + techInstances.length
    },
    ...allDomains.map(domain => ({
      id: domain,
      name: domain.charAt(0).toUpperCase() + domain.slice(1),
      description: `Technologies tagged with ${domain}`,
      color: 'from-blue-500 to-purple-500',
      count: techTemplates.filter(t => t.tags.includes(domain)).length + 
             techInstances.filter(i => i.template.tags.includes(domain) || i.tags.includes(domain)).length
    }))
  ];

  // Filter technologies based on domain and source
  const filteredTechnologies = [
    ...(viewSource === 'instances' ? [] : techTemplates.map(t => ({ ...t, source: 'template' as const }))),
    ...(viewSource === 'templates' ? [] : techInstances.map(i => ({ ...i, source: 'instance' as const })))
  ].filter(tech => {
    if (selectedDomain === 'all' || !selectedDomain) return true;
    if (tech.source === 'template') {
      return tech.tags.includes(selectedDomain);
    } else {
      return tech.template.tags.includes(selectedDomain) || tech.tags.includes(selectedDomain);
    }
  }).filter(tech => {
    if (!searchQuery) return true;
    const name = tech.source === 'template' ? tech.name : tech.instanceName;
    const description = tech.source === 'template' ? tech.description : (tech.instanceDescription || tech.template.description);
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex">
      {/* Domains Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search technologies..."
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
                <span className="ml-auto text-xs">{techTemplates.length + techInstances.length}</span>
              </button>
              <button
                onClick={() => setViewSource('templates')}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  viewSource === 'templates' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Database size={14} className="mr-2" />
                Templates
                <span className="ml-auto text-xs">{techTemplates.length}</span>
              </button>
              <button
                onClick={() => setViewSource('instances')}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  viewSource === 'instances' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Link size={14} className="mr-2" />
                Instances
                <span className="ml-auto text-xs">{techInstances.length}</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-400">TECH DOMAINS</h2>
            <button className="text-gray-400 hover:text-white" onClick={loadTechData}>
              <Filter size={16} />
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="text-gray-400">Loading domains...</div>
            </div>
          ) : (
            <div className="space-y-2">
              {techDomains.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDomain === domain.id
                      ? 'bg-blue-900 bg-opacity-50 text-blue-300'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{domain.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{domain.count}</span>
                      <ChevronRight size={16} className="text-gray-500" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{domain.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {selectedDomain ? techDomains.find(d => d.id === selectedDomain)?.name : 'Technology Overview'}
                </h1>
                <p className="text-gray-400">
                  {selectedDomain 
                    ? techDomains.find(d => d.id === selectedDomain)?.description
                    : 'Select a domain to view technologies and their relationships'
                  }
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {filteredTechnologies.length} technologies
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-400">Loading technologies...</div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-lg text-red-400 mb-2">Error loading technologies</div>
                <div className="text-sm text-gray-400 mb-4">{error}</div>
                <button 
                  onClick={loadTechData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredTechnologies.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900 bg-opacity-20 mb-4">
                  <Cog className="h-8 w-8 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Technologies Found</h2>
                <p className="text-gray-400 mb-6">
                  {searchQuery || (selectedDomain && selectedDomain !== 'all')
                    ? 'Try adjusting your search or domain filters'
                    : 'Create your first technology template to get started'
                  }
                </p>
                <button 
                  onClick={() => window.location.href = '#ipsumarium'}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Create Technology Template
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTechnologies.map(tech => (
                  <div 
                    key={`${tech.source}-${tech.id}`}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="h-2 bg-blue-500" />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-white">
                          {tech.source === 'template' ? tech.name : tech.instanceName}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs px-2 py-1 bg-blue-900 bg-opacity-30 text-blue-400 rounded-full">
                            tech
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                            tech.source === 'template' 
                              ? 'bg-gray-900 bg-opacity-30 text-gray-400' 
                              : 'bg-blue-900 bg-opacity-30 text-blue-400'
                          }`}>
                            {tech.source === 'template' ? <Database size={12} /> : <Link size={12} />}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        {tech.source === 'template' ? tech.description : (tech.instanceDescription || tech.template.description)}
                      </p>
                      {tech.source === 'instance' && (
                        <div className="text-xs text-gray-500 mb-2">
                          Based on: {tech.template.name}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {(tech.source === 'template' ? tech.tags : [...tech.template.tags, ...tech.tags])
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