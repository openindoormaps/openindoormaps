import MaplibreInspect from "@maplibre/maplibre-gl-inspect";
import "@maplibre/maplibre-gl-inspect/dist/maplibre-gl-inspect.css";
import maplibregl, { FullscreenControl, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import config from "~/config";
import IndoorMapLayer from "~/layers/indoor-map-layer";
import POIsLayer from "~/layers/pois-layer";
import Tile3dLayer from "~/layers/tile-3d-layer";
import building from "~/mock/building.json";
import useMapStore from "~/stores/use-map-store";
import DiscoveryPanel from "./discovery-panel/discovery-panel";

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
      map.addLayer(new IndoorMapLayer(building.indoor_map as GeoJSON.GeoJSON));
      map.addLayer(new POIsLayer(building.pois as GeoJSON.GeoJSON));
    });

    map.addControl(new NavigationControl(), "bottom-right");
    map.addControl(new FullscreenControl(), "bottom-right");
    map.addControl(
      new MaplibreInspect({
        popup: new maplibregl.Popup({
          closeOnClick: false,
        }),
        blockHoverPopupOnClick: true,
      }),
    );
    return () => {
      map.remove();
    };
  });

  return (
    <div className="flex size-full flex-col">
      <DiscoveryPanel />
      <div ref={mapContainer} className="size-full"></div>
    </div>
  );
}
