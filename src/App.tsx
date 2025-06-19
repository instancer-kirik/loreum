import React from 'react';
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
import { AppContextProvider, useAppContext } from './context/AppContext';
import { Project } from './types';

function AppContent() {
  const { currentPage } = useAppContext();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardAlt onSelectProject={(project) => {
          // Legacy support - this will be handled by the new navigation system
        }} />;
      case 'multiverse':
        return <MultiverseExplorer />;
      case 'universe':
        return <MultiverseExplorer />; // For now, reuse the explorer
      case 'timeline':
        return <MultiverseExplorer />; // For now, reuse the explorer
      case 'world':
        return <MultiverseExplorer />; // For now, reuse the explorer
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
      case 'characters':
        return <IpsumariumVault />; // Characters are managed through templates
      case 'astraloom':
        return <MultiverseExplorer />; // Star navigation through multiverse
      case 'artboard':
        return <AssetManager />; // Visual assets remain here
      case 'config':
        return <IpsumariumVault />; // Configuration templates
      default:
        return <DashboardAlt onSelectProject={() => {}} />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;