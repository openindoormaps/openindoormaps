const config = {
  geoCodingApi: "https://nominatim.openstreetmap.org",
  routingApi: "https://router.project-osrm.org/route/v1",
  mapConfig: {
    style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${process.env.MAPTILER_KEY}`,
    center: [3.110_97, 45.758_887],
    zoom: 17,
  } as maplibregl.MapOptions,
};
export default config;
