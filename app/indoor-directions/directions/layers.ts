import type { LayerSpecification, LineLayerSpecification } from "maplibre-gl";
import type { CircleLayerSpecification } from "@maplibre/maplibre-gl-style-spec";

export const colors = {
  snapline: "#85858B",
  altRouteline: "#9e91be",
  routelineFoot: "#3665ff",
  routelineBike: "#63c4ff",
  routeline: "#3665ff",
  congestionLow: "#42c74c",
  congestionHigh: "#d72359",
  hoverpoint: "#30a856",
  snappoint: "#3665ff",
  snappointHighlight: "#e50d3f",
  waypointFoot: "#3665ff",
  waypointFootHighlight: "#0942ff",
  waypointBike: "#63c4ff",
  waypointBikeHighlight: "#0bb8ff",
  waypoint: "#3665ff",
  waypointHighlight: "#6d26d7",
};

const routelineColor: NonNullable<
  LineLayerSpecification["paint"]
>["line-color"] = [
  "case",
  ["==", ["get", "profile", ["get", "arriveSnappointProperties"]], "foot"],
  colors.routelineFoot,
  ["==", ["get", "profile", ["get", "arriveSnappointProperties"]], "bike"],
  colors.routelineBike,
  [
    "interpolate-hcl",
    ["linear"],
    ["get", "congestion"],
    0,
    colors.routeline,
    1,
    colors.congestionLow,
    100,
    colors.congestionHigh,
  ],
];

const waypointColor: NonNullable<
  CircleLayerSpecification["paint"]
>["circle-color"] = [
  "case",
  ["==", ["get", "profile"], "foot"],
  [
    "case",
    ["boolean", ["get", "highlight"], false],
    colors.waypointFootHighlight,
    colors.waypointFoot,
  ],
  ["==", ["get", "profile"], "bike"],
  [
    "case",
    ["boolean", ["get", "highlight"], false],
    colors.waypointBikeHighlight,
    colors.waypointBike,
  ],
  [
    "case",
    ["boolean", ["get", "highlight"], false],
    colors.waypointHighlight,
    colors.waypoint,
  ],
];

const snappointColor: NonNullable<
  CircleLayerSpecification["paint"]
>["circle-color"] = [
  "case",
  ["boolean", ["get", "highlight"], false],
  colors.snappointHighlight,
  colors.snappoint,
];

/**
 * Builds the
 * {@link https://github.com/smellyshovel/maplibre-gl-directions/blob/main/src/directions/layers.ts#L3|standard
 * `MapLibreGlDirections` layers} with optionally scaled features.
 *
 * @param pointsScalingFactor A number to multiply the initial points' dimensions by
 * @param linesScalingFactor A number to multiply the initial lines' dimensions by
 * @param sourceName A name of the source used by the instance and layers names' prefix
 */
export default function layersFactory(
  pointsScalingFactor = 0.3,
  linesScalingFactor = 0.3,
  sourceName = "maplibre-gl-indoor-directions",
): LayerSpecification[] {
  const pointCasingCircleRadius: NonNullable<
    CircleLayerSpecification["paint"]
  >["circle-radius"] = [
    "interpolate",
    ["exponential", 1.5],
    ["zoom"],
    // don't forget it's the radius! The visible value is diameter (which is 2x)
    // on zoom levels 0-5 should be 5px more than the routeline casing. 7 + 5 = 12.
    // When highlighted should be +2px more. 12 + 2 = 14
    0,
    // highlighted to default ratio (epsilon) = 14 / 12 ~= 1.16
    [
      "case",
      ["boolean", ["get", "highlight"], ["==", ["get", "type"], "HOVERPOINT"]],
      14 * pointsScalingFactor,
      12 * pointsScalingFactor,
    ],
    5,
    [
      "case",
      ["boolean", ["get", "highlight"], ["==", ["get", "type"], "HOVERPOINT"]],
      14 * pointsScalingFactor,
      12 * pointsScalingFactor,
    ],
    // exponentially grows on zoom levels 5-18 finally becoming the same 5px wider than the routeline's casing on
    // the same zoom level: 23 + 5 = 28px
    18,
    // highlighted = default ~= 33
    [
      "case",
      ["boolean", ["get", "highlight"], ["==", ["get", "type"], "HOVERPOINT"]],
      33 * pointsScalingFactor,
      28 * pointsScalingFactor,
    ],
  ];

  const pointCircleRadius: NonNullable<
    CircleLayerSpecification["paint"]
  >["circle-radius"] = [
    "interpolate",
    ["exponential", 1.5],
    ["zoom"],
    // on zoom levels 0-5 - 5px smaller than the casing. 12 - 5 = 7.
    0,
    // feature to casing ratio (psi) = 7 / 12 ~= 0.58
    // highlighted to default ratio (epsilon) = 9 / 7 ~= 1.28
    [
      "case",
      ["boolean", ["get", "highlight"], ["==", ["get", "type"], "HOVERPOINT"]],
      9 * pointsScalingFactor,
      7 * pointsScalingFactor,
    ],
    5,
    [
      "case",
      ["boolean", ["get", "highlight"], ["==", ["get", "type"], "HOVERPOINT"]],
      9 * pointsScalingFactor,
      7 * pointsScalingFactor,
    ],
    // exponentially grows on zoom levels 5-18 finally becoming psi times the casing
    18,
    // psi * 28 ~= 16
    // when highlighted multiply by epsilon ~= 21
    [
      "case",
      ["boolean", ["get", "highlight"], ["==", ["get", "type"], "HOVERPOINT"]],
      21 * pointsScalingFactor,
      16 * pointsScalingFactor,
    ],
  ];

  const lineWidth: NonNullable<LineLayerSpecification["paint"]>["line-width"] =
    [
      "interpolate",
      ["exponential", 1.5],
      ["zoom"],
      // on zoom levels 0-5 - 4px smaller than the casing (2px on each side). 7 - 4 = 3.
      // Doesn't change when highlighted
      0,
      // feature to casing ratio (psi) = 3 / 7 ~= 0.42
      3 * linesScalingFactor,
      5,
      3 * linesScalingFactor,
      // exponentially grows on zoom levels 5-18 finally becoming psi times the casing
      18,
      // psi * 23  ~= 10
      10 * linesScalingFactor,
    ];

  const lineCasingWidth: NonNullable<
    LineLayerSpecification["paint"]
  >["line-width"] = [
    "interpolate",
    ["exponential", 1.5],
    ["zoom"],
    // on zoom levels 0-5 - 7px by default and 10px when highlighted
    0,
    // highlighted to default ratio (epsilon) = 10 / 7 ~= 1.42
    [
      "case",
      ["boolean", ["get", "highlight"], false],
      10 * linesScalingFactor,
      7 * linesScalingFactor,
    ],
    5,
    [
      "case",
      ["boolean", ["get", "highlight"], false],
      10 * linesScalingFactor,
      7 * linesScalingFactor,
    ],
    // exponentially grows on zoom levels 5-18 finally becoming 32px when highlighted
    18,
    // default = 32 / epsilon ~= 23
    [
      "case",
      ["boolean", ["get", "highlight"], false],
      32 * linesScalingFactor,
      23 * linesScalingFactor,
    ],
  ];

  return [
    {
      id: `${sourceName}-snapline`,
      type: "line",
      source: sourceName,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-dasharray": [3, 3],
        "line-color": colors.snapline,
        "line-opacity": 0.65,
        "line-width": 3,
      },
      filter: ["==", ["get", "type"], "SNAPLINE"],
    },

    {
      id: `${sourceName}-alt-routeline-casing`,
      type: "line",
      source: sourceName,
      layout: {
        "line-cap": "butt",
        "line-join": "round",
      },
      paint: {
        "line-color": colors.altRouteline,
        "line-opacity": 0.55,
        "line-width": lineCasingWidth,
      },
      filter: ["==", ["get", "route"], "ALT"],
    },
    {
      id: `${sourceName}-alt-routeline`,
      type: "line",
      source: sourceName,
      layout: {
        "line-cap": "butt",
        "line-join": "round",
      },
      paint: {
        "line-color": colors.altRouteline,
        "line-opacity": 0.85,
        "line-width": lineWidth,
      },
      filter: ["==", ["get", "route"], "ALT"],
    },

    {
      id: `${sourceName}-routeline-casing`,
      type: "line",
      source: sourceName,
      layout: {
        "line-cap": "butt",
        "line-join": "round",
      },
      paint: {
        "line-color": routelineColor,
        "line-opacity": 0.55,
        "line-width": lineCasingWidth,
      },
      filter: ["==", ["get", "route"], "SELECTED"],
    },
    {
      id: `${sourceName}-routeline`,
      type: "line",
      source: sourceName,
      layout: {
        "line-cap": "butt",
        "line-join": "round",
      },
      paint: {
        "line-color": routelineColor,
        "line-opacity": 0.85,
        "line-width": lineWidth,
      },
      filter: ["==", ["get", "route"], "SELECTED"],
    },

    {
      id: `${sourceName}-hoverpoint-casing`,
      type: "circle",
      source: sourceName,
      paint: {
        "circle-radius": pointCasingCircleRadius,
        "circle-color": colors.hoverpoint,
        "circle-opacity": 0.65,
      },
      filter: ["==", ["get", "type"], "HOVERPOINT"],
    },
    {
      id: `${sourceName}-hoverpoint`,
      type: "circle",
      source: sourceName,
      paint: {
        // same as snappoint, but always hig(since it's always highlighted while present on the map)
        "circle-radius": pointCircleRadius,
        "circle-color": colors.hoverpoint,
      },
      filter: ["==", ["get", "type"], "HOVERPOINT"],
    },

    {
      id: `${sourceName}-snappoint-casing`,
      type: "circle",
      source: sourceName,
      paint: {
        "circle-radius": pointCasingCircleRadius,
        "circle-color": snappointColor,
        "circle-opacity": 0.65,
      },
      filter: ["==", ["get", "type"], "SNAPPOINT"],
    },
    {
      id: `${sourceName}-snappoint`,
      type: "circle",
      source: sourceName,
      paint: {
        "circle-radius": pointCircleRadius,
        "circle-color": snappointColor,
      },
      filter: ["==", ["get", "type"], "SNAPPOINT"],
    },

    {
      id: `${sourceName}-waypoint-casing`,
      type: "circle",
      source: sourceName,
      paint: {
        "circle-radius": pointCasingCircleRadius,
        "circle-color": waypointColor,
        "circle-opacity": 0.65,
      },
      filter: ["==", ["get", "type"], "WAYPOINT"],
    },

    {
      id: `${sourceName}-waypoint`,
      type: "circle",
      source: sourceName,
      paint: {
        "circle-radius": pointCircleRadius,
        "circle-color": waypointColor,
      },
      filter: ["==", ["get", "type"], "WAYPOINT"],
    },
  ] satisfies LayerSpecification[];
}
