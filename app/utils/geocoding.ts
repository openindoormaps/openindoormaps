import {
  MaplibreGeocoderApi,
  CarmenGeojsonFeature,
  MaplibreGeocoderFeatureResults,
} from "@maplibre/maplibre-gl-geocoder";
import config from "~/config";

export const geocoderApi: MaplibreGeocoderApi = {
  forwardGeocode: async (geoCodingConfig) => {
    const features: CarmenGeojsonFeature[] = [];
    try {
      const request = `${config.geoCodingApi}/search?q=${
        geoCodingConfig.query
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
  reverseGeocode: async () => {
    return {} as MaplibreGeocoderFeatureResults;
  },
};

export const geocodeInput = async (input: string) => {
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
