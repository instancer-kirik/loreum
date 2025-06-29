import React, { useState, useEffect } from 'react';
import {
  FaComments,
  FaTimes,
  FaSave,
  FaTag
} from 'react-icons/fa';
import { ChatViewer } from './ChatViewer';
import { ipsumariumService } from '../integrations/supabase/database';
import { IpsumTemplate } from '../types';

interface EntityAnnotation {
  id: string;
  text: string;
  entity_type: 'character' | 'mechanic' | 'system' | 'location' | 'item' | 'concept' | 'other';
  entity_id?: string;
  notes?: string;
  start_pos: number;
  end_pos: number;
  color: string;
}

interface ContextDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contextDrop: IpsumTemplate) => void;
  initialContent?: string;
  editingTemplate?: IpsumTemplate;
}

const ENTITY_COLORS = {
  character: '#3B82F6',
  mechanic: '#10B981',
  system: '#F59E0B',
  location: '#8B5CF6',
  item: '#EF4444',
  concept: '#06B6D4',
  other: '#6B7280'
};

export const ContextDropModal: React.FC<ContextDropModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContent = '',
  editingTemplate
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [annotations, setAnnotations] = useState<EntityAnnotation[]>([]);
  const [conversationContext, setConversationContext] = useState('');
  const [participants, setParticipants] = useState<string[]>(['user', 'chatgpt']);
  const [saving, setSaving] = useState(false);

  // Initialize form when modal opens or editing template changes
  useEffect(() => {
    if (isOpen) {
      if (editingTemplate) {
        // Editing existing context drop
        setName(editingTemplate.name);
        setDescription(editingTemplate.description);
        setTags(editingTemplate.tags);
        setRawContent(editingTemplate.metadata?.raw_content || '');
        setAnnotations(editingTemplate.metadata?.annotations || []);
        setConversationContext(editingTemplate.metadata?.conversation_context || '');
        setParticipants(editingTemplate.metadata?.participants || ['user', 'chatgpt']);
      } else {
        // Creating new context drop
        const defaultName = `Chat - ${new Date().toLocaleDateString()}`;
        setName(defaultName);
        setDescription('Context drop from conversation');
        setRawContent(initialContent);
        setTags(['context-drop']);
        setAnnotations([]);
        setConversationContext('');
        setParticipants(['user', 'chatgpt']);
      }
    }
  }, [isOpen, editingTemplate, initialContent]);

  // Handle annotation operations
  const handleAnnotationAdd = (annotation: Omit<EntityAnnotation, 'id' | 'color'>) => {
    const newAnnotation: EntityAnnotation = {
      ...annotation,
      id: `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      color: ENTITY_COLORS[annotation.entity_type]
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleAnnotationUpdate = (id: string, updates: Partial<EntityAnnotation>) => {
    setAnnotations(prev => prev.map(ann => 
      ann.id === id ? { ...ann, ...updates } : ann
    ));
  };

  const handleAnnotationDelete = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  // Handle tag operations
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!name.trim() || !rawContent.trim()) {
      return;
    }

    setSaving(true);
    try {
      const contextDropData: Omit<IpsumTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        description: description.trim(),
        type: 'context-drop',
        tags,
        metadata: {
          raw_content: rawContent,
          annotations,
          conversation_context: conversationContext,
          participants,
          entity_count: annotations.length,
          linked_entities: annotations.filter(a => a.entity_id).length,
          pending_entities: annotations.filter(a => !a.entity_id).length
        }
      };

      let savedTemplate: IpsumTemplate;
      
      if (editingTemplate) {
        // Update existing template
        savedTemplate = await ipsumariumService.update(editingTemplate.id, contextDropData);
      } else {
        // Create new template
        savedTemplate = await ipsumariumService.create(contextDropData);
      }

      onSave(savedTemplate);
      onClose();
    } catch (error) {
      console.error('Failed to save context drop:', error);
      // TODO: Show error notification
    } finally {
      setSaving(false);
    }
  };

  const suggestedTags = [
    'game-mechanics', 'narrative-design', 'character-development', 'world-building',
    'technical-discussion', 'art-direction', 'user-experience', 'brainstorming',
    'lossybird', 'spite-mechanics', 'fragment-system', 'archivist-character'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="glass-panel border border-cosmic-light rounded-xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cosmic-light border-opacity-20">
          <div className="flex items-center gap-3">
            <FaComments className="text-circuit-magic" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-glyph-bright font-serif">
                {editingTemplate ? 'Edit Context Drop' : 'New Context Drop'}
              </h2>
              <p className="text-sm text-glyph-accent">
                Capture and annotate conversation context
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-glyph-accent hover:text-glyph-bright transition-colors p-2"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Metadata */}
          <div className="w-80 border-r border-cosmic-light border-opacity-20 p-6 overflow-auto">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-glyph-accent mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-panel text-glyph-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-flame-blue"
                  placeholder="Context drop name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-glyph-accent mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full glass-panel text-glyph-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-flame-blue"
                  rows={3}
                  placeholder="Brief description of the conversation..."
                />
              </div>

              {/* Context Info */}
              <div>
                <label className="block text-sm font-medium text-glyph-accent mb-2">
                  Conversation Context
                </label>
                <input
                  type="text"
                  value={conversationContext}
                  onChange={(e) => setConversationContext(e.target.value)}
                  className="w-full glass-panel text-glyph-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-flame-blue"
                  placeholder="e.g., game-mechanics-discussion"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-glyph-accent mb-2">
                  Tags
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-circuit-magic bg-opacity-20 text-circuit-energy text-sm rounded-full"
                    >
                      <FaTag size={10} />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-glyph-accent hover:text-red-400"
                      >
                        <FaTimes size={8} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 glass-panel text-glyph-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-flame-blue text-sm"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-circuit-magic bg-opacity-20 text-circuit-energy rounded hover:bg-opacity-30 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-glyph-accent mb-2">Suggested:</div>
                  <div className="flex flex-wrap gap-1">
                    {suggestedTags.filter(tag => !tags.includes(tag)).slice(0, 6).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setTags(prev => [...prev, tag])}
                        className="text-xs px-2 py-1 glass-panel text-glyph-accent hover:text-circuit-energy transition-colors rounded"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="glass-panel p-4 rounded-lg">
                <h4 className="text-sm font-medium text-glyph-bright mb-3">Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-glyph-accent">Annotations:</span>
                    <span className="text-glyph-bright">{annotations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-glyph-accent">Linked Entities:</span>
                    <span className="text-circuit-energy">{annotations.filter(a => a.entity_id).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-glyph-accent">Pending Entities:</span>
                    <span className="text-yellow-400">{annotations.filter(a => !a.entity_id).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-glyph-accent">Content Length:</span>
                    <span className="text-glyph-bright">{rawContent.length} chars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat Viewer */}
          <div className="flex-1 flex flex-col">
            {/* Content Input */}
            <div className="p-4 border-b border-cosmic-light border-opacity-20">
              <label className="block text-sm font-medium text-glyph-accent mb-2">
                Raw Conversation Content
              </label>
              <textarea
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                className="w-full glass-panel text-glyph-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-flame-blue font-mono text-sm"
                rows={4}
                placeholder="Paste your ChatGPT conversation here..."
              />
            </div>

            {/* Chat Viewer */}
            <div className="flex-1">
              <ChatViewer
                rawContent={rawContent}
                annotations={annotations}
                onAnnotationAdd={handleAnnotationAdd}
                onAnnotationUpdate={handleAnnotationUpdate}
                onAnnotationDelete={handleAnnotationDelete}
                editable={true}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-cosmic-light border-opacity-20">
          <div className="text-sm text-glyph-accent">
            {annotations.length > 0 && (
              <span>
                {annotations.length} entities annotated • 
                {annotations.filter(a => !a.entity_id).length} need templates
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-glyph-accent hover:text-glyph-bright transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim() || !rawContent.trim()}
              className="btn-glowing flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="mr-2" size={16} />
              {saving ? 'Saving...' : editingTemplate ? 'Update' : 'Save Context Drop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};