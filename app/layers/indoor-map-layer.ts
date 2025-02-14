import { CustomLayerInterface, Map } from "maplibre-gl";
import { IndoorFeature, IndoorMapGeoJSON } from "~/types/geojson";

export default class IndoorMapLayer implements CustomLayerInterface {
  id: string = "indoor-map";
  type = "custom" as const;
  private map: Map | null = null;
  private indoorMapData: IndoorMapGeoJSON;

  constructor(indoorMapData: IndoorMapGeoJSON) {
    this.indoorMapData = indoorMapData;
  }

  render = () => {
    // Rendering is handled by maplibre's internal renderer for geojson sources
  };

  setFloorLevel(level: number) {
    if (!this.map || !this.indoorMapData) return;

    const source = this.map.getSource("indoor-map") as maplibregl.GeoJSONSource;
    const filteredFeatures = this.indoorMapData.features.filter(
      (feature: IndoorFeature) =>
        feature.properties.level_id === level ||
        feature.properties.level_id === null,
    );

    source.setData({
      type: "FeatureCollection",
      features: filteredFeatures,
    });
  }

  async getAvailableFloors(): Promise<number[]> {
    const floors = new Set<number>();
    this.indoorMapData!.features.forEach((feature) => {
      if (feature.properties.level_id !== null) {
        floors.add(feature.properties.level_id);
      }
    });

    // Always include ground floor
    const uniqueFloors = [...floors];
    if (!uniqueFloors.includes(0)) {
      uniqueFloors.push(0);
    }
    return uniqueFloors;
  }

  async onAdd(map: Map): Promise<void> {
    this.map = map;

    const colors = {
      unit: "#f3f3f3",
      unit_hovered: "red", // TODO: Change this color to whatever u want
      corridor: "#d6d5d1",
      outline: "#a6a5a2",
    };
    // TODO: remove the generateID option once we have a proper id for the source
    map.addSource("indoor-map", {
      type: "geojson",
      data: this.indoorMapData,
      generateId: true, // Auto generated the `id` property based on the feature's index of the source
    });

    map.addLayer({
      id: "indoor-map-fill",
      type: "fill",
      source: "indoor-map",
      paint: {
        "fill-color": ["coalesce", ["get", "fill"], colors.corridor],
      },
      filter: ["==", ["geometry-type"], "Polygon"],
    });

    map.addLayer({
      id: "indoor-map-fill-outline",
      type: "line",
      source: "indoor-map",
      paint: {
        "line-color": ["coalesce", ["get", "stroke"], colors.outline],
        "line-width": ["coalesce", ["get", "stroke-width"], 2],
        "line-opacity": ["coalesce", ["get", "stroke-opacity"], 1],
      },
      filter: ["==", ["geometry-type"], "Polygon"],
    });

    map.addLayer({
      id: "indoor-map-extrusion",
      type: "fill-extrusion",
      source: "indoor-map",
      filter: ["all", ["==", "feature_type", "unit"]],
      paint: {
        "fill-extrusion-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          colors.unit_hovered,
          colors.unit,
        ],
        "fill-extrusion-height": 2.5,
        "fill-extrusion-opacity": 1,
      },
    });

    map.addLayer({
      id: "indoor-map-fill-extrusion",
      type: "fill-extrusion",
      source: "indoor-map",
      filter: ["all", ["==", "feature_type", "corridor"]],
      paint: {
        "fill-extrusion-color": colors.corridor,
        "fill-extrusion-height": 0.2,
        "fill-extrusion-opacity": 1,
      },
    });
  }
}
