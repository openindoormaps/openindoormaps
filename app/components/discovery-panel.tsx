/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import MapLibreGlDirections, {
  LoadingIndicatorControl,
} from "@maplibre/maplibre-gl-directions";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import {
  Accessibility,
  Apple,
  ArrowLeft,
  BookOpen,
  BriefcaseMedical,
  Coffee,
  Dumbbell,
  Footprints,
  Search,
  SlidersVertical,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import config from "~/config";
import IndoorDirections from "~/indoor-directions/directions/main";
import building from "~/mock/building.json";
import useMapStore from "~/stores/use-map-store";

import NavigationSettings from "./navigation-settings";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { IndoorGeocoder, POIFeature } from "~/utils/indoor-geocoding";

export default function DiscoveryPanel() {
  const map = useMapStore((state) => state.mapInstance);
  const directions = useRef<MapLibreGlDirections>();
  const indoorDirections = useRef<IndoorDirections>();
  const [searchQuery, setSearchQuery] = useState("");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ name: string; coordinates: number[] }>
  >([]);

  const indoorGeocoder = new IndoorGeocoder(
    building.pois.features as POIFeature[],
  );

  const pointsOfInterest = [
    {
      name: "Library",
      icon: BookOpen,
      colors: "bg-blue-100 text-blue-700",
    },
    {
      name: "Gymnasium",
      icon: Dumbbell,
      colors: "bg-emerald-100 text-emerald-700",
    },
    {
      name: "Nurse's Office",
      icon: BriefcaseMedical,
      colors: "bg-red-100 text-red-700",
    },
    {
      name: "Teachers Room",
      icon: Apple,
      colors: "bg-purple-100 text-purple-700",
    },
    {
      name: "Cafeteria",
      icon: Coffee,
      colors: "bg-amber-100 text-amber-700",
    },
    {
      name: "Exit",
      icon: Footprints,
      colors: "bg-slate-100 text-slate-700",
    },
  ];

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
    const departureCoord = indoorGeocoder.indoorGeocodeInput(departure);
    const destinationCoord = indoorGeocoder.indoorGeocodeInput(destination);

    if (departureCoord && destinationCoord) {
      indoorDirections.current?.setWaypoints([
        departureCoord,
        destinationCoord,
      ]);
    }

    /*
    * Code for outdoor routing
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

  useEffect(() => {
    setSuggestions(indoorGeocoder.getSearchSuggestions(searchQuery));
  }, [searchQuery, indoorGeocoder]);

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleBackClick = () => {
    setIsSearching(false);
    setSearchQuery("");
  };

  function handleSuggestionClick(suggestion: {
    name: string;
    coordinates: number[];
  }) {
    setSearchQuery(suggestion.name);
    setIsSearching(false);

    map?.flyTo({
      center: [suggestion.coordinates[0], suggestion.coordinates[1]],
      zoom: 20,
      duration: 1000,
    });
  }

  return (
    <Card className="z-10 max-w-sm bg-white shadow-lg md:absolute md:left-4 md:top-4">
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
              onFocus={handleSearchFocus}
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
            {pointsOfInterest.map((poi, index) => (
              <div className="flex flex-col items-center" key={index}>
                <Button
                  className={`size-10 rounded-full shadow-sm ${poi.colors} transition-shadow duration-200 hover:shadow-md`}
                  variant="ghost"
                  size="icon"
                  title={poi.name}
                >
                  <poi.icon size={16} />
                </Button>
                <span className="mt-1 max-w-[80px] hyphens-auto break-words text-center text-xs text-gray-600">
                  {poi.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {isSettingsOpen && <NavigationSettings />}
      </CardContent>
    </Card>
  );
}
