import React from 'react';
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
  FaHome
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

export const SidebarAlt: React.FC = () => {
  const { navigationContext, currentPage, setCurrentPage, navigateToLevel, getBreadcrumbs } = useAppContext();

  // Get menu items based on current navigation level
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', icon: <FaHome size={18} />, label: 'Dashboard', disabled: false },
    ];

    switch (navigationContext.level) {
      case 'multiverse':
        return [
          ...baseItems,
          { id: 'multiverse', icon: <FaAtom size={18} />, label: 'Multiverse', disabled: false },
          { id: 'ipsumarium', icon: <FaDatabase size={18} />, label: 'Ipsumarium', disabled: false },
          { id: 'characters', icon: <FaTheaterMasks size={18} />, label: 'Characters', disabled: false },
          { id: 'config', icon: <FaCog size={18} />, label: 'Configuration', disabled: false },
        ];
      
      case 'universe':
        return [
          ...baseItems,
          { id: 'universe', icon: <FaGlobe size={18} />, label: 'Universe', disabled: false },
          { id: 'astraloom', icon: <FaRocket size={18} />, label: 'Astraloom', disabled: false },
          { id: 'ipsumarium', icon: <FaDatabase size={18} />, label: 'Ipsumarium', disabled: false },
        ];
      
      case 'timeline':
        return [
          ...baseItems,
          { id: 'timeline', icon: <FaScroll size={18} />, label: 'Timeline', disabled: false },
          { id: 'lore', icon: <FaNetworkWired size={18} />, label: 'Lore Graph', disabled: false },
          { id: 'narrative', icon: <FaBook size={18} />, label: 'Narrative', disabled: false },
        ];
      
      case 'world':
        return [
          ...baseItems,
          { id: 'world', icon: <FaGlobe size={18} />, label: 'World', disabled: false },
          { id: 'region', icon: <FaMap size={18} />, label: 'Regions', disabled: false },
          { id: 'planetary', icon: <FaLayerGroup size={18} />, label: 'Structures', disabled: false },
        ];
      
      case 'civilization':
        return [
          ...baseItems,
          { id: 'civilization', icon: <FaUsers size={18} />, label: 'Civilization', disabled: false },
          { id: 'tech-tree', icon: <FaCode size={18} />, label: 'Tech Tree', disabled: false },
          { id: 'culture', icon: <FaPalette size={18} />, label: 'Culture', disabled: false },
          { id: 'items', icon: <FaBox size={18} />, label: 'Items', disabled: false },
          { id: 'assets', icon: <FaDatabase size={18} />, label: 'Asset Manager', disabled: false },
        ];
      
      default:
        return [
          ...baseItems,
          { id: 'ipsumarium', icon: <FaDatabase size={18} />, label: 'Ipsumarium', disabled: false },
          { id: 'characters', icon: <FaTheaterMasks size={18} />, label: 'Characters', disabled: false },
          { id: 'artboard', icon: <FaPaintBrush size={18} />, label: 'Artboard', disabled: false },
          { id: 'config', icon: <FaCog size={18} />, label: 'Configuration', disabled: false },
        ];
    }
  };

  const menuItems = getMenuItems();
  const breadcrumbs = getBreadcrumbs();

  return (
    <aside className="hidden md:flex flex-col w-64 cosmic-sidebar relative z-20">
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
          {navigationContext.level === 'ipsumarium' && 'Template Vault'}
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
                onClick={() => !item.disabled && setCurrentPage(item.id)}
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
  );
};