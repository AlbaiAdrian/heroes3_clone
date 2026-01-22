import { ObjectFootprintTile } from "../../models/map-objects/map-object-footprint.model";


export function getFootprintSize(
  footprint: readonly ObjectFootprintTile[]
): { width: number; height: number } {
  const maxX = Math.max(...footprint.map(p => p.dx));
  const maxY = Math.max(...footprint.map(p => p.dy));

  return {
    width: maxX + 1,
    height: maxY + 1,
  };
}
