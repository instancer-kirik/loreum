-- Migration: Create context_drops table
-- This migration creates a dedicated table for context drops (conversation exports)
-- Context drops are not templates - they are specific conversation instances
-- Run migration 009 first to clean up the old implementation

-- Create context_drops table
CREATE TABLE IF NOT EXISTS context_drops (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    raw_content text NOT NULL,
    conversation_context text DEFAULT 'general',
    participants text[] NOT NULL DEFAULT '{}',
    annotations jsonb DEFAULT '[]',
    tags text[] NOT NULL DEFAULT '{}',
    metadata jsonb NOT NULL DEFAULT '{}',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    -- Computed fields for quick access
    message_count integer DEFAULT 0,
    annotation_count integer DEFAULT 0,
    participant_count integer DEFAULT 0
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_context_drops_created_at ON context_drops(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_context_drops_conversation_context ON context_drops(conversation_context);
CREATE INDEX IF NOT EXISTS idx_context_drops_participants ON context_drops USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_context_drops_tags ON context_drops USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_context_drops_annotations ON context_drops USING GIN(annotations);
CREATE INDEX IF NOT EXISTS idx_context_drops_name_search ON context_drops USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Add full-text search index for content
CREATE INDEX IF NOT EXISTS idx_context_drops_content_search ON context_drops USING GIN(to_tsvector('english', raw_content));

-- Create trigger to automatically update computed fields
CREATE OR REPLACE FUNCTION update_context_drop_computed_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Count messages (rough estimate based on role markers)
    NEW.message_count = (
        LENGTH(NEW.raw_content) - LENGTH(REPLACE(REPLACE(REPLACE(REPLACE(
            NEW.raw_content, '**User:**', ''), '**You:**', ''), 
            '**ChatGPT:**', ''), '**Assistant:**', ''))
    ) / 10; -- Rough estimate
    
    -- Count annotations
    NEW.annotation_count = COALESCE(jsonb_array_length(NEW.annotations), 0);
    
    -- Count participants
    NEW.participant_count = array_length(NEW.participants, 1);
    
    -- Update timestamp
    NEW.updated_at = now();
    
    RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_context_drop_computed_fields ON context_drops;
CREATE TRIGGER trigger_update_context_drop_computed_fields
    BEFORE INSERT OR UPDATE ON context_drops
    FOR EACH ROW
    EXECUTE FUNCTION update_context_drop_computed_fields();

-- Create view for enhanced context drops with search ranking
CREATE OR REPLACE VIEW context_drops_enhanced AS
SELECT 
    cd.*,
    -- Extract some metadata for easier querying
    COALESCE((cd.metadata->>'source')::text, 'manual') as source,
    COALESCE((cd.metadata->>'entity_count')::int, 0) as entity_count,
    COALESCE((cd.metadata->>'linked_entities')::int, 0) as linked_entities,
    -- Calculate content stats
    LENGTH(cd.raw_content) as content_length,
    -- Create searchable text
    cd.name || ' ' || COALESCE(cd.description, '') || ' ' || cd.raw_content as searchable_content
FROM context_drops cd;

-- Function to search context drops with ranking
CREATE OR REPLACE FUNCTION search_context_drops(
    search_term text,
    limit_count integer DEFAULT 20,
    offset_count integer DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    name text,
    description text,
    conversation_context text,
    created_at timestamp with time zone,
    annotation_count integer,
    message_count integer,
    search_rank real
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cd.id,
        cd.name,
        cd.description,
        cd.conversation_context,
        cd.created_at,
        cd.annotation_count,
        cd.message_count,
        ts_rank(
            to_tsvector('english', cd.name || ' ' || COALESCE(cd.description, '') || ' ' || cd.raw_content),
            plainto_tsquery('english', search_term)
        ) as search_rank
    FROM context_drops cd
    WHERE to_tsvector('english', cd.name || ' ' || COALESCE(cd.description, '') || ' ' || cd.raw_content) 
          @@ plainto_tsquery('english', search_term)
    ORDER BY search_rank DESC, cd.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;

-- Function to get context drops by conversation context
CREATE OR REPLACE FUNCTION get_context_drops_by_context(
    context_name text,
    limit_count integer DEFAULT 20
)
RETURNS SETOF context_drops
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT cd.*
    FROM context_drops cd
    WHERE cd.conversation_context = context_name
    ORDER BY cd.created_at DESC
    LIMIT limit_count;
END;
$$;

-- Function to extract entities from context drop annotations
CREATE OR REPLACE FUNCTION get_context_drop_entities(drop_id uuid)
RETURNS TABLE (
    id text,
    text text,
    entity_type text,
    entity_id text,
    notes text,
    start_pos integer,
    end_pos integer,
    color text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (annotation->>'id')::text,
        (annotation->>'text')::text,
        (annotation->>'entity_type')::text,
        (annotation->>'entity_id')::text,
        (annotation->>'notes')::text,
        (annotation->>'start_pos')::integer,
        (annotation->>'end_pos')::integer,
        (annotation->>'color')::text
    FROM context_drops,
         jsonb_array_elements(annotations) as annotation
    WHERE context_drops.id = drop_id;
END;
$$;

-- Add Row Level Security (RLS) policies
ALTER TABLE context_drops ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see all context drops (adjust based on your auth needs)
CREATE POLICY context_drops_select_policy ON context_drops
    FOR SELECT USING (true);

-- Policy: Users can insert their own context drops
CREATE POLICY context_drops_insert_policy ON context_drops
    FOR INSERT WITH CHECK (true);

-- Policy: Users can update their own context drops (adjust based on your auth needs)
CREATE POLICY context_drops_update_policy ON context_drops
    FOR UPDATE USING (true);

-- Policy: Users can delete their own context drops (adjust based on your auth needs)
CREATE POLICY context_drops_delete_policy ON context_drops
    FOR DELETE USING (true);

-- Add helpful comments
COMMENT ON TABLE context_drops IS 'Storage for conversation exports and chat context drops';
COMMENT ON COLUMN context_drops.raw_content IS 'The raw conversation text/markdown content';
COMMENT ON COLUMN context_drops.annotations IS 'JSON array of entity annotations found in the conversation';
COMMENT ON COLUMN context_drops.conversation_context IS 'The context or topic of the conversation';
COMMENT ON COLUMN context_drops.participants IS 'Array of participant names/roles in the conversation';
COMMENT ON COLUMN context_drops.metadata IS 'Additional metadata like source, import settings, etc.';

COMMENT ON FUNCTION search_context_drops(text, integer, integer) IS 'Full-text search across context drops with ranking';
COMMENT ON FUNCTION get_context_drops_by_context(text, integer) IS 'Get context drops filtered by conversation context';
COMMENT ON FUNCTION get_context_drop_entities(uuid) IS 'Extract entity annotations from a specific context drop';
COMMENT ON TRIGGER trigger_update_context_drop_computed_fields ON context_drops IS 'Automatically update computed fields when context drops are modified';