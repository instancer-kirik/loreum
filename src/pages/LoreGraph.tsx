import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  FaNetworkWired,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLink,
  FaUnlink,
  FaSearch,
  FaFilter,
  FaGlobe,
  FaUsers,
  FaBox,
  FaCog,
  FaMagic,
  FaPalette,
  FaScroll,
  FaExclamationTriangle,
  FaCheck,
  FaClock,
  FaArrowRight,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

interface LoreNode {
  id: string;
  name: string;
  description: string;
  type:
    | "event"
    | "character"
    | "item"
    | "location"
    | "concept"
    | "organization"
    | "conflict";
  year?: number;
  worldId?: string;
  connections: LoreConnection[];
  causality: {
    causes?: string[];
    effects?: string[];
    triggers?: string[];
  };
  importance: "low" | "medium" | "high" | "critical";
  status: "draft" | "confirmed" | "legendary" | "disputed";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface LoreConnection {
  id: string;
  targetNodeId: string;
  connectionType:
    | "causes"
    | "influenced_by"
    | "related_to"
    | "conflicts_with"
    | "depends_on"
    | "created_by"
    | "destroyed_by";
  strength: number; // 1-10
  description?: string;
  timeframe?: {
    start?: number;
    end?: number;
  };
}

interface LoreGraphNode {
  id: string;
  node: LoreNode;
  x: number;
  y: number;
  connections: string[];
}

const nodeTypeIcons = {
  event: <FaScroll className="h-4 w-4" />,
  character: <FaUsers className="h-4 w-4" />,
  item: <FaBox className="h-4 w-4" />,
  location: <FaGlobe className="h-4 w-4" />,
  concept: <FaMagic className="h-4 w-4" />,
  organization: <FaPalette className="h-4 w-4" />,
  conflict: <FaExclamationTriangle className="h-4 w-4" />,
};

const connectionTypeColors = {
  causes: "text-red-400",
  influenced_by: "text-blue-400",
  related_to: "text-gray-400",
  conflicts_with: "text-orange-400",
  depends_on: "text-green-400",
  created_by: "text-purple-400",
  destroyed_by: "text-red-600",
};

const mockLoreNodes: LoreNode[] = [
  {
    id: "1",
    name: "The Great Convergence",
    description:
      "A cosmic event that brought multiple timelines together, creating rifts in reality",
    type: "event",
    year: 1247,
    worldId: "world-1",
    connections: [
      {
        id: "c1",
        targetNodeId: "2",
        connectionType: "causes",
        strength: 9,
        description: "Led to the formation of the Ethereal Watch",
      },
      {
        id: "c2",
        targetNodeId: "3",
        connectionType: "created_by",
        strength: 7,
        description: "Resulted from dimensional folding experiments",
      },
    ],
    causality: {
      causes: ["Reality became unstable", "Multiple timelines merged"],
      effects: [
        "Formation of new organizations",
        "Discovery of quantum crystals",
      ],
      triggers: ["Dimensional experiments", "Harmonic resonance overflow"],
    },
    importance: "critical",
    status: "confirmed",
    tags: ["cosmic", "dimensional", "convergence"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "The Ethereal Watch",
    description:
      "Organization formed to monitor dimensional stability after the Great Convergence",
    type: "organization",
    year: 1248,
    worldId: "world-1",
    connections: [
      {
        id: "c3",
        targetNodeId: "4",
        connectionType: "depends_on",
        strength: 8,
        description: "Uses quantum crystals for detection",
      },
    ],
    causality: {
      causes: [
        "Need for dimensional monitoring",
        "Ethereal beings joining material realm",
      ],
      effects: ["Stabilized reality rifts", "Advanced detection networks"],
    },
    importance: "high",
    status: "confirmed",
    tags: ["organization", "ethereal", "monitoring"],
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "3",
    name: "Dimensional Folding Technology",
    description:
      "Advanced technology capable of manipulating space-time dimensions",
    type: "concept",
    year: 1200,
    worldId: "world-1",
    connections: [
      {
        id: "c4",
        targetNodeId: "4",
        connectionType: "related_to",
        strength: 6,
        description: "Enhanced by quantum resonance properties",
      },
    ],
    causality: {
      causes: ["Quest for faster travel", "Understanding of space-time"],
      effects: ["Unintended timeline mergers", "Creation of reality rifts"],
    },
    importance: "high",
    status: "confirmed",
    tags: ["technology", "dimensional", "experimental"],
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "4",
    name: "Quantum Resonance Crystals",
    description:
      "Crystalline structures that amplify quantum effects and detect dimensional anomalies",
    type: "item",
    year: 1250,
    worldId: "world-1",
    connections: [],
    causality: {
      causes: [
        "Formed during dimensional convergence",
        "Quantum energy crystallization",
      ],
      effects: [
        "Enhanced magical abilities",
        "Dimensional detection capabilities",
      ],
    },
    importance: "medium",
    status: "confirmed",
    tags: ["crystal", "quantum", "magical"],
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-23"),
  },
];

export const LoreGraph: React.FC = () => {
  const { navigationContext } = useAppContext();
  const [loreNodes, setLoreNodes] = useState<LoreNode[]>(mockLoreNodes);
  const [selectedNode, setSelectedNode] = useState<LoreNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"graph" | "list" | "timeline">(
    "graph",
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter nodes based on search and type
  const filteredNodes = loreNodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesType = selectedType === "all" || node.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get connection strength color
  const getConnectionStrengthColor = (strength: number) => {
    if (strength >= 8) return "border-red-400";
    if (strength >= 6) return "border-yellow-400";
    if (strength >= 4) return "border-blue-400";
    return "border-gray-400";
  };

  // Get importance badge styling
  const getImportanceBadge = (importance: string) => {
    const styles = {
      critical: "bg-red-500/20 text-red-400 border-red-500/30",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      low: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return styles[importance as keyof typeof styles] || styles.low;
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <FaCheck className="h-3 w-3 text-green-400" />;
      case "draft":
        return <FaClock className="h-3 w-3 text-yellow-400" />;
      case "legendary":
        return <FaMagic className="h-3 w-3 text-purple-400" />;
      case "disputed":
        return <FaExclamationTriangle className="h-3 w-3 text-red-400" />;
      default:
        return null;
    }
  };

  // Find connected nodes
  const getConnectedNodes = (nodeId: string) => {
    const node = loreNodes.find((n) => n.id === nodeId);
    if (!node) return [];

    return node.connections
      .map((conn) => {
        const targetNode = loreNodes.find((n) => n.id === conn.targetNodeId);
        return { connection: conn, node: targetNode };
      })
      .filter((item) => item.node);
  };

  // Timeline view sorting
  const getTimelineSortedNodes = () => {
    return [...filteredNodes]
      .filter((node) => node.year)
      .sort((a, b) => (a.year || 0) - (b.year || 0));
  };

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-glyph-bright flex items-center gap-3">
            <FaNetworkWired className="h-8 w-8 text-flame-blue" />
            Lore Graph
          </h1>
          <p className="text-glyph-accent mt-1">
            Map the interconnected web of events, characters, and concepts that
            shape your world
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="glass-panel border-cosmic-light hover:border-flame-blue/30"
          >
            {isExpanded ? (
              <FaCompress className="h-4 w-4" />
            ) : (
              <FaExpand className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-flame-blue hover:bg-flame-blue/80 text-white"
          >
            <FaPlus className="h-4 w-4 mr-2" />
            Add Lore Node
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="glass-panel border-cosmic-light">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 min-w-64">
              <FaSearch className="h-4 w-4 text-glyph-accent" />
              <Input
                placeholder="Search lore nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-cosmic-medium border-cosmic-light"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="h-4 w-4 text-glyph-accent" />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 bg-cosmic-medium border-cosmic-light">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="character">Characters</SelectItem>
                  <SelectItem value="item">Items</SelectItem>
                  <SelectItem value="location">Locations</SelectItem>
                  <SelectItem value="concept">Concepts</SelectItem>
                  <SelectItem value="organization">Organizations</SelectItem>
                  <SelectItem value="conflict">Conflicts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as any)}
            >
              <TabsList className="bg-cosmic-medium">
                <TabsTrigger value="graph">Graph</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Stats */}
            <div className="ml-auto flex items-center gap-4 text-sm text-glyph-accent">
              <span>{filteredNodes.length} nodes</span>
              <span>
                {loreNodes.reduce(
                  (acc, node) => acc + node.connections.length,
                  0,
                )}{" "}
                connections
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex gap-6">
        {/* Primary View */}
        <Card
          className={`glass-panel border-cosmic-light ${selectedNode ? "flex-1" : "w-full"}`}
        >
          <CardHeader>
            <CardTitle className="text-glyph-bright">
              {viewMode === "graph"
                ? "Graph View"
                : viewMode === "list"
                  ? "List View"
                  : "Timeline View"}
            </CardTitle>
            <CardDescription className="text-glyph-accent">
              {viewMode === "graph" &&
                "Visual representation of lore connections"}
              {viewMode === "list" && "Detailed list of all lore nodes"}
              {viewMode === "timeline" && "Chronological timeline of events"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {viewMode === "graph" && (
              <div className="h-96 bg-cosmic-deep rounded-lg border border-cosmic-light relative overflow-hidden">
                {/* Simple graph visualization placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-8 p-8">
                    {filteredNodes.slice(0, 9).map((node, index) => (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`
                          relative p-3 rounded-lg border-2 cursor-pointer transition-all
                          ${selectedNode?.id === node.id ? "border-flame-blue bg-flame-blue/10" : "border-cosmic-light bg-cosmic-medium hover:border-flame-blue/50"}
                        `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {nodeTypeIcons[node.type]}
                          <span className="text-xs font-medium text-glyph-bright truncate">
                            {node.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className={getImportanceBadge(node.importance)}
                          >
                            {node.importance}
                          </Badge>
                          {getStatusIcon(node.status)}
                        </div>
                        {/* Connection lines would be rendered here in a real implementation */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-3 max-h-96 overflow-y-auto cosmic-scrollbar">
                {filteredNodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedNode?.id === node.id ? "border-flame-blue bg-flame-blue/5" : "border-cosmic-light bg-cosmic-medium hover:border-flame-blue/30"}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {nodeTypeIcons[node.type]}
                          <h3 className="font-medium text-glyph-bright">
                            {node.name}
                          </h3>
                          {node.year && (
                            <span className="text-xs text-glyph-accent">
                              Year {node.year}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-glyph-accent mb-2 line-clamp-2">
                          {node.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getImportanceBadge(node.importance)}
                          >
                            {node.importance}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(node.status)}
                            <span className="text-xs text-glyph-accent">
                              {node.status}
                            </span>
                          </div>
                          <span className="text-xs text-glyph-accent">
                            {node.connections.length} connections
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === "timeline" && (
              <div className="space-y-4 max-h-96 overflow-y-auto cosmic-scrollbar">
                {getTimelineSortedNodes().map((node, index) => (
                  <div key={node.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-flame-blue"></div>
                      {index < getTimelineSortedNodes().length - 1 && (
                        <div className="w-px h-16 bg-cosmic-light mt-2"></div>
                      )}
                    </div>
                    <div
                      className={`
                        flex-1 p-3 rounded-lg border cursor-pointer transition-all
                        ${selectedNode?.id === node.id ? "border-flame-blue bg-flame-blue/5" : "border-cosmic-light bg-cosmic-medium hover:border-flame-blue/30"}
                      `}
                      onClick={() => setSelectedNode(node)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-flame-blue">
                          Year {node.year}
                        </span>
                        {nodeTypeIcons[node.type]}
                        <h3 className="font-medium text-glyph-bright">
                          {node.name}
                        </h3>
                      </div>
                      <p className="text-sm text-glyph-accent">
                        {node.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Node Details Panel */}
        {selectedNode && (
          <Card className="w-80 glass-panel border-cosmic-light">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {nodeTypeIcons[selectedNode.type]}
                  <CardTitle className="text-glyph-bright">
                    {selectedNode.name}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                  className="text-glyph-accent hover:text-glyph-bright"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-glyph-accent mb-2">
                  {selectedNode.description}
                </p>
                {selectedNode.year && (
                  <p className="text-xs text-glyph-secondary">
                    Year: {selectedNode.year}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={getImportanceBadge(selectedNode.importance)}
                >
                  {selectedNode.importance}
                </Badge>
                <div className="flex items-center gap-1">
                  {getStatusIcon(selectedNode.status)}
                  <span className="text-xs text-glyph-accent">
                    {selectedNode.status}
                  </span>
                </div>
              </div>

              {selectedNode.tags.length > 0 && (
                <div>
                  <Label className="text-xs text-glyph-accent">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNode.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Causality */}
              {(selectedNode.causality.causes?.length ||
                selectedNode.causality.effects?.length) && (
                <div>
                  <Label className="text-xs text-glyph-accent">Causality</Label>
                  <div className="space-y-2 mt-1">
                    {selectedNode.causality.causes &&
                      selectedNode.causality.causes.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-red-400">
                            Causes:
                          </div>
                          <ul className="text-xs text-glyph-accent space-y-1">
                            {selectedNode.causality.causes.map((cause, idx) => (
                              <li key={idx}>• {cause}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {selectedNode.causality.effects &&
                      selectedNode.causality.effects.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-green-400">
                            Effects:
                          </div>
                          <ul className="text-xs text-glyph-accent space-y-1">
                            {selectedNode.causality.effects.map(
                              (effect, idx) => (
                                <li key={idx}>• {effect}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Connections */}
              {selectedNode.connections.length > 0 && (
                <div>
                  <Label className="text-xs text-glyph-accent">
                    Connections ({selectedNode.connections.length})
                  </Label>
                  <div className="space-y-2 mt-1">
                    {getConnectedNodes(selectedNode.id).map(
                      ({ connection, node }) => (
                        <div
                          key={connection.id}
                          className="p-2 rounded border border-cosmic-light bg-cosmic-deep"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-glyph-bright">
                              {node?.name}
                            </span>
                            <div
                              className={`w-2 h-2 rounded-full ${getConnectionStrengthColor(connection.strength).replace("border-", "bg-")}`}
                            ></div>
                          </div>
                          <div
                            className={`text-xs ${connectionTypeColors[connection.connectionType]}`}
                          >
                            {connection.connectionType.replace("_", " ")}{" "}
                            (strength: {connection.strength})
                          </div>
                          {connection.description && (
                            <div className="text-xs text-glyph-accent mt-1">
                              {connection.description}
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-cosmic-light">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-cosmic-light hover:border-flame-blue/30"
                  >
                    <FaEdit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cosmic-light hover:border-red-500/30 text-red-400"
                  >
                    <FaTrash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
