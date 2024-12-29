import { CustomLayerInterface, CustomRenderMethod, Map } from "maplibre-gl";

export default class IndoorMapLayer implements CustomLayerInterface {
  id: string = "geojson";
  type = "custom" as const;

  render: CustomRenderMethod = (gl, matrix) => {
    gl && matrix; // Unused
  };
  onAdd?(map: Map): void {
    const colors = {
      unit: "#f3f3f3",
      corridor: "#d6d5d1",
      outline: "#a6a5a2",
    };

    map.addSource("indoor-map", {
      type: "geojson",
      data: "https://raw.githubusercontent.com/map-gl-indoor/map-gl-indoor/refs/heads/main/examples/maps/caserne.geojson",
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
