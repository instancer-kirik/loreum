-- Check Migration State Script
-- This script helps determine which migrations have been run and what needs to be done

-- Check if context_drops table exists
SELECT 
    'context_drops table exists?' as check_item,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'context_drops'
    ) as result;

-- Check if context-drop type is still in templates constraint
SELECT 
    'context-drop in templates constraint?' as check_item,
    pg_get_constraintdef(oid) LIKE '%context-drop%' as result
FROM pg_constraint 
WHERE conname = 'loreum_ipsumarium_templates_type_check';

-- Count context-drop templates
SELECT 
    'context-drop templates count' as check_item,
    COUNT(*)::text as result
FROM loreum_ipsumarium_templates 
WHERE type = 'context-drop';

-- Check for old context-drop functions
SELECT 
    'Old function: update_context_drop_stats' as check_item,
    EXISTS (
        SELECT FROM pg_proc 
        WHERE proname = 'update_context_drop_stats'
    )::text as result
UNION ALL
SELECT 
    'Old function: find_context_drops_mentioning_entity' as check_item,
    EXISTS (
        SELECT FROM pg_proc 
        WHERE proname = 'find_context_drops_mentioning_entity'
    )::text as result;

-- Check for old context-drop indexes
SELECT 
    'Old index: ' || indexname as check_item,
    'exists' as result
FROM pg_indexes 
WHERE tablename = 'loreum_ipsumarium_templates'
AND indexname IN (
    'idx_loreum_ipsumarium_templates_type_context_drop',
    'idx_loreum_ipsumarium_templates_metadata_annotations', 
    'idx_loreum_ipsumarium_templates_metadata_conversation_context'
);

-- Check for old context_drops view
SELECT 
    'Old view: context_drops' as check_item,
    EXISTS (
        SELECT FROM information_schema.views 
        WHERE table_schema = 'public' 
        AND table_name = 'context_drops'
    )::text as result;

-- Summary recommendation
SELECT '
=== MIGRATION STATE SUMMARY ===

Based on the results above, run these migrations in order:

1. If context_drops table does NOT exist:
   RUN: 010_create_context_drops_table.sql

2. If context-drop templates exist (count > 0):
   RUN: 012_cleanup_context_drop_migration.sql

3. If old functions/indexes/views exist:
   They will be cleaned up by migration 012

Migration 011 can be skipped (it is just verification).
' as recommendation;