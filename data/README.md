# World Glossary Data System

This directory contains CSV-based data files that serve as a portable, version-controlled glossary and item index for world-building and game development.

## Overview

The CSV-based approach provides:
- **Portability**: Easy to import/export between systems
- **Version Control**: Git-friendly plain text format
- **Interoperability**: Works with databases, spreadsheets, and custom tools
- **Context Droplets**: Lightweight reference for AI/LLM interactions

## Files

### `world_glossary.csv`
Main glossary containing all world-building terms, technologies, factions, locations, and concepts.

**Schema:**
```
term,type,category,description,status,source,related_terms,etymology_notes
```

**Fields:**
- `term`: Primary name/identifier
- `type`: Classification (Faction, Location, Core Technology, etc.)
- `category`: Broad grouping (World, Core, Foundation, etc.)
- `description`: Detailed explanation
- `status`: Implementation status (pending, Implemented, conceptual)
- `source`: Origin project (varchiver, naming, new, etc.)
- `related_terms`: Semicolon-separated list of connected terms
- `etymology_notes`: Optional linguistic/naming analysis

### `item_index.csv`
Specific game items with technical specifications and world context.

**Schema:**
```
item_id,name,category,subcategory,type,tech_tier,rarity,energy_type,origin_faction,description,status,source,related_terms,technical_summary,notes
```

**Fields:**
- `item_id`: Unique identifier for code/database use
- `name`: Display name
- `category`: Primary classification (Modular, Physical, etc.)
- `subcategory`: Detailed classification (Weapons, Cores, etc.)
- `type`: Game-specific type identifier
- `tech_tier`: Technology level (Tier 0-4, legendary, etc.)
- `rarity`: Availability (common, uncommon, rare, legendary, essential)
- `energy_type`: Power system (Gravitic, Resonant, Magitek, etc.)
- `origin_faction`: Creating faction
- `description`: Lore description
- `status`: Implementation status
- `source`: Origin project
- `related_terms`: Connected glossary terms
- `technical_summary`: Mechanical/technical capabilities
- `notes`: Additional context

## Usage

### Direct CSV Access
```javascript
// Load and parse CSV files directly
const glossaryCSV = await fetch('/data/world_glossary.csv').then(r => r.text());
const itemCSV = await fetch('/data/item_index.csv').then(r => r.text());
```

### Using GlossaryManager Utility
```javascript
import { initializeGlossary } from '../src/lib/glossaryUtils';

const manager = await initializeGlossary();

// Search for terms
const gravityTech = manager.searchGlossary('gravity');
const weapons = manager.searchItems('', { category: 'Physical', subcategory: 'Weapons' });

// Get faction info
const lokexStuff = manager.getByFaction('Lokex Frame');

// Generate context for AI
const contextDroplet = manager.generateContextDroplet(30);
```

### Database Integration
The CSV structure maps directly to SQL tables:

```sql
CREATE TABLE glossary_terms (
    term VARCHAR PRIMARY KEY,
    type VARCHAR,
    category VARCHAR,
    description TEXT,
    status VARCHAR CHECK (status IN ('pending', 'Implemented', 'conceptual')),
    source VARCHAR,
    related_terms JSONB,
    etymology_notes TEXT
);

CREATE TABLE item_index (
    item_id VARCHAR PRIMARY KEY,
    name VARCHAR,
    category VARCHAR,
    subcategory VARCHAR,
    type VARCHAR,
    tech_tier VARCHAR,
    rarity VARCHAR,
    energy_type VARCHAR,
    origin_faction VARCHAR,
    description TEXT,
    status VARCHAR,
    source VARCHAR,
    related_terms JSONB,
    technical_summary TEXT,
    notes TEXT
);
```

## Data Sources

- **varchiver**: Original tech terms and item definitions
- **naming**: Etymological analysis and creative naming
- **new**: Fresh terms for current development

## Maintenance

### Adding New Terms
1. Add to appropriate CSV file
2. Use consistent `type` and `category` values
3. Link related terms using semicolon separation
4. Mark status appropriately

### Cross-References
- Use `related_terms` to maintain connections
- Reference faction names consistently
- Link items to their underlying technologies

### Status Tracking
- `pending`: Planned but not implemented
- `Implemented`: Active in codebase/game
- `conceptual`: Ideas under development

## Context Droplet Generation

The system can generate focused context summaries for different purposes:
- **Game Context**: Implemented items and core technologies
- **Lore Context**: Factions, locations, and narrative elements
- **Technical Context**: Foundational technologies and systems
- **Complete Context**: Everything with priority weighting

Use `manager.generateContextDroplet(maxEntries)` to create AI-friendly summaries.

## Integration Notes

This CSV system is designed to:
- Sync with the varchiver SQLAlchemy models
- Provide context for AI conversations
- Support rapid prototyping and iteration
- Maintain consistency across multiple projects
- Enable easy data migration between systems

The portable nature makes it ideal for cross-project world-building while the structured format supports both human editing and programmatic access.