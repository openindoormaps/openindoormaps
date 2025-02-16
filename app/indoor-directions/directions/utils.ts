import { nanoid } from "nanoid";
import {
  MapLibreGlDirectionsConfiguration,
  MapLibreGlIndoorDirectionsDefaultConfiguration,
  PointType,
} from "../types";
import layersFactory from "./layers";

export function buildConfiguration(
  customConfiguration?: Partial<MapLibreGlDirectionsConfiguration>,
): MapLibreGlDirectionsConfiguration {
  const layers = layersFactory(
    customConfiguration?.pointsScalingFactor,
    customConfiguration?.linesScalingFactor,
    customConfiguration?.sourceName,
  );

  return Object.assign(
    {},
    MapLibreGlIndoorDirectionsDefaultConfiguration,
    { layers },
    customConfiguration,
  );
}

/**
 * @protected
 *
 * Creates a {@link Feature<Point>|GeoJSON Point Feature} of one of the ${@link PointType|known types} with a given
 * coordinate.
 */
export function buildPoint(
  coordinate: [number, number],
  type: PointType,
  properties?: Record<string, unknown>,
): GeoJSON.Feature<GeoJSON.Point> {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: coordinate,
    },
    properties: {
      type,
      id: nanoid(),
      ...properties,
    },
  };
}

export function buildRouteLines(
  coordinates: GeoJSON.Position[],
  routeIndex = 0,
  legIndex = 0,
  origin?: GeoJSON.Feature,
  destination?: GeoJSON.Feature,
): GeoJSON.Feature<GeoJSON.LineString>[] {
  return [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates,
      },
      properties: {
        id: nanoid(),
        route: "SELECTED",
        routeIndex,
        legIndex,
        congestion: 0,
        departSnappointProperties: {
          type: "SNAPPOINT",
          id: nanoid(),
          profile: "walking",
          waypointProperties: {
            type: "WAYPOINT",
            id: origin?.properties?.id || nanoid(),
            profile: "walking",
            index: 0,
            category: "ORIGIN",
          },
        },
        arriveSnappointProperties: {
          type: "SNAPPOINT",
          id: nanoid(),
          profile: "walking",
          waypointProperties: {
            type: "WAYPOINT",
            id: destination?.properties?.id || nanoid(),
            profile: "walking",
            index: 1,
            category: "DESTINATION",
          },
        },
      },
    },
  ];
}

export function buildSnaplines(
  waypointsCoordinates: [number, number][],
  snappointsCoordinates: [number, number][],
): GeoJSON.Feature<GeoJSON.LineString>[] {
  const snaplines = waypointsCoordinates.map((waypointCoordinates, index) => {
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [waypointCoordinates[0], waypointCoordinates[1]],
          [snappointsCoordinates[index][0], snappointsCoordinates[index][1]],
        ],
      },
      properties: {
        type: "SNAPLINE",
      },
    } as GeoJSON.Feature<GeoJSON.LineString>;
  });
  return snaplines;
}
