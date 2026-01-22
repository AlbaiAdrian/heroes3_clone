// core/models/player/resources.model.ts
import { ResourceType } from './resource-type.enum';

export interface Resource {
  value: number;
  type: ResourceType;
}

export interface Resources {
  gold: Resource;
  wood: Resource;
  stone: Resource;
}
