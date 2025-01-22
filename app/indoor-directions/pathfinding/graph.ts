import { Vertex, Edge } from "../types";

export default class Graph {
  adjacencyList: Map<Vertex, Edge[]> = new Map();

  addVertex(Vertex: Vertex) {
    if (!this.adjacencyList.has(Vertex)) {
      this.adjacencyList.set(Vertex, []);
    }
  }

  addEdge(from: Vertex, to: Vertex, weight: number) {
    this.addVertex(from);
    this.addVertex(to);
    this.adjacencyList.get(from)?.push({ to, weight });
    this.adjacencyList.get(to)?.push({ to: from, weight });
  }

  getVertexs() {
    return [...this.adjacencyList.keys()];
  }

  getEdges(Vertex: Vertex): Edge[] {
    return this.adjacencyList.get(Vertex) || [];
  }

  hasVertex(Vertex: Vertex) {
    return this.adjacencyList.has(Vertex);
  }
}
