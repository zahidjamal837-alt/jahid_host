import { createTerrainMap } from './map/terrain.js';
import { route } from './data/route.js';
import './styles/main.css';

const expedition = createTerrainMap();
const $ = id => document.getElementById(id);
const chapters = [...document.querySelectorAll('[data-stop]')];
let active = -1;
let motion = true;
let scrollFrame = 0;

function setActive(index, fly = true) {
  index = Math.max(0, Math.min(route.length - 1, Number(index)));
  if (index === active && fly) return;
  active = index;
  const stop = route[index];
  $('telemetryElevation').textContent = stop.altitude.toLocaleString('en-US');
  $('telemetryDay').textContent = `${stop.day} / 12`;
  $('telemetryDistance').textContent = `${stop.distance} KM`;
  $('telemetryCoords').innerHTML = `${Math.abs(stop.coords[1]).toFixed(4)}° N&nbsp; ${stop.coords[0].toFixed(4)}° E`;
  $('activeLocation').textContent = stop.short;
  $('chipAltitude').textContent = `${stop.altitude.toLocaleString('en-US')} M`;
  $('railCount').innerHTML = `${String(index + 1).padStart(2, '0')} <i>/ ${String(route.length).padStart(2, '0')}</i>`;
  $('railFill').style.height = `${(index / (route.length - 1)) * 100}%`;
  chapters.forEach(el => el.classList.toggle('is-active', Number(el.dataset.stop) === index));
  if (fly && motion) expedition.flyToStop(stop);
}

function updateFromScroll() {
  scrollFrame = 0;
  const targetY = window.innerHeight * 0.54;
  let closest = 0, distance = Infinity;
  for (const chapter of chapters) {
    const rect = chapter.getBoundingClientRect();
    const midpoint = rect.top + Math.min(rect.height * 0.42, window.innerHeight * 0.55);
    const d = Math.abs(midpoint - targetY);
    if (d < distance) { distance = d; closest = Number(chapter.dataset.stop); }
  }
  setActive(closest, true);
}
function onScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFromScroll); }
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => expedition.map.resize());
window.addEventListener('route-stop-click', e => {
  const target = chapters.find(el => Number(el.dataset.stop) === e.detail);
  target?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
});
$('motionToggle').addEventListener('click', () => {
  motion = !motion;
  $('motionLabel').textContent = motion ? 'MOTION ON' : 'MOTION OFF';
  $('motionToggle').classList.toggle('is-off', !motion);
  if (motion) expedition.flyToStop(route[Math.max(0, active)]);
});
$('resetView').addEventListener('click', () => expedition.reset());
$('terrainToggle').addEventListener('click', () => {
  const enabled = expedition.toggleTerrain();
  $('terrainToggle').innerHTML = enabled ? '△ <span>TERRAIN ×1.4</span>' : '△ <span>TERRAIN OFF</span>';
  $('terrainToggle').classList.toggle('is-off', !enabled);
});
$('replayButton').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: motion ? 'smooth' : 'auto' });
  expedition.flyToStop(route[0]);
});
window.addEventListener('terrain-ready', () => {
  $('map').classList.add('is-ready');
  // Keep the wide Everest-region panorama on the landing page; fly into the route only after scrolling.
  setActive(0, false);
});

// A subtle UI reveal that doesn't control map position; map movement is tied to the active scroll chapter.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('entered'); });
}, { threshold: 0.16 });
chapters.forEach(chapter => revealObserver.observe(chapter));

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  motion = false;
  $('motionLabel').textContent = 'MOTION OFF';
  $('motionToggle').classList.add('is-off');
}
