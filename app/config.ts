const config = {
  keys: {
    mapTiler: "wYonyRi2hNgJVH2qgs81", //TODO: just for testing, replace with a custom server if needed
  },
  mapConfig: {
    style:
      "https://api.maptiler.com/maps/basic-v2/style.json?key=wYonyRi2hNgJVH2qgs81",
    center: [-87.616_94, 41.866_25],
    zoom: 15.99,
    pitch: 40,
    bearing: 20,
    antialias: true,
  } as maplibregl.MapOptions,
  showDebugLayers: false,
};
export default config;
