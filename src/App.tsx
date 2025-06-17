import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardAlt } from './pages/DashboardAlt';
import { MultiverseExplorer } from './pages/MultiverseExplorer';
import { IpsumariumVault } from './pages/IpsumariumVault';
import { CivilizationBuilder } from './pages/CivilizationBuilder';
import { TechTreeDesigner } from './pages/TechTreeDesigner';
import { LoreGraph } from './pages/LoreGraph';
import { RegionEditor } from './pages/RegionEditor';
import { PlanetaryStructuresEnhanced } from './pages/PlanetaryStructuresEnhanced';
import { CultureDesigner } from './pages/CultureDesigner';
import { NarrativeLayer } from './pages/NarrativeLayer';
import { ItemEditor } from './pages/ItemEditor';
import { AssetManager } from './pages/AssetManager';
import { AppContextProvider } from './context/AppContext';
import { Project } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardAlt onSelectProject={(project) => {
          setCurrentProject(project);
          setCurrentPage('civilization');
        }} />;
      case 'multiverse':
        return <MultiverseExplorer />;
      case 'ipsumarium':
        return <IpsumariumVault />;
      case 'civilization':
        return <CivilizationBuilder />;
      case 'tech-tree':
        return <TechTreeDesigner />;
      case 'lore':
        return <LoreGraph />;
      case 'region':
        return <RegionEditor />;
      case 'planetary':
        return <PlanetaryStructuresEnhanced />;
      case 'culture':
        return <CultureDesigner />;
      case 'narrative':
        return <NarrativeLayer />;
      case 'items':
        return <ItemEditor />;
      case 'assets':
        return <AssetManager />;
      default:
        return <MultiverseExplorer />;
    }
  };

  return (
    <AppContextProvider>
      <Layout>
        {renderPage()}
      </Layout>
    </AppContextProvider>
  );
}

export default App;