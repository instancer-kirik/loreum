import React, { useState } from "react";
import {
  FaUsers,
  FaCog,
  FaGem,
  FaMagic,
  FaPalette,
  FaGlobe,
  FaPlus,
  FaSave,
  FaTimes,
} from "react-icons/fa";

interface TemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: any) => void;
  initialType?: string;
}

interface TemplateFormData {
  name: string;
  description: string;
  type: string;
  tags: string[];
  metadata: Record<string, any>;
}

export const TemplateCreator: React.FC<TemplateCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialType = "species",
}) => {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    type: initialType,
    tags: [],
    metadata: {},
  });

  const [currentTag, setCurrentTag] = useState("");
  const [activeSection, setActiveSection] = useState("basic");

  const templateTypes = [
    {
      id: "species",
      name: "Species",
      icon: <FaUsers className="text-flame-blue" />,
      description: "Biological or artificial lifeforms",
      fields: [
        {
          key: "physiology",
          label: "Physiology",
          type: "textarea",
          placeholder: "Physical characteristics and biology...",
        },
        {
          key: "psychology",
          label: "Psychology",
          type: "textarea",
          placeholder: "Mental traits and behavior patterns...",
        },
        {
          key: "society",
          label: "Society",
          type: "textarea",
          placeholder: "Social structure and culture...",
        },
        {
          key: "lifespan",
          label: "Average Lifespan",
          type: "number",
          placeholder: "100",
        },
        {
          key: "reproduction",
          label: "Reproduction",
          type: "text",
          placeholder: "Sexual, asexual, other...",
        },
      ],
    },
    {
      id: "tech",
      name: "Technology",
      icon: <FaCog className="text-circuit-energy" />,
      description: "Scientific and technological innovations",
      fields: [
        {
          key: "function",
          label: "Primary Function",
          type: "textarea",
          placeholder: "What does this technology do?",
        },
        {
          key: "mechanism",
          label: "Mechanism",
          type: "textarea",
          placeholder: "How does it work?",
        },
        {
          key: "requirements",
          label: "Requirements",
          type: "textarea",
          placeholder: "Prerequisites and resources needed...",
        },
        {
          key: "limitations",
          label: "Limitations",
          type: "textarea",
          placeholder: "Known limitations and constraints...",
        },
        {
          key: "techLevel",
          label: "Tech Level",
          type: "number",
          placeholder: "1-10",
        },
      ],
    },
    {
      id: "item",
      name: "Item",
      icon: <FaGem className="text-flame-orange" />,
      description: "Physical objects, tools, and artifacts",
      fields: [
        {
          key: "appearance",
          label: "Appearance",
          type: "textarea",
          placeholder: "Physical description...",
        },
        {
          key: "materials",
          label: "Materials",
          type: "text",
          placeholder: "Made from...",
        },
        {
          key: "function",
          label: "Function",
          type: "textarea",
          placeholder: "Purpose and capabilities...",
        },
        {
          key: "rarity",
          label: "Rarity",
          type: "select",
          options: ["Common", "Uncommon", "Rare", "Legendary", "Artifact"],
        },
        {
          key: "durability",
          label: "Durability",
          type: "number",
          placeholder: "1-100",
        },
      ],
    },
    {
      id: "magic",
      name: "Magic System",
      icon: <FaMagic className="text-circuit-magic" />,
      description: "Magical frameworks and supernatural systems",
      fields: [
        {
          key: "source",
          label: "Power Source",
          type: "text",
          placeholder: "Where does the magic come from?",
        },
        {
          key: "rules",
          label: "Rules & Laws",
          type: "textarea",
          placeholder: "How magic works and its limitations...",
        },
        {
          key: "practitioners",
          label: "Practitioners",
          type: "textarea",
          placeholder: "Who can use this magic?",
        },
        {
          key: "cost",
          label: "Cost/Price",
          type: "textarea",
          placeholder: "What does using magic cost?",
        },
        {
          key: "scope",
          label: "Scope",
          type: "select",
          options: ["Personal", "Local", "Regional", "Global", "Universal"],
        },
      ],
    },
    {
      id: "culture",
      name: "Culture",
      icon: <FaPalette className="text-glyph-accent" />,
      description: "Social customs, beliefs, and practices",
      fields: [
        {
          key: "values",
          label: "Core Values",
          type: "textarea",
          placeholder: "What does this culture value most?",
        },
        {
          key: "traditions",
          label: "Traditions",
          type: "textarea",
          placeholder: "Important customs and rituals...",
        },
        {
          key: "government",
          label: "Governance",
          type: "text",
          placeholder: "How is this culture organized?",
        },
        {
          key: "arts",
          label: "Arts & Expression",
          type: "textarea",
          placeholder: "Cultural expressions and creativity...",
        },
        {
          key: "conflicts",
          label: "Internal Conflicts",
          type: "textarea",
          placeholder: "Cultural tensions and issues...",
        },
      ],
    },
    {
      id: "character",
      name: "Character",
      icon: <FaUsers className="text-flame-blue" />,
      description: "Individual personalities and personas",
      fields: [
        {
          key: "personality",
          label: "Personality",
          type: "textarea",
          placeholder: "Character traits and demeanor...",
        },
        {
          key: "background",
          label: "Background",
          type: "textarea",
          placeholder: "History and origins...",
        },
        {
          key: "motivation",
          label: "Motivation",
          type: "textarea",
          placeholder: "What drives this character?",
        },
        {
          key: "abilities",
          label: "Abilities",
          type: "textarea",
          placeholder: "Skills, powers, and capabilities...",
        },
        {
          key: "relationships",
          label: "Key Relationships",
          type: "textarea",
          placeholder: "Important connections...",
        },
      ],
    },
    {
      id: "civilization",
      name: "Civilization",
      icon: <FaGlobe className="text-flame-blue" />,
      description: "Large-scale societies and their systems",
      fields: [
        {
          key: "government",
          label: "Government Type",
          type: "text",
          placeholder: "Democracy, monarchy, etc.",
        },
        {
          key: "economy",
          label: "Economic System",
          type: "textarea",
          placeholder: "How does trade and commerce work?",
        },
        {
          key: "technology",
          label: "Technology Level",
          type: "textarea",
          placeholder: "What technologies do they have?",
        },
        {
          key: "military",
          label: "Military",
          type: "textarea",
          placeholder: "Defense and warfare capabilities...",
        },
        {
          key: "expansion",
          label: "Expansion Policy",
          type: "textarea",
          placeholder: "How do they grow and spread?",
        },
      ],
    },
  ];

  const getCurrentTemplate = () =>
    templateTypes.find((t) => t.id === formData.type) || templateTypes[0];

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleMetadataChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Please enter a name for the template");
      return;
    }

    const template = {
      ...formData,
      id: `template_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onSave(template);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: initialType,
      tags: [],
      metadata: {},
    });
    setCurrentTag("");
    setActiveSection("basic");
  };

  if (!isOpen) return null;

  const currentTemplate = getCurrentTemplate();

  return (
    <div className="fixed inset-0 bg-cosmic-deepest bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="glass-panel border border-cosmic-light border-opacity-30 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cosmic-light border-opacity-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaMagic className="text-flame-blue mr-3" size={24} />
              <div>
                <h2 className="text-2xl font-bold text-glyph-bright font-serif">
                  Create Template
                </h2>
                <p className="text-glyph-accent">
                  Design a reusable template for your multiverse
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-glyph-accent hover:text-glyph-bright transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Template Type Selector */}
          <div className="w-64 bg-cosmic-deep border-r border-cosmic-light border-opacity-20 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-glyph-accent mb-3 font-serif tracking-wider">
                TEMPLATE TYPE
              </h3>
              <div className="space-y-2">
                {templateTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: type.id }))
                    }
                    className={`w-full flex items-start p-3 rounded-lg transition-all duration-200 ${
                      formData.type === type.id
                        ? "glass-panel text-glyph-bright border border-flame-blue border-opacity-30"
                        : "text-glyph-accent hover:glass-panel hover:text-glyph-bright"
                    }`}
                  >
                    <span
                      className={`mr-3 mt-0.5 ${formData.type === type.id ? "text-flame-blue" : ""}`}
                    >
                      {type.icon}
                    </span>
                    <div className="text-left">
                      <div className="font-serif font-medium">{type.name}</div>
                      <div className="text-xs text-glyph-accent mt-1">
                        {type.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-glyph-bright font-serif flex items-center">
                  {currentTemplate.icon}
                  <span className="ml-2">{currentTemplate.name} Template</span>
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-glyph-accent mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder={`Enter ${currentTemplate.name.toLowerCase()} name...`}
                      className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-glyph-accent mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder={`Describe this ${currentTemplate.name.toLowerCase()}...`}
                      rows={3}
                      className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-glyph-accent mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-glyph-accent hover:text-flame-orange transition-colors"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    placeholder="Add tag..."
                    className="flex-1 px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                  />
                  <button
                    onClick={addTag}
                    className="ml-2 px-4 py-2 bg-flame-blue text-cosmic-deepest rounded-md hover:bg-flame-cyan transition-colors"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Type-Specific Fields */}
              <div>
                <h4 className="text-md font-medium text-glyph-bright font-serif mb-4">
                  {currentTemplate.name} Details
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {currentTemplate.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-glyph-accent mb-2">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={formData.metadata[field.key] || ""}
                          onChange={(e) =>
                            handleMetadataChange(field.key, e.target.value)
                          }
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue resize-none"
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={formData.metadata[field.key] || ""}
                          onChange={(e) =>
                            handleMetadataChange(field.key, e.target.value)
                          }
                          className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                        >
                          <option value="">
                            Select {field.label.toLowerCase()}...
                          </option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={formData.metadata[field.key] || ""}
                          onChange={(e) =>
                            handleMetadataChange(field.key, e.target.value)
                          }
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cosmic-light border-opacity-20 flex justify-between">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-6 py-2 glass-panel text-glyph-accent hover:text-glyph-bright transition-colors"
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            <button
              onClick={resetForm}
              className="px-6 py-2 glass-panel text-glyph-bright hover:text-flame-blue transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-flame-blue text-cosmic-deepest rounded-md hover:bg-flame-cyan transition-colors flex items-center"
            >
              <FaSave className="mr-2" size={16} />
              Create Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
