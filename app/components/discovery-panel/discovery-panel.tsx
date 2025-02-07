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
import { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

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
  function navigateToPOI(coordinates: GeoJSON.Position) {
    map?.flyTo({
      center: coordinates as [number, number],
      zoom: 20,
      duration: 1000,
    });
  }
  function handleSelectPOI(poi: POI) {
    setSelectedPOI(poi);
    setMode("detail");
    navigateToPOI(poi.coordinates);
  }

  function handleBackClick() {
    setMode("discovery");
    setSelectedPOI(null);
    indoorDirections?.clear();
  }

  useEffect(() => {
    const handleMapClick = (
      event: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      },
    ) => {
      const { features } = event;
      if (!features?.length) return;

      const clickedFeature = features[0];
      const unitId = Number(clickedFeature.id);
      const relatedPOIs = poiMap.get(unitId);

      if (relatedPOIs && relatedPOIs[0]) {
        const firstPOI = relatedPOIs[0];
        const poi: POI = {
          name: firstPOI.properties?.name as string,
          coordinates: firstPOI.geometry.coordinates,
        };
        setSelectedPOI(poi);
        if (mode === "discovery" || mode === "detail") {
          navigateToPOI(poi.coordinates);
          if (mode === "discovery") {
            setMode("detail");
          }
        }
      }
    };

    map?.on("click", "indoor-map-extrusion", handleMapClick);
    return () => {
      map?.off("click", "indoor-map-extrusion", handleMapClick);
    };
  }, [map, mode, navigateToPOI]);

  return (
    <Card className="absolute z-10 w-full rounded-xl bg-white shadow-lg md:absolute md:left-4 md:top-4 md:max-w-[23.5rem]">
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
