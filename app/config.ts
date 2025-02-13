const isMobile =
  typeof globalThis === "undefined" ? false : globalThis.innerWidth < 640;

const config = {
  geoCodingApi: "https://nominatim.openstreetmap.org",
  routingApi: "https://router.project-osrm.org/route/v1",
  mapConfig: {
    center: [3.110_97, 45.758_887],
    zoom: isMobile ? 17 : 18.5,
    bearing: 60,
    pitch: 40,
    maxBounds: [
      [3.098_579_765_873_666, 45.753_206_988_746_97],
      [3.120_672_060_142_396_7, 45.764_883_726_343_584],
    ],
  } as maplibregl.MapOptions,
  mapStyles: {
    light: "https://tiles.openfreemap.org/styles/bright",
    dark: "/styles/dark/style.json",
  },
};

export default config;
