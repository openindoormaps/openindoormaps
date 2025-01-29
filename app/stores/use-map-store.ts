import { create } from "zustand";

interface MapStore {
  map: maplibregl.Map | null;
  setMap: (map: maplibregl.Map) => void;
}

const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (map: maplibregl.Map) => set({ map: map }),
}));

export default useMapStore;
