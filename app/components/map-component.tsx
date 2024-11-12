import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the MapLibre map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: "Raster tiles",
        center: [0, 0],
        zoom: 0,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#e0dfdf",
            },
          },
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
          },
        ],
      },
      center: [-87.616_94, 41.866_25],
      zoom: 15.99,
      pitch: 40,
      bearing: 20,
      antialias: true,
    });

    map.on("load", () => {
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
