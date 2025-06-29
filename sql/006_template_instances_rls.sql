-- Template Instances RLS Policies
-- This migration enables Row Level Security and creates policies for template instances system

-- Enable RLS on all template instance tables
ALTER TABLE loreum_template_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_species_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_technology_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_item_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_magic_system_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_culture_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_template_instance_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE loreum_instance_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Template Instances Policies
-- Allow authenticated users to read all template instances
CREATE POLICY "authenticated_users_read_template_instances" ON loreum_template_instances
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert template instances
CREATE POLICY "authenticated_users_insert_template_instances" ON loreum_template_instances
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update template instances
CREATE POLICY "authenticated_users_update_template_instances" ON loreum_template_instances
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete template instances
CREATE POLICY "authenticated_users_delete_template_instances" ON loreum_template_instances
FOR DELETE
TO authenticated
USING (true);

-- Species Instances Policies
CREATE POLICY "authenticated_users_read_species_instances" ON loreum_species_instances
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_insert_species_instances" ON loreum_species_instances
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_update_species_instances" ON loreum_species_instances
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_users_delete_species_instances" ON loreum_species_instances
FOR DELETE
TO authenticated
USING (true);

-- Technology Instances Policies
CREATE POLICY "authenticated_users_read_technology_instances" ON loreum_technology_instances
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_insert_technology_instances" ON loreum_technology_instances
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_update_technology_instances" ON loreum_technology_instances
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_users_delete_technology_instances" ON loreum_technology_instances
FOR DELETE
TO authenticated
USING (true);

-- Item Instances Policies
CREATE POLICY "authenticated_users_read_item_instances" ON loreum_item_instances
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_insert_item_instances" ON loreum_item_instances
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_update_item_instances" ON loreum_item_instances
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_users_delete_item_instances" ON loreum_item_instances
FOR DELETE
TO authenticated
USING (true);

-- Magic System Instances Policies
CREATE POLICY "authenticated_users_read_magic_system_instances" ON loreum_magic_system_instances
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_insert_magic_system_instances" ON loreum_magic_system_instances
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_update_magic_system_instances" ON loreum_magic_system_instances
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_users_delete_magic_system_instances" ON loreum_magic_system_instances
FOR DELETE
TO authenticated
USING (true);

-- Culture Instances Policies
CREATE POLICY "authenticated_users_read_culture_instances" ON loreum_culture_instances
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_insert_culture_instances" ON loreum_culture_instances
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_update_culture_instances" ON loreum_culture_instances
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_users_delete_culture_instances" ON loreum_culture_instances
FOR DELETE
TO authenticated
USING (true);

-- Template Instance Relationships Policies
CREATE POLICY "authenticated_users_read_template_instance_relationships" ON loreum_template_instance_relationships
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_insert_template_instance_relationships" ON loreum_template_instance_relationships
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_update_template_instance_relationships" ON loreum_template_instance_relationships
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_users_delete_template_instance_relationships" ON loreum_template_instance_relationships
FOR DELETE
TO authenticated
USING (true);

-- Instance Usage Tracking Policies (read-only for users, system can insert)
CREATE POLICY "authenticated_users_read_instance_usage_tracking" ON loreum_instance_usage_tracking
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_insert_instance_usage_tracking" ON loreum_instance_usage_tracking
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Views need to inherit permissions from underlying tables
-- The view loreum_template_instances_with_templates will work automatically
-- since it's based on tables that now have proper RLS policies

-- Grant usage on the schema to authenticated users (if not already granted)
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant access to the sequences used by the tables
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Refresh the view permissions
GRANT SELECT ON loreum_template_instances_with_templates TO authenticated;