import React, { useEffect, useState } from 'react';
import { MegaMenu } from './MegaMenu';
import { UserMenu } from './UserMenu';
import { useAppContext } from '../context/AppContext';
import { FaFire } from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

// Helper component for floating fire pots
const FirePot: React.FC<{ size: string, delay: string, top: string, left: string }> = ({ size, delay, top, left }) => {
  return (
    <div 
      className={`absolute ${size} flame-pot animate-float`}
      style={{ 
        top, 
        left, 
        animationDelay: delay 
      }}
    >
      {/* Pot container */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl">
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-radial from-orange-600/30 to-transparent" />
      </div>
      
      {/* Fire container */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-visible">
        {/* Multiple flame layers for depth */}
        <div className="relative w-3/4 h-3/4">
          {/* Outer flame glow */}
          <div className="absolute inset-0 -top-1/2 animate-flame-glow rounded-full bg-gradient-radial from-yellow-400/20 via-orange-500/10 to-transparent blur-xl scale-150" />
          
          {/* Multiple flame strands */}
          <div className="absolute inset-0 -top-1/2">
            {/* Central flame strand */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/5 h-full animate-flame-flicker">
              <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-transparent rounded-b-full" 
                   style={{ clipPath: 'polygon(20% 100%, 50% 0%, 80% 100%)' }} />
            </div>
            
            {/* Left flame strand */}
            <div className="absolute left-1/4 bottom-0 w-2/5 h-4/5 animate-flame-dance" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-yellow-500 to-transparent rounded-b-full opacity-80" 
                   style={{ clipPath: 'polygon(30% 100%, 50% 0%, 70% 100%)' }} />
            </div>
            
            {/* Right flame strand */}
            <div className="absolute right-1/4 bottom-0 w-2/5 h-4/5 animate-flame-dance" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-yellow-500 to-transparent rounded-b-full opacity-80" 
                   style={{ clipPath: 'polygon(30% 100%, 50% 0%, 70% 100%)' }} />
            </div>
            
            {/* Inner bright strand */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/5 h-3/4 animate-flame-pulse">
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-300 via-yellow-100 to-transparent rounded-b-full opacity-90" 
                   style={{ clipPath: 'polygon(25% 100%, 50% 0%, 75% 100%)' }} />
            </div>
            
            {/* Tiny flicker strands */}
            <div className="absolute left-[30%] bottom-0 w-1/5 h-1/2 animate-flame-flicker" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-red-500 to-transparent opacity-60" 
                   style={{ clipPath: 'polygon(40% 100%, 50% 0%, 60% 100%)' }} />
            </div>
            
            <div className="absolute right-[30%] bottom-0 w-1/5 h-1/2 animate-flame-flicker" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-red-500 to-transparent opacity-60" 
                   style={{ clipPath: 'polygon(40% 100%, 50% 0%, 60% 100%)' }} />
            </div>
          </div>
          
          {/* Flame particles */}
          <div className="absolute inset-0 -top-1/2">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ember-rise opacity-60" />
            <div className="absolute top-2 left-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-ember-rise-delayed opacity-80" />
            <div className="absolute top-0 right-1/4 w-1.5 h-1.5 bg-orange-500 rounded-full animate-ember-rise-slow opacity-70" />
            <div className="absolute top-4 left-[40%] w-1 h-1 bg-yellow-400 rounded-full animate-ember-rise opacity-50" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1 right-[35%] w-1.5 h-1.5 bg-orange-400 rounded-full animate-ember-rise-slow opacity-60" style={{ animationDelay: '0.8s' }} />
          </div>
        </div>
      </div>
      
      {/* Reflection on pot */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1/4 bg-gradient-to-t from-orange-600/20 to-transparent rounded-full blur-md" />
    </div>
  );
};

// Helper component for cosmic glyphs
const CosmicGlyph: React.FC<{ top: string, left: string, size: string, opacity: string, delay: string }> = 
  ({ top, left, size, opacity, delay }) => {
  const glyphs = ['⊛', '⊕', '⊗', '⊜', '⊖', '⊘', '⊙', '⊚', '⦿', '◉', '◎', '◍'];
  const [glyph, setGlyph] = useState(glyphs[Math.floor(Math.random() * glyphs.length)]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlyph(glyphs[Math.floor(Math.random() * glyphs.length)]);
      }
    }, 2000 + Math.random() * 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className={`absolute ${size} ${opacity} animate-pulse-glow font-serif text-glyph-bright flex items-center justify-center`}
      style={{ 
        top, 
        left, 
        animationDelay: delay,
        textShadow: '0 0 5px var(--glyph-primary)'
      }}
    >
      {glyph}
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentProject } = useAppContext();

  return (
    <div className="flex h-screen overflow-hidden bg-cosmic-deepest text-glyph-primary">
      {/* Cosmic background with subtle star pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Deep space background with darker overlay */}
        <div className="absolute inset-0 cosmic-workshop" />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Subtle star field */}
        <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(1px 1px at 50px 160px, #ffffff 100%, transparent), radial-gradient(1px 1px at 90px 40px, #ffffff 100%, transparent), radial-gradient(1px 1px at 130px 80px, #ffffff 100%, transparent), radial-gradient(1px 1px at 160px 120px, #ffffff 100%, transparent)',
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat'
          }} 
        />
        
        {/* Dark gradient vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
        
        {/* Floating fire pots */}
        <FirePot size="w-20 h-20" delay="0s" top="10%" left="15%" />
        <FirePot size="w-24 h-24" delay="2s" top="20%" left="80%" />
        <FirePot size="w-16 h-16" delay="1s" top="70%" left="25%" />
        <FirePot size="w-28 h-28" delay="3s" top="75%" left="85%" />
        <FirePot size="w-18 h-18" delay="2.5s" top="40%" left="50%" />
        
        {/* Floating glyphs */}
        <CosmicGlyph top="15%" left="25%" size="text-4xl" opacity="opacity-40" delay="1s" />
        <CosmicGlyph top="35%" left="10%" size="text-3xl" opacity="opacity-30" delay="2s" />
        <CosmicGlyph top="60%" left="15%" size="text-5xl" opacity="opacity-20" delay="0.5s" />
        <CosmicGlyph top="25%" left="70%" size="text-4xl" opacity="opacity-30" delay="1.5s" />
        <CosmicGlyph top="50%" left="85%" size="text-6xl" opacity="opacity-20" delay="3.5s" />
        <CosmicGlyph top="80%" left="75%" size="text-3xl" opacity="opacity-40" delay="2.5s" />
      </div>
      
      {/* Main layout structure */}
      <div className="relative z-10 flex flex-col w-full h-full">
        {/* Top Navigation */}
        <header className="relative z-20 border-b border-cosmic-light border-opacity-20 bg-cosmic-deep/95 backdrop-blur-sm">
          <div className="px-4 py-3 flex items-center gap-4">
            <MegaMenu />
            <div className="ml-auto">
              <UserMenu />
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto relative z-10">
            {/* Architech's forge - content container */}
            <div className="h-full p-6 relative">
              {/* Glass panels effect */}
              {!currentProject && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute w-1/3 h-3/4 glass-panel left-[10%] top-[15%] transform -rotate-6 opacity-30" />
                  <div className="absolute w-1/4 h-2/3 glass-panel right-[15%] top-[20%] transform rotate-12 opacity-20" />
                  <div className="absolute w-1/2 h-1/2 glass-panel left-[25%] bottom-[10%] transform rotate-3 opacity-25" />
                </div>
              )}
              
              {/* Energy circuit lines */}
              <div className="absolute top-0 left-0 w-full h-[1px] circuit-line" />
              <div className="absolute top-0 right-0 h-full w-[1px] circuit-line-v" />
              <div className="absolute bottom-0 right-0 w-full h-[1px] circuit-line" style={{ animationDelay: "2s" }} />
              <div className="absolute top-0 left-0 h-full w-[1px] circuit-line-v" style={{ animationDelay: "1s" }} />
              
              {/* Content wrapper */}
              <div className="relative z-10 h-full">
                {children}
              </div>
              
              {/* App signature */}
              <div className="absolute bottom-4 right-4 opacity-30">
                <div className="loreum-title text-lg text-glyph-accent">Architect Whatever</div>
              </div>
            </div>
          </main>
      </div>
    </div>
  );
};