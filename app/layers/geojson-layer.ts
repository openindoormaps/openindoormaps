import { CustomLayerInterface, CustomRenderMethod, Map } from "maplibre-gl";

export default class GeoJsonLayer implements CustomLayerInterface {
  id: string = "geojson";
  type = "custom" as const;

  render: CustomRenderMethod = (gl, matrix) => {
    gl && matrix; // Unused
  };
  onAdd?(map: Map): void {
    map.addSource("floorplan", {
      type: "geojson",
      data: "https://maplibre.org/maplibre-gl-js/docs/assets/indoor-3d-map.geojson",
    });

    map.addLayer({
      id: "room-extrusion",
      type: "fill-extrusion",
      source: "floorplan",
      paint: {
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "base_height"],
        "fill-extrusion-opacity": 0.5,
      },
    });
  }
}
