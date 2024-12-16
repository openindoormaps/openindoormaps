const config = {
  geoCodingApi: "https://nominatim.openstreetmap.org",
  routingApi: "https://router.project-osrm.org/route/v1",
  mapConfig: {
    style:
      "https://api.maptiler.com/maps/basic-v2/style.json?key=wYonyRi2hNgJVH2qgs81",
    center: [3.110_97, 45.758_887],
    zoom: 17,
  } as maplibregl.MapOptions,
};
export default config;
