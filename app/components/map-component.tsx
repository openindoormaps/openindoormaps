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
      directions.current = new MapLibreGlDirections(map.current!);

      map.current?.addControl(new LoadingIndicatorControl(directions.current));
    });
  });

  return (
    <>
      <div ref={mapContainer} className="size-full"></div>
      <NavigationInput directions={directions} />
    </>
  );
}
