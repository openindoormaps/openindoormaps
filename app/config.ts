const config = {
  geoCodingApi: "https://nominatim.openstreetmap.org",
  routingApi: "https://router.project-osrm.org/route/v1",
  mapConfig: {
    style: "https://tiles.openfreemap.org/styles/bright",
    center: [3.110_97, 45.758_887],
    zoom: 19,
    bearing: 60,
    pitch: 40,
    maxBounds: [
      [3.098_579_765_873_666, 45.753_206_988_746_97],
      [3.120_672_060_142_396_7, 45.764_883_726_343_584],
    ],
  } as maplibregl.MapOptions,
};
export default config;
