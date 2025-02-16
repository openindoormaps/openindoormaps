import { CustomLayerInterface, Map } from "maplibre-gl";
import { IndoorFeature, IndoorMapGeoJSON } from "~/types/geojson";

export default class IndoorMapLayer implements CustomLayerInterface {
  id: string = "indoor-map";
  type = "custom" as const;
  private map: Map | null = null;
  private indoorMapData: IndoorMapGeoJSON;
  private theme;
  private hoveredRoomId: number | null = null;

  constructor(indoorMapData: IndoorMapGeoJSON, theme: string = "light") {
    this.indoorMapData = indoorMapData;
    this.theme = theme;
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

    const uniqueFloors = [...floors];
    if (!uniqueFloors.includes(0)) {
      uniqueFloors.push(0);
    }
    return uniqueFloors;
  }

  async onAdd(map: Map): Promise<void> {
    this.map = map;

    const lightColor = {
      unit: "#f3f3f3",
      unit_hovered: "#e0e0e0",
      corridor: "#d6d5d1",
      outline: "#a6a5a2",
    };

    const darkColor = {
      unit: "#1f2937",
      unit_hovered: "#374151",
      corridor: "#030712",
      outline: "#1f2937",
    };

    const colors = this.theme === "dark" ? darkColor : lightColor;

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

    map.on("mousemove", "indoor-map-extrusion", (e) => {
      if (e.features && e.features.length > 0) {
        // Clear previous hover state if needed
        if (this.hoveredRoomId !== null) {
          map.setFeatureState(
            { source: "indoor-map", id: this.hoveredRoomId },
            { hover: false },
          );
        }
        this.hoveredRoomId = e.features[0].id as number;
        map.setFeatureState(
          { source: "indoor-map", id: this.hoveredRoomId },
          { hover: true },
        );
      }
    });

    map.on("mouseleave", "indoor-map-extrusion", () => {
      if (this.hoveredRoomId !== null) {
        map.setFeatureState(
          { source: "indoor-map", id: this.hoveredRoomId },
          { hover: false },
        );
        this.hoveredRoomId = null;
      }
    });
  }
}
