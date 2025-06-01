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
    { id: 'dashboard', icon: <FaPlus size={20} />, label: 'Dashboard', disabled: false },
    { id: 'civilization', icon: <FaUsers size={20} />, label: 'Civilization', disabled: !currentProject },
    { id: 'tech-tree', icon: <FaCode size={20} />, label: 'Tech Tree', disabled: !currentProject },
    { id: 'lore', icon: <FaNetworkWired size={20} />, label: 'Lore Graph', disabled: !currentProject },
    { id: 'region', icon: <FaMap size={20} />, label: 'Region Editor', disabled: !currentProject },
    { id: 'planetary', icon: <FaGlobe size={20} />, label: 'Planetary', disabled: !currentProject },
    { id: 'culture', icon: <FaPalette size={20} />, label: 'Culture', disabled: !currentProject },
    { id: 'narrative', icon: <FaBook size={20} />, label: 'Narrative', disabled: !currentProject },
    { id: 'items', icon: <FaBox size={20} />, label: 'Items', disabled: !currentProject },
    { id: 'assets', icon: <FaDatabase size={20} />, label: 'Asset Manager', disabled: !currentProject },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-center py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-sm opacity-70"></div>
            <div className="relative bg-gray-900 p-3 rounded-lg border border-gray-700">
              <FaGlobe className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => !item.disabled && setCurrentPage(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-purple-900 bg-opacity-50 text-purple-400'
                    : item.disabled 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <FaUser size={18} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Creator</p>
              <p className="text-xs text-gray-400">Free Plan</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <FaCog size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};