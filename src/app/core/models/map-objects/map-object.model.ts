import { ObjectEntryTile } from "./map-object-entry.model";
import { ObjectFootprintTile } from "./map-object-footprint.model";
import { MapObjectType } from "./map-object-type.enum";


export interface MapObject {
  readonly id: string;
  readonly type: MapObjectType;
  readonly x: number;
  readonly y: number;

  readonly footprint: readonly ObjectFootprintTile[];
  readonly entries: readonly ObjectEntryTile[];
}