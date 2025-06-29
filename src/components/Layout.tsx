import React, { useEffect, useState } from 'react';
import { MegaMenu } from './MegaMenu';
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
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <FaFire className="text-flame-orange w-1/2 h-1/2" style={{ filter: 'drop-shadow(0 0 8px var(--flame-blue))' }} />
      </div>
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
        {/* Deep space background */}
        <div className="absolute inset-0 cosmic-workshop" />
        
        {/* Subtle star field */}
        <div className="absolute inset-0 opacity-30" 
          style={{ 
            backgroundImage: 'radial-gradient(1px 1px at 50px 160px, #ffffff 100%, transparent), radial-gradient(1px 1px at 90px 40px, #ffffff 100%, transparent), radial-gradient(1px 1px at 130px 80px, #ffffff 100%, transparent), radial-gradient(1px 1px at 160px 120px, #ffffff 100%, transparent)',
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat'
          }} 
        />
        
        {/* Floating fire pots */}
        <FirePot size="w-16 h-16" delay="0s" top="10%" left="15%" />
        <FirePot size="w-20 h-20" delay="2s" top="20%" left="80%" />
        <FirePot size="w-12 h-12" delay="1s" top="70%" left="25%" />
        <FirePot size="w-24 h-24" delay="3s" top="75%" left="85%" />
        <FirePot size="w-14 h-14" delay="2.5s" top="40%" left="50%" />
        
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
          <div className="px-6 py-3">
            <MegaMenu />
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