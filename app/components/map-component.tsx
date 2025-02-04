import MaplibreInspect from "@maplibre/maplibre-gl-inspect";
import "@maplibre/maplibre-gl-inspect/dist/maplibre-gl-inspect.css";
import maplibregl, { FullscreenControl, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef } from "react";
import config from "~/config";
import IndoorMapLayer from "~/layers/indoor-map-layer";
import POIsLayer from "~/layers/pois-layer";
import Tile3dLayer from "~/layers/tile-3d-layer";
import building from "~/mock/building.json";
import useMapStore from "~/stores/use-map-store";
import DiscoveryPanel from "./discovery-panel/discovery-panel";
import { FloorSelector } from "./ui/floor-selector";
import { FloorUpDownControl } from "./ui/floor-up-down-control";
import { IndoorMapGeoJSON } from "~/types/geojson";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);

  const setMapInstance = useMapStore((state) => state.setMapInstance);
  const indoorMapLayer = useMemo(
    () => new IndoorMapLayer(building.indoor_map as IndoorMapGeoJSON),
    [],
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      ...config.mapConfig,
      container: mapContainer.current,
    });
    setMapInstance(map);

    map.on("load", () => {
      map.addLayer(new Tile3dLayer());
      map.addLayer(indoorMapLayer);
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
      "bottom-right",
    );

    return () => {
      map.remove();
    };
  }, [indoorMapLayer, setMapInstance]);

  return (
    <div className="flex size-full flex-col">
      <DiscoveryPanel />
      <FloorSelector indoorMapLayer={indoorMapLayer} />
      <FloorUpDownControl indoorMapLayer={indoorMapLayer} />
      <div ref={mapContainer} className="size-full" />
    </div>
  );
}
