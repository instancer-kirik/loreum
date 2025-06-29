import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
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
  FaBook, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaChevronRight,
  FaChevronDown,
  FaSearch,
  FaFilter,
  FaCrown,
  FaFistRaised,
  FaHandshake,
  FaGem,
  FaShip,
  FaSnowflake,
  FaUsers,
  FaExpand,
  FaCompress,
  FaStar
} from 'react-icons/fa';
import { useAppContext } from "../context/AppContext";

interface NarrativeEvent {
  id: string;
  title: string;
  description: string;
  type:
    | "political"
    | "military"
    | "economic"
    | "cultural"
    | "natural"
    | "technological"
    | "diplomatic"
    | "religious";
  category:
    | "empire_rise"
    | "empire_fall"
    | "war"
    | "trade_route"
    | "disaster"
    | "revolution"
    | "diplomacy"
    | "discovery";
  startYear: number;
  endYear?: number;
  duration?: string;
  participants: string[];
  location: string;
  impact: "local" | "regional" | "global" | "cosmic";
  importance: "minor" | "significant" | "major" | "legendary";
  consequences: string[];
  relatedEvents: string[];
  status: "historical" | "ongoing" | "prophesied" | "disputed";
  tags: string[];
  worldId?: string;
  timelineId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NarrativeThread {
  id: string;
  name: string;
  description: string;
  theme: string;
  events: string[];
  startYear: number;
  endYear?: number;
  isActive: boolean;
  color: string;
}

const eventTypeIcons = {
  political: <FaCrown className="h-4 w-4" />,
  military: <FaFistRaised className="h-4 w-4" />,
  economic: <FaGem className="h-4 w-4" />,
  cultural: <FaUsers className="h-4 w-4" />,
  natural: <FaSnowflake className="h-4 w-4" />,
  technological: <FaShip className="h-4 w-4" />,
  diplomatic: <FaHandshake className="h-4 w-4" />,
  religious: <FaStar className="h-4 w-4" />
};

const impactColors = {
  local: "text-green-400",
  regional: "text-blue-400",
  global: "text-orange-400",
  cosmic: "text-purple-400",
};

const importanceColors = {
  minor: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  significant: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  major: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  legendary: "bg-red-500/20 text-red-400 border-red-500/30",
};

const mockNarrativeEvents: NarrativeEvent[] = [
  {
    id: "1",
    title: "The Ethereal Empire's Foundation",
    description:
      "Following the Great Convergence, ethereal beings established the first interdimensional empire, uniting multiple reality layers under a single governance structure.",
    type: "political",
    category: "empire_rise",
    startYear: 1250,
    endYear: 1255,
    duration: "5 years",
    participants: ["Ethereal Beings", "Reality Refugees", "Quantum Artificers"],
    location: "Convergence Nexus",
    impact: "cosmic",
    importance: "legendary",
    consequences: [
      "Established interdimensional law",
      "Created the Reality Council",
      "Standardized dimensional currency",
      "Founded the Ethereal Academy",
    ],
    relatedEvents: ["2", "3"],
    status: "historical",
    tags: ["empire", "ethereal", "dimensional", "foundation"],
    worldId: "world-1",
    timelineId: "timeline-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "The Quantum Wars",
    description:
      "A series of conflicts between different factions over control of quantum resonance crystals and dimensional folding technology.",
    type: "military",
    category: "war",
    startYear: 1260,
    endYear: 1275,
    duration: "15 years",
    participants: [
      "Ethereal Empire",
      "Crystal Miners Guild",
      "Dimensional Pirates",
      "Free Realms Alliance",
    ],
    location: "Multiple Dimensions",
    impact: "global",
    importance: "major",
    consequences: [
      "Devastation of several reality layers",
      "Formation of the Dimensional Accords",
      "Rise of the Peacekeeping Force",
      "Technological advancement in warfare",
    ],
    relatedEvents: ["1", "3", "4"],
    status: "historical",
    tags: ["war", "quantum", "dimensional", "crystals"],
    worldId: "world-1",
    timelineId: "timeline-1",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "3",
    title: "The Great Trade Route Establishment",
    description:
      "Creation of stable interdimensional trade routes connecting major reality nexuses, revolutionizing commerce across the multiverse.",
    type: "economic",
    category: "trade_route",
    startYear: 1280,
    endYear: 1285,
    duration: "5 years",
    participants: [
      "Merchant Houses",
      "Ethereal Empire",
      "Dimensional Navigators",
    ],
    location: "Cross-Dimensional Space",
    impact: "global",
    importance: "major",
    consequences: [
      "Economic boom across dimensions",
      "Cultural exchange acceleration",
      "Standardization of measurements",
      "Rise of merchant nobility",
    ],
    relatedEvents: ["1", "2", "5"],
    status: "historical",
    tags: ["trade", "economics", "routes", "commerce"],
    worldId: "world-1",
    timelineId: "timeline-1",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "4",
    title: "The Reality Plague",
    description:
      "A mysterious phenomenon causing sections of reality to become unstable and fade, threatening the fabric of existence itself.",
    type: "natural",
    category: "disaster",
    startYear: 1290,
    endYear: 1295,
    duration: "5 years",
    participants: ["Reality Healers", "Ethereal Empire", "Quantum Researchers"],
    location: "Outer Reality Layers",
    impact: "cosmic",
    importance: "legendary",
    consequences: [
      "Loss of entire dimensional sectors",
      "Development of reality stabilization tech",
      "Formation of the Reality Watch",
      "Discovery of reality immune populations",
    ],
    relatedEvents: ["2", "5"],
    status: "historical",
    tags: ["disaster", "reality", "plague", "existential"],
    worldId: "world-1",
    timelineId: "timeline-1",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-23"),
  },
  {
    id: "5",
    title: "The Harmonic Revolution",
    description:
      "A cultural and technological revolution sparked by the discovery of harmonic magic, fundamentally changing how beings interact with reality.",
    type: "cultural",
    category: "revolution",
    startYear: 1300,
    duration: "Ongoing",
    participants: [
      "Harmonic Practitioners",
      "Traditional Mages",
      "Ethereal Empire",
    ],
    location: "Multiple Worlds",
    impact: "global",
    importance: "major",
    consequences: [
      "Democratization of magical abilities",
      "Social upheaval in traditional societies",
      "New forms of art and expression",
      "Technological-magical integration",
    ],
    relatedEvents: ["3", "4"],
    status: "ongoing",
    tags: ["revolution", "magic", "harmonic", "cultural"],
    worldId: "world-1",
    timelineId: "timeline-1",
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-24"),
  },
];

const mockNarrativeThreads: NarrativeThread[] = [
  {
    id: "t1",
    name: "Rise of the Ethereal Empire",
    description:
      "The establishment and expansion of interdimensional governance",
    theme: "Political Ascension",
    events: ["1", "2", "3"],
    startYear: 1250,
    endYear: 1285,
    isActive: false,
    color: "purple",
  },
  {
    id: "t2",
    name: "The Reality Crisis",
    description: "Existential threats to the fabric of reality itself",
    theme: "Cosmic Horror",
    events: ["4"],
    startYear: 1290,
    endYear: 1295,
    isActive: false,
    color: "red",
  },
  {
    id: "t3",
    name: "The Harmonic Age",
    description: "Cultural and magical transformation of society",
    theme: "Cultural Evolution",
    events: ["5"],
    startYear: 1300,
    isActive: true,
    color: "blue",
  },
];

export const NarrativeLayer: React.FC = () => {
  const { navigationContext } = useAppContext();
  const [narrativeEvents, setNarrativeEvents] =
    useState<NarrativeEvent[]>(mockNarrativeEvents);
  const [narrativeThreads, setNarrativeThreads] =
    useState<NarrativeThread[]>(mockNarrativeThreads);
  const [selectedEvent, setSelectedEvent] = useState<NarrativeEvent | null>(
    null,
  );
  const [selectedThread, setSelectedThread] = useState<NarrativeThread | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<
    "timeline" | "threads" | "events" | "impact"
  >("timeline");
  const [timelineRange, setTimelineRange] = useState<{
    start: number;
    end: number;
  }>({ start: 1200, end: 1350 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    new Set(),
  );

  // Filter events based on search and filters
  const filteredEvents = narrativeEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Get events in timeline range
  const timelineEvents = filteredEvents
    .filter(
      (event) =>
        event.startYear >= timelineRange.start &&
        event.startYear <= timelineRange.end,
    )
    .sort((a, b) => a.startYear - b.startYear);

  // Toggle thread expansion
  const toggleThreadExpansion = (threadId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(threadId)) {
      newExpanded.delete(threadId);
    } else {
      newExpanded.add(threadId);
    }
    setExpandedThreads(newExpanded);
  };

  // Get events for a thread
  const getThreadEvents = (thread: NarrativeThread) => {
    return narrativeEvents.filter((event) => thread.events.includes(event.id));
  };

  // Get impact statistics
  const getImpactStats = () => {
    const stats = {
      local: filteredEvents.filter((e) => e.impact === "local").length,
      regional: filteredEvents.filter((e) => e.impact === "regional").length,
      global: filteredEvents.filter((e) => e.impact === "global").length,
      cosmic: filteredEvents.filter((e) => e.impact === "cosmic").length,
    };
    return stats;
  };

  const impactStats = getImpactStats();

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-glyph-bright flex items-center gap-3">
            <FaBook className="h-8 w-8 text-flame-blue" />
            Narrative Layer
          </h1>
          <p className="text-glyph-accent mt-1">
            Chronicle the rise and fall of empires, pivotal conflicts, and
            transformative moments that shape reality
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
          <Button className="bg-flame-blue hover:bg-flame-blue/80 text-white">
            <FaPlus className="h-4 w-4 mr-2" />
            Add Event
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
                placeholder="Search narrative events..."
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
                  <SelectItem value="political">Political</SelectItem>
                  <SelectItem value="military">Military</SelectItem>
                  <SelectItem value="economic">Economic</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="technological">Technological</SelectItem>
                  <SelectItem value="diplomatic">Diplomatic</SelectItem>
                  <SelectItem value="religious">Religious</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-40 bg-cosmic-medium border-cosmic-light">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="empire_rise">Empire Rise</SelectItem>
                <SelectItem value="empire_fall">Empire Fall</SelectItem>
                <SelectItem value="war">Wars</SelectItem>
                <SelectItem value="trade_route">Trade Routes</SelectItem>
                <SelectItem value="disaster">Disasters</SelectItem>
                <SelectItem value="revolution">Revolutions</SelectItem>
                <SelectItem value="diplomacy">Diplomacy</SelectItem>
                <SelectItem value="discovery">Discoveries</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as any)}
            >
              <TabsList className="bg-cosmic-medium">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="threads">Threads</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="impact">Impact</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Stats */}
            <div className="ml-auto flex items-center gap-4 text-sm text-glyph-accent">
              <span>{filteredEvents.length} events</span>
              <span>
                {narrativeThreads.filter((t) => t.isActive).length} active
                threads
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex gap-6">
        {/* Primary View */}
        <Card
          className={`glass-panel border-cosmic-light ${selectedEvent || selectedThread ? "flex-1" : "w-full"}`}
        >
          <CardHeader>
            <CardTitle className="text-glyph-bright">
              {viewMode === "timeline" && "Historical Timeline"}
              {viewMode === "threads" && "Narrative Threads"}
              {viewMode === "events" && "Event Catalog"}
              {viewMode === "impact" && "Impact Analysis"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {viewMode === "timeline" && (
              <div className="space-y-4">
                {/* Timeline Controls */}
                <div className="flex items-center gap-4 mb-6">
                  <Label className="text-sm text-glyph-accent">
                    Timeline Range:
                  </Label>
                  <Input
                    type="number"
                    value={timelineRange.start}
                    onChange={(e) =>
                      setTimelineRange({
                        ...timelineRange,
                        start: parseInt(e.target.value),
                      })
                    }
                    className="w-20 bg-cosmic-medium border-cosmic-light"
                  />
                  <span className="text-glyph-accent">to</span>
                  <Input
                    type="number"
                    value={timelineRange.end}
                    onChange={(e) =>
                      setTimelineRange({
                        ...timelineRange,
                        end: parseInt(e.target.value),
                      })
                    }
                    className="w-20 bg-cosmic-medium border-cosmic-light"
                  />
                </div>

                {/* Timeline Events */}
                <div className="space-y-4 max-h-96 overflow-y-auto cosmic-scrollbar">
                  {timelineEvents.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${impactColors[event.impact].replace("text-", "bg-")}`}
                        >
                          {eventTypeIcons[event.type]}
                        </div>
                        {index < timelineEvents.length - 1 && (
                          <div className="w-px h-16 bg-cosmic-light mt-2"></div>
                        )}
                      </div>
                      <div
                        className={`
                          flex-1 p-4 rounded-lg border cursor-pointer transition-all
                          ${selectedEvent?.id === event.id ? "border-flame-blue bg-flame-blue/5" : "border-cosmic-light bg-cosmic-medium hover:border-flame-blue/30"}
                        `}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-flame-blue">
                                Year {event.startYear}
                                {event.endYear && ` - ${event.endYear}`}
                              </span>
                              {eventTypeIcons[event.type]}
                              <Badge
                                variant="outline"
                                className={importanceColors[event.importance]}
                              >
                                {event.importance}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-glyph-bright mb-1">
                              {event.title}
                            </h3>
                            <p className="text-sm text-glyph-accent line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                          <div
                            className={`text-xs ${impactColors[event.impact]}`}
                          >
                            {event.impact} impact
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-glyph-accent">
                          <span>
                            {event.participants.slice(0, 2).join(", ")}
                            {event.participants.length > 2 && "..."}
                          </span>
                          <span>•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === "threads" && (
              <div className="space-y-4 max-h-96 overflow-y-auto cosmic-scrollbar">
                {narrativeThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className="border border-cosmic-light rounded-lg bg-cosmic-medium"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-cosmic-light/10 transition-colors"
                      onClick={() => {
                        toggleThreadExpansion(thread.id);
                        setSelectedThread(thread);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {expandedThreads.has(thread.id) ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                          <div
                            className={`w-3 h-3 rounded-full bg-${thread.color}-400`}
                          ></div>
                          <div>
                            <h3 className="font-medium text-glyph-bright">
                              {thread.name}
                            </h3>
                            <p className="text-sm text-glyph-accent">
                              {thread.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {thread.isActive && (
                            <Badge
                              variant="outline"
                              className="text-green-400 border-green-400/30"
                            >
                              Active
                            </Badge>
                          )}
                          <span className="text-xs text-glyph-accent">
                            {thread.startYear}
                            {thread.endYear && ` - ${thread.endYear}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {expandedThreads.has(thread.id) && (
                      <div className="px-4 pb-4 border-t border-cosmic-light">
                        <div className="space-y-2 mt-3">
                          {getThreadEvents(thread).map((event) => (
                            <div
                              key={event.id}
                              className="p-3 rounded border border-cosmic-light bg-cosmic-deep cursor-pointer hover:border-flame-blue/30 transition-colors"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {eventTypeIcons[event.type]}
                                  <span className="text-sm font-medium text-glyph-bright">
                                    {event.title}
                                  </span>
                                </div>
                                <span className="text-xs text-glyph-accent">
                                  Year {event.startYear}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {viewMode === "events" && (
              <div className="space-y-3 max-h-96 overflow-y-auto cosmic-scrollbar">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedEvent?.id === event.id ? "border-flame-blue bg-flame-blue/5" : "border-cosmic-light bg-cosmic-medium hover:border-flame-blue/30"}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {eventTypeIcons[event.type]}
                          <h3 className="font-medium text-glyph-bright">
                            {event.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={importanceColors[event.importance]}
                          >
                            {event.importance}
                          </Badge>
                          <span
                            className={`text-xs ${impactColors[event.impact]}`}
                          >
                            {event.impact}
                          </span>
                        </div>
                        <p className="text-sm text-glyph-accent mb-2 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-glyph-accent">
                          <span>
                            {event.startYear}
                            {event.endYear && ` - ${event.endYear}`}
                          </span>
                          <span>{event.location}</span>
                          <span>{event.participants.length} participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === "impact" && (
              <div className="space-y-6">
                {/* Impact Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-cosmic-medium border-cosmic-light">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {impactStats.local}
                        </div>
                        <div className="text-xs text-glyph-accent">
                          Local Impact
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-cosmic-medium border-cosmic-light">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {impactStats.regional}
                        </div>
                        <div className="text-xs text-glyph-accent">
                          Regional Impact
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-cosmic-medium border-cosmic-light">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {impactStats.global}
                        </div>
                        <div className="text-xs text-glyph-accent">
                          Global Impact
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-cosmic-medium border-cosmic-light">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {impactStats.cosmic}
                        </div>
                        <div className="text-xs text-glyph-accent">
                          Cosmic Impact
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* High Impact Events */}
                <div>
                  <h3 className="text-lg font-semibold text-glyph-bright mb-4">
                    High Impact Events
                  </h3>
                  <div className="space-y-3">
                    {filteredEvents
                      .filter(
                        (event) =>
                          event.importance === "legendary" ||
                          event.importance === "major",
                      )
                      .slice(0, 5)
                      .map((event) => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className="p-3 rounded-lg border border-cosmic-light bg-cosmic-medium cursor-pointer hover:border-flame-blue/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {eventTypeIcons[event.type]}
                              <span className="font-medium text-glyph-bright">
                                {event.title}
                              </span>
                              <Badge
                                variant="outline"
                                className={importanceColors[event.importance]}
                              >
                                {event.importance}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs ${impactColors[event.impact]}`}
                              >
                                {event.impact}
                              </span>
                              <span className="text-xs text-glyph-accent">
                                Year {event.startYear}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event/Thread Details Panel */}
        {(selectedEvent || selectedThread) && (
          <Card className="w-80 glass-panel border-cosmic-light">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {selectedEvent && eventTypeIcons[selectedEvent.type]}
                  {selectedThread && <FaBook className="h-4 w-4" />}
                  <CardTitle className="text-glyph-bright">
                    {selectedEvent?.title || selectedThread?.name}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEvent(null);
                    setSelectedThread(null);
                  }}
                  className="text-glyph-accent hover:text-glyph-bright"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedEvent && (
                <>
                  <div>
                    <p className="text-sm text-glyph-accent mb-2">
                      {selectedEvent.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-glyph-secondary">
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {selectedEvent.duration || "Unknown"}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>{" "}
                        {selectedEvent.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={importanceColors[selectedEvent.importance]}
                    >
                      {selectedEvent.importance}
                    </Badge>
                    <span
                      className={`text-xs ${impactColors[selectedEvent.impact]}`}
                    >
                      {selectedEvent.impact} impact
                    </span>
                  </div>

                  {selectedEvent.participants.length > 0 && (
                    <div>
                      <Label className="text-xs text-glyph-accent">
                        Participants
                      </Label>
                      <div className="space-y-1 mt-1">
                        {selectedEvent.participants.map((participant, idx) => (
                          <div key={idx} className="text-sm text-glyph-bright">
                            • {participant}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEvent.consequences.length > 0 && (
                    <div>
                      <Label className="text-xs text-glyph-accent">
                        Consequences
                      </Label>
                      <div className="space-y-1 mt-1">
                        {selectedEvent.consequences.map((consequence, idx) => (
                          <div key={idx} className="text-sm text-glyph-accent">
                            • {consequence}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedThread && (
                <>
                  <div>
                    <p className="text-sm text-glyph-accent mb-2">
                      {selectedThread.description}
                    </p>
                    <div className="text-xs text-glyph-secondary">
                      <div>
                        <span className="font-medium">Theme:</span>{" "}
                        {selectedThread.theme}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {selectedThread.startYear}
                        {selectedThread.endYear &&
                          ` - ${selectedThread.endYear}`}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-glyph-accent">
                      Events in Thread
                    </Label>
                    <div className="space-y-2 mt-1">
                      {getThreadEvents(selectedThread).map((event) => (
                        <div
                          key={event.id}
                          className="p-2 rounded border border-cosmic-light bg-cosmic-deep cursor-pointer hover:border-flame-blue/30 transition-colors"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {eventTypeIcons[event.type]}
                              <span className="text-sm font-medium text-glyph-bright">
                                {event.title}
                              </span>
                            </div>
                            <span className="text-xs text-glyph-accent">
                              Year {event.startYear}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
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
