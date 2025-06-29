-- Template Instances RPC Functions
-- This migration creates RPC functions to query template instances data
-- This bypasses the need for the tables to be in Supabase's generated REST API schema

-- Function to get all template instances with template information
CREATE OR REPLACE FUNCTION get_template_instances()
RETURNS TABLE (
  id UUID,
  template_id UUID,
  instance_name TEXT,
  instance_description TEXT,
  multiverse_id UUID,
  universe_id UUID,
  timeline_id UUID,
  world_id UUID,
  civilization_id UUID,
  local_variations JSONB,
  override_metadata JSONB,
  tags TEXT[],
  status TEXT,
  notes TEXT,
  created_by_character_id UUID,
  discovered_year INTEGER,
  origin_location TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  template_name TEXT,
  template_description TEXT,
  template_type TEXT,
  template_tags TEXT[],
  template_metadata JSONB,
  multiverse_name TEXT,
  universe_name TEXT,
  timeline_name TEXT,
  world_name TEXT,
  civilization_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ti.id,
    ti.template_id,
    ti.instance_name,
    ti.instance_description,
    ti.multiverse_id,
    ti.universe_id,
    ti.timeline_id,
    ti.world_id,
    ti.civilization_id,
    ti.local_variations,
    ti.override_metadata,
    ti.tags,
    ti.status,
    ti.notes,
    ti.created_by_character_id,
    ti.discovered_year,
    ti.origin_location,
    ti.created_at,
    ti.updated_at,
    t.name as template_name,
    t.description as template_description,
    t.type as template_type,
    t.tags as template_tags,
    t.metadata as template_metadata,
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
  LEFT JOIN loreum_civilizations c ON ti.civilization_id = c.id
  ORDER BY ti.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a template instance
CREATE OR REPLACE FUNCTION create_template_instance(
  p_template_id UUID,
  p_instance_name TEXT,
  p_instance_description TEXT DEFAULT NULL,
  p_multiverse_id UUID DEFAULT NULL,
  p_universe_id UUID DEFAULT NULL,
  p_timeline_id UUID DEFAULT NULL,
  p_world_id UUID DEFAULT NULL,
  p_civilization_id UUID DEFAULT NULL,
  p_local_variations JSONB DEFAULT '{}',
  p_override_metadata JSONB DEFAULT '{}',
  p_tags TEXT[] DEFAULT '{}',
  p_notes TEXT DEFAULT NULL,
  p_created_by_character_id UUID DEFAULT NULL,
  p_discovered_year INTEGER DEFAULT NULL,
  p_origin_location TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  template_id UUID,
  instance_name TEXT,
  instance_description TEXT,
  multiverse_id UUID,
  universe_id UUID,
  timeline_id UUID,
  world_id UUID,
  civilization_id UUID,
  local_variations JSONB,
  override_metadata JSONB,
  tags TEXT[],
  status TEXT,
  notes TEXT,
  created_by_character_id UUID,
  discovered_year INTEGER,
  origin_location TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO loreum_template_instances (
    template_id,
    instance_name,
    instance_description,
    multiverse_id,
    universe_id,
    timeline_id,
    world_id,
    civilization_id,
    local_variations,
    override_metadata,
    tags,
    status,
    notes,
    created_by_character_id,
    discovered_year,
    origin_location
  ) VALUES (
    p_template_id,
    p_instance_name,
    p_instance_description,
    p_multiverse_id,
    p_universe_id,
    p_timeline_id,
    p_world_id,
    p_civilization_id,
    p_local_variations,
    p_override_metadata,
    p_tags,
    'active',
    p_notes,
    p_created_by_character_id,
    p_discovered_year,
    p_origin_location
  )
  RETURNING 
    loreum_template_instances.id,
    loreum_template_instances.template_id,
    loreum_template_instances.instance_name,
    loreum_template_instances.instance_description,
    loreum_template_instances.multiverse_id,
    loreum_template_instances.universe_id,
    loreum_template_instances.timeline_id,
    loreum_template_instances.world_id,
    loreum_template_instances.civilization_id,
    loreum_template_instances.local_variations,
    loreum_template_instances.override_metadata,
    loreum_template_instances.tags,
    loreum_template_instances.status,
    loreum_template_instances.notes,
    loreum_template_instances.created_by_character_id,
    loreum_template_instances.discovered_year,
    loreum_template_instances.origin_location,
    loreum_template_instances.created_at,
    loreum_template_instances.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get template instances by context
CREATE OR REPLACE FUNCTION get_template_instances_by_context(
  p_multiverse_id UUID DEFAULT NULL,
  p_universe_id UUID DEFAULT NULL,
  p_timeline_id UUID DEFAULT NULL,
  p_world_id UUID DEFAULT NULL,
  p_civilization_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  template_id UUID,
  instance_name TEXT,
  instance_description TEXT,
  multiverse_id UUID,
  universe_id UUID,
  timeline_id UUID,
  world_id UUID,
  civilization_id UUID,
  local_variations JSONB,
  override_metadata JSONB,
  tags TEXT[],
  status TEXT,
  notes TEXT,
  created_by_character_id UUID,
  discovered_year INTEGER,
  origin_location TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  template_name TEXT,
  template_description TEXT,
  template_type TEXT,
  template_tags TEXT[],
  template_metadata JSONB,
  multiverse_name TEXT,
  universe_name TEXT,
  timeline_name TEXT,
  world_name TEXT,
  civilization_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ti.id,
    ti.template_id,
    ti.instance_name,
    ti.instance_description,
    ti.multiverse_id,
    ti.universe_id,
    ti.timeline_id,
    ti.world_id,
    ti.civilization_id,
    ti.local_variations,
    ti.override_metadata,
    ti.tags,
    ti.status,
    ti.notes,
    ti.created_by_character_id,
    ti.discovered_year,
    ti.origin_location,
    ti.created_at,
    ti.updated_at,
    t.name as template_name,
    t.description as template_description,
    t.type as template_type,
    t.tags as template_tags,
    t.metadata as template_metadata,
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
  LEFT JOIN loreum_civilizations c ON ti.civilization_id = c.id
  WHERE 
    (p_multiverse_id IS NULL OR ti.multiverse_id = p_multiverse_id) AND
    (p_universe_id IS NULL OR ti.universe_id = p_universe_id) AND
    (p_timeline_id IS NULL OR ti.timeline_id = p_timeline_id) AND
    (p_world_id IS NULL OR ti.world_id = p_world_id) AND
    (p_civilization_id IS NULL OR ti.civilization_id = p_civilization_id)
  ORDER BY ti.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get template instances by template ID
CREATE OR REPLACE FUNCTION get_template_instances_by_template(p_template_id UUID)
RETURNS TABLE (
  id UUID,
  template_id UUID,
  instance_name TEXT,
  instance_description TEXT,
  multiverse_id UUID,
  universe_id UUID,
  timeline_id UUID,
  world_id UUID,
  civilization_id UUID,
  local_variations JSONB,
  override_metadata JSONB,
  tags TEXT[],
  status TEXT,
  notes TEXT,
  created_by_character_id UUID,
  discovered_year INTEGER,
  origin_location TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  template_name TEXT,
  template_description TEXT,
  template_type TEXT,
  template_tags TEXT[],
  template_metadata JSONB,
  multiverse_name TEXT,
  universe_name TEXT,
  timeline_name TEXT,
  world_name TEXT,
  civilization_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ti.id,
    ti.template_id,
    ti.instance_name,
    ti.instance_description,
    ti.multiverse_id,
    ti.universe_id,
    ti.timeline_id,
    ti.world_id,
    ti.civilization_id,
    ti.local_variations,
    ti.override_metadata,
    ti.tags,
    ti.status,
    ti.notes,
    ti.created_by_character_id,
    ti.discovered_year,
    ti.origin_location,
    ti.created_at,
    ti.updated_at,
    t.name as template_name,
    t.description as template_description,
    t.type as template_type,
    t.tags as template_tags,
    t.metadata as template_metadata,
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
  LEFT JOIN loreum_civilizations c ON ti.civilization_id = c.id
  WHERE ti.template_id = p_template_id
  ORDER BY ti.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_template_instances() TO authenticated;
GRANT EXECUTE ON FUNCTION create_template_instance(UUID, TEXT, TEXT, UUID, UUID, UUID, UUID, UUID, JSONB, JSONB, TEXT[], TEXT, UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_template_instances_by_context(UUID, UUID, UUID, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_template_instances_by_template(UUID) TO authenticated;