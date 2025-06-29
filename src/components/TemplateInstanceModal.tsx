import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaPlus, 
  FaCheck, 
  FaSpinner, 
  FaExclamationTriangle,
  FaUsers,
  FaCog,
  FaGem,
  FaMagic,
  FaPalette,
  FaAtom,
  FaRocket,
  FaGlobe
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { IpsumTemplate } from '../types';
import { instancingService } from '../integrations/supabase/database';

interface TemplateInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: IpsumTemplate | null;
  onInstanceCreated?: (instanceId: string) => void;
}

export const TemplateInstanceModal: React.FC<TemplateInstanceModalProps> = ({
  isOpen,
  onClose,
  template,
  onInstanceCreated
}) => {
  const { 
    navigationContext, 
    currentMultiverse, 
    currentUniverse, 
    currentTimeline, 
    currentWorld, 
    multiverses 
  } = useAppContext();

  // Form state
  const [instanceName, setInstanceName] = useState('');
  const [instanceDescription, setInstanceDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [discoveredYear, setDiscoveredYear] = useState<number | undefined>();
  const [originLocation, setOriginLocation] = useState('');
  
  // Context selection
  const [selectedContext, setSelectedContext] = useState({
    multiverseId: '',
    universeId: '',
    timelineId: '',
    worldId: '',
    civilizationId: ''
  });

  // Local variations
  const [localVariations, setLocalVariations] = useState<Record<string, any>>({});
  
  // Type-specific data
  const [typeSpecificData, setTypeSpecificData] = useState<Record<string, any>>({});
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'context' | 'details' | 'variations'>('context');

  // Initialize form when template changes
  useEffect(() => {
    if (template && isOpen) {
      setInstanceName(template.name);
      setInstanceDescription(template.description);
      setNotes('');
      setDiscoveredYear(undefined);
      setOriginLocation('');
      setLocalVariations({});
      setTypeSpecificData({});
      setError(null);
      setStep('context');
      
      // Auto-fill context from current navigation
      setSelectedContext({
        multiverseId: currentMultiverse?.id || '',
        universeId: currentUniverse?.id || '',
        timelineId: currentTimeline?.id || '',
        worldId: currentWorld?.id || '',
        civilizationId: ''
      });
    }
  }, [template, isOpen, currentMultiverse, currentUniverse, currentTimeline, currentWorld]);

  const handleCreateInstance = async () => {
    if (!template) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate required fields
      if (!instanceName.trim()) {
        throw new Error('Instance name is required');
      }
      
      // Ensure at least one context is selected
      const hasContext = Object.values(selectedContext).some(id => id !== '');
      if (!hasContext) {
        throw new Error('At least one context level must be selected');
      }
      
      // Filter out empty context values
      const context = Object.fromEntries(
        Object.entries(selectedContext).filter(([_, value]) => value !== '')
      );
      
      console.log('Template object being passed:', template);
      console.log('Template ID:', template.id, 'Type:', typeof template.id);
      
      const result = await instancingService.createInstanceFromTemplate(template.id, {
        instanceName: instanceName.trim(),
        instanceDescription: instanceDescription.trim() || undefined,
        context,
        localVariations,
        typeSpecificData,
        notes: notes.trim() || undefined,
        discoveredYear,
        originLocation: originLocation.trim() || undefined
      }, template);
      
      onInstanceCreated?.(result.instance.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create instance');
    } finally {
      setIsLoading(false);
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'species': return <FaUsers className="text-flame-blue" size={20} />;
      case 'tech': return <FaCog className="text-circuit-energy" size={20} />;
      case 'item': return <FaGem className="text-flame-orange" size={20} />;
      case 'magic': return <FaMagic className="text-circuit-magic" size={20} />;
      case 'enchantment': return <FaPalette className="text-flame-cyan" size={20} />;
      case 'power': return <FaAtom className="text-circuit-magic" size={20} />;
      case 'vehicle': return <FaRocket className="text-flame-cyan" size={20} />;
      case 'culture': return <FaPalette className="text-glyph-accent" size={20} />;
      case 'civilization': return <FaGlobe className="text-flame-blue" size={20} />;
      default: return <FaAtom className="text-glyph-bright" size={20} />;
    }
  };

  const renderContextStep = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-glyph-bright mb-3 font-serif">
          Select Instance Context
        </h3>
        <p className="text-sm text-glyph-accent mb-4">
          Choose where this instance will exist in your worldbuilding hierarchy. 
          At least one level must be selected.
        </p>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-glyph-accent mb-1">
            Multiverse
          </label>
          <select
            value={selectedContext.multiverseId}
            onChange={(e) => setSelectedContext(prev => ({ 
              ...prev, 
              multiverseId: e.target.value,
              universeId: '',
              timelineId: '',
              worldId: '',
              civilizationId: ''
            }))}
            className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
          >
            <option value="">Select multiverse...</option>
            {multiverses.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        
        {selectedContext.multiverseId && (
          <div>
            <label className="block text-sm font-medium text-glyph-accent mb-1">
              Universe (Optional)
            </label>
            <select
              value={selectedContext.universeId}
              onChange={(e) => setSelectedContext(prev => ({ 
                ...prev, 
                universeId: e.target.value,
                timelineId: '',
                worldId: '',
                civilizationId: ''
              }))}
              className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
            >
              <option value="">Select universe...</option>
              {/* TODO: Load universes for selected multiverse */}
            </select>
          </div>
        )}
        
        {selectedContext.universeId && (
          <div>
            <label className="block text-sm font-medium text-glyph-accent mb-1">
              Timeline (Optional)
            </label>
            <select
              value={selectedContext.timelineId}
              onChange={(e) => setSelectedContext(prev => ({ 
                ...prev, 
                timelineId: e.target.value,
                worldId: '',
                civilizationId: ''
              }))}
              className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
            >
              <option value="">Select timeline...</option>
              {/* TODO: Load timelines for selected universe */}
            </select>
          </div>
        )}
        
        {selectedContext.timelineId && (
          <div>
            <label className="block text-sm font-medium text-glyph-accent mb-1">
              World (Optional)
            </label>
            <select
              value={selectedContext.worldId}
              onChange={(e) => setSelectedContext(prev => ({ 
                ...prev, 
                worldId: e.target.value,
                civilizationId: ''
              }))}
              className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
            >
              <option value="">Select world...</option>
              {/* TODO: Load worlds for selected timeline */}
            </select>
          </div>
        )}
        
        {selectedContext.worldId && (
          <div>
            <label className="block text-sm font-medium text-glyph-accent mb-1">
              Civilization (Optional)
            </label>
            <select
              value={selectedContext.civilizationId}
              onChange={(e) => setSelectedContext(prev => ({ 
                ...prev, 
                civilizationId: e.target.value
              }))}
              className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
            >
              <option value="">Select civilization...</option>
              {/* TODO: Load civilizations for selected world */}
            </select>
          </div>
        )}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-glyph-bright mb-3 font-serif">
          Instance Details
        </h3>
        <p className="text-sm text-glyph-accent mb-4">
          Customize the basic properties of this instance.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-glyph-accent mb-1">
            Instance Name *
          </label>
          <input
            type="text"
            value={instanceName}
            onChange={(e) => setInstanceName(e.target.value)}
            placeholder="Enter instance name..."
            className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-glyph-accent mb-1">
            Instance Description
          </label>
          <textarea
            value={instanceDescription}
            onChange={(e) => setInstanceDescription(e.target.value)}
            placeholder="Describe how this instance differs from the template..."
            rows={3}
            className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue resize-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-glyph-accent mb-1">
              Discovered Year
            </label>
            <input
              type="number"
              value={discoveredYear || ''}
              onChange={(e) => setDiscoveredYear(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Year..."
              className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-glyph-accent mb-1">
              Origin Location
            </label>
            <input
              type="text"
              value={originLocation}
              onChange={(e) => setOriginLocation(e.target.value)}
              placeholder="Location..."
              className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-glyph-accent mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes about this instance..."
            rows={2}
            className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderVariationsStep = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-glyph-bright mb-3 font-serif">
          Local Variations
        </h3>
        <p className="text-sm text-glyph-accent mb-4">
          Define how this instance differs from the original template.
        </p>
      </div>
      
      {/* Type-specific forms would go here */}
      <div className="glass-panel p-4 border border-cosmic-light border-opacity-20">
        <div className="flex items-center mb-3">
          {template && getTemplateIcon(template.type)}
          <span className="ml-2 text-glyph-bright font-medium capitalize">
            {template?.type} Specific Properties
          </span>
        </div>
        
        {template?.type === 'species' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-glyph-accent mb-1">
                Local Population
              </label>
              <input
                type="number"
                value={typeSpecificData.localPopulation || ''}
                onChange={(e) => setTypeSpecificData(prev => ({
                  ...prev,
                  localPopulation: e.target.value ? parseInt(e.target.value) : 0
                }))}
                placeholder="0"
                className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
              />
            </div>
          </div>
        )}
        
        {template?.type === 'tech' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-glyph-accent mb-1">
                Development Level (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={typeSpecificData.developmentLevel || 1}
                onChange={(e) => setTypeSpecificData(prev => ({
                  ...prev,
                  developmentLevel: parseInt(e.target.value) || 1
                }))}
                className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
              />
            </div>
          </div>
        )}
        
        {template?.type === 'item' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-glyph-accent mb-1">
                  Condition (0-100%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={typeSpecificData.conditionRating || 100}
                  onChange={(e) => setTypeSpecificData(prev => ({
                    ...prev,
                    conditionRating: parseInt(e.target.value) || 100
                  }))}
                  className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-glyph-accent mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={typeSpecificData.quantity || 1}
                  onChange={(e) => setTypeSpecificData(prev => ({
                    ...prev,
                    quantity: parseInt(e.target.value) || 1
                  }))}
                  className="w-full px-3 py-2 glass-panel text-glyph-primary focus:outline-none focus:ring-2 focus:ring-flame-blue"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-cosmic-light border-opacity-20">
          <p className="text-xs text-glyph-accent">
            More type-specific options will be available as you develop this instance further.
          </p>
        </div>
      </div>
    </div>
  );

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cosmic-deepest bg-opacity-80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 glass-panel border border-cosmic-light border-opacity-30 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cosmic-light border-opacity-20">
          <div className="flex items-center">
            {getTemplateIcon(template.type)}
            <div className="ml-3">
              <h2 className="text-xl font-bold text-glyph-bright font-serif">
                Create Instance
              </h2>
              <p className="text-glyph-accent">
                From template: <span className="text-glyph-bright">{template.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cosmic-light hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <FaTimes className="text-glyph-accent" size={18} />
          </button>
        </div>
        
        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-cosmic-light border-opacity-20">
          <div className="flex items-center space-x-4">
            {['context', 'details', 'variations'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepName
                      ? 'bg-flame-blue text-cosmic-deepest'
                      : index < ['context', 'details', 'variations'].indexOf(step)
                      ? 'bg-circuit-energy text-cosmic-deepest'
                      : 'bg-cosmic-light bg-opacity-20 text-glyph-accent'
                  }`}
                >
                  {index < ['context', 'details', 'variations'].indexOf(step) ? (
                    <FaCheck size={12} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium capitalize ${
                    step === stepName ? 'text-glyph-bright' : 'text-glyph-accent'
                  }`}
                >
                  {stepName}
                </span>
                {index < 2 && (
                  <div
                    className={`w-8 h-0.5 ml-4 ${
                      index < ['context', 'details', 'variations'].indexOf(step)
                        ? 'bg-circuit-energy'
                        : 'bg-cosmic-light bg-opacity-20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg flex items-center">
              <FaExclamationTriangle className="text-red-400 mr-2" size={16} />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}
          
          {step === 'context' && renderContextStep()}
          {step === 'details' && renderDetailsStep()}
          {step === 'variations' && renderVariationsStep()}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-cosmic-light border-opacity-20">
          <div className="flex space-x-3">
            {step !== 'context' && (
              <button
                onClick={() => {
                  const steps = ['context', 'details', 'variations'];
                  const currentIndex = steps.indexOf(step);
                  if (currentIndex > 0) {
                    setStep(steps[currentIndex - 1] as any);
                  }
                }}
                className="px-4 py-2 glass-panel text-glyph-accent hover:text-glyph-bright transition-colors"
              >
                Back
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 glass-panel text-glyph-accent hover:text-glyph-bright transition-colors"
            >
              Cancel
            </button>
            
            {step === 'variations' ? (
              <button
                onClick={handleCreateInstance}
                disabled={isLoading || !instanceName.trim()}
                className="btn-glowing flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" size={16} />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" size={16} />
                    Create Instance
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  const steps = ['context', 'details', 'variations'];
                  const currentIndex = steps.indexOf(step);
                  if (currentIndex < steps.length - 1) {
                    setStep(steps[currentIndex + 1] as any);
                  }
                }}
                disabled={step === 'context' && !Object.values(selectedContext).some(id => id !== '')}
                className="btn-glowing disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};