import { CustomLayerInterface, CustomRenderMethod, Map } from "maplibre-gl";

export default class POIsLayer implements CustomLayerInterface {
  id: string = "pois";
  type = "custom" as const;
  private POIs: GeoJSON.GeoJSON;

  constructor(POIs: GeoJSON.GeoJSON) {
    this.POIs = POIs;
    console.log("POIsLayer constructor");
  }

  render: CustomRenderMethod = (gl, matrix) => {
    gl && matrix; // Unused
  };
  onAdd?(map: Map): void {
    map.addSource("pois", {
      type: "geojson",
      data: this.POIs,
    });

    map.addLayer({
      id: "point",
      type: "circle",
      source: "pois",
      paint: {
        "circle-radius": 4,
        "circle-color": "#695f58",
      },
    });

    map.addLayer({
      id: "point-label",
      type: "symbol",
      source: "pois",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Inter Regular"],
        "text-size": 12,
        "text-offset": [0.8, 0],
        "text-anchor": "left",
        "text-max-width": 12,
      },
      paint: {
        "text-color": "#404040",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1.5,
      },
    });
  }
}
