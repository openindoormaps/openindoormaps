import MapLibreGlDirections, {
  LoadingIndicatorControl,
} from "@maplibre/maplibre-gl-directions";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl, { FullscreenControl, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import config from "~/config";
import GeoJsonLayer from "~/layers/geojson-layer";
import Tile3dLayer from "~/layers/tile-3d-layer";
import NavigationInput from "./navigation-input";
export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useState<[number, number]>();
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
      ...config.mapConfig,
      container: mapContainer.current!,
    });

    map.current.on("load", () => {
      if (!map.current) return;
      const layers = map.current?.getStyle().layers;
      if (!layers) return;

      map.current.addLayer(new Tile3dLayer());
      map.current.addLayer(new GeoJsonLayer());

      directions.current = new MapLibreGlDirections(map.current!, {
        requestOptions: { overview: "full", steps: "true" },
      });
      map.current?.addControl(new LoadingIndicatorControl(directions.current));
    });

    map.current.addControl(new NavigationControl(), "bottom-right");
    map.current.addControl(new FullscreenControl(), "bottom-right");
  });

  return (
    <div className="flex size-full flex-col">
      <NavigationInput directions={directions} map={map} />
      <div ref={mapContainer} className="size-full"></div>
    </div>
  );
}
