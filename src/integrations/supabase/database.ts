import { supabase } from './client';
import { Database } from './types';
import { 
  Multiverse, 
  Universe, 
  Timeline, 
  World, 
  Civilization, 
  Region, 
  Character, 
  IpsumTemplate,
  Species,
  Government,
  TechTree,
  LoreNode,
  StarSystem
} from '../../types';

type Tables = Database['public']['Tables'];

// Multiverse operations
export const multiverseService = {
  async getAll(): Promise<Multiverse[]> {
    const { data, error } = await supabase
      .from('loreum_multiverses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      universes: [], // Will be loaded separately
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  },

  async getById(id: string): Promise<Multiverse | null> {
    const { data, error } = await supabase
      .from('loreum_multiverses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      universes: [], // Will be loaded separately
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  async create(multiverse: Omit<Multiverse, 'id' | 'createdAt' | 'updatedAt' | 'universes'>): Promise<Multiverse> {
    const { data, error } = await supabase
      .from('loreum_multiverses')
      .insert({
        name: multiverse.name,
        description: multiverse.description
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      universes: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  async update(id: string, updates: Partial<Multiverse>): Promise<Multiverse> {
    const { data, error } = await supabase
      .from('loreum_multiverses')
      .update({
        name: updates.name,
        description: updates.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      universes: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('loreum_multiverses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Universe operations
export const universeService = {
  async getByMultiverseId(multiverseId: string): Promise<Universe[]> {
    const { data, error } = await supabase
      .from('loreum_universes')
      .select('*')
      .eq('multiverse_id', multiverseId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      physicalLaws: row.physical_laws as any,
      timelines: [], // Will be loaded separately
      multiverseId: row.multiverse_id
    }));
  },

  async create(universe: Omit<Universe, 'id' | 'timelines'>): Promise<Universe> {
    const { data, error } = await supabase
      .from('loreum_universes')
      .insert({
        name: universe.name,
        description: universe.description,
        multiverse_id: universe.multiverseId,
        physical_laws: universe.physicalLaws
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      physicalLaws: data.physical_laws as any,
      timelines: [],
      multiverseId: data.multiverse_id
    };
  }
};

// Timeline operations
export const timelineService = {
  async getByUniverseId(universeId: string): Promise<Timeline[]> {
    const { data, error } = await supabase
      .from('loreum_timelines')
      .select('*')
      .eq('universe_id', universeId)
      .order('start_year', { ascending: true });
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      startYear: row.start_year,
      endYear: row.end_year,
      worlds: [], // Will be loaded separately
      universeId: row.universe_id,
      forkPoint: row.fork_point as any
    }));
  },

  async create(timeline: Omit<Timeline, 'id' | 'worlds'>): Promise<Timeline> {
    const { data, error } = await supabase
      .from('loreum_timelines')
      .insert({
        name: timeline.name,
        description: timeline.description,
        universe_id: timeline.universeId,
        start_year: timeline.startYear,
        end_year: timeline.endYear,
        fork_point: timeline.forkPoint
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      startYear: data.start_year,
      endYear: data.end_year,
      worlds: [],
      universeId: data.universe_id,
      forkPoint: data.fork_point as any
    };
  }
};

// World operations
export const worldService = {
  async getByTimelineId(timelineId: string): Promise<World[]> {
    const { data, error } = await supabase
      .from('loreum_worlds')
      .select('*')
      .eq('timeline_id', timelineId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as any,
      civilizations: [], // Will be loaded separately
      regions: [], // Will be loaded separately
      timelineId: row.timeline_id
    }));
  },

  async create(world: Omit<World, 'id' | 'civilizations' | 'regions'>): Promise<World> {
    const { data, error } = await supabase
      .from('loreum_worlds')
      .insert({
        name: world.name,
        description: world.description,
        timeline_id: world.timelineId,
        type: world.type
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type as any,
      civilizations: [],
      regions: [],
      timelineId: data.timeline_id
    };
  }
};

// Civilization operations
export const civilizationService = {
  async getByWorldId(worldId: string): Promise<Civilization[]> {
    const { data, error } = await supabase
      .from('loreum_civilizations')
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      species: [], // Will be loaded separately
      governments: [], // Will be loaded separately
      socialStructures: [], // Will be loaded separately
      eras: [], // Will be loaded separately
      populationDynamics: row.population_dynamics as any
    }));
  },

  async create(civilization: Omit<Civilization, 'id' | 'species' | 'governments' | 'socialStructures' | 'eras'>, worldId: string): Promise<Civilization> {
    const { data, error } = await supabase
      .from('loreum_civilizations')
      .insert({
        name: civilization.name,
        description: civilization.description,
        world_id: worldId,
        population_dynamics: civilization.populationDynamics
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      species: [],
      governments: [],
      socialStructures: [],
      eras: [],
      populationDynamics: data.population_dynamics as any
    };
  }
};

// Region operations
export const regionService = {
  async getByWorldId(worldId: string): Promise<Region[]> {
    const { data, error } = await supabase
      .from('loreum_regions')
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      terrain: row.terrain as any,
      climate: row.climate as any,
      resources: row.resources as any,
      settlements: [], // Will be loaded separately
      conflicts: [], // Will be loaded separately
      area: row.area,
      coordinates: row.coordinates as any
    }));
  },

  async create(region: Omit<Region, 'id' | 'settlements' | 'conflicts'>, worldId: string): Promise<Region> {
    const { data, error } = await supabase
      .from('loreum_regions')
      .insert({
        name: region.name,
        description: region.description,
        world_id: worldId,
        terrain: region.terrain,
        climate: region.climate,
        resources: region.resources,
        area: region.area,
        coordinates: region.coordinates
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      terrain: data.terrain as any,
      climate: data.climate as any,
      resources: data.resources as any,
      settlements: [],
      conflicts: [],
      area: data.area,
      coordinates: data.coordinates as any
    };
  }
};

// Character operations
export const characterService = {
  async getAll(): Promise<Character[]> {
    const { data, error } = await supabase
      .from('loreum_characters')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      species: row.species,
      birthYear: row.birth_year,
      deathYear: row.death_year,
      affiliations: row.affiliations,
      relationships: row.relationships as any,
      abilities: row.abilities,
      equipment: row.equipment,
      voiceProfile: row.voice_profile as any,
      narrativeRoles: row.narrative_roles,
      tags: row.tags
    }));
  },

  async create(character: Omit<Character, 'id'>): Promise<Character> {
    const { data, error } = await supabase
      .from('loreum_characters')
      .insert({
        name: character.name,
        description: character.description,
        species: character.species,
        birth_year: character.birthYear,
        death_year: character.deathYear,
        affiliations: character.affiliations,
        relationships: character.relationships,
        abilities: character.abilities,
        equipment: character.equipment,
        voice_profile: character.voiceProfile,
        narrative_roles: character.narrativeRoles,
        tags: character.tags
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      species: data.species,
      birthYear: data.birth_year,
      deathYear: data.death_year,
      affiliations: data.affiliations,
      relationships: data.relationships as any,
      abilities: data.abilities,
      equipment: data.equipment,
      voiceProfile: data.voice_profile as any,
      narrativeRoles: data.narrative_roles,
      tags: data.tags
    };
  }
};

// Ipsumarium operations
export const ipsumariumService = {
  async getAll(): Promise<IpsumTemplate[]> {
    const { data, error } = await supabase
      .from('loreum_ipsumarium_templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as any,
      tags: row.tags,
      metadata: row.metadata as any,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  },

  async getByType(type: string): Promise<IpsumTemplate[]> {
    const { data, error } = await supabase
      .from('loreum_ipsumarium_templates')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as any,
      tags: row.tags,
      metadata: row.metadata as any,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  },

  async create(template: Omit<IpsumTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<IpsumTemplate> {
    const { data, error } = await supabase
      .from('loreum_ipsumarium_templates')
      .insert({
        name: template.name,
        description: template.description,
        type: template.type,
        tags: template.tags,
        metadata: template.metadata
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type as any,
      tags: data.tags,
      metadata: data.metadata as any,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
};

// Utility function to create a complete hierarchy
export const hierarchyService = {
  async createCompleteHierarchy(data: {
    multiverseName: string;
    multiverseDescription: string;
    universeName: string;
    universeDescription: string;
    timelineName: string;
    timelineDescription: string;
    timelineStartYear: number;
    timelineEndYear?: number;
    worldName: string;
    worldDescription: string;
    worldType: string;
  }) {
    // Create multiverse
    const multiverse = await multiverseService.create({
      name: data.multiverseName,
      description: data.multiverseDescription
    });

    // Create universe
    const universe = await universeService.create({
      name: data.universeName,
      description: data.universeDescription,
      multiverseId: multiverse.id,
      physicalLaws: {
        id: 'default',
        name: 'Standard Physics',
        description: 'Standard physical laws',
        constants: {},
        magicSystemsAllowed: false,
        technologyLimits: []
      }
    });

    // Create timeline
    const timeline = await timelineService.create({
      name: data.timelineName,
      description: data.timelineDescription,
      universeId: universe.id,
      startYear: data.timelineStartYear,
      endYear: data.timelineEndYear
    });

    // Create world
    const world = await worldService.create({
      name: data.worldName,
      description: data.worldDescription,
      timelineId: timeline.id,
      type: data.worldType as any
    });

    return {
      multiverse,
      universe,
      timeline,
      world
    };
  }
};

// All services are already exported individually above