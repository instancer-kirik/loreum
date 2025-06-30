-- Migration: Migrate context drops data from temp table to new context_drops table
-- This migration moves data from the temporary table created in migration 009
-- Run this AFTER migration 010 has created the new context_drops table

-- Check if temp table exists and has data
DO $$
DECLARE
    temp_count INTEGER;
    table_exists BOOLEAN;
BEGIN
    -- Check if temp table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'temp_context_drops'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'temp_context_drops table not found. Nothing to migrate.';
        RETURN;
    END IF;
    
    -- Check count
    SELECT COUNT(*) INTO temp_count FROM temp_context_drops;
    RAISE NOTICE 'Found % records in temp_context_drops to migrate', temp_count;
    
    IF temp_count = 0 THEN
        RAISE NOTICE 'No data to migrate.';
        RETURN;
    END IF;
END $$;

-- Migrate data from temp table to new context_drops table
INSERT INTO context_drops (
    name,
    description,
    raw_content,
    conversation_context,
    participants,
    annotations,
    tags,
    metadata,
    created_at,
    updated_at
)
SELECT 
    name,
    description,
    raw_content,
    conversation_context,
    participants,
    annotations,
    tags,
    -- Clean up metadata by removing fields that are now top-level columns
    metadata - 'raw_content' - 'conversation_context' - 'participants' - 'annotations',
    created_at,
    updated_at
FROM temp_context_drops;

-- Report migration results
DO $$
DECLARE
    migrated_count INTEGER;
    temp_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO migrated_count FROM context_drops;
    SELECT COUNT(*) INTO temp_count FROM temp_context_drops;
    
    RAISE NOTICE '=== DATA MIGRATION COMPLETE ===';
    RAISE NOTICE 'Records in temp_context_drops: %', temp_count;
    RAISE NOTICE 'Total records now in context_drops: %', migrated_count;
    RAISE NOTICE 'Migration successful!';
    
    -- Show sample of migrated data
    RAISE NOTICE '=== SAMPLE MIGRATED DATA ===';
    FOR rec IN 
        SELECT name, conversation_context, array_length(participants, 1) as participant_count
        FROM context_drops 
        LIMIT 5
    LOOP
        RAISE NOTICE 'Name: %, Context: %, Participants: %', rec.name, rec.conversation_context, rec.participant_count;
    END LOOP;
END $$;

-- Clean up instructions
DO $$
BEGIN
    RAISE NOTICE '=== CLEANUP INSTRUCTIONS ===';
    RAISE NOTICE 'After verifying the migration was successful:';
    RAISE NOTICE '1. Drop the temp table: DROP TABLE temp_context_drops;';
    RAISE NOTICE '2. In migration 009, uncomment the DELETE statement to remove old templates';
    RAISE NOTICE '3. Run migration 011 if needed (though most of it is already done)';
END $$;

-- Verify data integrity
DO $$
DECLARE
    annotation_issues INTEGER;
    content_issues INTEGER;
BEGIN
    -- Check for records with empty raw_content
    SELECT COUNT(*) INTO content_issues 
    FROM context_drops 
    WHERE raw_content = '' OR raw_content IS NULL;
    
    IF content_issues > 0 THEN
        RAISE WARNING 'Found % records with empty raw_content', content_issues;
    END IF;
    
    -- Check for invalid JSON in annotations
    SELECT COUNT(*) INTO annotation_issues
    FROM context_drops 
    WHERE NOT (annotations::text ~ '^(\[.*\])$' OR annotations::text = '[]');
    
    IF annotation_issues > 0 THEN
        RAISE WARNING 'Found % records with potentially invalid annotations JSON', annotation_issues;
    END IF;
    
    IF content_issues = 0 AND annotation_issues = 0 THEN
        RAISE NOTICE 'Data integrity check passed!';
    END IF;
END $$;