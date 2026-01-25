import { ResourceType } from './resource-type.enum';

export interface OwnedMine {
  readonly id: string;
  readonly resourceType: ResourceType;
  readonly productionAmount: number;
}
