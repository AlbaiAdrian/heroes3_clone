// core/models/creature/creature-attribute.model.ts

/**
 * Represents a single attribute of a creature with its name and value.
 * This allows for flexible attribute configuration.
 */
export interface CreatureAttribute {
  readonly name: string;
  readonly value: number;
}

/**
 * Configuration for standard creature attributes.
 * Can be extended in the future to add new attributes without modifying the core class.
 */
export class CreatureAttributes {
  readonly attack: CreatureAttribute;
  readonly defense: CreatureAttribute;
  readonly minDamage: CreatureAttribute;
  readonly maxDamage: CreatureAttribute;
  readonly health: CreatureAttribute;
  readonly speed: CreatureAttribute;

  constructor(
    attack: number,
    defense: number,
    minDamage: number,
    maxDamage: number,
    health: number,
    speed: number
  ) {
    this.attack = { name: 'attack', value: attack };
    this.defense = { name: 'defense', value: defense };
    this.minDamage = { name: 'minDamage', value: minDamage };
    this.maxDamage = { name: 'maxDamage', value: maxDamage };
    this.health = { name: 'health', value: health };
    this.speed = { name: 'speed', value: speed };
  }

  /**
   * Get all attributes as an array for iteration.
   */
  toArray(): CreatureAttribute[] {
    return [
      this.attack,
      this.defense,
      this.minDamage,
      this.maxDamage,
      this.health,
      this.speed
    ];
  }

  /**
   * Get attribute value by name.
   */
  getAttribute(name: string): number | undefined {
    const attr = this.toArray().find(a => a.name === name);
    return attr?.value;
  }
}
