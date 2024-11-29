import config from "~/config";
import Graph from "../pathfinding/graph";
import { Vertex } from "../types";

export default class IndoorDirections {
  protected declare readonly map: maplibregl.Map;
  private graph: Graph = new Graph();
  protected _waypoints: GeoJSON.Feature<GeoJSON.Point>[] = [];
  protected routelines: GeoJSON.Feature<GeoJSON.LineString>[][] = [];

  //TODO: add configurations
  constructor(map: maplibregl.Map) {
    this.map = map;
  }

  public async loadMapData(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
      }
      const geoJsonData: GeoJSON.FeatureCollection = await response.json();
      this.parseGeoJsonToGraph(geoJsonData);

      if (config.showDebugLayers) {
        this.map.addSource("indoor-route", {
          type: "geojson",
          data: geoJsonData,
        });

        this.map.addLayer({
          id: "indoor-route-line",
          type: "line",
          source: "indoor-route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#007aff",
            "line-width": 4,
          },
        });

        this.map.addLayer({
          id: "indoor-route-points",
          type: "circle",
          source: "indoor-route",
          paint: {
            "circle-radius": 6,
            "circle-color": "#ff5722",
          },
        });

        this.map.addLayer({
          id: "crossings-layer",
          type: "circle",
          source: "indoor-route",
          filter: ["==", ["get", "type"], "crossing"],
          paint: {
            "circle-radius": 8,
            "circle-color": "#007aff",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          },
        });
      }
    } catch (error) {
      console.error("Error loading GeoJSON data:", error);
    }
  }

  private parseGeoJsonToGraph(geoJson: GeoJSON.FeatureCollection) {
    const coordMap = new Map<string, Set<GeoJSON.Position[]>>();

    geoJson.features.forEach((feature) => {
      if (feature.geometry.type === "LineString" && feature.properties) {
        const coordinates = feature.geometry.coordinates;

        coordinates.forEach((coord) => {
          const key = JSON.stringify(coord);
          if (!coordMap.has(key)) {
            coordMap.set(key, new Set());
          }
          coordMap.get(key)?.add(coordinates);
        });
      }
    });

    geoJson.features.forEach((feature) => {
      if (feature.geometry.type === "LineString" && feature.properties) {
        const coordinates = feature.geometry.coordinates;
        const weight = feature.properties.weight || 1;

        for (let i = 0; i < coordinates.length - 1; i++) {
          const from = JSON.stringify(coordinates[i]);
          const to = JSON.stringify(coordinates[i + 1]);

          this.graph.addEdge(from, to, weight);

          const fromOverlaps = coordMap.get(from);

          if (fromOverlaps && fromOverlaps.size > 1) {
            fromOverlaps.forEach((otherCoords) => {
              if (otherCoords == coordinates) {
                const idx = otherCoords.findIndex(
                  (c) => JSON.stringify(c) === from,
                );
                if (idx !== -1) {
                  if (idx > 0) {
                    this.graph.addEdge(
                      from,
                      JSON.stringify(otherCoords[idx - 1]),
                      weight,
                    );
                  }
                  if (idx < otherCoords.length - 1) {
                    this.graph.addEdge(
                      from,
                      JSON.stringify(otherCoords[idx + 1]),
                      weight,
                    );
                  }
                }
              }
            });
          }
        }
      }
    });
  }

  public setWaypoints(waypoints: [number, number][]) {
    const start = JSON.stringify(waypoints[0]);
    const end = JSON.stringify(waypoints[1]);

    const routes = this.dijkstra(start, end);

    this.routelines = routes.map((route, idx) => {
      const next = routes[idx + 1];
      if (next) {
        return [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [JSON.parse(route), JSON.parse(next)],
            },
            properties: {},
          },
        ];
      }
      return [];
    });

    this.draw();
  }

  private dijkstra(start: Vertex, end: Vertex): Vertex[] {
    const distances: Record<Vertex, number> = {};
    const previous: Record<Vertex, Vertex | null> = {};
    const queue: Vertex[] = this.graph.getVertexs();

    this.graph.getVertexs().forEach((Vertex) => {
      distances[Vertex] = Infinity;
      // eslint-disable-next-line unicorn/no-null
      previous[Vertex] = null;
    });
    distances[start] = 0;

    while (queue.length > 0) {
      const current = queue
        .sort((a, b) => distances[a] - distances[b])
        .shift()!;
      if (current === end) break;

      this.graph.getEdges(current).forEach(({ to, weight }) => {
        const alt = distances[current] + weight;
        if (alt < distances[to]) {
          distances[to] = alt;
          previous[to] = current;
        }
      });
    }

    const path: Vertex[] = [];
    let current: Vertex | null = end;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }

    return path[0] === start ? path : [];
  }

  protected draw() {
    const features = [...this._waypoints, ...this.routelines.flat()];
    const geoJson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features,
    };

    if (this.map.getSource("shortest-path")) {
      (this.map.getSource("shortest-path") as maplibregl.GeoJSONSource).setData(
        geoJson,
      );
    } else {
      this.map.addSource("shortest-path", {
        type: "geojson",
        data: geoJson,
      });

      this.map.addLayer({
        id: "shortest-path-layer",
        type: "line",
        source: "shortest-path",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ff0000", "line-width": 4 },
      });
    }
  }
}
