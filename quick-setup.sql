-- Quick Setup Script for Loreum Database
-- Run this in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension (required for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS loreum_star_systems CASCADE;
DROP TABLE IF EXISTS loreum_lore_nodes CASCADE;
DROP TABLE IF EXISTS loreum_tech_trees CASCADE;
DROP TABLE IF EXISTS loreum_governments CASCADE;
DROP TABLE IF EXISTS loreum_species CASCADE;
DROP TABLE IF EXISTS loreum_ipsumarium_templates CASCADE;
DROP TABLE IF EXISTS loreum_characters CASCADE;
DROP TABLE IF EXISTS loreum_regions CASCADE;
DROP TABLE IF EXISTS loreum_civilizations CASCADE;
DROP TABLE IF EXISTS loreum_worlds CASCADE;
DROP TABLE IF EXISTS loreum_timelines CASCADE;
DROP TABLE IF EXISTS loreum_universes CASCADE;
DROP TABLE IF EXISTS loreum_multiverses CASCADE;

-- Create Multiverses table (top level)
CREATE TABLE loreum_multiverses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Universes table
CREATE TABLE loreum_universes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    multiverse_id UUID NOT NULL REFERENCES loreum_multiverses(id) ON DELETE CASCADE,
    physical_laws JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Timelines table
CREATE TABLE loreum_timelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    universe_id UUID NOT NULL REFERENCES loreum_universes(id) ON DELETE CASCADE,
    start_year INTEGER NOT NULL,
    end_year INTEGER,
    fork_point JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Worlds table
CREATE TABLE loreum_worlds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    timeline_id UUID NOT NULL REFERENCES loreum_timelines(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'planet',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Civilizations table
CREATE TABLE loreum_civilizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    world_id UUID NOT NULL REFERENCES loreum_worlds(id) ON DELETE CASCADE,
    population_dynamics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Regions table
CREATE TABLE loreum_regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    world_id UUID NOT NULL REFERENCES loreum_worlds(id) ON DELETE CASCADE,
    terrain JSONB DEFAULT '[]',
    climate TEXT NOT NULL DEFAULT 'temperate',
    resources JSONB DEFAULT '[]',
    area NUMERIC NOT NULL DEFAULT 1000,
    coordinates JSONB DEFAULT '{"x": 0, "y": 0}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Characters table
CREATE TABLE loreum_characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    species TEXT NOT NULL DEFAULT 'unknown',
    birth_year INTEGER NOT NULL DEFAULT 0,
    death_year INTEGER,
    affiliations TEXT[] DEFAULT '{}',
    relationships JSONB DEFAULT '[]',
    abilities TEXT[] DEFAULT '{}',
    equipment TEXT[] DEFAULT '{}',
    voice_profile JSONB DEFAULT '{}',
    narrative_roles TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Ipsumarium Templates table
CREATE TABLE loreum_ipsumarium_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'other',
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Species table
CREATE TABLE loreum_species (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    biology TEXT NOT NULL DEFAULT 'carbon-based',
    traits TEXT[] DEFAULT '{}',
    average_lifespan INTEGER NOT NULL DEFAULT 100,
    reproduction_method TEXT NOT NULL DEFAULT 'sexual',
    social_structure TEXT NOT NULL DEFAULT 'tribal',
    intelligence INTEGER NOT NULL DEFAULT 50,
    physical_capabilities JSONB DEFAULT '{}',
    civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Governments table
CREATE TABLE loreum_governments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'democratic',
    structure TEXT NOT NULL DEFAULT 'centralized',
    leaders TEXT[] DEFAULT '{}',
    start_year INTEGER NOT NULL DEFAULT 0,
    end_year INTEGER,
    civilization_id UUID NOT NULL REFERENCES loreum_civilizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Tech Trees table
CREATE TABLE loreum_tech_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    domains JSONB DEFAULT '[]',
    magic_domains JSONB DEFAULT '[]',
    is_magical BOOLEAN DEFAULT FALSE,
    civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Lore Nodes table
CREATE TABLE loreum_lore_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'event',
    year INTEGER DEFAULT 0,
    connections JSONB DEFAULT '[]',
    causality JSONB DEFAULT '{}',
    world_id UUID REFERENCES loreum_worlds(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Star Systems table
CREATE TABLE loreum_star_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    coordinates JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
    star_type TEXT NOT NULL DEFAULT 'main_sequence',
    planets JSONB DEFAULT '[]',
    travel_routes JSONB DEFAULT '[]',
    controlling_faction TEXT DEFAULT 'none',
    universe_id UUID NOT NULL REFERENCES loreum_universes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_loreum_universes_multiverse_id ON loreum_universes(multiverse_id);
CREATE INDEX idx_loreum_timelines_universe_id ON loreum_timelines(universe_id);
CREATE INDEX idx_loreum_worlds_timeline_id ON loreum_worlds(timeline_id);
CREATE INDEX idx_loreum_civilizations_world_id ON loreum_civilizations(world_id);
CREATE INDEX idx_loreum_regions_world_id ON loreum_regions(world_id);
CREATE INDEX idx_loreum_species_civilization_id ON loreum_species(civilization_id);
CREATE INDEX idx_loreum_governments_civilization_id ON loreum_governments(civilization_id);
CREATE INDEX idx_loreum_tech_trees_civilization_id ON loreum_tech_trees(civilization_id);
CREATE INDEX idx_loreum_lore_nodes_world_id ON loreum_lore_nodes(world_id);
CREATE INDEX idx_loreum_star_systems_universe_id ON loreum_star_systems(universe_id);

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

-- Disable Row Level Security for easier development
ALTER TABLE loreum_multiverses DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_universes DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_timelines DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_worlds DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_civilizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_regions DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_characters DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_ipsumarium_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_species DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_governments DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_tech_trees DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_lore_nodes DISABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_star_systems DISABLE ROW LEVEL SECURITY;

-- Insert sample data for testing
INSERT INTO loreum_multiverses (name, description) VALUES
('The Eternal Spiral', 'A vast multiverse where the fundamental forces of reality spiral through dimensions, creating infinite possibilities for worlds and civilizations.'),
('Nexus Prime', 'A central hub multiverse that connects to all other realities through quantum entanglement bridges.'),
('The Shattered Realms', 'A fragmented multiverse where reality broke apart eons ago, leaving floating islands of existence.');

-- Insert sample universes
INSERT INTO loreum_universes (name, description, multiverse_id, physical_laws) 
SELECT 
    'Prime Reality', 
    'The original universe with standard physical laws and abundant life.',
    id,
    '{"gravity": "standard", "magic": false, "ftl": "limited"}'
FROM loreum_multiverses 
WHERE name = 'The Eternal Spiral' 
LIMIT 1;

-- Insert sample timeline
INSERT INTO loreum_timelines (name, description, universe_id, start_year, end_year)
SELECT 
    'The Great Expansion',
    'The timeline where civilizations first reached the stars.',
    u.id,
    -10000,
    50000
FROM loreum_universes u
JOIN loreum_multiverses m ON u.multiverse_id = m.id
WHERE m.name = 'The Eternal Spiral'
LIMIT 1;

-- Insert sample world
INSERT INTO loreum_worlds (name, description, timeline_id, type)
SELECT 
    'Terra Nova',
    'A blue-green world teeming with diverse life forms and ancient mysteries.',
    t.id,
    'planet'
FROM loreum_timelines t
JOIN loreum_universes u ON t.universe_id = u.id
JOIN loreum_multiverses m ON u.multiverse_id = m.id
WHERE m.name = 'The Eternal Spiral'
LIMIT 1;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Loreum database setup completed successfully!';
    RAISE NOTICE 'Created tables: multiverses, universes, timelines, worlds, civilizations, regions, characters, ipsumarium_templates, species, governments, tech_trees, lore_nodes, star_systems';
    RAISE NOTICE 'Inserted sample data: 3 multiverses, 1 universe, 1 timeline, 1 world';
    RAISE NOTICE 'RLS is DISABLED for development. Enable it later for production.';
END $$;