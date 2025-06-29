-- Migration: Fix context-drop type constraint
-- This migration updates the type check constraint to include 'context-drop'

-- Drop the existing constraint
ALTER TABLE loreum_ipsumarium_templates 
DROP CONSTRAINT IF EXISTS loreum_ipsumarium_templates_type_check;

-- Add the updated constraint with 'context-drop' included
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
    'enchantment'::text,
    'context-drop'::text
]));

-- Add comment to document the change
COMMENT ON CONSTRAINT loreum_ipsumarium_templates_type_check ON loreum_ipsumarium_templates 
IS 'Ensures type is one of the allowed template types, including context-drop for conversation exports';