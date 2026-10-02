/* Tiny template runtime (no dependencies, no build step).
   - View: base class with state + setState (re-renders the whole screen).
   - mount(): reads the <template>, fills {{holes}}, handles <sc-if>/<sc-for>, wires onClick/onChange.
   This exists only so the design runs as-is in a browser. In production, port the markup in
   index.html to your own stack (React/Vue/Blade/...) and keep styles.css + assets. */
class View {
  constructor(props) { this.props = props || {}; this.state = null; this._render = null; }
  setState(patch) { this.state = Object.assign({}, this.state || {}, patch); if (this._render) this._render(); }
}

function savedLang() { try { return localStorage.getItem('vault.lang'); } catch (e) { return null; } }

function mount(ViewClass, templateEl, rootEl) {
  const params = new URLSearchParams(location.search);
  const extra = {}; params.forEach((v, k) => { extra[k] = v; });
  const view = new ViewClass(Object.assign(extra, { start: params.get('screen') || 'home', lang: params.get('lang') || savedLang() || 'en' }));

  const look = (path, scope) => {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    let v = scope;
    for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; }
    return v;
  };
  const fill = (str, scope) => {
    const whole = str.match(/^\s*\{\{([^}]*)\}\}\s*$/);
    if (whole) return look(whole[1], scope);
    return str.replace(/\{\{([^}]*)\}\}/g, (_, p) => { const v = look(p, scope); return v == null ? '' : v; });
  };
  const EVENTS = { onclick: 'click', onchange: 'input' };

  const build = (node, scope, out) => {
    for (const ch of Array.from(node.childNodes)) {
      if (ch.nodeType === 3) { out.appendChild(document.createTextNode(String(fill(ch.nodeValue, scope) ?? ''))); continue; }
      if (ch.nodeType !== 1) continue;
      const tag = ch.tagName.toLowerCase();
      if (tag === 'sc-if') { if (fill(ch.getAttribute('value'), scope)) build(ch, scope, out); continue; }
      if (tag === 'sc-for') {
        (fill(ch.getAttribute('list'), scope) || []).forEach((item, i) => {
          const inner = Object.assign({}, scope); inner[ch.getAttribute('as')] = item; inner.$index = i;
          build(ch, inner, out);
        });
        continue;
      }
      const el = document.createElement(tag);
      for (const a of Array.from(ch.attributes)) {
        if (a.name.startsWith('hint-')) continue;
        const v = fill(a.value, scope);
        const ev = EVENTS[a.name.toLowerCase()];
        if (ev) { if (typeof v === 'function') el.addEventListener(ev, v); continue; }
        if (v == null || typeof v === 'function') continue;
        el.setAttribute(a.name, String(v));
      }
      out.appendChild(el);
      build(ch, scope, el);
    }
  };

  // Scroll motion: sections rise in as they enter the screen, photos drift slightly (parallax).
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = (root, same) => {
    const sc = root.querySelector('.home');
    if (!sc || calm || !('IntersectionObserver' in window)) return;
    const items = sc.querySelectorAll('.mev > *, .sec > *:nth-child(n+2), .panel > *:nth-child(n+3), .foot > *');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { root: sc, threshold: 0.12 });
    let vh = sc.clientHeight;
    items.forEach((el) => {
      el.classList.add('rv');
      const r = el.getBoundingClientRect();
      if (same && r.top < vh && r.bottom > 0) el.classList.add('in', 'now'); else io.observe(el);
    });
    const imgs = sc.querySelectorAll('.photo img:not(.paint), .card img:not(.paint)');
    const drift = () => imgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const p = (r.top + r.height / 2) / vh - 0.5;
      img.style.transform = 'scale(1.14) translateY(' + (p * -9).toFixed(2) + '%)';
    });
    // "The Combination" only: the dial turns with the scroll and each photo opens like a door.
    const dial = sc.querySelector('.dial-hero img');
    const doors = root.querySelector('.sk-combo') ? sc.querySelectorAll('.photo, .card') : [];
    const turn = () => {
      if (dial) dial.style.rotate = (-sc.scrollTop * 0.16).toFixed(1) + 'deg';
      doors.forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--p', Math.max(0, Math.min(1, (vh - r.top) / (r.height * 0.9))).toFixed(3));
      });
    };
    sc.addEventListener('scroll', () => { drift(); turn(); }, { passive: true }); drift(); turn();
    window.addEventListener('resize', () => { vh = sc.clientHeight; drift(); turn(); items.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) el.classList.add('in'); }); });
  };

  let lastScreen = null;
  view._render = () => {
    // keep what the person typed and where they scrolled when the same screen re-renders
    const fields = Array.from(rootEl.querySelectorAll('input, textarea'));
    const saved = fields.map((f) => (f.type === 'checkbox' ? f.checked : f.value));
    const active = fields.indexOf(document.activeElement);
    const scroller = rootEl.querySelector('.vscroll');
    const scrollTop = scroller ? scroller.scrollTop : 0;

    const vals = view.renderVals();
    const screen = (view.state && view.state.screen) || view.props.start;
    document.documentElement.lang = vals.dir === 'rtl' ? 'fa' : 'en';
    const frag = document.createDocumentFragment();
    build(templateEl.content, vals, frag);
    rootEl.replaceChildren(frag);

    if (screen === lastScreen) {
      const now = Array.from(rootEl.querySelectorAll('input, textarea'));
      if (now.length === saved.length) {
        now.forEach((f, i) => { if (f.type === 'checkbox') f.checked = saved[i]; else f.value = saved[i]; });
        if (active > -1 && now[active]) now[active].focus();
      }
      const s2 = rootEl.querySelector('.vscroll');
      if (s2) s2.scrollTop = scrollTop;
    }
    rootEl.classList.toggle('still', screen === lastScreen);
    reveal(rootEl, screen === lastScreen);
    lastScreen = screen;
  };
  view._render();
  return view;
}
