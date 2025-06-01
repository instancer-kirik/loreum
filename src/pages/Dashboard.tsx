import React, { useState } from 'react';
import { PlusCircle, Globe, Clock, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  onSelectProject: (project: Project) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Aetheria',
      description: 'A steampunk world with floating islands and airship pirates',
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-02-10'),
      civilizations: [],
      techTrees: [],
      loreElements: [],
      regions: [],
      planetaryStructures: [],
      cultures: [],
      narratives: [],
      items: [],
      timelineStart: -5000,
      timelineEnd: 2500
    },
    {
      id: '2',
      name: 'Elysium',
      description: 'Post-singularity utopia with advanced biotech and AI governance',
      createdAt: new Date('2025-02-20'),
      updatedAt: new Date('2025-02-25'),
      civilizations: [],
      techTrees: [],
      loreElements: [],
      regions: [],
      planetaryStructures: [],
      cultures: [],
      narratives: [],
      items: [],
      timelineStart: 2100,
      timelineEnd: 3000
    }
  ]);
  
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
      civilizations: [],
      techTrees: [],
      loreElements: [],
      regions: [],
      planetaryStructures: [],
      cultures: [],
      narratives: [],
      items: [],
      timelineStart: -3000,
      timelineEnd: 3000
    };
    
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setNewProjectDescription('');
    setShowNewProjectModal(false);
    
    // Auto-select the new project
    onSelectProject(newProject);
  };

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Your Worlds</h1>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusCircle className="mr-2" size={20} />
            <span>New World</span>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-500 opacity-20 blur-md rounded-full"></div>
              <Globe className="relative text-purple-400 w-20 h-20" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No worlds yet</h2>
            <p className="text-gray-400 max-w-md mb-6">
              Create your first world to begin crafting detailed civilizations, technologies, and narratives.
            </p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusCircle className="mr-2" size={20} />
              <span>Create Your First World</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="h-40 bg-gradient-to-br from-purple-900 to-blue-900 relative overflow-hidden">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(126, 34, 206, 0.3) 0%, transparent 50%), 
                                      radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)` 
                  }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 mb-4 h-12 overflow-hidden">{project.description}</p>
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <Clock size={16} className="mr-1" />
                    <span>Updated {project.updatedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      <span className="inline-block px-2 py-1 bg-gray-700 rounded-md text-xs text-gray-300">
                        Timeline: {project.timelineStart} to {project.timelineEnd}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <span className="mr-1">Enter</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div 
              onClick={() => setShowNewProjectModal(true)}
              className="border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center h-80 cursor-pointer hover:border-purple-500/50 transition-all"
            >
              <div className="flex flex-col items-center text-gray-500 hover:text-purple-400 transition-colors">
                <PlusCircle size={40} className="mb-2" />
                <span className="font-medium">Create New World</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 py-4 px-6">
              <h2 className="text-xl font-bold text-white">Create New World</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">World Name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Aetheria, Elysium, Nova Terra"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                  placeholder="Briefly describe your world..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectName}
                  className={`px-4 py-2 rounded-lg ${
                    !newProjectName
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } transition-colors`}
                >
                  Create World
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};