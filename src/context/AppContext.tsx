import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, NavigationContext, NavigationLevel, Multiverse, Universe, Timeline, World } from '../types';
import { multiverseService, universeService, timelineService, worldService, civilizationService, hierarchyService } from '../integrations/supabase/database';

interface AppContextType {
  // Legacy project system (for backward compatibility)
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Mobile navigation state
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  
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
  
  // Data loading states
  isLoading: boolean;
  error: string | null;
  
  // Data arrays
  multiverses: Multiverse[];
  
  // Navigation helpers
  navigateToLevel: (level: NavigationLevel, id?: string) => void;
  getBreadcrumbs: () => Array<{ level: NavigationLevel; name: string; id?: string }>;
  
  // Data operations
  loadMultiverses: () => Promise<void>;
  createHierarchy: (data: any) => Promise<{ multiverse: Multiverse; universe: Universe; timeline: Timeline; world: World }>;
}

export const AppContext = createContext<AppContextType>({
  currentProject: null,
  setCurrentProject: () => {},
  currentPage: 'dashboard',
  setCurrentPage: () => {},
  isMobileSidebarOpen: false,
  setIsMobileSidebarOpen: () => {},
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
  isLoading: false,
  error: null,
  multiverses: [],
  navigateToLevel: () => {},
  getBreadcrumbs: () => [],
  loadMultiverses: async () => {},
  createHierarchy: async () => ({ multiverse: {} as Multiverse, universe: {} as Universe, timeline: {} as Timeline, world: {} as World }),
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Legacy state
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Mobile navigation state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // New hierarchical state
  const [navigationContext, setNavigationContext] = useState<NavigationContext>({ level: 'multiverse' });
  const [currentMultiverse, setCurrentMultiverse] = useState<Multiverse | null>(null);
  const [currentUniverse, setCurrentUniverse] = useState<Universe | null>(null);
  const [currentTimeline, setCurrentTimeline] = useState<Timeline | null>(null);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  
  // Data loading states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [multiverses, setMultiverses] = useState<Multiverse[]>([]);
  
  // Load multiverses on mount
  useEffect(() => {
    loadMultiverses();
  }, []);

  const loadMultiverses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading multiverses...');
      const data = await multiverseService.getAll();
      console.log('Multiverses loaded successfully:', data);
      setMultiverses(data);
    } catch (err) {
      console.error('Failed to load multiverses:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load multiverses';
      setError(errorMessage);
      // Also log the full error for debugging
      if (err instanceof Error && err.stack) {
        console.error('Stack trace:', err.stack);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createHierarchy = async (data: {
    multiverseName: string;
    multiverseDescription: string;
    universeName: string;
    universeDescription: string;
    timelineName: string;
    timelineDescription: string;
    timelineStartYear: number;
    timelineEndYear?: number;
    worldName: string;
    worldDescription: string;
    worldType: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Creating hierarchy with data:', data);
      
      // Create the complete hierarchy
      const result = await hierarchyService.createCompleteHierarchy(data);
      console.log('Hierarchy created successfully:', result);
      
      // Update local state
      setCurrentMultiverse(result.multiverse);
      setCurrentUniverse(result.universe);
      setCurrentTimeline(result.timeline);
      setCurrentWorld(result.world);
      
      // Reload multiverses to include the new one
      await loadMultiverses();
      
      return result;
    } catch (err) {
      console.error('Failed to create hierarchy:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create hierarchy';
      setError(errorMessage);
      if (err instanceof Error && err.stack) {
        console.error('Stack trace:', err.stack);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLevel = async (level: NavigationLevel, id?: string) => {
    const newContext: NavigationContext = { level };
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Navigating to level:', level, 'with id:', id);

      switch (level) {
        case 'multiverse':
          setCurrentMultiverse(null);
          setCurrentUniverse(null);
          setCurrentTimeline(null);
          setCurrentWorld(null);
          break;
        case 'universe':
          if (id && currentMultiverse) {
            newContext.multiverseId = currentMultiverse.id;
            const universes = await universeService.getByMultiverseId(currentMultiverse.id);
            const universe = universes.find(u => u.id === id);
            if (universe) setCurrentUniverse(universe);
          }
          setCurrentTimeline(null);
          setCurrentWorld(null);
          break;
        case 'timeline':
          if (id && currentUniverse) {
            newContext.multiverseId = currentMultiverse?.id;
            newContext.universeId = currentUniverse.id;
            const timelines = await timelineService.getByUniverseId(currentUniverse.id);
            const timeline = timelines.find(t => t.id === id);
            if (timeline) setCurrentTimeline(timeline);
          }
          setCurrentWorld(null);
          break;
        case 'world':
          if (id && currentTimeline) {
            newContext.multiverseId = currentMultiverse?.id;
            newContext.universeId = currentUniverse?.id;
            newContext.timelineId = currentTimeline.id;
            const worlds = await worldService.getByTimelineId(currentTimeline.id);
            const world = worlds.find(w => w.id === id);
            if (world) setCurrentWorld(world);
          }
          break;
        case 'civilization':
          if (currentWorld) {
            newContext.multiverseId = currentMultiverse?.id;
            newContext.universeId = currentUniverse?.id;
            newContext.timelineId = currentTimeline?.id;
            newContext.worldId = currentWorld.id;
          }
          break;
      }
      
      setNavigationContext(newContext);
      setCurrentPage(level);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Navigation failed');
    } finally {
      setIsLoading(false);
    }
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
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
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
      isLoading,
      error,
      multiverses,
      navigateToLevel,
      getBreadcrumbs,
      loadMultiverses,
      createHierarchy,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);