import { SlidersVertical } from "lucide-react";
import { useEffect, useState } from "react";
import topLocations from "~/mock/top-locations";
import { POI } from "~/types/poi";
import { IndoorGeocoder } from "~/utils/indoor-geocoder";
import { Toggle } from "../ui/toggle";
import NavigationSettings from "./navigation-settings";
import SearchBar from "./search-bar";
import SuggestionsList from "./suggestions-list";
import { TopLocationsList } from "./top-location-list";

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
      <div className="relative flex items-center md:mb-6">
        <div className="relative grow">
          <SearchBar
            isSearching={isSearching}
            searchQuery={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            onBack={handleBackClick}
          />
        </div>
        {!isSearching && (
          <Toggle
            variant="outline"
            size="icon"
            pressed={isSettingsOpen}
            onPressedChange={setIsSettingsOpen}
            className="ml-2 rounded-full"
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
        <TopLocationsList
          locations={topLocations}
          onLocationClick={handleTopLocationsClick}
        />
      )}

      {isSettingsOpen && <NavigationSettings />}
    </>
  );
}
