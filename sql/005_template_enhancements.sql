-- Template Enhancements Migration
-- This migration adds template relationships, versioning, discovery tools, and helper functions

-- Add versioning and relationship columns to existing templates table
ALTER TABLE loreum_ipsumarium_templates 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_template_id UUID REFERENCES loreum_ipsumarium_templates(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS version_notes TEXT,
ADD COLUMN IF NOT EXISTS is_deprecated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS template_category TEXT DEFAULT 'general' CHECK (template_category IN ('general', 'core', 'expansion', 'experimental', 'deprecated'));

-- Create Template Relationships table (for template-to-template connections)
CREATE TABLE IF NOT EXISTS loreum_template_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_template_id UUID NOT NULL REFERENCES loreum_ipsumarium_templates(id) ON DELETE CASCADE,
    target_template_id UUID NOT NULL REFERENCES loreum_ipsumarium_templates(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('requires', 'conflicts', 'enhances', 'replaces', 'synergizes', 'prerequisite', 'alternative')),
    relationship_strength DECIMAL(3,2) DEFAULT 1.0 CHECK (relationship_strength >= 0.0 AND relationship_strength <= 10.0),
    description TEXT,
    is_bidirectional BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent self-relationships and duplicate relationships
    CONSTRAINT no_self_template_relationship CHECK (source_template_id != target_template_id),
    CONSTRAINT unique_template_relationship UNIQUE (source_template_id, target_template_id, relationship_type)
);

-- Create Template Collections table (for grouping related templates)
CREATE TABLE IF NOT EXISTS loreum_template_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    collection_type TEXT DEFAULT 'thematic' CHECK (collection_type IN ('thematic', 'functional', 'historical', 'geographic', 'cultural')),
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Template Collection Memberships table
CREATE TABLE IF NOT EXISTS loreum_template_collection_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES loreum_template_collections(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES loreum_ipsumarium_templates(id) ON DELETE CASCADE,
    membership_role TEXT DEFAULT 'member' CHECK (membership_role IN ('member', 'core', 'optional', 'alternative')),
    sort_order INTEGER DEFAULT 0,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate memberships
    CONSTRAINT unique_collection_template UNIQUE (collection_id, template_id)
);

-- Create Template Usage Analytics table
CREATE TABLE IF NOT EXISTS loreum_template_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES loreum_ipsumarium_templates(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('view', 'instance_created', 'relationship_added', 'search_result', 'favorite')),
    metric_value INTEGER DEFAULT 1,
    context_data JSONB DEFAULT '{}',
    user_identifier TEXT, -- For tracking usage patterns without storing personal data
    
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_templates_version ON loreum_ipsumarium_templates(version);
CREATE INDEX IF NOT EXISTS idx_templates_parent ON loreum_ipsumarium_templates(parent_template_id);
CREATE INDEX IF NOT EXISTS idx_templates_deprecated ON loreum_ipsumarium_templates(is_deprecated);
CREATE INDEX IF NOT EXISTS idx_templates_category ON loreum_ipsumarium_templates(template_category);
CREATE INDEX IF NOT EXISTS idx_templates_type_category ON loreum_ipsumarium_templates(type, template_category);

CREATE INDEX IF NOT EXISTS idx_template_relationships_source ON loreum_template_relationships(source_template_id);
CREATE INDEX IF NOT EXISTS idx_template_relationships_target ON loreum_template_relationships(target_template_id);
CREATE INDEX IF NOT EXISTS idx_template_relationships_type ON loreum_template_relationships(relationship_type);

CREATE INDEX IF NOT EXISTS idx_template_collections_type ON loreum_template_collections(collection_type);
CREATE INDEX IF NOT EXISTS idx_template_collections_public ON loreum_template_collections(is_public);

CREATE INDEX IF NOT EXISTS idx_collection_memberships_collection ON loreum_template_collection_memberships(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_memberships_template ON loreum_template_collection_memberships(template_id);
CREATE INDEX IF NOT EXISTS idx_collection_memberships_role ON loreum_template_collection_memberships(membership_role);

CREATE INDEX IF NOT EXISTS idx_template_analytics_template ON loreum_template_analytics(template_id);
CREATE INDEX IF NOT EXISTS idx_template_analytics_metric ON loreum_template_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_template_analytics_recorded ON loreum_template_analytics(recorded_at);

-- Add updated_at triggers
CREATE TRIGGER update_loreum_template_relationships_updated_at 
    BEFORE UPDATE ON loreum_template_relationships 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loreum_template_collections_updated_at 
    BEFORE UPDATE ON loreum_template_collections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create enhanced template discovery view
CREATE OR REPLACE VIEW loreum_template_discovery AS
SELECT 
    t.*,
    COUNT(DISTINCT ti.id) as instance_count,
    COUNT(DISTINCT tr_out.id) as outgoing_relationships,
    COUNT(DISTINCT tr_in.id) as incoming_relationships,
    COUNT(DISTINCT tcm.id) as collection_memberships,
    MAX(ti.created_at) as last_instanced,
    COALESCE(SUM(CASE WHEN ta.metric_type = 'view' THEN ta.metric_value ELSE 0 END), 0) as view_count,
    COALESCE(array_agg(DISTINCT ti.tags) FILTER (WHERE ti.tags IS NOT NULL), '{}') as instance_tags,
    COALESCE(array_agg(DISTINCT tc.name) FILTER (WHERE tc.name IS NOT NULL), '{}') as collection_names
FROM loreum_ipsumarium_templates t
LEFT JOIN loreum_template_instances ti ON t.id = ti.template_id
LEFT JOIN loreum_template_relationships tr_out ON t.id = tr_out.source_template_id
LEFT JOIN loreum_template_relationships tr_in ON t.id = tr_in.target_template_id
LEFT JOIN loreum_template_collection_memberships tcm ON t.id = tcm.template_id
LEFT JOIN loreum_template_collections tc ON tcm.collection_id = tc.id
LEFT JOIN loreum_template_analytics ta ON t.id = ta.template_id
WHERE t.is_deprecated = FALSE
GROUP BY t.id, t.name, t.description, t.type, t.tags, t.metadata, t.created_at, t.updated_at, 
         t.version, t.parent_template_id, t.version_notes, t.is_deprecated, t.template_category;

-- Create function to search templates with advanced filtering
CREATE OR REPLACE FUNCTION search_templates(
    p_search_text TEXT DEFAULT NULL,
    p_template_types TEXT[] DEFAULT NULL,
    p_search_tags TEXT[] DEFAULT NULL,
    p_categories TEXT[] DEFAULT NULL,
    p_include_deprecated BOOLEAN DEFAULT FALSE,
    p_min_instances INTEGER DEFAULT NULL,
    p_collection_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    type TEXT,
    tags TEXT[],
    metadata JSONB,
    template_category TEXT,
    version INTEGER,
    instance_count BIGINT,
    view_count BIGINT,
    relevance_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        td.id,
        td.name,
        td.description,
        td.type,
        td.tags,
        td.metadata,
        td.template_category,
        td.version,
        td.instance_count,
        td.view_count,
        -- Simple relevance scoring
        (
            CASE WHEN p_search_text IS NULL THEN 0 
                 WHEN td.name ILIKE '%' || p_search_text || '%' THEN 3
                 WHEN td.description ILIKE '%' || p_search_text || '%' THEN 2
                 ELSE 1 END +
            CASE WHEN p_search_tags IS NULL THEN 0
                 ELSE array_length(td.tags & p_search_tags, 1) END +
            td.view_count::NUMERIC / 100 +
            td.instance_count::NUMERIC / 10
        ) as relevance_score
    FROM loreum_template_discovery td
    LEFT JOIN loreum_template_collection_memberships tcm ON td.id = tcm.template_id
    WHERE 
        (p_search_text IS NULL OR 
         td.name ILIKE '%' || p_search_text || '%' OR 
         td.description ILIKE '%' || p_search_text || '%')
    AND (p_template_types IS NULL OR td.type = ANY(p_template_types))
    AND (p_search_tags IS NULL OR td.tags && p_search_tags)
    AND (p_categories IS NULL OR td.template_category = ANY(p_categories))
    AND (p_include_deprecated = TRUE OR td.is_deprecated = FALSE)
    AND (p_min_instances IS NULL OR td.instance_count >= p_min_instances)
    AND (p_collection_id IS NULL OR tcm.collection_id = p_collection_id)
    ORDER BY relevance_score DESC, td.name
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Create function to get template relationships
CREATE OR REPLACE FUNCTION get_template_relationships(
    p_template_id UUID,
    p_relationship_types TEXT[] DEFAULT NULL,
    p_include_bidirectional BOOLEAN DEFAULT TRUE
) RETURNS TABLE (
    relationship_id UUID,
    related_template_id UUID,
    related_template_name TEXT,
    relationship_type TEXT,
    relationship_strength NUMERIC,
    description TEXT,
    is_outgoing BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    -- Outgoing relationships
    SELECT 
        tr.id as relationship_id,
        tr.target_template_id as related_template_id,
        t.name as related_template_name,
        tr.relationship_type,
        tr.relationship_strength,
        tr.description,
        TRUE as is_outgoing
    FROM loreum_template_relationships tr
    JOIN loreum_ipsumarium_templates t ON tr.target_template_id = t.id
    WHERE tr.source_template_id = p_template_id
    AND (p_relationship_types IS NULL OR tr.relationship_type = ANY(p_relationship_types))
    AND t.is_deprecated = FALSE
    
    UNION ALL
    
    -- Incoming relationships (if including bidirectional)
    SELECT 
        tr.id as relationship_id,
        tr.source_template_id as related_template_id,
        t.name as related_template_name,
        tr.relationship_type,
        tr.relationship_strength,
        tr.description,
        FALSE as is_outgoing
    FROM loreum_template_relationships tr
    JOIN loreum_ipsumarium_templates t ON tr.source_template_id = t.id
    WHERE p_include_bidirectional = TRUE
    AND tr.target_template_id = p_template_id
    AND (tr.is_bidirectional = TRUE OR tr.relationship_type IN ('synergizes', 'conflicts'))
    AND (p_relationship_types IS NULL OR tr.relationship_type = ANY(p_relationship_types))
    AND t.is_deprecated = FALSE
    
    ORDER BY relationship_strength DESC, related_template_name;
END;
$$ LANGUAGE plpgsql;

-- Create function to create template instances with automatic relationship resolution
CREATE OR REPLACE FUNCTION create_template_instance_with_relationships(
    p_template_id UUID,
    p_instance_name TEXT,
    p_context_level TEXT, -- 'multiverse', 'universe', 'timeline', 'world', 'civilization'
    p_context_id UUID,
    p_variations JSONB DEFAULT '{}',
    p_auto_resolve_requirements BOOLEAN DEFAULT TRUE
) RETURNS TABLE (
    instance_id UUID,
    created_instances JSONB,
    warnings TEXT[]
) AS $$
DECLARE
    new_instance_id UUID;
    requirement_record RECORD;
    requirement_instance_id UUID;
    created_list JSONB := '[]'::JSONB;
    warning_list TEXT[] := '{}';
BEGIN
    -- Create the main instance
    INSERT INTO loreum_template_instances (
        template_id,
        instance_name,
        multiverse_id,
        universe_id,
        timeline_id,
        world_id,
        civilization_id,
        local_variations
    ) VALUES (
        p_template_id,
        p_instance_name,
        CASE WHEN p_context_level = 'multiverse' THEN p_context_id ELSE NULL END,
        CASE WHEN p_context_level = 'universe' THEN p_context_id ELSE NULL END,
        CASE WHEN p_context_level = 'timeline' THEN p_context_id ELSE NULL END,
        CASE WHEN p_context_level = 'world' THEN p_context_id ELSE NULL END,
        CASE WHEN p_context_level = 'civilization' THEN p_context_id ELSE NULL END,
        p_variations
    ) RETURNING id INTO new_instance_id;
    
    created_list := created_list || jsonb_build_object('main', jsonb_build_object('id', new_instance_id, 'name', p_instance_name));
    
    -- Auto-resolve requirements if requested
    IF p_auto_resolve_requirements THEN
        FOR requirement_record IN 
            SELECT tr.target_template_id, t.name as template_name
            FROM loreum_template_relationships tr
            JOIN loreum_ipsumarium_templates t ON tr.target_template_id = t.id
            WHERE tr.source_template_id = p_template_id 
            AND tr.relationship_type = 'requires'
            AND t.is_deprecated = FALSE
        LOOP
            -- Check if requirement is already instantiated in this context
            IF NOT EXISTS (
                SELECT 1 FROM loreum_template_instances ti 
                WHERE ti.template_id = requirement_record.target_template_id
                AND (
                    (p_context_level = 'multiverse' AND ti.multiverse_id = p_context_id) OR
                    (p_context_level = 'universe' AND ti.universe_id = p_context_id) OR
                    (p_context_level = 'timeline' AND ti.timeline_id = p_context_id) OR
                    (p_context_level = 'world' AND ti.world_id = p_context_id) OR
                    (p_context_level = 'civilization' AND ti.civilization_id = p_context_id)
                )
            ) THEN
                -- Create the required instance
                INSERT INTO loreum_template_instances (
                    template_id,
                    instance_name,
                    multiverse_id,
                    universe_id,
                    timeline_id,
                    world_id,
                    civilization_id,
                    notes
                ) VALUES (
                    requirement_record.target_template_id,
                    requirement_record.template_name || ' (Auto-created)',
                    CASE WHEN p_context_level = 'multiverse' THEN p_context_id ELSE NULL END,
                    CASE WHEN p_context_level = 'universe' THEN p_context_id ELSE NULL END,
                    CASE WHEN p_context_level = 'timeline' THEN p_context_id ELSE NULL END,
                    CASE WHEN p_context_level = 'world' THEN p_context_id ELSE NULL END,
                    CASE WHEN p_context_level = 'civilization' THEN p_context_id ELSE NULL END,
                    'Auto-created as requirement for ' || p_instance_name
                ) RETURNING id INTO requirement_instance_id;
                
                created_list := created_list || jsonb_build_object(
                    'requirement_' || requirement_record.target_template_id::TEXT, 
                    jsonb_build_object('id', requirement_instance_id, 'name', requirement_record.template_name || ' (Auto-created)')
                );
            ELSE
                warning_list := warning_list || ('Requirement ' || requirement_record.template_name || ' already exists in context');
            END IF;
        END LOOP;
    END IF;
    
    -- Check for conflicts
    FOR requirement_record IN 
        SELECT tr.target_template_id, t.name as template_name
        FROM loreum_template_relationships tr
        JOIN loreum_ipsumarium_templates t ON tr.target_template_id = t.id
        WHERE tr.source_template_id = p_template_id 
        AND tr.relationship_type = 'conflicts'
        AND t.is_deprecated = FALSE
    LOOP
        IF EXISTS (
            SELECT 1 FROM loreum_template_instances ti 
            WHERE ti.template_id = requirement_record.target_template_id
            AND (
                (p_context_level = 'multiverse' AND ti.multiverse_id = p_context_id) OR
                (p_context_level = 'universe' AND ti.universe_id = p_context_id) OR
                (p_context_level = 'timeline' AND ti.timeline_id = p_context_id) OR
                (p_context_level = 'world' AND ti.world_id = p_context_id) OR
                (p_context_level = 'civilization' AND ti.civilization_id = p_context_id)
            )
        ) THEN
            warning_list := warning_list || ('Conflict detected: ' || requirement_record.template_name || ' exists in same context');
        END IF;
    END LOOP;
    
    RETURN QUERY SELECT new_instance_id, created_list, warning_list;
END;
$$ LANGUAGE plpgsql;

-- Create function to record template analytics
CREATE OR REPLACE FUNCTION record_template_analytics(
    p_template_id UUID,
    p_metric_type TEXT,
    p_metric_value INTEGER DEFAULT 1,
    p_context_data JSONB DEFAULT '{}',
    p_user_identifier TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO loreum_template_analytics (
        template_id,
        metric_type,
        metric_value,
        context_data,
        user_identifier
    ) VALUES (
        p_template_id,
        p_metric_type,
        p_metric_value,
        p_context_data,
        p_user_identifier
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to get template version history
CREATE OR REPLACE FUNCTION get_template_version_history(p_template_id UUID)
RETURNS TABLE (
    template_id UUID,
    name TEXT,
    version INTEGER,
    version_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    is_current BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE version_tree AS (
        -- Start with the requested template
        SELECT t.id, t.name, t.version, t.version_notes, t.created_at, 
               CASE WHEN t.id = p_template_id THEN TRUE ELSE FALSE END as is_current
        FROM loreum_ipsumarium_templates t
        WHERE t.id = p_template_id
        
        UNION ALL
        
        -- Recursively find all parent versions
        SELECT t.id, t.name, t.version, t.version_notes, t.created_at, FALSE as is_current
        FROM loreum_ipsumarium_templates t
        JOIN version_tree vt ON t.id = vt.template_id
        WHERE t.parent_template_id IS NOT NULL
    )
    SELECT * FROM version_tree
    ORDER BY version DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample template relationships and collections
INSERT INTO loreum_template_collections (name, description, collection_type, tags) VALUES
('Fantasy Magic Systems', 'Collection of magical systems for fantasy worlds', 'thematic', ARRAY['fantasy', 'magic', 'supernatural']),
('Sci-Fi Technologies', 'Advanced technologies for science fiction settings', 'thematic', ARRAY['scifi', 'technology', 'advanced']),
('Humanoid Species Variants', 'Different variations of humanoid species', 'functional', ARRAY['species', 'humanoid', 'variations']),
('Starter Pack Essentials', 'Essential templates for new worldbuilders', 'functional', ARRAY['beginner', 'essential', 'starter'])
ON CONFLICT DO NOTHING;

-- Sample template relationships (only if templates exist)
DO $$
DECLARE
    harmonic_magic_id UUID;
    quantum_crystal_id UUID;
    ethereal_humanoids_id UUID;
    dimensional_folding_id UUID;
BEGIN
    -- Get template IDs if they exist
    SELECT id INTO harmonic_magic_id FROM loreum_ipsumarium_templates WHERE name = 'Harmonic Magic' LIMIT 1;
    SELECT id INTO quantum_crystal_id FROM loreum_ipsumarium_templates WHERE name = 'Quantum Resonance Crystal' LIMIT 1;
    SELECT id INTO ethereal_humanoids_id FROM loreum_ipsumarium_templates WHERE name = 'Ethereal Humanoids' LIMIT 1;
    SELECT id INTO dimensional_folding_id FROM loreum_ipsumarium_templates WHERE name = 'Dimensional Folding' LIMIT 1;
    
    -- Create relationships if templates exist
    IF harmonic_magic_id IS NOT NULL AND quantum_crystal_id IS NOT NULL THEN
        INSERT INTO loreum_template_relationships (source_template_id, target_template_id, relationship_type, relationship_strength, description)
        VALUES (harmonic_magic_id, quantum_crystal_id, 'enhances', 2.5, 'Quantum crystals amplify harmonic magic resonance')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF ethereal_humanoids_id IS NOT NULL AND dimensional_folding_id IS NOT NULL THEN
        INSERT INTO loreum_template_relationships (source_template_id, target_template_id, relationship_type, relationship_strength, description)
        VALUES (ethereal_humanoids_id, dimensional_folding_id, 'synergizes', 3.0, 'Ethereal beings naturally understand dimensional manipulation')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;