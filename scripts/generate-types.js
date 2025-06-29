#!/usr/bin/env node

/**
 * Supabase Type Generation Script
 * 
 * This script helps generate TypeScript types from your Supabase database.
 * It requires the Supabase CLI to be installed and configured.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TYPES_FILE = path.join(__dirname, '..', 'src', 'integrations', 'supabase', 'types_generated.ts');

function generateTypes() {
  console.log('🔄 Generating Supabase types...');
  
  try {
    // Check if supabase CLI is installed
    execSync('supabase --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Supabase CLI not found. Please install it first:');
    console.error('   npm install -g supabase');
    console.error('   or');
    console.error('   brew install supabase/tap/supabase');
    process.exit(1);
  }

  try {
    // Try to generate types from remote project first
    console.log('🌐 Attempting to generate types from remote project...');
    
    // You'll need to replace YOUR_PROJECT_ID with your actual project ID
    const projectId = process.env.SUPABASE_PROJECT_ID;
    
    if (!projectId) {
      console.log('⚠️  SUPABASE_PROJECT_ID not found in environment variables');
      console.log('   Please set it in your .env file or use local generation');
      console.log('   Falling back to local generation...');
      
      // Try local generation
      const typesContent = execSync('supabase gen types typescript --local', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      fs.writeFileSync(TYPES_FILE, typesContent);
      console.log('✅ Types generated successfully from local Supabase instance!');
      
    } else {
      const typesContent = execSync(`supabase gen types typescript --project-id ${projectId}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      fs.writeFileSync(TYPES_FILE, typesContent);
      console.log('✅ Types generated successfully from remote project!');
    }
    
    console.log(`📁 Types saved to: ${TYPES_FILE}`);
    
    // Add some helpful exports to the generated file
    const additionalExports = `

// Helper types for common operations
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Specific table types for convenience
export type LoreumMultiverse = Tables<'loreum_multiverses'>;
export type LoreumUniverse = Tables<'loreum_universes'>;
export type LoreumTimeline = Tables<'loreum_timelines'>;
export type LoreumWorld = Tables<'loreum_worlds'>;
export type LoreumCivilization = Tables<'loreum_civilizations'>;
export type LoreumRegion = Tables<'loreum_regions'>;
export type LoreumCharacter = Tables<'loreum_characters'>;
export type LoreumIpsumTemplate = Tables<'loreum_ipsum_templates'>;
export type LoreumTemplateInstance = Tables<'loreum_template_instances'>;
export type LoreumSpeciesInstance = Tables<'loreum_species_instances'>;
export type LoreumTechnologyInstance = Tables<'loreum_technology_instances'>;
export type LoreumItemInstance = Tables<'loreum_item_instances'>;
export type LoreumMagicSystemInstance = Tables<'loreum_magic_system_instances'>;
export type LoreumCultureInstance = Tables<'loreum_culture_instances'>;

// Insert types
export type LoreumMultiverseInsert = Inserts<'loreum_multiverses'>;
export type LoreumUniverseInsert = Inserts<'loreum_universes'>;
export type LoreumTimelineInsert = Inserts<'loreum_timelines'>;
export type LoreumWorldInsert = Inserts<'loreum_worlds'>;
export type LoreumCivilizationInsert = Inserts<'loreum_civilizations'>;
export type LoreumRegionInsert = Inserts<'loreum_regions'>;
export type LoreumCharacterInsert = Inserts<'loreum_characters'>;
export type LoreumIpsumTemplateInsert = Inserts<'loreum_ipsum_templates'>;
export type LoreumTemplateInstanceInsert = Inserts<'loreum_template_instances'>;
export type LoreumSpeciesInstanceInsert = Inserts<'loreum_species_instances'>;
export type LoreumTechnologyInstanceInsert = Inserts<'loreum_technology_instances'>;
export type LoreumItemInstanceInsert = Inserts<'loreum_item_instances'>;
export type LoreumMagicSystemInstanceInsert = Inserts<'loreum_magic_system_instances'>;
export type LoreumCultureInstanceInsert = Inserts<'loreum_culture_instances'>;

// Update types
export type LoreumMultiverseUpdate = Updates<'loreum_multiverses'>;
export type LoreumUniverseUpdate = Updates<'loreum_universes'>;
export type LoreumTimelineUpdate = Updates<'loreum_timelines'>;
export type LoreumWorldUpdate = Updates<'loreum_worlds'>;
export type LoreumCivilizationUpdate = Updates<'loreum_civilizations'>;
export type LoreumRegionUpdate = Updates<'loreum_regions'>;
export type LoreumCharacterUpdate = Updates<'loreum_characters'>;
export type LoreumIpsumTemplateUpdate = Updates<'loreum_ipsum_templates'>;
export type LoreumTemplateInstanceUpdate = Updates<'loreum_template_instances'>;
export type LoreumSpeciesInstanceUpdate = Updates<'loreum_species_instances'>;
export type LoreumTechnologyInstanceUpdate = Updates<'loreum_technology_instances'>;
export type LoreumItemInstanceUpdate = Updates<'loreum_item_instances'>;
export type LoreumMagicSystemInstanceUpdate = Updates<'loreum_magic_system_instances'>;
export type LoreumCultureInstanceUpdate = Updates<'loreum_culture_instances'>;
`;
    
    fs.appendFileSync(TYPES_FILE, additionalExports);
    console.log('📝 Added helper type exports');
    
  } catch (error) {
    console.error('❌ Failed to generate types:');
    console.error(error.message);
    
    if (error.message.includes('project-id')) {
      console.log('\n💡 Helpful tips:');
      console.log('1. Make sure your SUPABASE_PROJECT_ID is set in your .env file');
      console.log('2. Or run: supabase login (if using remote project)');
      console.log('3. Or run: supabase start (if using local development)');
    }
    
    process.exit(1);
  }
}

// Check if this is being run directly
if (require.main === module) {
  generateTypes();
}

module.exports = { generateTypes };