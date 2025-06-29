# Template Instances & Navigation Setup Guide

This guide covers the complete template instancing system and updated navigation structure in your Loreum app.

## 🎉 System Ready!

Your template instancing system is now fully integrated with updated navigation and pages. Here's what's been enhanced:

### ✅ New & Updated Pages

1. **Template Instances** - Complete instance viewer with filtering and search
2. **Characters Manager** - Dedicated character templates and instances (NEW!)
3. **Asset Manager** - Combined templates and instances view with source filtering
4. **Item Editor** - Item-specific template and instance management
5. **Tech Tree Designer** - Technology templates and instances with domain organization
6. **Planetary Structures** - Enhanced with template integration (partial)

### ✅ Navigation Improvements

- **World Context**: Now shows Lore Graph and Narrative (previously timeline-only)
- **Character Page**: Proper dedicated Characters Manager instead of fallback
- **Magic Systems**: Available in both civilization context and system tools
- **Source Filtering**: All pages now distinguish between templates and instances

### 🎯 How to Access Everything

#### Core Navigation
- **Template Instances** - View all your created instances across contexts
- **Ipsumarium Vault** - Create new templates and instances
- **Characters Studio** - Dedicated character management
- **Asset Manager** - Unified view of all templates and instances

#### Context-Based Navigation
The sidebar shows different tools based on your current context level:

**Multiverse Level:**
- Multiverse Explorer

**Universe Level:**
- Universe tools
- Astraloom (star navigation)

**Timeline Level:**
- Timeline management
- Lore Graph
- Narrative Layer

**World Level:**
- World management
- Regions
- Planetary Structures
- Lore Graph (NEW!)
- Narrative Layer (NEW!)

**Civilization Level:**
- Civilization Builder
- Tech Tree Designer
- Culture Designer
- Items Editor
- Magic Systems Manager

#### System Tools (Always Available)
- Asset Manager
- Magic Systems Manager
- Configuration
- Debug Tools

## Quick Start Guide

1. **View Your Instance**: Go to Template Instances page
2. **Create More**: Use Ipsumarium Vault to create instances from templates
3. **Browse by Type**: Use Asset Manager to see everything together
4. **Characters**: Use the new Characters Studio for character-specific management

## Type Generation Setup

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   # or
   brew install supabase/tap/supabase
   ```

2. **Set up your project ID**:
   Add to your `.env` file:
   ```
   SUPABASE_PROJECT_ID=your_project_id_here
   ```

3. **Generate types**:
   ```bash
   npm run types:gen
   ```

### Option 2: Manual Type Generation

If you prefer not to install the CLI, you can use the Supabase Dashboard:

1. Go to your Supabase Dashboard → API → API Docs
2. Look for the TypeScript section
3. Copy the generated types
4. Save them to `src/integrations/supabase/types_generated.ts`

## Accessing Your Template Instances

### Navigation

1. **Template Instances Page**: Shows all your created instances with filtering and search
2. **Ipsumarium Vault**: Create new instances from templates
3. **Asset Manager**: View both templates and instances together

### What You Can Do

- **View All Instances**: See templates and instances side by side
- **Filter by Type**: Tech, Items, Magic Systems, Species, Cultures
- **Filter by Source**: Templates vs Instances
- **Search**: Find specific instances by name or description
- **Context Tracking**: See which multiverse/universe/timeline/world each instance belongs to

## Current Page Status

### ✅ Fully Updated Pages

- **Template Instances** - Complete instance viewer with filtering, search, and detailed modals
- **Characters Manager** - NEW! Dedicated character templates and instances management
- **Asset Manager** - Combined templates and instances view with source filtering
- **Item Editor** - Item-specific template and instance management with categories
- **Tech Tree Designer** - Technology templates and instances with domain organization

### 🔄 Partially Updated Pages

- **Planetary Structures** - Template integration started, needs completion
- **Magic Systems Manager** - Already well-structured, needs instance integration
- **Civilization Builder** - Could show instances within civilizations
- **Culture Designer** - Could integrate culture instances
- **Region Editor** - Could show region-specific instances

### 🆕 Page Features Added

**Template Instances Page:**
- Filter by type (tech, items, magic, species, culture)
- Filter by source (templates vs instances)
- Search functionality
- Detailed instance modals with context hierarchy
- Status tracking and metadata display

**Characters Manager (NEW!):**
- Character-specific template and instance management
- Category-based organization (heroes, villains, NPCs, leaders)
- Context-aware instance display
- Template source tracking for instances

**Updated Asset Manager:**
- Unified view of templates and instances
- Source filtering (templates/instances/all)
- Enhanced type support (tech, items, magic, species, culture)
- Visual indicators for template vs instance

**Enhanced Item Editor:**
- Real-time category detection from tags
- Template and instance integration
- Search and filtering
- Source-based organization

**Updated Tech Tree Designer:**
- Domain-based organization from actual data
- Template and instance support
- Real-time loading from database
- Enhanced filtering and search

## Database Schema

Your template instancing system includes these key tables:

- `loreum_template_instances` - Base instance records
- `loreum_species_instances` - Species-specific instance data
- `loreum_technology_instances` - Technology-specific instance data
- `loreum_item_instances` - Item-specific instance data
- `loreum_magic_system_instances` - Magic system-specific instance data
- `loreum_culture_instances` - Culture-specific instance data

## Next Steps

### Immediate Actions
1. **Navigate to Template Instances** to see your created instance
2. **Try the new Characters Studio** for character management
3. **Explore the Asset Manager** to see templates and instances together
4. **Test the updated navigation** - notice Lore Graph and Narrative now show in World context

### Development Tasks
1. **Set up type generation** for better TypeScript support (see below)
2. **Complete Planetary Structures integration** 
3. **Add instance support to Magic Systems Manager**
4. **Consider adding instance relationships** (dependencies, ownership, etc.)

### Content Creation
1. **Create more instances** from the Ipsumarium Vault
2. **Try different context hierarchies** (multiverse → universe → timeline → world → civilization)
3. **Test cross-context instance usage** (same template, different contexts)
4. **Explore the filtering and search features** in each updated page

## Type Generation Benefits

Once you set up type generation, you'll get:

- ✅ Full TypeScript intellisense for database operations
- ✅ Compile-time type checking for database queries
- ✅ Auto-completion for table and column names
- ✅ Reduced runtime errors from typos

## Troubleshooting

### "Template instances table not found"
- Make sure you've run the migration: `sql/004_template_instancing_system.sql`
- Check that all tables were created successfully in your Supabase dashboard

### Types not updating
- Re-run the type generation script: `npm run types:gen`
- Make sure your Supabase project ID is correct in `.env`
- Try the local generation option: `npm run types:gen-local`

### Instance not showing up
- Check the Template Instances page with no filters applied
- Verify the instance was created successfully in your database
- Try refreshing the page to reload data

## Advanced Features

### Context Hierarchy

Your instances support a full context hierarchy:
- Multiverse → Universe → Timeline → World → Civilization

This allows you to have the same template (e.g., "Plasma Rifle") appear differently in different contexts.

### Local Variations

Each instance can have local variations from its template:
- Modified properties
- Different descriptions
- Context-specific metadata
- Relationship tracking

### Instance Relationships

You can create relationships between instances:
- Dependencies (tech requires other tech)
- Ownership (character owns item)
- Cultural integration (magic system within culture)

## Navigation Context System

Your app now uses a sophisticated context-based navigation:

### Context Levels
1. **Multiverse** - Top level, cosmic tools
2. **Universe** - Universal tools and star navigation
3. **Timeline** - Time-based tools, lore, and narrative
4. **World** - World-building tools including regions, structures, lore, narrative
5. **Civilization** - Civilization-specific tools including tech, culture, items, magic

### Context-Aware Features
- **Template Instances** show their full context path (Multiverse › Universe › Timeline › World › Civilization)
- **Navigation breadcrumbs** let you jump between context levels
- **Page availability** changes based on current context
- **Tools adapt** to the appropriate scope

### Updated Context Assignments
- **Lore Graph**: Now available in both Timeline AND World contexts
- **Narrative Layer**: Now available in both Timeline AND World contexts  
- **Magic Systems**: Available in Civilization context AND as system tool
- **Characters**: Always available as core tool with context awareness

This allows for more flexible worldbuilding where you can work on lore and narrative at both timeline and world levels, depending on your needs.