import MapLibreGlDirections, {
  LoadingIndicatorControl,
} from "@maplibre/maplibre-gl-directions";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import NavigationInput from "./navigation-input";
export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useState<[number, number]>();
  const key = "wYonyRi2hNgJVH2qgs81"; //TODO: just for testing, replace with a custom server if needed
  const tileUrl = `https://api.maptiler.com/maps/basic-v2/style.json?key=${key}`;
  const map = useRef<maplibregl.Map>();
  const directions = useRef<MapLibreGlDirections>();

  useEffect(() => {
    if (map.current) return;

    const MAPTILER_KEY = "get_your_own_OpIi9ZULNHzrESv6T2vL";

    // Initialize the MapLibre map
    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: tileUrl,
      center: [-87.616_94, 41.866_25],
      zoom: 15.99,
      pitch: 40,
      bearing: 20,
      antialias: true,
    });

    map.current.on("load", () => {
      const layers = map.current?.getStyle().layers;
      if (!layers) return;

      let labelLayerId;
      for (const layer of layers) {
        if (!layer.layout) return;
        if (layer.type === "symbol" && layer.layout["text-field"]) {
          labelLayerId = layer.id;
          break;
        }
      }

      map.current?.addSource("openmaptiles", {
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
        type: "vector",
      });

      map.current?.addLayer(
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
      map.current?.addSource("floorplan", {
        type: "geojson",
        data: "https://maplibre.org/maplibre-gl-js/docs/assets/indoor-3d-map.geojson",
      });

      // Add a layer for room extrusion
      map.current?.addLayer({
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

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: tileUrl,
      center: [0, 0],
      zoom: 0,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.current.addControl(new maplibregl.FullscreenControl(), "bottom-right");
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "bottom-right",
    );

    map.current.on("load", () => {
      directions.current = new MapLibreGlDirections(map.current!, {
        requestOptions: { overview: "full", steps: "true" },
      });

      map.current?.addControl(new LoadingIndicatorControl(directions.current));
    });
  });

  return (
    <div className="flex size-full flex-col">
      <NavigationInput directions={directions} map={map} />
      <div ref={mapContainer} className="size-full"></div>
    </div>
  );
}
