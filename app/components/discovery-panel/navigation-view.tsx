import {
  Accessibility,
  ArrowLeft,
  ArrowUpDown,
  Dot,
  MapPin,
} from "lucide-react";
import { LngLatBounds } from "maplibre-gl";
import { useEffect, useState } from "react";
import IndoorDirections from "~/indoor-directions/directions/main";
import useMapStore from "~/stores/use-map-store";
import { POI } from "~/types/poi";
import { IndoorGeocoder } from "~/utils/indoor-geocoder";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SuggestionsList from "./suggestions-list";
import { Toggle } from "../ui/toggle";

interface NavigationViewProps {
  handleBackClick: () => void;
  selectedPOI: POI | null;
  indoorGeocoder: IndoorGeocoder;
  indoorDirections: IndoorDirections | null;
}

export default function NavigationView({
  handleBackClick,
  selectedPOI,
  indoorGeocoder,
  indoorDirections,
}: NavigationViewProps) {
  const [activeInput, setActiveInput] = useState<
    "departure" | "destination" | null
  >(null);
  const [departureLocation, setDepartureLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState(
    selectedPOI?.name || "",
  );
  const [suggestions, setSuggestions] = useState<POI[]>([]);
  const [isAccessibleRoute, setIsAccessibleRoute] = useState(false);
  const map = useMapStore((state) => state.mapInstance);

  const activeQuery =
    activeInput === "departure" ? departureLocation : destinationLocation;

  useEffect(() => {
    if (activeInput && activeQuery) {
      const newSuggestions = indoorGeocoder.getAutocompleteResults(activeQuery);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [activeInput, activeQuery, indoorGeocoder]);

  const handleSuggestionClick = (suggestion: POI) => {
    const newDeparture =
      activeInput === "departure" ? suggestion.name : departureLocation;
    const newDestination =
      activeInput === "destination" ? suggestion.name : destinationLocation;

    if (activeInput === "departure") {
      setDepartureLocation(suggestion.name);
    } else if (activeInput === "destination") {
      setDestinationLocation(suggestion.name);
    }
    setSuggestions([]);
    setActiveInput(null);

    handleRouting(newDeparture, newDestination);
  };

  function handleRouting(departureValue: string, destinationValue: string) {
    if (!departureValue || !destinationValue) return;
    try {
      const departureGeo = indoorGeocoder.indoorGeocodeInput(departureValue);
      const destinationGeo =
        indoorGeocoder.indoorGeocodeInput(destinationValue);

      if (!departureGeo?.coordinates || !destinationGeo?.coordinates) {
        throw new Error("Invalid geocoding results");
      }

      const departureCoord = departureGeo.coordinates as [number, number];
      const destinationCoord = destinationGeo.coordinates as [number, number];

      indoorDirections?.setWaypoints([departureCoord, destinationCoord]);

      const routeGeometry =
        indoorDirections?.routelinesCoordinates[0]?.[0]?.geometry;
      if (!routeGeometry?.coordinates?.length) {
        throw new Error("No route found");
      }

      const coordinates = routeGeometry.coordinates as [number, number][];

      let bounds = new LngLatBounds(coordinates[0], coordinates[0]);
      for (const coord of coordinates) {
        bounds = bounds.extend(coord);
      }

      map?.fitBounds(bounds, {
        padding: 200,
        speed: 0.5,
      });
    } catch (error) {
      console.error("Error during routing:", error);
      // TODO: Show error message to user
    }
  }

  function handleSwapLocations() {
    setDepartureLocation(destinationLocation);
    setDestinationLocation(departureLocation);
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <Button size="sm" variant="ghost" onClick={handleBackClick}>
          <ArrowLeft size={20} className="mr-2" />
          Back
        </Button>
        <Toggle
          variant="outline"
          pressed={isAccessibleRoute}
          size="icon"
          onClick={() => setIsAccessibleRoute(!isAccessibleRoute)}
        >
          <Accessibility size={18} />
        </Toggle>
      </div>
      <div className="flex space-x-2">
        <div className="w-full space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex h-full w-4 items-center justify-center">
                <div className="size-3 rounded-full border-2 border-white bg-[#1d9bf0] ring-4 ring-blue-100 dark:ring-0" />
              </div>
              <div className="absolute left-1/2 top-full mt-1 flex -translate-x-1/2 flex-col items-center">
                <Dot size={12} />
                <Dot size={12} />
                <Dot size={12} />
              </div>
            </div>
            <Input
              type="text"
              placeholder="Choose starting point"
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
              onFocus={() => setActiveInput("departure")}
              onBlur={() => setActiveInput(null)}
            />
          </div>
          <div className="mb-2 flex items-center space-x-4">
            <div className="w-4">
              <MapPin size={16} className="text-red-600 dark:text-red-300" />
            </div>
            <Input
              type="text"
              placeholder="Choose destination"
              value={destinationLocation}
              onChange={(e) => setDestinationLocation(e.target.value)}
              onFocus={() => setActiveInput("destination")}
              onBlur={() => setActiveInput(null)}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="icon" onClick={handleSwapLocations}>
            <ArrowUpDown size={18} />
          </Button>
        </div>
      </div>

      {activeInput && activeQuery && (
        <>
          <div className="mt-4 h-px w-full bg-gray-300 dark:bg-gray-800" />
          <SuggestionsList
            suggestions={suggestions}
            searchQuery={activeQuery}
            onSuggestionClick={handleSuggestionClick}
          />
        </>
      )}
    </>
  );
}
