const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const slug = s => s.toLowerCase().replace(/[^a-z]+/g, '-');
const go = h => { if (location.hash.slice(1) !== h) history.pushState(null, '', h ? '#' + h : location.pathname + location.search); route(); };
const hashFor = c => c ? '#' + slug(c) : location.pathname + location.search;
const id3 = n => String(n).padStart(3, '0');

const CATS = {
  'Animals': ['#63c98f', '<ellipse class="f" cx="12" cy="16" rx="5" ry="4.2"/><circle class="f" cx="5" cy="11" r="2.2"/><circle class="f" cx="9.3" cy="6.5" r="2.3"/><circle class="f" cx="14.7" cy="6.5" r="2.3"/><circle class="f" cx="19" cy="11" r="2.2"/>'],
  'Rough Terrain': ['#c9a15a', '<path class="f" d="M1 20 9 5l4 7 2-3 8 11z"/>'],
  'Extreme Climate': ['#8fd6e8', '<path stroke-width="1.8" transform="rotate(0 12 12)" d="M12 12V1.5M9 3.2l3 3 3-3"/><path stroke-width="1.8" transform="rotate(60 12 12)" d="M12 12V1.5M9 3.2l3 3 3-3"/><path stroke-width="1.8" transform="rotate(120 12 12)" d="M12 12V1.5M9 3.2l3 3 3-3"/><path stroke-width="1.8" transform="rotate(180 12 12)" d="M12 12V1.5M9 3.2l3 3 3-3"/><path stroke-width="1.8" transform="rotate(240 12 12)" d="M12 12V1.5M9 3.2l3 3 3-3"/><path stroke-width="1.8" transform="rotate(300 12 12)" d="M12 12V1.5M9 3.2l3 3 3-3"/>'],
  'Fire': ['#ff8340', '<path class="f" d="M12.500 1c.4 4.300 6.800 6.900 6.800 13.400a7.300 7.800 0 0 1-14.600 0c0-3 1.500-5.200 3.100-6.700.2 1.700.8 2.700 1.800 3.300C10.500 7.600 10 4.300 12.500 1z"/><path style="fill:var(--c);stroke:none" d="M12 20c-1.900 0-3.200-1.300-3.200-3.100 0-2.200 2.300-3 3.200-5 .9 2 3.200 2.800 3.200 5C15.200 18.700 13.900 20 12 20z"/>'],
  'Drowning': ['#5fb0f0', '<circle class="f" cx="12" cy="6.200" r="2.900"/><path stroke-width="2.800" d="M4.800 2.800 8 10.600h8l3.200-7.800"/><path class="f" d="M7.300 10h9.400l.5 4.200H6.800z"/><path stroke-width="2.300" d="M1.500 17c1.750 0 1.750-1.500 3.500-1.500S6.750 17 8.500 17s1.750-1.500 3.500-1.500 1.750 1.500 3.500 1.500 1.750-1.500 3.500-1.500 1.750 1.500 3.500 1.500M1.500 22c1.750 0 1.750-1.500 3.500-1.500S6.750 22 8.500 22s1.750-1.500 3.500-1.500 1.750 1.500 3.500 1.500 1.750-1.500 3.500-1.500 1.750 1.500 3.500 1.500"/>'],
  'Hazmat': ['#c68bf0', '<circle class="f" cx="12" cy="12" r="2.400"/><path class="f" d="M12 12m-1.900-3.300L7 3.300a10 10 0 0 1 10 0l-3.100 5.400a3.800 3.800 0 0 0-3.800 0zM8.200 12H2a10 10 0 0 0 5 8.700l3.100-5.400A3.800 3.800 0 0 1 8.200 12zM15.800 12H22a10 10 0 0 1-5 8.700l-3.100-5.400a3.800 3.800 0 0 0 1.900-3.300z"/>'],
  'Human Threat & Crime': ['#ff7b7b', '<path d="M1.500 12C6 5 18 5 22.500 12 18 19 6 19 1.500 12z"/><circle class="f" cx="12" cy="12" r="3.400"/>'],
  'Occupational Safety': ['#ffc20e', '<path class="f" d="M2.5 16v-1.5c0-4 2.5-7.2 6-8.5v6.5H10V4.8a1.2 1.2 0 0 1 1.2-1.2h1.6A1.2 1.2 0 0 1 14 4.8v7.7h1.5V6c3.5 1.3 6 4.5 6 8.5V16z"/><rect class="f" x="0" y="17.3" width="24" height="4" rx="2"/>'],
  'Unclassified': ['#d6d6cd', '<path d="M8 8a4 4 0 1 1 6 3.500c-1.500.9-2 1.500-2 3.500"/><circle class="f" cx="12" cy="20" r="1.700"/>'],
};
const SHORT = { 'Animals': 'Animals', 'Rough Terrain': 'Terrain', 'Extreme Climate': 'Climate', 'Fire': 'Fire', 'Drowning': 'Water', 'Hazmat': 'Hazmat', 'Human Threat & Crime': 'People', 'Occupational Safety': 'Work', 'Unclassified': 'Other' };
const bySlug = Object.fromEntries(Object.keys(CATS).map(c => [slug(c), c]));
const icon = c => `<i class="ico" style="--c:${CATS[c][0]}" aria-hidden="true"><svg viewBox="0 0 24 24">${CATS[c][1]}</svg></i>`;

let signs = [], shown = [], cat = '', current = null, openedHere = false;
const view = $('view'), grid = $('grid');
const cards = new Map();

/* ---------- archive ---------- */
function buildCards() {
  for (const s of signs) {
    const li = el('li'), a = el('a', 'card'), img = el('img'), body = el('div'), meta = el('p');
    a.href = '#sign/' + s.rank; a.style.setProperty('--c', CATS[s.category][0]);
    img.src = `img/t/${id3(s.rank)}.webp`; img.width = s.w; img.height = s.h; img.loading = 'lazy'; img.decoding = 'async';
    img.onerror = () => img.classList.add('broken');
    img.alt = ''; // the sign's words are the link's heading
    meta.textContent = s.category;
    body.append(el('h2', '', s.headline), meta);
    a.append(img, body); li.append(a); cards.set(s.rank, li);
  }
}
function buildCats() {
  const count = c => signs.filter(s => s.category === c).length;
  for (const c of ['', ...Object.keys(CATS)]) {
    const b = el('button', 'cat'); b.dataset.cat = c;
    b.innerHTML = c ? icon(c) : '';
    b.append(el('span', '', c || 'All'), el('small', '', c ? count(c) : signs.length));
    b.onclick = () => { go(c ? slug(c) : ''); };
    $('cats').append(b);
    const q = el('button', 'qb'); q.dataset.cat = c; q.setAttribute('aria-label', `${c || 'All'}, ${c ? count(c) : signs.length} signs`);
    q.innerHTML = c ? icon(c) : '';
    q.append(el('span', 'name', c || 'All'), el('small', '', c ? count(c) : signs.length), el('b', '', '✕'));
    q.append(el('em', '', SHORT[c] || 'All'));
    q.onclick = () => { hideTip(); go(c && c !== cat ? slug(c) : ''); toResults(); };
    q.onpointerenter = e => { if (e.pointerType === 'mouse') showTip(q, c); };
    q.onpointerleave = q.onblur = hideTip;
    q.onfocus = () => { if (q.matches(':focus-visible')) showTip(q, c); };
    $('quick').append(q);
    if (c === 'Unclassified') continue;
    const m = el('button', 'dd-item'); m.dataset.cat = c;
    m.innerHTML = c ? icon(c) : '<i class="ico none" aria-hidden="true"><svg viewBox="0 0 24 24"><rect class="f" x="3" y="3" width="8" height="8" rx="1.5"/><rect class="f" x="13" y="3" width="8" height="8" rx="1.5"/><rect class="f" x="3" y="13" width="8" height="8" rx="1.5"/><rect class="f" x="13" y="13" width="8" height="8" rx="1.5"/></svg></i>';
    m.append(el('span', '', c || 'All signs'), el('small', '', c ? count(c) : signs.length));
    m.onclick = () => { closeMenu(true); go(c ? slug(c) : ''); toResults(); };
    $('dd-menu').append(m);
  }
}
function apply() {
  shown = signs.filter(s => !cat || s.category === cat);
  grid.replaceChildren(...shown.map(s => cards.get(s.rank)));
  $('count').replaceChildren(...(cat ? [el('strong', '', cat + ' ')] : []), el('span', '', `${shown.length} ${shown.length === 1 ? 'sign' : 'signs'}`));
  document.querySelectorAll('.cat, .qb, .dd-item').forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === cat));
  $('dd').innerHTML = cat ? icon(cat) : '';
  $('dd').append(el('span', '', cat || 'Filter'));
  $('dd').setAttribute('aria-label', cat ? 'Filter: ' + cat : 'Filter');
  $('show-all').hidden = !cat; document.body.classList.toggle('filtered', !!cat);
  layout();
}
function toResults() { const c = $('list-head'); if (c.getBoundingClientRect().top < 0) c.scrollIntoView({ block: 'start' }); }
let tip = null;
function hideTip() { tip?.remove(); tip = null; }
function showTip(q, c) {
  hideTip(); if (!c || c === cat) return;
  const r = q.getBoundingClientRect(); tip = el('div', '', c); tip.id = 'tip'; tip.setAttribute('aria-hidden', 'true');
  document.body.append(tip);
  const half = tip.offsetWidth / 2; tip.style.left = Math.max(half + 8, Math.min(innerWidth - half - 8, r.left + r.width / 2)) + 'px'; tip.style.top = r.bottom + 10 + 'px';
}
function layout() {
  if ($('archive').hidden) return;
  const gap = parseFloat(getComputedStyle(grid).columnGap);
  const items = [...grid.children], hs = items.map(li => li.firstChild.getBoundingClientRect().height);
  items.forEach((li, i) => { li.style.gridRowEnd = 'span ' + Math.ceil((hs[i] + gap) / 2); });
}

/* ---------- sign view ---------- */
function show(s) {
  current = s;
  const p = $('photo'), i = shown.indexOf(s);
  p.removeAttribute('src'); p.width = s.lw; p.height = s.lh;
  p.style.cssText = `width:min(100%, ${s.lw}px, calc(var(--mh) * ${s.lw / s.lh}));aspect-ratio:${s.lw}/${s.lh};background-image:url(img/t/${id3(s.rank)}.webp)`;
  p.src = `img/l/${id3(s.rank)}.webp`;
  p.alt = 'Photo of a sign reading: ' + s.text.join(' ');
  $('says').replaceChildren(...s.text.map(t => el('p', '', t)));
  const long = s.text.join('').length > 160;
  $('says').classList.toggle('long', long); $('says').classList.toggle('clamped', long);
  $('more').hidden = !long; $('more').setAttribute('aria-expanded', false); $('more').textContent = 'Read the full sign';
  $('note').textContent = s.note; $('note').hidden = !s.note;
  $('facts').replaceChildren(...[['Hazard', s.category], ['Posted as', s.title], ['Upvotes', s.upvotes.toLocaleString()], ['Comments', s.comments.toLocaleString()], ['Rank', s.rank]].map(([k, v]) => { const d = el('div'); d.append(el('dt', '', k), el('dd', '', v)); return d; }));
  $('reddit').href = s.permalink; $('copy').textContent = canShare ? 'Share' : 'Copy link';
  const n = signs.filter(x => x.category === s.category).length;
  $('same').hidden = n < 2; $('same').textContent = cat === s.category ? `Back to ${s.category}` : `More ${s.category} (${n})`; $('same').onclick = () => leaveTo(s.category);
  const all = Object.keys(CATS), nextCat = all[(all.indexOf(cat || s.category) + 1) % all.length];
  $('end').hidden = i < shown.length - 1; $('end-next').textContent = 'Next: ' + nextCat; $('end-next').onclick = () => leaveTo(nextCat);
  resetZoom();
  $('pos').textContent = $('bpos').textContent = `${i + 1} of ${shown.length}`;
  $('prev').disabled = $('bprev').disabled = i <= 0; $('next').disabled = $('bnext').disabled = i >= shown.length - 1;
  document.title = s.headline + ' · Ominous Archives';
  if (!view.open) { view.showModal(); document.body.style.overflow = 'hidden'; ($('close').offsetParent || $('close').getClientRects().length ? $('close') : $('bclose')).focus({ preventScroll: true }); }
  view.scrollTop = 0; view.querySelector('.info').scrollTop = 0;
  for (const n of [shown[i + 1], shown[i - 1]]) if (n) new Image().src = `img/l/${id3(n.rank)}.webp`;
}
function step(d) { const n = shown[shown.indexOf(current) + d]; if (n) { history.replaceState(null, '', '#sign/' + n.rank); show(n); } }
function close() {
  if (openedHere) history.back();
  else { history.replaceState(null, '', cat ? '#' + slug(cat) : location.pathname + location.search); route(); }
}
$('prev').onclick = $('bprev').onclick = () => step(-1); $('next').onclick = $('bnext').onclick = () => step(1); $('close').onclick = $('bclose').onclick = close;
function leaveTo(c) {
  if (c === cat) { close(); return; }
  history.replaceState(null, '', hashFor(c)); current = null; route(); $('list-head').scrollIntoView({ block: 'start' });
}
$('more').onclick = () => { const open = $('says').classList.toggle('clamped') === false; $('more').setAttribute('aria-expanded', open); $('more').textContent = open ? 'Show less' : 'Read the full sign'; };
view.addEventListener('cancel', e => { e.preventDefault(); close(); });
addEventListener('keydown', e => { if (!view.open || e.altKey || e.metaKey || e.ctrlKey) return; if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
$('stage').onclick = e => { if (e.target === $('stage') && getComputedStyle(view).display === 'grid') close(); };

/* zoom: tap or click to zoom, pinch and drag; swipe changes sign when not zoomed */
let zoom = 1, zx = 0, zy = 0, start = null, moved = false;
const fingers = new Map(), photo = $('photo');
function paint() {
  const st = $('stage').getBoundingClientRect(), mx = Math.max(0, (photo.offsetWidth * zoom - st.width) / 2), my = Math.max(0, (photo.offsetHeight * zoom - st.height) / 2);
  zx = Math.max(-mx, Math.min(mx, zx)); zy = Math.max(-my, Math.min(my, zy));
  photo.style.transform = zoom === 1 ? '' : `translate(${zx}px, ${zy}px) scale(${zoom})`;
  view.classList.toggle('zoomed', zoom > 1);
}
function resetZoom() { zoom = 1; zx = zy = 0; fingers.clear(); start = null; paint(); }
function zoomAt(x, y, z) {
  const st = $('stage').getBoundingClientRect(), cx = x - st.left - st.width / 2, cy = y - st.top - st.height / 2;
  z = Math.max(1, Math.min(5, z)); zx = cx - (cx - zx) * z / zoom; zy = cy - (cy - zy) * z / zoom; zoom = z; if (z === 1) zx = zy = 0; paint();
}
const span = () => { const [a, b] = [...fingers.values()]; return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
$('stage').addEventListener('pointerdown', e => {
  if (e.target.closest('.nav') || e.button) return;
  if (!fingers.size) { moved = false; start = { x: e.clientX, y: e.clientY, onPhoto: e.target === photo }; }
  fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (fingers.size === 2) { moved = true; start.pinch = { ...span(), zoom }; }
  if (e.target === photo) photo.setPointerCapture?.(e.pointerId);
});
$('stage').addEventListener('pointermove', e => {
  const f = fingers.get(e.pointerId); if (!f || !start) return;
  const dx = e.clientX - f.x, dy = e.clientY - f.y; f.x = e.clientX; f.y = e.clientY;
  if (Math.hypot(f.x - start.x, f.y - start.y) > 10) moved = true;
  if (fingers.size === 2 && start.pinch) { const s = span(); zoomAt(s.x, s.y, start.pinch.zoom * s.d / start.pinch.d); }
  else if (zoom > 1 && fingers.size === 1) { zx += dx; zy += dy; paint(); }
});
function lift(e, cancelled) {
  if (!fingers.delete(e.pointerId) || fingers.size || !start) return;
  const s = start, dx = e.clientX - s.x, dy = e.clientY - s.y; start = null;
  if (s.pinch) { if (zoom < 1.15) resetZoom(); return; }
  if (!cancelled && !moved && s.onPhoto) { if (zoom > 1) resetZoom(); else zoomAt(e.clientX, e.clientY, 2.5); return; }
  if (!cancelled && zoom === 1 && e.pointerType !== 'mouse' && Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) step(dx < 0 ? 1 : -1);
}
$('stage').addEventListener('pointerup', e => lift(e)); $('stage').addEventListener('pointercancel', e => lift(e, true));

const canShare = !!navigator.share && matchMedia('(pointer: coarse)').matches;
$('copy').onclick = async () => {
  if (canShare) { try { await navigator.share({ title: current.headline, url: location.href }); } catch {} return; }
  try { await navigator.clipboard.writeText(location.href); $('copy').textContent = 'Copied'; } catch { $('copy').textContent = 'Copy failed'; }
};

/* ---------- routing: #sign/3, #drowning, #about ---------- */
let scrollBefore = 0, aboutFrom = 0, lastY = 0, booted = false;
function route() {
  const h = location.hash.slice(1);
  const m = h.match(/^sign\/(\d+)$/), s = m && signs[m[1] - 1];
  if (s) {
    openedHere = booted && !view.open ? true : booted && openedHere;
    if (!view.open) scrollBefore = scrollY;
    $('archive').hidden = false; $('about-page').hidden = true;
    if (!shown.includes(s)) { cat = ''; apply(); }
    show(s); return;
  }
  if (view.open) {
    const from = current; view.close(); document.body.style.overflow = '';
    current = null; openedHere = false;
    const want = h === 'about' || !from ? null : cards.get(from.rank)?.firstChild;
    if (want) { scrollTo(0, scrollBefore); want.focus({ preventScroll: true }); const r = want.getBoundingClientRect(); if (r.bottom < 100 || r.top > innerHeight) want.scrollIntoView({ block: 'center' }); }
  }
  document.title = h === 'about' ? 'About · Ominous Archives' : bySlug[h] ? bySlug[h] + ' · Ominous Archives' : 'Ominous Archives';
  const about = h === 'about', was = !$('about-page').hidden;
  closeMenu();
  document.body.classList.toggle('on-about', about);
  if (about && !was) aboutFrom = lastY;
  $('about-page').hidden = !about; $('archive').hidden = about;
  $('about-link').textContent = about ? '← Back to signs' : 'About'; $('about-link').href = about ? '#' : '#about';
  if (about) { syncDD(); setLights(false); scrollTo(0, 0); $('about-page').querySelector('h1').focus({ preventScroll: true }); return; }
  const next = bySlug[h] || '';
  const changed = next !== cat || !booted;
  if (changed) { cat = next; apply(); }
  if (was) { layout(); scrollTo(0, aboutFrom); }
  else if (changed && booted) toResults();
  syncDD();
}
addEventListener('scroll', () => { if (!$('archive').hidden && !location.hash.startsWith('#about')) lastY = scrollY; }, { passive: true });
addEventListener('popstate', route);
$('skip').onclick = e => { e.preventDefault(); (grid.querySelector('.card') || grid).focus(); };
document.querySelector('.brand').onclick = e => { e.preventDefault(); go(''); scrollTo(0, 0); };
$('back').onclick = $('about-link').onclick = e => { if ($('about-page').hidden) return; e.preventDefault(); go(cat ? slug(cat) : ''); };

/* ---------- lights off ---------- */
function setLights(off) { document.documentElement.classList.toggle('lights-off', off); $('lights').setAttribute('aria-pressed', off); $('lights').textContent = off ? 'Lights on' : 'Lights off'; }
$('lights').onclick = () => { const off = $('lights').getAttribute('aria-pressed') !== 'true'; if (off && !$('about-page').hidden) go(cat ? slug(cat) : ''); setLights(off); };
const aim = (x, y) => { $('dark').style.setProperty('--x', x + 'px'); $('dark').style.setProperty('--y', y + 'px'); };
addEventListener('pointermove', e => aim(e.clientX, e.clientY), { passive: true });
addEventListener('touchstart', e => aim(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
addEventListener('touchmove', e => aim(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
addEventListener('focusin', e => { if (e.target.matches('.card:focus-visible')) { const r = e.target.getBoundingClientRect(); aim(r.left + r.width / 2, r.top + r.height / 2); } });
addEventListener('keydown', e => { if (e.key === 'Escape' && !view.open) setLights(false); });

const phone = matchMedia('(max-width: 620px), (max-width: 860px) and (orientation: portrait), (max-height: 520px)');
phone.addEventListener('change', () => { if (phone.matches) setLights(false); $('quick').inert = !phone.matches && !document.body.classList.contains('stuck'); closeMenu(); syncDD(); layout(); });
/* ---------- quick filters ---------- */
new IntersectionObserver(([e]) => { const on = !e.isIntersecting && e.boundingClientRect.top < 130 && !$('archive').hidden; document.body.classList.toggle('stuck', on); $('quick').inert = !on && !phone.matches; if (!on) hideTip(); }, { rootMargin: '-130px 0px 0px' }).observe($('cats'));
$('show-all').onclick = () => { go(''); toResults(); };
/* phones: once the icon row has scrolled away, the header offers the same filters as a dropdown */
const dd = $('dd'), menu = $('dd-menu');
function syncDD() {
  const on = phone.matches && !$('archive').hidden && $('quick').getBoundingClientRect().bottom <= 48;
  if (on !== document.body.classList.contains('dd-on')) { document.body.classList.toggle('dd-on', on); if (!on) closeMenu(); }
}
addEventListener('scroll', hideTip, { passive: true });
addEventListener('scroll', syncDD, { passive: true });
function closeMenu(refocus) { if (menu.hidden) return; menu.hidden = true; dd.setAttribute('aria-expanded', false); if (refocus) dd.focus(); }
dd.onclick = () => {
  if (!menu.hidden) { closeMenu(); return; }
  menu.hidden = false; dd.setAttribute('aria-expanded', true); menu.scrollTop = 0;
  menu.querySelector('[aria-pressed=true], button').focus({ preventScroll: true });
};
addEventListener('pointerdown', e => { if (!menu.hidden && !menu.contains(e.target) && !dd.contains(e.target)) closeMenu(); });
menu.addEventListener('focusout', e => { if (e.relatedTarget && !menu.contains(e.relatedTarget) && e.relatedTarget !== dd) closeMenu(); });
addEventListener('keydown', e => {
  if (menu.hidden) return;
  if (e.key === 'Escape') { closeMenu(true); return; }
  const d = { ArrowDown: 1, ArrowUp: -1 }[e.key]; if (!d) return;
  e.preventDefault(); const b = [...menu.children], n = b.indexOf(document.activeElement);
  b[(n + d + b.length) % b.length].focus();
});

/* ---------- start ---------- */
let w = 0; new ResizeObserver(() => { if (grid.clientWidth !== w) { w = grid.clientWidth; layout(); } }).observe(grid);
fetch('signs.json?v=4').then(r => { if (!r.ok) throw r; return r.json(); }).then(data => {
  signs = data;
  buildCards(); buildCats(); apply(); route(); booted = true;
  document.fonts?.ready.then(layout);
}).catch(() => { $('empty').textContent = "The signs didn't load. Try refreshing."; $('empty').hidden = false; });
