import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentProject } = useAppContext();

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="h-full p-6">
            {!currentProject && 
              <div className="absolute inset-0 bg-[#0F172A] opacity-20 pointer-events-none">
                <div className="absolute inset-0\" style={{ 
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(126, 34, 206, 0.1) 0%, transparent 50%), 
                                    radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)` 
                }} />
              </div>
            }
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};