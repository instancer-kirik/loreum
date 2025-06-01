import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CivilizationBuilder } from './pages/CivilizationBuilder';
import { TechTreeDesigner } from './pages/TechTreeDesigner';
import { LoreGraph } from './pages/LoreGraph';
import { RegionEditor } from './pages/RegionEditor';
import { PlanetaryStructures } from './pages/PlanetaryStructures';
import { CultureDesigner } from './pages/CultureDesigner';
import { NarrativeLayer } from './pages/NarrativeLayer';
import { ItemEditor } from './pages/ItemEditor';
import { AppContext } from './context/AppContext';
import { Project } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onSelectProject={(project) => {
          setCurrentProject(project);
          setCurrentPage('civilization');
        }} />;
      case 'civilization':
        return <CivilizationBuilder />;
      case 'tech-tree':
        return <TechTreeDesigner />;
      case 'lore':
        return <LoreGraph />;
      case 'region':
        return <RegionEditor />;
      case 'planetary':
        return <PlanetaryStructures />;
      case 'culture':
        return <CultureDesigner />;
      case 'narrative':
        return <NarrativeLayer />;
      case 'items':
        return <ItemEditor />;
      default:
        return <Dashboard onSelectProject={(project) => {
          setCurrentProject(project);
          setCurrentPage('civilization');
        }} />;
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentProject, 
      setCurrentProject,
      currentPage,
      setCurrentPage
    }}>
      <Layout>
        {renderPage()}
      </Layout>
    </AppContext.Provider>
  );
}

export default App;