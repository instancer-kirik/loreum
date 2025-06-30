import React, { useState, useEffect } from "react";
import {
  FaDatabase,
  FaLink,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaClone,
  FaUsers,
  FaCog,
  FaGem,
  FaMagic,
  FaPalette,
  FaGlobe,
  FaTheaterMasks,
  FaLayerGroup,
  FaExternalLinkAlt,
  FaTh,
  FaList,
  FaComments,
  FaDownload,
} from "react-icons/fa";
import {
  ipsumariumService,
  templateInstanceService,
} from "../integrations/supabase/database";
import { IpsumTemplate, TemplateInstanceWithTemplate } from "../types";
import { TemplateCreator } from "../components/TemplateCreator";
import { InstanceCreator } from "../components/InstanceCreator";
import { ContextDropModal } from "../components/ContextDropModal";
import { ChatViewer } from "../components/ChatViewer";
import {
  contextDropService,
  ContextDrop,
} from "../integrations/supabase/contextDrops";

type ContentType =
  | "all"
  | "species"
  | "tech"
  | "item"
  | "magic_system"
  | "culture"
  | "character"
  | "civilization"
  | "context-drop";
type ContentSource = "all" | "templates" | "instances";
type ViewMode = "grid" | "list";

interface ContentItem {
  id: string;
  name: string;
  description: string;
  type: string;
  source: "template" | "instance";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  data: IpsumTemplate | TemplateInstanceWithTemplate;
}

export const IpsumariumManager: React.FC = () => {
  // Data state
  const [templates, setTemplates] = useState<IpsumTemplate[]>([]);
  const [instances, setInstances] = useState<TemplateInstanceWithTemplate[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ContentType>("all");
  const [selectedSource, setSelectedSource] = useState<ContentSource>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Modal state
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);
  const [showInstanceCreator, setShowInstanceCreator] = useState(false);
  const [instanceCreatorTemplate, setInstanceCreatorTemplate] =
    useState<IpsumTemplate | null>(null);
  const [showContextDropModal, setShowContextDropModal] = useState(false);
  const [contextDropContent, setContextDropContent] = useState("");
  const [viewingContextDrop, setViewingContextDrop] =
    useState<ContextDrop | null>(null);
  const [contextDrops, setContextDrops] = useState<ContextDrop[]>([]);

  const contentTypes = [
    {
      id: "all",
      name: "All Templates",
      icon: <FaDatabase />,
      color: "text-glyph-bright",
    },
    {
      id: "species",
      name: "Species",
      icon: <FaUsers />,
      color: "text-flame-blue",
    },
    {
      id: "tech",
      name: "Technology",
      icon: <FaCog />,
      color: "text-circuit-energy",
    },
    { id: "item", name: "Items", icon: <FaGem />, color: "text-flame-orange" },
    {
      id: "magic_system",
      name: "Magic Systems",
      icon: <FaMagic />,
      color: "text-circuit-magic",
    },
    {
      id: "culture",
      name: "Cultures",
      icon: <FaPalette />,
      color: "text-glyph-accent",
    },
    {
      id: "character",
      name: "Characters",
      icon: <FaTheaterMasks />,
      color: "text-flame-cyan",
    },
    {
      id: "civilization",
      name: "Civilizations",
      icon: <FaGlobe />,
      color: "text-flame-blue",
    },
    {
      id: "context-drop",
      name: "Context Drops",
      icon: <FaComments />,
      color: "text-circuit-magic",
    },
  ];

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const [templatesData, instancesData, contextDropsData] =
        await Promise.all([
          ipsumariumService.getAll().catch(() => []),
          templateInstanceService.getAll().catch(() => []),
          contextDropService.getAll().catch(() => []),
        ]);
      setTemplates(templatesData);
      setInstances(instancesData);
      setContextDrops(contextDropsData);
    } catch (err) {
      console.error("Failed to load content:", err);
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  // Transform data into unified content items
  const allContentItems: ContentItem[] = [
    ...templates.map((template) => ({
      id: `template_${template.id}`,
      name: template.name,
      description: template.description,
      type: template.type,
      source: "template" as const,
      tags: template.tags,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      data: template,
    })),
    ...instances.map((instance) => ({
      id: `instance_${instance.id}`,
      name: instance.instanceName,
      description:
        instance.instanceDescription || instance.template.description,
      type: instance.template.type,
      source: "instance" as const,
      tags: [...instance.template.tags, ...instance.tags],
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
      data: instance,
    })),
    ...contextDrops.map((contextDrop) => ({
      id: `context-drop_${contextDrop.id}`,
      name: contextDrop.name,
      description: contextDrop.description || "Context drop conversation",
      type: "context-drop" as const,
      source: "template" as const, // Context drops are treated as template-like entities
      tags: contextDrop.tags,
      createdAt: contextDrop.created_at,
      updatedAt: contextDrop.updated_at,
      data: contextDrop,
    })),
  ];

  // Filter content items
  const filteredItems = allContentItems.filter((item) => {
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesSource =
      selectedSource === "all" ||
      (selectedSource === "templates" && item.source === "template") ||
      (selectedSource === "instances" && item.source === "instance");
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesType && matchesSource && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    const typeConfig = contentTypes.find((t) => t.id === type);
    return typeConfig ? (
      React.cloneElement(typeConfig.icon, {
        className: typeConfig.color,
        size: 24,
      })
    ) : (
      <FaDatabase className="text-glyph-bright" size={24} />
    );
  };

  const getTypeStats = (type: string) => {
    if (type === "all") {
      return {
        templates: templates.length + contextDrops.length,
        instances: instances.length,
        total: templates.length + instances.length + contextDrops.length,
      };
    }
    if (type === "context-drop") {
      return {
        templates: contextDrops.length,
        instances: 0,
        total: contextDrops.length,
      };
    }
    return {
      templates: templates.filter((t) => t.type === type).length,
      instances: instances.filter((i) => i.template.type === type).length,
      total: allContentItems.filter((item) => item.type === type).length,
    };
  };

  const handleCreateInstance = (template: IpsumTemplate) => {
    setInstanceCreatorTemplate(template);
    setShowInstanceCreator(true);
  };

  const handleSaveTemplate = async (templateData: any) => {
    try {
      console.log("Saving template:", templateData);
      await ipsumariumService.create({
        name: templateData.name,
        description: templateData.description,
        type: templateData.type,
        tags: templateData.tags || [],
        metadata: templateData.metadata || {},
      });
      await loadContent(); // Reload data
      setShowTemplateCreator(false);
    } catch (err) {
      console.error("Failed to save template:", err);
      alert("Failed to save template. Check console for details.");
    }
  };

  const handleSaveInstance = async (instanceData: any) => {
    try {
      console.log("Saving instance:", instanceData);
      if (!instanceCreatorTemplate) {
        console.error("No template selected for instance creation");
        return;
      }

      await templateInstanceService.createInstance({
        templateId: instanceCreatorTemplate.id,
        worldId: currentWorld?.id || null,
        name: instanceData.name,
        description: instanceData.description,
        localMetadata: instanceData.localMetadata || {},
      });

      await loadContent(); // Reload data
      setShowInstanceCreator(false);
      setInstanceCreatorTemplate(null);
    } catch (err) {
      console.error("Failed to save instance:", err);
      alert("Failed to save instance. Check console for details.");
    }
  };

  const handleSaveContextDrop = async (contextDrop: any) => {
    try {
      console.log("Context drop saved:", contextDrop);
      await loadContent(); // Reload data to show new context drop
      setShowContextDropModal(false);
    } catch (err) {
      console.error("Failed to save context drop:", err);
    }
  };

  const handleExportJSON = () => {
    // Organize templates by type
    const templatesByType = templates.reduce(
      (acc, template) => {
        const type = template.type || "other";
        if (!acc[type]) acc[type] = [];
        acc[type].push(template);
        return acc;
      },
      {} as Record<string, IpsumTemplate[]>,
    );

    // Organize instances by template type
    const instancesByType = instances.reduce(
      (acc, instance) => {
        const type = instance.template.type || "other";
        if (!acc[type]) acc[type] = [];
        acc[type].push(instance);
        return acc;
      },
      {} as Record<string, TemplateInstanceWithTemplate[]>,
    );

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: "1.0.0",
        projectName: "Loreum World Building",
        currentContext: {
          multiverse: currentMultiverse?.name || null,
          universe: currentUniverse?.name || null,
          timeline: currentTimeline?.name || null,
          world: currentWorld?.name || null,
        },
        statistics: {
          totalTemplates: templates.length,
          totalInstances: instances.length,
          totalContextDrops: contextDrops.length,
          templateTypes: Object.keys(templatesByType).map((type) => ({
            type,
            count: templatesByType[type].length,
          })),
        },
      },
      ipsumarium: {
        templates: templatesByType,
        templateCount: templates.length,
      },
      instances: {
        byType: instancesByType,
        all: instances,
        count: instances.length,
      },
      contextDrops: {
        conversations: contextDrops,
        count: contextDrops.length,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const worldName = currentWorld?.name
      ? `-${currentWorld.name.toLowerCase().replace(/\s+/g, "-")}`
      : "";
    const exportFileDefaultName = `loreum-export${worldName}-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    // Show success message (you could add a toast notification here)
    console.log(
      `✅ Exported ${templates.length} templates, ${instances.length} instances, and ${contextDrops.length} context drops`,
    );
  };

  const formatContextPath = (instance: TemplateInstanceWithTemplate) => {
    const parts = [];
    if (instance.multiverseName) parts.push(instance.multiverseName);
    if (instance.universeName) parts.push(instance.universeName);
    if (instance.timelineName) parts.push(instance.timelineName);
    if (instance.worldName) parts.push(instance.worldName);
    if (instance.civilizationName) parts.push(instance.civilizationName);

    return parts.length > 0 ? parts.join(" › ") : "No context";
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-cosmic-light bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaDatabase className="text-glyph-accent animate-spin" size={32} />
          </div>
          <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
            Loading Ipsumarium
          </h3>
          <p className="text-glyph-accent">Accessing the Ipsumarium Vault...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-flame-orange bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaDatabase className="text-flame-orange" size={32} />
          </div>
          <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
            Error Loading Ipsumarium
          </h3>
          <p className="text-glyph-accent mb-6">{error}</p>
          <button onClick={loadContent} className="btn-glowing">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-cosmic-light border-opacity-20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-glyph-bright font-serif mb-2">
              Ipsumarium
            </h1>
            <p className="text-glyph-accent">
              Canonical templates and instances across all realities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-glyph-accent">
              {filteredItems.length} of {allContentItems.length} items
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowTemplateCreator(true)}
                className="btn-glowing flex items-center"
              >
                <FaMagic className="mr-2" size={16} />
                New Template
              </button>
              <button
                onClick={() => setShowInstanceCreator(true)}
                className="px-4 py-2 bg-circuit-energy text-cosmic-deepest rounded-md hover:bg-circuit-magic transition-colors flex items-center"
              >
                <FaClone className="mr-2" size={16} />
                New Instance
              </button>
              <button
                onClick={() => setShowContextDropModal(true)}
                className="px-4 py-2 glass-panel text-circuit-magic hover:text-circuit-energy transition-colors border border-circuit-magic border-opacity-30 hover:border-circuit-energy flex items-center"
              >
                <FaComments className="mr-2" size={16} />
                Context Drop
              </button>
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 glass-panel text-flame-cyan hover:text-glyph-bright transition-colors border border-flame-cyan border-opacity-30 hover:border-glyph-bright flex items-center"
              >
                <FaDownload className="mr-2" size={16} />
                Export JSON
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative max-w-md">
              <FaSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-glyph-accent"
                size={16}
              />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
              />
            </div>

            {/* Source Filter */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedSource("all")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  selectedSource === "all"
                    ? "glass-panel text-glyph-bright"
                    : "text-glyph-accent hover:text-glyph-bright"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedSource("templates")}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  selectedSource === "templates"
                    ? "glass-panel text-glyph-bright"
                    : "text-glyph-accent hover:text-glyph-bright"
                }`}
              >
                <FaDatabase size={14} className="mr-1" />
                Templates
              </button>
              <button
                onClick={() => setSelectedSource("instances")}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  selectedSource === "instances"
                    ? "glass-panel text-glyph-bright"
                    : "text-glyph-accent hover:text-glyph-bright"
                }`}
              >
                <FaLink size={14} className="mr-1" />
                Instances
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "glass-panel" : "hover:glass-panel"}`}
            >
              <FaTh size={18} className="text-gray-300" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "glass-panel" : "hover:glass-panel"}`}
            >
              <FaList size={18} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Type Filter Sidebar */}
        <div className="w-64 bg-cosmic-deep border-r border-cosmic-light border-opacity-20 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-glyph-accent mb-3 font-serif tracking-wider">
              TEMPLATE CATEGORIES
            </h3>
            <div className="space-y-1">
              {contentTypes.map((type) => {
                const stats = getTypeStats(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as ContentType)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      selectedType === type.id
                        ? "glass-panel text-glyph-bright border border-flame-blue border-opacity-30"
                        : "text-glyph-accent hover:glass-panel hover:text-glyph-bright"
                    }`}
                  >
                    <span
                      className={`mr-3 ${selectedType === type.id ? "text-flame-blue" : type.color}`}
                    >
                      {type.icon}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="font-serif">{type.name}</div>
                      <div className="text-xs text-glyph-accent">
                        {stats.templates}T + {stats.instances}I
                      </div>
                    </div>
                    <span className="text-xs text-glyph-accent">
                      {stats.total}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-cosmic-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <FaDatabase className="text-glyph-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
                No Templates Found
              </h3>
              <p className="text-glyph-accent mb-6">
                {searchQuery
                  ? `No content matches "${searchQuery}"`
                  : `No ${selectedType === "all" ? "" : selectedType + " "}${selectedSource === "all" ? "content" : selectedSource} available`}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTemplateCreator(true)}
                  className="btn-glowing flex items-center"
                >
                  <FaMagic className="mr-2" size={16} />
                  Create Template
                </button>
                <button
                  onClick={handleExportJSON}
                  className="glass-panel px-4 py-2 rounded-lg text-glyph-accent hover:text-glyph-bright transition-colors flex items-center gap-2"
                >
                  <FaDownload size={16} />
                  Export JSON
                </button>
                <button
                  onClick={() => setShowInstanceCreator(true)}
                  className="px-4 py-2 bg-circuit-energy text-cosmic-deepest rounded-md hover:bg-circuit-magic transition-colors flex items-center"
                >
                  <FaClone className="mr-2" size={16} />
                  Create Instance
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel border border-cosmic-light border-opacity-20 overflow-hidden hover:border-flame-blue hover:border-opacity-50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {getTypeIcon(item.type)}
                        <div className="ml-3">
                          <h3 className="font-medium text-glyph-bright font-serif">
                            {item.name}
                          </h3>
                          <span className="text-xs text-glyph-accent capitalize">
                            {item.type} {item.source}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center ${
                          item.source === "template"
                            ? "bg-flame-blue bg-opacity-20 text-flame-blue"
                            : "bg-circuit-energy bg-opacity-20 text-circuit-energy"
                        }`}
                      >
                        {item.source === "template" ? (
                          <FaDatabase size={10} />
                        ) : (
                          <FaLink size={10} />
                        )}
                        <span className="ml-1">{item.source}</span>
                      </span>
                    </div>

                    {item.source === "instance" &&
                      item.data &&
                      "template" in item.data && (
                        <div className="mb-3">
                          <div className="text-xs text-glyph-accent mb-1">
                            Based on:
                          </div>
                          <div className="text-sm text-circuit-energy font-medium">
                            {item.data.template.name}
                          </div>
                        </div>
                      )}

                    {item.source === "instance" &&
                      item.data &&
                      "multiverseName" in item.data && (
                        <div className="mb-3">
                          <div className="text-xs text-glyph-accent mb-1">
                            Context:
                          </div>
                          <div className="text-xs text-glyph-primary">
                            {formatContextPath(item.data)}
                          </div>
                        </div>
                      )}

                    <p className="text-sm text-glyph-accent mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-glyph-accent">
                      <span>{item.createdAt.toLocaleDateString()}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="text-flame-blue hover:text-flame-cyan transition-colors flex items-center"
                          title="View Details"
                        >
                          <FaEye size={12} className="mr-1" />
                          View
                        </button>
                        {item.source === "template" &&
                          item.type !== "context-drop" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateInstance(
                                  item.data as IpsumTemplate,
                                );
                              }}
                              className="text-circuit-energy hover:text-circuit-magic transition-colors flex items-center"
                              title="Create Instance"
                            >
                              <FaClone size={12} className="mr-1" />
                              Instance
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-cosmic-medium rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-cosmic-light divide-opacity-20">
                <thead className="bg-cosmic-deep">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-glyph-accent uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-glyph-accent uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-glyph-accent uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-glyph-accent uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-glyph-accent uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cosmic-light divide-opacity-20">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-cosmic-light hover:bg-opacity-10 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(item.type)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-glyph-bright">
                              {item.name}
                            </div>
                            {item.source === "instance" &&
                              item.data &&
                              "template" in item.data && (
                                <div className="text-xs text-glyph-accent">
                                  Based on: {item.data.template.name}
                                </div>
                              )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs px-2 py-1 rounded-full flex items-center w-fit ${
                            item.source === "template"
                              ? "bg-flame-blue bg-opacity-20 text-flame-blue"
                              : "bg-circuit-energy bg-opacity-20 text-circuit-energy"
                          }`}
                        >
                          {item.source === "template" ? (
                            <FaDatabase size={10} />
                          ) : (
                            <FaLink size={10} />
                          )}
                          <span className="ml-1">{item.source}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-glyph-primary line-clamp-2">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="text-flame-blue hover:text-flame-cyan"
                          >
                            <FaEye size={14} />
                          </button>
                          {item.source === "template" && (
                            <button
                              onClick={() =>
                                handleCreateInstance(item.data as IpsumTemplate)
                              }
                              className="text-circuit-energy hover:text-circuit-magic"
                            >
                              <FaClone size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-cosmic-deepest bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="glass-panel border border-cosmic-light border-opacity-30 max-w-7xl w-full h-[90vh] flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-cosmic-light border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getTypeIcon(selectedItem.type)}
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-glyph-bright font-serif">
                      {selectedItem.name}
                    </h2>
                    <p className="text-glyph-accent">
                      {selectedItem.type} {selectedItem.source}
                      {selectedItem.source === "instance" &&
                        selectedItem.data &&
                        "template" in selectedItem.data &&
                        ` based on "${selectedItem.data.template.name}"`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-glyph-accent hover:text-glyph-bright transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {selectedItem.type === "context-drop" ? (
              <div className="flex-1 min-h-0">
                <ChatViewer
                  rawContent={(selectedItem.data as ContextDrop).raw_content}
                  annotations={(selectedItem.data as ContextDrop).annotations}
                  editable={false}
                />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">
                        Details
                      </h3>
                      <div className="glass-panel p-4 space-y-3">
                        <div>
                          <label className="text-xs text-glyph-accent">
                            Description
                          </label>
                          <div className="text-sm text-glyph-primary">
                            {selectedItem.description}
                          </div>
                        </div>

                        {selectedItem.source === "instance" &&
                          selectedItem.data &&
                          "multiverseName" in selectedItem.data && (
                            <div>
                              <label className="text-xs text-glyph-accent">
                                Context Path
                              </label>
                              <div className="text-sm text-glyph-primary">
                                {formatContextPath(selectedItem.data)}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedItem.source === "instance" &&
                      selectedItem.data &&
                      "template" in selectedItem.data && (
                        <div>
                          <h3 className="text-lg font-medium text-glyph-bright mb-2 font-serif">
                            Template Source
                          </h3>
                          <div className="glass-panel p-4 space-y-3">
                            <div>
                              <label className="text-xs text-glyph-accent">
                                Template Name
                              </label>
                              <div className="text-sm text-circuit-energy font-medium">
                                {selectedItem.data.template.name}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-glyph-accent">
                                Template Description
                              </label>
                              <div className="text-sm text-glyph-primary">
                                {selectedItem.data.template.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-cosmic-light border-opacity-20">
                  <div className="text-xs text-glyph-accent">
                    Created {selectedItem.createdAt.toLocaleDateString()},
                    Updated {selectedItem.updatedAt.toLocaleDateString()}
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-circuit-energy text-cosmic-deepest rounded-md hover:bg-circuit-magic transition-colors flex items-center">
                      <FaEdit className="mr-2" size={14} />
                      Edit
                    </button>
                    {selectedItem.source === "template" &&
                      selectedItem.type !== "context-drop" && (
                        <button
                          onClick={() =>
                            handleCreateInstance(
                              selectedItem.data as IpsumTemplate,
                            )
                          }
                          className="px-4 py-2 glass-panel text-glyph-bright hover:text-flame-blue transition-colors flex items-center"
                        >
                          <FaPlus className="mr-2" size={14} />
                          Create Instance
                        </button>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template Creator Modal */}
      <TemplateCreator
        isOpen={showTemplateCreator}
        onClose={() => setShowTemplateCreator(false)}
        onSave={handleSaveTemplate}
      />

      {/* Instance Creator Modal */}
      <InstanceCreator
        isOpen={showInstanceCreator}
        onClose={() => {
          setShowInstanceCreator(false);
          setInstanceCreatorTemplate(null);
        }}
        onSave={handleSaveInstance}
        template={instanceCreatorTemplate}
        availableTemplates={templates}
      />

      {/* Context Drop Modal */}
      <ContextDropModal
        isOpen={showContextDropModal}
        onClose={() => {
          setShowContextDropModal(false);
          setContextDropContent("");
        }}
        onSaved={handleSaveContextDrop}
        initialContent={contextDropContent}
      />
    </div>
  );
};
