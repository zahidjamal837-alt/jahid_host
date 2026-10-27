import type maplibregl from 'maplibre-gl';
import { lerp, lerpAngle } from '../lib/geo';
import type { CamPose, LngLat } from '../types';

export interface CamState extends CamPose { center: LngLat }

/**
 * Smoothly eases the real map camera toward a target that is driven by scroll.
 * - Uses jumpTo() each animation frame (no overlapping flyTo animations → no conflicts).
 * - The loop only runs while the camera is still catching up.
 * - If the visitor drags / rotates / zooms the map, following pauses until the next scroll or reset().
 */
export class CameraController {
  private cur: CamState | null = null;
  private target: CamState | null = null;
  private raf = 0;
  private last = 0;
  private manual = false;
  private off: Array<() => void> = [];

  constructor(private map: maplibregl.Map, private reduced: boolean) {
    for (const ev of ['dragstart', 'rotatestart', 'pitchstart', 'zoomstart'] as const) {
      const h = (e: any) => { if (e.originalEvent) this.manual = true; };
      map.on(ev, h);
      this.off.push(() => map.off(ev, h));
    }
  }

  get isManual() { return this.manual; }

  /** Called on scroll: resume following if the user had taken manual control. */
  follow(t: CamState) {
    this.target = t;
    if (this.manual) {
      this.manual = false;
      this.cur = this.read();
    }
    this.start();
  }

  /** Update the target without taking control back (e.g. on resize while exploring). */
  retarget(t: CamState) {
    this.target = t;
    if (!this.manual) this.start();
  }

  /** "Reset camera": return to the scripted pose for the current scroll position. */
  reset() {
    if (!this.target) return;
    this.manual = false;
    this.cur = this.read();
    this.start();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.off.forEach((f) => f());
  }

  private read(): CamState {
    const c = this.map.getCenter();
    return { center: [c.lng, c.lat], zoom: this.map.getZoom(), pitch: this.map.getPitch(), bearing: this.map.getBearing() };
  }

  private start() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    this.raf = 0;
    const t = this.target;
    if (!t || this.manual) return;
    if (!this.cur) this.cur = this.read();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const k = this.reduced ? 1 : 1 - Math.exp(-dt * 4.5); // frame-rate independent easing
    const c = this.cur;
    c.center = [lerp(c.center[0], t.center[0], k), lerp(c.center[1], t.center[1], k)];
    c.zoom = lerp(c.zoom, t.zoom, k);
    c.pitch = lerp(c.pitch, t.pitch, k);
    c.bearing = lerpAngle(c.bearing, t.bearing, k);
    this.map.jumpTo({ center: c.center, zoom: c.zoom, pitch: c.pitch, bearing: c.bearing });

    const done =
      Math.abs(c.center[0] - t.center[0]) < 1e-6 && Math.abs(c.center[1] - t.center[1]) < 1e-6 &&
      Math.abs(c.zoom - t.zoom) < 0.002 && Math.abs(c.pitch - t.pitch) < 0.05 &&
      Math.abs((((c.bearing - t.bearing + 540) % 360) - 180)) < 0.05;
    if (!done) this.raf = requestAnimationFrame(this.tick);
  };
}
