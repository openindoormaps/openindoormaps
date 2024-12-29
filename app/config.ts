const config = {
  geoCodingApi: "https://nominatim.openstreetmap.org",
  routingApi: "https://router.project-osrm.org/route/v1",
  mapConfig: {
    style:
      "https://api.maptiler.com/maps/basic-v2/style.json?key=wYonyRi2hNgJVH2qgs81",
    center: [5.725_353_7, 45.184_351_9],
    zoom: 17,
  } as maplibregl.MapOptions,
};
export default config;
