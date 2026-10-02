/* The Vault — v2 "The Real Vault".
   Screens: door (landing) → phone → combo (turn the dial to the 3 numbers) → the door opens → inside (member home).
   Everything here is a front-end prototype: any number and any combination open the vault. */
(function () {
'use strict';

var T = {
en: {
langBtn: 'فا', sound: 'Sound', close: 'Close',
eyebrow: 'Private members’ club · Tehran', title: 'Where value is kept.', spin: 'Turn the dial',
members: 'Members — open the vault', request: 'Request an introduction',
loginTitle: 'Members', loginBody: 'Enter your mobile number. We will send you a combination of three numbers.',
mobile: 'Mobile number', send: 'Send my combination',
comboEy: 'Your combination', comboBody: 'Turn the dial to each number in your message, then let go.',
typeInstead: 'Type the numbers instead', changeNum: 'Change number', open: 'Open',
needPhone: 'Enter your mobile number first.', sent: 'Your combination is on its way.',
memberNo: 'Member Nº 001', morning: 'Good morning.', afternoon: 'Good afternoon.', evening: 'Good evening.',
nextK: 'Your next visit', nextV: 'Tonight · The lounge · 20:30', lock: 'Lock the vault',
boxes: [['Reserve', 'A table, a room'], ['Events', 'Three this season'], ['Concierge', 'Anything, tonight'], ['Account', 'Balance and guests']],
rooms: [['The lounge', 'The heart of the club'], ['Dining room', 'One room, one service'], ['Sushi counter', 'Eight seats'], ['The terrace', 'Open air, dinner served']],
days: ['Tonight', 'Tomorrow', 'This week'], times: ['19:30', '20:30', '21:30', '22:30'],
day: 'Day', time: 'Time', room: 'Room', hold: 'Hold the table', held: 'Your table is held.',
events: [['24', 'Contemporary art preview', 'Gallery Hall'], ['08', 'Design and architecture table', 'Members’ Studio'], ['21', 'Collectors’ brunch', 'Chamber Lounge']],
going: 'Going', reply: 'Reply', replied: 'Your seat is held.',
about: 'It is about', topics: ['A table elsewhere', 'Car and driver', 'Flowers or a gift', 'Tickets', 'Something else'],
tell: 'For whom, when, and anything we should know', sendC: 'Send to the concierge', sentC: 'The concierge has it. You will hear back tonight.',
balance: 'Charge balance', tapShow: 'Tap to show', balV: '1,250,000,000', balNote: 'Shown here only. Never spoken in the house.',
acc: [['Guests', 'Name the people coming with you'], ['Statement', 'Every visit, listed'], ['House rules', 'Six short rules']],
soon: 'Opens in the full app.', locked: 'The vault is locked.'
},
fa: {
langBtn: 'EN', sound: 'صدا', close: 'بستن',
eyebrow: 'باشگاه خصوصی اعضا · تهران', title: 'جایی که ارزش نگه داشته می‌شود.', spin: 'قفل را بچرخانید',
members: 'اعضا — باز کردن گاوصندوق', request: 'درخواست معرفی',
loginTitle: 'ورود اعضا', loginBody: 'شمارهٔ موبایل خود را وارد کنید. یک رمز سه‌عددی برایتان می‌فرستیم.',
mobile: 'شمارهٔ موبایل', send: 'رمزم را بفرستید',
comboEy: 'رمز شما', comboBody: 'قفل را روی هر عدد پیام بچرخانید و رها کنید.',
typeInstead: 'تایپ عددها', changeNum: 'تغییر شماره', open: 'باز کن',
needPhone: 'اول شمارهٔ موبایل را وارد کنید.', sent: 'رمز شما فرستاده شد.',
memberNo: 'عضو شمارهٔ ۰۰۱', morning: 'صبح بخیر.', afternoon: 'عصر بخیر.', evening: 'شب بخیر.',
nextK: 'حضور بعدی شما', nextV: 'امشب · لانژ · ۲۰:۳۰', lock: 'قفل کردن گاوصندوق',
boxes: [['رزرو', 'یک میز، یک فضا'], ['رویدادها', 'سه رویداد این فصل'], ['کانسیرژ', 'هر چه بخواهید، همین امشب'], ['حساب', 'مانده و مهمان‌ها']],
rooms: [['لانژ', 'قلب باشگاه'], ['سالن غذاخوری', 'یک سالن، یک سرویس'], ['پیشخوان سوشی', 'هشت صندلی'], ['تراس', 'فضای باز، با شام']],
days: ['امشب', 'فردا', 'همین هفته'], times: ['۱۹:۳۰', '۲۰:۳۰', '۲۱:۳۰', '۲۲:۳۰'],
day: 'روز', time: 'ساعت', room: 'فضا', hold: 'نگه داشتن میز', held: 'میز شما نگه داشته شد.',
events: [['۲۴', 'پیش‌نمایش هنر معاصر', 'تالار گالری'], ['۰۸', 'میز طراحی و معماری', 'استودیوی اعضا'], ['۲۱', 'برانچ مجموعه‌داران', 'لانژ چمبر']],
going: 'می‌آیم', reply: 'پاسخ', replied: 'جای شما نگه داشته شد.',
about: 'دربارهٔ', topics: ['میز در جای دیگر', 'ماشین و راننده', 'گل یا هدیه', 'بلیت', 'چیز دیگر'],
tell: 'برای چه کسی، چه زمانی، و هر چه باید بدانیم', sendC: 'ارسال به کانسیرژ', sentC: 'کانسیرژ پیام شما را دارد. همین امشب پاسخ می‌گیرید.',
balance: 'ماندهٔ شارژ', tapShow: 'برای دیدن بزنید', balV: '۱٬۲۵۰٬۰۰۰٬۰۰۰', balNote: 'فقط همین‌جا نمایش داده می‌شود و در خانه هرگز گفته نمی‌شود.',
acc: [['مهمان‌ها', 'نام همراهان خود را بدهید'], ['صورت‌حساب', 'فهرست همهٔ حضورها'], ['قوانین خانه', 'شش قانون کوتاه']],
soon: 'در نسخهٔ کامل باز می‌شود.', locked: 'گاوصندوق قفل شد.'
}
};
var COUNTRIES = [['Iran', 'ایران', '+98'], ['UAE', 'امارات', '+971'], ['Turkey', 'ترکیه', '+90'], ['United Kingdom', 'بریتانیا', '+44'], ['Germany', 'آلمان', '+49'], ['Canada', 'کانادا', '+1']];

var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var app = $('#app'), dial = $('#dial'), door = $('#door'), card = $('#card');
var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
var wait = function (ms) { return new Promise(function (r) { setTimeout(r, calm ? 0 : ms); }); };

var S = { lang: store.get('vault.lang') || 'en', sound: store.get('vault.sound') !== 'off', screen: 'door', slots: [], busy: false, cc: 0 };
var t = function () { return T[S.lang]; };

/* ---------- sound: synthesised, no files ---------- */
var AC = null, NOISE = null;
function audio() {
  if (!S.sound) return null;
  if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C();
    NOISE = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate); var d = NOISE.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function noise(ac, at, dur, type, freq, q, vol) {
  var s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = NOISE; f.type = type; f.frequency.value = freq; f.Q.value = q;
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + Math.min(0.004, dur / 3)); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  s.connect(f); f.connect(g); g.connect(ac.destination); s.start(at, Math.random()); s.stop(at + dur + 0.02);
}
function tone(ac, at, f0, f1, dur, vol) {
  var o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(f1, at + dur);
  g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g); g.connect(ac.destination); o.start(at); o.stop(at + dur + 0.02);
}
var SFX = {
  tick: function () { var ac = audio(); if (!ac) return; noise(ac, ac.currentTime, 0.014, 'bandpass', 2600 + Math.random() * 900, 4, 0.22); },
  set: function () { var ac = audio(); if (!ac) return; var n = ac.currentTime; noise(ac, n, 0.03, 'bandpass', 1800, 2, 0.35); tone(ac, n, 190, 80, 0.16, 0.35); },
  bolts: function () { var ac = audio(); if (!ac) return; var n = ac.currentTime; for (var i = 0; i < 4; i++) { noise(ac, n + i * 0.09, 0.05, 'lowpass', 1400, 1, 0.3); tone(ac, n + i * 0.09, 120, 55, 0.12, 0.3); } },
  door: function () { var ac = audio(); if (!ac) return; var n = ac.currentTime; noise(ac, n, 1.8, 'lowpass', 260, 0.7, 0.3); tone(ac, n, 62, 38, 1.6, 0.18); },
  shut: function () { var ac = audio(); if (!ac) return; var n = ac.currentTime; tone(ac, n, 90, 35, 0.5, 0.6); noise(ac, n, 0.25, 'lowpass', 500, 1, 0.5); }
};

/* ---------- haptics: Android vibrate; iOS 18+ via the native switch control ---------- */
var hsw = document.createElement('label');
hsw.setAttribute('aria-hidden', 'true'); hsw.style.cssText = 'position:fixed;left:-99px;top:0;width:1px;height:1px;overflow:hidden';
hsw.innerHTML = '<input type="checkbox" switch tabindex="-1">'; document.body.appendChild(hsw);
var lastBuzz = 0;
function buzz(ms) {
  var now = performance.now(); if (now - lastBuzz < 45) return; lastBuzz = now;
  if (navigator.vibrate) { navigator.vibrate(ms || 6); } else { hsw.click(); }
}

/* ---------- toast ---------- */
var toastT;
function toast(msg) { var el = $('.toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2600); }

/* ---------- build the door ---------- */
(function build() {
  var face = $('.door-face');
  var sheen = document.createElement('div'); sheen.className = 'sheen'; face.insertBefore(sheen, face.firstChild);
  var bolts = $('.bolts');
  for (var i = 0; i < 12; i++) { var b = document.createElement('span'); b.className = 'bolt'; b.style.setProperty('--a', (i * 30 + 15) + 'deg'); b.style.setProperty('--i', i); bolts.appendChild(b); }
  var idx = document.createElement('div'); idx.className = 'index'; face.appendChild(idx);
  var depth = $('.door-depth');
  for (var k = 1; k <= 9; k++) { var l = document.createElement('i'); l.style.transform = 'translateZ(' + (-k * 3.2) + 'px)'; depth.appendChild(l); }
  var g = $('#dialFace'), svg = '';
  for (var n = 0; n < 100; n++) {
    var a = n * 3.6, cls = n % 10 === 0 ? 'm10' : (n % 5 === 0 ? 'm5' : ''), len = n % 10 === 0 ? 11 : (n % 5 === 0 ? 8 : 5);
    svg += '<line class="' + cls + '" x1="100" y1="4" x2="100" y2="' + (4 + len) + '" transform="rotate(' + a + ' 100 100)"/>';
    if (n % 10 === 0) svg += '<text x="100" y="27" transform="rotate(' + a + ' 100 100)">' + n + '</text>';
  }
  g.innerHTML = svg;
})();

/* ---------- the dial ---------- */
var rot = 0, dragging = false, prevA = 0, lastStep = 0, lockT = null;
function valueAt(r) { return ((Math.round(-r / 3.6) % 100) + 100) % 100; }
function pad(n) { return (n < 10 ? '0' : '') + n; }
function paint() {
  dial.style.setProperty('--rot', rot + 'deg');
  var v = valueAt(rot); dial.setAttribute('aria-valuenow', v);
  if (S.screen === 'combo') { var cur = $$('.slot')[S.slots.length]; if (cur) cur.textContent = pad(v); }
}
function angle(e) { var r = dial.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; }
function stepTo(newRot) {
  var s = Math.round(newRot / 3.6);
  if (s !== lastStep) { SFX.tick(); buzz(5); lastStep = s; }
  rot = newRot; paint();
}
dial.addEventListener('pointerdown', function (e) {
  if (S.busy) return;
  audio(); dragging = true; prevA = angle(e); clearTimeout(lockT);
  dial.classList.remove('snap'); dial.setPointerCapture(e.pointerId);
});
dial.addEventListener('pointermove', function (e) {
  if (!dragging) return;
  var a = angle(e), d = a - prevA; if (d > 180) d -= 360; if (d < -180) d += 360; prevA = a;
  stepTo(rot + d);
});
function release() {
  if (!dragging) return; dragging = false;
  dial.classList.add('snap'); rot = Math.round(rot / 3.6) * 3.6; paint();
  if (S.screen === 'combo') { lockT = setTimeout(setNumber, 520); }
}
dial.addEventListener('pointerup', release);
dial.addEventListener('pointercancel', release);
dial.addEventListener('keydown', function (e) {
  if (S.busy) return;
  var k = e.key;
  if (k === 'ArrowRight' || k === 'ArrowUp') { e.preventDefault(); dial.classList.add('snap'); stepTo(rot - 3.6); }
  else if (k === 'ArrowLeft' || k === 'ArrowDown') { e.preventDefault(); dial.classList.add('snap'); stepTo(rot + 3.6); }
  else if ((k === 'Enter' || k === ' ') && S.screen === 'combo') { e.preventDefault(); setNumber(); }
});
function setNumber() {
  if (S.screen !== 'combo' || S.slots.length >= 3) return;
  var v = valueAt(rot), slots = $$('.slot');
  S.slots.push(v); slots[S.slots.length - 1].textContent = pad(v);
  slots[S.slots.length - 1].classList.remove('cur'); slots[S.slots.length - 1].classList.add('set');
  SFX.set(); buzz(14);
  if (S.slots.length < 3) { slots[S.slots.length].classList.add('cur'); slots[S.slots.length].textContent = pad(v); }
  else { unlock(); }
}
function resetSlots() {
  S.slots = [];
  $$('.slot').forEach(function (s, i) { s.className = 'slot' + (i === 0 ? ' cur' : ''); s.textContent = i === 0 ? pad(valueAt(rot)) : ''; });
}

/* ---------- open and close the vault ---------- */
function unlock() {
  S.busy = true; dial.classList.remove('live');
  wait(380).then(function () { SFX.bolts(); buzz(30); door.classList.add('unbolted'); return wait(1050); })
  .then(function () { SFX.door(); app.classList.add('opening'); return wait(1650); })
  .then(function () { app.classList.add('through'); return wait(420); })
  .then(function () {
    show('inside');
    return wait(1100);
  }).then(function () {
    app.classList.add('instant'); app.classList.remove('opening', 'through'); door.classList.remove('unbolted');
    void app.offsetWidth; app.classList.remove('instant'); S.busy = false;
  });
}
function lockVault() {
  if (S.busy) return; S.busy = true; closeSheet();
  app.classList.add('instant', 'opening'); door.classList.add('unbolted');
  show('door', true); void app.offsetWidth; app.classList.remove('instant');
  wait(700).then(function () { app.classList.remove('opening'); return wait(1700); })
  .then(function () { SFX.shut(); buzz(40); door.classList.remove('unbolted'); return wait(600); })
  .then(function () { S.busy = false; toast(t().locked); });
}

/* ---------- screens ---------- */
function show(s, noHistory) {
  S.screen = s; app.setAttribute('data-screen', s);
  dial.classList.toggle('live', s === 'combo');
  if (s === 'combo') { resetSlots(); $('.p-combo').classList.remove('typing'); $('.typed').hidden = true; }
  if (s === 'inside') { greet(); $('.inside-scroll').scrollTop = 0; }
  if (!noHistory) { try { history.pushState({ s: s }, ''); } catch (e) {} }
}
window.addEventListener('popstate', function (e) {
  var s = (e.state && e.state.s) || 'door';
  if (S.busy) return;
  if (app.classList.contains('sheet-open')) { closeSheet(true); return; }
  if (S.screen === 'inside') { lockVault(); return; }
  show(s === 'inside' ? 'door' : s, true);
});
try { history.replaceState({ s: 'door' }, ''); } catch (e) {}

function greet() { var h = new Date().getHours(); $('#greet').textContent = h < 12 ? t().morning : (h < 18 ? t().afternoon : t().evening); }

/* ---------- membership card: tilt with the phone, or the finger ---------- */
function tilt(rx, ry) {
  rx = Math.max(-13, Math.min(13, rx)); ry = Math.max(-16, Math.min(16, ry));
  card.style.setProperty('--rx', rx.toFixed(2) + 'deg'); card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
  card.style.setProperty('--gx', (50 + ry * 3).toFixed(1) + '%'); card.style.setProperty('--gy', (30 - rx * 3).toFixed(1) + '%');
}
var gyro = false;
function onOrient(e) { if (S.screen !== 'inside' || e.beta == null) return; gyro = true; card.classList.add('live'); tilt(-(e.beta - 45) * 0.35, e.gamma * 0.45); }
function wantMotion() {
  if (gyro || calm) return;
  var D = window.DeviceOrientationEvent;
  if (D && typeof D.requestPermission === 'function') { D.requestPermission().then(function (r) { if (r === 'granted') window.addEventListener('deviceorientation', onOrient); }).catch(function () {}); }
  else if (D) { window.addEventListener('deviceorientation', onOrient); }
}
card.addEventListener('pointerdown', wantMotion);
card.addEventListener('pointermove', function (e) {
  if (gyro || calm) return; var r = card.getBoundingClientRect();
  var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  card.classList.add('live'); tilt(-y * 22, x * 28);
});
card.addEventListener('pointerleave', function () { if (gyro) return; card.classList.remove('live'); tilt(0, 0); });
if (!calm && window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') window.addEventListener('deviceorientation', onOrient);

/* ---------- deposit boxes and their sheet ---------- */
var KEY = '<svg class="keyhole" viewBox="0 0 18 26" aria-hidden="true"><circle cx="9" cy="8" r="6" fill="#0b0a08" stroke="rgba(205,181,126,.55)"/><path d="M6 12h6l2 11H4z" fill="#0b0a08" stroke="rgba(205,181,126,.55)"/></svg>';
function buildBoxes() {
  $('#boxes').innerHTML = t().boxes.map(function (b, i) {
    return '<button type="button" class="box rise" style="--k:' + (i + 3) + '" data-box="' + i + '"><span class="plate">Nº 0' + (i + 1) + '</span>' + KEY + '<span><span class="box-t">' + b[0] + '</span><span class="box-d">' + b[1] + '</span></span></button>';
  }).join('');
}
function chips(list, on, group) { return '<div class="chips" data-group="' + group + '">' + list.map(function (c, i) { return '<button type="button" class="chip" aria-pressed="' + (i === on) + '">' + c + '</button>'; }).join('') + '</div>'; }
function label(x) { return '<span class="lab">' + x + '</span>'; }
function sheetHTML(i) {
  var L = t();
  if (i === 0) return label(L.room) + chips(L.rooms.map(function (r) { return r[0]; }), 0, 'room') + label(L.day) + chips(L.days, 0, 'day') + label(L.time) + chips(L.times, 1, 'time') + '<button type="button" class="btn gold" data-done="held">' + L.hold + '</button>';
  if (i === 1) return L.events.map(function (e, k) { return '<div class="row"><span class="k">' + e[0] + '</span><span style="flex:1"><b>' + e[1] + '</b><i>' + e[2] + '</i></span><button type="button" class="chip" data-rsvp aria-pressed="' + (k === 0) + '">' + (k === 0 ? L.going : L.reply) + '</button></div>'; }).join('');
  if (i === 2) return label(L.about) + chips(L.topics, 0, 'topic') + '<textarea class="inp ta" placeholder="' + L.tell + '"></textarea><button type="button" class="btn gold" data-done="sentC">' + L.sendC + '</button>';
  return '<div>' + label(L.balance) + '<button type="button" class="bal" data-bal aria-live="polite">•••• ••••</button><p class="mini">' + L.balNote + '</p></div>' + L.acc.map(function (r) { return '<button type="button" class="row" data-soon style="width:100%;border-left:0;border-right:0;border-top:0;background:none;text-align:start"><span><b>' + r[0] + '</b><i>' + r[1] + '</i></span><span aria-hidden="true" style="color:var(--gold-l)">' + '›' + '</span></button>'; }).join('');
}
var lastBox = null;
function openSheet(i) {
  var box = $('.box[data-box="' + i + '"]'); lastBox = box;
  if (box) { box.classList.add('pulled'); SFX.set(); buzz(10); }
  $('#sheetNo').textContent = 'Nº 0' + (i + 1); $('#sheetTitle').textContent = t().boxes[i][0]; $('#sheetBody').innerHTML = sheetHTML(i);
  setTimeout(function () { app.classList.add('sheet-open'); $('.sheet .x').focus({ preventScroll: true }); }, calm ? 0 : 160);
}
function closeSheet(fromHistory) {
  if (!app.classList.contains('sheet-open')) return;
  app.classList.remove('sheet-open'); $('.sheet').style.removeProperty('--drag');
  $$('.box.pulled').forEach(function (b) { b.classList.remove('pulled'); });
  if (lastBox) lastBox.focus({ preventScroll: true });
}
// drag the sheet down to close it
(function () {
  var head = $('.sheet-head'), sh = $('.sheet'), y0 = null, dy = 0;
  head.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; sh.classList.add('dragging'); head.setPointerCapture(e.pointerId); });
  head.addEventListener('pointermove', function (e) { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.setProperty('--drag', dy + 'px'); });
  var up = function () { if (y0 == null) return; y0 = null; sh.classList.remove('dragging'); if (dy > 90) closeSheet(); else sh.style.setProperty('--drag', '0px'); };
  head.addEventListener('pointerup', up); head.addEventListener('pointercancel', up);
})();

/* ---------- language ---------- */
function apply() {
  var L = t(), fa = S.lang === 'fa';
  app.setAttribute('dir', fa ? 'rtl' : 'ltr'); document.documentElement.lang = fa ? 'fa' : 'en';
  $$('[data-t]').forEach(function (el) { el.textContent = L[el.getAttribute('data-t')]; });
  $$('[data-t-aria]').forEach(function (el) { el.setAttribute('aria-label', L[el.getAttribute('data-t-aria')]); });
  $$('[data-href-fa]').forEach(function (el) { if (!el.dataset.hrefEn) el.dataset.hrefEn = el.getAttribute('href'); el.setAttribute('href', fa ? el.dataset.hrefFa : el.dataset.hrefEn); });
  $('.cc').innerHTML = COUNTRIES.map(function (c, i) { return '<option value="' + i + '"' + (i === S.cc ? ' selected' : '') + '>' + (fa ? c[1] : c[0]) + '  ⁦' + c[2] + '⁩</option>'; }).join('');
  buildBoxes(); greet();
  $$('.greet, .card-stage, .next, .lock').forEach(function (el, k) { el.classList.add('rise'); el.style.setProperty('--k', k < 3 ? k : 8); });
  $('.ibtn[data-act=sound]').setAttribute('aria-pressed', String(S.sound));
}

/* ---------- one click handler for everything ---------- */
app.addEventListener('click', function (e) {
  var el = e.target.closest('[data-act], [data-box], .chip, [data-done], [data-bal], [data-soon]'); if (!el) return;
  var act = el.getAttribute('data-act');
  if (act === 'home') { if (S.busy) return; if (S.screen === 'inside') { closeSheet(); $('.inside-scroll').scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); } else { show('door'); } return; }
  if (act === 'lang') { S.lang = S.lang === 'fa' ? 'en' : 'fa'; store.set('vault.lang', S.lang); apply(); if (S.screen === 'combo') resetSlots(); return; }
  if (act === 'sound') { S.sound = !S.sound; store.set('vault.sound', S.sound ? 'on' : 'off'); el.setAttribute('aria-pressed', String(S.sound)); if (S.sound) SFX.tick(); return; }
  if (act === 'login') { show('phone'); setTimeout(function () { $('.p-phone .inp').focus({ preventScroll: true }); }, calm ? 0 : 450); return; }
  if (act === 'send') { audio(); toast(t().sent); show('combo'); setTimeout(function () { dial.focus({ preventScroll: true }); }, 300); return; }
  if (act === 'typeInstead') { $('.p-combo').classList.add('typing'); $('.typed').hidden = false; $('.typed-in .inp').focus(); return; }
  if (act === 'typedOpen') { S.slots = [0, 0, 0]; unlock(); return; }
  if (act === 'lock') { lockVault(); return; }
  if (act === 'closeSheet') { closeSheet(); return; }
  if (el.hasAttribute('data-box')) { openSheet(Number(el.getAttribute('data-box'))); return; }
  if (el.hasAttribute('data-rsvp')) { var on = el.getAttribute('aria-pressed') !== 'true'; el.setAttribute('aria-pressed', String(on)); el.textContent = on ? t().going : t().reply; buzz(8); if (on) toast(t().replied); return; }
  if (el.classList.contains('chip')) { $$('.chip', el.parentNode).forEach(function (c) { c.setAttribute('aria-pressed', String(c === el)); }); buzz(6); return; }
  if (el.hasAttribute('data-done')) { closeSheet(); toast(t()[el.getAttribute('data-done')]); return; }
  if (el.hasAttribute('data-bal')) { var shown = el.dataset.on === '1'; el.dataset.on = shown ? '' : '1'; el.textContent = shown ? '•••• ••••' : t().balV; return; }
  if (el.hasAttribute('data-soon')) { toast(t().soon); return; }
});
$('.cc').addEventListener('change', function (e) { S.cc = Number(e.target.value); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
// typed combination: hop between the three boxes
$('.typed-in').addEventListener('input', function (e) {
  var el = e.target; el.value = el.value.replace(/\D/g, '').slice(0, 2);
  if (el.value.length === 2 && el.nextElementSibling) el.nextElementSibling.focus();
});
// keep the app hidden in the app switcher while inside (balance, card)
document.addEventListener('visibilitychange', function () { if (document.hidden) { var b = $('[data-bal]'); if (b && b.dataset.on) { b.dataset.on = ''; b.textContent = '•••• ••••'; } } });

// deep links for testing: ?screen=phone|combo|inside
var q = new URLSearchParams(location.search);
if (q.get('lang')) S.lang = q.get('lang') === 'fa' ? 'fa' : 'en';
apply();
var start = q.get('screen');
if (start === 'phone' || start === 'combo' || start === 'inside') show(start, true);
paint();
})();
