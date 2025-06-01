// Types related to magic and enchantment systems
export interface MagicSystem {
  id: string;
  name: string;
  description: string;
  source: 'divine' | 'arcane' | 'natural' | 'technological' | 'psychic' | 'cosmic' | 'elemental' | 'forbidden' | string;
  disciplines: MagicDiscipline[];
  restrictions: MagicRestriction[];
  culturalSignificance: string;
  historyAndOrigin: string;
  primaryElements: string[];
}

export interface MagicDiscipline {
  id: string;
  name: string;
  description: string;
  primaryEffects: string[];
  skillProgression: MagicSkillLevel[];
  requiredAptitude: number; // 0-100 scale of innate ability needed
  teachability: number; // 0-100 scale of how easily taught vs inherent
  itemsAndFoci: string[]; // Types of items that enhance this discipline
  opposingDisciplines: string[]; // Disciplines that conflict with this one
}

export interface MagicSkillLevel {
  id: string;
  name: string;
  level: number;
  description: string;
  abilities: string[];
  trainingTime: number; // Time in years to master
  prerequisites: string[]; // IDs of other skill levels
}

export interface MagicRestriction {
  id: string;
  name: string;
  description: string;
  type: 'material' | 'temporal' | 'spatial' | 'ethical' | 'physiological' | string;
  severity: number; // 0-100 scale of how limiting it is
  workarounds: string[]; // Possible ways to circumvent
}

export interface Enchantment {
  id: string;
  name: string;
  description: string;
  tier: number; // Power level
  discipline: string; // Magic discipline ID
  duration: EnchantmentDuration;
  effects: EnchantmentEffect[];
  components: EnchantmentComponent[];
  itemCompatibility: string[]; // Types of items that can receive this enchantment
  counterMeasures: string[]; // Methods to dispel or protect against
  stackable: boolean; // Can multiple of this enchantment be applied
  conflictingEnchantments: string[]; // IDs of enchantments that can't coexist
  loreReference: string; // Historical or mythological reference
}

export type EnchantmentDuration = 
  | { type: 'temporary'; duration: number; unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'years' }
  | { type: 'permanent' }
  | { type: 'conditional'; condition: string }
  | { type: 'charges'; charges: number };

export interface EnchantmentEffect {
  id: string;
  name: string;
  description: string;
  type: 'buff' | 'debuff' | 'utility' | 'transformation' | 'summoning' | 'protection' | string;
  potency: number; // 0-100 scale
  radius: number; // Effect radius in meters, 0 for single target
  trigger: 'passive' | 'active' | 'reactive' | 'conditional'; // How the effect activates
  triggerCondition?: string; // Required if trigger is 'conditional'
  visualEffect: string; // Description of visible manifestation
}

export interface EnchantmentComponent {
  id: string;
  name: string;
  description: string;
  type: 'reagent' | 'catalyst' | 'focus' | 'inscription' | 'sacrifice' | string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic' | string;
  quantity: number;
  consumedOnCast: boolean;
  sourceRegions: string[]; // Region IDs where this component can be found
}

// Extension to existing TechItem interface to support magical properties
export interface MagicalItemProperties {
  enchantments: string[]; // IDs of enchantments applied to the item
  inherentMagic: boolean; // Is the item inherently magical or just enchanted
  magicSource: string; // ID of the magic system this item draws from
  magicCharges: number; // Number of uses before depleted, if applicable
  rechargeMethod?: string; // How to restore charges if depleted
  attunementRequired: boolean; // Does the item require attunement to use
  attunementProcess?: string; // Description of attunement process
  curseProperties?: {
    cursed: boolean;
    curseDescription: string;
    curseRemovalMethod: string;
  };
  magicalResonance: string[]; // Types of magic it resonates with
  antiMagicVulnerability: number; // 0-100 scale of vulnerability to anti-magic
  planarOrigin?: string; // Otherworldly origin if applicable
}

// Extensions to existing types to support magic and enchantments
export interface MagicTechDomain extends TechDomain {
  magicSystem: string; // ID of the magic system this domain is linked to
  magicalAffinity: number; // 0-100 scale of how magical vs. technological
  hybridizationLevel: number; // 0-100 scale of tech/magic integration
}

export interface MagicTechnology extends Technology {
  magicRequirements: string[]; // Magic disciplines required
  antiMagicResistance: number; // 0-100 scale of resistance to magic disruption
  technomagicalSynergy: string[]; // Technologies that enhance magical effects
}