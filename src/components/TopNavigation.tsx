import React from 'react';
import { 
  FaHome,
  FaAtom,
  FaGlobe,
  FaUsers,
  FaCog,
  FaPalette,
  FaBook,
  FaBox,
  FaDatabase,
  FaTheaterMasks,
  FaNetworkWired,
  FaMap,
  FaLayerGroup,
  FaRocket,
  FaPaintBrush,
  FaRoad,
  FaCode,
  FaMagic,
  FaFire,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaHome className="h-4 w-4" /> },
  { id: 'multiverse', label: 'Multiverse', icon: <FaAtom className="h-4 w-4" /> },
  { id: 'ipsumarium', label: 'Content', icon: <FaDatabase className="h-4 w-4" /> },
  { id: 'characters', label: 'Characters', icon: <FaTheaterMasks className="h-4 w-4" /> },
  { id: 'civilization', label: 'Civilizations', icon: <FaUsers className="h-4 w-4" /> },
  { id: 'culture', label: 'Culture', icon: <FaPalette className="h-4 w-4" /> },
  { id: 'region', label: 'Regions', icon: <FaMap className="h-4 w-4" /> },
  { id: 'planetary', label: 'Structures', icon: <FaLayerGroup className="h-4 w-4" /> },
  { id: 'tech-tree', label: 'Tech Trees', icon: <FaCog className="h-4 w-4" /> },
  { id: 'magic-systems', label: 'Magic', icon: <FaMagic className="h-4 w-4" /> },
  { id: 'items', label: 'Items', icon: <FaBox className="h-4 w-4" /> },
  { id: 'lore', label: 'Lore', icon: <FaNetworkWired className="h-4 w-4" /> },
  { id: 'narrative', label: 'Narrative', icon: <FaBook className="h-4 w-4" /> },
  { id: 'astraloom', label: 'Astraloom', icon: <FaRocket className="h-4 w-4" />, comingSoon: true },
  { id: 'artboard', label: 'Artboard', icon: <FaPaintBrush className="h-4 w-4" />, comingSoon: true },
  { id: 'roadmap', label: 'Roadmap', icon: <FaRoad className="h-4 w-4" /> }
];

export const TopNavigation: React.FC = () => {
  const { currentPage, setCurrentPage, isMobileSidebarOpen, setIsMobileSidebarOpen } = useAppContext();

  return (
    <nav className="border-b border-cosmic-light border-opacity-20 bg-cosmic-deep/95 backdrop-blur-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 rounded-lg glass-panel border border-cosmic-light hover:border-flame-blue/30 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileSidebarOpen ? (
                <FaTimes className="h-5 w-5 text-flame-blue" />
              ) : (
                <FaBars className="h-5 w-5 text-glyph-accent" />
              )}
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-flame-blue to-flame-orange blur-lg opacity-70"></div>
                <div className="relative glass-panel p-2 rounded-lg flex items-center justify-center">
                  <FaFire className="h-5 w-5 text-flame-blue" style={{ filter: 'drop-shadow(0 0 5px var(--flame-orange))' }} />
                </div>
              </div>
              <div>
                <div className="loreum-title text-lg text-glyph-bright">Loreum</div>
                <div className="text-xs text-glyph-accent">Architect Whatever</div>
              </div>
            </div>
          </div>

          {/* Navigation Items - Hidden on mobile, shown on tablet+ */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.comingSoon && setCurrentPage(item.id)}
                disabled={item.comingSoon}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${currentPage === item.id
                    ? 'bg-flame-blue/20 text-flame-blue border border-flame-blue/30'
                    : item.comingSoon
                      ? 'text-glyph-secondary cursor-not-allowed opacity-50'
                      : 'text-glyph-accent hover:text-glyph-bright hover:bg-cosmic-medium/50'
                  }
                `}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
                {item.comingSoon && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('config')}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${currentPage === 'config'
                  ? 'bg-flame-blue/20 text-flame-blue'
                  : 'text-glyph-accent hover:text-glyph-bright hover:bg-cosmic-medium/50'
                }
              `}
              title="Settings"
            >
              <FaCog className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage('debug-supabase')}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${currentPage === 'debug-supabase'
                  ? 'bg-flame-blue/20 text-flame-blue'
                  : 'text-glyph-accent hover:text-glyph-bright hover:bg-cosmic-medium/50'
                }
              `}
              title="Debug"
            >
              <FaCode className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};