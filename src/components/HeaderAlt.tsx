import React from 'react';
import { FaAtom, FaBars, FaSearch, FaBell, FaCog, FaUser } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

export const HeaderAlt: React.FC = () => {
  const { currentProject } = useAppContext();

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-gray-400 hover:text-white">
            <FaBars size={24} />
          </button>
          <div className="flex items-center">
            <FaAtom className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-white">SciForge</h1>
          </div>
          {currentProject && (
            <div className="hidden md:flex items-center ml-6 space-x-1">
              <span className="text-gray-400">Project:</span>
              <span className="font-medium text-white">{currentProject.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 text-white rounded-md py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <button className="text-gray-400 hover:text-white">
            <FaBell size={20} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <FaCog size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <FaUser size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};