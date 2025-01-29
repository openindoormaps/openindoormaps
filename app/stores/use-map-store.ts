import { create } from "zustand";

interface MapStore {
  mapInstance: maplibregl.Map | null;
  setMapInstance: (map: maplibregl.Map) => void;
}

const useMapStore = create<MapStore>((set) => ({
  mapInstance: null,
  setMapInstance: (map: maplibregl.Map) => set({ mapInstance: map }),
}));

export default useMapStore;
