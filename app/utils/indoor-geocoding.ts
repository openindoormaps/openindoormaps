import MiniSearch from "minisearch";
import building from "~/mock/building.json";

//workaround bc fields are to search for are nested
const enhancedPOIs = building.pois.features.map((feature) => {
  const { properties, geometry } = feature;
  return {
    geometry,
    ...properties,
  };
});

const miniSearch = new MiniSearch({
  fields: ["name"],
  storeFields: ["name", "type", "geometry"],
  searchOptions: {},
});

miniSearch.addAll(enhancedPOIs);
export const indoorGeocodeInput = (input: string) => {
  const results = miniSearch.search(input);

  return results[0].geometry.coordinates;
};
