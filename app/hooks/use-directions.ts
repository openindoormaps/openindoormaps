import MapLibreGlDirections, {
  LoadingIndicatorControl,
} from "@maplibre/maplibre-gl-directions";
import { useEffect, useRef } from "react";
import config from "~/config";
import IndoorDirections from "~/indoor-directions/directions/main";

function useDirections(map: maplibregl.Map | null) {
  const directionsRef = useRef<MapLibreGlDirections | null>(null);
  const indoorDirectionsRef = useRef<IndoorDirections | null>(null);

  useEffect(() => {
    if (!map) return;

    const handleLoad = () => {
      directionsRef.current = new MapLibreGlDirections(map, {
        api: config.routingApi,
        requestOptions: { overview: "full", steps: "true" },
      });
      map.addControl(new LoadingIndicatorControl(directionsRef.current));

      indoorDirectionsRef.current = new IndoorDirections(map);
    };

    map.on("load", handleLoad);

    return () => {
      map.off("load", handleLoad);
      directionsRef.current = null;
      indoorDirectionsRef.current = null;
    };
  }, [map]);

  return {
    directions: directionsRef.current,
    indoorDirections: indoorDirectionsRef.current,
  };
}

export default useDirections;
