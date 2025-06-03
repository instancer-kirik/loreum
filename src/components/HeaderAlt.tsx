import React from 'react';
import { FaAtom, FaBars, FaSearch, FaBell, FaCog, FaUser, FaStar, FaFlask } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

export const HeaderAlt: React.FC = () => {
  const { currentProject } = useAppContext();

  return (
    <header className="cosmic-header py-4 px-6 relative z-20">
      {/* Circuit line under header */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] circuit-line"></div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-glyph-accent hover:text-glyph-bright transition-colors">
            <FaBars size={22} />
          </button>
          
          <div className="flex items-center">
            <div className="mr-3 relative">
              <div className="absolute inset-0 bg-flame-blue rounded-full blur-md opacity-50 animate-pulse-glow"></div>
              <div className="relative flame-pot w-10 h-10 flex items-center justify-center">
                <FaAtom className="text-glyph-bright z-10" size={20} />
              </div>
            </div>
            <h1 className="loreum-title text-glyph-bright">Loreum</h1>
          </div>
          
          {currentProject && (
            <div className="hidden md:flex items-center ml-6 space-x-2">
              <span className="text-glyph-accent font-serif">Project:</span>
              <span className="font-medium text-glyph-bright font-serif tracking-wide">{currentProject.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-5">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-glyph-accent" size={16} />
            </div>
            <input
              type="text"
              placeholder="Search cosmic knowledge..."
              className="glass-panel py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-1 focus:ring-flame-blue text-glyph-primary bg-cosmic-medium bg-opacity-40"
            />
          </div>
          
          <button className="text-glyph-accent hover:text-flame-blue transition-colors relative">
            <FaStar size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-flame-orange rounded-full"></span>
          </button>
          
          <button className="text-glyph-accent hover:text-flame-blue transition-colors">
            <FaFlask size={20} />
          </button>
          
          <button className="text-glyph-accent hover:text-flame-blue transition-colors">
            <FaCog size={20} />
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 bg-circuit-energy rounded-full blur-sm opacity-50"></div>
            <div className="relative w-9 h-9 rounded-full bg-cosmic-medium flex items-center justify-center border border-cosmic-light">
              <FaUser className="text-glyph-bright" size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};