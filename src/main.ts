import 'maplibre-gl/dist/maplibre-gl.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/global.css';
import './styles/layout.css';
import './styles/map.css';
import './styles/responsive.css';

import { CHAPTERS } from './data/itinerary';
import { LINE, CUM } from './data/route';
import { clamp, pointAt, sliceTo } from './lib/geo';
import { ScrollMapper, frameAt } from './lib/journey';
import { renderShell } from './ui/shell';
import { Dashboard } from './ui/dashboard';
import { ElevationProfile } from './ui/elevationProfile';
import { mountControls } from './ui/controls';
import { createMap } from './map/createMap';
import { CameraController, type CamState } from './map/cameraController';
import { addRouteLayers, setProgress, setRouteVisible, type RouteView } from './map/routeLayers';
import { addMarkers, type Markers } from './map/markers';
import type { Frame } from './types';

gsap.registerPlugin(ScrollTrigger);

const app = document.getElementById('app')!;
app.innerHTML = renderShell();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) document.documentElement.classList.add('reduced');
const desktop = window.matchMedia('(min-width: 960px)');

const $ = <T extends HTMLElement>(sel: string) => app.querySelector<T>(sel)!;
const stage = $('.stage');
const chapters = Array.from(app.querySelectorAll<HTMLElement>('.chapter'));
const status = $('#map-status');
const fill = $('#progress-fill');
const hero = $('#hero-title');

/** Viewport line where a chapter counts as "reached": mid-screen on desktop, inside the text area on mobile. */
const refY = () => (desktop.matches ? innerHeight * 0.5 : stage.offsetHeight + (innerHeight - stage.offsetHeight) * 0.35);
const zoomOffset = () => (stage.clientWidth < 640 ? -0.5 : 0);
const mapper = new ScrollMapper(chapters, refY);
mapper.measure();

const toCam = (f: Frame): CamState => ({ center: f.center, ...f.cam });
const stopChapter = (stopId: string) => CHAPTERS.findIndex((c) => c.stopId === stopId);

// ---- app state ---------------------------------------------------------
let camera: CameraController | null = null;
let markers: Markers | null = null;
let mapReady = false;
let routeOn = true;
let view: RouteView = 'both';
let last: Frame = frameAt(mapper.position(), zoomOffset());

const goTo = (index: number) => {
  camera?.reset();
  window.scrollTo({ top: mapper.scrollTopFor(index), behavior: reduced ? 'auto' : 'smooth' });
};
const goToStop = (stopId: string) => { const i = stopChapter(stopId); if (i >= 0) goTo(i); };

// ---- UI components -----------------------------------------------------
const dashboard = new Dashboard($('#dashboard'));
const profileCompact = new ElevationProfile($('#profile-compact'), { compact: true, onSelect: goToStop });
const profileFull = new ElevationProfile($('#profile-full'), { compact: false, onSelect: goToStop });

// ---- map ---------------------------------------------------------------
const setStatus = (msg: string | null, level: 'info' | 'warn') => {
  status.textContent = msg ?? '';
  status.hidden = !msg;
  status.dataset.level = level;
};

const handle = createMap($('#map'), { center: last.center, cam: last.cam }, { onStatus: setStatus });
let map = handle?.map ?? null;
if (!handle) $('#controls').hidden = true;

if (handle && map) {
  camera = new CameraController(map, reduced);
  handle.ready.then(() => {
    if (!map) return;
    addRouteLayers(map);
    markers = addMarkers(map, goToStop);
    mapReady = true;
    render(false);
  });
  mountControls($('#controls'), {
    onSelect: goToStop,
    onReset: () => camera?.reset(),
    onRouteVisible: (v) => { routeOn = v; applyRoute(); },
    onMarkersVisible: (v) => markers?.setVisible(v),
    onView: (v) => { view = v; applyRoute(); }
  });
}

function applyRoute() { if (map && mapReady) setRouteVisible(map, routeOn, view); }

// ---- render loop (one update per animation frame) ------------------------
let queued = false;
let fromScroll = false;
function schedule(scroll: boolean) {
  fromScroll ||= scroll;
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; const s = fromScroll; fromScroll = false; render(s); });
}

function render(scroll: boolean) {
  const frame = frameAt(mapper.position(), zoomOffset());
  last = frame;
  const stopId = CHAPTERS[frame.index].stopId ?? null;

  dashboard.update(frame);
  profileCompact.update(frame, stopId);
  profileFull.update(frame, stopId);
  fill.style.transform = `scaleX(${frame.progress.toFixed(4)})`;
  hero.style.opacity = String(1 - clamp(frame.f * 2.2));
  chapters.forEach((el, i) => el.classList.toggle('is-active', i === frame.index));

  if (map && mapReady) {
    setProgress(map, sliceTo(LINE, CUM, frame.dist));
    markers?.setActive(stopId);
    markers?.moveWalker(frame.index === 0 && frame.f < 0.01 ? LINE[0] : lookupPoint(frame));
    applyRoute();
  }
  if (camera) (scroll ? camera.follow(toCam(frame)) : camera.retarget(toCam(frame)));
}

/** Marker follows the route position for the current distance. */
const lookupPoint = (f: Frame) => pointAt(LINE, CUM, f.dist);

const trigger = ScrollTrigger.create({
  trigger: $('#story'), start: 'top bottom', end: 'bottom top', onUpdate: () => schedule(true)
});
const onRefresh = () => { mapper.measure(); schedule(false); };
ScrollTrigger.addEventListener('refresh', onRefresh);
window.addEventListener('load', () => ScrollTrigger.refresh());
render(false);

// ---- cleanup (HMR / navigation) -----------------------------------------
const dispose = () => {
  trigger.kill();
  ScrollTrigger.removeEventListener('refresh', onRefresh);
  camera?.destroy();
  profileCompact.destroy();
  profileFull.destroy();
  map?.remove();
  map = null;
};
window.addEventListener('pagehide', dispose, { once: true });
import.meta.hot?.dispose(dispose);
