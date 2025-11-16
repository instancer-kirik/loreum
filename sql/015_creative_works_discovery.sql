-- Discovery enhancements for Creative Works
-- Provides better organization and discovery without breaking the flexible structure

-- ============================================
-- VIEWS FOR DISCOVERY
-- ============================================

-- View: Discoverable works (actual creative works, not structural components)
CREATE OR REPLACE VIEW loreum_discoverable_works AS
SELECT
    cw.*,
    COUNT(children.id) as component_count, -- chapters, scenes, verses, etc.
    COALESCE(SUM(children.word_count), 0) + cw.word_count as total_word_count,
    CASE
        WHEN cw.target_word_count > 0 THEN
            ROUND(((cw.word_count + COALESCE(SUM(children.word_count), 0))::NUMERIC / cw.target_word_count) * 100, 1)
        ELSE 0
    END as completion_percentage
FROM loreum_creative_works cw
LEFT JOIN loreum_creative_works children ON children.parent_work_id = cw.id
WHERE cw.parent_work_id IS NULL
  AND cw.creative_type IN (
    'novel', 'short_story', 'novella', 'poem', 'song', 'lyrics',
    'game_script', 'dialogue', 'manga', 'comic', 'screenplay'
  )
GROUP BY cw.id;

-- View: Works with their structural components (for editing, not discovery)
CREATE OR REPLACE VIEW loreum_works_with_components AS
SELECT
    parent.id as work_id,
    parent.title as work_title,
    parent.creative_type as work_type,
    parent.description as work_description,
    parent.status as work_status,
    parent.word_count as work_direct_words,
    parent.target_word_count as work_target,
    parent.genre,
    parent.collection,
    parent.tags as work_tags,
    component.id as component_id,
    component.title as component_title,
    component.creative_type as component_type,
    component.sequence_number as component_sequence,
    component.word_count as component_word_count,
    component.status as component_status,
    component.content as component_content,
    component.summary as component_summary
FROM loreum_creative_works parent
LEFT JOIN loreum_creative_works component
    ON component.parent_work_id = parent.id
WHERE parent.parent_work_id IS NULL
  AND parent.creative_type IN (
    'novel', 'short_story', 'novella', 'poem', 'song', 'lyrics',
    'game_script', 'dialogue', 'manga', 'comic', 'screenplay'
  )
ORDER BY parent.title, component.sequence_number;

-- View: Complete work hierarchy with paths
CREATE OR REPLACE VIEW loreum_work_hierarchy AS
WITH RECURSIVE work_tree AS (
    -- Root level works
    SELECT
        id,
        title,
        creative_type,
        parent_work_id,
        sequence_number,
        word_count,
        status,
        1 as depth,
        title::TEXT as path,
        id as root_id,
        title as root_title,
        creative_type as root_type
    FROM loreum_creative_works
    WHERE parent_work_id IS NULL

    UNION ALL

    -- Recursive children
    SELECT
        cw.id,
        cw.title,
        cw.creative_type,
        cw.parent_work_id,
        cw.sequence_number,
        cw.word_count,
        cw.status,
        wt.depth + 1,
        wt.path || ' > ' || cw.title,
        wt.root_id,
        wt.root_title,
        wt.root_type
    FROM loreum_creative_works cw
    INNER JOIN work_tree wt ON cw.parent_work_id = wt.id
    WHERE wt.depth < 5  -- Prevent infinite recursion, max 5 levels deep
)
SELECT * FROM work_tree
ORDER BY root_title, depth, sequence_number;

-- ============================================
-- DISCOVERY HELPER TABLE
-- ============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS loreum_work_discovery CASCADE;

-- Create discovery helper table for better search and navigation
CREATE TABLE loreum_work_discovery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES loreum_creative_works(id) ON DELETE CASCADE,

    -- Hierarchy information
    root_work_id UUID REFERENCES loreum_creative_works(id) ON DELETE CASCADE,
    parent_work_id UUID REFERENCES loreum_creative_works(id) ON DELETE CASCADE,
    depth INTEGER NOT NULL DEFAULT 1,
    full_path TEXT NOT NULL,

    -- Denormalized key fields for faster queries
    title TEXT NOT NULL,
    creative_type TEXT NOT NULL,
    work_status TEXT NOT NULL,

    -- Aggregated stats
    total_word_count INTEGER DEFAULT 0, -- Including all children
    direct_word_count INTEGER DEFAULT 0, -- Just this work
    child_count INTEGER DEFAULT 0,
    completed_child_count INTEGER DEFAULT 0,

    -- Searchable content (for full-text search)
    searchable_content TEXT, -- Combined title, description, summary, etc.
    all_tags TEXT[], -- Tags from this work and all parents

    -- Discovery categories
    work_medium TEXT, -- 'literature', 'poetry', 'interactive', 'visual', 'audio'
    work_length TEXT, -- 'flash', 'short', 'novella', 'novel', 'epic'

    -- Activity tracking
    last_modified TIMESTAMP WITH TIME ZONE,
    last_session TIMESTAMP WITH TIME ZONE,
    session_count INTEGER DEFAULT 0,
    total_writing_time_hours NUMERIC DEFAULT 0,

    -- Quality/completion metrics
    completion_percentage NUMERIC DEFAULT 0,
    has_outline BOOLEAN DEFAULT FALSE,
    has_summary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(work_id)
);

-- Create indexes for performance
CREATE INDEX idx_discovery_root_work ON loreum_work_discovery(root_work_id);
CREATE INDEX idx_discovery_parent_work ON loreum_work_discovery(parent_work_id);
CREATE INDEX idx_discovery_type ON loreum_work_discovery(creative_type);
CREATE INDEX idx_discovery_medium ON loreum_work_discovery(work_medium);
CREATE INDEX idx_discovery_length ON loreum_work_discovery(work_length);
CREATE INDEX idx_discovery_status ON loreum_work_discovery(work_status);
CREATE INDEX idx_discovery_depth ON loreum_work_discovery(depth);
CREATE INDEX idx_discovery_completion ON loreum_work_discovery(completion_percentage);
CREATE INDEX idx_discovery_modified ON loreum_work_discovery(last_modified DESC);

-- Full text search index
CREATE INDEX idx_discovery_search ON loreum_work_discovery USING gin(to_tsvector('english', searchable_content));

-- ============================================
-- FUNCTION TO REFRESH DISCOVERY DATA
-- ============================================

CREATE OR REPLACE FUNCTION refresh_work_discovery()
RETURNS void AS $$
BEGIN
    -- Clear existing data
    TRUNCATE loreum_work_discovery;

    -- Insert fresh discovery data
    WITH RECURSIVE work_hierarchy AS (
        -- Only include discoverable works (main creative works, not structural components)
        SELECT
            id as work_id,
            id as root_work_id,
            NULL::UUID as parent_work_id,
            1 as depth,
            title::TEXT as full_path,
            title,
            creative_type,
            status,
            word_count
        FROM loreum_creative_works
        WHERE parent_work_id IS NULL
          AND creative_type IN (
                'novel', 'short_story', 'novella', 'poem', 'song', 'lyrics',
                'game_script', 'dialogue', 'manga', 'comic', 'screenplay'
            )

        -- We don't include child works in discovery table anymore
        -- They're only for internal structure, not discovery
    ),
    work_stats AS (
        SELECT
            cw.id as work_id,
            cw.word_count as direct_word_count,
            COUNT(children.id) as child_count,
            COUNT(children.id) FILTER (WHERE children.status = 'complete') as completed_child_count,
            COALESCE(SUM(children.word_count), 0) + cw.word_count as total_word_count,
            COALESCE(cw.outline IS NOT NULL AND cw.outline != '', FALSE) as has_outline,
            COALESCE(cw.summary IS NOT NULL AND cw.summary != '', FALSE) as has_summary,
            CASE
                WHEN cw.target_word_count > 0 THEN
                    LEAST(100, ROUND((cw.word_count::NUMERIC / cw.target_word_count) * 100, 1))
                ELSE 0
            END as completion_percentage,
            -- Combine searchable text
            COALESCE(cw.title, '') || ' ' ||
            COALESCE(cw.description, '') || ' ' ||
            COALESCE(cw.summary, '') || ' ' ||
            COALESCE(cw.genre, '') || ' ' ||
            COALESCE(array_to_string(cw.tags, ' '), '') as searchable_content,
            cw.tags as all_tags,
            -- Determine work medium
            CASE
                WHEN cw.creative_type IN ('novel', 'novella', 'short_story') THEN 'literature'
                WHEN cw.creative_type IN ('poem', 'song', 'lyrics') THEN 'poetry'
                WHEN cw.creative_type IN ('game_script', 'dialogue') THEN 'interactive'
                WHEN cw.creative_type IN ('screenplay', 'manga', 'comic') THEN 'visual'
                WHEN cw.creative_type IN ('song', 'lyrics') THEN 'audio'
                ELSE 'mixed'
            END as work_medium,
            -- Determine work length
            CASE
                WHEN cw.creative_type = 'novel' AND cw.target_word_count > 80000 THEN 'epic'
                WHEN cw.creative_type = 'novel' THEN 'novel'
                WHEN cw.creative_type = 'novella' THEN 'novella'
                WHEN cw.creative_type = 'short_story' AND cw.target_word_count < 1000 THEN 'flash'
                WHEN cw.creative_type = 'short_story' THEN 'short'
                WHEN cw.creative_type = 'poem' THEN 'short'
                ELSE 'varied'
            END as work_length,
            cw.updated_at as last_modified
        FROM loreum_creative_works cw
        LEFT JOIN loreum_creative_works children ON children.parent_work_id = cw.id
        GROUP BY cw.id
    ),
    session_stats AS (
        SELECT
            work_id,
            MAX(session_start) as last_session,
            COUNT(*) as session_count,
            ROUND(SUM(EXTRACT(EPOCH FROM (COALESCE(session_end, NOW()) - session_start))/3600)::NUMERIC, 2) as total_writing_time_hours
        FROM loreum_creative_sessions
        GROUP BY work_id
    )
    INSERT INTO loreum_work_discovery (
        work_id, root_work_id, parent_work_id, depth, full_path,
        title, creative_type, work_status,
        direct_word_count, child_count, completed_child_count, total_word_count,
        searchable_content, all_tags,
        work_medium, work_length,
        completion_percentage, has_outline, has_summary,
        last_modified, last_session, session_count, total_writing_time_hours
    )
    SELECT
        wh.work_id,
        wh.root_work_id,
        wh.parent_work_id,
        wh.depth,
        wh.full_path,
        wh.title,
        wh.creative_type,
        wh.status,
        ws.direct_word_count,
        ws.child_count,
        ws.completed_child_count,
        ws.total_word_count,
        ws.searchable_content,
        ws.all_tags,
        ws.work_medium,
        ws.work_length,
        ws.completion_percentage,
        ws.has_outline,
        ws.has_summary,
        ws.last_modified,
        ss.last_session,
        COALESCE(ss.session_count, 0),
        COALESCE(ss.total_writing_time_hours, 0)
    FROM work_hierarchy wh
    JOIN work_stats ws ON wh.work_id = ws.work_id
    LEFT JOIN session_stats ss ON wh.work_id = ss.work_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS TO KEEP DISCOVERY TABLE UPDATED
-- ============================================

CREATE OR REPLACE FUNCTION update_discovery_on_work_change()
RETURNS TRIGGER AS $$
BEGIN
    -- For now, just refresh everything (can be optimized later)
    PERFORM refresh_work_discovery();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on creative works changes
CREATE TRIGGER refresh_discovery_on_work_change
    AFTER INSERT OR UPDATE OR DELETE ON loreum_creative_works
    FOR EACH STATEMENT EXECUTE FUNCTION update_discovery_on_work_change();

-- Trigger on session changes (less frequent refresh)
CREATE TRIGGER refresh_discovery_on_session_change
    AFTER INSERT OR UPDATE ON loreum_creative_sessions
    FOR EACH STATEMENT EXECUTE FUNCTION update_discovery_on_work_change();

-- ============================================
-- USEFUL QUERY FUNCTIONS
-- ============================================

-- Function: Get reading order for a work (flattened tree)
CREATE OR REPLACE FUNCTION get_reading_order(root_work_id UUID)
RETURNS TABLE(
    work_id UUID,
    title TEXT,
    creative_type TEXT,
    sequence_number INTEGER,
    depth INTEGER,
    reading_order INTEGER
) AS $$
WITH RECURSIVE reading_tree AS (
    SELECT
        id, title, creative_type, sequence_number, 1 as depth, 1 as reading_order
    FROM loreum_creative_works
    WHERE id = root_work_id

    UNION ALL

    SELECT
        cw.id, cw.title, cw.creative_type, cw.sequence_number,
        rt.depth + 1,
        ROW_NUMBER() OVER (ORDER BY rt.reading_order, cw.sequence_number)::INTEGER + rt.reading_order
    FROM loreum_creative_works cw
    JOIN reading_tree rt ON cw.parent_work_id = rt.id
)
SELECT * FROM reading_tree ORDER BY reading_order;
$$ LANGUAGE sql;

-- ============================================
-- INITIAL DATA REFRESH
-- ============================================

-- Populate the discovery table with existing data
SELECT refresh_work_discovery();

-- ============================================
-- HELPFUL QUERIES FOR THE APP
-- ============================================

COMMENT ON VIEW loreum_discoverable_works IS 'Main creative works for discovery (novels, games, poems, etc. - not chapters/scenes)';
COMMENT ON VIEW loreum_works_with_components IS 'Creative works with their structural components for editing';
COMMENT ON VIEW loreum_work_hierarchy IS 'Complete hierarchy of all works with paths';
COMMENT ON TABLE loreum_work_discovery IS 'Denormalized discovery data for fast searching and browsing';
COMMENT ON FUNCTION refresh_work_discovery() IS 'Rebuilds the discovery table - call after bulk imports';
COMMENT ON FUNCTION get_reading_order(UUID) IS 'Returns all works in a tree in reading order';

-- Example queries:

-- Find all novels with more than 50% completion
-- SELECT * FROM loreum_work_discovery
-- WHERE creative_type IN ('novel', 'novella')
-- AND completion_percentage > 50
-- ORDER BY completion_percentage DESC;

-- Search for works mentioning "dragon"
-- SELECT * FROM loreum_work_discovery
-- WHERE to_tsvector('english', searchable_content) @@ to_tsquery('english', 'dragon');

-- Get most active projects (by recent sessions)
-- SELECT * FROM loreum_work_discovery
-- WHERE last_session > NOW() - INTERVAL '7 days'
-- ORDER BY session_count DESC;

-- Find all short stories
-- SELECT * FROM loreum_work_discovery
-- WHERE creative_type = 'short_story'
-- ORDER BY last_modified DESC;

-- Browse all interactive content (games)
-- SELECT * FROM loreum_work_discovery
-- WHERE work_medium = 'interactive'
-- ORDER BY title;
