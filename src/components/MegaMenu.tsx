import React, { useState, useEffect, useRef } from "react";
import {
  FaHome,
  FaAtom,
  FaGlobe,
  FaUsers,
  FaCog,
  FaPalette,
  FaBook,
  FaBox,
  FaDatabase,
  FaTheaterMasks,
  FaNetworkWired,
  FaMap,
  FaLayerGroup,
  FaRocket,
  FaPaintBrush,
  FaScroll,
  FaRoad,
  FaCode,
  FaTimes,
  FaComments,
  FaComment,
  FaBars,
  FaMagic,
  FaChevronDown,
  FaInfinity,
} from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import { FaChevronRight } from "react-icons/fa";

interface MenuCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  comingSoon?: boolean;
}

const getContextualMenuCategories = (
  navigationContext: any,
): MenuCategory[] => {
  const baseCategories = [
    {
      id: "core",
      label: "Core Tools",
      icon: <FaHome className="h-5 w-5" />,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          description: "Overview and project management",
          icon: <FaHome className="h-4 w-4" />,
        },
        {
          id: "ipsumarium",
          label: "Ipsumarium",
          description: "Create and manage all content templates",
          icon: <FaDatabase className="h-4 w-4" />,
          badge: "Creation Hub",
        },
        {
          id: "characters",
          label: "Characters",
          description: "Manage characters and personalities",
          icon: <FaTheaterMasks className="h-4 w-4" />,
        },
        {
          id: "context-drops",
          label: "Context Drops",
          description: "Manage conversation exports and chat context",
          icon: <FaComments className="h-4 w-4" />,
        },
      ],
    },
  ];

  // Add contextual categories based on navigation level
  const contextualCategories = [];

  // Always show multiverse navigation
  contextualCategories.push({
    id: "hierarchy",
    label: "Navigation",
    icon: <FaAtom className="h-5 w-5" />,
    items: [
      {
        id: "dashboard",
        label: "Multiverse Dashboard",
        description: "View and manage all your multiverses",
        icon: <FaHome className="h-4 w-4" />,
      },
    ],
  });

  // Universe-level tools (available from universe level and below)
  if (
    ["universe", "timeline", "world", "civilization"].includes(
      navigationContext.level,
    )
  ) {
    const universeItems = [
      {
        id: "astraloom",
        label: "Astraloom",
        description: "Star system navigation and cosmic design",
        icon: <FaRocket className="h-4 w-4" />,
      },
    ];

    const existingHierarchy = contextualCategories.find(
      (cat) => cat.id === "hierarchy",
    );
    if (existingHierarchy) {
      existingHierarchy.items.push(...universeItems);
    }
  }

  // Timeline-level tools (available from timeline level and below)
  if (["timeline", "world", "civilization"].includes(navigationContext.level)) {
    contextualCategories.push({
      id: "narrative",
      label: "Narrative & Lore",
      icon: <FaBook className="h-5 w-5" />,
      items: [
        {
          id: "lore",
          label: "Lore Graph",
          description: "Map connections between events and concepts",
          icon: <FaNetworkWired className="h-4 w-4" />,
        },
        {
          id: "narrative",
          label: "Narrative Layer",
          description: "Chronicle historical events and timelines",
          icon: <FaScroll className="h-4 w-4" />,
        },
      ],
    });
  }

  // World-level tools (available from world level and below)
  if (["world", "civilization"].includes(navigationContext.level)) {
    contextualCategories.push({
      id: "worldbuilding",
      label: "World Building",
      icon: <FaGlobe className="h-5 w-5" />,
      items: [
        {
          id: "region",
          label: "Region Editor",
          description: "Design geographic regions and territories",
          icon: <FaMap className="h-4 w-4" />,
        },
        {
          id: "planetary",
          label: "Planetary Structures",
          description: "Create megastructures and world features",
          icon: <FaLayerGroup className="h-4 w-4" />,
        },
      ],
    });
  }

  // Civilization-level tools
  if (navigationContext.level === "civilization") {
    contextualCategories.push({
      id: "societies",
      label: "Societies & Culture",
      icon: <FaUsers className="h-5 w-5" />,
      items: [
        {
          id: "civilization",
          label: "Civilization Builder",
          description: "Design complex societies and governments",
          icon: <FaUsers className="h-4 w-4" />,
        },
        {
          id: "culture",
          label: "Culture Designer",
          description: "Create cultural systems and traditions",
          icon: <FaPalette className="h-4 w-4" />,
        },
        {
          id: "tech-tree",
          label: "Technology Trees",
          description: "Design technological progression",
          icon: <FaCog className="h-4 w-4" />,
        },
        {
          id: "items",
          label: "Items & Equipment",
          description: "Design items, weapons, and artifacts",
          icon: <FaBox className="h-4 w-4" />,
        },
      ],
    });
  }

  // System tools (always available)
  const systemCategories = [
    {
      id: "systems",
      label: "Magic & Systems",
      icon: <FaMagic className="h-5 w-5" />,
      items: [
        {
          id: "magic-systems",
          label: "Magic Systems",
          description: "Create magical frameworks and rules",
          icon: <FaMagic className="h-4 w-4" />,
        },
      ],
    },
    {
      id: "system",
      label: "System & Settings",
      icon: <FaCog className="h-5 w-5" />,
      items: [
        {
          id: "roadmap",
          label: "Development Roadmap",
          description: "Track project progress and features",
          icon: <FaRoad className="h-4 w-4" />,
        },
        {
          id: "config",
          label: "Configuration",
          description: "System settings and preferences",
          icon: <FaCog className="h-4 w-4" />,
        },
        {
          id: "debug-supabase",
          label: "Database Debug",
          description: "Database diagnostics and testing",
          icon: <FaCode className="h-4 w-4" />,
        },
      ],
    },
  ];

  return [...baseCategories, ...contextualCategories, ...systemCategories];
};

export const MegaMenu: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    navigationContext,
    getBreadcrumbs,
    currentMultiverse,
    currentUniverse,
    currentTimeline,
    currentWorld,
  } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuCategories = getContextualMenuCategories(navigationContext);
  const breadcrumbs = getBreadcrumbs();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleItemClick = (itemId: string) => {
    setCurrentPage(itemId);
    setIsOpen(false);
    setActiveCategory(null);
  };

  const handleCategoryHover = (categoryId: string) => {
    if (isOpen) {
      setActiveCategory(categoryId);
    }
  };

  const getCurrentPageInfo = () => {
    for (const category of menuCategories) {
      const item = category.items.find((item) => item.id === currentPage);
      if (item) {
        return { category: category.label, item: item.label };
      }
    }
    return { category: "Core Tools", item: "Dashboard" };
  };

  const currentPageInfo = getCurrentPageInfo();

  const getContextTitle = () => {
    switch (navigationContext.level) {
      case "multiverse":
        return "Cosmic Workshop";
      case "universe":
        return "Universal Tools";
      case "timeline":
        return "Temporal Forge";
      case "world":
        return "World Architect";
      case "civilization":
        return "Architect Whatever";
      default:
        return "Architect Whatever";
    }
  };

  return (
    <div
      className="relative flex items-center gap-2 md:gap-4 max-w-full"
      ref={menuRef}
    >
      {/* Logo & Brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-circuit-energy to-circuit-magic blur-lg opacity-70"></div>
          <div className="relative glass-panel p-1.5 md:p-2 rounded-lg flex items-center justify-center">
            <FaInfinity
              className="h-4 w-4 md:h-5 md:w-5 text-circuit-energy"
              style={{ filter: "drop-shadow(0 0 5px var(--circuit-magic))" }}
            />
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="loreum-title text-base md:text-lg text-glyph-bright">
            Loreum
          </div>
          <div className="text-xs text-glyph-accent">{getContextTitle()}</div>
        </div>
      </div>

      {/* Breadcrumbs - Desktop Only */}
      {breadcrumbs.length > 0 && (
        <div className="hidden lg:flex items-center gap-1 text-sm min-w-0 flex-1 overflow-hidden">
          <div className="text-glyph-secondary flex-shrink-0">→</div>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <span className="text-glyph-accent truncate max-w-[120px]">
                {crumb.name}
              </span>
              {index < breadcrumbs.length - 1 && (
                <div className="text-glyph-secondary flex-shrink-0">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Menu Trigger */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 rounded-lg glass-panel border border-cosmic-light hover:border-flame-blue/30 transition-all duration-200 group"
        >
          <div className="flex items-center gap-1 md:gap-2">
            {isOpen ? (
              <FaTimes className="h-4 w-4 text-flame-blue" />
            ) : (
              <FaBars className="h-4 w-4 text-glyph-accent group-hover:text-flame-blue" />
            )}
            <div className="hidden sm:block">
              <div className="text-xs md:text-sm font-medium text-glyph-bright truncate max-w-[150px]">
                {currentPageInfo.item}
              </div>
              <div className="text-xs text-glyph-accent truncate max-w-[150px]">
                {currentPageInfo.category}
              </div>
            </div>
          </div>
          <FaChevronDown
            className={`hidden sm:block h-3 w-3 text-glyph-accent transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed md:absolute top-16 md:top-full left-4 md:left-0 right-4 md:right-auto md:mt-2 z-[9999] w-auto md:w-[600px] lg:w-[800px] h-[calc(100vh-6rem)] md:h-auto overflow-hidden">
            <div className="bg-cosmic-deep/95 backdrop-blur-sm border border-cosmic-light rounded-xl shadow-2xl overflow-hidden h-full md:h-auto">
              <div className="flex flex-col h-full md:h-auto">
                {/* Mobile breadcrumbs */}
                {breadcrumbs.length > 0 && (
                  <div className="lg:hidden p-4 border-b border-cosmic-light">
                    <div className="text-xs text-glyph-accent mb-2">
                      Current Path
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.id}>
                          <span className="text-glyph-bright">
                            {crumb.name}
                          </span>
                          {index < breadcrumbs.length - 1 && (
                            <div className="text-glyph-secondary">→</div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row flex-1 md:flex-none">
                  {/* Category Sidebar */}
                  <div className="w-full md:w-64 bg-cosmic-deep/50 border-b md:border-b-0 md:border-r border-cosmic-light">
                    <div className="p-3 md:p-4">
                      <h3 className="text-sm font-semibold text-glyph-bright mb-3">
                        {getContextTitle()}
                      </h3>
                      <nav className="grid grid-cols-2 md:grid-cols-1 gap-1 md:space-y-1">
                        {menuCategories.map((category) => (
                          <button
                            key={category.id}
                            onMouseEnter={() =>
                              handleCategoryHover(category.id)
                            }
                            onClick={() =>
                              setActiveCategory(
                                activeCategory === category.id
                                  ? null
                                  : category.id,
                              )
                            }
                            className={`
                          w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-lg text-left transition-all duration-200
                          ${
                            activeCategory === category.id
                              ? "bg-flame-blue/10 border-flame-blue/30 text-flame-blue"
                              : "text-glyph-accent hover:text-glyph-bright hover:bg-cosmic-medium/50"
                          }
                        `}
                          >
                            {category.icon}
                            <span className="text-xs md:text-sm font-medium">
                              {category.label}
                            </span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>

                  {/* Items Panel */}
                  <div className="flex-1 overflow-y-auto md:min-h-96">
                    {activeCategory ? (
                      <div className="p-4 md:p-6">
                        {(() => {
                          const category = menuCategories.find(
                            (cat) => cat.id === activeCategory,
                          );
                          if (!category) return null;

                          return (
                            <>
                              <div className="flex items-center gap-3 mb-6">
                                {category.icon}
                                <div>
                                  <h2 className="text-lg font-bold text-glyph-bright">
                                    {category.label}
                                  </h2>
                                  <p className="text-sm text-glyph-accent">
                                    {category.items.length} available tools
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                {category.items.map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    disabled={item.comingSoon}
                                    className={`
                                  group p-4 rounded-lg border text-left transition-all duration-200
                                  ${
                                    currentPage === item.id
                                      ? "bg-flame-blue/10 border-flame-blue text-flame-blue"
                                      : item.comingSoon
                                        ? "bg-cosmic-medium/30 border-cosmic-light/30 text-glyph-secondary cursor-not-allowed"
                                        : "bg-cosmic-medium border-cosmic-light hover:border-flame-blue/50 hover:bg-cosmic-light/20 text-glyph-accent hover:text-glyph-bright"
                                  }
                                `}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`
                                      p-2 rounded-lg
                                      ${
                                        currentPage === item.id
                                          ? "bg-flame-blue/20"
                                          : item.comingSoon
                                            ? "bg-cosmic-light/10"
                                            : "bg-cosmic-light/20 group-hover:bg-flame-blue/20"
                                      }
                                    `}
                                        >
                                          {item.icon}
                                        </div>
                                        <div>
                                          <h3 className="font-medium text-sm">
                                            {item.label}
                                          </h3>
                                          {item.badge && (
                                            <span className="inline-block text-xs bg-flame-blue/20 text-flame-blue px-2 py-0.5 rounded-full mt-1">
                                              {item.badge}
                                            </span>
                                          )}
                                          {item.comingSoon && (
                                            <span className="inline-block text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full mt-1">
                                              Coming Soon
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-xs opacity-80 leading-relaxed">
                                      {item.description}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 md:h-96">
                        <div className="text-center px-4">
                          <div className="w-16 h-16 rounded-full bg-cosmic-light/10 flex items-center justify-center mx-auto mb-4">
                            <FaBox className="h-8 w-8 text-flame-blue" />
                          </div>
                          <h3 className="text-lg font-medium text-glyph-bright mb-2">
                            {getContextTitle()}
                          </h3>
                          <p className="text-sm text-glyph-accent max-w-sm">
                            Select a category to explore tools available at your
                            current navigation level.
                          </p>
                          {breadcrumbs.length > 0 && (
                            <div className="mt-3 text-xs text-glyph-secondary">
                              Context:{" "}
                              {breadcrumbs.map((b) => b.name).join(" → ")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Access Footer */}
                <div className="border-t border-cosmic-light bg-cosmic-deep/30 p-3 md:p-4 mt-auto md:mt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-glyph-accent">
                      <span className="hidden sm:inline">Quick Access:</span>
                      <button
                        onClick={() => handleItemClick("dashboard")}
                        className="hover:text-flame-blue transition-colors"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleItemClick("ipsumarium")}
                        className="hover:text-flame-blue transition-colors"
                      >
                        Content Manager
                      </button>
                      <button
                        onClick={() => handleItemClick("characters")}
                        className="hover:text-flame-blue transition-colors"
                      >
                        Characters
                      </button>
                    </div>
                    <div className="text-xs text-glyph-secondary">
                      Press{" "}
                      <kbd className="px-1.5 py-0.5 bg-cosmic-medium rounded text-glyph-accent">
                        Esc
                      </kbd>{" "}
                      to close
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
