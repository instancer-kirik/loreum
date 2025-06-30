-- Migration 012: Simple cleanup of context-drop migration conflicts
-- This migration cleans up templates since context_drops is currently a view

-- Check what type of object context_drops is
DO $$
DECLARE
    object_type TEXT;
BEGIN
    -- Check if it's a table or view
    SELECT 
        CASE 
            WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'context_drops' AND table_type = 'BASE TABLE') THEN 'table'
            WHEN EXISTS (SELECT FROM information_schema.views WHERE table_name = 'context_drops') THEN 'view'
            ELSE 'not found'
        END INTO object_type;
    
    RAISE NOTICE 'context_drops is a: %', object_type;
    
    IF object_type = 'view' THEN
        RAISE NOTICE 'context_drops is a VIEW based on templates - migration 010 has not been run';
        RAISE NOTICE 'Will clean up templates and drop the view';
        -- Drop the view since we're removing context-drop from templates
        DROP VIEW IF EXISTS context_drops CASCADE;
    ELSIF object_type = 'not found' THEN
        RAISE NOTICE 'context_drops does not exist - migration 010 has not been run';
    END IF;
END $$;

-- Remove context-drop templates from the templates table
DELETE FROM loreum_ipsumarium_templates WHERE type = 'context-drop';

-- Update the templates table constraint to remove context-drop
ALTER TABLE loreum_ipsumarium_templates 
DROP CONSTRAINT IF EXISTS loreum_ipsumarium_templates_type_check;

ALTER TABLE loreum_ipsumarium_templates 
ADD CONSTRAINT loreum_ipsumarium_templates_type_check 
CHECK (type = ANY (ARRAY[
    'species'::text, 
    'tech'::text, 
    'item'::text, 
    'power'::text, 
    'vehicle'::text, 
    'starship'::text, 
    'culture'::text, 
    'civilization'::text, 
    'magic_system'::text, 
    'enchantment'::text
]));

-- Clean up old functions and triggers from templates
DROP TRIGGER IF EXISTS trigger_update_context_drop_stats ON loreum_ipsumarium_templates;
DROP FUNCTION IF EXISTS update_context_drop_stats() CASCADE;
DROP FUNCTION IF EXISTS find_context_drops_mentioning_entity(text) CASCADE;

-- Drop any template-based context drop view
DROP VIEW IF EXISTS context_drops CASCADE;

-- Drop old context-drop specific indexes from templates table
DROP INDEX IF EXISTS idx_loreum_ipsumarium_templates_type_context_drop;
DROP INDEX IF EXISTS idx_loreum_ipsumarium_templates_metadata_annotations;
DROP INDEX IF EXISTS idx_loreum_ipsumarium_templates_metadata_conversation_context;

-- Update comments to reflect the new architecture
COMMENT ON CONSTRAINT loreum_ipsumarium_templates_type_check ON loreum_ipsumarium_templates 
IS 'Ensures type is one of the allowed template types. Context drops now have their own dedicated table.';

COMMENT ON TABLE loreum_ipsumarium_templates 
IS 'Template definitions for game entities. Context drops are now stored in their own dedicated table.';

-- Show final counts and next steps
DO $$
DECLARE
    template_count INTEGER;
    deleted_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO template_count FROM loreum_ipsumarium_templates;
    
    RAISE NOTICE '=== MIGRATION 012 COMPLETE ===';
    RAISE NOTICE 'Templates remaining: %', template_count;
    RAISE NOTICE '';
    RAISE NOTICE 'IMPORTANT: The context_drops VIEW has been dropped.';
    RAISE NOTICE 'Next step: Run migration 010_create_context_drops_table.sql to create the proper context_drops table';
    RAISE NOTICE '';
    RAISE NOTICE 'The context-drop type has been removed from templates constraint.';
END $$;