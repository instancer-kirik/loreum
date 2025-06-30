import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { FaUser, FaSignOutAlt, FaCog, FaChevronDown } from 'react-icons/fa';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { setCurrentPage } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => setCurrentPage('login')}
        className="glass-panel px-3 py-1.5 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors flex items-center gap-2 text-sm"
      >
        <FaUser size={14} />
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel p-1.5 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors flex items-center gap-1 group"
        title={user.email || 'User Account'}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-circuit-energy to-circuit-magic flex items-center justify-center">
          <FaUser size={12} className="text-cosmic-deepest" />
        </div>
        <FaChevronDown 
          size={10} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass-panel border border-cosmic-light border-opacity-30 rounded-lg overflow-hidden z-[9999]">
          {/* User info */}
          <div className="px-4 py-3 border-b border-cosmic-light border-opacity-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-circuit-energy to-circuit-magic flex items-center justify-center">
                <FaUser size={18} className="text-cosmic-deepest" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-glyph-bright truncate">
                  {user.email}
                </div>
                <div className="text-xs text-glyph-accent">
                  {user.id ? `ID: ${user.id.slice(0, 8)}...` : 'User Account'}
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button
              onClick={() => {
                setCurrentPage('account-settings');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-glyph-accent hover:text-glyph-bright hover:bg-cosmic-medium transition-colors flex items-center gap-3"
            >
              <FaCog size={16} />
              <span>Account Settings</span>
            </button>

            <div className="my-2 border-t border-cosmic-light border-opacity-20" />

            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full px-4 py-2 text-left text-glyph-accent hover:text-glyph-bright hover:bg-cosmic-medium transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSignOutAlt size={16} />
              <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>

          {/* Pro tip */}
          <div className="px-4 py-3 bg-cosmic-medium bg-opacity-50 border-t border-cosmic-light border-opacity-20">
            <p className="text-xs text-glyph-accent">
              <span className="text-circuit-energy">Tip:</span> Your data is stored securely in Supabase with row-level security.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};