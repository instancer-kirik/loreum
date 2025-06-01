import React, { createContext, useContext } from 'react';
import { Project } from '../types';

interface AppContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const AppContext = createContext<AppContextType>({
  currentProject: null,
  setCurrentProject: () => {},
  currentPage: 'dashboard',
  setCurrentPage: () => {},
});

export const useAppContext = () => useContext(AppContext);