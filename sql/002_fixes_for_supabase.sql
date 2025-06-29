-- Supabase Compatibility Fixes for Loreum Schema
-- Run this after 001_create_loreum_schema.sql

-- Add missing triggers for timestamp updates
CREATE TRIGGER update_loreum_magic_systems_updated_at BEFORE UPDATE ON loreum_magic_systems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_enchantments_updated_at BEFORE UPDATE ON loreum_enchantments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_character_instances_updated_at BEFORE UPDATE ON loreum_character_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_items_updated_at BEFORE UPDATE ON loreum_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_powers_updated_at BEFORE UPDATE ON loreum_powers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add missing indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_loreum_enchantments_magic_system ON loreum_enchantments(associated_magic_system);
CREATE INDEX IF NOT EXISTS idx_loreum_character_instances_character_id ON loreum_character_instances(character_id);
CREATE INDEX IF NOT EXISTS idx_loreum_character_instances_timeline_id ON loreum_character_instances(timeline_id);
CREATE INDEX IF NOT EXISTS idx_loreum_items_tech ON loreum_items(associated_tech);

-- Add tag-based indexes for filtering
CREATE INDEX IF NOT EXISTS idx_loreum_magic_systems_tags ON loreum_magic_systems USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_loreum_enchantments_item_tags ON loreum_enchantments USING GIN(item_tags);
CREATE INDEX IF NOT EXISTS idx_loreum_items_tags ON loreum_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_loreum_powers_tags ON loreum_powers USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_loreum_characters_tags ON loreum_characters USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_loreum_ipsumarium_templates_tags ON loreum_ipsumarium_templates USING GIN(tags);

-- Fix Ipsumarium type constraint to include new entity types
ALTER TABLE loreum_ipsumarium_templates 
DROP CONSTRAINT IF EXISTS loreum_ipsumarium_templates_type_check;

ALTER TABLE loreum_ipsumarium_templates 
ADD CONSTRAINT loreum_ipsumarium_templates_type_check 
CHECK (type IN ('species', 'tech', 'item', 'power', 'vehicle', 'starship', 'culture', 'civilization', 'magic_system', 'enchantment'));

-- Add granular magic system tables for better organization
CREATE TABLE IF NOT EXISTS loreum_magic_abilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    magic_system_id UUID NOT NULL REFERENCES loreum_magic_systems(id) ON DELETE CASCADE,
    ability_level INTEGER NOT NULL DEFAULT 1,
    prerequisites JSONB DEFAULT '[]',
    effects JSONB DEFAULT '{}',
    cost_structure JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loreum_magic_progression_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    magic_system_id UUID NOT NULL REFERENCES loreum_magic_systems(id) ON DELETE CASCADE,
    progression_type TEXT NOT NULL CHECK (progression_type IN ('linear', 'exponential', 'milestone', 'freeform')),
    level_requirements JSONB DEFAULT '{}',
    advancement_rules JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add character ability tracking table
CREATE TABLE IF NOT EXISTS loreum_character_abilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES loreum_characters(id) ON DELETE CASCADE,
    ability_source_type TEXT NOT NULL CHECK (ability_source_type IN ('magic', 'power', 'tech', 'innate')),
    ability_source_id UUID, -- References magic_abilities, powers, etc.
    proficiency_level INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    acquired_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add enchantment application tracking
CREATE TABLE IF NOT EXISTS loreum_item_enchantments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES loreum_items(id) ON DELETE CASCADE,
    enchantment_id UUID NOT NULL REFERENCES loreum_enchantments(id) ON DELETE CASCADE,
    applied_by UUID REFERENCES loreum_characters(id) ON DELETE SET NULL,
    applied_year INTEGER,
    strength_modifier NUMERIC DEFAULT 1.0,
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for new tables
CREATE INDEX IF NOT EXISTS idx_loreum_magic_abilities_system_id ON loreum_magic_abilities(magic_system_id);
CREATE INDEX IF NOT EXISTS idx_loreum_magic_abilities_tags ON loreum_magic_abilities USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_loreum_magic_progression_rules_system_id ON loreum_magic_progression_rules(magic_system_id);
CREATE INDEX IF NOT EXISTS idx_loreum_character_abilities_character_id ON loreum_character_abilities(character_id);
CREATE INDEX IF NOT EXISTS idx_loreum_character_abilities_source ON loreum_character_abilities(ability_source_type, ability_source_id);
CREATE INDEX IF NOT EXISTS idx_loreum_item_enchantments_item_id ON loreum_item_enchantments(item_id);
CREATE INDEX IF NOT EXISTS idx_loreum_item_enchantments_enchantment_id ON loreum_item_enchantments(enchantment_id);

-- Add triggers for new tables
CREATE TRIGGER update_loreum_magic_abilities_updated_at BEFORE UPDATE ON loreum_magic_abilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_magic_progression_rules_updated_at BEFORE UPDATE ON loreum_magic_progression_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_character_abilities_updated_at BEFORE UPDATE ON loreum_character_abilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loreum_item_enchantments_updated_at BEFORE UPDATE ON loreum_item_enchantments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (recommended for Supabase)
ALTER TABLE loreum_magic_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_enchantments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_character_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_powers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_magic_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_magic_progression_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_character_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_item_enchantments ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your auth requirements)
CREATE POLICY "Users can view all records" ON loreum_magic_systems FOR SELECT USING (true);
CREATE POLICY "Users can view all records" ON loreum_enchantments FOR SELECT USING (true);
CREATE POLICY "Users can view all records" ON loreum_character_instances FOR SELECT USING (true);
CREATE POLICY "Users can view all records" ON loreum_items FOR SELECT USING (true);
CREATE POLICY "Users can view all records" ON loreum_powers FOR SELECT USING (true);
CREATE POLICY "Users can view all records" ON loreum_magic_abilities FOR SELECT USING (true);
CREATE POLICY "Users can view all records" ON loreum_magic_progression_rules FOR SELECT USING (true);
CREATE POLICY "Users can view all records" ON loreum_character_abilities FOR SELECT USING (true);
CREATE POLICY "Users can view all records" ON loreum_item_enchantments FOR SELECT USING (true);

-- Insert sample data for magic systems
INSERT INTO loreum_magic_systems (name, description, rules, source, structure, tags) VALUES
('Aetheric Manipulation', 'Direct manipulation of aetheric energy fields', 
 '{"cost_type": "mental_fatigue", "range_limit": "line_of_sight", "elemental_affinities": ["air", "lightning", "force"]}',
 'aetheric', 'domain-based', 
 ARRAY['elemental', 'direct', 'high-energy'])
ON CONFLICT DO NOTHING;

INSERT INTO loreum_enchantments (name, description, effect, item_tags, associated_magic_system) VALUES
('Sharpness Enhancement', 'Increases cutting power of bladed weapons',
 '{"damage_multiplier": 1.5, "armor_penetration": "+2"}',
 ARRAY['weapon', 'blade', 'metal'],
 (SELECT id FROM loreum_magic_systems WHERE name = 'Aetheric Manipulation' LIMIT 1))
ON CONFLICT DO NOTHING;