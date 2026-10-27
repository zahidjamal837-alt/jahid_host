export type LngLat = [number, number];

/** A vertex of the approximate trekking corridor. `ele` is metres above sea level. */
export interface PathNode {
  id: string;
  ll: LngLat;
  ele: number;
}

export interface CamPose {
  zoom: number;
  pitch: number;
  bearing: number;
}

export type StopKind = 'start' | 'overnight' | 'pass' | 'goal' | 'viewpoint' | 'return';

export interface StopMeta {
  id: string;
  name: string;
  kind: StopKind;
  /** Human-readable trekking day(s). */
  day: string;
  /** Leg that follows this stop. */
  next: string;
  /** Typical overnight / lodging information. */
  overnight: string;
}

export interface Stop extends StopMeta {
  ll: LngLat;
  /** Commonly published elevation (m). Sources differ by tens of metres. */
  ele: number;
  /** Distance along the approximate journey polyline (km). */
  dist: number;
}

export interface Chapter {
  id: string;
  kind: 'intro' | 'stop' | 'summary';
  stopId?: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  facts?: [string, string][];
  callout?: { title: string; text: string };
  cam: CamPose;
  /** Fixed centre for chapters that are not tied to a stop. */
  center?: LngLat;
}

export interface Frame {
  /** Fractional chapter position. */
  f: number;
  index: number;
  dist: number;
  progress: number;
  center: LngLat;
  cam: CamPose;
}
