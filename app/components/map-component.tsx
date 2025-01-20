import maplibregl, { FullscreenControl, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import config from "~/config";
import IndoorDirections from "~/indoor-directions/directions/main";
import IndoorMapLayer from "~/layers/indoor-map-layer";
import Tile3dLayer from "~/layers/tile-3d-layer";
import useMapStore from "~/stores/use-map-store";
import NavigationInput from "./navigation-input";
import MaplibreInspect from "@maplibre/maplibre-gl-inspect";
import "@maplibre/maplibre-gl-inspect/dist/maplibre-gl-inspect.css";
import useFloorStore from "~/stores/floor-store";

function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { currentFloor, setCurrentFloor } = useFloorStore();
  const setMapInstance = useMapStore((state) => state.setMapInstance);
  let indoorMapLayer: IndoorMapLayer;

  useEffect(() => {
    const map = new maplibregl.Map({
      ...config.mapConfig,
      container: mapContainer.current!,
    });
    setMapInstance(map);
    indoorMapLayer = new IndoorMapLayer();

    map.on("load", () => {
      map.addLayer(new Tile3dLayer());
      map.addLayer(indoorMapLayer);

      const indoorDirections = new IndoorDirections(map);
      indoorDirections.loadMapData("assets/geojson/indoor-routes.geojson");

      const start: [number, number] = [
        3.110_255_339_660_966_5, 45.759_180_103_714_186,
      ];
      const end: [number, number] = [
        3.111_802_160_097_454_4, 45.758_458_704_536_62,
      ];

      setTimeout(() => {
        indoorDirections.setWaypoints([start, end]);
      }, 1500);
    });

    // Add floor control buttons
    const floorControl = new maplibregl.NavigationControl({
      showCompass: false,
      showZoom: false,
      visualizePitch: false,
    });

    map.addControl(floorControl, "bottom-right");

    // Custom floor controls
    const upButton = document.createElement("button");
    upButton.className = "maplibregl-ctrl-icon maplibregl-ctrl-floor-up";
    upButton.innerHTML = "&#8593;"; // Up arrow
    upButton.addEventListener("click", () => {
      const nextFloor = currentFloor + 1;
      if (nextFloor <= 2) {
        setCurrentFloor(nextFloor);
        indoorMapLayer.setFloorLevel(nextFloor);
      }
    });

    const downButton = document.createElement("button");
    downButton.className = "maplibregl-ctrl-icon maplibregl-ctrl-floor-down";
    downButton.innerHTML = "&#8595;"; // Down arrow
    downButton.addEventListener("click", () => {
      setCurrentFloor(2);
      indoorMapLayer.setFloorLevel(2);
    });

    floorControl._container.append(upButton);
    floorControl._container.append(downButton);

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
  }, []);

  return (
    <div className="flex size-full flex-col">
      <NavigationInput />
      <div ref={mapContainer} className="size-full"></div>
    </div>
  );
}

export default MapComponent;
