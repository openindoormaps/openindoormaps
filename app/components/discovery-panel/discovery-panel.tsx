import MapLibreGlDirections, {
  LoadingIndicatorControl,
} from "@maplibre/maplibre-gl-directions";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { useCallback, useMemo, useRef, useState } from "react";
import config from "~/config";
import IndoorDirections from "~/indoor-directions/directions/main";
import building from "~/mock/building.json";
import useMapStore from "~/stores/use-map-store";

import { POI } from "~/types/poi";
import { IndoorGeocoder, POIFeature } from "~/utils/indoor-geocoder";
import { Card, CardContent } from "../ui/card";
import DiscoveryView from "./discovery-view";
import LocationDetail from "./location-detail";
import NavigationView from "./navigation-view";

type UIMode = "discovery" | "detail" | "navigation";

export default function DiscoveryPanel() {
  const map = useMapStore((state) => state.mapInstance);
  const directions = useRef<MapLibreGlDirections>();
  const indoorDirections = useRef<IndoorDirections>();
  const [mode, setMode] = useState<UIMode>("discovery");
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  const indoorGeocoder = useMemo(() => {
    return new IndoorGeocoder(building.pois.features as POIFeature[]);
  }, []);

  map?.on("load", () => {
    directions.current = new MapLibreGlDirections(map, {
      api: config.routingApi,
      requestOptions: {
        overview: "full",
        steps: "true",
      },
    });
    map?.addControl(new LoadingIndicatorControl(directions.current));

    indoorDirections.current = new IndoorDirections(map);
    indoorDirections.current.loadMapData(
      building.indoor_routes as GeoJSON.FeatureCollection,
    );
  });

  /* 
  * Code for outdoor routing
    if (!departure || !destination) return;
    try {
      const [departureCoord, destinationCoord] = await Promise.all([
        geocodeInput(departure),
        geocodeInput(destination),
      ]);

      if (departureCoord && destinationCoord) {
        directions.current?.setWaypoints([departureCoord, destinationCoord]);

        if (map) {
          const bounds = new LngLatBounds();
          bounds.extend(departureCoord);
          bounds.extend(destinationCoord);

          map.fitBounds(bounds, {
            padding: 20,
          });
        }
      }
    } catch (error) {
      console.error("Error during routing:", error);
    }
      */

  const handleSelectPOI = useCallback((poi: POI) => {
    setSelectedPOI(poi);
    console.log("Selected POI", poi);
    setMode("detail");
  }, []);

  return (
    <Card className="z-10 w-full max-w-[23.5rem] rounded-xl bg-white shadow-lg md:absolute md:left-4 md:top-4">
      <CardContent className="p-4">
        {mode === "discovery" && (
          <DiscoveryView
            indoorGeocoder={indoorGeocoder}
            onSelectPOI={handleSelectPOI}
          />
        )}
        {mode === "detail" && selectedPOI && (
          <LocationDetail
            selectedPOI={selectedPOI}
            handleDirectionsClick={() => setMode("navigation")}
            handleBackClick={() => setMode("discovery")}
          />
        )}
        {mode === "navigation" && (
          <NavigationView
            handleBackClick={() => setMode("discovery")}
            selectedPOI={selectedPOI}
            indoorGeocoder={indoorGeocoder}
            indoorDirections={indoorDirections.current!}
          />
        )}
      </CardContent>
    </Card>
  );
}
