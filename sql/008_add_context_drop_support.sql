-- Migration: Add context-drop support to loreum_ipsumarium_templates table
-- This migration adds support for context drops with entity annotations

-- Note: The type column is a string, not an enum, so no ALTER TYPE needed

-- Add indexes for better performance on context-drop queries
CREATE INDEX IF NOT EXISTS idx_loreum_ipsumarium_templates_type_context_drop 
ON loreum_ipsumarium_templates(type) 
WHERE type = 'context-drop';

-- Add index on metadata for context drop specific queries
CREATE INDEX IF NOT EXISTS idx_loreum_ipsumarium_templates_metadata_annotations 
ON loreum_ipsumarium_templates USING GIN ((metadata->'annotations')) 
WHERE type = 'context-drop';

-- Add index for conversation context searches
CREATE INDEX IF NOT EXISTS idx_loreum_ipsumarium_templates_metadata_conversation_context 
ON loreum_ipsumarium_templates ((metadata->>'conversation_context')) 
WHERE type = 'context-drop';

-- Create a view for context drops with computed fields
CREATE OR REPLACE VIEW context_drops AS
SELECT 
    id,
    name,
    description,
    tags,
    metadata,
    created_at,
    updated_at,
    -- Extract computed fields from metadata
    COALESCE((metadata->>'conversation_context')::text, 'general') as conversation_context,
    COALESCE(jsonb_array_length(metadata->'participants'), 0) as participant_count,
    COALESCE(jsonb_array_length(metadata->'annotations'), 0) as annotation_count,
    COALESCE((metadata->>'entity_count')::int, 0) as entity_count,
    COALESCE((metadata->>'linked_entities')::int, 0) as linked_entities,
    COALESCE((metadata->>'pending_entities')::int, 0) as pending_entities,
    length(metadata->>'raw_content') as content_length
FROM loreum_ipsumarium_templates 
WHERE type = 'context-drop';

-- Add RLS policies for context drops (same as other templates)
-- Note: These will inherit the existing policies for ipsum_templates

-- Add helpful comments
COMMENT ON INDEX idx_loreum_ipsumarium_templates_type_context_drop IS 'Index for filtering context-drop templates';
COMMENT ON INDEX idx_loreum_ipsumarium_templates_metadata_annotations IS 'GIN index for searching entity annotations in context drops';
COMMENT ON INDEX idx_loreum_ipsumarium_templates_metadata_conversation_context IS 'Index for filtering by conversation context';
COMMENT ON VIEW context_drops IS 'Materialized view of context drops with computed annotation statistics';

-- Function to extract entities from context drop annotations
CREATE OR REPLACE FUNCTION get_context_drop_entities(template_id uuid)
RETURNS TABLE (
    entity_text text,
    entity_type text,
    entity_id uuid,
    notes text,
    is_linked boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (annotation->>'text')::text as entity_text,
        (annotation->>'entity_type')::text as entity_type,
        CASE 
            WHEN annotation->>'entity_id' IS NOT NULL 
            THEN (annotation->>'entity_id')::uuid 
            ELSE NULL 
        END as entity_id,
        (annotation->>'notes')::text as notes,
        (annotation->>'entity_id') IS NOT NULL as is_linked
    FROM loreum_ipsumarium_templates,
         jsonb_array_elements(metadata->'annotations') as annotation
    WHERE id = template_id 
    AND type = 'context-drop';
END;
$$;

COMMENT ON FUNCTION get_context_drop_entities(uuid) IS 'Extract entity annotations from a context drop template';

-- Function to find context drops that mention a specific entity
CREATE OR REPLACE FUNCTION find_context_drops_mentioning_entity(entity_name text)
RETURNS TABLE (
    template_id uuid,
    template_name text,
    conversation_context text,
    annotation_text text,
    annotation_notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id as template_id,
        t.name as template_name,
        COALESCE((t.metadata->>'conversation_context')::text, 'general') as conversation_context,
        (annotation->>'text')::text as annotation_text,
        (annotation->>'notes')::text as annotation_notes
    FROM loreum_ipsumarium_templates t,
         jsonb_array_elements(t.metadata->'annotations') as annotation
    WHERE t.type = 'context-drop'
    AND (annotation->>'text')::text ILIKE '%' || entity_name || '%';
END;
$$;

COMMENT ON FUNCTION find_context_drops_mentioning_entity(text) IS 'Find all context drops that mention a specific entity by name';

-- Create trigger to automatically update entity counts when annotations change
CREATE OR REPLACE FUNCTION update_context_drop_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only process context-drop templates
    IF NEW.type = 'context-drop' AND NEW.metadata IS NOT NULL THEN
        -- Update computed stats in metadata
        NEW.metadata = NEW.metadata || jsonb_build_object(
            'entity_count', COALESCE(jsonb_array_length(NEW.metadata->'annotations'), 0),
            'linked_entities', (
                SELECT COUNT(*)
                FROM jsonb_array_elements(NEW.metadata->'annotations') as annotation
                WHERE annotation->>'entity_id' IS NOT NULL
            ),
            'pending_entities', (
                SELECT COUNT(*)
                FROM jsonb_array_elements(NEW.metadata->'annotations') as annotation
                WHERE annotation->>'entity_id' IS NULL
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_context_drop_stats ON loreum_ipsumarium_templates;
CREATE TRIGGER trigger_update_context_drop_stats
    BEFORE INSERT OR UPDATE ON loreum_ipsumarium_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_context_drop_stats();

COMMENT ON TRIGGER trigger_update_context_drop_stats ON loreum_ipsumarium_templates IS 'Automatically update entity statistics for context drops';

-- Insert example context drop template types for reference
-- (This will help with UI type selection)

-- Grant permissions (assuming existing RLS policies apply)
-- No additional grants needed as context drops use the same table as other templates