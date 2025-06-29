-- Template Instancing System Migration
-- This migration adds the infrastructure for converting Ipsumarium templates into contextual instances

-- Create Template Instances table (generic for all template types)
CREATE TABLE IF NOT EXISTS loreum_template_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES loreum_ipsumarium_templates(id) ON DELETE CASCADE,
    instance_name TEXT NOT NULL,
    instance_description TEXT,

    -- Context hierarchy - at least one must be specified
    multiverse_id UUID REFERENCES loreum_multiverses(id) ON DELETE CASCADE,
    universe_id UUID REFERENCES loreum_universes(id) ON DELETE CASCADE,
    timeline_id UUID REFERENCES loreum_timelines(id) ON DELETE CASCADE,
    world_id UUID REFERENCES loreum_worlds(id) ON DELETE CASCADE,
    civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE CASCADE,

    -- Local variations from template
    local_variations JSONB DEFAULT '{}',
    override_metadata JSONB DEFAULT '{}',

    -- Instance-specific properties
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
    notes TEXT,

    -- Relationships
    created_by_character_id UUID REFERENCES loreum_characters(id) ON DELETE SET NULL,
    discovered_year INTEGER,
    origin_location TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraint: Must have at least one context
    CONSTRAINT template_instance_has_context CHECK (
        multiverse_id IS NOT NULL OR
        universe_id IS NOT NULL OR
        timeline_id IS NOT NULL OR
        world_id IS NOT NULL OR
        civilization_id IS NOT NULL
    )
);

-- Create Species Instances table (extends template instances for species-specific data)
CREATE TABLE IF NOT EXISTS loreum_species_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_instance_id UUID NOT NULL REFERENCES loreum_template_instances(id) ON DELETE CASCADE,

    -- Species-specific instance data
    local_population BIGINT DEFAULT 0,
    adaptation_traits TEXT[] DEFAULT '{}',
    cultural_modifications TEXT[] DEFAULT '{}',
    environmental_adaptations JSONB DEFAULT '{}',

    -- Relations to other entities
    primary_civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE SET NULL,
    homeworld_region_id UUID REFERENCES loreum_regions(id) ON DELETE SET NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Technology Instances table
CREATE TABLE IF NOT EXISTS loreum_technology_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_instance_id UUID NOT NULL REFERENCES loreum_template_instances(id) ON DELETE CASCADE,

    -- Technology-specific instance data
    development_level INTEGER DEFAULT 1 CHECK (development_level >= 1 AND development_level <= 10),
    implementation_date INTEGER, -- Year when technology was implemented
    local_modifications TEXT[] DEFAULT '{}',
    efficiency_rating DECIMAL(3,2) DEFAULT 1.0,

    -- Relations
    developed_by_civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE SET NULL,
    prerequisite_tech_instances TEXT[] DEFAULT '{}', -- Array of tech instance IDs

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Item Instances table
CREATE TABLE IF NOT EXISTS loreum_item_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_instance_id UUID NOT NULL REFERENCES loreum_template_instances(id) ON DELETE CASCADE,

    -- Item-specific instance data
    condition_rating INTEGER DEFAULT 100 CHECK (condition_rating >= 0 AND condition_rating <= 100),
    quantity INTEGER DEFAULT 1,
    current_location TEXT,
    ownership_history JSONB DEFAULT '[]',

    -- Modifications and enchantments
    applied_enchantments TEXT[] DEFAULT '{}', -- Array of enchantment IDs
    physical_modifications TEXT[] DEFAULT '{}',

    -- Relations
    current_owner_character_id UUID REFERENCES loreum_characters(id) ON DELETE SET NULL,
    current_owner_civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE SET NULL,
    created_by_civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE SET NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Magic System Instances table
CREATE TABLE IF NOT EXISTS loreum_magic_system_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_instance_id UUID NOT NULL REFERENCES loreum_template_instances(id) ON DELETE CASCADE,

    -- Magic system-specific instance data
    power_level INTEGER DEFAULT 1 CHECK (power_level >= 1 AND power_level <= 10),
    local_rules_modifications JSONB DEFAULT '{}',
    practitioner_population INTEGER DEFAULT 0,
    cultural_integration_level TEXT DEFAULT 'unknown' CHECK (cultural_integration_level IN ('unknown', 'forbidden', 'rare', 'common', 'integrated', 'dominant')),

    -- Relations
    primary_civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE SET NULL,
    associated_characters TEXT[] DEFAULT '{}', -- Array of character IDs who can use this system

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Culture Instances table
CREATE TABLE IF NOT EXISTS loreum_culture_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_instance_id UUID NOT NULL REFERENCES loreum_template_instances(id) ON DELETE CASCADE,

    -- Culture-specific instance data
    population_influence INTEGER DEFAULT 0,
    dominant_species TEXT[] DEFAULT '{}',
    regional_variations JSONB DEFAULT '{}',
    historical_evolution JSONB DEFAULT '[]',

    -- Relations
    primary_civilization_id UUID REFERENCES loreum_civilizations(id) ON DELETE CASCADE,
    influential_regions TEXT[] DEFAULT '{}', -- Array of region IDs

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Template Instance Relationships table (for cross-instance connections)
CREATE TABLE IF NOT EXISTS loreum_template_instance_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_instance_id UUID NOT NULL REFERENCES loreum_template_instances(id) ON DELETE CASCADE,
    target_instance_id UUID NOT NULL REFERENCES loreum_template_instances(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    relationship_strength DECIMAL(3,2) DEFAULT 1.0,
    description TEXT,
    established_year INTEGER,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Prevent self-relationships
    CONSTRAINT no_self_relationship CHECK (source_instance_id != target_instance_id)
);

-- Create Instance Usage Tracking table (for analytics and optimization)
CREATE TABLE IF NOT EXISTS loreum_instance_usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_instance_id UUID NOT NULL REFERENCES loreum_template_instances(id) ON DELETE CASCADE,
    usage_type TEXT NOT NULL, -- 'created', 'modified', 'accessed', 'referenced'
    usage_context TEXT, -- What operation was performed
    accessed_by TEXT, -- User or system identifier
    access_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_template_instances_template_id ON loreum_template_instances(template_id);
CREATE INDEX IF NOT EXISTS idx_template_instances_multiverse_id ON loreum_template_instances(multiverse_id);
CREATE INDEX IF NOT EXISTS idx_template_instances_universe_id ON loreum_template_instances(universe_id);
CREATE INDEX IF NOT EXISTS idx_template_instances_timeline_id ON loreum_template_instances(timeline_id);
CREATE INDEX IF NOT EXISTS idx_template_instances_world_id ON loreum_template_instances(world_id);
CREATE INDEX IF NOT EXISTS idx_template_instances_civilization_id ON loreum_template_instances(civilization_id);
CREATE INDEX IF NOT EXISTS idx_template_instances_status ON loreum_template_instances(status);

CREATE INDEX IF NOT EXISTS idx_species_instances_template_instance_id ON loreum_species_instances(template_instance_id);
CREATE INDEX IF NOT EXISTS idx_species_instances_civilization_id ON loreum_species_instances(primary_civilization_id);

CREATE INDEX IF NOT EXISTS idx_technology_instances_template_instance_id ON loreum_technology_instances(template_instance_id);
CREATE INDEX IF NOT EXISTS idx_technology_instances_civilization_id ON loreum_technology_instances(developed_by_civilization_id);
CREATE INDEX IF NOT EXISTS idx_technology_instances_implementation_date ON loreum_technology_instances(implementation_date);

CREATE INDEX IF NOT EXISTS idx_item_instances_template_instance_id ON loreum_item_instances(template_instance_id);
CREATE INDEX IF NOT EXISTS idx_item_instances_owner_character ON loreum_item_instances(current_owner_character_id);
CREATE INDEX IF NOT EXISTS idx_item_instances_owner_civilization ON loreum_item_instances(current_owner_civilization_id);

CREATE INDEX IF NOT EXISTS idx_magic_system_instances_template_instance_id ON loreum_magic_system_instances(template_instance_id);
CREATE INDEX IF NOT EXISTS idx_magic_system_instances_civilization_id ON loreum_magic_system_instances(primary_civilization_id);

CREATE INDEX IF NOT EXISTS idx_culture_instances_template_instance_id ON loreum_culture_instances(template_instance_id);
CREATE INDEX IF NOT EXISTS idx_culture_instances_civilization_id ON loreum_culture_instances(primary_civilization_id);

CREATE INDEX IF NOT EXISTS idx_template_instance_relationships_source ON loreum_template_instance_relationships(source_instance_id);
CREATE INDEX IF NOT EXISTS idx_template_instance_relationships_target ON loreum_template_instance_relationships(target_instance_id);
CREATE INDEX IF NOT EXISTS idx_template_instance_relationships_type ON loreum_template_instance_relationships(relationship_type);

CREATE INDEX IF NOT EXISTS idx_instance_usage_tracking_instance_id ON loreum_instance_usage_tracking(template_instance_id);
CREATE INDEX IF NOT EXISTS idx_instance_usage_tracking_timestamp ON loreum_instance_usage_tracking(access_timestamp);
CREATE INDEX IF NOT EXISTS idx_instance_usage_tracking_type ON loreum_instance_usage_tracking(usage_type);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_loreum_template_instances_updated_at BEFORE UPDATE ON loreum_template_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_species_instances_updated_at BEFORE UPDATE ON loreum_species_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_technology_instances_updated_at BEFORE UPDATE ON loreum_technology_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_item_instances_updated_at BEFORE UPDATE ON loreum_item_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_magic_system_instances_updated_at BEFORE UPDATE ON loreum_magic_system_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_culture_instances_updated_at BEFORE UPDATE ON loreum_culture_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_template_instance_relationships_updated_at BEFORE UPDATE ON loreum_template_instance_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy template instance querying with template information
CREATE OR REPLACE VIEW loreum_template_instances_with_templates AS
SELECT
    ti.*,
    t.name as template_name,
    t.description as template_description,
    t.type as template_type,
    t.tags as template_tags,
    t.metadata as template_metadata,

    -- Context names for easier querying
    m.name as multiverse_name,
    u.name as universe_name,
    tl.name as timeline_name,
    w.name as world_name,
    c.name as civilization_name
FROM loreum_template_instances ti
LEFT JOIN loreum_ipsumarium_templates t ON ti.template_id = t.id
LEFT JOIN loreum_multiverses m ON ti.multiverse_id = m.id
LEFT JOIN loreum_universes u ON ti.universe_id = u.id
LEFT JOIN loreum_timelines tl ON ti.timeline_id = tl.id
LEFT JOIN loreum_worlds w ON ti.world_id = w.id
LEFT JOIN loreum_civilizations c ON ti.civilization_id = c.id;

-- Create a function to automatically log instance usage
CREATE OR REPLACE FUNCTION log_instance_usage()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO loreum_instance_usage_tracking (
        template_instance_id,
        usage_type,
        usage_context,
        accessed_by
    ) VALUES (
        NEW.id,
        CASE
            WHEN TG_OP = 'INSERT' THEN 'created'
            WHEN TG_OP = 'UPDATE' THEN 'modified'
            ELSE 'accessed'
        END,
        TG_TABLE_NAME,
        current_user
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply usage logging triggers
CREATE TRIGGER log_template_instance_usage
    AFTER INSERT OR UPDATE ON loreum_template_instances
    FOR EACH ROW EXECUTE FUNCTION log_instance_usage();

-- Create helper function to get template instance hierarchy context
CREATE OR REPLACE FUNCTION get_instance_context_hierarchy(instance_id UUID)
RETURNS TABLE (
    multiverse_id UUID,
    multiverse_name TEXT,
    universe_id UUID,
    universe_name TEXT,
    timeline_id UUID,
    timeline_name TEXT,
    world_id UUID,
    world_name TEXT,
    civilization_id UUID,
    civilization_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ti.multiverse_id,
        m.name as multiverse_name,
        ti.universe_id,
        u.name as universe_name,
        ti.timeline_id,
        tl.name as timeline_name,
        ti.world_id,
        w.name as world_name,
        ti.civilization_id,
        c.name as civilization_name
    FROM loreum_template_instances ti
    LEFT JOIN loreum_multiverses m ON ti.multiverse_id = m.id
    LEFT JOIN loreum_universes u ON ti.universe_id = u.id
    LEFT JOIN loreum_timelines tl ON ti.timeline_id = tl.id
    LEFT JOIN loreum_worlds w ON ti.world_id = w.id
    LEFT JOIN loreum_civilizations c ON ti.civilization_id = c.id
    WHERE ti.id = instance_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate instance context hierarchy
CREATE OR REPLACE FUNCTION validate_instance_context()
RETURNS TRIGGER AS $$
BEGIN
    -- If civilization is specified, world must be specified
    IF NEW.civilization_id IS NOT NULL AND NEW.world_id IS NULL THEN
        RAISE EXCEPTION 'If civilization_id is specified, world_id must also be specified';
    END IF;

    -- If world is specified, timeline must be specified
    IF NEW.world_id IS NOT NULL AND NEW.timeline_id IS NULL THEN
        RAISE EXCEPTION 'If world_id is specified, timeline_id must also be specified';
    END IF;

    -- If timeline is specified, universe must be specified
    IF NEW.timeline_id IS NOT NULL AND NEW.universe_id IS NULL THEN
        RAISE EXCEPTION 'If timeline_id is specified, universe_id must also be specified';
    END IF;

    -- If universe is specified, multiverse must be specified
    IF NEW.universe_id IS NOT NULL AND NEW.multiverse_id IS NULL THEN
        RAISE EXCEPTION 'If universe_id is specified, multiverse_id must also be specified';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply context validation trigger
CREATE TRIGGER validate_template_instance_context
    BEFORE INSERT OR UPDATE ON loreum_template_instances
    FOR EACH ROW EXECUTE FUNCTION validate_instance_context();

-- Insert sample data for testing
INSERT INTO loreum_ipsumarium_templates (name, description, type, tags, metadata) VALUES
('Quantum Resonance Crystal', 'A crystalline structure that amplifies quantum effects', 'item', ARRAY['quantum', 'crystal', 'amplifier'], '{"rarity": "rare", "energy_capacity": 1000}'),
('Ethereal Humanoids', 'Beings that exist partially in the ethereal plane', 'species', ARRAY['ethereal', 'humanoid', 'planar'], '{"average_lifespan": 500, "intelligence": 85}'),
('Dimensional Folding', 'Technology for manipulating space-time dimensions', 'tech', ARRAY['dimensional', 'space-time', 'advanced'], '{"tier": 8, "energy_type": "exotic"}'),
('Harmonic Magic', 'Magic system based on sound and vibration', 'magic_system', ARRAY['harmonic', 'sound', 'vibration'], '{"power_source": "sonic", "complexity": "medium"}'),
('Artisan Culture', 'Culture focused on craftsmanship and creation', 'culture', ARRAY['artisan', 'craft', 'creation'], '{"focus": "craftsmanship", "values": ["quality", "tradition"]}'
) ON CONFLICT DO NOTHING;
