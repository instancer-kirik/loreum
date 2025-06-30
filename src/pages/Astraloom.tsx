import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaPlus,
  FaMinus,
  FaExpand,
  FaCompress,
  FaUpload,
  FaDownload,
  FaSave,
  FaEdit,
  FaTrash,
  FaSearch,
  FaGlobe,
  FaStar,
  FaRocket,
  FaMap,
  FaCrosshairs,
  FaLayerGroup,
  FaImage,
  FaCog,
  FaInfoCircle
} from 'react-icons/fa';

interface StarSystem {
  id: string;
  name: string;
  position: { x: number; y: number };
  type: 'star' | 'binary' | 'neutron' | 'blackhole' | 'nebula';
  size: number;
  color: string;
  description?: string;
  planets?: Planet[];
  discovered: boolean;
  metadata: Record<string, any>;
}

interface Planet {
  id: string;
  name: string;
  position: { x: number; y: number }; // Relative to system center
  type: 'terrestrial' | 'gas-giant' | 'ice' | 'desert' | 'ocean' | 'volcanic';
  size: number;
  habitable: boolean;
  description?: string;
  moons?: Moon[];
}

interface Moon {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: number;
  type: 'rocky' | 'ice' | 'volcanic';
}

interface TravelPath {
  id: string;
  from: string;
  to: string;
  type: 'hyperlane' | 'wormhole' | 'portal' | 'trade-route';
  bidirectional: boolean;
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  description?: string;
}

interface ViewState {
  scale: number;
  offset: { x: number; y: number };
  mode: 'galaxy' | 'system';
  selectedSystem?: string;
}

const SYSTEM_TYPES = {
  star: { color: '#FFD700', icon: '⭐', size: 12 },
  binary: { color: '#FF6B35', icon: '⭐⭐', size: 16 },
  neutron: { color: '#00FFFF', icon: '💫', size: 10 },
  blackhole: { color: '#1A1A1A', icon: '🕳️', size: 14 },
  nebula: { color: '#9932CC', icon: '☁️', size: 20 }
};

const PLANET_TYPES = {
  terrestrial: { color: '#4A90E2', icon: '🌍' },
  'gas-giant': { color: '#FF8C42', icon: '🪐' },
  ice: { color: '#87CEEB', icon: '❄️' },
  desert: { color: '#DEB887', icon: '🏜️' },
  ocean: { color: '#006994', icon: '🌊' },
  volcanic: { color: '#FF4500', icon: '🌋' }
};

export const Astraloom: React.FC = () => {
  const [systems, setSystems] = useState<StarSystem[]>([]);
  const [paths, setPaths] = useState<TravelPath[]>([]);
  const [viewState, setViewState] = useState<ViewState>({
    scale: 1,
    offset: { x: 0, y: 0 },
    mode: 'galaxy'
  });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isCreatingPath, setIsCreatingPath] = useState(false);
  const [pathStart, setPathStart] = useState<string | null>(null);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [editingSystem, setEditingSystem] = useState<StarSystem | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with some example systems
  useEffect(() => {
    const exampleSystems: StarSystem[] = [
      {
        id: '1',
        name: 'Sol System',
        position: { x: 0, y: 0 },
        type: 'star',
        size: 12,
        color: '#FFD700',
        discovered: true,
        metadata: {},
        planets: [
          {
            id: 'earth',
            name: 'Earth',
            position: { x: 50, y: 0 },
            type: 'terrestrial',
            size: 8,
            habitable: true,
            description: 'Third planet from the Sun'
          }
        ]
      },
      {
        id: '2',
        name: 'Alpha Centauri',
        position: { x: 200, y: -100 },
        type: 'binary',
        size: 16,
        color: '#FF6B35',
        discovered: true,
        metadata: {}
      },
      {
        id: '3',
        name: 'Unknown System',
        position: { x: -150, y: 200 },
        type: 'star',
        size: 10,
        color: '#FFFFFF',
        discovered: false,
        metadata: {}
      }
    ];

    const examplePaths: TravelPath[] = [
      {
        id: 'path1',
        from: '1',
        to: '2',
        type: 'hyperlane',
        bidirectional: true,
        difficulty: 'normal'
      }
    ];

    setSystems(exampleSystems);
    setPaths(examplePaths);
  }, []);

  // Canvas drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const { scale, offset } = viewState;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background image if available
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
        ctx.restore();
      };
      img.src = backgroundImage;
    }

    ctx.save();
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.scale(scale, scale);

    if (viewState.mode === 'galaxy') {
      // Draw travel paths
      paths.forEach(path => {
        const fromSystem = systems.find(s => s.id === path.from);
        const toSystem = systems.find(s => s.id === path.to);
        
        if (fromSystem && toSystem) {
          ctx.beginPath();
          ctx.moveTo(fromSystem.position.x, fromSystem.position.y);
          ctx.lineTo(toSystem.position.x, toSystem.position.y);
          
          switch (path.type) {
            case 'hyperlane':
              ctx.strokeStyle = '#00FFFF';
              ctx.setLineDash([5, 5]);
              break;
            case 'wormhole':
              ctx.strokeStyle = '#9932CC';
              ctx.setLineDash([10, 10]);
              break;
            case 'portal':
              ctx.strokeStyle = '#FF69B4';
              ctx.setLineDash([2, 8]);
              break;
            case 'trade-route':
              ctx.strokeStyle = '#32CD32';
              ctx.setLineDash([]);
              break;
          }
          
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw star systems
      systems.forEach(system => {
        const { x, y } = system.position;
        
        // System background
        ctx.beginPath();
        ctx.arc(x, y, system.size + 4, 0, 2 * Math.PI);
        ctx.fillStyle = system.discovered ? 'rgba(255, 255, 255, 0.1)' : 'rgba(128, 128, 128, 0.05)';
        ctx.fill();
        
        // System body
        ctx.beginPath();
        ctx.arc(x, y, system.size, 0, 2 * Math.PI);
        ctx.fillStyle = system.discovered ? system.color : '#666666';
        ctx.fill();
        
        if (system.discovered) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Selection highlight
        if (selectedNode === system.id) {
          ctx.beginPath();
          ctx.arc(x, y, system.size + 8, 0, 2 * Math.PI);
          ctx.strokeStyle = '#00FFFF';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        
        // System name
        if (system.discovered) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(system.name, x, y + system.size + 16);
        } else {
          ctx.fillStyle = '#888888';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Unknown', x, y + system.size + 14);
        }
      });
    } else if (viewState.mode === 'system' && viewState.selectedSystem) {
      // Draw system view
      const system = systems.find(s => s.id === viewState.selectedSystem);
      if (system && system.planets) {
        // Draw central star
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, 2 * Math.PI);
        ctx.fillStyle = system.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw planets
        system.planets.forEach(planet => {
          const { x, y } = planet.position;
          
          // Orbital path
          const distance = Math.sqrt(x * x + y * y);
          ctx.beginPath();
          ctx.arc(0, 0, distance, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Planet
          ctx.beginPath();
          ctx.arc(x, y, planet.size, 0, 2 * Math.PI);
          ctx.fillStyle = PLANET_TYPES[planet.type].color;
          ctx.fill();
          
          if (planet.habitable) {
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          
          // Planet name
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(planet.name, x, y + planet.size + 12);
        });
      }
    }

    ctx.restore();
  }, [systems, paths, viewState, selectedNode, backgroundImage]);

  // Handle canvas interactions
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    
    const { scale, offset } = viewState;
    const worldX = (canvasX - canvas.width / 2 - offset.x) / scale;
    const worldY = (canvasY - canvas.height / 2 - offset.y) / scale;

    if (viewState.mode === 'galaxy') {
      // Check if clicked on a system
      const clickedSystem = systems.find(system => {
        const dx = worldX - system.position.x;
        const dy = worldY - system.position.y;
        return Math.sqrt(dx * dx + dy * dy) <= system.size + 4;
      });

      if (clickedSystem) {
        if (isCreatingPath) {
          if (pathStart && pathStart !== clickedSystem.id) {
            // Create new path
            const newPath: TravelPath = {
              id: `path-${Date.now()}`,
              from: pathStart,
              to: clickedSystem.id,
              type: 'hyperlane',
              bidirectional: true,
              difficulty: 'normal'
            };
            setPaths(prev => [...prev, newPath]);
            setIsCreatingPath(false);
            setPathStart(null);
          } else {
            setPathStart(clickedSystem.id);
          }
        } else {
          setSelectedNode(clickedSystem.id);
        }
      } else {
        if (isCreatingPath) {
          setIsCreatingPath(false);
          setPathStart(null);
        } else {
          setSelectedNode(null);
        }
      }
    }
  };

  const handleCanvasDoubleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedNode && viewState.mode === 'galaxy') {
      const system = systems.find(s => s.id === selectedNode);
      if (system && system.discovered) {
        setViewState(prev => ({
          ...prev,
          mode: 'system',
          selectedSystem: selectedNode,
          scale: 1,
          offset: { x: 0, y: 0 }
        }));
      }
    }
  };

  // Zoom and pan
  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setViewState(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(5, prev.scale * zoomFactor))
    }));
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button === 1 || (event.button === 0 && event.shiftKey)) { // Middle click or Shift+Click for panning
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragStart) {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      setViewState(prev => ({
        ...prev,
        offset: {
          x: prev.offset.x + dx,
          y: prev.offset.y + dy
        }
      }));
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Redraw canvas when state changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawCanvas();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawCanvas]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    setShowImageUpload(false);
  };

  const resetView = () => {
    setViewState({
      scale: 1,
      offset: { x: 0, y: 0 },
      mode: 'galaxy'
    });
    setSelectedNode(null);
  };

  const toggleSystemMode = () => {
    if (viewState.mode === 'system') {
      setViewState(prev => ({ ...prev, mode: 'galaxy', selectedSystem: undefined }));
    } else if (selectedNode) {
      const system = systems.find(s => s.id === selectedNode);
      if (system && system.discovered) {
        setViewState(prev => ({
          ...prev,
          mode: 'system',
          selectedSystem: selectedNode,
          scale: 1,
          offset: { x: 0, y: 0 }
        }));
      }
    }
  };

  const selectedSystem = selectedNode ? systems.find(s => s.id === selectedNode) : null;

  return (
    <div className="h-full flex flex-col bg-cosmic-deepest">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-cosmic-light border-opacity-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FaGlobe className="text-circuit-magic mr-3" size={24} />
            <div>
              <h1 className="text-2xl font-bold text-glyph-bright font-serif">
                Astraloom
              </h1>
              <p className="text-glyph-accent text-sm">
                Navigate the cosmic web of star systems and travel routes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-glyph-accent mr-4">
              Mode: <span className="text-glyph-bright capitalize">{viewState.mode}</span>
              {viewState.mode === 'system' && selectedSystem && (
                <span className="ml-2 text-circuit-energy">({selectedSystem.name})</span>
              )}
            </div>
            
            <button
              onClick={() => setShowImageUpload(true)}
              className="p-2 glass-panel text-glyph-accent hover:text-circuit-energy transition-colors"
              title="Upload background image"
            >
              <FaImage size={16} />
            </button>
            
            <button
              onClick={resetView}
              className="p-2 glass-panel text-glyph-accent hover:text-glyph-bright transition-colors"
              title="Reset view"
            >
              <FaCrosshairs size={16} />
            </button>
            
            <button
              onClick={toggleSystemMode}
              className="p-2 glass-panel text-glyph-accent hover:text-flame-blue transition-colors"
              title={viewState.mode === 'galaxy' ? 'Enter system view' : 'Return to galaxy'}
              disabled={viewState.mode === 'galaxy' && (!selectedNode || !selectedSystem?.discovered)}
            >
              {viewState.mode === 'galaxy' ? <FaSearch size={16} /> : <FaExpand size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Tools Panel */}
        <div className="w-64 bg-cosmic-deep border-r border-cosmic-light border-opacity-20 flex flex-col">
          <div className="p-4 border-b border-cosmic-light border-opacity-10">
            <h3 className="text-lg font-semibold text-glyph-bright mb-3 font-serif">
              Tools
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => setShowSystemModal(true)}
                className="w-full btn-glowing text-sm py-2"
              >
                <FaPlus className="mr-2" size={14} />
                Add System
              </button>
              
              <button
                onClick={() => setIsCreatingPath(!isCreatingPath)}
                className={`w-full glass-panel text-sm py-2 transition-colors ${
                  isCreatingPath
                    ? 'bg-circuit-energy text-cosmic-deepest'
                    : 'text-glyph-bright hover:text-circuit-energy'
                }`}
              >
                <FaRocket className="mr-2" size={14} />
                {isCreatingPath ? 'Cancel Path' : 'Create Path'}
              </button>
            </div>
          </div>

          {/* Selected System Info */}
          {selectedSystem && (
            <div className="p-4 border-b border-cosmic-light border-opacity-10">
              <h4 className="text-md font-semibold text-glyph-bright mb-2">
                {selectedSystem.discovered ? selectedSystem.name : 'Unknown System'}
              </h4>
              
              {selectedSystem.discovered ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-glyph-accent">Type:</span>
                    <span className="text-glyph-bright ml-2 capitalize">{selectedSystem.type}</span>
                  </div>
                  
                  {selectedSystem.planets && (
                    <div>
                      <span className="text-glyph-accent">Planets:</span>
                      <span className="text-glyph-bright ml-2">{selectedSystem.planets.length}</span>
                    </div>
                  )}
                  
                  {selectedSystem.description && (
                    <div>
                      <span className="text-glyph-accent">Description:</span>
                      <p className="text-glyph-primary text-xs mt-1">{selectedSystem.description}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditingSystem(selectedSystem);
                        setShowSystemModal(true);
                      }}
                      className="flex-1 glass-panel text-xs py-1 text-circuit-energy hover:text-circuit-magic transition-colors"
                    >
                      <FaEdit className="mr-1" size={10} />
                      Edit
                    </button>
                    
                    {selectedSystem.planets && selectedSystem.planets.length > 0 && (
                      <button
                        onClick={toggleSystemMode}
                        className="flex-1 glass-panel text-xs py-1 text-flame-blue hover:text-flame-cyan transition-colors"
                      >
                        <FaSearch className="mr-1" size={10} />
                        Explore
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-glyph-accent">
                  <p>This system has not been discovered yet.</p>
                  <button
                    onClick={() => {
                      setSystems(prev => prev.map(s => 
                        s.id === selectedSystem.id 
                          ? { ...s, discovered: true }
                          : s
                      ));
                    }}
                    className="w-full glass-panel text-xs py-2 mt-2 text-circuit-energy hover:text-circuit-magic transition-colors"
                  >
                    <FaInfoCircle className="mr-1" size={10} />
                    Discover System
                  </button>
                </div>
              )}
            </div>
          )}

          {/* System List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="text-sm font-medium text-glyph-accent mb-3 uppercase tracking-wider">
              Star Systems ({systems.filter(s => s.discovered).length}/{systems.length})
            </h4>
            
            <div className="space-y-1">
              {systems.map(system => (
                <button
                  key={system.id}
                  onClick={() => setSelectedNode(system.id)}
                  className={`w-full text-left p-2 rounded transition-colors ${
                    selectedNode === system.id
                      ? 'glass-panel text-glyph-bright border border-flame-blue border-opacity-30'
                      : 'text-glyph-accent hover:glass-panel hover:text-glyph-bright'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-xs mr-2">{SYSTEM_TYPES[system.type].icon}</span>
                    <span className="text-sm font-medium">
                      {system.discovered ? system.name : 'Unknown'}
                    </span>
                    {!system.discovered && (
                      <span className="ml-auto text-xs opacity-50">?</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* View Controls */}
          <div className="p-4 border-t border-cosmic-light border-opacity-10">
            <div className="text-xs text-glyph-accent mb-2">
              Scale: {(viewState.scale * 100).toFixed(0)}%
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={() => setViewState(prev => ({ 
                  ...prev, 
                  scale: Math.max(0.1, prev.scale * 0.8) 
                }))}
                className="flex-1 glass-panel text-xs py-1 text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                <FaMinus size={10} />
              </button>
              
              <button
                onClick={() => setViewState(prev => ({ 
                  ...prev, 
                  scale: Math.min(5, prev.scale * 1.2) 
                }))}
                className="flex-1 glass-panel text-xs py-1 text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                <FaPlus size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onClick={handleCanvasClick}
            onDoubleClick={handleCanvasDoubleClick}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Overlay UI */}
          {isCreatingPath && (
            <div className="absolute top-4 left-4 glass-panel p-3 border border-circuit-energy border-opacity-50">
              <div className="text-sm text-circuit-energy font-medium">
                Creating Travel Path
              </div>
              <div className="text-xs text-glyph-accent mt-1">
                {pathStart ? 'Click destination system' : 'Click starting system'}
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 glass-panel p-2 text-xs text-glyph-accent">
            <div>🖱️ Click: Select • Double-click: Enter system</div>
            <div>🖱️ Shift+Drag: Pan • Scroll: Zoom</div>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-cosmic-deepest bg-opacity-80 flex items-center justify-center z-50">
          <div className="glass-panel border border-cosmic-light border-opacity-30 p-6 w-96">
            <h3 className="text-lg font-semibold text-glyph-bright mb-4">
              Upload Background Image
            </h3>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full glass-panel text-glyph-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-flame-blue"
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowImageUpload(false)}
                className="px-4 py-2 text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                Cancel
              </button>
              
              {backgroundImage && (
                <button
                  onClick={() => {
                    setBackgroundImage(null);
                    setShowImageUpload(false);
                  }}
                  className="px-4 py-2 glass-panel text-flame-orange hover:text-flame-cyan transition-colors"
                >
                  Remove Background
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* System Creation/Edit Modal */}
      {showSystemModal && (
        <div className="fixed inset-0 bg-cosmic-deepest bg-opacity-80 flex items-center justify-center z-50">
          <div className="glass-panel border border-cosmic-light border-opacity-30 p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-glyph-bright mb-4">
              {editingSystem ? 'Edit System' : 'Create New System'}
            </h3>
            
            {/* Form content would go here */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-glyph-accent mb-1">Name</label>
                <input
                  type="text"
                  className="w-full glass-panel text-glyph-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-flame-blue"
                  placeholder="System name"
                />
              </div>
              
              <div>
                <label className="block text-sm text-glyph-accent mb-1">Type</label>
                <select className="w-full glass-panel text-glyph-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-flame-blue">
                  <option value="star">Star</option>
                  <option value="binary">Binary System</option>
                  <option value="neutron">Neutron Star</option>
                  <option value="blackhole">Black Hole</option>
                  <option value="nebula">Nebula</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-glyph-accent mb-1">Description</label>
                <textarea
                  className="w-full glass-panel text-glyph-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-flame-blue"
                  rows={3}
                  placeholder="System description..."
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="discovered"
                  className="rounded"
                  defaultChecked={true}
                />
                <label htmlFor="discovered" className="text-sm text-glyph-accent">
                  Discovered
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSystemModal(false);
                  setEditingSystem(null);
                }}
                className="px-4 py-2 text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={() => {
                  // TODO: Implement system save logic
                  setShowSystemModal(false);
                  setEditingSystem(null);
                }}
                className="btn-glowing"
              >
                {editingSystem ? 'Update System' : 'Create System'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};