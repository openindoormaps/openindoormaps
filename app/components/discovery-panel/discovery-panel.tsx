import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { useEffect, useState } from "react";
import building from "~/mock/building.json";
import useMapStore from "~/stores/use-map-store";

import useDirections from "~/hooks/use-directions";
import { useIndoorGeocoder } from "~/hooks/use-indoor-geocder";
import { POI } from "~/types/poi";
import { Card, CardContent } from "../ui/card";
import DiscoveryView from "./discovery-view";
import LocationDetail from "./location-detail";
import NavigationView from "./navigation-view";
import poiMap from "~/utils/poi-map";

type UIMode = "discovery" | "detail" | "navigation";

export default function DiscoveryPanel() {
  const map = useMapStore((state) => state.mapInstance);
  const [mode, setMode] = useState<UIMode>("discovery");
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const { indoorDirections } = useDirections(map);
  const indoorGeocoder = useIndoorGeocoder();

  indoorDirections?.loadMapData(
    building.indoor_routes as GeoJSON.FeatureCollection,
  );

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

  function handleSelectPOI(poi: POI) {
    setSelectedPOI(poi);
    setMode("detail");
  }

  function handleBackClick() {
    setMode("discovery");
    setSelectedPOI(null);
    indoorDirections?.clear();
  }

  useEffect(() => {
    map?.on("click", "indoor-map-extrusion", (event) => {
      const { features } = event;
      if (!features?.length) return;

      const clickedFeature = features[0];
      const unitId = Number(clickedFeature.id);
      const relatedPOIs = poiMap.get(unitId);
      console.log(relatedPOIs);

      if (relatedPOIs && relatedPOIs[0]) {
        const firstPOI = relatedPOIs[0];
        const poi: POI = {
          name: firstPOI.properties?.name as string,
          coordinates: firstPOI.geometry.coordinates,
        };
        handleSelectPOI(poi);
      }
    });
  }, [map]);

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
            handleBackClick={handleBackClick}
          />
        )}
        {mode === "navigation" && (
          <NavigationView
            handleBackClick={handleBackClick}
            selectedPOI={selectedPOI}
            indoorGeocoder={indoorGeocoder}
            indoorDirections={indoorDirections!}
          />
        )}
      </CardContent>
    </Card>
  );
}
