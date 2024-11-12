import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const key = "wYonyRi2hNgJVH2qgs81"; //TODO: just for testing, replace with a custom server if needed
    const tileUrl = `https://api.maptiler.com/maps/basic-v2/style.json?key=${key}`;

    const MAPTILER_KEY = "get_your_own_OpIi9ZULNHzrESv6T2vL";

    // Initialize the MapLibre map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: tileUrl, // URL to map style JSON
      center: [-87.616_94, 41.866_25],
      zoom: 15.99,
      pitch: 40,
      bearing: 20,
      antialias: true,
    });

    map.on("load", () => {
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      let labelLayerId;
      for (const layer of layers) {
        if (layer.type === "symbol" && layer.layout["text-field"]) {
          labelLayerId = layer.id;
          break;
        }
      }

      map.addSource("openmaptiles", {
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
        type: "vector",
      });

      map.addLayer(
        {
          id: "3d-buildings",
          source: "openmaptiles",
          "source-layer": "building",
          type: "fill-extrusion",
          minzoom: 15,
          filter: ["!=", ["get", "hide_3d"], true],
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["get", "render_height"],
              0,
              "lightgray",
              200,
              "royalblue",
              400,
              "lightblue",
            ],
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              16,
              ["get", "render_height"],
            ],
            "fill-extrusion-base": [
              "case",
              [">=", ["get", "zoom"], 16],
              ["get", "render_min_height"],
              0,
            ],
          },
        },
        labelLayerId,
      );
      // Add the GeoJSON source for floorplan
      map.addSource("floorplan", {
        type: "geojson",
        data: "https://maplibre.org/maplibre-gl-js/docs/assets/indoor-3d-map.geojson",
      });

      // Add a layer for room extrusion
      map.addLayer({
        id: "room-extrusion",
        type: "fill-extrusion",
        source: "floorplan",
        paint: {
          "fill-extrusion-color": ["get", "color"],
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "base_height"],
          "fill-extrusion-opacity": 0.5,
        },
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="size-full"
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
}
