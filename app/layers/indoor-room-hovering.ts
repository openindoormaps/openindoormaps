import useMapStore from "~/stores/use-map-store";
export default function IndoorHoverEffect() {
  const map = useMapStore((state) => state.mapInstance);
  let hoveredRoomId: number | null = null;

  map?.on("mousemove", "indoor-map-extrusion", (e) => {
    if (e.features && e.features.length > 0) {
      if (hoveredRoomId != null) {
        map.setFeatureState(
          { source: "indoor-map", id: hoveredRoomId },
          { hover: false },
        );
      }
      hoveredRoomId = e.features[0].id as number;
      map.setFeatureState(
        { source: "indoor-map", id: hoveredRoomId },
        { hover: true },
      );
    }
  });

  map?.on("mouseleave", "indoor-map-extrusion", () => {
    if (hoveredRoomId != null) {
      map.setFeatureState(
        { source: "indoor-map", id: hoveredRoomId },
        { hover: false },
      );
      hoveredRoomId = null;
    }
  });
  return null;
}
