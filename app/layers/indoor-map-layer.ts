import { CustomLayerInterface, CustomRenderMethod, Map } from "maplibre-gl";

interface IndoorFeatureProperties {
  level_id: number | null;
  [key: string]: unknown;
}

interface IndoorFeature extends GeoJSON.Feature {
  properties: IndoorFeatureProperties;
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: IndoorFeature[];
}

export default class IndoorMapLayer implements CustomLayerInterface {
  id: string = "indoor-map";
  type = "custom" as const;
  private map: Map | null = null;
  private indoorMapData: GeoJSONData;

  constructor(indoorMapData: GeoJSONData) {
    this.indoorMapData = indoorMapData;
  }

  render: CustomRenderMethod = (gl, matrix) => {
    gl && matrix; // Unused
  };

  private async loadAndSaveData(): Promise<void> {
    if (this.indoorMapData) return;

    try {
      const response = await fetch("assets/geojson/demo-map.geojson");
      this.indoorMapData = await response.json();
    } catch (error) {
      console.error("Failed to load GeoJSON data:", error);
    }
  }

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
    await this.loadAndSaveData();

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
    await this.loadAndSaveData();

    const colors = {
      unit: "#f3f3f3",
      corridor: "#d6d5d1",
      outline: "#a6a5a2",
    };

    map.addSource("indoor-map", {
      type: "geojson",
      data: this.indoorMapData,
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
        "fill-extrusion-color": colors.unit,
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
