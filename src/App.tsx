import React from 'react';
import { Layout } from './components/Layout';
import { DashboardAlt } from './pages/DashboardAlt';
import { MultiverseExplorer } from './pages/MultiverseExplorer';
import { IpsumariumManager } from './pages/ContentManager';
import { CivilizationBuilder } from './pages/CivilizationBuilder';
import { TechTreeDesigner } from './pages/TechTreeDesigner';
import { LoreGraph } from './pages/LoreGraph';
import { RegionEditor } from './pages/RegionEditor';
import { PlanetaryStructuresEnhanced } from './pages/PlanetaryStructuresEnhanced';
import { CultureDesigner } from './pages/CultureDesigner';
import { NarrativeLayer } from './pages/NarrativeLayer';
import { ItemEditor } from './pages/ItemEditor';
import MagicSystemsManager from './pages/MagicSystemsManager';
import { CharactersManager } from './pages/CharactersManager';
import { Roadmap } from './pages/Roadmap';
import DatabaseTest from './components/DatabaseTest';
import MultiverseTest from './components/MultiverseTest';
import DebugSupabase from './components/DebugSupabase';

import AuthGuard from './components/Auth/AuthGuard';
import { AppContextProvider, useAppContext } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
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
        return <IpsumariumManager />;
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
        return <IpsumariumManager />;
      case 'characters':
        return <CharactersManager />;
      case 'astraloom':
        return <MultiverseExplorer />; // Star navigation through multiverse
      case 'artboard':
        return <IpsumariumManager />; // Visual assets remain here
      case 'config':
        return <IpsumariumManager />; // Configuration templates
      case 'template-instances':
        return <IpsumariumManager />;
      case 'database-test':
        return <DatabaseTest />;
      case 'magic-systems':
        return <MagicSystemsManager />;
      case 'roadmap':
        return <Roadmap />;
      case 'multiverse-test':
        return <MultiverseTest />;
      case 'debug-supabase':
        return <DebugSupabase />;
      default:
        return <DashboardAlt onSelectProject={() => {}} />;
    }
  };

  return (
    <AuthGuard>
      <Layout>
        {renderPage()}
      </Layout>
    </AuthGuard>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContextProvider>
        <AppContent />
      </AppContextProvider>
    </AuthProvider>
  );
}

export default App;