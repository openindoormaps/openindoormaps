import { CustomLayerInterface, CustomRenderMethod, Map } from "maplibre-gl";
import config from "~/config";

export default class Tile3dLayer implements CustomLayerInterface {
  id: string = "tile-3d-layer";
  type = "custom" as const;

  render: CustomRenderMethod = (gl, matrix) => {
    gl && matrix; // Unused
  };
  onAdd?(map: Map): void {
    map.addSource("openmaptiles", {
      url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${config.keys.mapTiler}`,
      type: "vector",
    });

    map.addLayer({
      id: "3d-buildings",
      source: "openmaptiles",
      "source-layer": "building",
      type: "fill-extrusion",
      minzoom: 15,
      filter: ["!=", ["get", "hide_3d"], true],
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
