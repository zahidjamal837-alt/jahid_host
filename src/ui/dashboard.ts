import { CUM, ELES, TOTAL } from '../data/route';
import { stopById } from '../data/stops';
import { CHAPTERS } from '../data/itinerary';
import { valueAt } from '../lib/geo';
import type { Frame } from '../types';

export class Dashboard {
  private els: Record<string, HTMLElement> = {};
  private lastIndex = -1;

  constructor(root: HTMLElement) {
    root.innerHTML = `
      <div class="dash-head">
        <div><p class="dash-label">Current stop</p><p class="dash-stop" id="d-stop" aria-live="polite"></p></div>
        <div class="dash-ele"><span id="d-ele">–</span><small>m</small></div>
      </div>
      <dl class="dash-grid">
        <div><dt>Trek day</dt><dd id="d-day">–</dd></div>
        <div class="opt"><dt>Next leg</dt><dd id="d-next">–</dd></div>
        <div><dt>Remaining ≈</dt><dd id="d-rem">–</dd></div>
        <div><dt>Progress</dt><dd id="d-pct">0%</dd></div>
        <div class="opt wide"><dt>Overnight</dt><dd id="d-night">–</dd></div>
      </dl>
      <p class="dash-note">Elevation interpolated along an approximate route; distances are estimates.</p>`;
    for (const id of ['stop', 'ele', 'day', 'next', 'rem', 'pct', 'night']) this.els[id] = root.querySelector(`#d-${id}`)!;
  }

  update(frame: Frame) {
    const e = this.els;
    e.ele.textContent = Math.round(valueAt(ELES, CUM, frame.dist)).toLocaleString();
    e.rem.textContent = `${Math.max(0, TOTAL - frame.dist).toFixed(0)} km`;
    e.pct.textContent = `${Math.round(frame.progress * 100)}%`;
    if (frame.index === this.lastIndex) return;
    this.lastIndex = frame.index;
    const c = CHAPTERS[frame.index];
    if (c.stopId) {
      const s = stopById(c.stopId);
      e.stop.textContent = c.id === 'descent' ? 'Descent · Pheriche' : s.name;
      e.day.textContent = s.day;
      e.next.textContent = s.next;
      e.night.textContent = s.overnight;
    } else if (c.kind === 'intro') {
      e.stop.textContent = 'Khumbu region';
      e.day.textContent = 'Before the trek';
      e.next.textContent = 'Flight to Lukla';
      e.night.textContent = 'Kathmandu → Lukla by short mountain flight (weather permitting).';
    } else {
      e.stop.textContent = 'Journey complete';
      e.day.textContent = 'Day 11';
      e.next.textContent = '–';
      e.night.textContent = 'Back in Lukla, ready for the flight to Kathmandu.';
    }
  }
}
