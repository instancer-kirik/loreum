// Import magic-related types
import { 
  MagicSystem, 
  MagicDiscipline, 
  Enchantment, 
  MagicalItemProperties,
  MagicTechDomain,
  MagicTechnology
} from './MagicTypes';

// Export magic types
export type { 
  MagicSystem, 
  MagicDiscipline, 
  Enchantment, 
  MagicalItemProperties,
  MagicTechDomain,
  MagicTechnology
};

// Core hierarchy types based on Loreum design
export interface Multiverse {
  id: string;
  name: string;
  description: string;
  universes: Universe[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Universe {
  id: string;
  name: string;
  description: string;
  physicalLaws: PhysicalLaws;
  timelines: Timeline[];
  multiverseId: string;
}

export interface PhysicalLaws {
  id: string;
  name: string;
  description: string;
  constants: Record<string, number>;
  magicSystemsAllowed: boolean;
  technologyLimits: string[];
}

export interface Timeline {
  id: string;
  name: string;
  description: string;
  startYear: number;
  endYear: number | null;
  worlds: World[];
  universeId: string;
  forkPoint?: {
    parentTimelineId: string;
    divergenceYear: number;
    divergenceEvent: string;
  };
}

export interface World {
  id: string;
  name: string;
  description: string;
  type: 'planet' | 'ringworld' | 'dyson_sphere' | 'habitat' | 'station' | 'other';
  civilizations: Civilization[];
  regions: Region[];
  timelineId: string;
}

// Ipsumarium - Template/Canonical entities
export interface IpsumTemplate {
  id: string;
  name: string;
  description: string;
  type: 'species' | 'tech' | 'item' | 'magic' | 'power' | 'vehicle' | 'starship' | 'culture' | 'civilization';
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpeciesTemplate extends IpsumTemplate {
  type: 'species';
  biology: string;
  traits: string[];
  averageLifespan: number;
  reproductionMethod: string;
  socialStructure: string;
  intelligence: number; // 0-100 scale
  physicalCapabilities: Record<string, number>;
}

export interface TechTemplate extends IpsumTemplate {
  type: 'tech';
  tier: number;
  energyType: string;
  dependencies: string[];
  effects: TechEffect[];
  discoveryDifficulty: number;
  implementationCost: number;
}

export interface ItemTemplate extends IpsumTemplate {
  type: 'item';
  category: string;
  subcategory: string;
  rarity: string;
  durability: number;
  manufacturingCost: number;
  energyRequirements: number;
  materials: string[];
  effects: string[];
  magicalProperties?: MagicalItemProperties;
}

// Navigation structure types
export type NavigationLevel = 'multiverse' | 'universe' | 'timeline' | 'world' | 'civilization' | 'ipsumarium' | 'characters' | 'lore' | 'astraloom' | 'narrative' | 'artboard' | 'config';

export interface NavigationContext {
  level: NavigationLevel;
  multiverseId?: string;
  universeId?: string;
  timelineId?: string;
  worldId?: string;
  civilizationId?: string;
}

// Adding the new item-related types at the top
export interface TechItem {
  id: string;
  name: string;
  description: string;
  tech_tier: string;
  energy_type: string;
  category: string;
  subcategory: string;
  type: string;
  rarity: string;
  durability: number;
  manufacturing_cost: number;
  lore_notes: string;
  origin_faction: string;
  function_script: string;
  icon: string;
  image_3d: string;
  historical_era: string;
  cultural_significance: string;
  discovery_location: string;
  related_lore_entries: string[];
  required_slots: {
    type: string;
    class?: string;
    signature?: string;
    interface?: string;
  };
  power_draw_priority: string;
  crew_requirement: {
    skill: string;
    level: number;
    count: number;
    specialization?: string;
  };
  maintenance_schedule: string;
  preferred_backpack_modes: string[];
  environmental_sensitivities: string[];
  legal_status: Record<string, string>;
  status_effects: Array<{
    effect_id: string;
    [key: string]: any;
    type: string;
  }>;
  crafting_recipe_id: string;
  deconstruct_yield: Array<{
    item_id: string;
    quantity: number;
  }>;
  research_prerequisites: string[];
  variant_of: string | null;
  tech_tags: string[];
  materials: string[];
  effects: string[];
  compatibility_tags: string[];
  // Magic-related properties
  magical_properties?: MagicalItemProperties;
  inventory_properties: {
    stack_size: number;
    max_stack_size: number;
    slot_size: [number, number];
    slot_type: string;
    weight_kg: number;
    volume_l: number;
    [key: string]: any;
  };
  energy_profile: {
    type: string;
    input_energy: string;
    output: string;
    base_energy: number;
    energy_drain: number;
    peak_energy: number;
    modifiers: string[];
    [key: string]: any;
  };
  thermal_profile: {
    sensitive: boolean;
    operating_range_c: [number, number];
    failure_temp_c: number;
    cooling_required: boolean;
    [key: string]: any;
  };
  resonance_profile: {
    frequency_hz: number;
    resonance_type: string;
    resonant_modes: string[];
    [key: string]: any;
  };
  compute_model: {
    function_id: string;
    params: Record<string, any>;
  };
  blueprint: {
    recipe_json: {
      input_materials: Array<{
        item_id: string;
        quantity: number;
      }>;
      [key: string]: any;
      output_quantity: number;
    };
    manufacture_time: number;
    rarity: string;
    crafting_time_modifier: number;
    required_tools_or_facilities: string[];
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  civilizations: Civilization[];
  techTrees: TechTree[];
  loreElements: LoreElement[];
  regions: Region[];
  planetaryStructures: PlanetaryStructure[];
  cultures: Culture[];
  narratives: Narrative[];
  items: ModularItem[];
  magicSystems?: MagicSystem[]; // Magic systems in this project
  enchantments?: Enchantment[]; // Enchantments available
  timelineStart: number; // Year
  timelineEnd: number; // Year
}

export interface Civilization {
  id: string;
  name: string;
  description: string;
  species: Species[];
  governments: Government[];
  socialStructures: SocialStructure[];
  eras: HistoricalEra[];
  populationDynamics: PopulationDynamics;
}

export interface Species {
  id: string;
  name: string;
  description: string;
  traits: string[];
  biology: string;
  origin: string;
}

export interface Government {
  id: string;
  name: string;
  description: string;
  type: string;
  structure: string;
  leaders: string[];
  startYear: number;
  endYear: number | null;
}

export interface SocialStructure {
  id: string;
  name: string;
  description: string;
  classes: SocialClass[];
}

export interface SocialClass {
  id: string;
  name: string;
  description: string;
  privileges: string[];
  responsibilities: string[];
}

export interface HistoricalEra {
  id: string;
  name: string;
  description: string;
  startYear: number;
  endYear: number | null;
  keyEvents: string[];
}

export interface PopulationDynamics {
  id: string;
  initialPopulation: number;
  growthRate: number;
  migrations: Migration[];
}

export interface Migration {
  id: string;
  fromRegionId: string;
  toRegionId: string;
  year: number;
  population: number;
  reason: string;
}

export interface TechTree {
  id: string;
  name: string;
  description: string;
  domains: TechDomain[];
  // Can include magic domains
  magicDomains?: MagicTechDomain[];
  // Is this tech tree magical in nature
  isMagical?: boolean;
}

export interface TechDomain {
  id: string;
  name: string;
  description: string;
  technologies: Technology[];
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  cost: number;
  discoveryYear: number | null;
  dependencies: string[]; // IDs of prerequisite technologies
  effects: TechEffect[];
  // If this technology has magical aspects
  magicalProperties?: MagicTechnology;
}

export interface TechEffect {
  id: string;
  description: string;
  affectedAreas: string[];
  magnitude: number;
}

export interface LoreElement {
  id: string;
  name: string;
  description: string;
  type: 'artifact' | 'event' | 'character' | 'myth' | 'ideology';
  connections: LoreConnection[];
  year: number | null;
}

export interface LoreConnection {
  id: string;
  targetId: string;
  relationshipType: string;
  description: string;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  terrain: TerrainType[];
  climate: ClimateType;
  resources: Resource[];
  settlements: Settlement[];
  conflicts: Conflict[];
  area: number; // in square km
  coordinates: Coordinates;
}

export interface TerrainType {
  id: string;
  name: string;
  description: string;
  percentage: number; // 0-100
}

export type ClimateType = 'arctic' | 'subarctic' | 'temperate' | 'subtropical' | 'tropical' | 'desert' | 'mountain';

export interface Resource {
  id: string;
  name: string;
  description: string;
  type: 'mineral' | 'flora' | 'fauna' | 'energy' | 'magical';
  abundance: number; // 0-100
}

export interface Settlement {
  id: string;
  name: string;
  description: string;
  type: 'village' | 'town' | 'city' | 'metropolis' | 'outpost' | 'fortress';
  population: number;
  foundingYear: number;
  abandonmentYear: number | null;
  coordinates: Coordinates;
}

export interface Conflict {
  id: string;
  name: string;
  description: string;
  parties: string[]; // IDs of civilizations/factions involved
  startYear: number;
  endYear: number | null;
  outcome: string;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface PlanetaryStructure {
  id: string;
  name: string;
  description: string;
  type: 'planet' | 'moon' | 'ringworld' | 'dyson_sphere' | 'habitat' | 'station';
  diameter: number; // in km
  habitableArea: number; // in square km
  gravity: number; // relative to Earth
  atmosphere: string;
  technology: string[];
}

export interface Culture {
  id: string;
  name: string;
  description: string;
  fashions: Fashion[];
  architecture: ArchitecturalStyle[];
  rituals: Ritual[];
  cuisine: CuisineStyle[];
  arts: ArtForm[];
}

export interface Fashion {
  id: string;
  name: string;
  description: string;
  materials: string[];
  socialClass: string;
  climate: ClimateType[];
  era: string; // ID of historical era
}

export interface ArchitecturalStyle {
  id: string;
  name: string;
  description: string;
  materials: string[];
  technicalRequirements: string[];
  climateAdaptation: ClimateType[];
}

export interface Ritual {
  id: string;
  name: string;
  description: string;
  purpose: string;
  participants: string;
  frequency: string;
}

export interface CuisineStyle {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  techniques: string[];
  culturalSignificance: string;
}

export interface ArtForm {
  id: string;
  name: string;
  description: string;
  materials: string[];
  techniques: string[];
  themes: string[];
}

export interface Narrative {
  id: string;
  name: string;
  description: string;
  events: HistoricalEvent[];
  arcs: NarrativeArc[];
}

export interface HistoricalEvent {
  id: string;
  name: string;
  description: string;
  year: number;
  participants: string[]; // IDs of civilizations/characters
  impact: string;
  causes: string[]; // IDs of previous events
  effects: string[]; // IDs of subsequent events
}

export interface NarrativeArc {
  id: string;
  name: string;
  description: string;
  events: string[]; // IDs of events
  startYear: number;
  endYear: number | null;
  theme: string;
}

export interface ModularItem {
  id: string;
  name: string;
  description: string;
  type: 'item' | 'building' | 'tool' | 'weapon' | 'vehicle' | 'artifact' | 'magical' | 'enchanted';
  tags: string[];
  abilities: string[];
  energyRequirements: number;
  origin: string; // ID of civilization or region
  yearCreated: number;
  materials: string[];
  // For magical items
  enchantments?: string[]; // IDs of enchantments
  magicalProperties?: MagicalItemProperties; // Magic-specific properties
  metadata: Record<string, any>; // Flexible schema for custom properties
}

// Character types
export interface Character {
  id: string;
  name: string;
  description: string;
  species: string; // Reference to species template
  birthYear: number;
  deathYear?: number;
  affiliations: string[]; // Civilization/faction IDs
  relationships: CharacterRelationship[];
  abilities: string[];
  equipment: string[]; // Item IDs
  voiceProfile?: VoiceProfile;
  narrativeRoles: string[];
  tags: string[];
}

export interface CharacterRelationship {
  id: string;
  targetCharacterId: string;
  relationshipType: string;
  description: string;
  startYear: number;
  endYear?: number;
}

export interface VoiceProfile {
  id: string;
  actorName?: string;
  voiceDescription: string;
  speechPatterns: string[];
  catchphrases: string[];
  languageStyle: string;
}

// Template Instance types
export interface TemplateInstance {
  id: string;
  templateId: string;
  instanceName: string;
  instanceDescription?: string;
  
  // Context hierarchy
  multiverseId?: string;
  universeId?: string;
  timelineId?: string;
  worldId?: string;
  civilizationId?: string;
  
  // Local variations
  localVariations: Record<string, any>;
  overrideMetadata: Record<string, any>;
  
  // Instance properties
  tags: string[];
  status: 'active' | 'inactive' | 'deprecated';
  notes?: string;
  
  // Relationships
  createdByCharacterId?: string;
  discoveredYear?: number;
  originLocation?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface SpeciesInstance {
  id: string;
  templateInstanceId: string;
  localPopulation: number;
  adaptationTraits: string[];
  culturalModifications: string[];
  environmentalAdaptations: Record<string, any>;
  primaryCivilizationId?: string;
  homeworldRegionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnologyInstance {
  id: string;
  templateInstanceId: string;
  developmentLevel: number;
  implementationDate?: number;
  localModifications: string[];
  efficiencyRating: number;
  developedByCivilizationId?: string;
  prerequisiteTechInstances: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemInstance {
  id: string;
  templateInstanceId: string;
  conditionRating: number;
  quantity: number;
  currentLocation?: string;
  ownershipHistory: Array<{
    ownerId: string;
    ownerType: 'character' | 'civilization';
    startDate: number;
    endDate?: number;
    notes?: string;
  }>;
  appliedEnchantments: string[];
  physicalModifications: string[];
  currentOwnerCharacterId?: string;
  currentOwnerCivilizationId?: string;
  createdByCivilizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MagicSystemInstance {
  id: string;
  templateInstanceId: string;
  powerLevel: number;
  localRulesModifications: Record<string, any>;
  practitionerPopulation: number;
  culturalIntegrationLevel: 'unknown' | 'forbidden' | 'rare' | 'common' | 'integrated' | 'dominant';
  primaryCivilizationId?: string;
  associatedCharacters: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CultureInstance {
  id: string;
  templateInstanceId: string;
  populationInfluence: number;
  dominantSpecies: string[];
  regionalVariations: Record<string, any>;
  historicalEvolution: Array<{
    year: number;
    change: string;
    cause: string;
  }>;
  primaryCivilizationId: string;
  influentialRegions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateInstanceRelationship {
  id: string;
  sourceInstanceId: string;
  targetInstanceId: string;
  relationshipType: string;
  relationshipStrength: number;
  description?: string;
  establishedYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateInstanceWithTemplate extends TemplateInstance {
  template: IpsumTemplate;
  multiverseName?: string;
  universeName?: string;
  timelineName?: string;
  worldName?: string;
  civilizationName?: string;
}

// Lore Graph types
export interface LoreNode {
  id: string;
  name: string;
  description: string;
  type: 'event' | 'character' | 'artifact' | 'ideology' | 'location' | 'technology' | 'species';
  year?: number;
  connections: LoreConnection[];
  causality: CausalityInfo;
}

export interface CausalityInfo {
  causes: string[]; // Node IDs that caused this
  effects: string[]; // Node IDs this caused
  probability: number; // 0-1 likelihood this occurred
  rippleEffects: RippleEffect[];
}

export interface RippleEffect {
  id: string;
  targetNodeId: string;
  delay: number; // Years after original event
  magnitude: number; // 0-1 strength of effect
  description: string;
}

// Astraloom types
export interface StarSystem {
  id: string;
  name: string;
  description: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  starType: string;
  planets: Planet[];
  travelRoutes: TravelRoute[];
  controllingFaction?: string;
}

export interface Planet {
  id: string;
  name: string;
  description: string;
  type: 'terrestrial' | 'gas_giant' | 'ice_world' | 'desert' | 'ocean' | 'artificial';
  habitability: number; // 0-1 scale
  population?: number;
  resources: Resource[];
  settlements: Settlement[];
}

export interface TravelRoute {
  id: string;
  name: string;
  fromSystemId: string;
  toSystemId: string;
  distance: number; // Light years
  travelTime: number; // Standard time units
  hazards: string[];
  controllingFaction?: string;
}