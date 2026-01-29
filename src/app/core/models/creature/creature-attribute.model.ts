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
 * Configuration for creature attributes.
 * Uses a Map for extensibility - new attributes can be added without modifying the class.
 * Standard attributes include: attack, defense, minDamage, maxDamage, health, speed.
 */
export class CreatureAttributes {
  private attributes: Map<string, CreatureAttribute>;

  constructor(attributesConfig: Record<string, number>) {
    this.attributes = new Map();
    for (const [name, value] of Object.entries(attributesConfig)) {
      this.attributes.set(name, { name, value });
    }
  }

  /**
   * Get attribute value by name.
   * Returns undefined if attribute doesn't exist.
   */
  getAttribute(name: string): number | undefined {
    return this.attributes.get(name)?.value;
  }

  /**
   * Get all attributes as an array for iteration.
   */
  toArray(): CreatureAttribute[] {
    return Array.from(this.attributes.values());
  }

  /**
   * Check if an attribute exists.
   */
  hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }

  /**
   * Helper getters for standard attributes.
   */
  get attack(): number | undefined {
    return this.getAttribute('attack');
  }

  get defense(): number | undefined {
    return this.getAttribute('defense');
  }

  get minDamage(): number | undefined {
    return this.getAttribute('minDamage');
  }

  get maxDamage(): number | undefined {
    return this.getAttribute('maxDamage');
  }

  get health(): number | undefined {
    return this.getAttribute('health');
  }

  get speed(): number | undefined {
    return this.getAttribute('speed');
  }
}
