import { create } from "zustand";

interface FloorState {
  currentFloor: number;
  setCurrentFloor: (floor: number) => void;
}

const useFloorStore = create<FloorState>((set) => ({
  currentFloor: 0,
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
}));

export default useFloorStore;
