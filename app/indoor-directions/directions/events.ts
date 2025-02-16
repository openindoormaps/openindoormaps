import type { Map, MapMouseEvent, MapTouchEvent } from "maplibre-gl";

export class IndoorDirectionsEvented {
  constructor(map: Map) {
    this.map = map;
  }

  protected readonly map: Map;

  private listeners: ListenersStore = {};
  private oneTimeListeners: ListenersStore = {};

  protected fire<T extends keyof IndoorDirectionsEventType>(
    event: IndoorDirectionsEventType[T],
  ) {
    event.target = this.map;

    const type: T = event.type as T;

    this.listeners[type]?.forEach((listener) => listener(event));
    this.oneTimeListeners[type]?.forEach((listener) => {
      listener(event);

      const index = this.oneTimeListeners[type]?.indexOf(listener);
      if (index !== undefined && ~index)
        this.oneTimeListeners[type]?.splice(index, 1);
    });
  }

  /**
   * Registers an event listener.
   */
  on<T extends keyof IndoorDirectionsEventType>(
    type: T,
    listener: IndoorDirectionsEventListener<T>,
  ) {
    this.listeners[type] = this.listeners[type] ?? [];
    this.listeners[type]!.push(listener);
  }

  /**
   * Un-registers an event listener.
   */
  off<T extends keyof IndoorDirectionsEventType>(
    type: T,
    listener: (e: IndoorDirectionsEventType[T]) => void,
  ) {
    const index = this.listeners[type]?.indexOf(listener);
    if (index !== undefined && ~index) this.listeners[type]?.splice(index, 1);
  }

  /**
   * Registers an event listener to be invoked only once.
   */
  once<T extends keyof IndoorDirectionsEventType>(
    type: T,
    listener: IndoorDirectionsEventListener<T>,
  ) {
    this.oneTimeListeners[type] = this.oneTimeListeners[type] ?? [];
    this.oneTimeListeners[type]!.push(listener);
  }
}

/**
 * Supported event types.
 */
export interface IndoorDirectionsEventType {
  /**
   * Emitted after the waypoints are set using the {@link default.setWaypoints|`setWaypoints`} method.
   */
  setwaypoints: IndoorDirectionsWaypointEvent;

  /**
   * Emitted after the waypoints' bearings values are changed using the
   * {@link default.waypointsBearings|`waypointsBearings`} setter.
   */
  rotatewaypoints: IndoorDirectionsWaypointEvent;

  /**
   * Emitted when a waypoint is added.
   */
  addwaypoint: IndoorDirectionsWaypointEvent;

  /**
   * Emitted when a waypoint is removed.
   */
  removewaypoint: IndoorDirectionsWaypointEvent;

  /**
   * Emitted when a waypoint is moved. __Note__ that the event is not emitted if the waypoint has been dragged for an
   * amount of pixels less than specified by the {@link IndoorDirectionsConfiguration.dragThreshold|`dragThreshold`}
   * configuration property.
   */
  movewaypoint: IndoorDirectionsWaypointEvent;

  /**
   * Emitted when there appears an ongoing routing-request.
   */
  calculateroutesstart: IndoorDirectionsRoutingEvent;

  /**
   * Emitted after the ongoing routing-request has finished.
   */
  calculateroutesend: IndoorDirectionsRoutingEvent;
}

export type IndoorDirectionsEventListener<
  T extends keyof IndoorDirectionsEventType,
> = (event: IndoorDirectionsEventType[T]) => void;

type ListenersStore = Partial<{
  [T in keyof IndoorDirectionsEventType]: IndoorDirectionsEventListener<T>[];
}>;

export interface IndoorDirectionsEvent<
  TOrig,
  T extends keyof IndoorDirectionsEventType,
> {
  type: T;
  target: Map;
  originalEvent: TOrig;
}

export interface IndoorDirectionsWaypointEventData {
  /**
   * Index of the added/removed/moved waypoint.
   *
   * Never presents for {@link IndoorDirectionsEventType.setwaypoints|`setwaypoints`} and
   * {@link IndoorDirectionsEventType.rotatewaypoints|`rotatewaypoints`} events.
   */
  index: number;

  /**
   * Coordinates from which the waypoint has been moved.
   *
   * Only presents when it's the {@link IndoorDirectionsEventType.movewaypoint|`movewaypoint`} event.
   */
  initialCoordinates: [number, number];
}

export class IndoorDirectionsWaypointEvent
  implements
    IndoorDirectionsEvent<
      MapMouseEvent | MapTouchEvent | undefined,
      | "setwaypoints"
      | "rotatewaypoints"
      | "addwaypoint"
      | "removewaypoint"
      | "movewaypoint"
    >
{
  /**
   * @private
   */
  constructor(
    type:
      | "setwaypoints"
      | "rotatewaypoints"
      | "addwaypoint"
      | "removewaypoint"
      | "movewaypoint",
    originalEvent: MapMouseEvent | MapTouchEvent | undefined,
    data?: Partial<IndoorDirectionsWaypointEventData>,
  ) {
    this.type = type;
    this.originalEvent = originalEvent;
    this.data = data;
  }

  type;
  target!: Map;
  originalEvent: MapMouseEvent | MapTouchEvent | undefined;
  data?: Partial<IndoorDirectionsWaypointEventData>;
}

export type IndoorDirectionsRoutingEventData = [number, number][];

export class IndoorDirectionsRoutingEvent
  implements
    IndoorDirectionsEvent<
      IndoorDirectionsWaypointEvent,
      "calculateroutesstart" | "calculateroutesend"
    >
{
  /**
   * @private
   */
  constructor(
    type: "calculateroutesstart" | "calculateroutesend",
    originalEvent: IndoorDirectionsWaypointEvent,
    data?: IndoorDirectionsRoutingEventData,
  ) {
    this.type = type;
    this.originalEvent = originalEvent;
    this.data = data;
  }

  type;
  target!: Map;
  originalEvent: IndoorDirectionsWaypointEvent;
  /**
   * The server's response.
   *
   * Only presents when it's the {@link IndoorDirectionsEventType.fetchroutesend|`fetchroutesend`} event, but might
   * be `undefined` in case the request to fetch directions failed.
   *
   * @see http://project-osrm.org/docs/v5.24.0/api/#responses
   */
  data?: IndoorDirectionsRoutingEventData;
}
