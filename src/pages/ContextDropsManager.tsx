import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaComments,
  FaEye,
  FaEdit,
  FaTrash,
  FaTags,
  FaUsers,
  FaCalendarAlt,
  FaDownload,
  FaFileWord,
  FaHashtag,
  FaSpinner,
} from "react-icons/fa";
import { ContextDropModal } from "../components/ContextDropModal";
import { ChatViewer } from "../components/ChatViewer";
import {
  contextDropService,
  ContextDrop,
} from "../integrations/supabase/contextDrops";

export const ContextDropsManager: React.FC = () => {
  const [contextDrops, setContextDrops] = useState<ContextDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContext, setSelectedContext] = useState<string>("all");
  const [selectedContextDrop, setSelectedContextDrop] =
    useState<ContextDrop | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContextDrop, setEditingContextDrop] =
    useState<ContextDrop | null>(null);
  const [viewingContextDrop, setViewingContextDrop] =
    useState<ContextDrop | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    contexts: string[];
    recentCount: number;
    totalAnnotations: number;
  } | null>(null);

  useEffect(() => {
    loadContextDrops();
    loadStats();
  }, []);

  const loadContextDrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contextDropService.getAll();
      setContextDrops(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load context drops",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await contextDropService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadContextDrops();
      return;
    }

    try {
      setLoading(true);
      const results = await contextDropService.search(query);
      // Convert SearchResult to ContextDrop for display
      const fullResults = await Promise.all(
        results.map(async (result) => {
          const fullDrop = await contextDropService.getById(result.id);
          return fullDrop;
        }),
      );
      setContextDrops(fullResults.filter(Boolean) as ContextDrop[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleContextFilter = async (context: string) => {
    if (context === "all") {
      loadContextDrops();
      return;
    }

    try {
      setLoading(true);
      const data = await contextDropService.getByContext(context);
      setContextDrops(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to filter by context",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contextDrop: ContextDrop) => {
    if (!confirm(`Are you sure you want to delete "${contextDrop.name}"?`)) {
      return;
    }

    try {
      await contextDropService.delete(contextDrop.id);
      setContextDrops((prev) => prev.filter((cd) => cd.id !== contextDrop.id));
      loadStats();
    } catch (err) {
      alert(
        "Failed to delete context drop: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  const handleSaved = (contextDrop: ContextDrop) => {
    setContextDrops((prev) => {
      const existing = prev.find((cd) => cd.id === contextDrop.id);
      if (existing) {
        return prev.map((cd) => (cd.id === contextDrop.id ? contextDrop : cd));
      } else {
        return [contextDrop, ...prev];
      }
    });
    loadStats();
    setShowCreateModal(false);
    setEditingContextDrop(null);
  };

  const filteredContextDrops = contextDrops.filter((drop) => {
    const matchesContext =
      selectedContext === "all" ||
      drop.conversation_context === selectedContext;
    const matchesSearch =
      searchQuery === "" ||
      drop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drop.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drop.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesContext && matchesSearch;
  });

  const contextOptions = [
    { id: "all", name: "All Contexts", count: contextDrops.length },
    ...(stats?.contexts || []).map((context) => ({
      id: context,
      name: context,
      count: contextDrops.filter((cd) => cd.conversation_context === context)
        .length,
    })),
  ];

  return (
    <div className="h-full flex flex-col bg-cosmic-deepest">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-cosmic-light border-opacity-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FaComments className="text-circuit-magic mr-3" size={24} />
            <div>
              <h1 className="text-3xl font-bold text-glyph-bright font-serif">
                Context Drops
              </h1>
              <p className="text-glyph-accent">
                Manage and explore conversation exports and chat context
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {stats && (
              <div className="flex items-center gap-6 text-sm text-glyph-accent mr-4">
                <div className="flex items-center gap-1">
                  <FaFileWord size={14} />
                  <span>{stats.total} total</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt size={14} />
                  <span>{stats.recentCount} recent</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaTags size={14} />
                  <span>{stats.totalAnnotations} annotations</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-glowing"
            >
              <FaPlus className="mr-2" size={16} />
              New Context Drop
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-glyph-accent"
              size={16}
            />
            <input
              type="text"
              placeholder="Search context drops..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  handleSearch(e.target.value);
                } else {
                  loadContextDrops();
                }
              }}
              className="w-full pl-10 pr-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
            />
          </div>

          <select
            value={selectedContext}
            onChange={(e) => {
              setSelectedContext(e.target.value);
              handleContextFilter(e.target.value);
            }}
            className="glass-panel text-glyph-primary p-2 focus:outline-none focus:ring-2 focus:ring-flame-blue"
          >
            {contextOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Context Filter Sidebar */}
        <div className="w-64 bg-cosmic-deep border-r border-cosmic-light border-opacity-20 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-glyph-accent mb-3 uppercase tracking-wider">
              Conversation Contexts
            </h3>

            <div className="space-y-1">
              {contextOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedContext(option.id);
                    handleContextFilter(option.id);
                  }}
                  className={`w-full text-left p-2 rounded transition-colors ${
                    selectedContext === option.id
                      ? "glass-panel text-glyph-bright border border-flame-blue border-opacity-30"
                      : "text-glyph-accent hover:glass-panel hover:text-glyph-bright"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {option.name}
                    </span>
                    <span className="text-xs text-glyph-accent">
                      {option.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FaSpinner
                className="text-glyph-accent animate-spin mb-4"
                size={32}
              />
              <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
                Loading Context Drops
              </h3>
              <p className="text-glyph-accent">Fetching conversation data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-flame-orange bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <FaComments className="text-flame-orange" size={32} />
              </div>
              <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
                Error Loading Context Drops
              </h3>
              <p className="text-glyph-accent mb-6">{error}</p>
              <button onClick={loadContextDrops} className="btn-glowing">
                Retry
              </button>
            </div>
          ) : filteredContextDrops.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-cosmic-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <FaComments className="text-glyph-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
                No Context Drops Found
              </h3>
              <p className="text-glyph-accent mb-6">
                {searchQuery
                  ? `No context drops match "${searchQuery}"`
                  : "Start by creating your first context drop"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-glowing"
              >
                <FaPlus className="mr-2" size={16} />
                Create Context Drop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContextDrops.map((contextDrop) => (
                <div
                  key={contextDrop.id}
                  className="glass-panel border border-cosmic-light border-opacity-20 overflow-hidden hover:border-flame-blue hover:border-opacity-50 transition-all duration-300"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <FaComments
                          className="text-circuit-magic mr-2"
                          size={18}
                        />
                        <div>
                          <h3 className="font-medium text-glyph-bright font-serif">
                            {contextDrop.name}
                          </h3>
                          <span className="text-xs text-glyph-accent capitalize">
                            {contextDrop.conversation_context}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-glyph-accent mb-3 line-clamp-2">
                      {contextDrop.description || "No description provided"}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {contextDrop.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {contextDrop.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full">
                          +{contextDrop.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-glyph-accent mb-3">
                      <div className="flex items-center gap-1">
                        <FaFileWord size={10} />
                        <span>{contextDrop.message_count} messages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaTags size={10} />
                        <span>{contextDrop.annotation_count} annotations</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers size={10} />
                        <span>
                          {contextDrop.participant_count} participants
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-glyph-accent">
                      <span>{contextDrop.created_at.toLocaleDateString()}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingContextDrop(contextDrop)}
                          className="text-circuit-magic hover:text-circuit-energy transition-colors flex items-center"
                          title="View Context Drop"
                        >
                          <FaEye size={12} className="mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => setEditingContextDrop(contextDrop)}
                          className="text-flame-blue hover:text-flame-cyan transition-colors flex items-center"
                          title="Edit Context Drop"
                        >
                          <FaEdit size={12} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(contextDrop)}
                          className="text-flame-orange hover:text-red-400 transition-colors flex items-center"
                          title="Delete Context Drop"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Context Drop Creation Modal */}
      <ContextDropModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSaved={handleSaved}
      />

      {/* Context Drop Edit Modal */}
      <ContextDropModal
        isOpen={!!editingContextDrop}
        onClose={() => setEditingContextDrop(null)}
        onSaved={handleSaved}
        editingContextDrop={editingContextDrop}
      />

      {/* Context Drop Viewer Modal */}
      {viewingContextDrop && (
        <div className="fixed inset-0 bg-cosmic-deepest bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="glass-panel border border-cosmic-light border-opacity-30 max-w-7xl w-full h-[90vh] flex flex-col overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-cosmic-light border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaComments className="text-circuit-magic mr-3" size={24} />
                  <div>
                    <h2 className="text-2xl font-bold text-glyph-bright font-serif">
                      {viewingContextDrop.name}
                    </h2>
                    <p className="text-glyph-accent">
                      {viewingContextDrop.description ||
                        "Context drop conversation"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingContextDrop(null)}
                  className="text-glyph-accent hover:text-glyph-bright transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatViewer
                rawContent={viewingContextDrop.raw_content}
                annotations={viewingContextDrop.annotations}
                editable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
