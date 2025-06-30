import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaRocket,
  FaAtom,
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
  FaPaintBrush,
  FaCode,
  FaMagic,
  FaLink,
} from "react-icons/fa";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned" | "backlog";
  priority: "high" | "medium" | "low";
  category: string;
  icon: React.ReactNode;
  progress?: number;
  dependencies?: string[];
  estimatedCompletion?: string;
}

const roadmapData: RoadmapItem[] = [
  // Core Infrastructure - Completed
  {
    id: "auth-system",
    title: "Authentication System",
    description: "Complete user authentication with Supabase integration",
    status: "completed",
    priority: "high",
    category: "Infrastructure",
    icon: <FaCog className="h-5 w-5" />,
    progress: 100,
  },
  {
    id: "database-schema",
    title: "Database Schema Foundation",
    description: "Core tables and relationships for loreum multiverse system",
    status: "completed",
    priority: "high",
    category: "Infrastructure",
    icon: <FaDatabase className="h-5 w-5" />,
    progress: 100,
  },
  {
    id: "ui-components",
    title: "UI Component Library",
    description: "Shadcn/ui components with cosmic theme integration",
    status: "completed",
    priority: "high",
    category: "Infrastructure",
    icon: <FaPalette className="h-5 w-5" />,
    progress: 100,
  },

  // Core Features - Mostly Complete
  {
    id: "multiverse-explorer",
    title: "Multiverse Explorer",
    description:
      "Navigate through multiverse hierarchy (Multiverse → Universe → Timeline → World)",
    status: "completed",
    priority: "high",
    category: "Core Features",
    icon: <FaAtom className="h-5 w-5" />,
    progress: 90,
  },
  {
    id: "content-manager",
    title: "Content Manager (Ipsumarium)",
    description: "Template-based content creation and management system",
    status: "completed",
    priority: "high",
    category: "Core Features",
    icon: <FaDatabase className="h-5 w-5" />,
    progress: 85,
  },
  {
    id: "template-instances",
    title: "Template Instance System",
    description:
      "Create and manage instances of templates with context awareness",
    status: "completed",
    priority: "high",
    category: "Core Features",
    icon: <FaBox className="h-5 w-5" />,
    progress: 80,
  },

  // Character & Civilization Systems
  {
    id: "characters-manager",
    title: "Characters Manager",
    description: "Character creation, management, and relationship tracking",
    status: "completed",
    priority: "high",
    category: "World Building",
    icon: <FaTheaterMasks className="h-5 w-5" />,
    progress: 75,
  },
  {
    id: "civilization-builder",
    title: "Civilization Builder",
    description:
      "Complex civilization creation with species, governments, and social structures",
    status: "completed",
    priority: "high",
    category: "World Building",
    icon: <FaUsers className="h-5 w-5" />,
    progress: 70,
  },
  {
    id: "culture-designer",
    title: "Culture Designer",
    description: "Cultural systems and traditions design interface",
    status: "completed",
    priority: "medium",
    category: "World Building",
    icon: <FaPalette className="h-5 w-5" />,
    progress: 65,
  },

  // Magic & Tech Systems
  {
    id: "magic-systems",
    title: "Magic Systems Manager",
    description: "Design and manage magical systems with rules and progression",
    status: "completed",
    priority: "medium",
    category: "Systems",
    icon: <FaAtom className="h-5 w-5" />,
    progress: 70,
  },
  {
    id: "tech-tree",
    title: "Technology Tree Designer",
    description: "Technology progression trees for civilizations",
    status: "completed",
    priority: "medium",
    category: "Systems",
    icon: <FaCog className="h-5 w-5" />,
    progress: 70,
  },
  {
    id: "item-editor",
    title: "Item & Equipment Editor",
    description: "Create and manage items, equipment, and enchantments",
    status: "completed",
    priority: "medium",
    category: "Systems",
    icon: <FaBox className="h-5 w-5" />,
    progress: 65,
  },

  // World Building Tools
  {
    id: "region-editor",
    title: "Region Editor",
    description:
      "Geographic region creation with terrain, climate, and resources",
    status: "completed",
    priority: "medium",
    category: "World Building",
    icon: <FaMap className="h-5 w-5" />,
    progress: 75,
  },
  {
    id: "planetary-structures",
    title: "Planetary Structures",
    description: "Large-scale planetary features and megastructures",
    status: "completed",
    priority: "medium",
    category: "World Building",
    icon: <FaLayerGroup className="h-5 w-5" />,
    progress: 60,
  },

  // Narrative & Lore Systems
  {
    id: "lore-graph",
    title: "Lore Graph System",
    description:
      "Interactive knowledge graph for lore connections and causality",
    status: "in-progress",
    priority: "high",
    category: "Narrative",
    icon: <FaNetworkWired className="h-5 w-5" />,
    progress: 40,
    estimatedCompletion: "Q2 2024",
  },
  {
    id: "narrative-layer",
    title: "Narrative Layer",
    description: "Story composition and narrative structure tools",
    status: "in-progress",
    priority: "high",
    category: "Narrative",
    icon: <FaBook className="h-5 w-5" />,
    progress: 35,
    estimatedCompletion: "Q2 2024",
  },

  // Advanced Features - Planned
  {
    id: "astraloom",
    title: "Astraloom (Star Navigation)",
    description:
      "Advanced star system navigation and cosmic-scale world building",
    status: "planned",
    priority: "medium",
    category: "Advanced Features",
    icon: <FaRocket className="h-5 w-5" />,
    progress: 10,
    dependencies: ["multiverse-explorer"],
    estimatedCompletion: "Q3 2024",
  },
  {
    id: "artboard-visual",
    title: "Visual Artboard",
    description: "Visual asset management and world map generation",
    status: "planned",
    priority: "medium",
    category: "Advanced Features",
    icon: <FaPaintBrush className="h-5 w-5" />,
    progress: 5,
    estimatedCompletion: "Q3 2024",
  },
  {
    id: "spell-catalogs",
    title: "Spell Catalogs & Ability Framework",
    description:
      "Detailed spell/ability management with progression trees, prerequisites, and cross-system interactions",
    status: "planned",
    priority: "high",
    category: "Magic Systems",
    icon: <FaMagic className="h-5 w-5" />,
    progress: 0,
    dependencies: ["magic-systems"],
    estimatedCompletion: "Q2 2024",
  },
  {
    id: "magic-interactions",
    title: "Magic System Interactions",
    description:
      "Define how different magic systems interact, conflict, or synergize with each other",
    status: "planned",
    priority: "medium",
    category: "Magic Systems",
    icon: <FaAtom className="h-5 w-5" />,
    progress: 0,
    dependencies: ["magic-systems", "spell-catalogs"],
    estimatedCompletion: "Q3 2024",
  },
  {
    id: 'custom-theming',
    title: 'Custom Theme System',
    description: 'Allow users to create custom themes beyond cosmic. Light mode, dark variations, and user-defined color schemes',
    status: 'planned',
    priority: 'medium',
    category: 'UI/UX',
    icon: <FaPalette className="h-5 w-5" />,
    progress: 0,
    estimatedCompletion: 'Q3 2024'
  },
  {
    id: 'ai-integration',
    title: 'AI Content Generation',
    description: 'AI-powered content suggestions and generation assistance',
    status: 'planned',
    priority: 'low',
    category: 'AI Features',
    icon: <FaAtom className="h-5 w-5" />,
    progress: 0,
    estimatedCompletion: 'Q4 2024'
  },

  // Integration & Export
  {
    id: "export-system",
    title: "Export & Sharing System",
    description:
      "Export worlds and content in various formats (JSON, Markdown, PDF)",
    status: "planned",
    priority: "medium",
    category: "Integration",
    icon: <FaLink className="h-5 w-5" />,
    progress: 0,
    estimatedCompletion: "Q3 2024",
  },
  {
    id: "collaboration",
    title: "Real-time Collaboration",
    description: "Multi-user editing and collaborative world building",
    status: "backlog",
    priority: "low",
    category: "Integration",
    icon: <FaUsers className="h-5 w-5" />,
    progress: 0,
    estimatedCompletion: "Q4 2024",
  },

  // Developer Experience
  {
    id: "api-documentation",
    title: "API Documentation",
    description: "Comprehensive API docs for developers and integrators",
    status: "planned",
    priority: "medium",
    category: "Developer Experience",
    icon: <FaCode className="h-5 w-5" />,
    progress: 20,
    estimatedCompletion: "Q2 2024",
  },
  {
    id: "plugin-system",
    title: "Plugin Architecture",
    description: "Extensible plugin system for custom functionality",
    status: "backlog",
    priority: "low",
    category: "Developer Experience",
    icon: <FaCog className="h-5 w-5" />,
    progress: 0,
    estimatedCompletion: "Q4 2024",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <FaCheck className="h-4 w-4 text-green-500" />;
    case "in-progress":
      return <FaClock className="h-4 w-4 text-blue-500" />;
    case "planned":
      return <FaRocket className="h-4 w-4 text-yellow-500" />;
    case "backlog":
      return <FaExclamationTriangle className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
};

const getPriorityBadge = (priority: string) => {
  const colors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <Badge
      variant="outline"
      className={colors[priority as keyof typeof colors]}
    >
      {priority.toUpperCase()}
    </Badge>
  );
};

export const Roadmap: React.FC = () => {
  const categories = [...new Set(roadmapData.map((item) => item.category))];

  const getOverallProgress = () => {
    const totalItems = roadmapData.length;
    const completedItems = roadmapData.filter(
      (item) => item.status === "completed",
    ).length;
    const inProgressItems = roadmapData.filter(
      (item) => item.status === "in-progress",
    ).length;

    return {
      completed: Math.round((completedItems / totalItems) * 100),
      inProgress: Math.round((inProgressItems / totalItems) * 100),
      totalItems,
      completedItems,
      inProgressItems,
    };
  };

  const progress = getOverallProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-serif text-glyph-bright">
          Loreum Development Roadmap
        </h1>
        <p className="text-lg text-glyph-accent max-w-3xl mx-auto">
          A comprehensive worldbuilding platform for architects of infinite
          realities. Track our progress as we build tools for creating complex,
          interconnected universes.
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="glass-panel border-cosmic-light">
        <CardHeader>
          <CardTitle className="text-glyph-bright flex items-center gap-2">
            <FaRocket className="h-5 w-5 text-flame-blue" />
            Overall Progress
          </CardTitle>
          <CardDescription className="text-glyph-accent">
            {progress.completedItems} of {progress.totalItems} features
            completed, {progress.inProgressItems} in active development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-glyph-accent">
              <span>Completed: {progress.completed}%</span>
              <span>In Progress: {progress.inProgress}%</span>
            </div>
            <Progress value={progress.completed} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-400">
                  {progress.completedItems}
                </div>
                <div className="text-xs text-glyph-accent">Completed</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-400">
                  {progress.inProgressItems}
                </div>
                <div className="text-xs text-glyph-accent">In Progress</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-400">
                  {
                    roadmapData.filter((item) => item.status === "planned")
                      .length
                  }
                </div>
                <div className="text-xs text-glyph-accent">Planned</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-400">
                  {
                    roadmapData.filter((item) => item.status === "backlog")
                      .length
                  }
                </div>
                <div className="text-xs text-glyph-accent">Backlog</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap by Category */}
      {categories.map((category) => {
        const categoryItems = roadmapData.filter(
          (item) => item.category === category,
        );

        return (
          <Card key={category} className="glass-panel border-cosmic-light">
            <CardHeader>
              <CardTitle className="text-glyph-bright">{category}</CardTitle>
              <CardDescription className="text-glyph-accent">
                {categoryItems.length} features in this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryItems.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-cosmic-medium border-cosmic-light hover:border-flame-blue/30 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-flame-blue">{item.icon}</div>
                          <CardTitle className="text-sm text-glyph-bright">
                            {item.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          {getPriorityBadge(item.priority)}
                        </div>
                      </div>
                      <CardDescription className="text-xs text-glyph-accent">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {item.progress !== undefined && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-glyph-accent">
                              <span>Progress</span>
                              <span>{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-1" />
                          </div>
                        )}

                        {item.estimatedCompletion && (
                          <div className="text-xs text-glyph-accent">
                            <strong>Target:</strong> {item.estimatedCompletion}
                          </div>
                        )}

                        {item.dependencies && item.dependencies.length > 0 && (
                          <div className="text-xs text-glyph-accent">
                            <strong>Depends on:</strong>{" "}
                            {item.dependencies.join(", ")}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Footer */}
      <Card className="glass-panel border-cosmic-light">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-glyph-accent">
              This roadmap is living document and may evolve based on user
              feedback and development priorities.
            </p>
            <p className="text-sm text-glyph-secondary">
              Last updated: {new Date().toLocaleDateString()} • Version 1.0.0
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Roadmap;
