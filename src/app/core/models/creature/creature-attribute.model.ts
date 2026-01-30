import { CreatureAttributeType } from "./creature-attribute-type.enum";

/**
 * Represents a single attribute of a creature with its type and value.
 * This allows for flexible attribute configuration.
 */
export interface CreatureAttribute {
  readonly attributeType:CreatureAttributeType;
  readonly value: number;
}