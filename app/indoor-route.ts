//TODO: linter fixen foreach, i(index), dynamic crossings detection
//TODO Navigation input for indoor routing
import maplibregl from "maplibre-gl";

type Node = string; // Node identifier, e.g., a stringified coordinate like "[0, 0]"
type Edge = { to: Node; weight: number };

class Graph {
  adjacencyList: Map<Node, Edge[]> = new Map();

  addNode(node: Node) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, []);
    }
  }

  addEdge(from: Node, to: Node, weight: number) {
    this.addNode(from);
    this.addNode(to);
    this.adjacencyList.get(from)?.push({ to, weight });
    this.adjacencyList.get(to)?.push({ to: from, weight }); // Undirected graph
  }

  getNodes() {
    return [...this.adjacencyList.keys()];
  }

  getEdges(node: Node): Edge[] {
    return this.adjacencyList.get(node) || [];
  }
}

export default class IndoorRoute {
  private map: maplibregl.Map;
  private graph: Graph;

  constructor(map: maplibregl.Map) {
    this.map = map;
    this.graph = new Graph();
  }

  public async loadGeoJson(url: string, showDebugLayers: boolean) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
      }
      const geoJsonData: GeoJSON.FeatureCollection = await response.json();
      this.parseGeoJsonToGraph(geoJsonData);

      if (showDebugLayers) {
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
          filter: ["==", ["get", "type"], "crossing"], // Only show crossing points
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
    geoJson.features.forEach((feature) => {
      if (feature.geometry.type === "LineString" && feature.properties) {
        const coordinates = feature.geometry.coordinates;
        const weight = feature.properties.weight || 1;

        for (let i = 0; i < coordinates.length - 1; i++) {
          const from = JSON.stringify(coordinates[i]);
          const to = JSON.stringify(coordinates[i + 1]);
          this.graph.addEdge(from, to, weight);
        }
      } else if (feature.geometry.type === "Point" && feature.properties) {
        const crossingNode = JSON.stringify(feature.geometry.coordinates);
        const connections = feature.properties.connections || [];

        connections.forEach((connection: number[]) => {
          const to = JSON.stringify(connection);
          const weight = feature.properties?.weight || 1; // Optionally define weight for crossing
          this.graph.addEdge(crossingNode, to, weight);
        });
      }
    });
  }

  public findShortestPath(start: number[], end: number[]): number[][] {
    const startNode = JSON.stringify(start);
    const endNode = JSON.stringify(end);

    const path = this.dijkstra(startNode, endNode);
    return path.map((node) => JSON.parse(node)); // Convert stringified coordinates back to numbers
  }

  private dijkstra(start: Node, end: Node): Node[] {
    const distances: Record<Node, number> = {};
    const previous: Record<Node, Node | null> = {};
    const queue: Node[] = this.graph.getNodes();

    // Initialize distances and previous
    this.graph.getNodes().forEach((node) => {
      distances[node] = Infinity;
      // eslint-disable-next-line unicorn/no-null
      previous[node] = null;
    });
    distances[start] = 0;

    while (queue.length > 0) {
      // Get the node with the smallest distance
      const current = queue
        .sort((a, b) => distances[a] - distances[b])
        .shift()!;
      if (current === end) break; // Shortest path found

      this.graph.getEdges(current).forEach(({ to, weight }) => {
        const alt = distances[current] + weight;
        if (alt < distances[to]) {
          distances[to] = alt;
          previous[to] = current;
        }
      });
    }

    // Reconstruct path
    const path: Node[] = [];
    let current: Node | null = end;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }

    return path[0] === start ? path : []; // Return path or empty array if no path
  }

  public visualizePath(path: number[][]) {
    const geoJsonPath: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: path,
          },
          properties: {},
        },
      ],
    };

    if (this.map.getSource("shortest-path")) {
      (this.map.getSource("shortest-path") as maplibregl.GeoJSONSource).setData(
        geoJsonPath,
      );
    } else {
      this.map.addSource("shortest-path", {
        type: "geojson",
        data: geoJsonPath,
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
