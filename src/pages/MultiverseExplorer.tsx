import React, { useState } from 'react';
import { FaPlus, FaAtom, FaClock, FaArrowRight, FaGlobe, FaUsers, FaBook } from 'react-icons/fa';
import { Multiverse, Universe } from '../types';
import { useAppContext } from '../context/AppContext';

export const MultiverseExplorer: React.FC = () => {
  const { setCurrentMultiverse, setCurrentUniverse, navigateToLevel } = useAppContext();
  const [multiverses, setMultiverses] = useState<Multiverse[]>([
    {
      id: '1',
      name: 'Aether Spiral',
      description: 'A cosmic framework where magic and technology intertwine across multiple realities',
      universes: [
        {
          id: 'u1',
          name: 'Prime Reality',
          description: 'The original universe where the first civilizations emerged',
          physicalLaws: {
            id: 'pl1',
            name: 'Standard Physics + Aether',
            description: 'Normal physics with magical aether fields',
            constants: { c: 299792458, planck: 6.626e-34, aether_density: 0.73 },
            magicSystemsAllowed: true,
            technologyLimits: ['FTL via aether manipulation', 'Quantum consciousness transfer']
          },
          timelines: [],
          multiverseId: '1'
        }
      ],
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-06-20')
    },
    {
      id: '2',
      name: 'Nexus Infinite',
      description: 'A hard sci-fi multiverse exploring the consequences of technological singularity',
      universes: [
        {
          id: 'u2',
          name: 'Post-Singularity Alpha',
          description: 'Reality shaped by artificial superintelligence',
          physicalLaws: {
            id: 'pl2',
            name: 'Enhanced Physics',
            description: 'Physics optimized by AI for maximum efficiency',
            constants: { c: 299792458, planck: 6.626e-34, ai_optimization: 0.97 },
            magicSystemsAllowed: false,
            technologyLimits: ['Matter compilation', 'Consciousness uploading', 'Reality simulation']
          },
          timelines: [],
          multiverseId: '2'
        }
      ],
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2023-07-15')
    }
  ]);

  const [showNewMultiverseModal, setShowNewMultiverseModal] = useState(false);
  const [newMultiverseName, setNewMultiverseName] = useState('');
  const [newMultiverseDescription, setNewMultiverseDescription] = useState('');

  const handleCreateMultiverse = () => {
    if (!newMultiverseName) return;
    
    const newMultiverse: Multiverse = {
      id: Date.now().toString(),
      name: newMultiverseName,
      description: newMultiverseDescription,
      universes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setMultiverses([...multiverses, newMultiverse]);
    setNewMultiverseName('');
    setNewMultiverseDescription('');
    setShowNewMultiverseModal(false);
  };

  const handleSelectMultiverse = (multiverse: Multiverse) => {
    setCurrentMultiverse(multiverse);
    navigateToLevel('universe');
  };

  return (
    <div className="h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glyph-bright mb-2 font-serif">Multiverse Explorer</h1>
        <p className="text-glyph-accent">Navigate the infinite possibilities of existence across parallel realities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Multiverse Card */}
        <div 
          onClick={() => setShowNewMultiverseModal(true)}
          className="glass-panel border-2 border-dashed border-cosmic-light border-opacity-30 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-flame-blue hover:border-opacity-50 transition-all duration-300 h-80"
        >
          <div className="w-16 h-16 bg-flame-blue bg-opacity-20 rounded-full flex items-center justify-center mb-4">
            <FaPlus className="h-8 w-8 text-flame-blue" />
          </div>
          <h3 className="text-xl font-medium text-glyph-bright mb-2 font-serif">Create New Multiverse</h3>
          <p className="text-glyph-accent text-center">Begin a new cosmic framework with its own rules and realities</p>
        </div>
        
        {/* Multiverse Cards */}
        {multiverses.map(multiverse => (
          <div 
            key={multiverse.id}
            onClick={() => handleSelectMultiverse(multiverse)}
            className="glass-panel border border-cosmic-light border-opacity-20 overflow-hidden cursor-pointer hover:border-flame-blue hover:border-opacity-50 transition-all duration-300 h-80 flex flex-col"
          >
            <div className="h-1/3 bg-gradient-to-br from-flame-blue via-circuit-energy to-flame-orange relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <FaAtom className="h-16 w-16 text-glyph-bright opacity-30" />
              </div>
              <div className="absolute top-2 right-2">
                <span className="text-xs bg-cosmic-deep bg-opacity-70 text-glyph-bright px-2 py-1 rounded-full">
                  {multiverse.universes.length} Universe{multiverse.universes.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-medium text-glyph-bright mb-2 font-serif">{multiverse.name}</h3>
              <p className="text-glyph-accent mb-4 flex-grow text-sm leading-relaxed">{multiverse.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-glyph-accent">
                  <FaClock className="mr-2" size={12} />
                  <span>Created: {multiverse.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-glyph-accent">
                  <FaClock className="mr-2" size={12} />
                  <span>Updated: {multiverse.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {multiverse.universes.length > 0 && (
                    <span className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <button className="flex items-center text-flame-blue hover:text-flame-cyan transition-colors">
                  <span className="mr-1 font-serif">Explore</span>
                  <FaArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Multiverse Modal */}
      {showNewMultiverseModal && (
        <div className="fixed inset-0 bg-cosmic-deepest bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md border border-cosmic-light border-opacity-30 overflow-hidden">
            <div className="bg-gradient-to-r from-flame-blue to-circuit-energy py-4 px-6">
              <h2 className="text-xl font-bold text-glyph-bright font-serif">Create New Multiverse</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-glyph-accent mb-1 font-serif">Multiverse Name</label>
                <input
                  type="text"
                  value={newMultiverseName}
                  onChange={(e) => setNewMultiverseName(e.target.value)}
                  className="w-full px-3 py-2 bg-cosmic-medium border border-cosmic-light border-opacity-30 rounded-md text-glyph-bright focus:outline-none focus:ring-2 focus:ring-flame-blue"
                  placeholder="e.g., Aether Spiral, Nexus Infinite"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-glyph-accent mb-1 font-serif">Description</label>
                <textarea
                  value={newMultiverseDescription}
                  onChange={(e) => setNewMultiverseDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-cosmic-medium border border-cosmic-light border-opacity-30 rounded-md text-glyph-bright focus:outline-none focus:ring-2 focus:ring-flame-blue h-24"
                  placeholder="Describe the fundamental nature and scope of this multiverse..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewMultiverseModal(false)}
                  className="px-4 py-2 bg-cosmic-light text-glyph-accent rounded-lg hover:bg-cosmic-medium transition-colors font-serif"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMultiverse}
                  disabled={!newMultiverseName}
                  className={`px-4 py-2 rounded-lg font-serif ${
                    !newMultiverseName
                      ? 'bg-cosmic-light text-glyph-accent cursor-not-allowed opacity-50'
                      : 'bg-flame-blue text-glyph-bright hover:bg-flame-cyan'
                  } transition-colors`}
                >
                  Create Multiverse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};