import { CreatureType } from "./creature-type.model";

export interface Creature {
    type: CreatureType;
    quantity: number;
}