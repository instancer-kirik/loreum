import React from "react";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { DashboardAlt } from "./pages/DashboardAlt";
import { MultiverseExplorer } from "./pages/MultiverseExplorer";
import { IpsumariumManager } from "./pages/ContentManager";
import { CivilizationBuilder } from "./pages/CivilizationBuilder";
import { TechTreeDesigner } from "./pages/TechTreeDesigner";
import { LoreGraph } from "./pages/LoreGraph";
import { RegionEditor } from "./pages/RegionEditor";
import { PlanetaryStructuresEnhanced } from "./pages/PlanetaryStructuresEnhanced";
import { CultureDesigner } from "./pages/CultureDesigner";
import { NarrativeLayer } from "./pages/NarrativeLayer";
import { ItemEditor } from "./pages/ItemEditor";
import MagicSystemsManager from "./pages/MagicSystemsManager";
import { CharactersManager } from "./pages/CharactersManager";
import { CreativeWorkspace } from "./pages/CreativeWorkspace";
import { Roadmap } from "./pages/Roadmap";
import { Astraloom } from "./pages/Astraloom";
import { ContextDropsManager } from "./pages/ContextDropsManager";
import DatabaseTest from "./components/DatabaseTest";
import MultiverseTest from "./components/MultiverseTest";
import DebugSupabase from "./components/DebugSupabase";

import AuthGuard from "./components/Auth/AuthGuard";
import { AppContextProvider, useAppContext } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { Project } from "./types";

function AppContent() {
  const { currentPage } = useAppContext();

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <Landing />;
      case "dashboard":
        return (
          <DashboardAlt
            onSelectProject={(project) => {
              // Legacy support - this will be handled by the new navigation system
            }}
          />
        );
      case "multiverse":
        return <MultiverseExplorer />;
      case "universe":
        return <MultiverseExplorer />;
      case "timeline":
        return <MultiverseExplorer />;
      case "world":
        return <MultiverseExplorer />;
      case "ipsumarium":
        return <IpsumariumManager />;
      case "civilization":
        return <CivilizationBuilder />;
      case "tech-tree":
        return <TechTreeDesigner />;
      case "lore":
        return <LoreGraph />;
      case "region":
        return <RegionEditor />;
      case "planetary":
        return <PlanetaryStructuresEnhanced />;
      case "culture":
        return <CultureDesigner />;
      case "narrative":
        return <NarrativeLayer />;
      case "creative":
        return <CreativeWorkspace />;
      case "items":
        return <ItemEditor />;
      case "assets":
        return <IpsumariumManager />;
      case "characters":
        return <CharactersManager />;
      case "astraloom":
        return <Astraloom />;
      case "context-drops":
        return <ContextDropsManager />;
      case "artboard":
        return <IpsumariumManager />; // Visual assets remain here
      case "config":
        return <IpsumariumManager />; // Configuration templates
      case "template-instances":
        return <IpsumariumManager />;
      case "database-test":
        return <DatabaseTest />;
      case "magic-systems":
        return <MagicSystemsManager />;
      case "roadmap":
        return <Roadmap />;
      case "multiverse-test":
        return <MultiverseTest />;
      case "debug-supabase":
        return <DebugSupabase />;
      default:
        return <Landing />;
    }
  };

  return currentPage === "landing" ? (
    renderPage()
  ) : (
    <AuthGuard>
      <Layout>{renderPage()}</Layout>
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
