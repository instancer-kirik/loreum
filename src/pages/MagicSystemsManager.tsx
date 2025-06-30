import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Wand2, BookOpen, TrendingUp, Save, X, Copy } from 'lucide-react';
import { ipsumariumService, templateInstanceService } from '@/integrations/supabase/database';
import { IpsumTemplate, MagicSystemInstance, TemplateInstanceWithTemplate } from '@/types';

interface MagicSystemsManagerProps {
  className?: string;
}

interface MagicSystemMetadata {
  source: 'aetheric' | 'divine' | 'ritual' | 'innate' | 'technological' | 'natural';
  structure: 'school-based' | 'domain-based' | 'freeform' | 'hierarchical';
  rules: Record<string, any>;
  abilities?: Array<{
    name: string;
    description: string;
    level: number;
    prerequisites: string[];
    effects: Record<string, any>;
    cost: Record<string, any>;
  }>;
  progression?: {
    type: 'linear' | 'exponential' | 'branching' | 'milestone';
    requirements: Record<string, any>;
    advancement: Record<string, any>;
  };
}

const MagicSystemsManager: React.FC<MagicSystemsManagerProps> = ({ className }) => {
  const [magicTemplates, setMagicTemplates] = useState<IpsumTemplate[]>([]);
  const [magicInstances, setMagicInstances] = useState<TemplateInstanceWithTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<IpsumTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('templates');

  // Form states
  const [templateForm, setTemplateForm] = useState<Partial<IpsumTemplate & { metadata: MagicSystemMetadata }>>({
    name: '',
    description: '',
    type: 'magic_system',
    tags: [],
    metadata: {
      source: 'aetheric',
      structure: 'school-based',
      rules: {},
      abilities: [],
      progression: {
        type: 'linear',
        requirements: {},
        advancement: {}
      }
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [templatesResult, allInstances] = await Promise.all([
        ipsumariumService.getByType('magic_system'),
        templateInstanceService.getAll()
      ]);

      // Filter instances to only show magic system instances
      const magicInstances = allInstances.filter(
        instance => instance.template.type === 'magic_system'
      );

      setMagicTemplates(templatesResult);
      setMagicInstances(magicInstances);
    } catch (error) {
      console.error('Error loading magic systems data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMagicTemplate = async () => {
    try {
      console.log('Saving template:', templateForm);
      
      // Validate required fields
      if (!templateForm.name || !templateForm.description) {
        console.error('Missing required fields');
        alert('Please fill in name and description');
        return;
      }
      
      if (editingTemplate) {
        console.log('Updating template:', editingTemplate.id);
        await ipsumariumService.update(editingTemplate.id, templateForm as Partial<IpsumTemplate>);
      } else {
        console.log('Creating new template with data:', {
          name: templateForm.name,
          description: templateForm.description,
          type: templateForm.type,
          tags: templateForm.tags,
          metadata: templateForm.metadata
        });
        
        const result = await ipsumariumService.create({
          name: templateForm.name,
          description: templateForm.description,
          type: 'magic_system',
          tags: templateForm.tags || [],
          metadata: {
            source: templateForm.metadata?.source || 'aetheric',
            structure: templateForm.metadata?.structure || 'school-based',
            rules: templateForm.metadata?.rules || {},
            abilities: templateForm.metadata?.abilities || [],
            progression: templateForm.metadata?.progression || {
              type: 'linear',
              requirements: {},
              advancement: {}
            }
          }
        });
        
        console.log('Create result:', result);
      }
      
      setEditingTemplate(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving magic template:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      alert('Failed to save template. Check console for details.');
    }
  };

  const editTemplate = (template: IpsumTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      ...template,
      metadata: template.metadata as MagicSystemMetadata
    });
  };

  const deleteTemplate = async (id: string) => {
    try {
      await ipsumariumService.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting magic template:', error);
    }
  };

  const createInstance = async (template: IpsumTemplate) => {
    try {
      await templateInstanceService.create({
        templateId: template.id,
        name: `${template.name} Instance`,
        description: `Instance of ${template.name}`,
        instanceData: {
          powerLevel: 1,
          localRulesModifications: {},
          practitionerPopulation: 0,
          culturalIntegrationLevel: 'unknown' as const,
          associatedCharacters: []
        }
      });
      loadData();
    } catch (error) {
      console.error('Error creating magic instance:', error);
    }
  };

  const resetForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      type: 'magic_system',
      tags: [],
      metadata: {
        source: 'aetheric',
        structure: 'school-based',
        rules: {},
        abilities: [],
        progression: {
          type: 'linear',
          requirements: {},
          advancement: {}
        }
      }
    });
  };

  const addTag = (value: string) => {
    if (!value.trim()) return;
    setTemplateForm(prev => ({
      ...prev,
      tags: [...(prev.tags || []), value.trim()]
    }));
  };

  const removeTag = (index: number) => {
    setTemplateForm(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  const updateMetadata = (key: keyof MagicSystemMetadata, value: any) => {
    setTemplateForm(prev => ({
      ...prev,
      metadata: {
        source: prev.metadata?.source || 'aetheric',
        structure: prev.metadata?.structure || 'school-based',
        rules: prev.metadata?.rules || {},
        abilities: prev.metadata?.abilities || [],
        progression: prev.metadata?.progression || {
          type: 'linear',
          requirements: {},
          advancement: {}
        },
        ...prev.metadata,
        [key]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-lg">Loading magic systems...</div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wand2 className="h-8 w-8" />
            Magic Systems Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Create templates and instances for magical systems in the Ipsumarium
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Magic Templates ({magicTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="instances" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Active Instances ({magicInstances.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Templates List */}
            <div className="glass-panel rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-glyph-bright">Magic System Templates</h2>
                <p className="text-glyph-accent mt-1">
                  Reusable magical frameworks for the Ipsumarium
                </p>
              </div>
              <div className="space-y-4">
                {magicTemplates.map((template) => {
                  const metadata = template.metadata as MagicSystemMetadata;
                  return (
                    <div key={template.id} className="glass-panel p-4 rounded-lg hover:border-circuit-energy/50 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-glyph-bright">{template.name}</h3>
                          <p className="text-sm text-glyph-accent mt-1">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 rounded-full bg-circuit-energy/20 text-circuit-energy text-xs">{metadata.source}</span>
                            <span className="px-2 py-1 rounded-full bg-circuit-magic/20 text-circuit-magic text-xs">{metadata.structure}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-0.5 rounded-full bg-cosmic-light/20 text-glyph-accent text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => createInstance(template)}
                            title="Create Instance"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <div className="flex gap-2">
                            <button
                              className="p-2 rounded-lg hover:bg-cosmic-medium transition-colors text-glyph-accent hover:text-glyph-bright"
                              onClick={() => editTemplate(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg hover:bg-cosmic-medium transition-colors text-glyph-accent hover:text-flame-orange"
                              onClick={() => deleteTemplate(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  className="w-full px-4 py-2 rounded-lg border border-cosmic-light text-glyph-accent hover:text-glyph-bright hover:bg-cosmic-medium transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    setEditingTemplate(null);
                    resetForm();
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Magic Template</span>
                </button>
              </div>
            </div>

            {/* Template Form */}
            <div className="glass-panel rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-glyph-bright">
                  {editingTemplate ? 'Edit Magic Template' : 'Create Magic Template'}
                </h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="template-name" className="text-sm font-medium text-glyph-bright">Name</label>
                  <input
                    className="w-full px-3 py-2 bg-cosmic-medium border border-cosmic-light rounded-lg text-glyph-primary placeholder:text-glyph-secondary focus:outline-none focus:border-circuit-energy transition-colors"
                    id="template-name"
                    value={templateForm.name || ''}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Aetheric Manipulation"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="template-description" className="text-sm font-medium text-glyph-bright">Description</label>
                  <textarea
                    className="w-full px-3 py-2 bg-cosmic-medium border border-cosmic-light rounded-lg text-glyph-primary placeholder:text-glyph-secondary focus:outline-none focus:border-circuit-energy transition-colors resize-none"
                    id="template-description"
                    value={templateForm.description || ''}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the magic system..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Source Selection */}
                  <div className="space-y-2">
                    <label htmlFor="source" className="text-sm font-medium text-glyph-bright">Source</label>
                    <Select
                      value={templateForm.metadata?.source || 'aetheric'}
                      onValueChange={(value) => updateMetadata('source', value)}
                    >
                      <SelectTrigger id="source" className="w-full px-3 py-2 bg-cosmic-medium border border-cosmic-light rounded-lg text-glyph-primary">
                        <SelectValue placeholder="Select source type" />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-deep border border-cosmic-light">
                        <SelectItem value="aetheric">Aetheric</SelectItem>
                        <SelectItem value="divine">Divine</SelectItem>
                        <SelectItem value="ritual">Ritual</SelectItem>
                        <SelectItem value="innate">Innate</SelectItem>
                        <SelectItem value="technological">Technological</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Structure Selection */}
                  <div className="space-y-2">
                    <label htmlFor="structure" className="text-sm font-medium text-glyph-bright">Structure</label>
                    <Select
                      value={templateForm.metadata?.structure || 'school-based'}
                      onValueChange={(value) => updateMetadata('structure', value)}
                    >
                      <SelectTrigger id="structure" className="w-full px-3 py-2 bg-cosmic-medium border border-cosmic-light rounded-lg text-glyph-primary">
                        <SelectValue placeholder="Select structure type" />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-deep border border-cosmic-light">
                        <SelectItem value="school-based">School-based</SelectItem>
                        <SelectItem value="domain-based">Domain-based</SelectItem>
                        <SelectItem value="freeform">Freeform</SelectItem>
                        <SelectItem value="hierarchical">Hierarchical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-glyph-bright">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {templateForm.tags?.map((tag, index) => (
                      <span key={index} className="px-2 py-1 rounded-full bg-circuit-energy/20 text-circuit-energy text-xs flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-flame-orange"
                          onClick={() => removeTag(index)}
                        />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-3 py-2 bg-cosmic-medium border border-cosmic-light rounded-lg text-glyph-primary placeholder:text-glyph-secondary focus:outline-none focus:border-circuit-energy transition-colors"
                      placeholder="Add tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={saveMagicTemplate}
                    className="flex-1 px-4 py-2 rounded-lg bg-circuit-energy hover:bg-circuit-energy/80 text-cosmic-deepest font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingTemplate ? 'Update' : 'Create'} Template
                  </button>
                  {editingTemplate && (
                    <button
                      onClick={() => {
                        setEditingTemplate(null);
                        resetForm();
                      }}
                      className="px-4 py-2 rounded-lg border border-cosmic-light hover:bg-cosmic-medium text-glyph-accent hover:text-glyph-bright transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Magic System Instances</CardTitle>
              <CardDescription>
                Active magical systems deployed across realities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {magicInstances.map((instance) => (
                <Card key={instance.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-glyph-bright">{instance.name}</h3>
                      <p className="text-sm text-glyph-accent mt-1">
                        {instance.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">Template: {instance.template?.name}</Badge>
                        <Badge variant="secondary">
                          Level: {(instance.instanceData as any)?.powerLevel || 1}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {magicInstances.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No magic system instances yet. Create instances from templates above.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MagicSystemsManager;