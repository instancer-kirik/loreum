-- Create Loreum Database Schema
-- This script creates all the necessary tables for the Loreum worldbuilding system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Multiverses table
CREATE TABLE IF NOT EXISTS loreum_multiverses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Universes table
CREATE TABLE IF NOT EXISTS loreum_universes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    multiverse_id UUID NOT NULL REFERENCES loreum_multiverses(id) ON DELETE CASCADE,
    physical_laws JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Timelines table
CREATE TABLE IF NOT EXISTS loreum_timelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    universe_id UUID NOT NULL REFERENCES loreum_universes(id) ON DELETE CASCADE,
    start_year INTEGER NOT NULL,
    end_year INTEGER,
    fork_point JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Worlds table
CREATE TABLE IF NOT EXISTS loreum_worlds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    timeline_id UUID NOT NULL REFERENCES loreum_timelines(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('planet', 'ringworld', 'dyson_sphere', 'habitat', 'station', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Civilizations table
CREATE TABLE IF NOT EXISTS loreum_civilizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    world_id UUID NOT NULL REFERENCES loreum_worlds(id) ON DELETE CASCADE,
    population_dynamics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Regions table
CREATE TABLE IF NOT EXISTS loreum_regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    world_id UUID NOT NULL REFERENCES loreum_worlds(id) ON DELETE CASCADE,
    terrain JSONB DEFAULT '[]',
    climate TEXT NOT NULL,
    resources JSONB DEFAULT '[]',
    area NUMERIC NOT NULL,
    coordinates JSONB DEFAULT '{"x": 0, "y": 0}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Characters table
CREATE TABLE IF NOT EXISTS loreum_characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    species TEXT NOT NULL,
    birth_year INTEGER NOT NULL,
    death_year INTEGER,
    affiliations TEXT[] DEFAULT '{}',
    relationships JSONB DEFAULT '[]',
    abilities TEXT[] DEFAULT '{}',
    equipment TEXT[] DEFAULT '{}',
    voice_profile JSONB,
    narrative_roles TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Ipsumarium Templates table
CREATE TABLE IF NOT EXISTS loreum_ipsumarium_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('species', 'tech', 'item', 'power', 'vehicle', 'starship', 'culture', 'civilization')),
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Species table
CREATE TABLE IF NOT EXISTS loreum_species (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    biology TEXT NOT NULL,
    traits TEXT[] DEFAULT '{}',
    average_lifespan INTEGER NOT NULL,
    reproduction_method TEXT NOT NULL,
    social_structure TEXT NOT NULL,
    intelligence INTEGER NOT NULL CHECK (intelligence >= 0 AND intelligence <= 100),
    physical_capabilities JSONB DEFAULT '{}',
    civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Governments table
CREATE TABLE IF NOT EXISTS loreum_governments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    structure TEXT NOT NULL,
    leaders TEXT[] DEFAULT '{}',
    start_year INTEGER NOT NULL,
    end_year INTEGER,
    civilization_id UUID NOT NULL REFERENCES loreum_civilizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Tech Trees table
CREATE TABLE IF NOT EXISTS loreum_tech_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    domains JSONB DEFAULT '[]',
    magic_domains JSONB,
    is_magical BOOLEAN DEFAULT FALSE,
    civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Lore Nodes table
CREATE TABLE IF NOT EXISTS loreum_lore_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('event', 'character', 'artifact', 'ideology', 'location', 'technology', 'species')),
    year INTEGER,
    connections JSONB DEFAULT '[]',
    causality JSONB DEFAULT '{}',
    world_id UUID REFERENCES loreum_worlds(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Star Systems table
CREATE TABLE IF NOT EXISTS loreum_star_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    coordinates JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
    star_type TEXT NOT NULL,
    planets JSONB DEFAULT '[]',
    travel_routes JSONB DEFAULT '[]',
    controlling_faction TEXT,
    universe_id UUID NOT NULL REFERENCES loreum_universes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_loreum_universes_multiverse_id ON loreum_universes(multiverse_id);
CREATE INDEX IF NOT EXISTS idx_loreum_timelines_universe_id ON loreum_timelines(universe_id);
CREATE INDEX IF NOT EXISTS idx_loreum_worlds_timeline_id ON loreum_worlds(timeline_id);
CREATE INDEX IF NOT EXISTS idx_loreum_civilizations_world_id ON loreum_civilizations(world_id);
CREATE INDEX IF NOT EXISTS idx_loreum_regions_world_id ON loreum_regions(world_id);
CREATE INDEX IF NOT EXISTS idx_loreum_species_civilization_id ON loreum_species(civilization_id);
CREATE INDEX IF NOT EXISTS idx_loreum_governments_civilization_id ON loreum_governments(civilization_id);
CREATE INDEX IF NOT EXISTS idx_loreum_tech_trees_civilization_id ON loreum_tech_trees(civilization_id);
CREATE INDEX IF NOT EXISTS idx_loreum_lore_nodes_world_id ON loreum_lore_nodes(world_id);
CREATE INDEX IF NOT EXISTS idx_loreum_star_systems_universe_id ON loreum_star_systems(universe_id);

-- Create updated_at triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_loreum_multiverses_updated_at BEFORE UPDATE ON loreum_multiverses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_universes_updated_at BEFORE UPDATE ON loreum_universes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_timelines_updated_at BEFORE UPDATE ON loreum_timelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_worlds_updated_at BEFORE UPDATE ON loreum_worlds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_civilizations_updated_at BEFORE UPDATE ON loreum_civilizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_regions_updated_at BEFORE UPDATE ON loreum_regions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_characters_updated_at BEFORE UPDATE ON loreum_characters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_ipsumarium_templates_updated_at BEFORE UPDATE ON loreum_ipsumarium_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_species_updated_at BEFORE UPDATE ON loreum_species FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_governments_updated_at BEFORE UPDATE ON loreum_governments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_tech_trees_updated_at BEFORE UPDATE ON loreum_tech_trees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_lore_nodes_updated_at BEFORE UPDATE ON loreum_lore_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_star_systems_updated_at BEFORE UPDATE ON loreum_star_systems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies (optional - uncomment if needed)
-- ALTER TABLE loreum_multiverses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_universes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_timelines ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_worlds ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_civilizations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_regions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_characters ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_ipsumarium_templates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_species ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_governments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_tech_trees ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_lore_nodes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loreum_star_systems ENABLE ROW LEVEL SECURITY;

-- Insert sample data for testing
INSERT INTO loreum_multiverses (name, description) VALUES 
('Aether Spiral', 'A vast multiverse where the fundamental forces of reality spiral through dimensions, creating infinite possibilities for worlds and civilizations.')
ON CONFLICT DO NOTHING;