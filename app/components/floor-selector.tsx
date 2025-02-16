import { useEffect, useState } from "react";
import useFloorStore from "~/stores/floor-store";
import IndoorMapLayer from "~/layers/indoor-map-layer";

interface FloorSelectorProps {
  indoorMapLayer: IndoorMapLayer;
}

export function FloorSelector({ indoorMapLayer }: FloorSelectorProps) {
  const { currentFloor, setCurrentFloor } = useFloorStore();
  const [availableFloors, setAvailableFloors] = useState<number[]>([0]);

  useEffect(() => {
    const loadFloors = async () => {
      const floors = await indoorMapLayer.getAvailableFloors();
      setAvailableFloors(floors.sort((a, b) => b - a)); // Sort descending
    };
    loadFloors();
  }, [indoorMapLayer]);

  const handleFloorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const floor = Number.parseInt(event.target.value);
    setCurrentFloor(floor);
    indoorMapLayer.setFloorLevel(floor);
  };
  return (
    <div className="absolute right-2 top-2 z-10">
      <select
        value={currentFloor}
        onChange={handleFloorChange}
        className="rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:bg-gray-900"
      >
        {availableFloors.map((floor) => (
          <option key={floor} value={floor}>
            Floor {floor}
          </option>
        ))}
      </select>
    </div>
  );
}
