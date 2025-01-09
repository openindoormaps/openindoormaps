import { CustomLayerInterface, CustomRenderMethod, Map } from "maplibre-gl";

export default class IndoorMapLayer implements CustomLayerInterface {
  id: string = "geojson";
  type = "custom" as const;
  private map: Map | null = null;

  render: CustomRenderMethod = (gl, matrix) => {
    gl && matrix; // Unused
  };

  setFloorLevel(level: number) {
    if (!this.map) return;
    
    const source = this.map.getSource('indoor-map') as maplibregl.GeoJSONSource;
    fetch('assets/geojson/demo-map.geojson')
      .then(response => response.json())
      .then(data => {
        const filteredFeatures = data.features.filter(
          (feature: any) => feature.properties.level_id === level
        );
        
        source.setData({
          type: 'FeatureCollection',
          features: filteredFeatures
        });
      });
  }

  onAdd(map: Map): void {
    this.map = map;
    const colors = {
      unit: "#f3f3f3",
      corridor: "#d6d5d1",
      outline: "#a6a5a2",
    };

    map.addSource("indoor-map", {
      type: "geojson",
      data: "assets/geojson/demo-map.geojson",
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
