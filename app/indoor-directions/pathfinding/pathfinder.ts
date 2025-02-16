import { Vertex } from "../types";
import Graph from "./graph";

export default class Pathfinder {
  private graph: Graph;
  //TODO: private options;

  constructor(graph?: Graph) {
    this.graph = graph ?? new Graph();
  }

  public dijkstra(
    start: Vertex | GeoJSON.Position,
    end: Vertex | GeoJSON.Position,
  ): GeoJSON.Position[] {
    start = JSON.stringify(start);
    end = JSON.stringify(end);

    start = this.validateVertex(start);
    end = this.validateVertex(end);

    const distances: Record<Vertex, number> = {};
    const previous: Record<Vertex, Vertex | null> = {};
    const queue: Vertex[] = this.graph.getVertexs();

    this.graph.getVertexs().forEach((Vertex) => {
      distances[Vertex] = Infinity;
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

    const pathCoords = path.map((coord) => JSON.parse(coord));

    return pathCoords;
  }

  private validateVertex(position: Vertex): Vertex {
    if (this.graph.hasVertex(position)) {
      return position;
    } else {
      throw new Error(`Vertex not found in navigation graph: ${position}`);
    }
  }

  public setGraph(graph: Graph) {
    this.graph = graph;
  }
}
