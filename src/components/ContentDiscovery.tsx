import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  FaBook,
  FaFeatherAlt,
  FaGamepad,
  FaMusic,
  FaFilm,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaClock,
  FaFire,
  FaChartLine,
  FaFolder,
  FaFile,
  FaChevronRight,
  FaChevronDown,
  FaTags,
  FaGlobe,
  FaUser,
} from "react-icons/fa";

interface CreativeWork {
  work_id: string;
  title: string;
  creative_type: string;
  work_status: string;
  root_work_id: string | null;
  parent_work_id: string | null;
  depth: number;
  full_path: string;
  total_word_count: number;
  direct_word_count: number;
  child_count: number;
  completed_child_count: number;
  searchable_content: string | null;
  all_tags: string[];
  work_medium: string | null;
  work_length: string | null;
  completion_percentage: number;
  has_outline: boolean;
  has_summary: boolean;
  last_modified: string;
  last_session: string | null;
  session_count: number;
  total_writing_time_hours: number;
}

interface WorkWithChildren extends CreativeWork {
  children?: WorkWithChildren[];
  expanded?: boolean;
}

type ViewMode = "grid" | "list" | "tree" | "timeline";
type SortBy = "recent" | "title" | "wordcount" | "progress";
type FilterType =
  | "all"
  | "novel"
  | "short_story"
  | "poem"
  | "game_script"
  | "chapter";

const creativeTypeIcons: { [key: string]: React.ReactNode } = {
  novel: <FaBook className="h-4 w-4" />,
  short_story: <FaFeatherAlt className="h-4 w-4" />,
  novella: <FaBook className="h-4 w-4" />,
  poem: <FaFeatherAlt className="h-4 w-4" />,
  song: <FaMusic className="h-4 w-4" />,
  lyrics: <FaMusic className="h-4 w-4" />,
  game_script: <FaGamepad className="h-4 w-4" />,
  screenplay: <FaFilm className="h-4 w-4" />,
  chapter: <FaFile className="h-4 w-4" />,
  scene: <FaFile className="h-4 w-4" />,
};

const statusColors: { [key: string]: string } = {
  planning: "bg-gray-100 text-gray-700",
  outlining: "bg-indigo-100 text-indigo-700",
  drafting: "bg-blue-100 text-blue-700",
  first_draft: "bg-cyan-100 text-cyan-700",
  revising: "bg-yellow-100 text-yellow-700",
  editing: "bg-purple-100 text-purple-700",
  complete: "bg-green-100 text-green-700",
  published: "bg-teal-100 text-teal-700",
  abandoned: "bg-red-100 text-red-700",
};

export const ContentDiscovery: React.FC = () => {
  const [works, setWorks] = useState<WorkWithChildren[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<WorkWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allCollections, setAllCollections] = useState<string[]>([]);

  useEffect(() => {
    loadWorks();
  }, []);

  useEffect(() => {
    filterAndSortWorks();
  }, [works, searchTerm, sortBy, filterType, selectedTags, selectedCollection]);

  const loadWorks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("loreum_work_discovery")
        .select("*")
        .eq("parent_work_id", null) // Only top-level works
        .order("last_modified", { ascending: false });

      if (error) throw error;

      const worksData = (data || []) as CreativeWork[];

      // Since we're only getting top-level works from discovery table,
      // no need to build hierarchy - they're already root works
      const rootWorks: WorkWithChildren[] = worksData.map((work) => ({
        ...work,
        id: work.work_id, // Map work_id to id for compatibility
        children: work.child_count > 0 ? [] : undefined,
        expanded: false,
      }));

      setWorks(rootWorks);

      // Extract all unique tags from all_tags field
      const tags = new Set<string>();

      worksData.forEach((work) => {
        work.all_tags?.forEach((tag) => tags.add(tag));
      });

      setAllTags(Array.from(tags).sort());
      // Collections aren't in discovery table, so remove that functionality for now
      setAllCollections([]);
    } catch (error) {
      console.error("Error loading works:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortWorks = () => {
    let filtered = [...works];

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((work) => work.creative_type === filterType);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (work) =>
          work.searchable_content?.toLowerCase().includes(searchLower) ||
          work.title.toLowerCase().includes(searchLower) ||
          work.all_tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((work) =>
        selectedTags.every((tag) => work.all_tags?.includes(tag)),
      );
    }

    // Apply collection filter
    if (selectedCollection) {
      // Collections not in discovery table, skip this filter
      // filtered = filtered.filter(work => work.collection === selectedCollection);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "wordcount":
          return b.total_word_count - a.total_word_count;
        case "progress":
          return b.completion_percentage - a.completion_percentage;
        case "recent":
        default:
          return (
            new Date(b.last_modified).getTime() -
            new Date(a.last_modified).getTime()
          );
      }
    });

    setFilteredWorks(filtered);
  };

  const toggleWorkExpanded = (workId: string) => {
    const toggleInTree = (items: WorkWithChildren[]): WorkWithChildren[] => {
      return items.map((item) => {
        if (item.id === workId) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: toggleInTree(item.children) };
        }
        return item;
      });
    };
    setWorks(toggleInTree(works));
  };

  const getProgressPercentage = (work: CreativeWork) => {
    return work.completion_percentage || 0;
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredWorks.map((work) => (
        <div
          key={work.work_id || work.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {creativeTypeIcons[work.creative_type] || (
                <FaFile className="h-4 w-4" />
              )}
              <h3 className="font-semibold text-lg truncate">{work.title}</h3>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${statusColors[work.work_status] || "bg-gray-100"}`}
            >
              {work.work_status}
            </span>
          </div>

          {work.full_path && work.full_path !== work.title && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {work.full_path}
            </p>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Words:</span>
              <span className="font-medium">
                {work.total_word_count.toLocaleString()}
              </span>
            </div>

            {work.completion_percentage > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-500">Progress:</span>
                  <span className="font-medium">
                    {getProgressPercentage(work).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(work)}%` }}
                  />
                </div>
              </div>
            )}

            {work.work_medium && (
              <div className="flex items-center gap-1">
                <FaFolder className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">{work.work_medium}</span>
              </div>
            )}

            {work.session_count > 0 && (
              <div className="flex items-center gap-1">
                <FaClock className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600">
                  {work.session_count} sessions
                </span>
              </div>
            )}

            {work.all_tags && work.all_tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {work.all_tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {work.all_tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    +{work.all_tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {work.child_count > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {work.child_count}{" "}
                  {work.child_count === 1 ? "component" : "components"}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredWorks.map((work) => (
        <div
          key={work.work_id || work.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {creativeTypeIcons[work.creative_type] || (
                <FaFile className="h-4 w-4" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{work.title}</h3>
                {work.full_path && work.full_path !== work.title && (
                  <p className="text-sm text-gray-600 mt-1">{work.full_path}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">
                  {work.total_word_count.toLocaleString()} words
                </div>
                {work.completion_percentage > 0 && (
                  <div className="text-xs text-gray-500">
                    {work.completion_percentage.toFixed(1)}% complete
                  </div>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${statusColors[work.work_status] || "bg-gray-100"}`}
              >
                {work.work_status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTreeNode = (work: WorkWithChildren, depth: number = 0) => (
    <div key={work.id} className="select-none">
      <div
        className={`flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer ${
          depth > 0 ? `ml-${depth * 4}` : ""
        }`}
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={() =>
          work.children &&
          work.children.length > 0 &&
          toggleWorkExpanded(work.id)
        }
      >
        {work.children &&
          work.children.length > 0 &&
          (work.expanded ? (
            <FaChevronDown className="h-3 w-3" />
          ) : (
            <FaChevronRight className="h-3 w-3" />
          ))}
        {(!work.children || work.children.length === 0) && (
          <div className="w-3" />
        )}

        {creativeTypeIcons[work.creative_type] || (
          <FaFile className="h-4 w-4" />
        )}
        <span className="font-medium">{work.title}</span>
        <span className="text-sm text-gray-500">
          ({work.total_word_count.toLocaleString()} words)
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs ml-auto ${statusColors[work.work_status] || "bg-gray-100"}`}
        >
          {work.work_status}
        </span>
      </div>

      {work.expanded &&
        work.children &&
        work.children.map((child) => renderTreeNode(child, depth + 1))}
    </div>
  );

  const renderTreeView = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {filteredWorks.map((work) => renderTreeNode(work))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading creative works...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Content Discovery</h1>
        <p className="text-gray-600">Explore and manage your creative works</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search works..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="novel">Novels</option>
            <option value="short_story">Short Stories</option>
            <option value="poem">Poems</option>
            <option value="game_script">Game Scripts</option>
            <option value="chapter">Chapters</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="title">Title</option>
            <option value="wordcount">Word Count</option>
            <option value="progress">Progress</option>
          </select>

          {/* View Mode */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(["grid", "list", "tree"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded capitalize ${
                  viewMode === mode ? "bg-white shadow" : "hover:bg-gray-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              showFilters
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FaFilter className="h-4 w-4" />
            Filters
            {(selectedTags.length > 0 || selectedCollection) && (
              <span className="bg-white text-blue-500 px-2 py-0.5 rounded-full text-xs">
                {selectedTags.length + (selectedCollection ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(
                            selectedTags.filter((t) => t !== tag),
                          );
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collections */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection
                </label>
                <select
                  value={selectedCollection || ""}
                  onChange={(e) =>
                    setSelectedCollection(e.target.value || null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Collections</option>
                  {allCollections.map((collection) => (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 mb-4">
        Found {filteredWorks.length}{" "}
        {filteredWorks.length === 1 ? "work" : "works"}
      </div>

      {/* Content */}
      {viewMode === "grid" && renderGridView()}
      {viewMode === "list" && renderListView()}
      {viewMode === "tree" && renderTreeView()}
    </div>
  );
};
