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
  const extra = {}; params.forEach((v, k) => { if (['screen','pg','tab','sub','zone','done','slide','menu','lang','mode'].includes(k)) extra[k] = v; });
  const screens = ['home','s1','s2','s3','s4','s5','sent','login','otp','reset','pg','m'];
  if (!screens.includes(params.get('screen') || 'home')) params.set('screen', 'home');
  if (!['en','fa'].includes(params.get('lang') || savedLang() || 'en')) params.set('lang', 'en');
  const view = new ViewClass(Object.assign(extra, { start: params.get('screen') || 'home', lang: params.get('lang') || savedLang() || 'en' }));
  view.state = { screen: view.props.start, lang: view.props.lang, pg: extra.pg, tab: extra.tab || 'home', sub: extra.sub || '', zone: Number(extra.zone) || 0, mode: extra.mode || 'code' };
  if (!['home','reserve','events','concierge','account'].includes(view.state.tab)) view.state.tab = 'home';
  if (!Number.isInteger(view.state.zone) || view.state.zone < 0 || view.state.zone > 6) view.state.zone = 0;
  if (!['membership','events','experiences','gallery','restaurant','mevents','ev0','ev1','ev2','terms','forgot'].includes(view.state.pg)) view.state.pg = 'membership';
  view.fields = Object.create(null); // Personal demo input stays in memory, never in disk storage or the URL.
  const positions = new Map(), snapshots = new Map();
  let sequence = 0, restoring = false;
  const routeKey = () => [view.state.screen, view.state.screen === 'pg' ? view.state.pg : '', view.state.screen === 'm' ? view.state.tab : '', view.state.screen === 'm' ? view.state.sub : '', view.state.screen === 'm' ? view.state.zone : '', view.state.screen === 'login' ? view.state.mode : ''].join(':');
  const capture = () => rootEl.querySelectorAll('[data-field]').forEach(el => { view.fields[el.dataset.field] = el.type === 'checkbox' ? el.checked : el.value; });
  view.captureFields = capture;
  const writeHistory = (push) => {
    const id = ++sequence;
    snapshots.set(id, Object.assign({}, view.state));
    const url = new URL(location.href);
    ['screen','pg','tab','sub','zone','done','mode','menu','slide'].forEach(k => url.searchParams.delete(k));
    url.hash = '';
    url.searchParams.set('lang', view.state.lang);
    if (view.state.screen !== 'home') url.searchParams.set('screen', view.state.screen);
    if (view.state.screen === 'pg') url.searchParams.set('pg', view.state.pg);
    if (view.state.screen === 'm') {
      url.searchParams.set('tab', view.state.tab || 'home');
      if (view.state.sub) url.searchParams.set('sub', view.state.sub);
      if (view.state.sub === 'form') url.searchParams.set('zone', String(view.state.zone || 0));
      if (view.state.sub === 'done') url.searchParams.set('done', view.state.done || 'resv');
    }
    if (view.state.screen === 'login' && view.state.mode === 'pass') url.searchParams.set('mode', 'pass');
    try { history[push ? 'pushState' : 'replaceState']({ vault: id }, '', url); } catch (_) {}
  };
  const originalSetState = view.setState.bind(view);
  view.setState = patch => {
    capture();
    if (patch.lang && patch.lang !== view.state.lang) VaultDemo.convertBirthFields(view,patch.lang);
    const before = routeKey();
    const sc = rootEl.querySelector('.vscroll');
    if (sc) positions.set(before, sc.scrollTop);
    originalSetState(patch);
    if (!restoring) writeHistory(routeKey() !== before);
  };
  window.addEventListener('popstate', e => {
    const state = e.state && snapshots.get(e.state.vault);
    if (!state) return;
    const current = view.state;
    const sc = rootEl.querySelector('.vscroll');
    if (sc) positions.set(routeKey(), sc.scrollTop);
    capture(); restoring = true;
    // Keep ongoing demo results when moving back through the browser history.
    view.state = Object.assign({}, state, { lang: current.lang, resv: current.resv, reservation: current.reservation, rsvp: current.rsvp, menu: false });
    view._render(); restoring = false;
  });
  rootEl.addEventListener('input', e => {
    if (e.target.dataset.field) {
      if (e.target.inputMode === 'numeric' || e.target.type === 'tel') VaultDemo.normalizeInput(e.target, rootEl);
      capture();
      if (e.target.dataset.field.startsWith('birth')) view.fields.birthCalendar = view.state.lang;
      VaultDemo.clearFieldError(e.target);
      const counter = rootEl.querySelector('[data-counter="' + e.target.dataset.field + '"]');
      if (counter) { counter.textContent = e.target.value.length + '/600'; counter.classList.toggle('near-limit', e.target.value.length >= 550); }
    }
  }, true);
  rootEl.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (link) e.preventDefault();
  }, true);

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
  let cleanupMotion = () => {};
  const reveal = (root, same) => {
    cleanupMotion();
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
    const resized = () => { vh = sc.clientHeight; drift(); turn(); items.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) el.classList.add('in'); }); };
    window.addEventListener('resize', resized);
    cleanupMotion = () => { io.disconnect(); window.removeEventListener('resize', resized); };
  };

  let lastScreen = null, lastMenu = false;
  view._render = () => {
    const beforeKey = lastScreen;
    const active = document.activeElement;
    const activeField = active && active.dataset.field;
    const selection = active && typeof active.selectionStart === 'number' ? [active.selectionStart, active.selectionEnd] : null;
    capture();
    const vals = view.renderVals();
    const key = routeKey(), same = key === beforeKey;
    const scroller = rootEl.querySelector('.vscroll');
    if (same && scroller) positions.set(key, scroller.scrollTop);
    document.documentElement.lang = vals.dir === 'rtl' ? 'fa' : 'en';
    const frag = document.createDocumentFragment();
    build(templateEl.content, vals, frag);
    rootEl.replaceChildren(frag);
    rootEl.querySelectorAll('[data-field]').forEach(el => {
      const value = view.fields[el.dataset.field];
      if (value !== undefined) { if (el.type === 'checkbox') el.checked = value; else el.value = value; }
      el.id = 'field-' + el.dataset.field;
    });
    ['bio','why'].forEach(field => {
      const counter = rootEl.querySelector('[data-counter="' + field + '"]');
      if (counter) counter.textContent = (view.fields[field] || '').length + '/600';
    });
    if (same && activeField) {
      const now = rootEl.querySelector('[data-field="' + activeField + '"]');
      if (now) { now.focus({preventScroll:true}); if (selection) try { now.setSelectionRange(...selection); } catch (_) {} }
    }
    const sc = rootEl.querySelector('.vscroll');
    if (sc) sc.scrollTop = positions.get(key) || 0;
    rootEl.classList.toggle('still', same);
    reveal(rootEl, same);
    const heading = rootEl.querySelector('h1');
    if (heading) { heading.tabIndex = -1; document.title = heading.textContent + ' · The Vault'; }
    else document.title = 'The Vault — Members’ Club';
    if (!same && heading) heading.focus({preventScroll:true});
    const menu = rootEl.querySelector('.menu');
    if (menu && !lastMenu) menu.querySelector('button').focus();
    if (!menu && lastMenu) { const trigger = rootEl.querySelector('.menubtn'); if (trigger) trigger.focus(); }
    lastMenu = !!menu;
    lastScreen = key;
  };
  rootEl.addEventListener('keydown', e => {
    const menu = rootEl.querySelector('.menu');
    if (!menu) return;
    if (e.key === 'Escape') { e.preventDefault(); view.setState({menu:false}); }
    if (e.key === 'Tab') {
      const controls = Array.from(menu.querySelectorAll('button,[tabindex="0"],a'));
      const first = controls[0], last = controls[controls.length-1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  view._render();
  writeHistory(false);
  return view;
}
