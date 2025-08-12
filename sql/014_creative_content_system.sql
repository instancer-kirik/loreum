-- Creative Content System for Loreum
-- Simple system for managing original creative works (novels, poetry, games, manga, etc.)
-- References existing worldbuilding data without templating creative content

-- Main creative works table
CREATE TABLE IF NOT EXISTS loreum_creative_works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT DEFAULT '',

    -- Type and format
    creative_type TEXT NOT NULL CHECK (creative_type IN (
        'novel', 'short_story', 'novella', 'poem', 'song', 'lyrics',
        'game_script', 'dialogue', 'manga', 'comic', 'screenplay',
        'chapter', 'scene', 'verse', 'stanza', 'panel'
    )),
    content_format TEXT DEFAULT 'prose' CHECK (content_format IN (
        'prose', 'verse', 'free_verse', 'dialogue', 'script',
        'lyrics', 'panels', 'mixed'
    )),

    -- Hierarchy support (chapters within novels, scenes within chapters, etc.)
    parent_work_id UUID REFERENCES loreum_creative_works(id) ON DELETE CASCADE,
    sequence_number INTEGER DEFAULT 1,

    -- Progress tracking
    status TEXT DEFAULT 'planning' CHECK (status IN (
        'planning', 'outlining', 'drafting', 'first_draft',
        'revising', 'editing', 'complete', 'published', 'abandoned'
    )),
    word_count INTEGER DEFAULT 0,
    target_word_count INTEGER DEFAULT 0,

    -- Worldbuilding context (optional references to existing data)
    timeline_id UUID REFERENCES loreum_timelines(id) ON DELETE SET NULL,
    world_id UUID REFERENCES loreum_worlds(id) ON DELETE SET NULL,
    primary_location_id UUID REFERENCES loreum_regions(id) ON DELETE SET NULL,
    pov_character_id UUID REFERENCES loreum_characters(id) ON DELETE SET NULL,

    -- Arrays of worldbuilding references
    featured_characters UUID[] DEFAULT '{}', -- References to loreum_characters
    referenced_locations UUID[] DEFAULT '{}', -- References to loreum_regions
    referenced_events UUID[] DEFAULT '{}', -- References to loreum_lore_nodes
    referenced_cultures UUID[] DEFAULT '{}', -- References to civilizations/cultures

    -- Creative metadata
    genre TEXT,
    mood TEXT,
    themes TEXT[] DEFAULT '{}',
    tone TEXT,
    style_notes TEXT,

    -- Structure and planning
    outline TEXT,
    summary TEXT,
    notes JSONB DEFAULT '{}',

    -- Publication/sharing
    is_public BOOLEAN DEFAULT FALSE,
    external_links JSONB DEFAULT '{}', -- Links to published versions, etc.

    -- Tagging and organization
    tags TEXT[] DEFAULT '{}',
    collection TEXT, -- Group related works (e.g., "Gaia-7 Chronicles")

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Writing sessions table (track creative sessions)
CREATE TABLE IF NOT EXISTS loreum_creative_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES loreum_creative_works(id) ON DELETE CASCADE,

    -- Session timing
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,

    -- Progress tracking
    words_written INTEGER DEFAULT 0,
    words_edited INTEGER DEFAULT 0,

    -- Session type and context
    activity_type TEXT NOT NULL DEFAULT 'writing' CHECK (activity_type IN (
        'writing', 'editing', 'revising', 'outlining', 'research',
        'brainstorming', 'worldbuilding_research', 'character_development'
    )),

    -- Session quality (optional)
    productivity_rating INTEGER CHECK (productivity_rating >= 1 AND productivity_rating <= 5),
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    flow_state_rating INTEGER CHECK (flow_state_rating >= 1 AND flow_state_rating <= 5),

    -- Notes and reflections
    session_notes TEXT,
    breakthrough_moments TEXT,

    -- Word count at session start (for calculating delta)
    starting_word_count INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plot threads table (story arcs that can span multiple works/chapters)
CREATE TABLE IF NOT EXISTS loreum_plot_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,

    -- Can belong to a specific work or span multiple works
    primary_work_id UUID REFERENCES loreum_creative_works(id) ON DELETE CASCADE,

    -- Thread characteristics
    thread_type TEXT NOT NULL DEFAULT 'main' CHECK (thread_type IN (
        'main', 'subplot', 'character_arc', 'mystery', 'romance',
        'conflict', 'theme', 'worldbuilding', 'backstory'
    )),
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'resolved', 'abandoned')),

    -- Thread progression
    starts_in_work_id UUID REFERENCES loreum_creative_works(id) ON DELETE SET NULL,
    resolves_in_work_id UUID REFERENCES loreum_creative_works(id) ON DELETE SET NULL,

    -- Worldbuilding connections
    related_characters UUID[] DEFAULT '{}',
    related_locations UUID[] DEFAULT '{}',
    related_events UUID[] DEFAULT '{}',

    -- Plot details
    stakes JSONB DEFAULT '{}',
    obstacles JSONB DEFAULT '[]',
    resolution_notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table: Plot threads to creative works (many-to-many)
CREATE TABLE IF NOT EXISTS loreum_plot_thread_works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_thread_id UUID NOT NULL REFERENCES loreum_plot_threads(id) ON DELETE CASCADE,
    work_id UUID NOT NULL REFERENCES loreum_creative_works(id) ON DELETE CASCADE,

    -- How this work relates to the plot thread
    relationship_type TEXT NOT NULL CHECK (relationship_type IN (
        'introduces', 'develops', 'complicates', 'resolves', 'references', 'foreshadows'
    )),
    significance INTEGER DEFAULT 1 CHECK (significance >= 1 AND significance <= 3),

    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(plot_thread_id, work_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_creative_works_parent ON loreum_creative_works(parent_work_id);
CREATE INDEX IF NOT EXISTS idx_creative_works_timeline ON loreum_creative_works(timeline_id);
CREATE INDEX IF NOT EXISTS idx_creative_works_world ON loreum_creative_works(world_id);
CREATE INDEX IF NOT EXISTS idx_creative_works_type ON loreum_creative_works(creative_type);
CREATE INDEX IF NOT EXISTS idx_creative_works_status ON loreum_creative_works(status);
CREATE INDEX IF NOT EXISTS idx_creative_works_collection ON loreum_creative_works(collection);

CREATE INDEX IF NOT EXISTS idx_creative_sessions_work ON loreum_creative_sessions(work_id);
CREATE INDEX IF NOT EXISTS idx_creative_sessions_date ON loreum_creative_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_creative_sessions_activity ON loreum_creative_sessions(activity_type);

CREATE INDEX IF NOT EXISTS idx_plot_threads_work ON loreum_plot_threads(primary_work_id);
CREATE INDEX IF NOT EXISTS idx_plot_thread_works_thread ON loreum_plot_thread_works(plot_thread_id);
CREATE INDEX IF NOT EXISTS idx_plot_thread_works_work ON loreum_plot_thread_works(work_id);

-- Functions for automatic word count updates
CREATE OR REPLACE FUNCTION update_creative_work_word_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Simple word count: split on whitespace and count non-empty elements
    NEW.word_count = COALESCE(array_length(string_to_array(trim(NEW.content), ' '), 1), 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply word count trigger
CREATE TRIGGER update_creative_work_word_count_trigger
    BEFORE INSERT OR UPDATE OF content ON loreum_creative_works
    FOR EACH ROW EXECUTE FUNCTION update_creative_work_word_count();

-- Updated_at triggers
CREATE TRIGGER update_loreum_creative_works_updated_at
    BEFORE UPDATE ON loreum_creative_works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loreum_creative_sessions_updated_at
    BEFORE UPDATE ON loreum_creative_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loreum_plot_threads_updated_at
    BEFORE UPDATE ON loreum_plot_threads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loreum_plot_thread_works_updated_at
    BEFORE UPDATE ON loreum_plot_thread_works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Useful views for creative work management

-- View: Creative work hierarchy with progress
CREATE OR REPLACE VIEW loreum_creative_work_tree AS
WITH RECURSIVE work_tree AS (
    -- Root works (no parent)
    SELECT
        id, title, creative_type, status, word_count, target_word_count,
        parent_work_id, sequence_number, 0 as depth,
        ARRAY[sequence_number] as path,
        title as root_title
    FROM loreum_creative_works
    WHERE parent_work_id IS NULL

    UNION ALL

    -- Child works
    SELECT
        cw.id, cw.title, cw.creative_type, cw.status, cw.word_count, cw.target_word_count,
        cw.parent_work_id, cw.sequence_number, wt.depth + 1,
        wt.path || cw.sequence_number,
        wt.root_title
    FROM loreum_creative_works cw
    JOIN work_tree wt ON cw.parent_work_id = wt.id
)
SELECT * FROM work_tree ORDER BY path;

-- View: Writing progress summary
CREATE OR REPLACE VIEW loreum_writing_progress AS
SELECT
    cw.id,
    cw.title,
    cw.creative_type,
    cw.status,
    cw.word_count,
    cw.target_word_count,
    CASE
        WHEN cw.target_word_count > 0 THEN
            ROUND((cw.word_count::NUMERIC / cw.target_word_count) * 100, 1)
        ELSE 0
    END as completion_percentage,

    -- Count child works (chapters, scenes, etc.)
    COUNT(children.id) as child_count,
    COUNT(children.id) FILTER (WHERE children.status = 'complete') as completed_children,
    COALESCE(SUM(children.word_count), 0) as total_child_words,

    -- Recent activity
    (SELECT MAX(session_start) FROM loreum_creative_sessions cs WHERE cs.work_id = cw.id) as last_session,
    (SELECT COUNT(*) FROM loreum_creative_sessions cs WHERE cs.work_id = cw.id AND cs.session_start > NOW() - INTERVAL '7 days') as sessions_this_week,

    cw.updated_at
FROM loreum_creative_works cw
LEFT JOIN loreum_creative_works children ON children.parent_work_id = cw.id
GROUP BY cw.id, cw.title, cw.creative_type, cw.status, cw.word_count, cw.target_word_count, cw.updated_at;

-- View: Recent creative activity
CREATE OR REPLACE VIEW loreum_recent_creative_activity AS
SELECT
    cs.id,
    cw.title as work_title,
    cw.creative_type,
    cs.session_start,
    cs.session_end,
    cs.words_written,
    cs.activity_type,
    cs.session_notes,
    EXTRACT(EPOCH FROM (COALESCE(cs.session_end, NOW()) - cs.session_start))/3600 as session_hours,
    cs.productivity_rating,
    cs.mood_rating
FROM loreum_creative_sessions cs
JOIN loreum_creative_works cw ON cs.work_id = cw.id
WHERE cs.session_start > NOW() - INTERVAL '30 days'
ORDER BY cs.session_start DESC;

-- Insert some sample data for testing
INSERT INTO loreum_creative_works (title, description, creative_type, target_word_count, status) VALUES
('The Shattered Nexus', 'A science fantasy epic set in the Aether Spiral multiverse', 'novel', 80000, 'planning'),
('Songs of the Void', 'Collection of poems exploring cosmic themes', 'poem', 0, 'drafting'),
('Kael''s Journey Game Script', 'Interactive narrative for the Gaia-7 world', 'game_script', 15000, 'outlining')
ON CONFLICT DO NOTHING;

-- Add sample chapters to the novel
DO $$
DECLARE
    novel_id UUID;
BEGIN
    SELECT id INTO novel_id FROM loreum_creative_works WHERE title = 'The Shattered Nexus' LIMIT 1;

    IF novel_id IS NOT NULL THEN
        INSERT INTO loreum_creative_works (title, creative_type, parent_work_id, sequence_number, target_word_count, status) VALUES
        ('Chapter 1: The Discovery', 'chapter', novel_id, 1, 3000, 'planning'),
        ('Chapter 2: Awakening Power', 'chapter', novel_id, 2, 3500, 'planning'),
        ('Chapter 3: First Contact', 'chapter', novel_id, 3, 3200, 'planning')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Comments for clarity
COMMENT ON TABLE loreum_creative_works IS 'Original creative content (novels, poetry, games, manga, etc.) with optional worldbuilding references';
COMMENT ON COLUMN loreum_creative_works.content IS 'The actual creative content - prose, verse, script, etc.';
COMMENT ON COLUMN loreum_creative_works.parent_work_id IS 'For hierarchical works: chapters in novels, scenes in chapters, verses in poems';
COMMENT ON COLUMN loreum_creative_works.featured_characters IS 'Array of character UUIDs that appear in this work';
COMMENT ON COLUMN loreum_creative_works.referenced_locations IS 'Array of region/location UUIDs mentioned in this work';
COMMENT ON COLUMN loreum_creative_works.referenced_events IS 'Array of lore node UUIDs referenced in this work';

COMMENT ON TABLE loreum_creative_sessions IS 'Track writing/creative sessions for productivity and progress analysis';
COMMENT ON TABLE loreum_plot_threads IS 'Story arcs and narrative threads that can span multiple creative works';
