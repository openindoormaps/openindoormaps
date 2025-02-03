import { POI } from "~/types/poi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SuggestionsList from "./suggestions-list";
import { useState, useEffect } from "react";
import { IndoorGeocoder } from "~/utils/indoor-geocoder";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ArrowLeft, ArrowUpDown, Circle, Dot, MapPin } from "lucide-react";
import IndoorDirections from "~/indoor-directions/directions/main";

interface NavigationViewProps {
  handleBackClick: () => void;
  selectedPOI: POI | null;
  indoorGeocoder: IndoorGeocoder;
  indoorDirections: IndoorDirections;
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
    if (activeInput === "departure") {
      setDepartureLocation(suggestion.name);
    } else if (activeInput === "destination") {
      setDestinationLocation(suggestion.name);
    }
    setSuggestions([]);
    setActiveInput(null);
    handleRouting();
  };

  function handleSwapLocations() {
    setDepartureLocation(destinationLocation);
    setDestinationLocation(departureLocation);
  }

  function handleRouting() {
    console.log("Routing from", departureLocation, "to", destinationLocation);
    if (!departureLocation || !destinationLocation) return;
    const departureCoord =
      indoorGeocoder.indoorGeocodeInput(departureLocation).coordinates;
    const destinationCoord =
      indoorGeocoder.indoorGeocodeInput(destinationLocation).coordinates;

    if (departureCoord && destinationCoord) {
      indoorDirections.setWaypoints([departureCoord, destinationCoord]);
    }
  }
  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="mb-2"
        onClick={handleBackClick}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </Button>
      <div className="flex space-x-2">
        <div className="w-full space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex h-full w-4 items-center justify-center">
                <Circle size={12} />
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
              className="grow text-sm focus:ring-0"
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
              onFocus={() => setActiveInput("departure")}
            />
          </div>
          <Separator />
          <div className="flex items-center space-x-4">
            <div className="w-4">
              <MapPin size={16} className="text-red-600" />
            </div>
            <Input
              type="text"
              placeholder="Choose destination"
              value={destinationLocation}
              onChange={(e) => setDestinationLocation(e.target.value)}
              onFocus={() => setActiveInput("destination")}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="icon" onClick={handleSwapLocations}>
            <ArrowUpDown size={18} />
          </Button>
        </div>
      </div>
      <div className="my-4 h-px w-full bg-gray-300" />

      {activeInput && (
        <>
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
