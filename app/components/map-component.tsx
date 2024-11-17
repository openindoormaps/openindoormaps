import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import MaplibreGeocoder, {
  MaplibreGeocoderApi,
  CarmenGeojsonFeature,
  MaplibreGeocoderFeatureResults,
} from "@maplibre/maplibre-gl-geocoder";
export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const key = "wYonyRi2hNgJVH2qgs81"; //TODO: just for testing, replace with a custom server if needed
  const tileUrl = `https://api.maptiler.com/maps/basic-v2/style.json?key=${key}`;

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: tileUrl,
      center: [0, 0],
      zoom: 0,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(new maplibregl.FullscreenControl(), "bottom-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "bottom-right",
    );

    const geocoderApi: MaplibreGeocoderApi = {
      // required
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

      // optional
      reverseGeocode: async (config) => {
        config;
        return {} as MaplibreGeocoderFeatureResults;
      },
    };

    // Pass in or define a geocoding API that matches the above
    const geocoder = new MaplibreGeocoder(geocoderApi, {
      maplibregl: maplibregl,
    });
    map.addControl(geocoder);

    return () => {
      map.remove();
    };
  }, [tileUrl]);

  return <div ref={mapContainer} className="size-full"></div>;
}
