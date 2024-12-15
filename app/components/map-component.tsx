import maplibregl, { FullscreenControl, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import config from "~/config";
import IndoorDirections from "~/indoor-directions/directions/main";
import IndoorMapLayer from "~/layers/indoor-map-layer";
import Tile3dLayer from "~/layers/tile-3d-layer";
import useMapStore from "~/stores/use-map-store";
import NavigationInput from "./navigation-input";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const setMapInstance = useMapStore((state) => state.setMapInstance);

  useEffect(() => {
    const map = new maplibregl.Map({
      ...config.mapConfig,
      container: mapContainer.current!,
    });
    setMapInstance(map);

    map.on("load", () => {
      map.addLayer(new Tile3dLayer());
      map.addLayer(new IndoorMapLayer());

      const indoorDirections = new IndoorDirections(map);
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

    map.addControl(new NavigationControl(), "bottom-right");
    map.addControl(new FullscreenControl(), "bottom-right");
    return () => {
      map.remove();
    };
  });

  return (
    <div className="flex size-full flex-col">
      <NavigationInput />
      <div ref={mapContainer} className="size-full"></div>
    </div>
  );
}
