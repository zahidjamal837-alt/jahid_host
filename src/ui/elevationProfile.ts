import { CUM, ELES, TOTAL, JOURNEY } from '../data/route';
import { STOPS } from '../data/stops';
import { valueAt } from '../lib/geo';
import type { Frame } from '../types';

const W = 800;
const MIN_E = 2300;
const MAX_E = 5800;

export class ElevationProfile {
  private svg: SVGSVGElement;
  private clip: SVGRectElement;
  private cursor: SVGGElement;
  private cLine: SVGLineElement;
  private cDot: SVGCircleElement;
  private cText: SVGTextElement;
  private pins = new Map<string, SVGGElement>();
  private H: number;
  private padL = 42;
  private padR = 14;
  private padT: number;
  private padB = 26;

  constructor(root: HTMLElement, private opts: { compact: boolean; onSelect: (stopId: string) => void }) {
    this.H = opts.compact ? 170 : 340;
    this.padT = opts.compact ? 16 : 40;
    const x = (d: number) => this.padL + (d / TOTAL) * (W - this.padL - this.padR);
    const y = (e: number) => this.padT + (1 - (e - MIN_E) / (MAX_E - MIN_E)) * (this.H - this.padT - this.padB);

    const line = JOURNEY.map((_, i) => `${i ? 'L' : 'M'}${x(CUM[i]).toFixed(1)},${y(ELES[i]).toFixed(1)}`).join('');
    const area = `${line}L${x(TOTAL).toFixed(1)},${y(MIN_E)}L${x(0)},${y(MIN_E)}Z`;
    const grid = [3000, 4000, 5000].map((e) => `<line class="grid" x1="${this.padL}" x2="${W - this.padR}" y1="${y(e)}" y2="${y(e)}"/><text class="axis" x="${this.padL - 6}" y="${y(e) + 3}" text-anchor="end">${e.toLocaleString()}</text>`).join('');

    const pins = STOPS.map((s, i) => {
      const lab = opts.compact ? '' : `<text class="pin-name" x="${x(s.dist)}" y="${y(s.ele) - (i % 2 ? 26 : 12)}" text-anchor="middle">${s.name.replace('Everest Base Camp', 'Base Camp')}</text>${i % 2 ? `<line class="stem" x1="${x(s.dist)}" x2="${x(s.dist)}" y1="${y(s.ele) - 22}" y2="${y(s.ele) - 5}"/>` : ''}`;
      return `<g class="ppin" data-stop="${s.id}" role="button" tabindex="0" aria-label="${s.name}, about ${s.ele} metres. Go to this stop"><title>${s.name} · ≈ ${s.ele.toLocaleString()} m (published, approximate)</title><circle class="hit" cx="${x(s.dist)}" cy="${y(s.ele)}" r="13"/><circle class="dot" cx="${x(s.dist)}" cy="${y(s.ele)}" r="4.5"/>${lab}</g>`;
    }).join('');

    root.innerHTML = `
      <svg viewBox="0 0 ${W} ${this.H}" role="group" aria-label="Elevation profile of the full journey">
        <defs>
          <linearGradient id="pf-${opts.compact ? 'c' : 'f'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb6d8" stop-opacity=".45"/><stop offset="1" stop-color="#7fb6d8" stop-opacity="0"/></linearGradient>
          <clipPath id="clip-${opts.compact ? 'c' : 'f'}"><rect x="0" y="0" width="0" height="${this.H}"/></clipPath>
        </defs>
        ${grid}
        <path d="${area}" fill="url(#pf-${opts.compact ? 'c' : 'f'})"/>
        <path d="${line}" class="base-line"/>
        <path d="${line}" class="prog-line" clip-path="url(#clip-${opts.compact ? 'c' : 'f'})"/>
        ${pins}
        <g class="cursor"><line x1="0" x2="0" y1="${this.padT}" y2="${this.H - this.padB}"/><circle r="5.5" cx="0" cy="0"/><text class="cursor-text" y="${this.padT - 4}" text-anchor="middle"></text></g>
        <text class="axis" x="${this.padL}" y="${this.H - 6}">Lukla</text>
        <text class="axis" x="${x(TOTAL)}" y="${this.H - 6}" text-anchor="end">Lukla (return)</text>
        <text class="axis" x="${x(TOTAL * 0.5)}" y="${this.H - 6}" text-anchor="middle">distance along approximate route →</text>
      </svg>
      ${opts.compact ? '' : '<p class="fine">● Dots: commonly published stop elevations (sources differ by tens of metres). Line between dots: estimated from approximate geometry.</p>'}`;

    this.svg = root.querySelector('svg')!;
    this.clip = root.querySelector('clipPath rect')!;
    this.cursor = root.querySelector('.cursor')!;
    this.cLine = this.cursor.querySelector('line')!;
    this.cDot = this.cursor.querySelector('circle')!;
    this.cText = this.cursor.querySelector('text')!;
    root.querySelectorAll<SVGGElement>('.ppin').forEach((g) => {
      this.pins.set(g.dataset.stop!, g);
      g.addEventListener('click', () => opts.onSelect(g.dataset.stop!));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opts.onSelect(g.dataset.stop!); } });
    });
    this.xOf = x;
    this.yOf = y;
  }

  private xOf: (d: number) => number;
  private yOf: (e: number) => number;

  update(frame: Frame, activeStop: string | null) {
    const px = this.xOf(frame.dist);
    const ele = valueAt(ELES, CUM, frame.dist);
    this.clip.setAttribute('width', px.toFixed(1));
    this.cLine.setAttribute('x1', px.toFixed(1));
    this.cLine.setAttribute('x2', px.toFixed(1));
    this.cDot.setAttribute('cx', px.toFixed(1));
    this.cDot.setAttribute('cy', this.yOf(ele).toFixed(1));
    this.cText.setAttribute('x', Math.min(W - 40, Math.max(60, px)).toFixed(1));
    this.cText.textContent = `≈ ${Math.round(ele).toLocaleString()} m`;
    this.pins.forEach((g, id) => g.classList.toggle('is-active', id === activeStop));
  }

  destroy() { this.svg.remove(); }
}
