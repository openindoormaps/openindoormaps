import MiniSearch from "minisearch";
import building from "~/mock/building.json";

//TODO: consider refactor it to a class
//workaround bc properties are nested
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

export const getSearchSuggestions = (
  query: string,
): Array<{ name: string; coordinates: number[] }> => {
  if (!query) return [];

  const results = miniSearch.search(query, {
    prefix: true,
  });

  if (results.length === 0) return [];

  const topScore = results[0].score;

  const cutoffIndex = results.findIndex((result, index) => {
    if (index === 0) return false;
    const scoreDiff = topScore - result.score;
    return scoreDiff > topScore * 0.3;
  });

  const relevantResults =
    cutoffIndex > 0 ? results.slice(0, cutoffIndex) : results.slice(0, 5);

  return relevantResults.map((result) => ({
    name: result.name,
    coordinates: result.geometry.coordinates,
  }));
};
