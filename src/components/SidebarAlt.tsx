import React, { useEffect } from 'react';
import { 
  FaUsers,
  FaCode,
  FaNetworkWired,
  FaMap,
  FaGlobe,
  FaPalette,
  FaBook,
  FaBox,
  FaDatabase,
  FaPlus,
  FaCog,
  FaUser,
  FaAtom,
  FaRocket,
  FaTheaterMasks,
  FaPaintBrush,
  FaScroll,
  FaLayerGroup,
  FaHome,
  FaLink,
  FaRoad
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

export const SidebarAlt: React.FC = () => {
  const { navigationContext, currentPage, setCurrentPage, navigateToLevel, getBreadcrumbs, isMobileSidebarOpen, setIsMobileSidebarOpen } = useAppContext();

  // Get menu items - unified navigation with context-specific sections
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', icon: <FaHome size={18} />, label: 'Dashboard', disabled: false },
    ];

    // Core tools always available
    const coreItems = [
      { id: 'ipsumarium', icon: <FaDatabase size={18} />, label: 'Content Manager', disabled: false },
      { id: 'characters', icon: <FaTheaterMasks size={18} />, label: 'Characters', disabled: false },
    ];

    // Context-specific items
    const contextItems = [];
    
    switch (navigationContext.level) {
      case 'multiverse':
        contextItems.push(
          { id: 'multiverse', icon: <FaAtom size={18} />, label: 'Multiverse', disabled: false }
        );
        break;
      
      case 'universe':
        contextItems.push(
          { id: 'universe', icon: <FaGlobe size={18} />, label: 'Universe', disabled: false },
          { id: 'astraloom', icon: <FaRocket size={18} />, label: 'Astraloom', disabled: false }
        );
        break;
      
      case 'timeline':
        contextItems.push(
          { id: 'timeline', icon: <FaScroll size={18} />, label: 'Timeline', disabled: false },
          { id: 'lore', icon: <FaNetworkWired size={18} />, label: 'Lore Graph', disabled: false },
          { id: 'narrative', icon: <FaBook size={18} />, label: 'Narrative', disabled: false }
        );
        break;
      
      case 'world':
        contextItems.push(
          { id: 'world', icon: <FaGlobe size={18} />, label: 'World', disabled: false },
          { id: 'region', icon: <FaMap size={18} />, label: 'Regions', disabled: false },
          { id: 'planetary', icon: <FaLayerGroup size={18} />, label: 'Structures', disabled: false },
          { id: 'lore', icon: <FaNetworkWired size={18} />, label: 'Lore Graph', disabled: false },
          { id: 'narrative', icon: <FaBook size={18} />, label: 'Narrative', disabled: false }
        );
        break;
      
      case 'civilization':
        contextItems.push(
          { id: 'civilization', icon: <FaUsers size={18} />, label: 'Civilization', disabled: false },
          { id: 'tech-tree', icon: <FaCog size={18} />, label: 'Tech Tree', disabled: false },
          { id: 'culture', icon: <FaPalette size={18} />, label: 'Culture', disabled: false },
          { id: 'items', icon: <FaBox size={18} />, label: 'Items', disabled: false }
        );
        break;
    }

    // System tools always at bottom
    const systemItems = [
      { id: 'magic-systems', icon: <FaAtom size={18} />, label: 'Magic Systems', disabled: false },
      { id: 'roadmap', icon: <FaRoad size={18} />, label: 'Roadmap', disabled: false },
      { id: 'config', icon: <FaCog size={18} />, label: 'Configuration', disabled: false },
      { id: 'debug-supabase', icon: <FaCode size={18} />, label: 'Debug DB', disabled: false },
    ];

    return [...baseItems, ...contextItems, ...coreItems, ...systemItems];
  };

  const menuItems = getMenuItems();
  const breadcrumbs = getBreadcrumbs();

  // Close mobile sidebar when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen, setIsMobileSidebarOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        flex flex-col w-64 cosmic-sidebar relative z-50 transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:z-20
        fixed md:static inset-y-0 left-0
      `}>
        {/* Vertical circuit line */}
        <div className="absolute top-0 right-0 h-full w-[1px] circuit-line-v"></div>
      
      <div className="p-4">
        <div className="flex items-center justify-center py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-flame-blue to-flame-orange blur-lg opacity-70"></div>
            <div className="relative glass-panel p-3 rounded-lg flex items-center justify-center">
              <FaGlobe className="h-8 w-8 text-flame-blue" style={{ filter: 'drop-shadow(0 0 5px var(--flame-orange))' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <div className="mx-4 mb-4">
          <div className="circuit-line w-full h-[1px] mb-2"></div>
          <h3 className="text-xs font-serif text-glyph-accent tracking-wider mb-2">NAVIGATION PATH</h3>
          <div className="space-y-1">
            {breadcrumbs.map((crumb, index) => (
              <button
                key={crumb.id}
                onClick={() => navigateToLevel(crumb.level, crumb.id)}
                className="block w-full text-left text-sm text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                {'→'.repeat(index + 1)} {crumb.name}
              </button>
            ))}
          </div>
          <div className="circuit-line w-full h-[1px] mt-2"></div>
        </div>
      )}
      
      <div className="mx-4 mb-6">
        <div className="circuit-line w-full h-[1px] mb-2"></div>
        <h2 className="text-center font-serif text-lg text-glyph-bright tracking-wider">
          {navigationContext.level === 'multiverse' && 'Cosmic Workshop'}
          {navigationContext.level === 'universe' && 'Universal Tools'}
          {navigationContext.level === 'timeline' && 'Temporal Forge'}
          {navigationContext.level === 'world' && 'World Architect'}
          {navigationContext.level === 'civilization' && 'Civilization Builder'}
          {navigationContext.level === 'ipsumarium' && 'Content Manager'}
          {navigationContext.level === 'characters' && 'Character Studio'}
          {navigationContext.level === 'lore' && 'Lore Weaver'}
          {navigationContext.level === 'astraloom' && 'Star Navigator'}
          {navigationContext.level === 'narrative' && 'Story Architect'}
          {navigationContext.level === 'artboard' && 'Visual Studio'}
          {navigationContext.level === 'config' && 'System Control'}
        </h2>
        <div className="circuit-line w-full h-[1px] mt-2"></div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 cosmic-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  if (!item.disabled) {
                    setCurrentPage(item.id);
                    setIsMobileSidebarOpen(false); // Close mobile sidebar when item is selected
                  }
                }}
                disabled={item.disabled}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                  currentPage === item.id
                    ? 'glass-panel text-glyph-bright font-medium border border-flame-blue border-opacity-30'
                    : item.disabled 
                      ? 'text-cosmic-light cursor-not-allowed opacity-40' 
                      : 'text-glyph-accent hover:glass-panel hover:text-glyph-bright'
                }`}
              >
                {currentPage === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-flame-blue rounded-r"></div>
                )}
                <span className={`mr-3 ${currentPage === item.id ? 'text-flame-blue' : ''}`}>{item.icon}</span>
                <span className="font-serif tracking-wide">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-cosmic-light border-opacity-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-circuit-magic rounded-full blur-sm opacity-50"></div>
              <div className="relative w-8 h-8 rounded-full bg-cosmic-medium flex items-center justify-center border border-cosmic-light">
                <FaUser className="text-glyph-bright" size={14} />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-serif text-glyph-bright">Architech</p>
              <p className="text-xs text-glyph-accent">
                {navigationContext.level === 'multiverse' && 'Cosmic Artisan'}
                {navigationContext.level === 'universe' && 'Universe Shaper'}
                {navigationContext.level === 'timeline' && 'Time Weaver'}
                {navigationContext.level === 'world' && 'World Builder'}
                {navigationContext.level === 'civilization' && 'Civilization Guide'}
                {!['multiverse', 'universe', 'timeline', 'world', 'civilization'].includes(navigationContext.level) && 'Creator'}
              </p>
            </div>
          </div>
          <button className="text-glyph-accent hover:text-flame-blue transition-colors">
            <FaCog size={16} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};