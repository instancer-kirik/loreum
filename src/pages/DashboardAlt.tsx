import React, { useState, useEffect } from 'react';
import { FaPlus, FaGlobe, FaClock, FaArrowRight } from 'react-icons/fa';
import { Project } from '../types';
import { NewProjectModal } from '../components/NewProjectModal';
import { useAppContext } from '../context/AppContext';

interface DashboardProps {
  onSelectProject: (project: Project) => void;
}

export const DashboardAlt: React.FC<DashboardProps> = ({ onSelectProject }) => {
  const { multiverses, isLoading, error, loadMultiverses, navigateToLevel, setCurrentMultiverse, setCurrentPage } = useAppContext();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  useEffect(() => {
    loadMultiverses();
  }, []);

  const handleProjectSuccess = async () => {
    await loadMultiverses();
    // Navigate to civilization level
    navigateToLevel('civilization');
  };

  const handleMultiverseClick = async (multiverse: any) => {
    // Set the current multiverse
    setCurrentMultiverse(multiverse);
    // Navigate to universe level within the multiverse
    navigateToLevel('universe', multiverse.id);
  };

  return (
    <>
      <div className="h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Multiverse Dashboard</h1>
          <p className="text-gray-400">Select a multiverse to explore its universes, or create a new one</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        {isLoading && (
          <div className="mb-6 text-center">
            <p className="text-gray-400">Loading projects...</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Project Card */}
          <div 
            onClick={() => setShowNewProjectModal(true)}
            className="bg-gray-800 bg-opacity-60 rounded-lg border-2 border-dashed border-gray-700 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-opacity-80 transition-colors h-72"
          >
            <div className="w-16 h-16 bg-blue-900 bg-opacity-30 rounded-full flex items-center justify-center mb-4">
              <FaPlus className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Create New Multiverse</h3>
            <p className="text-gray-400 text-center">Start a new reality framework with its own physical laws</p>
          </div>
          
          {/* Multiverse Cards */}
          {multiverses.map(multiverse => (
            <div 
              key={multiverse.id}
              onClick={() => handleMultiverseClick(multiverse)}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden cursor-pointer hover:border-gray-600 transition-colors h-72 flex flex-col"
            >
              <div className="h-1/3 bg-gradient-to-r from-purple-900 to-blue-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaGlobe className="h-12 w-12 text-white opacity-30" />
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-medium text-white mb-2">{multiverse.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{multiverse.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FaClock className="mr-2" size={14} />
                  <span>Created: {multiverse.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-2" size={14} />
                  <span>Updated: {multiverse.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Contains: {Math.floor(Math.random() * 5) + 1} universes
                </div>
                <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                  <span className="mr-1">Explore</span>
                  <FaArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSuccess={handleProjectSuccess}
      />
    </>
  );
};