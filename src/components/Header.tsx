import React, { useState } from 'react';
import { Wand2, Menu, Search, Bell, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const { currentProject } = useAppContext();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <Wand2 className="h-8 w-8 text-purple-400 mr-2" />
            <h1 className="text-xl font-bold text-white">Loreum</h1>
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
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <button className="text-gray-400 hover:text-white">
            <Bell size={20} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Settings size={20} />
          </button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <span className="hidden md:block">{user?.email}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isSigningOut ? 'Signing out...' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};