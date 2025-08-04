// CSV Glossary and Item Index Utilities
// For working with world_glossary.csv and item_index.csv

export interface GlossaryEntry {
  term: string;
  type: string;
  category: string;
  description: string;
  status: 'pending' | 'Implemented' | 'conceptual';
  source: string;
  related_terms: string[];
  etymology_notes?: string;
}

export interface ItemEntry {
  item_id: string;
  name: string;
  category: string;
  subcategory: string;
  type: string;
  tech_tier: string;
  rarity: string;
  energy_type: string;
  origin_faction: string;
  description: string;
  status: string;
  source: string;
  related_terms: string[];
  technical_summary: string;
  notes: string;
}

export class GlossaryManager {
  private glossaryData: GlossaryEntry[] = [];
  private itemData: ItemEntry[] = [];

  // Parse CSV content into structured data
  private parseCSV(csvContent: string): string[][] {
    const lines = csvContent.trim().split('\n');
    return lines.map(line => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  }

  // Load glossary data from CSV string
  loadGlossaryCSV(csvContent: string): void {
    const rows = this.parseCSV(csvContent);
    const headers = rows[0];

    this.glossaryData = rows.slice(1).map(row => ({
      term: row[0] || '',
      type: row[1] || '',
      category: row[2] || '',
      description: row[3] || '',
      status: (row[4] as any) || 'pending',
      source: row[5] || '',
      related_terms: row[6] ? row[6].split(';').map(t => t.trim()) : [],
      etymology_notes: row[7] || undefined
    }));
  }

  // Load item data from CSV string
  loadItemCSV(csvContent: string): void {
    const rows = this.parseCSV(csvContent);
    const headers = rows[0];

    this.itemData = rows.slice(1).map(row => ({
      item_id: row[0] || '',
      name: row[1] || '',
      category: row[2] || '',
      subcategory: row[3] || '',
      type: row[4] || '',
      tech_tier: row[5] || '',
      rarity: row[6] || '',
      energy_type: row[7] || '',
      origin_faction: row[8] || '',
      description: row[9] || '',
      status: row[10] || '',
      source: row[11] || '',
      related_terms: row[12] ? row[12].split(';').map(t => t.trim()) : [],
      technical_summary: row[13] || '',
      notes: row[14] || ''
    }));
  }

  // Search glossary entries
  searchGlossary(query: string, filters?: {
    type?: string;
    category?: string;
    status?: string;
    source?: string;
  }): GlossaryEntry[] {
    const queryLower = query.toLowerCase();

    return this.glossaryData.filter(entry => {
      // Text search
      const matchesQuery = !query ||
        entry.term.toLowerCase().includes(queryLower) ||
        entry.description.toLowerCase().includes(queryLower) ||
        entry.related_terms.some(term => term.toLowerCase().includes(queryLower));

      // Filter checks
      const matchesFilters = !filters || (
        (!filters.type || entry.type === filters.type) &&
        (!filters.category || entry.category === filters.category) &&
        (!filters.status || entry.status === filters.status) &&
        (!filters.source || entry.source === filters.source)
      );

      return matchesQuery && matchesFilters;
    });
  }

  // Search item entries
  searchItems(query: string, filters?: {
    category?: string;
    tech_tier?: string;
    rarity?: string;
    energy_type?: string;
    origin_faction?: string;
  }): ItemEntry[] {
    const queryLower = query.toLowerCase();

    return this.itemData.filter(item => {
      // Text search
      const matchesQuery = !query ||
        item.name.toLowerCase().includes(queryLower) ||
        item.description.toLowerCase().includes(queryLower) ||
        item.technical_summary.toLowerCase().includes(queryLower);

      // Filter checks
      const matchesFilters = !filters || (
        (!filters.category || item.category === filters.category) &&
        (!filters.tech_tier || item.tech_tier === filters.tech_tier) &&
        (!filters.rarity || item.rarity === filters.rarity) &&
        (!filters.energy_type || item.energy_type === filters.energy_type) &&
        (!filters.origin_faction || item.origin_faction === filters.origin_faction)
      );

      return matchesQuery && matchesFilters;
    });
  }

  // Get related terms for a specific entry
  getRelatedTerms(term: string): { glossary: GlossaryEntry[], items: ItemEntry[] } {
    const glossaryEntry = this.glossaryData.find(e => e.term === term);
    const itemEntry = this.itemData.find(e => e.name === term || e.item_id === term);

    const relatedTerms = new Set<string>();

    if (glossaryEntry) {
      glossaryEntry.related_terms.forEach(t => relatedTerms.add(t));
    }
    if (itemEntry) {
      itemEntry.related_terms.forEach(t => relatedTerms.add(t));
    }

    const relatedGlossary = this.glossaryData.filter(e =>
      relatedTerms.has(e.term) || e.related_terms.includes(term)
    );

    const relatedItems = this.itemData.filter(e =>
      relatedTerms.has(e.name) || relatedTerms.has(e.item_id) ||
      e.related_terms.includes(term)
    );

    return { glossary: relatedGlossary, items: relatedItems };
  }

  // Get entries by faction
  getByFaction(faction: string): { glossary: GlossaryEntry[], items: ItemEntry[] } {
    const glossary = this.glossaryData.filter(e =>
      e.type === 'Faction' && e.term.includes(faction) ||
      e.description.toLowerCase().includes(faction.toLowerCase())
    );

    const items = this.itemData.filter(e =>
      e.origin_faction === faction
    );

    return { glossary, items };
  }

  // Get all unique values for filtering
  getFilterOptions() {
    return {
      glossary: {
        types: [...new Set(this.glossaryData.map(e => e.type))].sort(),
        categories: [...new Set(this.glossaryData.map(e => e.category))].sort(),
        statuses: [...new Set(this.glossaryData.map(e => e.status))].sort(),
        sources: [...new Set(this.glossaryData.map(e => e.source))].sort()
      },
      items: {
        categories: [...new Set(this.itemData.map(e => e.category))].sort(),
        tech_tiers: [...new Set(this.itemData.map(e => e.tech_tier))].sort(),
        rarities: [...new Set(this.itemData.map(e => e.rarity))].sort(),
        energy_types: [...new Set(this.itemData.map(e => e.energy_type))].sort(),
        factions: [...new Set(this.itemData.map(e => e.origin_faction))].sort()
      }
    };
  }

  // Export data for different contexts
  exportForContext(context: 'game' | 'lore' | 'technical' | 'complete'): {
    glossary: GlossaryEntry[];
    items: ItemEntry[];
  } {
    let glossaryFilter: (e: GlossaryEntry) => boolean;
    let itemFilter: (e: ItemEntry) => boolean;

    switch (context) {
      case 'game':
        glossaryFilter = e => ['Core', 'Weapon', 'Tool', 'Utility', 'Consumable'].includes(e.type);
        itemFilter = e => e.status === 'Implemented';
        break;
      case 'lore':
        glossaryFilter = e => ['Faction', 'Location', 'Concept', 'Entity'].includes(e.type);
        itemFilter = e => e.notes.length > 0 || e.tech_tier.includes('Tier 4') || e.rarity === 'legendary';
        break;
      case 'technical':
        glossaryFilter = e => ['Core Technology', 'System', 'Knowledge'].includes(e.type);
        itemFilter = e => e.technical_summary.length > 0;
        break;
      default:
        glossaryFilter = () => true;
        itemFilter = () => true;
    }

    return {
      glossary: this.glossaryData.filter(glossaryFilter),
      items: this.itemData.filter(itemFilter)
    };
  }

  // Generate context droplet for AI/LLM consumption
  generateContextDroplet(maxEntries: number = 50): string {
    const prioritized = [
      ...this.glossaryData.filter(e => e.status === 'Implemented').slice(0, maxEntries / 2),
      ...this.glossaryData.filter(e => e.type === 'Faction' || e.type === 'Location').slice(0, maxEntries / 4),
      ...this.itemData.filter(e => e.rarity === 'legendary' || e.tech_tier.includes('Tier 4')).slice(0, maxEntries / 4)
    ];

    let droplet = "# World Context Glossary\n\n";

    droplet += "## Key Technologies\n";
    prioritized.filter(e => 'type' in e && ['Core Technology', 'System'].includes((e as GlossaryEntry).type))
      .forEach(e => {
        const entry = e as GlossaryEntry;
        droplet += `- **${entry.term}**: ${entry.description}\n`;
      });

    droplet += "\n## Factions & Locations\n";
    prioritized.filter(e => 'type' in e && ['Faction', 'Location'].includes((e as GlossaryEntry).type))
      .forEach(e => {
        const entry = e as GlossaryEntry;
        droplet += `- **${entry.term}**: ${entry.description}\n`;
      });

    droplet += "\n## Notable Items\n";
    prioritized.filter(e => 'item_id' in e)
      .forEach(e => {
        const entry = e as ItemEntry;
        droplet += `- **${entry.name}** (${entry.tech_tier}, ${entry.rarity}): ${entry.description}\n`;
      });

    return droplet;
  }

  // Validate CSV data integrity
  validateData(): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for duplicate terms
    const termCounts = new Map<string, number>();
    this.glossaryData.forEach(e => {
      termCounts.set(e.term, (termCounts.get(e.term) || 0) + 1);
    });

    termCounts.forEach((count, term) => {
      if (count > 1) {
        errors.push(`Duplicate glossary term: ${term}`);
      }
    });

    // Check for broken related_terms references
    const allTerms = new Set([
      ...this.glossaryData.map(e => e.term),
      ...this.itemData.map(e => e.name),
      ...this.itemData.map(e => e.item_id)
    ]);

    this.glossaryData.forEach(entry => {
      entry.related_terms.forEach(relatedTerm => {
        if (!allTerms.has(relatedTerm)) {
          warnings.push(`Glossary term "${entry.term}" references unknown term: ${relatedTerm}`);
        }
      });
    });

    this.itemData.forEach(entry => {
      entry.related_terms.forEach(relatedTerm => {
        if (!allTerms.has(relatedTerm)) {
          warnings.push(`Item "${entry.name}" references unknown term: ${relatedTerm}`);
        }
      });
    });

    return { errors, warnings };
  }

  // Get summary statistics
  getStats() {
    return {
      glossary: {
        total: this.glossaryData.length,
        implemented: this.glossaryData.filter(e => e.status === 'Implemented').length,
        pending: this.glossaryData.filter(e => e.status === 'pending').length,
        conceptual: this.glossaryData.filter(e => e.status === 'conceptual').length,
        by_type: this.glossaryData.reduce((acc, e) => {
          acc[e.type] = (acc[e.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      items: {
        total: this.itemData.length,
        by_tier: this.itemData.reduce((acc, e) => {
          acc[e.tech_tier] = (acc[e.tech_tier] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_rarity: this.itemData.reduce((acc, e) => {
          acc[e.rarity] = (acc[e.rarity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_faction: this.itemData.reduce((acc, e) => {
          acc[e.origin_faction] = (acc[e.origin_faction] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    };
  }
}

// Utility functions for loading CSV files
export async function loadCSVFile(filePath: string): Promise<string> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading CSV file ${filePath}:`, error);
    throw error;
  }
}

// Initialize a glossary manager with data
export async function initializeGlossary(): Promise<GlossaryManager> {
  const manager = new GlossaryManager();

  try {
    const [glossaryCSV, itemCSV] = await Promise.all([
      loadCSVFile('/data/world_glossary.csv'),
      loadCSVFile('/data/item_index.csv')
    ]);

    manager.loadGlossaryCSV(glossaryCSV);
    manager.loadItemCSV(itemCSV);

    return manager;
  } catch (error) {
    console.error('Failed to initialize glossary:', error);
    throw error;
  }
}

// Quick search function for external use
export function quickSearch(
  glossary: GlossaryManager,
  query: string,
  limit: number = 10
): { terms: GlossaryEntry[], items: ItemEntry[] } {
  return {
    terms: glossary.searchGlossary(query).slice(0, limit),
    items: glossary.searchItems(query).slice(0, limit)
  };
}

// Export functions for different formats
export function exportToJSON(manager: GlossaryManager, context?: string) {
  const data = context ?
    manager.exportForContext(context as any) :
    { glossary: manager['glossaryData'], items: manager['itemData'] };

  return JSON.stringify(data, null, 2);
}

export function exportToMarkdown(manager: GlossaryManager): string {
  const stats = manager.getStats();
  let markdown = "# World Glossary\n\n";

  markdown += `## Statistics\n`;
  markdown += `- **Glossary Entries**: ${stats.glossary.total} (${stats.glossary.implemented} implemented, ${stats.glossary.pending} pending)\n`;
  markdown += `- **Items**: ${stats.items.total}\n\n`;

  markdown += "## Terms by Category\n\n";
  const categories = manager.getFilterOptions().glossary.categories;
  categories.forEach(category => {
    const entries = manager.searchGlossary('', { category });
    if (entries.length > 0) {
      markdown += `### ${category}\n`;
      entries.forEach(entry => {
        markdown += `- **${entry.term}** (${entry.type}): ${entry.description}\n`;
      });
      markdown += "\n";
    }
  });

  return markdown;
}
