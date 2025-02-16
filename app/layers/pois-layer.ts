import { CustomLayerInterface, Map } from "maplibre-gl";

export default class POIsLayer implements CustomLayerInterface {
  id: string = "pois";
  type = "custom" as const;
  private POIs: GeoJSON.GeoJSON;
  private theme;

  constructor(POIs: GeoJSON.GeoJSON, theme: string = "light") {
    this.POIs = POIs;
    this.theme = theme;
  }

  render = () => {
    // Rendering is handled by maplibre's internal renderer for geojson sources
  };

  onAdd?(map: Map): void {
    const lightColor = {
      text: "#404040",
      halo: "#ffffff",
      circle: "#695f58",
    };

    const darkColor = {
      text: "#ffffff",
      halo: "#404040",
      circle: "#9ca3af",
    };

    const color = this.theme === "light" ? lightColor : darkColor;

    map.addSource("pois", {
      type: "geojson",
      data: this.POIs,
    });

    map.addLayer({
      id: "point",
      type: "circle",
      source: "pois",
      minzoom: 16,
      paint: {
        "circle-radius": 4,
        "circle-color": color.circle,
      },
    });

    map.addLayer({
      id: "point-label",
      type: "symbol",
      source: "pois",
      minzoom: 16,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 12,
        "text-offset": [0.8, 0],
        "text-anchor": "left",
        "text-max-width": 12,
      },
      paint: {
        "text-color": color.text,
        "text-halo-color": color.halo,
        "text-halo-width": 1.5,
      },
    });
  }
}
