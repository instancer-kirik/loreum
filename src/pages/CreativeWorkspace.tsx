import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAppContext } from "../context/AppContext";
import {
  FaPen,
  FaBook,
  FaPlus,
  FaSave,
  FaEdit,
  FaEye,
  FaClock,
  FaChartBar,
  FaUsers,
  FaMapMarkerAlt,
  FaBookOpen,
  FaPlayCircle,
  FaPauseCircle,
  FaStopCircle,
  FaFileAlt,
  FaListOl,
  FaBullseye,
  FaLightbulb,
  FaMusic,
  FaGamepad,
  FaImage,
  FaTheaterMasks,
  FaQuoteLeft,
  FaLayerGroup,
  FaFolderOpen,
  FaSearch,
  FaTags,
  FaCalendarAlt,
  FaHashtag,
} from "react-icons/fa";

interface CreativeWork {
  id: string;
  title: string;
  description?: string;
  content: string;
  creative_type:
    | "novel"
    | "short_story"
    | "novella"
    | "poem"
    | "song"
    | "lyrics"
    | "game_script"
    | "dialogue"
    | "manga"
    | "comic"
    | "screenplay"
    | "chapter"
    | "scene"
    | "verse"
    | "stanza"
    | "panel";
  content_format:
    | "prose"
    | "verse"
    | "free_verse"
    | "dialogue"
    | "script"
    | "lyrics"
    | "panels"
    | "mixed";
  parent_work_id?: string;
  sequence_number: number;
  status:
    | "planning"
    | "outlining"
    | "drafting"
    | "first_draft"
    | "revising"
    | "editing"
    | "complete"
    | "published"
    | "abandoned";
  word_count: number;
  target_word_count: number;
  timeline_id?: string;
  world_id?: string;
  primary_location_id?: string;
  pov_character_id?: string;
  featured_characters: string[];
  referenced_locations: string[];
  referenced_events: string[];
  referenced_cultures: string[];
  genre?: string;
  mood?: string;
  themes: string[];
  tone?: string;
  style_notes?: string;
  outline?: string;
  summary?: string;
  notes: any;
  is_public: boolean;
  external_links: any;
  tags: string[];
  collection?: string;
  created_at: string;
  updated_at: string;
}

interface CreativeSession {
  id?: string;
  work_id: string;
  session_start: string;
  session_end?: string;
  words_written: number;
  words_edited: number;
  activity_type:
    | "writing"
    | "editing"
    | "revising"
    | "outlining"
    | "research"
    | "brainstorming"
    | "worldbuilding_research"
    | "character_development";
  productivity_rating?: number;
  mood_rating?: number;
  flow_state_rating?: number;
  session_notes?: string;
  breakthrough_moments?: string;
  starting_word_count: number;
}

interface Character {
  id: string;
  name: string;
  description: string;
  species: string;
}

interface Location {
  id: string;
  name: string;
  description: string;
  world_id: string;
}

interface LoreNode {
  id: string;
  name: string;
  description: string;
  type: string;
  year?: number;
}

const creativeTypeIcons = {
  novel: FaBook,
  short_story: FaBookOpen,
  novella: FaBook,
  poem: FaQuoteLeft,
  song: FaMusic,
  lyrics: FaMusic,
  game_script: FaGamepad,
  dialogue: FaTheaterMasks,
  manga: FaImage,
  comic: FaImage,
  screenplay: FaTheaterMasks,
  chapter: FaFileAlt,
  scene: FaLayerGroup,
  verse: FaQuoteLeft,
  stanza: FaQuoteLeft,
  panel: FaImage,
};

const statusColors = {
  planning: "bg-gray-500",
  outlining: "bg-blue-500",
  drafting: "bg-yellow-500",
  first_draft: "bg-orange-500",
  revising: "bg-purple-500",
  editing: "bg-indigo-500",
  complete: "bg-green-500",
  published: "bg-emerald-600",
  abandoned: "bg-red-500",
};

const statusLabels = {
  planning: "Planning",
  outlining: "Outlining",
  drafting: "Drafting",
  first_draft: "First Draft",
  revising: "Revising",
  editing: "Editing",
  complete: "Complete",
  published: "Published",
  abandoned: "Abandoned",
};

export const CreativeWorkspace: React.FC = () => {
  const { navigationContext } = useAppContext();
  const [works, setWorks] = useState<CreativeWork[]>([]);
  const [selectedWork, setSelectedWork] = useState<CreativeWork | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [currentSession, setCurrentSession] = useState<CreativeSession | null>(
    null,
  );
  const [wordCountAtSessionStart, setWordCountAtSessionStart] = useState(0);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<
    "write" | "outline" | "overview" | "structure"
  >("write");
  const [showWorldbuilding, setShowWorldbuilding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Worldbuilding data
  const [characters, setCharacters] = useState<Character[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loreNodes, setLoreNodes] = useState<LoreNode[]>([]);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const sessionIntervalRef = useRef<NodeJS.Timeout>();

  // Load works on mount
  useEffect(() => {
    loadWorks();
    loadWorldbuildingData();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && selectedWork && selectedWork.content) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveWork(selectedWork);
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [selectedWork?.content, autoSaveEnabled]);

  // Session tracking
  useEffect(() => {
    if (isWriting && currentSession) {
      sessionIntervalRef.current = setInterval(() => {
        updateCurrentSession();
      }, 60000); // Update session every minute
    }

    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, [isWriting, currentSession]);

  const loadWorks = async () => {
    try {
      const { data, error } = await supabase
        .from("loreum_creative_works")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setWorks(data || []);

      if (data && data.length > 0 && !selectedWork) {
        setSelectedWork(data[0]);
      }
    } catch (error) {
      console.error("Error loading works:", error);
    }
  };

  const loadWorldbuildingData = async () => {
    try {
      // Load characters
      const { data: charactersData, error: charactersError } = await supabase
        .from("loreum_characters")
        .select("id, name, description, species")
        .limit(50);

      if (!charactersError) {
        setCharacters(charactersData || []);
      }

      // Load locations
      const { data: locationsData, error: locationsError } = await supabase
        .from("loreum_regions")
        .select("id, name, description, world_id")
        .limit(50);

      if (!locationsError) {
        setLocations(locationsData || []);
      }

      // Load lore nodes
      const { data: loreData, error: loreError } = await supabase
        .from("loreum_lore_nodes")
        .select("id, name, description, type, year")
        .limit(50);

      if (!loreError) {
        setLoreNodes(loreData || []);
      }
    } catch (error) {
      console.error("Error loading worldbuilding data:", error);
    }
  };

  const saveWork = async (work: CreativeWork) => {
    try {
      const { error } = await supabase
        .from("loreum_creative_works")
        .update({
          content: work.content,
          outline: work.outline,
          summary: work.summary,
          notes: work.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", work.id);

      if (error) throw error;
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving work:", error);
    }
  };

  const startWritingSession = async () => {
    if (!selectedWork) return;

    const session: CreativeSession = {
      work_id: selectedWork.id,
      session_start: new Date().toISOString(),
      words_written: 0,
      words_edited: 0,
      activity_type: "writing",
      starting_word_count: selectedWork.word_count,
    };

    try {
      const { data, error } = await supabase
        .from("loreum_creative_sessions")
        .insert(session)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      setWordCountAtSessionStart(selectedWork.word_count);
      setIsWriting(true);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const endWritingSession = async () => {
    if (!currentSession || !selectedWork) return;

    const wordsWritten = selectedWork.word_count - wordCountAtSessionStart;

    try {
      const { error } = await supabase
        .from("loreum_creative_sessions")
        .update({
          session_end: new Date().toISOString(),
          words_written: Math.max(0, wordsWritten),
        })
        .eq("id", currentSession.id);

      if (error) throw error;

      setCurrentSession(null);
      setIsWriting(false);
      setWordCountAtSessionStart(0);
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const updateCurrentSession = async () => {
    if (!currentSession || !selectedWork) return;

    const wordsWritten = selectedWork.word_count - wordCountAtSessionStart;

    try {
      await supabase
        .from("loreum_creative_sessions")
        .update({
          words_written: Math.max(0, wordsWritten),
        })
        .eq("id", currentSession.id);
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedWork) {
      const updatedWork = { ...selectedWork, content };
      setSelectedWork(updatedWork);
    }
  };

  const handleOutlineChange = (outline: string) => {
    if (selectedWork) {
      const updatedWork = { ...selectedWork, outline };
      setSelectedWork(updatedWork);
    }
  };

  const createNewWork = async (type: string) => {
    const newWork = {
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: "",
      content: "",
      creative_type: type,
      content_format: getDefaultFormat(type),
      sequence_number: 1,
      status: "planning" as const,
      word_count: 0,
      target_word_count: getDefaultTargetWordCount(type),
      featured_characters: [],
      referenced_locations: [],
      referenced_events: [],
      referenced_cultures: [],
      themes: [],
      notes: {},
      is_public: false,
      external_links: {},
      tags: [],
    };

    try {
      const { data, error } = await supabase
        .from("loreum_creative_works")
        .insert(newWork)
        .select()
        .single();

      if (error) throw error;

      setWorks([data, ...works]);
      setSelectedWork(data);
    } catch (error) {
      console.error("Error creating work:", error);
    }
  };

  const createChildWork = async (parentId: string, type: string) => {
    const parent = works.find((w) => w.id === parentId);
    if (!parent) return;

    const siblings = works.filter((w) => w.parent_work_id === parentId);
    const nextSequence =
      Math.max(...siblings.map((s) => s.sequence_number), 0) + 1;

    const newWork = {
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nextSequence}`,
      description: "",
      content: "",
      creative_type: type,
      content_format: getDefaultFormat(type),
      parent_work_id: parentId,
      sequence_number: nextSequence,
      status: "planning" as const,
      word_count: 0,
      target_word_count: getDefaultTargetWordCount(type),
      timeline_id: parent.timeline_id,
      world_id: parent.world_id,
      featured_characters: [],
      referenced_locations: [],
      referenced_events: [],
      referenced_cultures: [],
      themes: [],
      notes: {},
      is_public: false,
      external_links: {},
      tags: [],
    };

    try {
      const { data, error } = await supabase
        .from("loreum_creative_works")
        .insert(newWork)
        .select()
        .single();

      if (error) throw error;

      setWorks([...works, data]);
      setSelectedWork(data);
    } catch (error) {
      console.error("Error creating child work:", error);
    }
  };

  const getDefaultFormat = (type: string): string => {
    const formatMap: { [key: string]: string } = {
      novel: "prose",
      short_story: "prose",
      novella: "prose",
      poem: "verse",
      song: "lyrics",
      lyrics: "lyrics",
      game_script: "script",
      dialogue: "dialogue",
      manga: "panels",
      comic: "panels",
      screenplay: "script",
      chapter: "prose",
      scene: "prose",
      verse: "verse",
      stanza: "verse",
      panel: "panels",
    };
    return formatMap[type] || "prose";
  };

  const getDefaultTargetWordCount = (type: string): number => {
    const countMap: { [key: string]: number } = {
      novel: 80000,
      short_story: 5000,
      novella: 25000,
      poem: 100,
      song: 200,
      lyrics: 200,
      game_script: 15000,
      dialogue: 1000,
      manga: 500,
      comic: 500,
      screenplay: 20000,
      chapter: 3000,
      scene: 1000,
      verse: 50,
      stanza: 50,
      panel: 50,
    };
    return countMap[type] || 1000;
  };

  const getProgressPercentage = () => {
    if (!selectedWork || selectedWork.target_word_count === 0) return 0;
    return (selectedWork.word_count / selectedWork.target_word_count) * 100;
  };

  const filteredWorks = works.filter((work) => {
    const matchesSearch =
      work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" || work.creative_type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || work.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const rootWorks = filteredWorks.filter((w) => !w.parent_work_id);
  const getChildWorks = (parentId: string) =>
    filteredWorks.filter((w) => w.parent_work_id === parentId);

  const getPlaceholderText = () => {
    if (!selectedWork) return "";

    const placeholders: { [key: string]: string } = {
      novel: "Begin your novel here...",
      short_story: "Start your short story...",
      poem: "Let your verse flow...",
      song: "Write your lyrics here...",
      game_script: "Scene 1: Setting the stage...",
      manga: "Panel 1: Wide shot of...",
      chapter: "The chapter begins...",
      scene: "In this scene...",
    };

    return placeholders[selectedWork.creative_type] || "Start creating...";
  };

  if (works.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FaPen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Welcome to Your Creative Workspace
          </h2>
          <p className="text-gray-500 mb-6">
            Create your first piece - novel, poem, song, game script, or
            anything!
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {["novel", "poem", "song", "game_script", "manga"].map((type) => {
              const Icon =
                creativeTypeIcons[type as keyof typeof creativeTypeIcons];
              return (
                <button
                  key={type}
                  onClick={() => createNewWork(type)}
                  className="bg-flame-blue text-white px-4 py-2 rounded-lg hover:bg-flame-blue-dark flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-serif text-glyph-bright flex items-center gap-3">
            <FaPen className="h-6 w-6 text-flame-blue" />
            Creative Workspace
          </h1>

          {/* Search and Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-flame-blue"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flame-blue"
            >
              <option value="all">All Types</option>
              {Object.keys(creativeTypeIcons).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flame-blue"
            >
              <option value="all">All Status</option>
              {Object.keys(statusLabels).map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status as keyof typeof statusLabels]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Session Controls */}
          {isWriting ? (
            <button
              onClick={endWritingSession}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              <FaStopCircle /> End Session
            </button>
          ) : (
            <button
              onClick={startWritingSession}
              className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
              disabled={!selectedWork}
            >
              <FaPlayCircle /> Start Creating
            </button>
          )}

          {/* View Mode Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { mode: "write", icon: FaPen, label: "Write" },
              { mode: "outline", icon: FaListOl, label: "Outline" },
              { mode: "structure", icon: FaLayerGroup, label: "Structure" },
              { mode: "overview", icon: FaChartBar, label: "Overview" },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded flex items-center gap-1 text-sm ${
                  viewMode === mode ? "bg-white shadow" : "hover:bg-gray-200"
                }`}
                title={label}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Worldbuilding Toggle */}
          <button
            onClick={() => setShowWorldbuilding(!showWorldbuilding)}
            className={`p-2 rounded-lg ${showWorldbuilding ? "bg-flame-blue text-white" : "bg-gray-200 text-gray-600"}`}
            title="Toggle Worldbuilding References"
          >
            <FaFolderOpen className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
          {/* Work Progress */}
          {selectedWork && (
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold truncate flex items-center gap-2">
                  {React.createElement(
                    creativeTypeIcons[selectedWork.creative_type],
                    { className: "h-4 w-4" },
                  )}
                  {selectedWork.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs text-white ${statusColors[selectedWork.status]}`}
                >
                  {statusLabels[selectedWork.status]}
                </span>
              </div>
              {selectedWork.target_word_count > 0 && (
                <>
                  <div className="text-sm text-gray-600 mb-2">
                    {selectedWork.word_count.toLocaleString()} /{" "}
                    {selectedWork.target_word_count.toLocaleString()} words
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-flame-blue h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, getProgressPercentage())}%`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Works List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">Your Works</h4>
              <div className="dropdown relative">
                <button className="text-flame-blue hover:text-flame-blue-dark">
                  <FaPlus />
                </button>
                <div className="dropdown-content hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  {["novel", "poem", "song", "game_script", "manga"].map(
                    (type) => {
                      const Icon =
                        creativeTypeIcons[
                          type as keyof typeof creativeTypeIcons
                        ];
                      return (
                        <button
                          key={type}
                          onClick={() => createNewWork(type)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          New {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {rootWorks.map((work) => {
                const Icon = creativeTypeIcons[work.creative_type];
                const childWorks = getChildWorks(work.id);

                return (
                  <div key={work.id}>
                    <div
                      onClick={() => setSelectedWork(work)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedWork?.id === work.id
                          ? "bg-flame-blue text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-sm truncate">
                            {work.title}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            selectedWork?.id === work.id
                              ? "bg-white text-flame-blue"
                              : `text-white ${statusColors[work.status]}`
                          }`}
                        >
                          {statusLabels[work.status]}
                        </span>
                      </div>
                      {work.target_word_count > 0 && (
                        <div className="text-xs opacity-75 mt-1">
                          {work.word_count.toLocaleString()} words
                        </div>
                      )}
                      {work.description && (
                        <div className="text-xs opacity-75 mt-1 line-clamp-2">
                          {work.description}
                        </div>
                      )}
                    </div>

                    {/* Child works */}
                    {childWorks.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1">
                        {childWorks
                          .sort((a, b) => a.sequence_number - b.sequence_number)
                          .map((child) => {
                            const ChildIcon =
                              creativeTypeIcons[child.creative_type];
                            return (
                              <div
                                key={child.id}
                                onClick={() => setSelectedWork(child)}
                                className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                                  selectedWork?.id === child.id
                                    ? "bg-flame-blue text-white"
                                    : "bg-gray-50 hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <ChildIcon className="h-3 w-3" />
                                  <span className="truncate">
                                    {child.title}
                                  </span>
                                  <span className="text-xs opacity-75">
                                    {child.word_count}w
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                        {/* Add child button */}
                        <button
                          onClick={() => {
                            const childType =
                              work.creative_type === "novel"
                                ? "chapter"
                                : work.creative_type === "poem"
                                  ? "verse"
                                  : work.creative_type === "manga"
                                    ? "panel"
                                    : "scene";
                            createChildWork(work.id, childType);
                          }}
                          className="w-full p-2 text-xs text-gray-500 hover:text-flame-blue border-2 border-dashed border-gray-200 hover:border-flame-blue rounded transition-colors"
                        >
                          <FaPlus className="h-3 w-3 mx-auto mb-1" />
                          Add{" "}
                          {work.creative_type === "novel"
                            ? "Chapter"
                            : work.creative_type === "poem"
                              ? "Verse"
                              : work.creative_type === "manga"
                                ? "Panel"
                                : "Scene"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {!selectedWork ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FaLightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Select a work to start creating
                </h3>
                <p className="text-gray-500">
                  Choose from your works on the left, or create something new!
                </p>
              </div>
            </div>
          ) : (
            <>
              {viewMode === "write" && (
                <>
                  {/* Work Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {React.createElement(
                          creativeTypeIcons[selectedWork.creative_type],
                          { className: "h-5 w-5 text-flame-blue" },
                        )}
                        <h2 className="text-xl font-semibold">
                          {selectedWork.title}
                        </h2>
                        <span className="text-sm text-gray-500">
                          ({selectedWork.creative_type})
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {lastSaved && (
                          <span className="flex items-center gap-1">
                            <FaSave className="h-3 w-3" />
                            Saved {lastSaved.toLocaleTimeString()}
                          </span>
                        )}
                        {isWriting && (
                          <span className="flex items-center gap-1 text-green-600">
                            <FaClock className="h-3 w-3" />
                            Creating...
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedWork.target_word_count > 0 && (
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          {selectedWork.word_count.toLocaleString()} words
                        </span>
                        <span>
                          Target:{" "}
                          {selectedWork.target_word_count.toLocaleString()}
                        </span>
                        <div className="flex-1 max-w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, getProgressPercentage())}%`,
                            }}
                          />
                        </div>
                        <span>{getProgressPercentage().toFixed(1)}%</span>
                      </div>
                    )}
                  </div>

                  {/* Editor */}
                  <div className="flex-1 p-4">
                    <textarea
                      ref={editorRef}
                      value={selectedWork.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder={getPlaceholderText()}
                      className="w-full h-full resize-none border border-gray-200 rounded-lg p-4 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-flame-blue focus:border-transparent font-serif"
                      style={{ minHeight: "500px" }}
                    />
                  </div>
                </>
              )}

              {viewMode === "outline" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FaListOl className="h-5 w-5 text-flame-blue" />
                      Outline & Structure
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold mb-3">Outline</h3>
                      <textarea
                        value={selectedWork.outline || ""}
                        onChange={(e) => handleOutlineChange(e.target.value)}
                        placeholder="Plan your structure, key points, character arcs..."
                        className="w-full h-64 resize-none border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-flame-blue focus:border-transparent"
                      />
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold mb-3">Summary</h3>
                      <textarea
                        value={selectedWork.summary || ""}
                        onChange={(e) =>
                          setSelectedWork({
                            ...selectedWork,
                            summary: e.target.value,
                          })
                        }
                        placeholder="Brief summary of your work..."
                        className="w-full h-32 resize-none border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-flame-blue focus:border-transparent"
                      />

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Themes</h4>
                        <input
                          type="text"
                          placeholder="Enter themes separated by commas"
                          value={selectedWork.themes.join(", ")}
                          onChange={(e) =>
                            setSelectedWork({
                              ...selectedWork,
                              themes: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter((t) => t),
                            })
                          }
                          className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-flame-blue"
                        />
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Mood & Tone</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Mood"
                            value={selectedWork.mood || ""}
                            onChange={(e) =>
                              setSelectedWork({
                                ...selectedWork,
                                mood: e.target.value,
                              })
                            }
                            className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-flame-blue"
                          />
                          <input
                            type="text"
                            placeholder="Tone"
                            value={selectedWork.tone || ""}
                            onChange={(e) =>
                              setSelectedWork({
                                ...selectedWork,
                                tone: e.target.value,
                              })
                            }
                            className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-flame-blue"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewMode === "structure" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaLayerGroup className="h-5 w-5 text-flame-blue" />
                    Work Structure
                  </h2>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="space-y-3">
                      {rootWorks
                        .filter(
                          (w) =>
                            w.id === selectedWork.id ||
                            w.parent_work_id === selectedWork.id ||
                            selectedWork.parent_work_id === w.id,
                        )
                        .map((work) => {
                          const Icon = creativeTypeIcons[work.creative_type];
                          const children = getChildWorks(work.id);
                          const isSelected = work.id === selectedWork.id;
                          const isParent =
                            work.id === selectedWork.parent_work_id;
                          const isChild =
                            work.parent_work_id === selectedWork.id;

                          return (
                            <div
                              key={work.id}
                              className={`p-3 rounded-lg border-2 ${
                                isSelected
                                  ? "border-flame-blue bg-flame-blue bg-opacity-10"
                                  : isParent
                                    ? "border-green-300 bg-green-50"
                                    : isChild
                                      ? "border-blue-300 bg-blue-50"
                                      : "border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span className="font-medium">
                                    {work.title}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({work.word_count.toLocaleString()} words)
                                  </span>
                                </div>
                                <button
                                  onClick={() => setSelectedWork(work)}
                                  className="text-flame-blue hover:text-flame-blue-dark text-sm"
                                >
                                  {isSelected ? "Current" : "Select"}
                                </button>
                              </div>

                              {children.length > 0 && (
                                <div className="ml-6 mt-2 space-y-1">
                                  {children
                                    .sort(
                                      (a, b) =>
                                        a.sequence_number - b.sequence_number,
                                    )
                                    .map((child) => {
                                      const ChildIcon =
                                        creativeTypeIcons[child.creative_type];
                                      return (
                                        <div
                                          key={child.id}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                        >
                                          <div className="flex items-center gap-2">
                                            <ChildIcon className="h-3 w-3" />
                                            <span className="text-sm">
                                              {child.title}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              ({child.word_count}w)
                                            </span>
                                          </div>
                                          <button
                                            onClick={() =>
                                              setSelectedWork(child)
                                            }
                                            className="text-xs text-flame-blue hover:text-flame-blue-dark"
                                          >
                                            Select
                                          </button>
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {viewMode === "overview" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartBar className="h-5 w-5 text-flame-blue" />
                    Creative Overview
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Progress Stats */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FaChartBar className="h-4 w-4 text-flame-blue" />
                        Progress
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Word Count:</span>
                          <span className="font-medium">
                            {selectedWork.word_count.toLocaleString()}
                          </span>
                        </div>
                        {selectedWork.target_word_count > 0 && (
                          <>
                            <div className="flex justify-between">
                              <span>Target:</span>
                              <span className="font-medium">
                                {selectedWork.target_word_count.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Completion:</span>
                              <span className="font-medium">
                                {getProgressPercentage().toFixed(1)}%
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span
                            className={`font-medium px-2 py-1 rounded text-xs text-white ${statusColors[selectedWork.status]}`}
                          >
                            {statusLabels[selectedWork.status]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Type & Format */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        {React.createElement(
                          creativeTypeIcons[selectedWork.creative_type],
                          { className: "h-4 w-4 text-flame-blue" },
                        )}
                        Type & Format
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium capitalize">
                            {selectedWork.creative_type.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span className="font-medium capitalize">
                            {selectedWork.content_format.replace("_", " ")}
                          </span>
                        </div>
                        {selectedWork.genre && (
                          <div className="flex justify-between">
                            <span>Genre:</span>
                            <span className="font-medium">
                              {selectedWork.genre}
                            </span>
                          </div>
                        )}
                        {selectedWork.collection && (
                          <div className="flex justify-between">
                            <span>Collection:</span>
                            <span className="font-medium">
                              {selectedWork.collection}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Worldbuilding Connections */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FaFolderOpen className="h-4 w-4 text-flame-blue" />
                        Connections
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Characters:</span>
                          <span className="font-medium">
                            {selectedWork.featured_characters.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Locations:</span>
                          <span className="font-medium">
                            {selectedWork.referenced_locations.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Events:</span>
                          <span className="font-medium">
                            {selectedWork.referenced_events.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Themes:</span>
                          <span className="font-medium">
                            {selectedWork.themes.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Session Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FaClock className="h-4 w-4 text-flame-blue" />
                        Current Session
                      </h3>
                      {isWriting && currentSession ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Started:</span>
                            <span className="font-medium">
                              {new Date(
                                currentSession.session_start,
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Words Added:</span>
                            <span className="font-medium text-green-600">
                              +
                              {Math.max(
                                0,
                                selectedWork.word_count -
                                  wordCountAtSessionStart,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Activity:</span>
                            <span className="font-medium capitalize">
                              {currentSession.activity_type.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No active session
                        </p>
                      )}
                    </div>

                    {/* Creation Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="h-4 w-4 text-flame-blue" />
                        Timeline
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedWork.created_at,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Updated:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedWork.updated_at,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FaTags className="h-4 w-4 text-flame-blue" />
                        Tags
                      </h3>
                      {selectedWork.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedWork.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No tags</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Worldbuilding Sidebar */}
        {showWorldbuilding && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaFolderOpen className="h-4 w-4" />
                Worldbuilding References
              </h3>

              {/* Characters */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <FaUsers className="h-3 w-3" />
                  Characters ({characters.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {characters.slice(0, 10).map((character) => (
                    <div
                      key={character.id}
                      className="p-2 bg-white rounded text-sm"
                    >
                      <div className="font-medium">{character.name}</div>
                      <div className="text-xs text-gray-500">
                        {character.species}
                      </div>
                      <div className="text-xs text-gray-400 line-clamp-2">
                        {character.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="h-3 w-3" />
                  Locations ({locations.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {locations.slice(0, 10).map((location) => (
                    <div
                      key={location.id}
                      className="p-2 bg-white rounded text-sm"
                    >
                      <div className="font-medium">{location.name}</div>
                      <div className="text-xs text-gray-400 line-clamp-2">
                        {location.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lore Nodes */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <FaBookOpen className="h-3 w-3" />
                  Lore & Events ({loreNodes.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {loreNodes.slice(0, 10).map((node) => (
                    <div key={node.id} className="p-2 bg-white rounded text-sm">
                      <div className="font-medium">{node.name}</div>
                      <div className="text-xs text-gray-500">
                        {node.type} {node.year && `(${node.year})`}
                      </div>
                      <div className="text-xs text-gray-400 line-clamp-2">
                        {node.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dropdown:hover .dropdown-content {
          display: block;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
