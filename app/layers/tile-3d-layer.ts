import { CustomLayerInterface, CustomRenderMethod, Map } from "maplibre-gl";

export default class Tile3dLayer implements CustomLayerInterface {
  id: string = "tile-3d-layer";
  type = "custom" as const;

  render: CustomRenderMethod = (gl, matrix) => {
    gl && matrix; // Unused
  };
  onAdd?(map: Map): void {
    map.addLayer({
      id: "3d-buildings",
      source: "maptiler_planet",
      "source-layer": "building",
      type: "fill-extrusion",
      minzoom: 15,
      filter: ["all", ["!=", "$id", 24_825_537], ["!=", "$id", 16_699_535]],
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["get", "render_height"],
          0,
          "lightgray",
          200,
          "royalblue",
          400,
          "lightblue",
        ],
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          16,
          ["get", "render_height"],
        ],
        "fill-extrusion-base": [
          "case",
          [">=", ["get", "zoom"], 16],
          ["get", "render_min_height"],
          0,
        ],
      },
    });
  }
}
