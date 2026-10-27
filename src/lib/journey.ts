import { CHAPTERS } from '../data/itinerary';
import { CUM, LINE, TOTAL, distOf } from '../data/route';
import { clamp, lerp, lerpAngle, pointAt, smooth } from './geo';
import type { CamPose, Chapter, Frame, LngLat } from '../types';

interface Placement { chapter: Chapter; dist: number | null; center: LngLat | null }

const placements: Placement[] = CHAPTERS.map((chapter) => ({
  chapter,
  dist: chapter.stopId ? distOf(chapter.stopId) : null,
  center: chapter.center ?? null
}));

/** Distance travelled "so far" for chapters not on the route. */
const fallbackDist = (p: Placement) => (p.dist !== null ? p.dist : p.chapter.kind === 'intro' ? 0 : TOTAL);
const centerOf = (p: Placement): LngLat => (p.dist !== null ? pointAt(LINE, CUM, p.dist) : p.center!);

/**
 * Pure function: fractional chapter position -> camera/route state.
 * Each chapter holds its pose for the first 20% and last 20% of the gap, easing in between.
 */
export function frameAt(f: number, zoomOffset = 0): Frame {
  const ff = clamp(f, 0, placements.length - 1);
  const i = Math.min(Math.floor(ff), placements.length - 2);
  const u = ff - i;
  const t = smooth((u - 0.2) / 0.6);
  const a = placements[i];
  const b = placements[i + 1];

  const dist = lerp(fallbackDist(a), fallbackDist(b), t);
  const onRoute = a.dist !== null && b.dist !== null;
  const ca = centerOf(a);
  const cb = centerOf(b);
  const center: LngLat = onRoute ? pointAt(LINE, CUM, dist) : [lerp(ca[0], cb[0], t), lerp(ca[1], cb[1], t)];
  const pa: CamPose = a.chapter.cam;
  const pb: CamPose = b.chapter.cam;
  const cam: CamPose = {
    zoom: lerp(pa.zoom, pb.zoom, t) + zoomOffset,
    pitch: lerp(pa.pitch, pb.pitch, t),
    bearing: lerpAngle(pa.bearing, pb.bearing, t)
  };
  return { f: ff, index: Math.round(ff), dist, progress: dist / TOTAL, center, cam };
}

/** Maps scroll position to chapter positions using the real DOM layout of the chapters. */
export class ScrollMapper {
  private anchors: number[] = [];

  constructor(private chapters: HTMLElement[], private refY: () => number) {}

  measure() {
    const sy = window.scrollY;
    this.anchors = this.chapters.map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + sy + r.height / 2;
    });
  }

  /** Fractional chapter index for the current scroll position. */
  position(): number {
    const y = window.scrollY + this.refY();
    const a = this.anchors;
    if (!a.length) return 0;
    if (y <= a[0]) return 0;
    if (y >= a[a.length - 1]) return a.length - 1;
    let i = 0;
    while (i < a.length - 2 && y >= a[i + 1]) i++;
    return i + (y - a[i]) / (a[i + 1] - a[i]);
  }

  scrollTopFor(index: number): number {
    return Math.max(0, this.anchors[index] - this.refY());
  }
}
