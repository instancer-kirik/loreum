# Database Setup Guide

This guide will help you set up the Supabase database for the Loreum worldbuilding application.

## Prerequisites

1. A Supabase account (free tier works fine)
2. A Supabase project created
3. Access to the Supabase SQL editor

## Setup Instructions

### 1. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - Name: `loreum-worldbuilding` (or your preferred name)
   - Database Password: Use a strong password
   - Region: Choose closest to your location
6. Wait for the project to be created

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - `anon` `public` API key

### 3. Update the Client Configuration

1. Open `loreum/src/integrations/supabase/client.ts`
2. Replace the placeholder values with your actual credentials:
   ```typescript
   const SUPABASE_URL = "YOUR_PROJECT_URL";
   const SUPABASE_PUBLISHABLE_KEY = "YOUR_ANON_KEY";
   ```

### 4. Create the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `loreum/sql/001_create_loreum_schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the script

This will create all the necessary tables with proper relationships and indexes.

### 5. Verify the Setup

After running the SQL script, you should see the following tables in your database:

- `loreum_multiverses`
- `loreum_universes`
- `loreum_timelines`
- `loreum_worlds`
- `loreum_civilizations`
- `loreum_regions`
- `loreum_characters`
- `loreum_ipsumarium_templates`
- `loreum_species`
- `loreum_governments`
- `loreum_tech_trees`
- `loreum_lore_nodes`
- `loreum_star_systems`

## Database Structure

The database follows a hierarchical structure:

```
Multiverse
└── Universe
    └── Timeline
        └── World
            ├── Civilization
            └── Region
```

### Core Tables

#### Multiverses
The top level container for entire cosmic frameworks.

#### Universes
Physical realities within a multiverse, each with their own physical laws.

#### Timelines
Temporal sequences within a universe, can fork from other timelines.

#### Worlds
Planets, stations, or other habitable structures within a timeline.

#### Civilizations
Organized societies that exist on worlds.

#### Regions
Geographic or spatial areas within worlds.

### Template Tables

#### Ipsumarium Templates
Reusable canonical entities that can be referenced across the hierarchy:
- Species templates
- Technology templates
- Item templates
- Magic system templates
- Enchantment templates
- Power templates
- Vehicle templates
- Culture templates
- Civilization templates

#### Characters
Individual entities with relationships and narrative roles.

### Support Tables

#### Lore Nodes
Graph-based lore connections with causal relationships.

#### Star Systems
Astraloom navigation data for space-based civilizations.

## Row Level Security (RLS)

The tables are set up without RLS enabled by default for development. To enable user-based access control:

1. Uncomment the RLS sections in the SQL script
2. Add appropriate policies based on your authentication needs

## Sample Data

The SQL script includes one sample multiverse entry to get you started. You can add more sample data or start creating through the application interface.

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure you're using the service role key for admin operations
2. **Table Already Exists**: Drop existing tables or use `IF NOT EXISTS` clauses
3. **Foreign Key Constraints**: Ensure parent records exist before creating child records

### Resetting the Database

To completely reset the database:

```sql
-- Drop all tables (be careful!)
DROP TABLE IF EXISTS loreum_star_systems CASCADE;
DROP TABLE IF EXISTS loreum_lore_nodes CASCADE;
DROP TABLE IF EXISTS loreum_tech_trees CASCADE;
DROP TABLE IF EXISTS loreum_governments CASCADE;
DROP TABLE IF EXISTS loreum_species CASCADE;
DROP TABLE IF EXISTS loreum_ipsumarium_templates CASCADE;
DROP TABLE IF EXISTS loreum_characters CASCADE;
DROP TABLE IF EXISTS loreum_regions CASCADE;
DROP TABLE IF EXISTS loreum_civilizations CASCADE;
DROP TABLE IF EXISTS loreum_worlds CASCADE;
DROP TABLE IF EXISTS loreum_timelines CASCADE;
DROP TABLE IF EXISTS loreum_universes CASCADE;
DROP TABLE IF EXISTS loreum_multiverses CASCADE;
```

Then re-run the setup script.

## Performance Considerations

The schema includes indexes on foreign keys and commonly queried fields. For production use, consider:

1. Adding additional indexes based on query patterns
2. Implementing proper RLS policies
3. Setting up database backups
4. Monitoring query performance

## Support

For issues with this setup:

1. Check the Supabase documentation
2. Verify your SQL syntax
3. Check the browser console for client-side errors
4. Review the Network tab for API call failures