export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      loreum_multiverses: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      loreum_universes: {
        Row: {
          id: string
          name: string
          description: string
          multiverse_id: string
          physical_laws: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          multiverse_id: string
          physical_laws?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          multiverse_id?: string
          physical_laws?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_universes_multiverse_id_fkey"
            columns: ["multiverse_id"]
            isOneToOne: false
            referencedRelation: "loreum_multiverses"
            referencedColumns: ["id"]
          }
        ]
      }
      loreum_timelines: {
        Row: {
          id: string
          name: string
          description: string
          universe_id: string
          start_year: number
          end_year: number | null
          fork_point: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          universe_id: string
          start_year: number
          end_year?: number | null
          fork_point?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          universe_id?: string
          start_year?: number
          end_year?: number | null
          fork_point?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_timelines_universe_id_fkey"
            columns: ["universe_id"]
            isOneToOne: false
            referencedRelation: "loreum_universes"
            referencedColumns: ["id"]
          }
        ]
      }
      loreum_worlds: {
        Row: {
          id: string
          name: string
          description: string
          timeline_id: string
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          timeline_id: string
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          timeline_id?: string
          type?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_worlds_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "loreum_timelines"
            referencedColumns: ["id"]
          }
        ]
      }
      loreum_civilizations: {
        Row: {
          id: string
          name: string
          description: string
          world_id: string
          population_dynamics: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          world_id: string
          population_dynamics?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          world_id?: string
          population_dynamics?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_civilizations_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          }
        ]
      }
      loreum_regions: {
        Row: {
          id: string
          name: string
          description: string
          world_id: string
          terrain: Json
          climate: string
          resources: Json
          area: number
          coordinates: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          world_id: string
          terrain?: Json
          climate: string
          resources?: Json
          area: number
          coordinates?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          world_id?: string
          terrain?: Json
          climate?: string
          resources?: Json
          area?: number
          coordinates?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_regions_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          }
        ]
      }
      loreum_characters: {
        Row: {
          id: string
          name: string
          description: string
          species: string
          birth_year: number
          death_year: number | null
          affiliations: string[]
          relationships: Json
          abilities: string[]
          equipment: string[]
          voice_profile: Json | null
          narrative_roles: string[]
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          species: string
          birth_year: number
          death_year?: number | null
          affiliations?: string[]
          relationships?: Json
          abilities?: string[]
          equipment?: string[]
          voice_profile?: Json | null
          narrative_roles?: string[]
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          species?: string
          birth_year?: number
          death_year?: number | null
          affiliations?: string[]
          relationships?: Json
          abilities?: string[]
          equipment?: string[]
          voice_profile?: Json | null
          narrative_roles?: string[]
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      loreum_ipsumarium_templates: {
        Row: {
          id: string
          name: string
          description: string
          type: string
          tags: string[]
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: string
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: string
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      loreum_species: {
        Row: {
          id: string
          name: string
          description: string
          biology: string
          traits: string[]
          average_lifespan: number
          reproduction_method: string
          social_structure: string
          intelligence: number
          physical_capabilities: Json
          civilization_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          biology: string
          traits?: string[]
          average_lifespan: number
          reproduction_method: string
          social_structure: string
          intelligence: number
          physical_capabilities?: Json
          civilization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          biology?: string
          traits?: string[]
          average_lifespan?: number
          reproduction_method?: string
          social_structure?: string
          intelligence?: number
          physical_capabilities?: Json
          civilization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_species_civilization_id_fkey"
            columns: ["civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          }
        ]
      }
      loreum_governments: {
        Row: {
          id: string
          name: string
          description: string
          type: string
          structure: string
          leaders: string[]
          start_year: number
          end_year: number | null
          civilization_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: string
          structure: string
          leaders?: string[]
          start_year: number
          end_year?: number | null
          civilization_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: string
          structure?: string
          leaders?: string[]
          start_year?: number
          end_year?: number | null
          civilization_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_governments_civilization_id_fkey"
            columns: ["civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          }
        ]
      }
      loreum_tech_trees: {
        Row: {
          id: string
          name: string
          description: string
          domains: Json
          magic_domains: Json | null
          is_magical: boolean
          civilization_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          domains?: Json
          magic_domains?: Json | null
          is_magical?: boolean
          civilization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          domains?: Json
          magic_domains?: Json | null
          is_magical?: boolean
          civilization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_tech_trees_civilization_id_fkey"
            columns: ["civilization_id"]
            isOneToOne: false
            referencedRelation: "loreum_civilizations"
            referencedColumns: ["id"]
          }
        ]
      }
      loreum_lore_nodes: {
        Row: {
          id: string
          name: string
          description: string
          type: string
          year: number | null
          connections: Json
          causality: Json
          world_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: string
          year?: number | null
          connections?: Json
          causality?: Json
          world_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: string
          year?: number | null
          connections?: Json
          causality?: Json
          world_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_lore_nodes_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "loreum_worlds"
            referencedColumns: ["id"]
          }
        ]
      }
      loreum_star_systems: {
        Row: {
          id: string
          name: string
          description: string
          coordinates: Json
          star_type: string
          planets: Json
          travel_routes: Json
          controlling_faction: string | null
          universe_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          coordinates?: Json
          star_type: string
          planets?: Json
          travel_routes?: Json
          controlling_faction?: string | null
          universe_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          coordinates?: Json
          star_type?: string
          planets?: Json
          travel_routes?: Json
          controlling_faction?: string | null
          universe_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loreum_star_systems_universe_id_fkey"
            columns: ["universe_id"]
            isOneToOne: false
            referencedRelation: "loreum_universes"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never