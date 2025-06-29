import React, { useState, useEffect } from 'react';
import {
  FaClone,
  FaSave,
  FaTimes,
  FaGlobe,
  FaRocket,
  FaUsers,
  FaMapMarkerAlt,
  FaSearch,
  FaChevronDown
} from 'react-icons/fa';
import { IpsumTemplate } from '../types';

interface InstanceCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instanceData: any) => void;
  template?: IpsumTemplate | null;
  availableTemplates?: IpsumTemplate[];
}

interface InstanceFormData {
  templateId: string;
  instanceName: string;
  instanceDescription: string;
  context: {
    multiverseId?: string;
    universeId?: string;
    timelineId?: string;
    worldId?: string;
    civilizationId?: string;
  };
  localVariations: Record<string, any>;
  overrideMetadata: Record<string, any>;
  tags: string[];
  discoveredYear?: number;
  originLocation?: string;
  notes?: string;
}

export const InstanceCreator: React.FC<InstanceCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  template,
  availableTemplates = []
}) => {
  const [formData, setFormData] = useState<InstanceFormData>({
    templateId: template?.id || '',
    instanceName: '',
    instanceDescription: '',
    context: {},
    localVariations: {},
    overrideMetadata: {},
    tags: [],
    notes: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState<IpsumTemplate | null>(template || null);
  const [currentTag, setCurrentTag] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  const [showTemplateSelector, setShowTemplateSelector] = useState(!template);

  // Mock context data - in real app this would come from your context service
  const mockContextData = {
    multiverses: [
      { id: 'mv1', name: 'Prime Reality' },
      { id: 'mv2', name: 'Alternate Dimensions' }
    ],
    universes: [
      { id: 'uv1', name: 'Milky Way Galaxy', multiverseId: 'mv1' },
      { id: 'uv2', name: 'Andromeda Realm', multiverseId: 'mv1' }
    ],
    timelines: [
      { id: 'tl1', name: 'Main Timeline', universeId: 'uv1' },
      { id: 'tl2', name: 'Alternative History', universeId: 'uv1' }
    ],
    worlds: [
      { id: 'w1', name: 'Terra Nova', timelineId: 'tl1' },
      { id: 'w2', name: 'New Earth', timelineId: 'tl1' }
    ],
    civilizations: [
      { id: 'c1', name: 'Terran Federation', worldId: 'w1' },
      { id: 'c2', name: 'Stellar Empire', worldId: 'w1' }
    ]
  };

  useEffect(() => {
    if (template) {
      setSelectedTemplate(template);
      setFormData(prev => ({
        ...prev,
        templateId: template.id,
        instanceName: `${template.name} Instance`,
        tags: [...template.tags]
      }));
    }
  }, [template]);

  const handleTemplateSelect = (selectedTemplate: IpsumTemplate) => {
    setSelectedTemplate(selectedTemplate);
    setFormData(prev => ({
      ...prev,
      templateId: selectedTemplate.id,
      instanceName: `${selectedTemplate.name} Instance`,
      tags: [...selectedTemplate.tags]
    }));
    setShowTemplateSelector(false);
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleContextChange = (level: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      context: {
        ...prev.context,
        [level]: value
      }
    }));
  };

  const handleLocalVariationChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      localVariations: {
        ...prev.localVariations,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }

    if (!formData.instanceName.trim()) {
      alert('Please enter an instance name');
      return;
    }

    const instanceData = {
      ...formData,
      id: `instance_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };

    onSave(instanceData);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      templateId: template?.id || '',
      instanceName: '',
      instanceDescription: '',
      context: {},
      localVariations: {},
      overrideMetadata: {},
      tags: [],
      notes: ''
    });
    setCurrentTag('');
    setActiveSection('basic');
    if (!template) {
      setSelectedTemplate(null);
      setShowTemplateSelector(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-cosmic-deepest bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="glass-panel border border-cosmic-light border-opacity-30 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cosmic-light border-opacity-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaClone className="text-circuit-energy mr-3" size={24} />
              <div>
                <h2 className="text-2xl font-bold text-glyph-bright font-serif">
                  Create Instance
                </h2>
                <p className="text-glyph-accent">
                  {selectedTemplate 
                    ? `Create an instance of "${selectedTemplate.name}"`
                    : 'Create an instance from a template'
                  }
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
          {/* Section Navigation */}
          <div className="w-64 bg-cosmic-deep border-r border-cosmic-light border-opacity-20 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-glyph-accent mb-3 font-serif tracking-wider">
                SECTIONS
              </h3>
              <div className="space-y-1">
                {[
                  { id: 'template', name: 'Template', icon: <FaSearch /> },
                  { id: 'basic', name: 'Basic Info', icon: <FaClone /> },
                  { id: 'context', name: 'Context', icon: <FaGlobe /> },
                  { id: 'variations', name: 'Variations', icon: <FaRocket /> },
                  { id: 'notes', name: 'Notes', icon: <FaMapMarkerAlt /> }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? "glass-panel text-glyph-bright border border-flame-blue border-opacity-30"
                        : "text-glyph-accent hover:glass-panel hover:text-glyph-bright"
                    }`}
                  >
                    <span className={`mr-3 ${activeSection === section.id ? "text-flame-blue" : ""}`}>
                      {section.icon}
                    </span>
                    <span className="font-serif">{section.name}</span>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <div className="mt-6 p-3 glass-panel border border-cosmic-light border-opacity-20">
                  <h4 className="text-sm font-medium text-glyph-bright mb-2">Selected Template</h4>
                  <div className="text-sm text-glyph-accent">
                    <div className="font-medium text-circuit-energy">{selectedTemplate.name}</div>
                    <div className="text-xs mt-1">{selectedTemplate.type}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Template Selection */}
              {activeSection === 'template' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-glyph-bright font-serif">
                    Select Template
                  </h3>
                  
                  {availableTemplates.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-glyph-accent mb-4">No templates available</div>
                      <button 
                        onClick={() => window.location.href = '#ipsumarium'}
                        className="btn-glowing"
                      >
                        Create Templates First
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {availableTemplates.map((tmpl) => (
                        <button
                          key={tmpl.id}
                          onClick={() => handleTemplateSelect(tmpl)}
                          className={`p-4 text-left rounded-lg border transition-all ${
                            selectedTemplate?.id === tmpl.id
                              ? 'glass-panel border-flame-blue border-opacity-50'
                              : 'border-cosmic-light border-opacity-20 hover:glass-panel'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-glyph-bright">{tmpl.name}</h4>
                              <p className="text-sm text-glyph-accent mt-1">{tmpl.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {tmpl.tags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="text-xs px-2 py-1 bg-cosmic-light bg-opacity-30 text-glyph-accent rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-circuit-energy bg-opacity-20 text-circuit-energy rounded-full">
                              {tmpl.type}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Basic Information */}
              {activeSection === 'basic' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-glyph-bright font-serif">
                    Instance Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-glyph-accent mb-2">
                      Instance Name *
                    </label>
                    <input
                      type="text"
                      value={formData.instanceName}
                      onChange={(e) => setFormData(prev => ({ ...prev, instanceName: e.target.value }))}
                      placeholder="Enter instance name..."
                      className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-glyph-accent mb-2">
                      Instance Description
                    </label>
                    <textarea
                      value={formData.instanceDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, instanceDescription: e.target.value }))}
                      placeholder="Describe this specific instance..."
                      rows={4}
                      className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue resize-none"
                    />
                  </div>

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
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add tag..."
                        className="flex-1 px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                      />
                      <button
                        onClick={addTag}
                        className="ml-2 px-4 py-2 bg-flame-blue text-cosmic-deepest rounded-md hover:bg-flame-cyan transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Context Selection */}
              {activeSection === 'context' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-glyph-bright font-serif">
                    Instance Context
                  </h3>
                  <p className="text-sm text-glyph-accent">
                    Place this instance within your multiverse hierarchy
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-glyph-accent mb-2">
                        Multiverse
                      </label>
                      <select
                        value={formData.context.multiverseId || ''}
                        onChange={(e) => handleContextChange('multiverseId', e.target.value)}
                        className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                      >
                        <option value="">Select multiverse...</option>
                        {mockContextData.multiverses.map((mv) => (
                          <option key={mv.id} value={mv.id}>{mv.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-glyph-accent mb-2">
                        Universe
                      </label>
                      <select
                        value={formData.context.universeId || ''}
                        onChange={(e) => handleContextChange('universeId', e.target.value)}
                        className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                      >
                        <option value="">Select universe...</option>
                        {mockContextData.universes
                          .filter(uv => !formData.context.multiverseId || uv.multiverseId === formData.context.multiverseId)
                          .map((uv) => (
                            <option key={uv.id} value={uv.id}>{uv.name}</option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-glyph-accent mb-2">
                        Timeline
                      </label>
                      <select
                        value={formData.context.timelineId || ''}
                        onChange={(e) => handleContextChange('timelineId', e.target.value)}
                        className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                      >
                        <option value="">Select timeline...</option>
                        {mockContextData.timelines
                          .filter(tl => !formData.context.universeId || tl.universeId === formData.context.universeId)
                          .map((tl) => (
                            <option key={tl.id} value={tl.id}>{tl.name}</option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-glyph-accent mb-2">
                        World
                      </label>
                      <select
                        value={formData.context.worldId || ''}
                        onChange={(e) => handleContextChange('worldId', e.target.value)}
                        className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                      >
                        <option value="">Select world...</option>
                        {mockContextData.worlds
                          .filter(w => !formData.context.timelineId || w.timelineId === formData.context.timelineId)
                          .map((w) => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-glyph-accent mb-2">
                        Civilization
                      </label>
                      <select
                        value={formData.context.civilizationId || ''}
                        onChange={(e) => handleContextChange('civilizationId', e.target.value)}
                        className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                      >
                        <option value="">Select civilization...</option>
                        {mockContextData.civilizations
                          .filter(c => !formData.context.worldId || c.worldId === formData.context.worldId)
                          .map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Local Variations */}
              {activeSection === 'variations' && selectedTemplate && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-glyph-bright font-serif">
                    Local Variations
                  </h3>
                  <p className="text-sm text-glyph-accent">
                    Customize how this instance differs from the base template
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-glyph-accent mb-2">
                        Discovery Year
                      </label>
                      <input
                        type="number"
                        value={formData.discoveredYear || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, discoveredYear: parseInt(e.target.value) || undefined }))}
                        placeholder="Year of discovery..."
                        className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-glyph-accent mb-2">
                        Origin Location
                      </label>
                      <input
                        type="text"
                        value={formData.originLocation || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, originLocation: e.target.value }))}
                        placeholder="Where was this found/created..."
                        className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                      />
                    </div>

                    {selectedTemplate.metadata && Object.keys(selectedTemplate.metadata).map((key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-glyph-accent mb-2">
                          {key.charAt(0).toUpperCase() + key.slice(1)} (Override)
                        </label>
                        <textarea
                          value={formData.localVariations[key] || ''}
                          onChange={(e) => handleLocalVariationChange(key, e.target.value)}
                          placeholder={`Override ${key} for this instance...`}
                          rows={2}
                          className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {activeSection === 'notes' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-glyph-bright font-serif">
                    Additional Notes
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-glyph-accent mb-2">
                      Instance Notes
                    </label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional notes about this instance..."
                      rows={6}
                      className="w-full px-4 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cosmic-light border-opacity-20 flex justify-between">
          <button
            onClick={() => { resetForm(); onClose(); }}
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
              className="px-6 py-2 bg-circuit-energy text-cosmic-deepest rounded-md hover:bg-circuit-magic transition-colors flex items-center"
            >
              <FaSave className="mr-2" size={16} />
              Create Instance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};