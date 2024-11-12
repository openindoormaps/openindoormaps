import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const key = "wYonyRi2hNgJVH2qgs81"; //TODO: just for testing, replace with a custom server if needed
  const tileUrl = `https://api.maptiler.com/maps/basic-v2/style.json?key=${key}`;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize MapLibre map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: tileUrl, // URL to map style JSON
      center: [0, 0], // Initial center [longitude, latitude]
      zoom: 0,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => {
      map.remove();
    };
  }, [tileUrl]);

  return (
    <div
      ref={mapContainer}
      className="size-full"
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
}
