import { ArrowLeft, Search, SlidersVertical } from "lucide-react";
import { useEffect, useState } from "react";
import topLocations from "~/mock/top-locations";
import { POI } from "~/types/poi";
import { IndoorGeocoder } from "~/utils/indoor-geocoder";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Toggle } from "../ui/toggle";
import NavigationSettings from "./navigation-settings";
import SuggestionsList from "./suggestions-list";

interface DiscoveryViewProps {
  indoorGeocoder: IndoorGeocoder;
  onSelectPOI: (poi: POI) => void;
}

export default function DiscoveryView({
  indoorGeocoder,
  onSelectPOI,
}: DiscoveryViewProps) {
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

  function handleSuggestionClick(suggestion: POI) {
    setSearchQuery(suggestion.name);
    setIsSearching(false);

    onSelectPOI(suggestion);
  }

  function handleTopLocationsClick(topLocationName: string) {
    setSearchQuery(topLocationName);
    try {
      const poi = indoorGeocoder.indoorGeocodeInput(topLocationName);
      if (!poi) {
        console.error(`Location "${topLocationName}" not found`);
        return;
      }
      onSelectPOI(poi);
    } catch (error) {
      console.error("Failed to geocode location:", error);
    }
  }

  return (
    <>
      <div className="relative mb-6 flex items-center">
        <div className="relative grow">
          {isSearching ? (
            <Button
              size="sm"
              variant="ghost"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-0"
              onClick={handleBackClick}
            >
              <ArrowLeft size={18} className="text-gray-500" />
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
            className="h-10 w-full min-w-72 rounded-full border-gray-300 px-10 py-4 text-lg shadow-sm"
          />
        </div>
        {!isSearching && (
          <Toggle
            variant="outline"
            size="icon"
            pressed={isSettingsOpen}
            onPressedChange={setIsSettingsOpen}
            disabled
            title="Settings (coming soon)"
            className="ml-2 rounded-full border border-gray-300"
          >
            <SlidersVertical size={16} />
          </Toggle>
        )}
      </div>

      {isSearching ? (
        <SuggestionsList
          suggestions={suggestions}
          searchQuery={searchQuery}
          onSuggestionClick={handleSuggestionClick}
        />
      ) : (
        <div className="hidden lg:grid lg:grid-cols-4 lg:justify-items-center lg:gap-1">
          {topLocations.map((topLocation, index) => (
            <div className="flex flex-col items-center" key={index}>
              <Button
                className={`rounded-full shadow-sm ${topLocation.colors} transition-shadow duration-200 hover:shadow-md`}
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
    </>
  );
}
