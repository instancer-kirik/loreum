-- Authentication and RLS Policies for Loreum
-- This script creates proper Row Level Security policies for authenticated users

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE loreum_multiverses ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_universes ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_civilizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_ipsumarium_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_governments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_tech_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_lore_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_star_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_magic_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_enchantments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_character_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_powers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_magic_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_magic_progression_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_character_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_item_enchantments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_multiverses;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_multiverses;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_multiverses;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_multiverses;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_universes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_universes;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_universes;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_universes;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_timelines;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_timelines;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_timelines;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_timelines;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_worlds;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_worlds;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_worlds;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_worlds;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_civilizations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_civilizations;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_civilizations;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_civilizations;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_regions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_regions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_regions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_regions;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_characters;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_characters;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_characters;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_characters;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_ipsumarium_templates;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_ipsumarium_templates;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_ipsumarium_templates;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_ipsumarium_templates;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_species;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_species;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_species;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_species;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_governments;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_governments;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_governments;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_governments;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_tech_trees;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_tech_trees;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_tech_trees;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_tech_trees;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_lore_nodes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_lore_nodes;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_lore_nodes;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_lore_nodes;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_star_systems;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_star_systems;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_star_systems;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_star_systems;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_magic_systems;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_magic_systems;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_magic_systems;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_magic_systems;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_enchantments;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_enchantments;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_enchantments;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_enchantments;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_character_instances;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_character_instances;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_character_instances;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_character_instances;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_items;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_items;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_items;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_powers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_powers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_powers;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_powers;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_magic_abilities;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_magic_abilities;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_magic_abilities;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_magic_abilities;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_magic_progression_rules;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_magic_progression_rules;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_magic_progression_rules;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_magic_progression_rules;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_character_abilities;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_character_abilities;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_character_abilities;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_character_abilities;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON loreum_item_enchantments;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON loreum_item_enchantments;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON loreum_item_enchantments;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON loreum_item_enchantments;

-- Create read policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON loreum_multiverses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_universes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_timelines FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_worlds FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_civilizations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_regions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_characters FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_ipsumarium_templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_species FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_governments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_tech_trees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_lore_nodes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_star_systems FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_magic_systems FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_enchantments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_character_instances FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_powers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_magic_abilities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_magic_progression_rules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_character_abilities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read access for authenticated users" ON loreum_item_enchantments FOR SELECT USING (auth.role() = 'authenticated');

-- Create insert policies for authenticated users
CREATE POLICY "Enable insert for authenticated users" ON loreum_multiverses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_universes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_timelines FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_worlds FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_civilizations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_regions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_characters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_ipsumarium_templates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_species FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_governments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_tech_trees FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_lore_nodes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_star_systems FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_magic_systems FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_enchantments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_character_instances FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_powers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_magic_abilities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_magic_progression_rules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_character_abilities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON loreum_item_enchantments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create update policies for authenticated users
CREATE POLICY "Enable update for authenticated users" ON loreum_multiverses FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_universes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_timelines FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_worlds FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_civilizations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_regions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_characters FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_ipsumarium_templates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_species FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_governments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_tech_trees FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_lore_nodes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_star_systems FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_magic_systems FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_enchantments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_character_instances FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_powers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_magic_abilities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_magic_progression_rules FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_character_abilities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON loreum_item_enchantments FOR UPDATE USING (auth.role() = 'authenticated');

-- Create delete policies for authenticated users
CREATE POLICY "Enable delete for authenticated users" ON loreum_multiverses FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_universes FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_timelines FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_worlds FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_civilizations FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_regions FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_characters FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_ipsumarium_templates FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_species FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_governments FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_tech_trees FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_lore_nodes FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_star_systems FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_magic_systems FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_enchantments FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_character_instances FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_items FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_powers FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_magic_abilities FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_magic_progression_rules FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_character_abilities FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON loreum_item_enchantments FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data for testing
INSERT INTO loreum_multiverses (name, description) VALUES
('Aether Spiral', 'A vast multiverse where the fundamental forces of reality spiral through dimensions, creating infinite possibilities for worlds and civilizations.')
ON CONFLICT DO NOTHING;

INSERT INTO loreum_magic_systems (name, description, rules, source, structure, tags) VALUES
('Aetheric Manipulation', 'Direct manipulation of aetheric energy fields through focused will and specialized techniques', 
 '{"cost_type": "mental_fatigue", "range_limit": "line_of_sight", "elemental_affinities": ["air", "lightning", "force"], "power_scaling": "exponential"}',
 'aetheric', 'domain-based', 
 ARRAY['elemental', 'direct', 'high-energy', 'mental'])
ON CONFLICT DO NOTHING;

-- Test query to verify everything works
SELECT 'RLS policies successfully created and test data inserted' as status;
