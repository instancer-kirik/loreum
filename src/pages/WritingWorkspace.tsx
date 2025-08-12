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
} from "react-icons/fa";

interface WritingProject {
  id: string;
  title: string;
  description: string;
  genre: string;
  target_word_count: number;
  current_word_count: number;
  status:
    | "planning"
    | "drafting"
    | "revising"
    | "editing"
    | "complete"
    | "published"
    | "abandoned";
  timeline_id?: string;
  primary_world_id?: string;
  tags: string[];
  notes: any;
  outline: any;
  created_at: string;
  updated_at: string;
}

interface Chapter {
  id: string;
  title: string;
  project_id: string;
  chapter_number: number;
  content: string;
  word_count: number;
  summary?: string;
  pov_character_id?: string;
  setting_location_id?: string;
  time_period?: string;
  status:
    | "planned"
    | "outlined"
    | "drafting"
    | "first_draft"
    | "revising"
    | "complete";
  target_word_count: number;
  notes: any;
  outline?: string;
  featured_characters: string[];
  referenced_locations: string[];
  referenced_events: string[];
  created_at: string;
  updated_at: string;
}

interface WritingSession {
  id?: string;
  project_id: string;
  chapter_id?: string;
  session_start: string;
  session_end?: string;
  words_written: number;
  activity_type: "writing" | "editing" | "planning" | "research" | "outlining";
  session_notes?: string;
  mood_rating?: number;
  productivity_rating?: number;
}

const statusColors = {
  planning: "bg-gray-500",
  drafting: "bg-blue-500",
  revising: "bg-yellow-500",
  editing: "bg-orange-500",
  complete: "bg-green-500",
  published: "bg-purple-500",
  abandoned: "bg-red-500",
};

const statusLabels = {
  planning: "Planning",
  drafting: "Drafting",
  revising: "Revising",
  editing: "Editing",
  complete: "Complete",
  published: "Published",
  abandoned: "Abandoned",
};

export const WritingWorkspace: React.FC = () => {
  const { navigationContext } = useAppContext();
  const [projects, setProjects] = useState<WritingProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<WritingProject | null>(
    null,
  );
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [currentSession, setCurrentSession] = useState<WritingSession | null>(
    null,
  );
  const [wordCountAtSessionStart, setWordCountAtSessionStart] = useState(0);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"write" | "outline" | "overview">(
    "write",
  );
  const [showWorldbuilding, setShowWorldbuilding] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const sessionIntervalRef = useRef<NodeJS.Timeout>();

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load chapters when project changes
  useEffect(() => {
    if (selectedProject) {
      loadChapters(selectedProject.id);
    }
  }, [selectedProject]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && selectedChapter && selectedChapter.content) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveChapter(selectedChapter);
      }, 2000); // Auto-save after 2 seconds of no typing
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [selectedChapter?.content, autoSaveEnabled]);

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

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("loreum_writing_projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);

      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const loadChapters = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from("loreum_chapters")
        .select("*")
        .eq("project_id", projectId)
        .order("chapter_number", { ascending: true });

      if (error) throw error;
      setChapters(data || []);

      if (data && data.length > 0 && !selectedChapter) {
        setSelectedChapter(data[0]);
      }
    } catch (error) {
      console.error("Error loading chapters:", error);
    }
  };

  const saveChapter = async (chapter: Chapter) => {
    try {
      const { error } = await supabase
        .from("loreum_chapters")
        .update({
          content: chapter.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", chapter.id);

      if (error) throw error;
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving chapter:", error);
    }
  };

  const startWritingSession = async () => {
    if (!selectedProject || !selectedChapter) return;

    const session: WritingSession = {
      project_id: selectedProject.id,
      chapter_id: selectedChapter.id,
      session_start: new Date().toISOString(),
      words_written: 0,
      activity_type: "writing",
    };

    try {
      const { data, error } = await supabase
        .from("loreum_writing_sessions")
        .insert(session)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      setWordCountAtSessionStart(selectedChapter.word_count);
      setIsWriting(true);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const endWritingSession = async () => {
    if (!currentSession || !selectedChapter) return;

    const wordsWritten = selectedChapter.word_count - wordCountAtSessionStart;

    try {
      const { error } = await supabase
        .from("loreum_writing_sessions")
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
    if (!currentSession || !selectedChapter) return;

    const wordsWritten = selectedChapter.word_count - wordCountAtSessionStart;

    try {
      await supabase
        .from("loreum_writing_sessions")
        .update({
          words_written: Math.max(0, wordsWritten),
        })
        .eq("id", currentSession.id);
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedChapter) {
      const updatedChapter = { ...selectedChapter, content };
      setSelectedChapter(updatedChapter);
    }
  };

  const createNewChapter = async () => {
    if (!selectedProject) return;

    const nextChapterNumber =
      Math.max(...chapters.map((c) => c.chapter_number), 0) + 1;
    const newChapter = {
      title: `Chapter ${nextChapterNumber}`,
      project_id: selectedProject.id,
      chapter_number: nextChapterNumber,
      content: "",
      word_count: 0,
      status: "planned" as const,
      target_word_count: 3000,
      notes: {},
      featured_characters: [],
      referenced_locations: [],
      referenced_events: [],
    };

    try {
      const { data, error } = await supabase
        .from("loreum_chapters")
        .insert(newChapter)
        .select()
        .single();

      if (error) throw error;

      setChapters([...chapters, data]);
      setSelectedChapter(data);
    } catch (error) {
      console.error("Error creating chapter:", error);
    }
  };

  const getProgressPercentage = () => {
    if (!selectedProject || selectedProject.target_word_count === 0) return 0;
    return (
      (selectedProject.current_word_count / selectedProject.target_word_count) *
      100
    );
  };

  const getChapterProgressPercentage = () => {
    if (!selectedChapter || selectedChapter.target_word_count === 0) return 0;
    return (
      (selectedChapter.word_count / selectedChapter.target_word_count) * 100
    );
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FaBook className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Writing Projects
          </h2>
          <p className="text-gray-500">
            Create your first writing project to get started.
          </p>
          <button className="mt-4 bg-flame-blue text-white px-4 py-2 rounded-lg hover:bg-flame-blue-dark flex items-center gap-2 mx-auto">
            <FaPlus /> Create Project
          </button>
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
            Writing Workspace
          </h1>

          {/* Project Selector */}
          <select
            value={selectedProject.id}
            onChange={(e) => {
              const project = projects.find((p) => p.id === e.target.value);
              setSelectedProject(project || null);
            }}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
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
              disabled={!selectedChapter}
            >
              <FaPlayCircle /> Start Writing
            </button>
          )}

          {/* View Mode Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["write", "outline", "overview"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded ${viewMode === mode ? "bg-white shadow" : "hover:bg-gray-200"}`}
              >
                {mode === "write" && <FaPen className="h-4 w-4" />}
                {mode === "outline" && <FaListOl className="h-4 w-4" />}
                {mode === "overview" && <FaChartBar className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-gray-50">
          {/* Project Progress */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{selectedProject.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs text-white ${statusColors[selectedProject.status]}`}
              >
                {statusLabels[selectedProject.status]}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {selectedProject.current_word_count.toLocaleString()} /{" "}
              {selectedProject.target_word_count.toLocaleString()} words
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-flame-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, getProgressPercentage())}%` }}
              />
            </div>
          </div>

          {/* Chapter List */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">Chapters</h4>
              <button
                onClick={createNewChapter}
                className="text-flame-blue hover:text-flame-blue-dark"
              >
                <FaPlus />
              </button>
            </div>

            <div className="space-y-2">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChapter?.id === chapter.id
                      ? "bg-flame-blue text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{chapter.title}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedChapter?.id === chapter.id
                          ? "bg-white text-flame-blue"
                          : `text-white ${statusColors[chapter.status]}`
                      }`}
                    >
                      {statusLabels[chapter.status]}
                    </span>
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {chapter.word_count.toLocaleString()} words
                  </div>
                  {chapter.summary && (
                    <div className="text-xs opacity-75 mt-1 line-clamp-2">
                      {chapter.summary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {viewMode === "write" && selectedChapter && (
            <>
              {/* Chapter Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">
                    {selectedChapter.title}
                  </h2>
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
                        Writing Session Active
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {selectedChapter.word_count.toLocaleString()} words
                  </span>
                  <span>
                    Target: {selectedChapter.target_word_count.toLocaleString()}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-green-500 h-1 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, getChapterProgressPercentage())}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Writing Editor */}
              <div className="flex-1 p-4">
                <textarea
                  ref={editorRef}
                  value={selectedChapter.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Start writing your chapter here..."
                  className="w-full h-full resize-none border border-gray-200 rounded-lg p-4 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-flame-blue focus:border-transparent font-serif"
                  style={{ minHeight: "500px" }}
                />
              </div>
            </>
          )}

          {viewMode === "outline" && selectedChapter && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Chapter Outline</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <textarea
                  value={selectedChapter.outline || ""}
                  onChange={(e) =>
                    setSelectedChapter({
                      ...selectedChapter,
                      outline: e.target.value,
                    })
                  }
                  placeholder="Outline your chapter structure, key scenes, and plot points..."
                  className="w-full h-64 resize-none border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-flame-blue focus:border-transparent"
                />
              </div>
            </div>
          )}

          {viewMode === "overview" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Progress Stats */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FaChartBar className="h-4 w-4 text-flame-blue" />
                    Progress
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Words:</span>
                      <span className="font-medium">
                        {selectedProject.current_word_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target:</span>
                      <span className="font-medium">
                        {selectedProject.target_word_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion:</span>
                      <span className="font-medium">
                        {getProgressPercentage().toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chapter Stats */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FaBookOpen className="h-4 w-4 text-flame-blue" />
                    Chapters
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{chapters.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complete:</span>
                      <span className="font-medium">
                        {chapters.filter((c) => c.status === "complete").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>In Progress:</span>
                      <span className="font-medium">
                        {
                          chapters.filter((c) =>
                            ["drafting", "revising"].includes(c.status),
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Writing Session */}
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
                            (selectedChapter?.word_count || 0) -
                              wordCountAtSessionStart,
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No active session</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
