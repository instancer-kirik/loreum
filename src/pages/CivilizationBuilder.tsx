import React, { useState } from 'react';
import { Users, PlusCircle, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Civilization, Species, Government, SocialStructure, HistoricalEra } from '../types';

export const CivilizationBuilder: React.FC = () => {
  const { currentProject } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [civilizations, setCivilizations] = useState<Civilization[]>(currentProject?.civilizations || []);
  const [selectedCivId, setSelectedCivId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    species: true,
    government: true,
    social: false,
    eras: false
  });

  const selectedCiv = civilizations.find(civ => civ.id === selectedCivId);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const handleCreateCiv = () => {
    const newCiv: Civilization = {
      id: Date.now().toString(),
      name: 'New Civilization',
      description: 'A brief description of your civilization',
      species: [],
      governments: [],
      socialStructures: [],
      eras: [],
      populationDynamics: {
        id: Date.now().toString(),
        initialPopulation: 10000,
        growthRate: 0.01,
        migrations: []
      }
    };
    
    setCivilizations([...civilizations, newCiv]);
    setSelectedCivId(newCiv.id);
    setActiveTab('overview');
  };

  const handleAddSpecies = () => {
    if (!selectedCiv) return;
    
    const newSpecies: Species = {
      id: Date.now().toString(),
      name: 'New Species',
      description: 'Description of this species',
      traits: ['Adaptable', 'Curious'],
      biology: 'Humanoid',
      origin: 'Unknown'
    };
    
    const updatedCivs = civilizations.map(civ => {
      if (civ.id === selectedCivId) {
        return {
          ...civ,
          species: [...civ.species, newSpecies]
        };
      }
      return civ;
    });
    
    setCivilizations(updatedCivs);
  };

  const handleAddGovernment = () => {
    if (!selectedCiv) return;
    
    const newGov: Government = {
      id: Date.now().toString(),
      name: 'New Government',
      description: 'Form of governance',
      type: 'Monarchy',
      structure: 'Hierarchical',
      leaders: ['Unnamed Leader'],
      startYear: 0,
      endYear: null
    };
    
    const updatedCivs = civilizations.map(civ => {
      if (civ.id === selectedCivId) {
        return {
          ...civ,
          governments: [...civ.governments, newGov]
        };
      }
      return civ;
    });
    
    setCivilizations(updatedCivs);
  };

  const handleAddSocialStructure = () => {
    if (!selectedCiv) return;
    
    const newSocial: SocialStructure = {
      id: Date.now().toString(),
      name: 'New Social Structure',
      description: 'Class system or social organization',
      classes: [
        {
          id: Date.now().toString(),
          name: 'Upper Class',
          description: 'The elite of society',
          privileges: ['Political power', 'Wealth'],
          responsibilities: ['Leadership', 'Patronage']
        }
      ]
    };
    
    const updatedCivs = civilizations.map(civ => {
      if (civ.id === selectedCivId) {
        return {
          ...civ,
          socialStructures: [...civ.socialStructures, newSocial]
        };
      }
      return civ;
    });
    
    setCivilizations(updatedCivs);
  };

  const handleAddEra = () => {
    if (!selectedCiv) return;
    
    const newEra: HistoricalEra = {
      id: Date.now().toString(),
      name: 'New Era',
      description: 'A significant period in your civilization\'s history',
      startYear: 0,
      endYear: 100,
      keyEvents: ['Founding event']
    };
    
    const updatedCivs = civilizations.map(civ => {
      if (civ.id === selectedCivId) {
        return {
          ...civ,
          eras: [...civ.eras, newEra]
        };
      }
      return civ;
    });
    
    setCivilizations(updatedCivs);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCiv) return;
    
    const updatedCivs = civilizations.map(civ => {
      if (civ.id === selectedCivId) {
        return {
          ...civ,
          name: e.target.value
        };
      }
      return civ;
    });
    
    setCivilizations(updatedCivs);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedCiv) return;
    
    const updatedCivs = civilizations.map(civ => {
      if (civ.id === selectedCivId) {
        return {
          ...civ,
          description: e.target.value
        };
      }
      return civ;
    });
    
    setCivilizations(updatedCivs);
  };

  return (
    <div className="h-full">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={handleCreateCiv}
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusCircle className="mr-2" size={18} />
              <span>New Civilization</span>
            </button>
          </div>
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-400 mb-3">YOUR CIVILIZATIONS</h2>
            <ul className="space-y-1">
              {civilizations.map(civ => (
                <li key={civ.id}>
                  <button
                    onClick={() => setSelectedCivId(civ.id)}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedCivId === civ.id
                        ? 'bg-purple-900 bg-opacity-50 text-purple-300'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {civ.name}
                  </button>
                </li>
              ))}
              
              {civilizations.length === 0 && (
                <li className="px-3 py-6 text-center">
                  <div className="text-gray-500 mb-2">
                    <Users size={36} className="mx-auto mb-2" />
                    <p className="text-sm">No civilizations yet</p>
                  </div>
                  <button
                    onClick={handleCreateCiv}
                    className="text-purple-400 text-sm hover:text-purple-300"
                  >
                    Create your first civilization
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedCiv ? (
            <div className="h-full">
              {/* Tabs */}
              <div className="bg-gray-800 border-b border-gray-700 flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('structure')}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === 'structure'
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Structure
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  History
                </button>
                <button
                  onClick={() => setActiveTab('demographics')}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === 'demographics'
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Demographics
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Civilization Name
                      </label>
                      <input
                        type="text"
                        value={selectedCiv.name}
                        onChange={handleNameChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Description
                      </label>
                      <textarea
                        value={selectedCiv.description}
                        onChange={handleDescriptionChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <button 
                          onClick={() => toggleSection('species')}
                          className="flex items-center text-white font-medium"
                        >
                          <span className="mr-2">Species</span>
                          {expandedSections.species ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button
                          onClick={handleAddSpecies}
                          className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                        >
                          <PlusCircle size={16} className="mr-1" />
                          <span>Add Species</span>
                        </button>
                      </div>
                      
                      {expandedSections.species && (
                        <div className="bg-gray-750 rounded-md border border-gray-700 overflow-hidden">
                          {selectedCiv.species.length > 0 ? (
                            <div>
                              {selectedCiv.species.map((species, index) => (
                                <div 
                                  key={species.id}
                                  className={`p-4 ${
                                    index !== selectedCiv.species.length - 1 ? 'border-b border-gray-700' : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-white">{species.name}</h3>
                                    <div className="flex space-x-2">
                                      <button className="text-gray-400 hover:text-white">
                                        <Edit size={16} />
                                      </button>
                                      <button className="text-gray-400 hover:text-red-400">
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-300 mb-2">{species.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {species.traits.map((trait, i) => (
                                      <span key={i} className="px-2 py-1 bg-gray-700 text-xs rounded-md text-gray-300">
                                        {trait}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center">
                              <p className="text-gray-500 text-sm">No species defined yet</p>
                              <button
                                onClick={handleAddSpecies}
                                className="mt-2 text-purple-400 text-sm hover:text-purple-300"
                              >
                                Add your first species
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <button 
                          onClick={() => toggleSection('government')}
                          className="flex items-center text-white font-medium"
                        >
                          <span className="mr-2">Government</span>
                          {expandedSections.government ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button
                          onClick={handleAddGovernment}
                          className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                        >
                          <PlusCircle size={16} className="mr-1" />
                          <span>Add Government</span>
                        </button>
                      </div>
                      
                      {expandedSections.government && (
                        <div className="bg-gray-750 rounded-md border border-gray-700 overflow-hidden">
                          {selectedCiv.governments.length > 0 ? (
                            <div>
                              {selectedCiv.governments.map((gov, index) => (
                                <div 
                                  key={gov.id}
                                  className={`p-4 ${
                                    index !== selectedCiv.governments.length - 1 ? 'border-b border-gray-700' : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-white">{gov.name}</h3>
                                    <div className="flex space-x-2">
                                      <button className="text-gray-400 hover:text-white">
                                        <Edit size={16} />
                                      </button>
                                      <button className="text-gray-400 hover:text-red-400">
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-300 mb-2">{gov.description}</p>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-gray-400">Type:</span> {gov.type}
                                    </div>
                                    <div>
                                      <span className="text-gray-400">Period:</span> {gov.startYear} - {gov.endYear || 'Present'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center">
                              <p className="text-gray-500 text-sm">No governments defined yet</p>
                              <button
                                onClick={handleAddGovernment}
                                className="mt-2 text-purple-400 text-sm hover:text-purple-300"
                              >
                                Add your first government
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <button 
                          onClick={() => toggleSection('social')}
                          className="flex items-center text-white font-medium"
                        >
                          <span className="mr-2">Social Structure</span>
                          {expandedSections.social ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button
                          onClick={handleAddSocialStructure}
                          className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                        >
                          <PlusCircle size={16} className="mr-1" />
                          <span>Add Social Structure</span>
                        </button>
                      </div>
                      
                      {expandedSections.social && (
                        <div className="bg-gray-750 rounded-md border border-gray-700 overflow-hidden">
                          {selectedCiv.socialStructures.length > 0 ? (
                            <div>
                              {selectedCiv.socialStructures.map((social, index) => (
                                <div 
                                  key={social.id}
                                  className={`p-4 ${
                                    index !== selectedCiv.socialStructures.length - 1 ? 'border-b border-gray-700' : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-white">{social.name}</h3>
                                    <div className="flex space-x-2">
                                      <button className="text-gray-400 hover:text-white">
                                        <Edit size={16} />
                                      </button>
                                      <button className="text-gray-400 hover:text-red-400">
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-300 mb-2">{social.description}</p>
                                  <p className="text-sm text-gray-400 mb-1">Classes:</p>
                                  <ul className="list-disc pl-5 text-sm text-gray-300">
                                    {social.classes.map(cls => (
                                      <li key={cls.id}>{cls.name}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center">
                              <p className="text-gray-500 text-sm">No social structures defined yet</p>
                              <button
                                onClick={handleAddSocialStructure}
                                className="mt-2 text-purple-400 text-sm hover:text-purple-300"
                              >
                                Add your first social structure
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <button 
                          onClick={() => toggleSection('eras')}
                          className="flex items-center text-white font-medium"
                        >
                          <span className="mr-2">Historical Eras</span>
                          {expandedSections.eras ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button
                          onClick={handleAddEra}
                          className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                        >
                          <PlusCircle size={16} className="mr-1" />
                          <span>Add Era</span>
                        </button>
                      </div>
                      
                      {expandedSections.eras && (
                        <div className="bg-gray-750 rounded-md border border-gray-700 overflow-hidden">
                          {selectedCiv.eras.length > 0 ? (
                            <div>
                              {selectedCiv.eras.map((era, index) => (
                                <div 
                                  key={era.id}
                                  className={`p-4 ${
                                    index !== selectedCiv.eras.length - 1 ? 'border-b border-gray-700' : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-white">{era.name}</h3>
                                    <div className="flex space-x-2">
                                      <button className="text-gray-400 hover:text-white">
                                        <Edit size={16} />
                                      </button>
                                      <button className="text-gray-400 hover:text-red-400">
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-300 mb-2">{era.description}</p>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-gray-400">Period:</span> {era.startYear} - {era.endYear || 'Present'}
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-400 mb-1">Key Events:</p>
                                    <ul className="list-disc pl-5 text-sm text-gray-300">
                                      {era.keyEvents.map((event, i) => (
                                        <li key={i}>{event}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center">
                              <p className="text-gray-500 text-sm">No historical eras defined yet</p>
                              <button
                                onClick={handleAddEra}
                                className="mt-2 text-purple-400 text-sm hover:text-purple-300"
                              >
                                Add your first historical era
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'structure' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Social structure editor will be displayed here</p>
                  </div>
                )}
                
                {activeTab === 'history' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Historical timeline editor will be displayed here</p>
                  </div>
                )}
                
                {activeTab === 'demographics' && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Population and demographics editor will be displayed here</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900 bg-opacity-20 mb-4">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Civilization Selected</h2>
                <p className="text-gray-400 mb-6">
                  Select an existing civilization from the sidebar or create a new one to begin building your world's societies.
                </p>
                <button
                  onClick={handleCreateCiv}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <PlusCircle className="mr-2" size={18} />
                  <span>Create New Civilization</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};