-- Migration 011: Finalize context drops separation from templates
-- This migration is mostly a no-op since migration 009 already did the cleanup
-- This file exists for completeness and to document the migration sequence

-- Verify that context-drop templates have been removed from the constraint
DO $$
DECLARE
    constraint_text TEXT;
BEGIN
    SELECT pg_get_constraintdef(oid) INTO constraint_text
    FROM pg_constraint 
    WHERE conname = 'loreum_ipsumarium_templates_type_check';
    
    IF constraint_text LIKE '%context-drop%' THEN
        RAISE EXCEPTION 'context-drop still exists in templates constraint. Run migration 009 first.';
    ELSE
        RAISE NOTICE 'Templates constraint properly updated - context-drop removed';
    END IF;
END $$;

-- Verify that the new context_drops table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'context_drops') THEN
        RAISE EXCEPTION 'context_drops table does not exist. Run migration 010 first.';
    ELSE
        RAISE NOTICE 'context_drops table exists';
    END IF;
END $$;

-- Clean up any remaining context-drop templates if they still exist
-- This is a safety net in case migration 009 cleanup wasn't completed
DELETE FROM loreum_ipsumarium_templates WHERE type = 'context-drop';

-- Report the final state
DO $$
DECLARE
    template_count INTEGER;
    context_drop_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO template_count FROM loreum_ipsumarium_templates;
    SELECT COUNT(*) INTO context_drop_count FROM context_drops;
    
    RAISE NOTICE '=== MIGRATION 011 COMPLETE ===';
    RAISE NOTICE 'Templates in loreum_ipsumarium_templates: %', template_count;
    RAISE NOTICE 'Context drops in context_drops table: %', context_drop_count;
    RAISE NOTICE 'Context drops successfully separated from templates system';
END $$;

-- Add final documentation
COMMENT ON TABLE context_drops IS 'Dedicated table for conversation exports and chat context drops, separated from the templates system';
COMMENT ON TABLE loreum_ipsumarium_templates IS 'Template definitions for game entities. Context drops are now stored in their own dedicated table.';