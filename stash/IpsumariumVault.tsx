import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaAtom,
  FaUsers,
  FaCog,
  FaRocket,
  FaGem,
  FaPalette,
  FaAngleDoubleUp,
  FaGlobe,
  FaMagic,
  FaClone,
  FaComments,
} from "react-icons/fa";
import {
  IpsumTemplate,
  SpeciesTemplate,
  TechTemplate,
  ItemTemplate,
} from "../src/types";
import { TemplateInstanceModal } from "../src/components/TemplateInstanceModal";
import { ipsumariumService } from "../src/integrations/supabase/database";

export const IpsumariumVault: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Instance modal state
  const [selectedTemplate, setSelectedTemplate] =
    useState<IpsumTemplate | null>(null);
  const [isInstanceModalOpen, setIsInstanceModalOpen] = useState(false);

  const handleCreateInstance = (template: IpsumTemplate) => {
    setSelectedTemplate(template);
    setIsInstanceModalOpen(true);
  };

  const handleInstanceCreated = (instanceId: string) => {
    console.log("Instance created:", instanceId);
    // TODO: Show success notification or navigate to instance
  };

  const categories = [
    {
      id: "all",
      name: "All Templates",
      icon: <FaAtom size={18} />,
      color: "text-glyph-bright",
    },
    {
      id: "species",
      name: "Species",
      icon: <FaUsers size={18} />,
      color: "text-flame-blue",
    },
    {
      id: "tech",
      name: "Technologies",
      icon: <FaCog size={18} />,
      color: "text-circuit-energy",
    },
    {
      id: "item",
      name: "Items",
      icon: <FaGem size={18} />,
      color: "text-flame-orange",
    },
    {
      id: "magic",
      name: "Magic Systems",
      icon: <FaMagic size={18} />,
      color: "text-circuit-magic",
    },
    {
      id: "enchantment",
      name: "Enchantments",
      icon: <FaPalette size={18} />,
      color: "text-flame-cyan",
    },
    {
      id: "power",
      name: "Powers",
      icon: <FaAtom size={18} />,
      color: "text-circuit-magic",
    },
    {
      id: "vehicle",
      name: "Vehicles",
      icon: <FaRocket size={18} />,
      color: "text-flame-cyan",
    },
    {
      id: "culture",
      name: "Cultures",
      icon: <FaPalette size={18} />,
      color: "text-glyph-accent",
    },
    {
      id: "civilization",
      name: "Civilizations",
      icon: <FaGlobe size={18} />,
      color: "text-flame-blue",
    },
  ];

  const [templates, setTemplates] = useState<IpsumTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load templates from database
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ipsumariumService.getAll();
        setTemplates(data);
      } catch (err) {
        console.error("Failed to load templates:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load templates",
        );
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const filteredTemplates = templates.filter((template) => {
    // Exclude context-drop templates as they have their own dedicated page
    if (template.type === "context-drop") {
      return false;
    }

    const matchesCategory =
      selectedCategory === "all" || template.type === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "species":
        return <FaUsers className="text-flame-blue" size={24} />;
      case "tech":
        return <FaCog className="text-circuit-energy" size={24} />;
      case "item":
        return <FaGem className="text-flame-orange" size={24} />;
      case "magic":
        return <FaMagic className="text-circuit-magic" size={24} />;
      case "enchantment":
        return <FaAngleDoubleUp className="text-flame-cyan" size={24} />;
      case "power":
        return <FaAtom className="text-circuit-magic" size={24} />;
      case "vehicle":
        return <FaRocket className="text-flame-cyan" size={24} />;
      case "culture":
        return <FaPalette className="text-glyph-accent" size={24} />;
      case "civilization":
        return <FaGlobe className="text-flame-blue" size={24} />;

      default:
        return <FaAtom className="text-glyph-bright" size={24} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-cosmic-light border-opacity-20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-glyph-bright font-serif mb-2">
              Ipsumarium Vault
            </h1>
            <p className="text-glyph-accent">
              Canonical templates and reusable entities across all realities
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-glowing">
              <FaPlus className="mr-2" size={16} />
              New Template
            </button>
            <button
              className="glass-panel px-4 py-2 text-circuit-magic hover:text-circuit-energy transition-colors border border-circuit-magic border-opacity-30 hover:border-circuit-energy"
              onClick={() => {
                // Quick context drop - will implement modal later
                const content = prompt(
                  "Paste ChatGPT conversation or context:",
                );
                if (content) {
                  // For now, just log it - later we'll save to database
                  console.log("Context drop:", content);
                }
              }}
            >
              <FaComments className="mr-2" size={16} />
              Quick Drop
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
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
          <button className="p-2 glass-panel text-glyph-accent hover:text-glyph-bright transition-colors">
            <FaFilter size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Category Sidebar */}
        <div className="w-64 bg-cosmic-deep border-r border-cosmic-light border-opacity-20 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-glyph-accent mb-3 font-serif tracking-wider">
              TEMPLATE CATEGORIES
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "glass-panel text-glyph-bright border border-flame-blue border-opacity-30"
                      : "text-glyph-accent hover:glass-panel hover:text-glyph-bright"
                  }`}
                >
                  <span
                    className={`mr-3 ${selectedCategory === category.id ? "text-flame-blue" : category.color}`}
                  >
                    {category.icon}
                  </span>
                  <span className="font-serif">{category.name}</span>
                  <span className="ml-auto text-xs text-glyph-accent">
                    {loading
                      ? "..."
                      : category.id === "all"
                        ? templates.filter((t) => t.type !== "context-drop")
                            .length
                        : templates.filter((t) => t.type === category.id)
                            .length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-cosmic-light bg-opacity-20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <FaAtom className="text-glyph-accent animate-spin" size={32} />
              </div>
              <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
                Loading Templates
              </h3>
              <p className="text-glyph-accent">
                Accessing the Ipsumarium Vault...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-flame-orange bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <FaAtom className="text-flame-orange" size={32} />
              </div>
              <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
                Error Loading Templates
              </h3>
              <p className="text-glyph-accent mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-glowing"
              >
                Retry
              </button>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-cosmic-light bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <FaAtom className="text-glyph-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold text-glyph-bright mb-2 font-serif">
                No Templates Found
              </h3>
              <p className="text-glyph-accent mb-6">
                {searchQuery
                  ? `No templates match "${searchQuery}" in the ${selectedCategory === "all" ? "vault" : selectedCategory + " category"}`
                  : `No ${selectedCategory === "all" ? "" : selectedCategory + " "}templates available yet`}
              </p>
              <button className="btn-glowing">
                <FaPlus className="mr-2" size={16} />
                Create First Template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="glass-panel border border-cosmic-light border-opacity-20 overflow-hidden hover:border-flame-blue hover:border-opacity-50 transition-all duration-300 cursor-pointer"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {getTemplateIcon(template.type)}
                        <div className="ml-3">
                          <h3 className="font-medium text-glyph-bright font-serif">
                            {template.name}
                          </h3>
                          <span className="text-xs text-glyph-accent capitalize">
                            {template.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-glyph-accent mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-glyph-accent">
                      <span>
                        Updated {template.updatedAt.toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateInstance(template);
                          }}
                          className="text-circuit-energy hover:text-circuit-magic transition-colors flex items-center"
                          title="Create Instance"
                        >
                          <FaClone size={12} className="mr-1" />
                          Instance
                        </button>
                        <button className="text-flame-blue hover:text-flame-cyan transition-colors">
                          Edit
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

      {/* Template Instance Modal */}
      <TemplateInstanceModal
        isOpen={isInstanceModalOpen}
        onClose={() => {
          setIsInstanceModalOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
        onInstanceCreated={handleInstanceCreated}
      />
    </div>
  );
};
