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
    type: 'magic',
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
      const [templatesResult, instancesResult] = await Promise.all([
        ipsumariumService.getByType('magic'),
        templateInstanceService.getByType('magic')
      ]);

      setMagicTemplates(templatesResult);
      setMagicInstances(instancesResult);
    } catch (error) {
      console.error('Error loading magic systems data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMagicTemplate = async () => {
    try {
      if (editingTemplate) {
        await ipsumariumService.update(editingTemplate.id, templateForm as Partial<IpsumTemplate>);
      } else {
        await ipsumariumService.create(templateForm as Omit<IpsumTemplate, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      setEditingTemplate(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving magic template:', error);
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
      type: 'magic',
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
        ...prev.metadata!,
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
            <Card>
              <CardHeader>
                <CardTitle>Magic System Templates</CardTitle>
                <CardDescription>
                  Reusable magical frameworks for the Ipsumarium
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {magicTemplates.map((template) => {
                  const metadata = template.metadata as MagicSystemMetadata;
                  return (
                    <Card key={template.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{metadata.source}</Badge>
                            <Badge variant="secondary">{metadata.structure}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                <Button
                  onClick={() => {
                    setEditingTemplate(null);
                    resetForm();
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Magic Template
                </Button>
              </CardContent>
            </Card>

            {/* Template Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingTemplate ? 'Edit Magic Template' : 'New Magic Template'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Name</Label>
                  <Input
                    id="template-name"
                    value={templateForm.name || ''}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Aetheric Manipulation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={templateForm.description || ''}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the magic system..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-source">Source</Label>
                    <Select
                      value={templateForm.metadata?.source || ''}
                      onValueChange={(value) => updateMetadata('source', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aetheric">Aetheric</SelectItem>
                        <SelectItem value="divine">Divine</SelectItem>
                        <SelectItem value="ritual">Ritual</SelectItem>
                        <SelectItem value="innate">Innate</SelectItem>
                        <SelectItem value="technological">Technological</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="system-structure">Structure</Label>
                    <Select
                      value={templateForm.metadata?.structure || ''}
                      onValueChange={(value) => updateMetadata('structure', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select structure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="school-based">School-based</SelectItem>
                        <SelectItem value="domain-based">Domain-based</SelectItem>
                        <SelectItem value="freeform">Freeform</SelectItem>
                        <SelectItem value="hierarchical">Hierarchical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {templateForm.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveMagicTemplate} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingTemplate ? 'Update' : 'Create'} Template
                  </Button>
                  {editingTemplate && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingTemplate(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
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
                      <h3 className="font-semibold">{instance.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
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