import building from "~/mock/building.json";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";

const unitFeatures = (
  building.indoor_map.features as GeoJSON.Feature<GeoJSON.Polygon>[]
).filter((feature) => feature.properties?.feature_type === "unit");
const poiMap = new Map<number, GeoJSON.Feature<GeoJSON.Point>[]>();

unitFeatures.forEach((unitFeature) => {
  poiMap.set(Number(unitFeature.id), []);
});

(building.pois.features as GeoJSON.Feature<GeoJSON.Point>[]).forEach(
  (poiFeature) => {
    const poiCoordinates = poiFeature.geometry.coordinates;

    for (const unitFeature of unitFeatures) {
      if (
        booleanPointInPolygon(
          poiCoordinates,
          unitFeature as GeoJSON.Feature<GeoJSON.Polygon>,
        )
      ) {
        poiMap.get(Number(unitFeature.id))?.push(poiFeature);

        break;
      }
    }
  },
);

export default poiMap;
