import { CHAPTERS } from '../data/itinerary';
import { TOTAL, DIST_TO_EBC } from '../data/route';
import { PLAN } from '../data/plan';

const chapterHtml = (c: (typeof CHAPTERS)[number], i: number) => `
<section class="chapter chapter-${c.kind}" data-index="${i}" id="ch-${c.id}" aria-labelledby="h-${c.id}">
  <div class="chapter-inner">
    <p class="kicker">${c.kicker}</p>
    <h2 id="h-${c.id}">${c.title}</h2>
    ${c.paragraphs.map((p) => `<p>${p}</p>`).join('')}
    ${c.facts ? `<dl class="facts">${c.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
    ${c.callout ? `<aside class="callout"><h3>${c.callout.title}</h3><p>${c.callout.text}</p></aside>` : ''}
    ${c.kind === 'intro' ? '<p class="scroll-cue" aria-hidden="true">Scroll to begin ↓</p>' : ''}
    ${c.kind === 'summary' ? summaryHtml() : ''}
  </div>
</section>`;

const summaryHtml = () => `
  <dl class="facts facts-big">
    <div><dt>Distance</dt><dd>≈ ${TOTAL.toFixed(0)} km<sup>†</sup></dd></div>
    <div><dt>To Base Camp</dt><dd>≈ ${DIST_TO_EBC.toFixed(0)} km<sup>†</sup></dd></div>
    <div><dt>Duration</dt><dd>≈ 11 days</dd></div>
    <div><dt>High point</dt><dd>5,545 m</dd></div>
  </dl>
  <div id="profile-full" class="profile profile-full"></div>
  <p class="fine">† Measured along the approximate, hand-placed route polyline, so it under-counts switchbacks. The Lukla–Base Camp round trip is commonly quoted as roughly 130 km; treat both numbers as estimates.</p>`;

const planHtml = () => `
<div class="table-wrap"><table class="plan">
  <caption class="sr-only">Typical day-by-day itinerary</caption>
  <thead><tr><th>Day</th><th>Route</th><th>Type</th><th>Walking</th><th>Overnight</th></tr></thead>
  <tbody>${PLAN.map((r) => `<tr><td>${r.day}</td><td>${r.route}</td><td>${r.type.map((t) => `<span class="chip chip-${t}">${t === 'acclimatization' ? 'acclimatize' : t}</span>`).join(' ')}</td><td>${r.time}</td><td>${r.night}</td></tr>`).join('')}</tbody>
</table></div>
<p class="fine">Typical estimates for a healthy trekker with a guide. Walking times exclude rests and lunch. Conditions, weather, flight delays and personal fitness change everything.</p>`;

export function renderShell(): string {
  return `
<a class="skip" href="#journey">Skip to the journey</a>
<div class="progress-bar" aria-hidden="true"><span id="progress-fill"></span></div>
<main id="journey" class="journey">
  <div class="stage">
    <div id="map" class="map" role="region" aria-label="Interactive 3D terrain map of the Everest region. Use Ctrl and scroll, or two fingers, to move the map."></div>
    <div class="hero-title" id="hero-title">
      <p class="kicker">Everest 3D Trek</p>
      <h1>8,849<span>m</span></h1>
      <p class="hero-sub">Lukla to Base Camp, on real terrain</p>
    </div>
    <div id="controls" class="controls"></div>
    <div id="map-status" class="map-status" role="status" aria-live="polite">Loading terrain…</div>
    <div class="stage-bottom">
      <div id="dashboard" class="dashboard"></div>
      <div id="profile-compact" class="profile profile-compact"></div>
    </div>
  </div>
  <div class="story" id="story">${CHAPTERS.map(chapterHtml).join('')}</div>
</main>
<section class="safety" id="safety">
  <div class="wrap">
    <p class="kicker">Before you go</p>
    <h2>Altitude is the real mountain</h2>
    <div class="cards">
      <article><h3>Acclimatization at Namche</h3><p>Namche (≈ 3,440 m) is the first rest stop. Two nights, with a short climb high and a return to sleep low, gives the body time to begin adapting.</p></article>
      <article><h3>Acclimatization near Dingboche</h3><p>Around 4,400 m a second rest day is standard. Easy walking, drinking enough fluid and not rushing matter more than pushing on for a faster schedule.</p></article>
      <article><h3>Recognize altitude illness</h3><p>Headache, nausea, dizziness, unusual fatigue and poor sleep can signal acute mountain sickness. Breathlessness at rest, a wet cough, confusion or loss of balance can indicate life-threatening HAPE or HACE: descend immediately and seek help.</p></article>
      <article><h3>Ascent rate &amp; rest</h3><p>Above roughly 3,000 m, a widely used guideline is to raise your sleeping altitude by no more than about 300–500 m per day, with a rest day every few days. Do not ascend with worsening symptoms.</p></article>
      <article><h3>Weather &amp; cold</h3><p>Mountain weather changes fast: afternoon cloud, wind, snow, and nights well below freezing at Lobuche and Gorak Shep. Flights to Lukla are often delayed. Carry layers, and plan spare days.</p></article>
      <article><h3>Go prepared</h3><p>Trek with a licensed local guide or reputable agency, check current permit rules, and arrange insurance that covers high-altitude evacuation.</p></article>
    </div>
    <p class="disclaimer"><strong>Not medical or professional advice.</strong> This site is an educational visualization. It is not a substitute for medical advice, a travel doctor, or a qualified local guide. Route geometry is approximate and must not be used for navigation.</p>
    <h2 class="h-sub">Typical day-by-day plan</h2>
    ${planHtml()}
  </div>
</section>
<footer class="footer"><div class="wrap">
  <p>Map: <a href="https://maplibre.org" target="_blank" rel="noopener">MapLibre GL JS</a>. Terrain: Mapzen / AWS Terrain Tiles (SRTM, ASTER GDEM and other open sources). Route: approximate corridor. See LICENSES-AND-ATTRIBUTION.md in the source.</p>
</div></footer>`;
}
