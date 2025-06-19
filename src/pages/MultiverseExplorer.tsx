import React, { useState, useEffect } from 'react';
import { FaPlus, FaAtom, FaClock, FaArrowRight, FaGlobe, FaUsers, FaBook } from 'react-icons/fa';
import { Multiverse, Universe } from '../types';
import { useAppContext } from '../context/AppContext';
import { universeService, timelineService, worldService } from '../integrations/supabase/database';

export const MultiverseExplorer: React.FC = () => {
  const { 
    multiverses, 
    isLoading, 
    error, 
    loadMultiverses,
    navigationContext, 
    currentMultiverse, 
    currentUniverse, 
    currentTimeline, 
    currentWorld,
    setCurrentMultiverse, 
    setCurrentUniverse, 
    setCurrentTimeline,
    setCurrentWorld,
    navigateToLevel 
  } = useAppContext();
  
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [timelines, setTimelines] = useState<any[]>([]);
  const [worlds, setWorlds] = useState<any[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);

  // Load data based on current navigation context
  useEffect(() => {
    const loadData = async () => {
      try {
        switch (navigationContext.level) {
          case 'multiverse':
            await loadMultiverses();
            break;
          case 'universe':
            if (currentMultiverse) {
              const universesData = await universeService.getByMultiverseId(currentMultiverse.id);
              setUniverses(universesData);
            }
            break;
          case 'timeline':
            if (currentUniverse) {
              const timelinesData = await timelineService.getByUniverseId(currentUniverse.id);
              setTimelines(timelinesData);
            }
            break;
          case 'world':
            if (currentTimeline) {
              const worldsData = await worldService.getByTimelineId(currentTimeline.id);
              setWorlds(worldsData);
            }
            break;
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, [navigationContext.level, currentMultiverse, currentUniverse, currentTimeline]);

  const handleSelectItem = async (item: any) => {
    switch (navigationContext.level) {
      case 'multiverse':
        setCurrentMultiverse(item);
        navigateToLevel('universe');
        break;
      case 'universe':
        setCurrentUniverse(item);
        navigateToLevel('timeline');
        break;
      case 'timeline':
        setCurrentTimeline(item);
        navigateToLevel('world');
        break;
      case 'world':
        setCurrentWorld(item);
        navigateToLevel('civilization');
        break;
    }
  };

  const getDisplayData = () => {
    switch (navigationContext.level) {
      case 'multiverse':
        return multiverses;
      case 'universe':
        return universes;
      case 'timeline':
        return timelines;
      case 'world':
        return worlds;
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (navigationContext.level) {
      case 'multiverse':
        return 'Multiverse Explorer';
      case 'universe':
        return `Universe Explorer - ${currentMultiverse?.name}`;
      case 'timeline':
        return `Timeline Explorer - ${currentUniverse?.name}`;
      case 'world':
        return `World Explorer - ${currentTimeline?.name}`;
      default:
        return 'Explorer';
    }
  };

  const getDescription = () => {
    switch (navigationContext.level) {
      case 'multiverse':
        return 'Navigate the infinite possibilities of existence across parallel realities';
      case 'universe':
        return 'Explore the physical laws and structure of this universe';
      case 'timeline':
        return 'Navigate through the temporal flow of events and history';
      case 'world':
        return 'Discover the worlds and their unique characteristics';
      default:
        return 'Explore the cosmic hierarchy';
    }
  };

  const getItemIcon = () => {
    switch (navigationContext.level) {
      case 'multiverse':
        return FaAtom;
      case 'universe':
        return FaGlobe;
      case 'timeline':
        return FaClock;
      case 'world':
        return FaGlobe;
      default:
        return FaAtom;
    }
  };

  const displayData = getDisplayData();
  const IconComponent = getItemIcon();

  return (
    <div className="h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glyph-bright mb-2 font-serif">{getTitle()}</h1>
        <p className="text-glyph-accent">{getDescription()}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mb-6 text-center">
          <p className="text-glyph-accent">Loading...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Item Card */}
        {navigationContext.level === 'multiverse' && (
          <div 
            onClick={() => setShowNewModal(true)}
            className="glass-panel border-2 border-dashed border-cosmic-light border-opacity-30 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-flame-blue hover:border-opacity-50 transition-all duration-300 h-80"
          >
            <div className="w-16 h-16 bg-flame-blue bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <FaPlus className="h-8 w-8 text-flame-blue" />
            </div>
            <h3 className="text-xl font-medium text-glyph-bright mb-2 font-serif">Create New {navigationContext.level}</h3>
            <p className="text-glyph-accent text-center">Begin a new cosmic framework with its own rules and realities</p>
          </div>
        )}
        
        {/* Item Cards */}
        {displayData.map((item: any) => (
          <div 
            key={item.id}
            onClick={() => handleSelectItem(item)}
            className="glass-panel border border-cosmic-light border-opacity-20 overflow-hidden cursor-pointer hover:border-flame-blue hover:border-opacity-50 transition-all duration-300 h-80 flex flex-col"
          >
            <div className="h-1/3 bg-gradient-to-br from-flame-blue via-circuit-energy to-flame-orange relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <IconComponent className="h-16 w-16 text-glyph-bright opacity-30" />
              </div>
              <div className="absolute top-2 right-2">
                <span className="text-xs bg-cosmic-deep bg-opacity-70 text-glyph-bright px-2 py-1 rounded-full">
                  {navigationContext.level}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-medium text-glyph-bright mb-2 font-serif">{item.name}</h3>
              <p className="text-glyph-accent mb-4 flex-grow text-sm leading-relaxed">{item.description}</p>
              
              <div className="space-y-2 mb-4">
                {item.createdAt && (
                  <div className="flex items-center text-sm text-glyph-accent">
                    <FaClock className="mr-2" size={12} />
                    <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {item.startYear && (
                  <div className="flex items-center text-sm text-glyph-accent">
                    <FaClock className="mr-2" size={12} />
                    <span>Start: {item.startYear}</span>
                  </div>
                )}
                {item.type && (
                  <div className="flex items-center text-sm text-glyph-accent">
                    <FaGlobe className="mr-2" size={12} />
                    <span>Type: {item.type}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full">
                    Active
                  </span>
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

      {/* Note: Modal removed - using dedicated NewProjectModal from Dashboard */}
    </div>
  );
};