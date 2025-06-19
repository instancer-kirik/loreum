import React, { useState } from "react";
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
} from "react-icons/fa";
import {
  IpsumTemplate,
  SpeciesTemplate,
  TechTemplate,
  ItemTemplate,
} from "../types";

export const IpsumariumVault: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  // Mock template data
  const [templates, setTemplates] = useState<IpsumTemplate[]>([
    {
      id: "species_1",
      name: "Ethereal Wanderers",
      description:
        "Energy-based beings that exist partially in subspace, capable of phasing through matter",
      type: "species",
      tags: ["energy-based", "phasing", "telepathic", "ancient"],
      metadata: {
        biology: "Pure energy consciousness",
        traits: ["Phasing", "Telepathy", "Energy manipulation"],
        averageLifespan: 50000,
        intelligence: 95,
      },
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-06-20"),
    },
    {
      id: "tech_1",
      name: "Quantum Entanglement Communicator",
      description:
        "Instantaneous communication across any distance using quantum entangled particles",
      type: "tech",
      tags: ["quantum", "communication", "instantaneous", "advanced"],
      metadata: {
        tier: 6,
        energyType: "Quantum",
        dependencies: ["quantum_mechanics_mastery", "particle_manipulation"],
        discoveryDifficulty: 85,
      },
      createdAt: new Date("2023-02-10"),
      updatedAt: new Date("2023-07-15"),
    },
    {
      id: "item_1",
      name: "Void Crystal",
      description:
        "A crystalline structure that can store and channel dark energy from the void between dimensions",
      type: "item",
      tags: ["crystal", "void", "energy-storage", "rare"],
      metadata: {
        category: "Energy Storage",
        rarity: "legendary",
        energyCapacity: 10000,
        materials: ["void_essence", "crystallized_spacetime"],
      },
      createdAt: new Date("2023-03-05"),
      updatedAt: new Date("2023-08-01"),
    },
    {
      id: "magic_1",
      name: "Aetheric Resonance",
      description:
        "A magic system based on harmonizing with cosmic energy fields that permeate reality",
      type: "magic",
      tags: ["aetheric", "resonance", "cosmic", "harmonic"],
      metadata: {
        energySource: "Cosmic Aether",
        disciplines: [
          "Elemental Harmony",
          "Void Manipulation",
          "Temporal Resonance",
        ],
        complexity: "High",
        rarity: "Uncommon",
      },
      createdAt: new Date("2023-04-12"),
      updatedAt: new Date("2023-08-15"),
    },
    {
      id: "enchantment_1",
      name: "Quantum Stabilization",
      description:
        "An enchantment that maintains quantum coherence in unstable materials and devices",
      type: "enchantment",
      tags: ["quantum", "stabilization", "coherence", "technological"],
      metadata: {
        targetTypes: ["weapons", "devices", "materials"],
        duration: "Permanent",
        energyCost: "High",
        prerequisites: ["Quantum Mechanics Mastery"],
      },
      createdAt: new Date("2023-05-20"),
      updatedAt: new Date("2023-09-01"),
    },
  ]);

  const filteredTemplates = templates.filter((template) => {
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
          <button className="btn-glowing">
            <FaPlus className="mr-2" size={16} />
            New Template
          </button>
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
                    {category.id === "all"
                      ? templates.length
                      : templates.filter((t) => t.type === category.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {filteredTemplates.length === 0 ? (
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

                    <p className="text-sm text-glyph-accent mb-3 line-clamp-3">
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
                      <button className="text-flame-blue hover:text-flame-cyan transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
