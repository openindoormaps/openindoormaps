import { ArrowLeft, Search, SlidersVertical } from "lucide-react";
import topLocations from "~/mock/top-locations";
import NavigationSettings from "../navigation-settings";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Toggle } from "../ui/toggle";
import { useEffect, useState } from "react";
import { IndoorGeocoder } from "~/utils/indoor-geocoder";
import useMapStore from "~/stores/use-map-store";
import { POI } from "~/types/poi";

interface DiscoveryViewProps {
  indoorGeocoder: IndoorGeocoder;
  onSelectPOI: (poi: POI) => void;
}

export default function DiscoveryView({
  indoorGeocoder,
  onSelectPOI,
}: DiscoveryViewProps) {
  const map = useMapStore((state) => state.mapInstance);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<POI>>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleBackClick = () => {
    setIsSearching(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const newSuggestions = indoorGeocoder.getAutocompleteResults(searchQuery);
    setSuggestions(newSuggestions);
  }, [searchQuery, indoorGeocoder]);

  function navigateToPOI(coordinates: [number, number]) {
    map?.flyTo({
      center: coordinates,
      zoom: 20,
      duration: 1000,
    });
  }

  function handleSuggestionClick(suggestion: POI) {
    setSearchQuery(suggestion.name);
    setIsSearching(false);

    onSelectPOI(suggestion);

    navigateToPOI([suggestion.coordinates[0], suggestion.coordinates[1]]);
  }

  function handleTopLocationsClick(topLocationName: string) {
    setSearchQuery(topLocationName);

    const poi = indoorGeocoder.indoorGeocodeInput(topLocationName);

    onSelectPOI(poi);
    navigateToPOI(poi.coordinates);
  }

  return (
    <CardContent className="p-4">
      <div className="relative mb-6 flex items-center">
        <div className="relative grow">
          {isSearching ? (
            <Button
              size="sm"
              variant="ghost"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-0"
              onClick={handleBackClick}
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </Button>
          ) : (
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          )}
          <Input
            type="text"
            placeholder="Search indoor locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            className="w-72 rounded-full border-gray-300 px-10 py-4 text-lg shadow-sm"
          />
        </div>
        {!isSearching && (
          <Toggle
            variant="outline"
            size="icon"
            pressed={isSettingsOpen}
            onPressedChange={setIsSettingsOpen}
            className="ml-2 rounded-full p-2"
          >
            <SlidersVertical size={18} />
          </Toggle>
        )}
      </div>

      {isSearching ? (
        <div className="w-72 space-y-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left text-gray-700 hover:bg-gray-100"
              onClick={() => {
                handleSuggestionClick(suggestion);
              }}
            >
              {suggestion.name}
            </Button>
          ))}
          {suggestions.length === 0 && searchQuery && (
            <p className="p-2 text-sm text-gray-500">No results found</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-4 justify-items-center gap-1">
          {topLocations.map((topLocation, index) => (
            <div className="flex flex-col items-center" key={index}>
              <Button
                className={`size-10 rounded-full shadow-sm ${topLocation.colors} transition-shadow duration-200 hover:shadow-md`}
                variant="ghost"
                size="icon"
                title={topLocation.name}
                onClick={() => {
                  handleTopLocationsClick(topLocation.name);
                }}
              >
                <topLocation.icon size={16} />
              </Button>
              <span className="mt-1 max-w-[80px] hyphens-auto break-words text-center text-xs text-gray-600">
                {topLocation.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {isSettingsOpen && <NavigationSettings />}
    </CardContent>
  );
}
