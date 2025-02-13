import { NavigationControl } from "maplibre-gl";
import { useEffect } from "react";
import IndoorMapLayer from "~/layers/indoor-map-layer";
import useFloorStore from "~/stores/floor-store";
import useMapStore from "~/stores/use-map-store";

interface FloorUpDownControlProps {
  indoorMapLayer: IndoorMapLayer;
}

export function FloorUpDownControl({
  indoorMapLayer,
}: FloorUpDownControlProps) {
  const map = useMapStore((state) => state.mapInstance);
  const { currentFloor, setCurrentFloor } = useFloorStore();
  useEffect(() => {
    const floorControl = new NavigationControl({
      showCompass: false,
      showZoom: false,
      visualizePitch: false,
    });

    map?.addControl(floorControl, "bottom-right");

    const upButton = document.createElement("button");
    upButton.className =
      "maplibregl-ctrl-icon maplibregl-ctrl-floor-up dark:text-black";
    upButton.innerHTML = "&#8593;"; // Up arrow
    upButton.addEventListener("click", () => {
      const nextFloor = currentFloor + 1;
      if (nextFloor <= 2) {
        setCurrentFloor(nextFloor);
        indoorMapLayer.setFloorLevel(nextFloor);
      }
    });

    const downButton = document.createElement("button");
    downButton.className =
      "maplibregl-ctrl-icon maplibregl-ctrl-floor-down dark:text-black";
    downButton.innerHTML = "&#8595;"; // Down arrow
    downButton.addEventListener("click", () => {
      const nextFloor = currentFloor - 1;
      if (nextFloor >= 0) {
        setCurrentFloor(nextFloor);
      }
    });

    floorControl._container.append(upButton);
    floorControl._container.append(downButton);

    return () => {
      map?.removeControl(floorControl);
    };
  }, [map, currentFloor, setCurrentFloor, indoorMapLayer]);

  return null;
}
