import building from "~/mock/building.json";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";

function isPolygonFeature(
  feature: GeoJSON.Feature,
): feature is GeoJSON.Feature<GeoJSON.Polygon> {
  return (
    feature?.geometry?.type === "Polygon" &&
    feature?.properties?.feature_type === "unit"
  );
}

const indoorMap = building.indoor_map as GeoJSON.FeatureCollection;
const unitFeatures = indoorMap.features.filter((element) =>
  isPolygonFeature(element),
);
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
