import MapLibreGlDirections, {
  LoadingIndicatorControl,
} from "@maplibre/maplibre-gl-directions";
import maplibregl, { FullscreenControl, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import config from "~/config";
import GeoJsonLayer from "~/layers/geojson-layer";
import Tile3dLayer from "~/layers/tile-3d-layer";
import NavigationInput from "./navigation-input";
import IndoorDirections from "~/indoor-directions/directions/main";

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

      map.current.addLayer(new Tile3dLayer());
      map.current.addLayer(new GeoJsonLayer());

      directions.current = new MapLibreGlDirections(map.current!, {
        api: config.routingApi,
        requestOptions: {
          overview: "full",
          steps: "true",
        },
      });
      map.current?.addControl(new LoadingIndicatorControl(directions.current));

      const indoorDirections = new IndoorDirections(map.current);
      indoorDirections
        .loadMapData("assets/geojson/museum-routes.geojson")
        .then(() => {
          const start: [number, number] = [
            -87.617_902_304_647_52, 41.865_918_557_102_56,
          ];
          const stop: [number, number] = [
            -87.617_065_170_513_3, 41.866_509_880_990_35,
          ];
          const end: [number, number] = [
            -87.616_149_747_016_3, 41.865_913_642_382_54,
          ];

          indoorDirections.setWaypoints([start, stop, end]);
        });
    });

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
