import React, { createContext, useContext, useState } from 'react';
import { Project, NavigationContext, NavigationLevel, Multiverse, Universe, Timeline, World } from '../types';

interface AppContextType {
  // Legacy project system (for backward compatibility)
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // New hierarchical navigation system
  navigationContext: NavigationContext;
  setNavigationContext: (context: NavigationContext) => void;
  
  // Hierarchical data
  currentMultiverse: Multiverse | null;
  setCurrentMultiverse: (multiverse: Multiverse | null) => void;
  currentUniverse: Universe | null;
  setCurrentUniverse: (universe: Universe | null) => void;
  currentTimeline: Timeline | null;
  setCurrentTimeline: (timeline: Timeline | null) => void;
  currentWorld: World | null;
  setCurrentWorld: (world: World | null) => void;
  
  // Navigation helpers
  navigateToLevel: (level: NavigationLevel, id?: string) => void;
  getBreadcrumbs: () => Array<{ level: NavigationLevel; name: string; id?: string }>;
}

export const AppContext = createContext<AppContextType>({
  currentProject: null,
  setCurrentProject: () => {},
  currentPage: 'dashboard',
  setCurrentPage: () => {},
  navigationContext: { level: 'multiverse' },
  setNavigationContext: () => {},
  currentMultiverse: null,
  setCurrentMultiverse: () => {},
  currentUniverse: null,
  setCurrentUniverse: () => {},
  currentTimeline: null,
  setCurrentTimeline: () => {},
  currentWorld: null,
  setCurrentWorld: () => {},
  navigateToLevel: () => {},
  getBreadcrumbs: () => [],
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Legacy state
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // New hierarchical state
  const [navigationContext, setNavigationContext] = useState<NavigationContext>({ level: 'multiverse' });
  const [currentMultiverse, setCurrentMultiverse] = useState<Multiverse | null>(null);
  const [currentUniverse, setCurrentUniverse] = useState<Universe | null>(null);
  const [currentTimeline, setCurrentTimeline] = useState<Timeline | null>(null);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  
  const navigateToLevel = (level: NavigationLevel, id?: string) => {
    const newContext: NavigationContext = { level };
    
    switch (level) {
      case 'multiverse':
        setCurrentMultiverse(null);
        setCurrentUniverse(null);
        setCurrentTimeline(null);
        setCurrentWorld(null);
        break;
      case 'universe':
        if (id) newContext.multiverseId = currentMultiverse?.id;
        setCurrentUniverse(null);
        setCurrentTimeline(null);
        setCurrentWorld(null);
        break;
      case 'timeline':
        if (id) {
          newContext.multiverseId = currentMultiverse?.id;
          newContext.universeId = currentUniverse?.id;
        }
        setCurrentTimeline(null);
        setCurrentWorld(null);
        break;
      case 'world':
        if (id) {
          newContext.multiverseId = currentMultiverse?.id;
          newContext.universeId = currentUniverse?.id;
          newContext.timelineId = currentTimeline?.id;
        }
        setCurrentWorld(null);
        break;
      case 'civilization':
        if (id) {
          newContext.multiverseId = currentMultiverse?.id;
          newContext.universeId = currentUniverse?.id;
          newContext.timelineId = currentTimeline?.id;
          newContext.worldId = currentWorld?.id;
        }
        break;
    }
    
    setNavigationContext(newContext);
    setCurrentPage(level);
  };
  
  const getBreadcrumbs = () => {
    const breadcrumbs: Array<{ level: NavigationLevel; name: string; id?: string }> = [];
    
    if (currentMultiverse) {
      breadcrumbs.push({ level: 'multiverse', name: currentMultiverse.name, id: currentMultiverse.id });
    }
    if (currentUniverse) {
      breadcrumbs.push({ level: 'universe', name: currentUniverse.name, id: currentUniverse.id });
    }
    if (currentTimeline) {
      breadcrumbs.push({ level: 'timeline', name: currentTimeline.name, id: currentTimeline.id });
    }
    if (currentWorld) {
      breadcrumbs.push({ level: 'world', name: currentWorld.name, id: currentWorld.id });
    }
    
    return breadcrumbs;
  };

  return (
    <AppContext.Provider value={{
      currentProject,
      setCurrentProject,
      currentPage,
      setCurrentPage,
      navigationContext,
      setNavigationContext,
      currentMultiverse,
      setCurrentMultiverse,
      currentUniverse,
      setCurrentUniverse,
      currentTimeline,
      setCurrentTimeline,
      currentWorld,
      setCurrentWorld,
      navigateToLevel,
      getBreadcrumbs,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);