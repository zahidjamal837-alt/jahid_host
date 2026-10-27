import type { LngLat } from '../types';

const R = 6371.0088; // mean Earth radius, km
const rad = (d: number) => (d * Math.PI) / 180;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
/** Interpolate angles along the shortest arc (degrees). */
export const lerpAngle = (a: number, b: number, t: number) => a + (((b - a + 540) % 360) - 180) * t;

export function haversine(a: LngLat, b: LngLat): number {
  const dLat = rad(b[1] - a[1]);
  const dLng = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function cumulative(pts: LngLat[]): number[] {
  const out = [0];
  for (let i = 1; i < pts.length; i++) out.push(out[i - 1] + haversine(pts[i - 1], pts[i]));
  return out;
}

/** Largest i with cum[i] <= d, limited to the last segment. */
function segIndex(cum: number[], d: number): number {
  let lo = 0;
  let hi = cum.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (cum[mid] <= d) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function pointAt(pts: LngLat[], cum: number[], d: number): LngLat {
  const dd = clamp(d, 0, cum[cum.length - 1]);
  const i = segIndex(cum, dd);
  const t = (dd - cum[i]) / (cum[i + 1] - cum[i] || 1);
  return [lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)];
}

export function sliceTo(pts: LngLat[], cum: number[], d: number): LngLat[] {
  if (d <= 0.001) return [];
  const dd = clamp(d, 0, cum[cum.length - 1]);
  const i = segIndex(cum, dd);
  return [...pts.slice(0, i + 1), pointAt(pts, cum, dd)];
}

export function valueAt(vals: number[], cum: number[], d: number): number {
  const dd = clamp(d, 0, cum[cum.length - 1]);
  const i = segIndex(cum, dd);
  return lerp(vals[i], vals[i + 1], (dd - cum[i]) / (cum[i + 1] - cum[i] || 1));
}
