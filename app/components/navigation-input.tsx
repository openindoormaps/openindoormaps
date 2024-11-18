import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import {
  CarmenGeojsonFeature,
  MaplibreGeocoderApi,
  MaplibreGeocoderFeatureResults,
} from "@maplibre/maplibre-gl-geocoder";
import { SlidersVertical } from "lucide-react";
import { LngLatBounds } from "maplibre-gl";
import { MutableRefObject, useState } from "react";
import NavigationSettings from "./navigation-settings";

/**
 * TODO: Refactor to MapLibre IControl implementation
 * @see https://maplibre.org/maplibre-gl-js/docs/API/interfaces/IControl/
 */

interface NavigationInputProperties {
  directions: MutableRefObject<MapLibreGlDirections | undefined>;
  map: MutableRefObject<maplibregl.Map | undefined>;
}

export default function NavigationInput({
  directions,
  map,
}: NavigationInputProperties) {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const geocoderApi: MaplibreGeocoderApi = {
    forwardGeocode: async (config) => {
      const features: CarmenGeojsonFeature[] = [];
      try {
        const request = `https://nominatim.openstreetmap.org/search?q=${
          config.query
        }&format=geojson&polygon_geojson=1&addressdetails=1`;
        const response = await fetch(request);
        const geojson = await response.json();

        for (const feature of geojson.features) {
          const center = [
            feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
            feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
          ];
          const point: CarmenGeojsonFeature = {
            id: feature.id,
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: center,
            },
            place_name: feature.properties.display_name,
            properties: feature.properties,
            text: feature.properties.display_name,
            place_type: ["place"],
          };
          features.push(point);
        }
      } catch (error) {
        console.error(`Failed to forwardGeocode with error: ${error}`);
      }

      return {
        features,
      } as MaplibreGeocoderFeatureResults;
    },

    //TODO: add logic
    reverseGeocode: async (config) => {
      config;
      return {} as MaplibreGeocoderFeatureResults;
    },
  };

  const geocodeInput = async (input: string) => {
    try {
      const geocodeResult = (await geocoderApi.forwardGeocode({
        query: input,
      })) as MaplibreGeocoderFeatureResults;
      const features = geocodeResult.features as CarmenGeojsonFeature[];
      if (features.length > 0 && features[0].geometry.type === "Point") {
        const center = features[0].geometry.coordinates;
        return center as [number, number];
      } else {
        console.warn("Geocode result not found for input:", input);
      }
    } catch (error) {
      console.error("Failed to geocode input:", error);
    }
  };

  const handleRouting = async () => {
    if (!departure || !destination) return;
    try {
      const [departureCoord, destinationCoord] = await Promise.all([
        geocodeInput(departure),
        geocodeInput(destination),
      ]);

      if (departureCoord && destinationCoord) {
        directions.current?.setWaypoints([departureCoord, destinationCoord]);

        if (map.current) {
          const bounds = new LngLatBounds();
          bounds.extend(departureCoord);
          bounds.extend(destinationCoord);

          map.current.fitBounds(bounds, {
            padding: 20,
          });
        }
      }
    } catch (error) {
      console.error("Error during routing:", error);
    }
  };
  return (
    <div className="z-10 rounded-lg bg-white p-4 shadow-lg md:absolute md:left-4 md:top-4">
      <div className="flex items-center justify-center gap-3">
        <div className="flex w-full flex-col gap-3">
          <input
            type="text"
            autoComplete="off" //? prevent browser keeping the input value after refresh
            placeholder="Departure"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={departure}
            onChange={(event) => setDeparture(event.target.value)}
          />
          <input
            type="text"
            autoComplete="off"
            placeholder="Destination"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          />
          <button
            onClick={handleRouting}
            className="rounded-md bg-blue-500 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Find Route
          </button>
        </div>

        <button
          className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 p-2"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <SlidersVertical className="size-4" />
        </button>
      </div>
      {isSettingsOpen && <NavigationSettings />}
    </div>
  );
}
