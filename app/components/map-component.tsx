import { apply } from 'ol-mapbox-style';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import 'ol/ol.css';
import { useEffect, useRef } from 'react';
export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const key = 'wYonyRi2hNgJVH2qgs81'; //TODO: just for testing, replace with costum server
  const tileUrl = `https://api.maptiler.com/maps/basic-v2/style.json?key=${key}`;
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new Map({
      target: mapContainer.current,
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
      controls: defaultControls({
        attributionOptions: {
          className: 'ol-attribution',
          collapsible: false,
        },
      }),
    });

    apply(map, tileUrl);
    return () => {
      map.setTarget(undefined);
    };
  });
  return (
    <>
      <div ref={mapContainer} className="size-full"></div>
    </>
  );
}
