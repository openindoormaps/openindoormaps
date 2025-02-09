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

  useEffect(() => {
    // TODO: Implement data loading when API is ready
    // const loadData = async () => {
    //   if (geocoderRef.current) {
    //     await geocoderRef.current.loadData();
    //   }
    // };
    // loadData();
  }, []);

  return geocoderRef.current;
}
