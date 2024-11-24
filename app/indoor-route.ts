export default class IndoorRoute {
  private map: maplibregl.Map;

  constructor(map: maplibregl.Map) {
    this.map = map;
  }

  public async loadGeoJson(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
      }
      const geoJsonData: GeoJSON.FeatureCollection = await response.json();

      this.map.addSource("indoor-route", {
        type: "geojson",
        data: geoJsonData,
      });

      this.map.addLayer({
        id: "indoor-route-line",
        type: "line",
        source: "indoor-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#007aff",
          "line-width": 4,
        },
      });

      this.map.addLayer({
        id: "indoor-route-points",
        type: "circle",
        source: "indoor-route",
        paint: {
          "circle-radius": 6,
          "circle-color": "#ff5722",
        },
      });
    } catch (error) {
      console.error("Error loading GeoJSON data:", error);
    }
  }
}
