import { useEffect, useRef } from "react";
import { IndoorGeocoder, POIFeature } from "~/utils/indoor-geocoder";
import building from "~/mock/building.json";

export function useIndoorGeocoder() {
  const geocoderRef = useRef<IndoorGeocoder | null>(null);

  if (!geocoderRef.current) {
    geocoderRef.current = new IndoorGeocoder(
      building.pois.features as POIFeature[],
    );
  }

  // Optionally load data if necessary after instantiation
  useEffect(() => {
    // Example: geocoderRef.current.loadData();
    // If the load method is asynchronous, you can handle it here.
  }, []);

  return geocoderRef.current;
}
