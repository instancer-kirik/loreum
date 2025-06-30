import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  FaPlus,
  FaLink,
  FaTrash,
  FaTags,
  FaUser,
  FaRobot,
  FaComments,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { EntityAnnotation } from "../integrations/supabase/contextDrops";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

interface ChatViewerProps {
  rawContent: string;
  annotations?: EntityAnnotation[];
  onAnnotationAdd?: (
    annotation: Omit<EntityAnnotation, "id" | "color">,
  ) => void;
  onAnnotationUpdate?: (id: string, updates: Partial<EntityAnnotation>) => void;
  onAnnotationDelete?: (id: string) => void;
  editable?: boolean;
}

const ENTITY_COLORS = {
  character: "#3B82F6", // blue
  mechanic: "#10B981", // green
  system: "#F59E0B", // amber
  location: "#8B5CF6", // purple
  item: "#EF4444", // red
  concept: "#06B6D4", // cyan
  other: "#6B7280", // gray
};

export const ChatViewer: React.FC<ChatViewerProps> = ({
  rawContent = "",
  annotations = [],
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
  editable = true,
}) => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionRange, setSelectionRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [viewMode, setViewMode] = useState<"chat" | "raw">("chat");

  const contentRef = useRef<HTMLDivElement>(null);

  // Parse chat messages from raw content
  const parseMessages = (content: string): ChatMessage[] => {
    const messages: ChatMessage[] = [];
    if (!content) return messages;
    const lines = content.split("\n");
    let currentMessage: ChatMessage | null = null;

    for (const line of lines) {
      if (line.startsWith("**User:**") || line.startsWith("**You:**")) {
        if (currentMessage) messages.push(currentMessage);
        currentMessage = {
          role: "user",
          content: line.replace(/^\*\*(?:User|You):\*\*\s*/, ""),
        };
      } else if (
        line.startsWith("**ChatGPT:**") ||
        line.startsWith("**Assistant:**")
      ) {
        if (currentMessage) messages.push(currentMessage);
        currentMessage = {
          role: "assistant",
          content: line.replace(/^\*\*(?:ChatGPT|Assistant):\*\*\s*/, ""),
        };
      } else if (currentMessage) {
        currentMessage.content += "\n" + line;
      } else {
        // If no role marker found, treat as assistant message
        currentMessage = { role: "assistant", content: line };
      }
    }

    if (currentMessage) messages.push(currentMessage);
    return messages.filter((m) => m.content.trim());
  };

  const messages = parseMessages(rawContent);

  // Handle text selection for annotation
  const handleTextSelection = () => {
    if (!editable) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();

    if (selectedText.length < 2) return;

    // Calculate position in raw content
    const container = contentRef.current;
    if (!container) return;

    const containerText = container.textContent || "";
    const startPos = containerText.indexOf(selectedText);
    const endPos = startPos + selectedText.length;

    if (startPos !== -1) {
      setSelectedText(selectedText);
      setSelectionRange({ start: startPos, end: endPos });
      setShowAnnotationModal(true);
    }
  };

  // Create annotation
  const handleCreateAnnotation = (
    entityType: EntityAnnotation["entity_type"],
    entityId?: string,
    notes?: string,
  ) => {
    if (!selectionRange || !selectedText) return;

    const annotation: Omit<EntityAnnotation, "id" | "color"> = {
      text: selectedText,
      entity_type: entityType,
      entity_id: entityId,
      notes: notes,
      start_pos: selectionRange.start,
      end_pos: selectionRange.end,
    };

    onAnnotationAdd?.(annotation);
    setShowAnnotationModal(false);
    setSelectedText("");
    setSelectionRange(null);
  };

  // Render annotated content
  const renderAnnotatedContent = (content: string) => {
    if (annotations.length === 0) return content;

    // Sort annotations by start position (reverse to avoid position shifts)
    const sortedAnnotations = [...annotations].sort(
      (a, b) => b.start_pos - a.start_pos,
    );

    let annotatedContent = content;

    for (const annotation of sortedAnnotations) {
      const before = annotatedContent.slice(0, annotation.start_pos);
      const text = annotatedContent.slice(
        annotation.start_pos,
        annotation.end_pos,
      );
      const after = annotatedContent.slice(annotation.end_pos);

      const annotationSpan = `<span
        class="entity-annotation"
        data-annotation-id="${annotation.id}"
        data-entity-type="${annotation.entity_type}"
        style="background-color: ${ENTITY_COLORS[annotation.entity_type]}20; border-bottom: 2px solid ${ENTITY_COLORS[annotation.entity_type]}; cursor: pointer;"
        title="${annotation.entity_type}: ${annotation.notes || "No notes"}"
      >${text}</span>`;

      annotatedContent = before + annotationSpan + after;
    }

    return annotatedContent;
  };

  // Custom markdown components
  const markdownComponents = {
    p: ({ children }: React.PropsWithChildren) => (
      <p className="mb-4 text-glyph-primary leading-relaxed">{children}</p>
    ),
    h1: ({ children }: React.PropsWithChildren) => (
      <h1 className="text-2xl font-bold text-glyph-bright mb-4">{children}</h1>
    ),
    h2: ({ children }: React.PropsWithChildren) => (
      <h2 className="text-xl font-semibold text-glyph-bright mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }: React.PropsWithChildren) => (
      <h3 className="text-lg font-medium text-glyph-bright mb-2">{children}</h3>
    ),
    code: ({ children }: React.PropsWithChildren) => (
      <code className="bg-cosmic-light bg-opacity-20 text-circuit-energy px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }: React.PropsWithChildren) => (
      <pre className="bg-cosmic-deep border border-cosmic-light rounded-lg p-4 overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    ul: ({ children }: React.PropsWithChildren) => (
      <ul className="list-disc list-inside mb-4 text-glyph-primary">
        {children}
      </ul>
    ),
    ol: ({ children }: React.PropsWithChildren) => (
      <ol className="list-decimal list-inside mb-4 text-glyph-primary">
        {children}
      </ol>
    ),
    blockquote: ({ children }: React.PropsWithChildren) => (
      <blockquote className="border-l-4 border-flame-blue pl-4 italic text-glyph-accent mb-4">
        {children}
      </blockquote>
    ),
  };

  return (
    <div className="h-full flex flex-col bg-cosmic-deepest overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cosmic-light border-opacity-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <FaComments className="text-circuit-magic" size={20} />
          <h2 className="text-xl font-bold text-glyph-bright font-serif">
            Chat Viewer
          </h2>
          <div className="text-sm text-glyph-accent">
            {annotations.length} annotations
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-cosmic-deep rounded-lg p-1">
            <button
              onClick={() => setViewMode("chat")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === "chat"
                  ? "bg-flame-blue text-white"
                  : "text-glyph-accent hover:text-glyph-bright"
              }`}
            >
              Chat View
            </button>
            <button
              onClick={() => setViewMode("raw")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === "raw"
                  ? "bg-flame-blue text-white"
                  : "text-glyph-accent hover:text-glyph-bright"
              }`}
            >
              Raw View
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          <div
            className="flex-1 overflow-y-auto p-6 relative min-h-0"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--cosmic-light) var(--cosmic-deep)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-cosmic-deepest to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-cosmic-deepest to-transparent pointer-events-none z-10"></div>
            <div
              ref={contentRef}
              className="max-w-4xl mx-auto"
              onMouseUp={handleTextSelection}
            >
              {viewMode === "chat" ? (
                <div className="space-y-6 pb-8">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === "user"
                                ? "bg-flame-blue bg-opacity-20"
                                : "bg-circuit-magic bg-opacity-20"
                            }`}
                          >
                            {message.role === "user" ? (
                              <FaUser className="text-flame-blue" size={14} />
                            ) : (
                              <FaRobot
                                className="text-circuit-magic"
                                size={14}
                              />
                            )}
                          </div>
                        </div>
                        <div
                          className={`glass-panel p-4 rounded-lg ${
                            message.role === "user"
                              ? "bg-flame-blue bg-opacity-10 border-flame-blue border-opacity-30"
                              : "bg-cosmic-deep border-cosmic-light border-opacity-30"
                          }`}
                        >
                          <ReactMarkdown components={markdownComponents}>
                            {renderAnnotatedContent(message.content)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-glyph-primary font-mono text-sm leading-relaxed">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderAnnotatedContent(rawContent),
                      }}
                    />
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Annotations Sidebar */}
        <div className="w-80 border-l border-cosmic-light border-opacity-20 bg-cosmic-deep flex flex-col overflow-hidden flex-shrink-0">
          <div
            className="flex-1 overflow-y-auto p-4 relative min-h-0"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--cosmic-light) var(--cosmic-deep)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-cosmic-deep to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-cosmic-deep to-transparent pointer-events-none z-10"></div>
            <h3 className="text-lg font-semibold text-glyph-bright mb-4 font-serif">
              Entity Annotations
            </h3>

            {annotations.length === 0 ? (
              <div className="text-center text-glyph-accent py-8">
                <FaTags size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">No annotations yet</p>
                <p className="text-xs mt-1">
                  Select text to create annotations
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="glass-panel p-3 rounded-lg border border-cosmic-light border-opacity-20 hover:border-opacity-40 transition-colors flex-shrink-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              ENTITY_COLORS[annotation.entity_type],
                          }}
                        />
                        <span className="text-sm font-medium text-glyph-bright capitalize">
                          {annotation.entity_type}
                        </span>
                      </div>
                      {editable && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => onAnnotationDelete?.(annotation.id)}
                            className="text-glyph-accent hover:text-red-400 transition-colors"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-glyph-primary font-medium mb-1">
                      "{annotation.text}"
                    </div>

                    {annotation.notes && (
                      <div className="text-xs text-glyph-accent mb-2">
                        {annotation.notes}
                      </div>
                    )}

                    {annotation.entity_id ? (
                      <div className="flex items-center gap-1 text-xs text-circuit-energy">
                        <FaLink size={10} />
                        <span>Linked to entity</span>
                        <FaExternalLinkAlt size={10} />
                      </div>
                    ) : (
                      <div className="text-xs text-yellow-400 flex items-center gap-1">
                        <FaPlus size={10} />
                        <span>Needs entity creation</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Annotation Creation Modal */}
      {showAnnotationModal && selectedText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-panel border border-cosmic-light rounded-xl p-6 w-96 mx-4">
            <h3 className="text-lg font-semibold text-glyph-bright mb-4">
              Annotate Entity
            </h3>

            <div className="mb-4">
              <div className="text-sm text-glyph-accent mb-2">
                Selected Text:
              </div>
              <div className="glass-panel p-2 text-glyph-primary font-medium text-sm rounded">
                "{selectedText}"
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-glyph-accent mb-2">
                Entity Type:
              </label>
              <select
                className="w-full glass-panel text-glyph-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-flame-blue"
                defaultValue="concept"
              >
                <option value="character">Character</option>
                <option value="mechanic">Game Mechanic</option>
                <option value="system">System</option>
                <option value="location">Location</option>
                <option value="item">Item</option>
                <option value="concept">Concept</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-glyph-accent mb-2">
                Notes (optional):
              </label>
              <textarea
                className="w-full glass-panel text-glyph-primary p-2 rounded focus:outline-none focus:ring-2 focus:ring-flame-blue"
                rows={3}
                placeholder="Add notes about this entity..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="px-4 py-2 text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateAnnotation("concept")} // TODO: Get from form
                className="btn-glowing"
              >
                Create Annotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
