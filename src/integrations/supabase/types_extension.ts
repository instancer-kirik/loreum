// Extension types for new Loreum database tables
// These extend the existing Supabase types with new tables added in 002_fixes_for_supabase.sql

export interface LoreumMagicSystem {
  id: string;
  name: string;
  description: string;
  rules: Record<string, any>;
  source: string;
  structure: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface LoreumEnchantment {
  id: string;
  name: string;
  description: string;
  effect: Record<string, any>;
  item_tags: string[];
  associated_magic_system: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoreumCharacterInstance {
  id: string;
  character_id: string;
  timeline_id: string;
  variation_notes: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoreumItem {
  id: string;
  name: string;
  description: string;
  type: string;
  tags: string[];
  enchantments: Array<Record<string, any>>;
  associated_tech: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoreumPower {
  id: string;
  name: string;
  description: string;
  power_type: string;
  requirements: Record<string, any>;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface LoreumMagicAbility {
  id: string;
  name: string;
  description: string;
  magic_system_id: string;
  ability_level: number;
  prerequisites: Array<Record<string, any>>;
  effects: Record<string, any>;
  cost_structure: Record<string, any>;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface LoreumMagicProgressionRule {
  id: string;
  name: string;
  description: string;
  magic_system_id: string;
  progression_type: 'linear' | 'exponential' | 'milestone' | 'freeform';
  level_requirements: Record<string, any>;
  advancement_rules: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LoreumCharacterAbility {
  id: string;
  character_id: string;
  ability_source_type: 'magic' | 'power' | 'tech' | 'innate';
  ability_source_id: string | null;
  proficiency_level: number;
  notes: string | null;
  acquired_year: number | null;
  created_at: string;
  updated_at: string;
}

export interface LoreumItemEnchantment {
  id: string;
  item_id: string;
  enchantment_id: string;
  applied_by: string | null;
  applied_year: number | null;
  strength_modifier: number;
  conditions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Extended Database type that includes new tables
export type ExtendedDatabase = {
  public: {
    Tables: {
      loreum_magic_systems: {
        Row: LoreumMagicSystem;
        Insert: Omit<LoreumMagicSystem, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LoreumMagicSystem, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      loreum_enchantments: {
        Row: LoreumEnchantment;
        Insert: Omit<LoreumEnchantment, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LoreumEnchantment, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: "loreum_enchantments_associated_magic_system_fkey";
            columns: ["associated_magic_system"];
            referencedRelation: "loreum_magic_systems";
            referencedColumns: ["id"];
          }
        ];
      };
      loreum_character_instances: {
        Row: LoreumCharacterInstance;
        Insert: Omit<LoreumCharacterInstance, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LoreumCharacterInstance, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: "loreum_character_instances_character_id_fkey";
            columns: ["character_id"];
            referencedRelation: "loreum_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loreum_character_instances_timeline_id_fkey";
            columns: ["timeline_id"];
            referencedRelation: "loreum_timelines";
            referencedColumns: ["id"];
          }
        ];
      };
      loreum_items: {
        Row: LoreumItem;
        Insert: Omit<LoreumItem, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LoreumItem, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: "loreum_items_associated_tech_fkey";
            columns: ["associated_tech"];
            referencedRelation: "loreum_tech_trees";
            referencedColumns: ["id"];
          }
        ];
      };
      loreum_powers: {
        Row: LoreumPower;
        Insert: Omit<LoreumPower, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LoreumPower, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      loreum_magic_abilities: {
        Row: LoreumMagicAbility;
        Insert: Omit<LoreumMagicAbility, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LoreumMagicAbility, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: "loreum_magic_abilities_magic_system_id_fkey";
            columns: ["magic_system_id"];
            referencedRelation: "loreum_magic_systems";
            referencedColumns: ["id"];
          }
        ];
      };
      loreum_magic_progression_rules: {
        Row: LoreumMagicProgressionRule;
        Insert: Omit<LoreumMagicProgressionRule, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LoreumMagicProgressionRule, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: "loreum_magic_progression_rules_magic_system_id_fkey";
            columns: ["magic_system_id"];
            referencedRelation: "loreum_magic_systems";
            referencedColumns: ["id"];
          }
        ];
      };
      loreum_character_abilities: {
        Row: LoreumCharacterAbility;
        Insert: Omit<LoreumCharacterAbility, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LoreumCharacterAbility, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: "loreum_character_abilities_character_id_fkey";
            columns: ["character_id"];
            referencedRelation: "loreum_characters";
            referencedColumns: ["id"];
          }
        ];
      };
      loreum_item_enchantments: {
        Row: LoreumItemEnchantment;
        Insert: Omit<LoreumItemEnchantment, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<LoreumItemEnchantment, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: "loreum_item_enchantments_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "loreum_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loreum_item_enchantments_enchantment_id_fkey";
            columns: ["enchantment_id"];
            referencedRelation: "loreum_enchantments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loreum_item_enchantments_applied_by_fkey";
            columns: ["applied_by"];
            referencedRelation: "loreum_characters";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

// Helper types for common operations
export type MagicSystemInsert = ExtendedDatabase['public']['Tables']['loreum_magic_systems']['Insert'];
export type MagicSystemUpdate = ExtendedDatabase['public']['Tables']['loreum_magic_systems']['Update'];
export type EnchantmentInsert = ExtendedDatabase['public']['Tables']['loreum_enchantments']['Insert'];
export type EnchantmentUpdate = ExtendedDatabase['public']['Tables']['loreum_enchantments']['Update'];
export type CharacterInstanceInsert = ExtendedDatabase['public']['Tables']['loreum_character_instances']['Insert'];
export type CharacterInstanceUpdate = ExtendedDatabase['public']['Tables']['loreum_character_instances']['Update'];
export type ItemInsert = ExtendedDatabase['public']['Tables']['loreum_items']['Insert'];
export type ItemUpdate = ExtendedDatabase['public']['Tables']['loreum_items']['Update'];
export type PowerInsert = ExtendedDatabase['public']['Tables']['loreum_powers']['Insert'];
export type PowerUpdate = ExtendedDatabase['public']['Tables']['loreum_powers']['Update'];
export type MagicAbilityInsert = ExtendedDatabase['public']['Tables']['loreum_magic_abilities']['Insert'];
export type MagicAbilityUpdate = ExtendedDatabase['public']['Tables']['loreum_magic_abilities']['Update'];
export type MagicProgressionRuleInsert = ExtendedDatabase['public']['Tables']['loreum_magic_progression_rules']['Insert'];
export type MagicProgressionRuleUpdate = ExtendedDatabase['public']['Tables']['loreum_magic_progression_rules']['Update'];
export type CharacterAbilityInsert = ExtendedDatabase['public']['Tables']['loreum_character_abilities']['Insert'];
export type CharacterAbilityUpdate = ExtendedDatabase['public']['Tables']['loreum_character_abilities']['Update'];
export type ItemEnchantmentInsert = ExtendedDatabase['public']['Tables']['loreum_item_enchantments']['Insert'];
export type ItemEnchantmentUpdate = ExtendedDatabase['public']['Tables']['loreum_item_enchantments']['Update'];