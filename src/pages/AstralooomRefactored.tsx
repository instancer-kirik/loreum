import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  FaSearchPlus,
  FaSearchMinus,
  FaHome,
  FaGlobe,
  FaSun,
  FaMoon,
  FaPlus,
  FaRoute,
  FaCog,
  FaLayerGroup,
  FaMap,
  FaSatellite,
  FaRocket,
  FaCompass
} from 'react-icons/fa';
import { StarSystem, Planet, TravelRoute } from '../types';

interface ViewMode {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
}

interface ViewState {
  mode: string;
  zoom: number;
  center: { x: number; y: number };
  selectedSystem?: string;
  selectedPlanet?: string;
}

interface LayerVisibility {
  systems: boolean;
  planets: boolean;
  routes: boolean;
  labels: boolean;
  grid: boolean;
  regions: boolean;
}

const VIEW_MODES: ViewMode[] = [
  {
    id: 'galaxy',
    name: 'Galaxy View',
    icon: <FaLayerGroup />,
    description: 'Overview of all star systems',
    minZoom: 0.1,
    maxZoom: 2,
    defaultZoom: 0.5
  },
  {
    id: 'sector',
    name: 'Sector View',
    icon: <FaMap />,
    description: 'Regional view of system clusters',
    minZoom: 0.5,
    maxZoom: 5,
    defaultZoom: 1
  },
  {
    id: 'system',
    name: 'System View',
    icon: <FaSun />,
    description: 'Individual star system with planets',
    minZoom: 2,
    maxZoom: 20,
    defaultZoom: 5
  },
  {
    id: 'planet',
    name: 'Planet View',
    icon: <FaGlobe />,
    description: 'Planetary surface and settlements',
    minZoom: 10,
    maxZoom: 100,
    defaultZoom: 20
  }
];

const LAYER_CONFIGS = {
  systems: { color: '#FFD700', minZoom: 0.1 },
  planets: { color: '#4A90E2', minZoom: 1 },
  routes: { color: '#00FFFF', minZoom: 0.5 },
  labels: { color: '#FFFFFF', minZoom: 0.8 },
  grid: { color: '#333333', minZoom: 0.1 },
  regions: { color: '#FF6B35', minZoom: 0.1 }
};

export const AstralooomRefactored: React.FC = () => {
  // Core state
  const [systems, setSystems] = useState<StarSystem[]>([]);
  const [routes, setRoutes] = useState<TravelRoute[]>([]);
  const [viewState, setViewState] = useState<ViewState>({
    mode: 'galaxy',
    zoom: 0.5,
    center: { x: 0, y: 0 }
  });
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    systems: true,
    planets: true,
    routes: true,
    labels: true,
    grid: false,
    regions: false
  });

  // Interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [routeStart, setRouteStart] = useState<string | null>(null);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  // UI state
  const [showControls, setShowControls] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current view mode configuration
  const currentViewMode = useMemo(() => 
    VIEW_MODES.find(mode => mode.id === viewState.mode) || VIEW_MODES[0],
    [viewState.mode]
  );

  // Load data from ipsumarium (placeholder - integrate with actual service)
  useEffect(() => {
    loadSpatialData();
  }, []);

  const loadSpatialData = async () => {
    // TODO: Integrate with actual ipsumarium database service
    // For now, using mock data
    const mockSystems: StarSystem[] = [
      {
        id: 'sol',
        name: 'Sol System',
        description: 'Home system of humanity',
        coordinates: { x: 0, y: 0, z: 0 },
        starType: 'G-class',
        planets: [
          {
            id: 'earth',
            name: 'Earth',
            description: 'Third planet from the Sun',
            type: 'terrestrial',
            habitability: 1.0,
            population: 8000000000,
            resources: [],
            settlements: []
          },
          {
            id: 'mars',
            name: 'Mars',
            description: 'The Red Planet',
            type: 'terrestrial',
            habitability: 0.3,
            population: 1000000,
            resources: [],
            settlements: []
          }
        ]
      },
      {
        id: 'alpha-centauri',
        name: 'Alpha Centauri',
        description: 'Nearest star system to Sol',
        coordinates: { x: 200, y: -100, z: 50 },
        starType: 'Binary',
        planets: [
          {
            id: 'proxima-b',
            name: 'Proxima Centauri b',
            description: 'Potentially habitable exoplanet',
            type: 'terrestrial',
            habitability: 0.7,
            resources: [],
            settlements: []
          }
        ]
      },
      {
        id: 'vega',
        name: 'Vega System',
        description: 'Bright star in Lyra constellation',
        coordinates: { x: -150, y: 200, z: -30 },
        starType: 'A-class',
        planets: []
      }
    ];

    const mockRoutes: TravelRoute[] = [
      {
        id: 'sol-alpha',
        name: 'Sol-Alpha Centauri Hyperlane',
        fromSystemId: 'sol',
        toSystemId: 'alpha-centauri',
        distance: 4.37,
        travelTime: 30,
        hazards: [],
        controllingFaction: 'Human Federation'
      }
    ];

    setSystems(mockSystems);
    setRoutes(mockRoutes);
  };

  // Coordinate transformation utilities
  const worldToScreen = useCallback((worldX: number, worldY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    return {
      x: centerX + (worldX - viewState.center.x) * viewState.zoom,
      y: centerY + (worldY - viewState.center.y) * viewState.zoom
    };
  }, [viewState]);

  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    return {
      x: viewState.center.x + (screenX - centerX) / viewState.zoom,
      y: viewState.center.y + (screenY - centerY) / viewState.zoom
    };
  }, [viewState]);

  // Zoom and pan controls
  const handleZoom = useCallback((delta: number, centerPoint?: { x: number; y: number }) => {
    const zoomFactor = delta > 0 ? 1.2 : 0.8;
    const newZoom = Math.max(
      currentViewMode.minZoom,
      Math.min(currentViewMode.maxZoom, viewState.zoom * zoomFactor)
    );

    let newCenter = viewState.center;
    if (centerPoint) {
      // Zoom towards the specified point
      const worldPoint = screenToWorld(centerPoint.x, centerPoint.y);
      const zoomRatio = newZoom / viewState.zoom;
      newCenter = {
        x: worldPoint.x - (worldPoint.x - viewState.center.x) / zoomRatio,
        y: worldPoint.y - (worldPoint.y - viewState.center.y) / zoomRatio
      };
    }

    setViewState(prev => ({
      ...prev,
      zoom: newZoom,
      center: newCenter
    }));
  }, [viewState, currentViewMode, screenToWorld]);

  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    setViewState(prev => ({
      ...prev,
      center: {
        x: prev.center.x - deltaX / prev.zoom,
        y: prev.center.y - deltaY / prev.zoom
      }
    }));
  }, []);

  // View mode switching
  const switchViewMode = useCallback((modeId: string) => {
    const newMode = VIEW_MODES.find(mode => mode.id === modeId);
    if (!newMode) return;

    setViewState(prev => ({
      ...prev,
      mode: modeId,
      zoom: Math.max(newMode.minZoom, Math.min(newMode.maxZoom, prev.zoom))
    }));
  }, []);

  // Canvas rendering
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with space background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw star field background
    drawStarField(ctx, canvas.width, canvas.height);

    // Draw grid if enabled
    if (layerVisibility.grid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw travel routes
    if (layerVisibility.routes && viewState.zoom >= LAYER_CONFIGS.routes.minZoom) {
      drawRoutes(ctx);
    }

    // Draw star systems
    if (layerVisibility.systems && viewState.zoom >= LAYER_CONFIGS.systems.minZoom) {
      drawSystems(ctx);
    }

    // Draw labels
    if (layerVisibility.labels && viewState.zoom >= LAYER_CONFIGS.labels.minZoom) {
      drawLabels(ctx);
    }

    // Draw selection indicators
    drawSelections(ctx);

  }, [viewState, layerVisibility, systems, routes, hoveredObject]);

  const drawStarField = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 100 * viewState.zoom;
    const offsetX = (viewState.center.x * viewState.zoom) % gridSize;
    const offsetY = (viewState.center.y * viewState.zoom) % gridSize;

    ctx.strokeStyle = LAYER_CONFIGS.grid.color;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    // Vertical lines
    for (let x = -offsetX; x < width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = -offsetY; y < height + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  };

  const drawRoutes = (ctx: CanvasRenderingContext2D) => {
    routes.forEach(route => {
      const fromSystem = systems.find(s => s.id === route.fromSystemId);
      const toSystem = systems.find(s => s.id === route.toSystemId);
      
      if (!fromSystem || !toSystem) return;

      const fromPos = worldToScreen(fromSystem.coordinates.x, fromSystem.coordinates.y);
      const toPos = worldToScreen(toSystem.coordinates.x, toSystem.coordinates.y);

      ctx.strokeStyle = LAYER_CONFIGS.routes.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      ctx.stroke();
      
      ctx.setLineDash([]);
    });
  };

  const drawSystems = (ctx: CanvasRenderingContext2D) => {
    systems.forEach(system => {
      const pos = worldToScreen(system.coordinates.x, system.coordinates.y);
      const isSelected = viewState.selectedSystem === system.id;
      const isHovered = hoveredObject === system.id;
      
      // System glow
      if (isSelected || isHovered) {
        const glowRadius = 20 + (isSelected ? 10 : 0);
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, 2 * Math.PI);
        ctx.fill();
      }

      // System body
      const systemSize = Math.max(4, 8 * viewState.zoom);
      ctx.fillStyle = getSystemColor(system.starType);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, systemSize, 0, 2 * Math.PI);
      ctx.fill();

      // System border
      ctx.strokeStyle = isSelected ? '#FFD700' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.stroke();

      // Draw planets in system view
      if (viewState.mode === 'system' && viewState.selectedSystem === system.id) {
        drawPlanets(ctx, system, pos);
      }
    });
  };

  const drawPlanets = (ctx: CanvasRenderingContext2D, system: StarSystem, systemPos: { x: number; y: number }) => {
    system.planets.forEach((planet, index) => {
      const orbitRadius = (index + 1) * 30 * viewState.zoom;
      const angle = (Date.now() / 1000 + index * Math.PI / 2) % (2 * Math.PI);
      
      const planetPos = {
        x: systemPos.x + Math.cos(angle) * orbitRadius,
        y: systemPos.y + Math.sin(angle) * orbitRadius
      };

      // Orbit path
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(systemPos.x, systemPos.y, orbitRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Planet
      const planetSize = Math.max(2, 4 * viewState.zoom);
      ctx.fillStyle = getPlanetColor(planet.type);
      ctx.beginPath();
      ctx.arc(planetPos.x, planetPos.y, planetSize, 0, 2 * Math.PI);
      ctx.fill();

      // Planet border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  const drawLabels = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = LAYER_CONFIGS.labels.color;
    ctx.font = `${Math.max(12, 14 * viewState.zoom)}px 'Inter', sans-serif`;
    ctx.textAlign = 'center';

    systems.forEach(system => {
      const pos = worldToScreen(system.coordinates.x, system.coordinates.y);
      const labelY = pos.y - 15 - (8 * viewState.zoom);
      
      // Label background
      const textWidth = ctx.measureText(system.name).width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(pos.x - textWidth/2 - 4, labelY - 16, textWidth + 8, 20);
      
      // Label text
      ctx.fillStyle = LAYER_CONFIGS.labels.color;
      ctx.fillText(system.name, pos.x, labelY);
    });
  };

  const drawSelections = (ctx: CanvasRenderingContext2D) => {
    if (viewState.selectedSystem) {
      const system = systems.find(s => s.id === viewState.selectedSystem);
      if (system) {
        const pos = worldToScreen(system.coordinates.x, system.coordinates.y);
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  };

  // Utility functions
  const getSystemColor = (starType: string): string => {
    const colors = {
      'G-class': '#FFD700',
      'K-class': '#FF8C00',
      'M-class': '#FF4500',
      'F-class': '#F0F8FF',
      'A-class': '#87CEEB',
      'B-class': '#4169E1',
      'O-class': '#9370DB',
      'Binary': '#FF6B35',
      'default': '#FFFFFF'
    };
    return colors[starType as keyof typeof colors] || colors.default;
  };

  const getPlanetColor = (planetType: string): string => {
    const colors = {
      'terrestrial': '#4A90E2',
      'gas_giant': '#FF6B35',
      'ice_world': '#87CEEB',
      'desert': '#DEB887',
      'ocean': '#006994',
      'artificial': '#9370DB',
      'default': '#808080'
    };
    return colors[planetType as keyof typeof colors] || colors.default;
  };

  const resetView = () => {
    setViewState(prev => ({
      ...prev,
      zoom: currentViewMode.defaultZoom,
      center: { x: 0, y: 0 }
    }));
  };

  // Event handlers
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    // Check for system clicks
    const clickedSystem = systems.find(system => {
      const pos = worldToScreen(system.coordinates.x, system.coordinates.y);
      const distance = Math.sqrt(
        Math.pow(clickPos.x - pos.x, 2) + Math.pow(clickPos.y - pos.y, 2)
      );
      return distance <= 15;
    });

    if (clickedSystem) {
      setViewState(prev => ({
        ...prev,
        selectedSystem: clickedSystem.id,
        selectedPlanet: undefined
      }));
      
      // Auto-switch to system view for detailed inspection
      if (viewState.mode === 'galaxy' || viewState.mode === 'sector') {
        switchViewMode('system');
        setViewState(prev => ({
          ...prev,
          center: { x: clickedSystem.coordinates.x, y: clickedSystem.coordinates.y }
        }));
      }
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    handleZoom(-event.deltaY, centerPoint);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragStart) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      handlePan(deltaX, deltaY);
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Canvas size management
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawCanvas]);

  // Redraw canvas when state changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="h-full w-full relative bg-cosmic-deepest overflow-hidden" ref={containerRef}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* View Mode Selector */}
      <div className="absolute top-4 left-4 flex gap-2">
        {VIEW_MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => switchViewMode(mode.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg glass-panel border transition-colors ${
              viewState.mode === mode.id 
                ? 'border-circuit-magic text-circuit-energy' 
                : 'border-cosmic-light border-opacity-20 text-glyph-accent hover:text-glyph-bright'
            }`}
            title={mode.description}
          >
            {mode.icon}
            <span className="text-sm">{mode.name}</span>
          </button>
        ))}
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => handleZoom(1)}
          className="p-2 glass-panel border border-cosmic-light border-opacity-20 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors"
          title="Zoom In"
        >
          <FaSearchPlus size={16} />
        </button>
        <button
          onClick={() => handleZoom(-1)}
          className="p-2 glass-panel border border-cosmic-light border-opacity-20 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors"
          title="Zoom Out"
        >
          <FaSearchMinus size={16} />
        </button>
        <button
          onClick={resetView}
          className="p-2 glass-panel border border-cosmic-light border-opacity-20 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors"
          title="Reset View"
        >
          <FaHome size={16} />
        </button>
      </div>

      {/* Layer Controls */}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={() => setShowLayers(!showLayers)}
          className="flex items-center gap-2 px-3 py-2 glass-panel border border-cosmic-light border-opacity-20 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors"
        >
          <FaLayerGroup size={16} />
          <span>Layers</span>
        </button>
        
        {showLayers && (
          <div className="absolute bottom-full mb-2 p-4 glass-panel border border-cosmic-light border-opacity-20 rounded-lg min-w-48">
            <div className="space-y-2">
              {Object.entries(layerVisibility).map(([key, visible]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setLayerVisibility(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-glyph-primary capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 right-4 flex items-center gap-4 px-4 py-2 glass-panel border border-cosmic-light border-opacity-20 rounded-lg text-sm">
        <div className="flex items-center gap-2">
          <FaCompass size={12} />
          <span className="text-glyph-accent">
            {currentViewMode.name}
          </span>
        </div>
        <div className="text-glyph-accent">
          Zoom: {(viewState.zoom * 100).toFixed(0)}%
        </div>
        <div className="text-glyph-accent">
          Systems: {systems.length}
        </div>
        {viewState.selectedSystem && (
          <div className="text-circuit-energy">
            Selected: {systems.find(s => s.id === viewState.selectedSystem)?.name}
          </div>
        )}
      </div>

      {/* Instructions */}
      {!viewState.selectedSystem && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="glass-panel border border-cosmic-light border-opacity-20 rounded-xl p-6 max-w-md">
            <h3 className="text-xl font-bold text-glyph-bright mb-3">Astraloom Navigation</h3>
            <div className="space-y-2 text-sm text-glyph-accent">
              <p>• Click systems to select and explore</p>
              <p>• Mouse wheel to zoom in/out</p>
              <p>• Drag to pan around the galaxy</p>
              <p>• Use view modes for different perspectives</p>
              <p>• Toggle layers to customize the display</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};