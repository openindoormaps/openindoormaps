export interface IndoorFeatureProperties {
  level_id: number | null;
  [key: string]: unknown;
}

export interface IndoorFeature extends GeoJSON.Feature {
  properties: IndoorFeatureProperties;
}

export interface IndoorMapGeoJSON extends GeoJSON.FeatureCollection {
  features: IndoorFeature[];
}
