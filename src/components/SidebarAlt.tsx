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
  FaUser
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

export const SidebarAlt: React.FC = () => {
  const { currentPage, setCurrentPage, currentProject } = useAppContext();

  const menuItems = [
    { id: 'dashboard', icon: <FaPlus size={18} />, label: 'Dashboard', disabled: false },
    { id: 'civilization', icon: <FaUsers size={18} />, label: 'Civilization', disabled: !currentProject },
    { id: 'tech-tree', icon: <FaCode size={18} />, label: 'Tech Tree', disabled: !currentProject },
    { id: 'lore', icon: <FaNetworkWired size={18} />, label: 'Lore Graph', disabled: !currentProject },
    { id: 'region', icon: <FaMap size={18} />, label: 'Region Editor', disabled: !currentProject },
    { id: 'planetary', icon: <FaGlobe size={18} />, label: 'Planetary', disabled: !currentProject },
    { id: 'culture', icon: <FaPalette size={18} />, label: 'Culture', disabled: !currentProject },
    { id: 'narrative', icon: <FaBook size={18} />, label: 'Narrative', disabled: !currentProject },
    { id: 'items', icon: <FaBox size={18} />, label: 'Items', disabled: !currentProject },
    { id: 'assets', icon: <FaDatabase size={18} />, label: 'Asset Manager', disabled: !currentProject },
  ];

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
      
      <div className="mx-4 mb-6">
        <div className="circuit-line w-full h-[1px] mb-2"></div>
        <h2 className="text-center font-serif text-lg text-glyph-bright tracking-wider">Architect Tools</h2>
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
              <p className="text-xs text-glyph-accent">Cosmic Artisan</p>
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