import MapLibreGlDirections, {
  LoadingIndicatorControl,
} from "@maplibre/maplibre-gl-directions";
import {
  CarmenGeojsonFeature,
  MaplibreGeocoderApi,
  MaplibreGeocoderFeatureResults,
} from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");

  useState<[number, number]>();
  const key = "wYonyRi2hNgJVH2qgs81"; //TODO: just for testing, replace with a custom server if needed
  const tileUrl = `https://api.maptiler.com/maps/basic-v2/style.json?key=${key}`;
  const map = useRef<maplibregl.Map>();
  const directions = useRef<MapLibreGlDirections>();

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: tileUrl,
      center: [0, 0],
      zoom: 0,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.current.addControl(new maplibregl.FullscreenControl(), "bottom-right");
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "bottom-right",
    );

    map.current.on("load", () => {
      directions.current = new MapLibreGlDirections(map.current!);

      map.current?.addControl(new LoadingIndicatorControl(directions.current));
    });
  });

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
      console.log("Geocode result:", geocodeResult);
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
    console.log("Routing from:", departure, "to:", destination);
    if (!departure || !destination) return;
    try {
      const [departureResult, destinationResult] = await Promise.all([
        geocodeInput(departure),
        geocodeInput(destination),
      ]);

      if (departureResult && destinationResult) {
        directions.current?.setWaypoints([departureResult, destinationResult]);
      }
    } catch (error) {
      console.error("Error during routing:", error);
    }
  };

  return (
    <>
      <div ref={mapContainer} className="size-full"></div>

      <div className="absolute left-4 top-4 z-10 w-80 rounded-lg bg-white p-4 shadow-lg">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Departure"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              value={departure}
              onChange={(event) => setDeparture(event.target.value)}
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Destination"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </div>

          <button
            onClick={handleRouting}
            className="rounded-md bg-blue-500 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Find Route
          </button>
        </div>
      </div>
    </>
  );
}
