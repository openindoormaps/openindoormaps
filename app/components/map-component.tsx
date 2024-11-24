import MapLibreGlDirections, {
  LoadingIndicatorControl,
} from "@maplibre/maplibre-gl-directions";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl, { FullscreenControl, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import config from "~/config";
import GeoJsonLayer from "~/layers/geojson-layer";
import Tile3dLayer from "~/layers/tile-3d-layer";
import NavigationInput from "./navigation-input";
import IndoorRoute from "~/indoor-route";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>();
  const directions = useRef<MapLibreGlDirections>();

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      ...config.mapConfig,
      container: mapContainer.current!,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add layers
      map.current.addLayer(new Tile3dLayer());
      map.current.addLayer(new GeoJsonLayer());

      // Initialize directions
      directions.current = new MapLibreGlDirections(map.current!, {
        requestOptions: { overview: "full", steps: "true" },
      });
      map.current?.addControl(new LoadingIndicatorControl(directions.current));

      // Initialize indoor navigation
      const indoorRoute = new IndoorRoute(map.current);
      indoorRoute.loadGeoJson("assets/museum2.geojson"); // Path relative to public directory
    });

    // Add controls
    map.current.addControl(new NavigationControl(), "bottom-right");
    map.current.addControl(new FullscreenControl(), "bottom-right");
  });

  return (
    <div className="flex size-full flex-col">
      <NavigationInput directions={directions} map={map} />
      <div ref={mapContainer} className="size-full"></div>
    </div>
  );
}
