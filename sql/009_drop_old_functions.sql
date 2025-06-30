-- Migration 009: Drop old context-drop functions from migration 008
-- This migration cleans up functions that were created for the template-based context drops
-- Run this BEFORE migration 010 to avoid conflicts

-- Drop the old get_context_drop_entities function that was created for templates
DROP FUNCTION IF EXISTS get_context_drop_entities(uuid) CASCADE;

-- Drop other functions that might conflict
DROP FUNCTION IF EXISTS find_context_drops_mentioning_entity(text) CASCADE;
DROP FUNCTION IF EXISTS update_context_drop_stats() CASCADE;

-- Drop any remaining triggers on templates table
DROP TRIGGER IF EXISTS trigger_update_context_drop_stats ON loreum_ipsumarium_templates;

-- Log what was cleaned up
DO $$
BEGIN
    RAISE NOTICE '=== MIGRATION 009 COMPLETE ===';
    RAISE NOTICE 'Dropped old context-drop functions from migration 008';
    RAISE NOTICE 'You can now safely run migration 010 to create the context_drops table';
END $$;