/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import MapLibreGlDirections, {
  LoadingIndicatorControl,
} from "@maplibre/maplibre-gl-directions";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { Accessibility, SlidersVertical } from "lucide-react";
import { LngLatBounds } from "maplibre-gl";
import { useRef, useState } from "react";
import config from "~/config";
import useMapStore from "~/stores/use-map-store";
import NavigationSettings from "./navigation-settings";
import { geocodeInput } from "~/utils/geocoding";
import { Toggle } from "./ui/toggle";
import { Button } from "./ui/button";
import { indoorGeocodeInput } from "~/utils/indoor-geocoding";
import IndoorDirections from "~/indoor-directions/directions/main";
import building from "~/mock/building.json";

export default function NavigationInput() {
  const map = useMapStore((state) => state.mapInstance);
  const directions = useRef<MapLibreGlDirections>();
  const indoorDirections = useRef<IndoorDirections>();
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccessibleRoute, setIsAccessibleRoute] = useState(false);

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

  const handleRouting = async () => {
    console.log("Routing from", departure, "to", destination);
    if (!departure || !destination) return;
    const departureCoord = indoorGeocodeInput(departure);
    const destinationCoord = indoorGeocodeInput(destination);

    if (departureCoord && destinationCoord) {
      indoorDirections.current?.setWaypoints([
        departureCoord,
        destinationCoord,
      ]);
    }

    /*
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
  };
  return (
    <div className="z-10 rounded-lg bg-white p-4 shadow-lg md:absolute md:left-4 md:top-4">
      <div className="flex w-full flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            autoComplete="off" //? prevent browser keeping the input value after refresh
            placeholder="Departure"
            className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={departure}
            onChange={(event) => setDeparture(event.target.value)}
          />
          <Toggle
            variant="outline"
            onClick={() => setIsAccessibleRoute(!isAccessibleRoute)}
          >
            <Accessibility />
          </Toggle>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            autoComplete="off"
            placeholder="Destination"
            className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          />
          <Toggle
            variant="outline"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <SlidersVertical />
          </Toggle>
        </div>
        <Button variant="primary" onClick={handleRouting}>
          {" "}
          Find Route
        </Button>
      </div>

      {isSettingsOpen && <NavigationSettings />}
    </div>
  );
}
