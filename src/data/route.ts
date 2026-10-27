import type { LngLat, PathNode } from '../types';
import { cumulative } from '../lib/geo';

/**
 * APPROXIMATE trekking corridor. Town coordinates are widely published values (rounded);
 * the in-between waypoints are hand-placed along the known valley route and are NOT a surveyed
 * GPS track. Elevations at towns are commonly published figures (sources differ by tens of
 * metres); elevations at intermediate waypoints are estimates. Replace this file with a real
 * openly-licensed GPX (e.g. from OpenStreetMap) for survey-grade geometry — see README.
 */
const n = (id: string, lat: number, lng: number, ele: number): PathNode => ({ id, ll: [lng, lat], ele });
const copy = (p: PathNode, suffix: string): PathNode => ({ ...p, id: p.id + suffix });

const UP: PathNode[] = [
  n('lukla', 27.6869, 86.7314, 2860),
  n('w1', 27.72, 86.726, 2700),
  n('w2', 27.733, 86.717, 2650),
  n('phakding', 27.7447, 86.7125, 2610),
  n('w3', 27.76, 86.711, 2700),
  n('w4', 27.77, 86.7115, 2780),
  n('monjo', 27.784, 86.7145, 2835),
  n('jorsale', 27.795, 86.712, 2830),
  n('w5', 27.803, 86.712, 3000),
  n('namche', 27.8069, 86.714, 3440),
  n('kyanjuma', 27.819, 86.726, 3600),
  n('sanasa', 27.828, 86.744, 3600),
  n('phunki', 27.83, 86.756, 3250),
  n('tengboche', 27.8361, 86.7644, 3867),
  n('deboche', 27.84, 86.77, 3770),
  n('pangboche', 27.857, 86.787, 3985),
  n('somare', 27.873, 86.8, 4010),
  n('dingboche', 27.892, 86.831, 4410),
  n('dughla', 27.923, 86.813, 4620),
  n('lobuche', 27.95, 86.811, 4940),
  n('w6', 27.965, 86.816, 5050),
  n('gorakshep', 27.9805, 86.8283, 5164)
];

const gs = UP[UP.length - 1];
const spur = n('w7', 27.99, 86.84, 5280);
const somareIdx = UP.findIndex((p) => p.id === 'somare');

/** Out to Gorak Shep, Base Camp spur, back to Gorak Shep, Kala Patthar, then the descent. */
export const JOURNEY: PathNode[] = [
  ...UP,
  spur,
  n('ebc', 28.0026, 86.8528, 5364),
  copy(spur, '-r'),
  copy(gs, '-b'),
  n('kalapatthar', 27.9961, 86.8264, 5545),
  copy(gs, '-d'),
  copy(UP[UP.findIndex((p) => p.id === 'lobuche')], '-d'),
  copy(UP[UP.findIndex((p) => p.id === 'dughla')], '-d'),
  n('pheriche', 27.895, 86.819, 4371),
  ...UP.slice(0, somareIdx + 1)
    .reverse()
    .map((p) => copy(p, '-d'))
];

export const LINE: LngLat[] = JOURNEY.map((p) => p.ll);
export const ELES: number[] = JOURNEY.map((p) => p.ele);
export const CUM: number[] = cumulative(LINE);
export const TOTAL: number = CUM[CUM.length - 1];

export const indexOf = (id: string) => {
  const i = JOURNEY.findIndex((p) => p.id === id);
  if (i < 0) throw new Error(`Unknown route node: ${id}`);
  return i;
};
export const distOf = (id: string) => CUM[indexOf(id)];

const kpIdx = indexOf('kalapatthar');
/** Everything up to Kala Patthar (outbound + summit spurs). */
export const OUT_LINE: LngLat[] = LINE.slice(0, kpIdx + 1);
/** Kala Patthar → Gorak Shep → Pheriche → Lukla. */
export const RET_LINE: LngLat[] = LINE.slice(kpIdx);
/** Distance from Lukla to Everest Base Camp along the approximate polyline. */
export const DIST_TO_EBC = distOf('ebc');
