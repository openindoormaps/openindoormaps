import MiniSearch, { SearchResult } from "minisearch";
import { POI } from "~/types/poi";

interface POIProperties {
  id: number;
  name: string;
  type: string;
  floor: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
  building_id: string;
}

export interface POIFeature extends GeoJSON.Feature<GeoJSON.Point> {
  properties: POIProperties;
}

/**
 * IndoorGeocoder encapsulates search functionality using MiniSearch.
 * It is designed to handle cases where MiniSearch may return a large set of results.
 * The class uses a cutoff threshold to filter out results that are significantly less relevant
 * compared to the top result, ensuring that only the most pertinent suggestions are provided.
 */
export class IndoorGeocoder {
  private miniSearch: MiniSearch;
  private cutoffThreshold: number;

  constructor(pois: POIFeature[], cutoffThreshold: number = 0.3) {
    this.cutoffThreshold = cutoffThreshold;
    this.miniSearch = new MiniSearch({
      fields: ["name"],
      storeFields: ["name", "type", "geometry", "id"],
    });

    const flattenPOIs = pois.map((feature: POIFeature) => ({
      ...feature.properties,
      geometry: feature.geometry,
    }));

    this.miniSearch.addAll(flattenPOIs);
  }

  /**
   * Given an input string, returns the coordinates of the top search result.
   * If MiniSearch returns too many results, only the best match is used.
   *
   * @param input - The search input.
   * @returns The coordinates of the top search result.
   */
  public indoorGeocodeInput(input: string): POI {
    const results = this.miniSearch.search(input);
    if (results.length === 0) {
      throw new Error("No results found.");
    }
    const topResult = results[0];
    return {
      id: topResult.id,
      name: topResult.name,
      coordinates: topResult.geometry.coordinates,
    };
  }

  /**
   * Provides search suggestions based on a query string.
   * Uses a cutoff logic to filter out suggestions that have a score difference
   * exceeding a specified threshold relative to the top result.
   *
   * This is particularly useful when MiniSearch returns a very large set of results,
   * some of which are only marginally relevant.
   *
   * @param query - The query string.
   * @returns An array of suggestions with name and coordinates.
   */
  public getAutocompleteResults(
    query: string,
    maxResults: number = 5,
  ): Array<POI> {
    if (!query) return [];

    const results = this.miniSearch.search(query, { prefix: true });
    if (results.length === 0) return [];

    const topScore = results[0].score;
    const cutoffIndex = this.getCutoffIndex(results, topScore);

    // If a cutoff is determined, use only the more relevant results.
    // Otherwise, default to the top 5 results.
    const relevantResults =
      cutoffIndex > 0 ? results.slice(0, cutoffIndex) : results.slice(0, 5);

    return relevantResults
      .map((result) => ({
        id: result.id,
        name: result.name,
        coordinates: result.geometry.coordinates,
      }))
      .slice(0, maxResults);
  }

  /**
   * Determines the cutoff index for the results array based on the score difference.
   * If the difference between the top score and a result exceeds the defined threshold,
   * that result (and any subsequent results) are considered less relevant and are excluded.
   *
   * @param results - The search results array.
   * @param topScore - The score of the top result.
   * @returns The index at which the score difference exceeds the threshold.
   */
  private getCutoffIndex(results: SearchResult[], topScore: number): number {
    return results.findIndex((result, index) => {
      if (index === 0) return false; // Always include the top result.
      const scoreDiff = topScore - result.score;
      return scoreDiff > topScore * this.cutoffThreshold;
    });
  }
}
