export interface POI {
  name: string;
  coordinates: [number, number] | GeoJSON.Position;
  // add any additional properties as needed
}
