/* Shared diagram helpers for the printed documents: swimlanes, yes/no flows, mind maps, lifecycle loop, feeling curve. */
/* ------------------------------------------------------------------ helpers */
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COLOR = {consumer:'#c9414c', supply:'#c96208', creator:'#c02d61', destination:'#0b8a64', corporate:'#1a6fbd', lifecycle:'#6441cf', internal:'#9a7208'};
const PAL = ['#0e5b5e','#c9414c','#c96208','#0b8a64','#1a6fbd','#6441cf','#9a7208','#c02d61','#3b7d2a','#7a5c3e'];
const CHM = Object.fromEntries(CH.map(c => [c.id, c]));
const short = c => c.name.replace(' Communications','');
function fText(k){
  if (!Array.isArray(k.f)) return k.f;
  const [n, d] = k.f;
  return k.u === '%' ? `${n} ÷ ${d} × 100` : k.u === 'inv' ? `(1 − ${n} ÷ ${d}) × 100` : `${n} ÷ ${d}`;
}
const TOC = [];
let chNo = 0;
function chapter(title, lead, opts = {}){
  const n = String(++chNo).padStart(2, '0');
  TOC.push({n, title, id:'c' + TOC.length, sub:opts.sub});
  return `<section class="chapter" id="c${TOC.length - 1}" style="${opts.c ? '--c:' + opts.c : ''}">
    <div class="ch-open"><div class="no">${n}</div><div class="ey">${esc(opts.ey || 'vacario India · communications explainer')}</div><h1 data-toc="${esc(title)}">${esc(title)}</h1></div>
    ${lead ? `<p class="lead">${lead}</p>` : ''}`;
}
const endCh = '</section>';

/* vertical swimlane: lanes are columns, steps run top to bottom */
function vswim(flow, color, cap){
  const keys = Object.keys(flow.lanes), L = keys.length, N = flow.steps.length;
  const lanesBg = keys.map((k, i) => `<div class="lb" style="grid-column:${i + 1}; grid-row:2 / span ${N}"></div>`).join('');
  const heads = keys.map((k, i) => `<div class="lh" style="grid-column:${i + 1}; grid-row:1">${esc(flow.lanes[k])}</div>`).join('');
  const boxes = flow.steps.map((s, i) => `<div class="bx ${i === 0 ? 'first' : ''}" data-i="${i}" style="grid-column:${keys.indexOf(s.l) + 1}; grid-row:${i + 2}">
      <b><i>${i + 1}</i>${esc(s.t)}</b><span class="o">→ ${esc(s.out)}</span>${s.loop ? `<span class="loop">↺ ${esc(s.loop)}</span>` : ''}<span class="s">${esc(s.sla)}</span></div>`).join('');
  const gates = flow.steps.map((s, i) => s.gate ? `<div class="gate" data-g="${i}">◆ ${esc(s.gate)} · yes ↓</div>` : '').join('');
  return `<div class="fig"><div class="vs" data-vs style="--c:${color}; grid-template-columns:repeat(${L}, minmax(0,1fr))">${heads}${lanesBg}${boxes}${gates}<svg class="wires"></svg></div>
    ${cap ? `<div class="cap">${esc(cap)}</div>` : ''}</div>`;
}
/* step definitions table */
function stepTable(steps, lanes, full){
  return `<table><thead><tr><th style="width:7mm">#</th><th style="width:30mm">Step</th><th>Definition: what happens</th><th style="width:27mm">Owner</th><th style="width:28mm">Time allowed</th><th style="width:26mm">Output</th></tr></thead>
  <tbody>${steps.map((s, i) => `<tr><td class="mono">${i + 1}</td><td class="k">${esc(s.t)}${s.gate ? `<div class="f" style="color:var(--gold)">◆ ${esc(s.gate)}<br>${esc(s.loop || '')}</div>` : ''}</td>
    <td>${full ? `<ul>${s.acts.map(a => `<li>${esc(a)}</li>`).join('')}</ul>${s.tr ? `<span class="faint small">Starts when: ${esc(s.tr)}</span>` : ''}` : esc(s.d)}</td>
    <td>${esc(lanes[s.l])}</td><td><span class="sla">${esc(s.sla)}</span></td><td>${esc(s.out)}</td></tr>`).join('')}</tbody></table>`;
}
/* yes / no flowchart */
function flowchart(d){
  const rows = d.items.map((it, i) => `<div class="fr"><div class="nd ${it.t}">${esc(it.x)}</div>${it.no ? `<div class="nc"><span>NO</span></div><div class="no">${esc(it.no)}<span class="to">→ ${esc(it.to)}</span></div>` : '<div></div><div></div>'}</div>
    ${i < d.items.length - 1 ? `<div class="fv"><div>${it.t === 'ask' ? '<span>YES</span>' : ''}</div></div>` : ''}`).join('');
  return `<div class="fig"><div class="fc">${rows}</div><div class="cap">${esc(d.title)} · gold = yes/no question · follow “yes” down, “no” to the right</div></div>`;
}
/* mind map */
function mindmap(m){
  const half = Math.ceil(m.branches.length / 2), L = m.branches.slice(0, half), R = m.branches.slice(half);
  const rows = Math.max(L.length, R.length);
  const col = i => PAL[i % PAL.length];
  const side = (arr, left, off) => arr.map((b, j) => {
    const c = col(j + off), row = j + 1 + Math.floor((rows - arr.length) / 2);
    return `<div class="br" data-br style="--c:${c}; grid-column:${left ? 2 : 4}; grid-row:${row}">${esc(b[0])}</div>
      <div class="lv ${left ? 'l' : 'r'}" data-lv style="--c:${c}; grid-column:${left ? 1 : 5}; grid-row:${row}">${b[1].map(x => `<span>${esc(x)}</span>`).join('')}</div>`;
  }).join('');
  return `<div class="fig"><div class="mm" data-mm style="grid-template-rows:repeat(${rows}, auto)">
    <div class="ctr" data-ctr><b>${esc(m.centre)}</b><span>${esc(m.sub)}</span></div>${side(L, true, 0)}${side(R, false, half)}<svg class="wires"></svg></div></div>`;
}
/* lifecycle loop */
function lifeLoop(){
  const W = 640, H = 470, cx = 320, cy = 222, rx = 250, ry = 170;
  const pts = LIFE.map((s, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / LIFE.length; return {x:cx + rx * Math.cos(a), y:cy + ry * Math.sin(a), s}; });
  const edge = (p, q) => { /* point where the segment p→q leaves p's 124×42 pill */
    const dx = q.x - p.x, dy = q.y - p.y, t = Math.min(66 / Math.abs(dx || 1e-9), 25 / Math.abs(dy || 1e-9)); return {x:p.x + dx * t, y:p.y + dy * t}; };
  const arrows = pts.map((p, i) => { if (i === pts.length - 1) return ''; const q = pts[i + 1];
    const a = edge(p, q), b = edge(q, p);
    return `<path d="M${a.x.toFixed(1)},${a.y.toFixed(1)} L${b.x.toFixed(1)},${b.y.toFixed(1)}" fill="none" stroke="#0e5b5e" stroke-width="1.8" marker-end="url(#la)"/>`; }).join('');
  const nodes = pts.map((p, i) => `<g><rect x="${p.x - 62}" y="${p.y - 21}" width="124" height="42" rx="21" fill="${i < 4 ? '#0e5b5e' : i < 7 ? '#1a6fbd' : '#6441cf'}"/>
    <text x="${p.x}" y="${p.y - 3}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">${p.s.n} ${esc(p.s.name)}</text>
    <text x="${p.x}" y="${p.y + 12}" text-anchor="middle" font-size="9.5" fill="#dfeeed">${esc(p.s.who)}</text></g>`).join('');
  const r = pts[7], adv = pts[8], pre = pts[4];
  return `<div class="fig"><svg viewBox="0 0 ${W} ${H}" style="width:100%; height:auto; display:block" role="img" aria-label="Customer lifecycle loop">
    <defs><marker id="la" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#0e5b5e"/></marker>
      <marker id="lv" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6441cf"/></marker></defs>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#f6f7f3" stroke="#d8dcd2" stroke-dasharray="4 5"/>
    <g font-family="IBM Plex Sans, sans-serif">
      ${arrows}
      <path d="M${adv.x + 40},${adv.y + 21} C ${cx - 150},${cy + 20} ${cx - 90},${cy + 110} ${pre.x - 20},${pre.y - 22}" fill="none" stroke="#6441cf" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#lv)"/>
      <text x="${cx - 60}" y="${cy + 96}" text-anchor="middle" font-size="10" fill="#6441cf" font-weight="600">next trip: back to Prepare</text>
      <rect x="${cx - 92}" y="${cy - 40}" width="184" height="62" rx="10" fill="#fff" stroke="#d9602e" stroke-width="1.4" stroke-dasharray="5 4"/>
      <text x="${cx}" y="${cy - 20}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#d9602e">At-risk → Lapsed</text>
      <text x="${cx}" y="${cy - 5}" text-anchor="middle" font-size="9.5" fill="#4f5652">60–90 days quiet: win-back offer</text>
      <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="9.5" fill="#4f5652">books again → Won back → Repeat</text>
      ${nodes}
    </g></svg><div class="cap">The customer lifecycle loop · L1–L4 winning a customer (teal) · L5–L7 the trip (blue) · L8–L9 keeping them (violet) · dashed: the loop back and the at-risk path</div></div>`;
}
/* emotion curve */
function feelCurve(){
  const W = 640, H = 200, l = 40, r = 20, t = 18, b = 44, n = LIFE.length;
  const X = i => l + i * (W - l - r) / (n - 1), Y = v => t + (5 - v) * (H - t - b) / 4;
  const pts = LIFE.map((s, i) => [X(i), Y(JOURNEY[s.id].feel)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join('');
  return `<div class="fig"><svg viewBox="0 0 ${W} ${H}" style="width:100%; height:auto; display:block" role="img" aria-label="How the customer feels at each stage">
    <g font-family="IBM Plex Sans, sans-serif">
    ${[1,2,3,4,5].map(v => `<line x1="${l}" x2="${W - r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#eceee7"/><text x="${l - 8}" y="${Y(v) + 3}" text-anchor="end" font-size="9" fill="#858c87">${['','low','','neutral','','high'][v]}</text>`).join('')}
    <path d="${d} L${X(n - 1)},${H - b} L${X(0)},${H - b} Z" fill="#0e5b5e" fill-opacity=".08"/>
    <path d="${d}" fill="none" stroke="#0e5b5e" stroke-width="2.2" stroke-linejoin="round"/>
    ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#fff" stroke="#0e5b5e" stroke-width="2"/>
      <text x="${p[0]}" y="${H - b + 16}" text-anchor="middle" font-size="9.5" font-weight="600" fill="#15191a">${LIFE[i].n}</text>
      <text x="${p[0]}" y="${H - b + 29}" text-anchor="middle" font-size="8.5" fill="#4f5652">${esc(LIFE[i].name.replace('Review & share','Review'))}</text>`).join('')}
    </g></svg><div class="cap">How the traveller feels at each stage (1 low – 5 high, a planning estimate to test with research) · the dips are where pain points sit</div></div>`;
}
function lflow(c){
  const tint = ['#0e5b5e','#1c6b6c','#2a7b7a','#3a8a86','#4d9892','#62a59d','#78b1a8'];
  return `<div class="lflow">${c.flow.map((f, i) => `${i ? `<div class="cv"><span>${esc(c.conv[i - 1])}</span></div>` : ''}<div class="st" style="background:${tint[i]}">${esc(f[0])}</div>`).join('')}</div>`;
}

/* ------------------------------------------------------------------ connectors (after layout) */
function wireAll(){
  const box = (el, R) => { const r = el.getBoundingClientRect(); return {l:r.left - R.left, r:r.right - R.left, t:r.top - R.top, b:r.bottom - R.top, cx:(r.left + r.right) / 2 - R.left, cy:(r.top + r.bottom) / 2 - R.top}; };
  const mk = (id, col) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${col}"/></marker></defs>`;
  document.querySelectorAll('[data-vs]').forEach((vs, n) => {
    const R = vs.getBoundingClientRect(), col = getComputedStyle(vs).getPropertyValue('--c').trim() || '#0e5b5e';
    const bx = [...vs.querySelectorAll('.bx')].sort((a, b) => a.dataset.i - b.dataset.i).map(e => box(e, R));
    let d = '';
    for (let i = 0; i < bx.length - 1; i++){
      const a = bx[i], b = bx[i + 1], ym = (a.b + b.t) / 2;
      d += Math.abs(a.cx - b.cx) < 1 ? `<path d="M${a.cx},${a.b} V${b.t - 1}"/>` : `<path d="M${a.cx},${a.b} V${ym} H${b.cx} V${b.t - 1}"/>`;
    }
    vs.querySelector('svg.wires').innerHTML = mk('vm' + n, col) + `<g fill="none" stroke="${col}" stroke-width="1.3" marker-end="url(#vm${n})">${d.replace(/<path /g, `<path marker-end="url(#vm${n})" `)}</g>`;
    vs.querySelectorAll('.gate').forEach(g => { const a = bx[+g.dataset.g], b = bx[+g.dataset.g + 1]; if (!a) return; g.style.left = a.cx + 'px'; g.style.top = (b ? (a.b + b.t) / 2 : a.b + 6) + 'px'; });
  });
  document.querySelectorAll('[data-mm]').forEach(mm => {
    const R = mm.getBoundingClientRect(), c = box(mm.querySelector('[data-ctr]'), R);
    const rad = (c.r - c.l) / 2;
    let d = '';
    mm.querySelectorAll('[data-br]').forEach(br => {
      const b = box(br, R), col = getComputedStyle(br).getPropertyValue('--c').trim(), left = b.cx < c.cx;
      const ang = Math.atan2(b.cy - c.cy, b.cx - c.cx), sx = c.cx + rad * Math.cos(ang), sy = c.cy + rad * Math.sin(ang);
      const ex = left ? b.r : b.l;
      d += `<path d="M${sx},${sy} C${(sx + ex) / 2},${sy} ${(sx + ex) / 2},${b.cy} ${ex},${b.cy}" stroke="${col}" stroke-width="2.2"/>`;
      const lv = br.nextElementSibling;
      [...lv.children].forEach(s => { const q = box(s, R), lx = left ? q.r : q.l, bx0 = left ? b.l : b.r;
        d += `<path d="M${bx0},${b.cy} C${(bx0 + lx) / 2},${b.cy} ${(bx0 + lx) / 2},${q.cy} ${lx},${q.cy}" stroke="${col}" stroke-width="1"/>`; });
    });
    mm.querySelector('svg.wires').innerHTML = `<g fill="none">${d}</g>`;
  });
}
window.wireAll = wireAll;
if (document.fonts && document.fonts.ready) document.fonts.ready.then(wireAll); else wireAll();
window.addEventListener('load', wireAll);
