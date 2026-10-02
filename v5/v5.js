/* The Vault — v5 «هر چه بخواهید» / "Ask for anything".
   Phase 1 prototype: the concierge is the hero. Three screens:
     #/         the key (real-time three.js, SVG fallback)
     #/ask      choose a request   (#/ask/<id> sets its options, buttons only)
     #/live     "it's being done": a code-driven motion sequence, then a live status card
   Vanilla ES module, no build. three.js is self-hosted (lib/) and loaded on demand.
   State: sessionStorage 'vault5'. Language: localStorage 'vault5.lang' (default fa). */

const V = '?v=8';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => RM.matches;
const store = {
  get(k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
  set(k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) { /* private mode */ } }
};

/* ================= language ================= */
let lang = store.get('vault5.lang') === 'en' ? 'en' : 'fa';
const fa = () => lang === 'fa';
const X = a => (Array.isArray(a) ? a[fa() ? 1 : 0] : a);
const FD = '۰۱۲۳۴۵۶۷۸۹';
const N = s => (fa() ? String(s).replace(/\d/g, d => FD[d]) : String(s));
const pad = n => String(n).padStart(2, '0');
const hm = d => N((fa() ? d.getHours() : pad(d.getHours())) + ':' + pad(d.getMinutes()));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dayFmt = (d, long) => {
  const o = long ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' };
  return N(new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', o).format(d));
};

const T = {
  home: ['The Vault, the key', 'والت، صفحهٔ کلید'], back: ['Back', 'بازگشت'], langTo: ['فارسی', 'English'], langBtn: ['فا', 'EN'],
  eyebrow: ['The Vault — Concierge', 'والت — کانسیرژ'],
  title: ['Ask for anything', 'هر چه بخواهید'],
  lede: ['Day or night. One touch, and the house arranges the rest.', 'شب یا روز. یک لمس، و باقی‌اش با خانه.'],
  ask: ['Ask the concierge', 'از کانسیرژ بخواهید'],
  hint: ['Drag to turn the key', 'برای چرخاندن کلید، بکشید'],
  keyAlt: ['A golden concierge key, slowly turning', 'کلید طلایی کانسیرژ که آرام می‌چرخد'],
  menuEy: ['The concierge', 'کانسیرژ'],
  menuT: ['What shall we arrange?', 'چه کاری برایتان انجام دهیم؟'],
  menuS: ['Choose one. There is nothing to type.', 'یکی را انتخاب کنید. چیزی برای نوشتن نیست.'],
  arrange: ['Arrange it', 'ترتیبش را بدهید'],
  note: ['Confirmed by the concierge within minutes, and charged to your account.', 'کانسیرژ در چند دقیقه تأیید می‌کند؛ هزینه به حساب شما.'],
  fewer: ['One fewer', 'یکی کمتر'], more: ['One more', 'یکی بیشتر'],
  liveEy: ['It’s being done', 'در حال انجام است'],
  skip: ['Skip', 'رد شدن'],
  done: ['Done', 'تمام'], other: ['Ask for something else', 'درخواستی دیگر'],
  steps: [['Received', 'دریافت شد'], ['Arranged', 'هماهنگ شد'], ['On its way', 'در راه'], ['Done', 'انجام شد']],
  active: ['Active request', 'درخواست فعال'],
  live: ['Live', 'زنده'],
  days: ['%1 days', '%1 روز'], day1: ['1 day', '۱ روز'],
  pickDay: ['Choose a day', 'یک روز انتخاب کنید'], pickTime: ['Choose a time', 'یک ساعت انتخاب کنید']
};

/* option labels */
const O = {
  now: ['Now', 'همین حالا'], in30: ['In 30 minutes', '۳۰ دقیقهٔ دیگر'], later: ['Pick a time', 'انتخاب ساعت'],
  tonight: ['Tonight', 'امشب'], tomorrow: ['Tomorrow', 'فردا'], pick: ['Pick a day', 'انتخاب روز'], today: ['Today', 'امروز'],
  thisweek: ['This week', 'همین هفته'], weekend: ['This weekend', 'آخر هفته'], nextweek: ['Next week', 'هفتهٔ بعد'],
  home: ['Home, Niavaran', 'خانه، نیاوران'], thr: ['Mehrabad Airport', 'فرودگاه مهرآباد'], ika: ['Imam Khomeini Airport', 'فرودگاه امام'], office: ['The office, Vanak', 'دفتر، ونک'],
  sedan: ['Sedan', 'سدان'], van: ['Van, with luggage', 'ون، با چمدان'],
  t2000: ['20:00', '۲۰:۰۰'], t2030: ['20:30', '۲۰:۳۰'], t2100: ['21:00', '۲۱:۰۰'], t2130: ['21:30', '۲۱:۳۰'],
  quiet: ['A quiet corner', 'گوشه‌ای آرام'], view: ['With a view', 'رو به شهر'],
  concert: ['Concert', 'کنسرت'], theatre: ['Theatre', 'تئاتر'],
  best: ['Best in the house', 'بهترین جای سالن'], aisle: ['On the aisle', 'کنار راهرو'],
  flowers: ['Flowers', 'گل'], gift: ['A gift', 'هدیه'], both: ['Both', 'هر دو'],
  bday: ['A birthday', 'تولد'], thanks: ['A thank-you', 'تشکر'], just: ['Just because', 'بی‌بهانه'],
  b2: ['About 2 million toman', 'حدود ۲ میلیون تومان'], b5: ['About 5 million toman', 'حدود ۵ میلیون تومان'], yours: ['Your choice', 'به انتخاب شما'],
  ist: ['Istanbul', 'استانبول'], dxb: ['Dubai', 'دبی'], kih: ['Kish Island', 'کیش'], cdg: ['Paris', 'پاریس'],
  hf: ['Hotel and flight', 'هتل و پرواز'], hotel: ['Hotel only', 'فقط هتل'],
  phone: ['Call my mobile', 'با موبایلم تماس بگیرید'], visit: ['Come to my table', 'سرِ میزم بیایید']
};

/* the six requests */
const REQS = [
  { id: 'car', img: '../v2/img/room-door.webp', fit: 'p-door',
    t: ['A car to the door', 'ماشین، دمِ در'], d: ['Or to the airport. Driver, plate and arrival, live.', 'یا تا فرودگاه. راننده، پلاک و زمان رسیدن، زنده.'],
    short: ['Car', 'ماشین'],
    g: [{ k: 'to', l: ['Where to', 'به کجا'], o: ['home', 'thr', 'ika', 'office'] },
        { k: 'when', l: ['When', 'کی'], o: ['now', 'in30', 'later'], pick: 'time' },
        { k: 'n', l: ['Passengers', 'چند نفر'], step: [1, 4, 1], u: [['passenger', 'passengers'], 'نفر'] },
        { k: 'kind', l: ['The car', 'خودرو'], o: ['sedan', 'van'] }] },
  { id: 'table', img: '../v3/img/cover-chef.webp', fit: 'p-chef',
    t: ['A table tonight', 'میزی برای امشب'], d: ['Anywhere in the city. The table you would want.', 'هر جای شهر؛ همان میزی که می‌خواهید.'],
    short: ['Table', 'میز'],
    g: [{ k: 'when', l: ['When', 'کی'], o: ['tonight', 'tomorrow', 'pick'], pick: 'day' },
        { k: 'time', l: ['At', 'ساعت'], o: ['t2000', 't2030', 't2100', 't2130'], def: 't2100' },
        { k: 'n', l: ['Guests, with you', 'چند نفر، با خودتان'], step: [1, 8, 2], u: [['guest', 'guests'], 'نفر'] },
        { k: 'mood', l: ['The table', 'میز'], o: ['quiet', 'view'] }] },
  { id: 'tickets', img: '../v3/img/conc-opera.webp', fit: 'p-opera',
    t: ['Concert or theatre', 'کنسرت یا تئاتر'], d: ['The seats worth having, delivered by hand.', 'صندلی‌هایی که ارزشش را دارند؛ با پیک به دستتان.'],
    short: ['Tickets', 'بلیت'],
    g: [{ k: 'kind', l: ['What', 'چه برنامه‌ای'], o: ['concert', 'theatre'] },
        { k: 'when', l: ['When', 'کی'], o: ['thisweek', 'weekend', 'pick'], pick: 'day' },
        { k: 'n', l: ['Seats', 'چند صندلی'], step: [1, 6, 2], u: [['seat', 'seats'], 'صندلی'] },
        { k: 'seat', l: ['Where', 'کجای سالن'], o: ['best', 'aisle'] }] },
  { id: 'flowers', img: null, fit: 'p-mark', mark: true,
    t: ['Flowers or a gift', 'گل یا هدیه'], d: ['Chosen, wrapped and delivered.', 'انتخاب، بسته‌بندی و تحویل.'],
    short: ['Flowers', 'گل'],
    g: [{ k: 'what', l: ['What', 'چه چیزی'], o: ['flowers', 'gift', 'both'] },
        { k: 'for', l: ['The occasion', 'به چه مناسبتی'], o: ['bday', 'thanks', 'just'] },
        { k: 'budget', l: ['Around', 'حدود هزینه'], o: ['b2', 'b5', 'yours'] },
        { k: 'when', l: ['When', 'کی'], o: ['today', 'tomorrow', 'pick'], pick: 'day' }] },
  { id: 'travel', img: null, fit: 'p-still',
    t: ['Travel', 'سفر'], d: ['Hotel and flight, arranged end to end.', 'هتل و پرواز، از اول تا آخر.'],
    short: ['Travel', 'سفر'],
    g: [{ k: 'to', l: ['Where', 'مقصد'], o: ['ist', 'dxb', 'kih', 'cdg'] },
        { k: 'when', l: ['When', 'کی'], o: ['thisweek', 'nextweek', 'pick'], pick: 'day' },
        { k: 'n', l: ['Travellers', 'چند نفر'], step: [1, 6, 2], u: [['traveller', 'travellers'], 'نفر'] },
        { k: 'what', l: ['Arrange', 'چه چیزهایی'], o: ['hf', 'hotel'] }] },
  { id: 'call', img: '../v3/img/ev-design.webp', fit: 'p-desk',
    t: ['Something else — call me', 'چیز دیگری؟ تماس بگیرید'], d: ['Say it in person. We will ring you.', 'حضوری بگویید؛ ما زنگ می‌زنیم.'],
    short: ['Call', 'تماس'],
    g: [{ k: 'when', l: ['When', 'کی'], o: ['now', 'in30', 'later'], pick: 'time' },
        { k: 'how', l: ['How', 'چطور'], o: ['phone', 'visit'] }] }
];
const REQ = id => REQS.find(r => r.id === id);
const HOW = { phone: ['On your mobile', 'روی موبایل شما'], visit: ['At your table', 'سرِ میز شما'] };

/* the people and places the house uses (fictional, for the prototype) */
const PEOPLE = {
  driver: ['Reza Karimi', 'رضا کریمی'], concierge: ['Leila', 'لیلا'], courier: ['Sina', 'سینا'],
  rest: ['Narenjestan', 'نارنجستان'],
  hall: { concert: ['Roudaki Hall', 'تالار رودکی'], theatre: ['Iranshahr Theatre', 'تماشاخانهٔ ایرانشهر'] },
  show: { concert: ['Tehran Symphony — Shostakovich', 'ارکستر سمفونیک تهران — شوستاکوویچ'], theatre: ['The Cherry Orchard', 'باغ آلبالو'] },
  code: { ist: 'IST', dxb: 'DXB', kih: 'KIH', cdg: 'CDG' },
  hotelName: { ist: ['Casa Lumen', 'کازا لومن'], dxb: ['Maison Sable', 'مزون سابل'], kih: ['Villa Nilou', 'ویلا نیلو'], cdg: ['Hôtel Ombrelle', 'هتل اومبرل'] },
  flight: { ist: 'TK 879', dxb: 'EK 972', kih: 'IR 342', cdg: 'IR 735' },
  mins: { home: 25, thr: 35, ika: 55, office: 15 }
};

/* ================= state ================= */
let S = (() => { try { return JSON.parse(store.get('vault5', 1)) || {}; } catch (e) { return {}; } })();
S.drafts = S.drafts || {};
const save = () => store.set('vault5', JSON.stringify(S), 1);

function draft(r) {
  const d = S.drafts[r.id] || (S.drafts[r.id] = {});
  r.g.forEach(g => {
    if (d[g.k] == null) d[g.k] = g.step ? g.step[2] : (g.def || g.o[0]);
  });
  return d;
}

/* time slots and days offered by the pickers */
function timeSlots() {
  const d = new Date(Date.now() + 60 * 60000); d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60);
  return [0, 1, 2, 3].map(i => { const x = new Date(d.getTime() + i * 30 * 60000); return pad(x.getHours()) + ':' + pad(x.getMinutes()); });
}
function daySlots() {
  const out = [], b = new Date(); b.setHours(12, 0, 0, 0);
  for (let i = 2; i < 9; i++) { const x = new Date(b.getTime() + i * 864e5); out.push(x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate())); }
  return out;
}
const isoDate = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); };
function optLabel(g, v, d) {
  if (g.step) {
    const u = g.u; const n = Number(v);
    return fa() ? N(n) + ' ' + u[1] : n + ' ' + (n === 1 ? u[0][0] : u[0][1]);
  }
  if (g.pick === 'day' && v === 'pick') return d[g.k + 'D'] ? dayFmt(isoDate(d[g.k + 'D']), true) : X(O.pick);
  if (g.pick === 'time' && v === 'later') return d[g.k + 'T'] ? N(d[g.k + 'T']) : X(O.later);
  return X(O[v]);
}
const summary = (r, d) => r.g.map(g => optLabel(g, d[g.k], d)).join(' — ');

/* when does the thing happen? returns epoch ms */
function targetTime(r, d) {
  const now = Date.now();
  const at = (date, h, m) => { const x = new Date(date); x.setHours(h, m, 0, 0); return x.getTime(); };
  const dayOf = (v, key) => {
    const b = new Date();
    if (v === 'tonight' || v === 'today') return b;
    if (v === 'tomorrow') return new Date(b.getTime() + 864e5);
    if (v === 'thisweek') return new Date(b.getTime() + 3 * 864e5);
    if (v === 'weekend') { const x = new Date(b); const add = (4 - x.getDay() + 7) % 7 || 7; return new Date(b.getTime() + add * 864e5); }
    if (v === 'nextweek') return new Date(b.getTime() + 8 * 864e5);
    return d[key] ? isoDate(d[key]) : new Date(b.getTime() + 2 * 864e5);
  };
  const clock = (t, base) => { const [h, m] = t.split(':').map(Number); let x = at(base || new Date(), h, m); if (x < now + 60000) x += 864e5; return x; };
  switch (r.id) {
    case 'car': case 'call':
      if (d.when === 'now') return now + (r.id === 'car' ? 180 : 60) * 1000;
      if (d.when === 'in30') return now + 30 * 60000;
      return clock(d.whenT || timeSlots()[0]);
    case 'table': {
      const base = dayOf(d.when, 'whenD');
      let x = at(base, +d.time.slice(1, 3), +d.time.slice(3, 5));
      if (x < now) x = now + 20 * 60000;
      return x;
    }
    case 'tickets': return at(dayOf(d.when, 'whenD'), 19, 30);
    case 'flowers': return d.when === 'today' ? now + 170 * 1000 : at(dayOf(d.when, 'whenD'), 11, 0);
    case 'travel': return at(dayOf(d.when, 'whenD'), 8, 40);
  }
  return now + 120000;
}

/* per-request live copy */
const LIVE = {
  car: { cd: ['At the door in', 'تا دمِ در'], after: ['At the door', 'دمِ در است'], onCd: true,
    head: [['Reza is bringing the car round.', 'رضا ماشین را دمِ در می‌آورد.'], ['The car is at the door.', 'ماشین دمِ در است.']],
    sub: [['The desk has it', 'به میز کانسیرژ رسید'], ['Reza and the car', 'رضا و ماشین'], ['Leaving the garage', 'از پارکینگ بیرون آمد'], ['At the door', 'دمِ در']],
    caps: [[0, ['Your request has reached the desk.', 'درخواست شما به میز کانسیرژ رسید.']], [2.4, ['The route is set.', 'مسیر مشخص شد.']], [4.4, ['Reza is bringing the car round.', 'رضا ماشین را می‌آورد.']]] },
  table: { cd: ['Your table in', 'تا وقت میز'], after: ['Seated', 'سرِ میز'],
    head: [['Your table is being set.', 'میزتان چیده می‌شود.'], ['Your table is set.', 'میزتان آماده است.']],
    sub: [['The desk has it', 'به میز کانسیرژ رسید'], ['Narenjestan, held', 'نارنجستان، نگه داشته شد'], ['Your name is on the card', 'نامتان روی کارت است'], ['Held under your name', 'به نام شما نگه داشته شد']],
    caps: [[0, ['Narenjestan has your table.', 'نارنجستان میزتان را نگه داشت.']], [2.6, ['Your name is on the card.', 'نامتان روی کارت است.']], [4.3, ['The candle is lit.', 'شمع روشن شد.']]] },
  tickets: { cd: ['Curtain up in', 'تا شروع برنامه'], after: ['Curtain up', 'برنامه شروع شد'],
    head: [['Your seats are on their way.', 'بلیت‌هایتان در راه است.'], ['Your tickets are with you.', 'بلیت‌ها به دستتان رسید.']],
    sub: [['The desk has it', 'به میز کانسیرژ رسید'], ['Seats held', 'صندلی‌ها نگه داشته شد'], ['Sina has them', 'پیک، سینا، آن‌ها را دارد'], ['In your hands', 'به دستتان رسید']],
    caps: [[0, ['The seats are held.', 'صندلی‌ها نگه داشته شد.']], [1.2, ['Printing your tickets.', 'بلیت‌ها چاپ می‌شود.']], [4, ['Torn and kept for you.', 'جدا شد و برایتان نگه داشته شد.']]] },
  flowers: { cd: ['Delivered in', 'تا تحویل'], after: ['Delivered', 'تحویل شد'], onCd: true,
    head: [['Your flowers are being arranged.', 'گل‌هایتان آماده می‌شود.'], ['Delivered, by hand.', 'با دست تحویل داده شد.']],
    sub: [['The desk has it', 'به میز کانسیرژ رسید'], ['White peonies, by hand', 'صدتومانی سفید، دست‌چین'], ['With Sina, the courier', 'همراه سینا، پیک خانه'], ['Delivered', 'تحویل شد']],
    caps: [[0, ['The florist is choosing.', 'گل‌فروش در حال انتخاب است.']], [2.6, ['White peonies, opening.', 'صدتومانی‌های سفید، شکفته.']], [4.6, ['On its way to you.', 'در راه شماست.']]] },
  travel: { cd: ['Departure in', 'تا پرواز'], after: ['Bon voyage', 'سفر بخیر'],
    head: [['Your journey is being arranged.', 'سفرتان آماده می‌شود.'], ['Everything is ready.', 'همه‌چیز آماده است.']],
    sub: [['The desk has it', 'به میز کانسیرژ رسید'], ['Seats and room held', 'صندلی و اتاق نگه داشته شد'], ['Tickets issued', 'بلیت‌ها صادر شد'], ['Ready to go', 'آمادهٔ رفتن']],
    caps: [[0, ['Your seats are held.', 'صندلی‌هایتان نگه داشته شد.']], [2, ['Boarding pass, issued.', 'کارت پرواز صادر شد.']], [3.8, ['And a room with a view.', 'و اتاقی رو به منظره.']]] },
  call: { cd: ['Leila calls in', 'تا تماس لیلا'], after: ['Calling you now', 'در حال تماس'], onCd: true,
    head: [['Leila will call you.', 'لیلا با شما تماس می‌گیرد.'], ['Leila is with you.', 'لیلا در خدمت شماست.']],
    sub: [['The desk has it', 'به میز کانسیرژ رسید'], ['Leila has your request', 'لیلا در جریان است'], ['Your line is open', 'خط شما باز است'], ['Leila called', 'لیلا تماس گرفت']],
    caps: [[0, ['Leila, your concierge, has it.', 'لیلا، کانسیرژ شما، در جریان است.']], [2.2, ['Your line is open.', 'خط شما باز است.']], [4.2, ['She will call you shortly.', 'به‌زودی با شما تماس می‌گیرد.']]] }
};

/* captions that change with the options chosen */
const CAPS_ALT = {
  travel: o => o.what === 'hotel' && [[0, ['Your room is held.', 'اتاقتان نگه داشته شد.']], [2.4, ['The key is cut.', 'کارت اتاق آماده شد.']], [4, ['A room with a view.', 'اتاقی رو به منظره.']]],
  flowers: o => o.what === 'gift' && [[0, ['The concierge is choosing.', 'کانسیرژ در حال انتخاب است.']], [2.6, ['Something you will be proud to give.', 'چیزی که از دادنش خوشحال می‌شوید.']], [4.6, ['Wrapped by hand.', 'با دست بسته‌بندی شد.']]],
  call: o => o.how === 'visit' && [[0, ['Leila, your concierge, has it.', 'لیلا، کانسیرژ شما، در جریان است.']], [2.2, ['She knows your table.', 'میزتان را می‌شناسد.']], [4.2, ['She will come to you shortly.', 'به‌زودی سرِ میزتان می‌آید.']]]
};

function stepTimes(req) {
  const cd = (req.at - req.t0) / 1000;
  const doneAt = LIVE[req.id].onCd ? cd : Math.min(150, cd);
  return [0, Math.min(5, doneAt * 0.2), Math.min(25, doneAt * 0.5), doneAt];
}
function reqState(req) {
  const el = (Date.now() - req.t0) / 1000, st = stepTimes(req);
  let k = 0; st.forEach((s, i) => { if (el >= s) k = i; });
  return { el, st, k, left: Math.max(0, Math.round((req.at - Date.now()) / 1000)) };
}
/* the one source for every countdown on screen */
const liveLeft = q => { const s = reqState(q); return s.left > 0 ? fmtLeft(s.left) : X(LIVE[q.id].after); };
function fmtLeft(s) {
  if (s >= 86400) {
    /* more than a day reads as words: «۳ روز و ۴ ساعت», "3 days, 4 h" */
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    const dd = d === 1 ? X(T.day1) : X(T.days).replace('%1', N(d));
    const rest = h ? (fa() ? N(h) + ' ساعت' : h + ' h') : m ? (fa() ? N(m) + ' دقیقه' : m + ' min') : '';
    return rest ? dd + (fa() ? ' و ' : ', ') + rest : dd;
  }
  /* no leading zero: «۲:۲۵», never «۰۲:۲۵», whose zero reads as a dot */
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  if (!h && !m && fa()) return N(x) + ' ثانیه';
  return N(h ? h + ':' + pad(m) + ':' + pad(x) : m + ':' + pad(x));
}

/* ================= DOM shell ================= */
const app = $('#app'), view = $('#view'), bar = $('#bar'), keyHost = $('#key');
let route = { name: '' };

function applyLang() {
  const h = document.documentElement;
  h.lang = lang; h.dir = fa() ? 'rtl' : 'ltr';
  h.classList.toggle('fa', fa());
  document.title = fa() ? 'والت — هر چه بخواهید' : 'The Vault — Ask for anything';
}

function renderBar() {
  const showBack = route.name !== 'land';
  bar.classList.toggle('has-back', showBack);
  bar.innerHTML =
    '<div class="bar-s">' + (showBack ? '<button type="button" class="nb back" data-act="back"><span class="arr" aria-hidden="true"></span><span>' + X(T.back) + '</span></button>' : '') + '</div>' +
    '<button type="button" class="word" data-act="home" aria-label="' + X(T.home) + '" lang="en"><span>THE VAULT</span></button>' +
    '<div class="bar-e"><button type="button" class="nb lang" data-act="lang" lang="' + (fa() ? 'en' : 'fa') + '" aria-label="' + X(T.langTo) + '">' + X(T.langBtn) + '</button></div>';
}

/* ================= history ================= */
let idx = (history.state && history.state.i) || 0;
if (!history.state) history.replaceState({ i: 0 }, '', location.hash || '#/');
function parse() {
  const h = (location.hash || '#/').replace(/^#/, '');
  const p = h.split('/').filter(Boolean);
  if (!p.length) return { name: 'land' };
  if (p[0] === 'ask' && !p[1]) return { name: 'menu' };
  if (p[0] === 'ask' && REQ(p[1])) return { name: 'detail', id: p[1] };
  if (p[0] === 'live') return { name: 'live' };
  return null;
}
function go(hash, replace) {
  if (replace) history.replaceState({ i: idx }, '', hash);
  else history.pushState({ i: ++idx }, '', hash);
  show(replace ? 0 : 1);
}
function back() {
  if (idx > 0) history.back();
  else go(route.name === 'detail' ? '#/ask' : '#/', true);
}
addEventListener('popstate', e => {
  if (!e.state) { history.replaceState({ i: ++idx }, '', location.hash); show(1); return; }
  const ni = e.state.i || 0, dir = ni < idx ? -1 : 1; idx = ni; show(dir);
});

/* ================= screens ================= */
let cleanup = [];
const onLeave = f => cleanup.push(f);

function show(dir) {
  let r = parse();
  if (!r) { history.replaceState({ i: idx }, '', '#/'); r = { name: 'land' }; }
  if (r.name === 'live' && !S.req) { history.replaceState({ i: idx }, '', '#/'); r = { name: 'land' }; }
  const prev = route;
  route = r;
  cleanup.splice(0).forEach(f => { try { f(); } catch (e) { /* ignore */ } });
  renderBar();
  const el = document.createElement('section');
  el.className = 'scr scr-' + r.name;
  swap(el, dir, prev);
  ({ land: buildLand, menu: buildMenu, detail: buildDetail, live: buildLive })[r.name](el, prev, dir);
  const pg = $('.page', el);
  bar.classList.remove('solid');
  if (pg) pg.addEventListener('scroll', () => bar.classList.toggle('solid', pg.scrollTop > 24), { passive: true });
  keyStage(r.name === 'land');
  const h = $('h1', el);
  if (h && dir !== 0 && prev.name) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}

function swap(el, dir, prev) {
  $$('.scr', view).forEach(o => {
    if (o.classList.contains('leave')) { o.remove(); return; }
    o.classList.add('leave'); o.setAttribute('aria-hidden', 'true'); o.inert = true;
    setTimeout(() => o.remove(), reduced() ? 10 : 520);
  });
  if (prev.name && dir !== 0) el.classList.add(dir < 0 ? 'in-back' : 'in');
  view.appendChild(el);
}

/* ---------- 1. the key ---------- */
function buildLand(el) {
  el.innerHTML =
    '<div class="pill-slot"></div>' +
    '<div class="land-copy">' +
      '<p class="eyebrow">' + X(T.eyebrow) + '</p>' +
      '<h1 class="disp">' + X(T.title) + '</h1>' +
      '<p class="lede">' + X(T.lede) + '</p>' +
      '<button type="button" class="btn gold" data-act="ask"><span>' + X(T.ask) + '</span></button>' +
      '<p class="hint" aria-hidden="true"><span class="hint-arc"></span>' + X(T.hint) + '</p>' +
    '</div>';
  pill(el);
  requestAnimationFrame(() => key && key.frame && key.frame($('.land-copy', el)));
}

function pill(el) {
  const slot = $('.pill-slot', el || view);
  if (!slot) return;
  const q = S.req;
  app.classList.toggle('has-pill', !!q);
  if (!q) { slot.innerHTML = ''; return; }
  const fresh = !$('.pill', slot);
  const r = REQ(q.id), L = LIVE[q.id], s = reqState(q);
  const done = s.k === 3 && (s.left === 0 || !L.onCd);
  const txt = X(r.short) + ' — ' + (s.left > 0 ? fmtLeft(s.left) : X(L.after));
  const aria = X(T.active) + ': ' + X(r.t) + '. ' + (s.left > 0 ? X(L.cd) + ' ' + fmtLeft(s.left) : X(L.after));
  let b = $('.pill', slot);
  if (!b) {
    slot.innerHTML = '<button type="button" class="pill" data-act="live"><span class="dot" aria-hidden="true"></span><span class="pill-t"></span><span class="pill-go" aria-hidden="true"></span></button>';
    b = $('.pill', slot);
  }
  b.classList.toggle('is-done', done);
  b.setAttribute('aria-label', aria);
  $('.pill-t', b).textContent = txt;
  if (fresh && key && key.frame) requestAnimationFrame(() => key.frame($('.land-copy', el || view)));
}

/* ---------- 2. choose a request ---------- */
const ICONS = {
  car: '<path pathLength="1" d="M4 31 L8 23.5 Q10 19.5 15 19.5 L30 19.5 Q34 19.5 36.5 23 L39.5 27 L43 27.8 Q45 28.4 45 30.5 L45 33 L4 33 Z"/><path pathLength="1" d="M12 24.5 H36"/><circle pathLength="1" cx="13.5" cy="33.5" r="4"/><circle pathLength="1" cx="35" cy="33.5" r="4"/><path class="ico-live" pathLength="1" d="M45.5 29 L48 27.5 M45.5 31 L48 31.5"/>',
  table: '<path pathLength="1" d="M5 35 H43"/><path pathLength="1" d="M9.5 35 A14.5 14.5 0 0 1 38.5 35"/><path pathLength="1" d="M24 20.5 V17.5"/><circle pathLength="1" cx="24" cy="15.8" r="1.7"/><path pathLength="1" d="M15 29 A10 10 0 0 1 21 23.5"/><path class="ico-live" pathLength="1" d="M41 14 q-1.6 -2.4 0 -5 q1.6 2.6 0 5 Z M41 14 V19"/>',
  tickets: '<path pathLength="1" d="M6 14 H42 V20.5 A3.5 3.5 0 0 0 42 27.5 V34 H6 V27.5 A3.5 3.5 0 0 0 6 20.5 Z"/><path class="ico-dots" d="M31 15.5 V32.5"/><path pathLength="1" d="M18.5 19.5 L20.2 23 L24 23.5 L21.2 26 L22 29.8 L18.5 28 L15 29.8 L15.8 26 L13 23.5 L16.8 23 Z"/>',
  flowers: '<path pathLength="1" d="M24 22.5 C17 22 15 15 19 12 C21 10 23 10.5 24 12.5 C25 10.5 27 10 29 12 C33 15 31 22 24 22.5 Z"/><path pathLength="1" d="M24 12.5 C23 15 23.2 18 24 22.5"/><path pathLength="1" d="M24 22.5 V42"/><path pathLength="1" d="M24 32 C20 28 15 28.5 13.5 31.5 C17 34 21 33.5 24 32"/><path pathLength="1" d="M24 36 C27.5 32.5 32 32.8 33.5 35.5 C30.5 38 27 37.6 24 36"/><path class="ico-live" pathLength="1" d="M34 9 L35 7 M38 13 L40 12.4 M14 9 L13 7"/>',
  travel: '<path class="ico-dots" d="M5 38 Q20 24 41 32"/><path pathLength="1" d="M41 11.5 L28.5 17.5 L15.5 12.5 L12.5 14 L23 20.5 L16.5 24 L11.5 22.8 L9.6 24 L15 27.4 L17.8 32 L19.4 30.7 L19.6 26.4 L26.4 22.6 L28.4 34.2 L31.2 32.6 L31 20.2 L43.2 14.2 Q45 12.6 43.4 11.3 Q42.4 10.9 41 11.5 Z"/>',
  call: '<path pathLength="1" d="M15.5 9.5 C11.5 11.5 10 15.5 11.8 20.5 C14.8 28 20.5 33.8 27.8 36.6 C32.6 38.4 36.5 37.2 38.6 33.4 L33.6 28.6 L29.5 31.2 C25.5 29.2 19.2 23 17 19 L19.8 14.8 Z"/><path class="ico-live" pathLength="1" d="M28.5 12.5 A8.5 8.5 0 0 1 35.5 19.5"/><path class="ico-live d2" pathLength="1" d="M29 6 A15 15 0 0 1 42 19"/>'
};
/* a card's picture: a photograph, or, for flowers and travel, a still rendered from their own 3D scene */
/* flowers and travel use stills baked at full quality from their own 3D scenes (img/), never a live low-quality render */
const BAKED = { travel: () => 'img/travel-' + lang + '.webp' };
/* flowers is typographic: one finely drawn gold peony on the card's dark ground */
const PEONY = '<svg class="peony" viewBox="0 0 96 96" aria-hidden="true">' +
  '<path pathLength="1" d="M20 44 C19 58 32 70 48 70 C64 70 77 58 76 44"/>' +
  '<path pathLength="1" d="M20 44 C21 37 27 34 32 36 C34 30 41 28 44 32 C46 27 52 27 54 32 C57 28 63 30 64 36 C69 34 75 37 76 44"/>' +
  '<path pathLength="1" d="M20 44 C24 50 30 52 34 50 C38 55 44 55 48 52 C52 55 58 55 62 50 C66 52 72 50 76 44"/>' +
  '<path pathLength="1" d="M31 44.5 C33 40 37.5 39 40 41 C42 37 46 36.5 48 39.5 C50 36.5 54 37 56 41 C58.5 39 63 40 65 44.5"/>' +
  '<path pathLength="1" d="M37 47.5 C39.5 45 42.5 45 44.5 46.8 C46.5 44.6 49.5 44.6 51.5 46.8 C53.5 45 56.5 45 59 47.5"/>' +
  '<path pathLength="1" d="M34 50 C32.5 57 34.5 63.5 39.5 67.5 M62 50 C63.5 57 61.5 63.5 56.5 67.5"/>' +
  '<path pathLength="1" d="M48 70 C48.6 77 47.6 83 45.6 90"/>' +
  '<path pathLength="1" d="M47.8 80 C43 74.5 35.5 74 31.5 77.5 C35.5 81.5 42 82.5 47.8 80 M47.8 80 C42.5 78.5 37.5 78 34 78"/>' +
  '<path class="ico-live" pathLength="1" d="M70 22 L71.4 18.6 M77 28 L80.4 26.8 M25 24 L23.6 20.6"/></svg>';
const art = (r, lazy) => r.mark ? '<span class="mark">' + PEONY + '</span>' : r.img ? '<img src="' + r.img + V + '" alt="" decoding="async"' + (lazy ? ' loading="lazy"' : '') + '>' : '<img class="still on" data-baked="' + r.id + '" src="' + BAKED[r.id]() + V + '" alt="" decoding="async"' + (lazy ? ' loading="lazy"' : '') + '>';
const STILL = {};
let stillQ = Promise.resolve();
function stillFor(id) {
  const k = id + lang;
  if (STILL[k]) return Promise.resolve(STILL[k]);
  stillQ = stillQ.then(async () => {
    if (STILL[k] || !glOK()) return;
    const st = document.createElement('div'); st.style.cssText = 'position:fixed;left:-3000px;top:0;width:400px;height:680px;pointer-events:none';
    document.body.appendChild(st);
    const r = REQ(id), o = {}; r.g.forEach(g => { o[g.k] = g.step ? g.step[2] : (g.def || g.o[0]); });
    try {
      const ctl = await makeSeqGL(st, document.createElement('div'), { id, o, t0: Date.now(), at: Date.now() + 864e5 * 3 }, true);
      ctl.frame(ctl.dur, true);
      STILL[k] = SG.canvas.toDataURL('image/jpeg', 0.84);
      ctl.dispose();
    } catch (e) { /* the drawn still below takes over */ }
    st.remove();
  });
  return stillQ.then(() => STILL[k] || null);
}
window.__v5bake = id => stillFor(id); /* testing aid: used once to bake img/*.webp */
function fillStills(root) {
  $$('img[data-still]', root).forEach(img => {
    const id = img.dataset.still;
    stillFor(id).then(url => {
      if (url) { img.src = url; img.classList.add('on'); return; }
      /* no WebGL: the drawn SVG still of the same scene */
      const box = document.createElement('span'); box.className = 'still-svg'; img.replaceWith(box);
      const r = REQ(id), o = {}; r.g.forEach(g => { o[g.k] = g.step ? g.step[2] : (g.def || g.o[0]); });
      try { SCENES[id](box, document.createElement('div'), { id, o, t0: Date.now(), at: Date.now() + 864e5 * 3 }).frame(99); } catch (e) { /* leave it dark */ }
    });
  });
}
let lastCardRect = null;
function buildMenu(el, prev) {
  const fromKey = prev.name === 'land';
  el.innerHTML =
    '<div class="page menu-page">' +
      '<header class="menu-head">' +
        '<p class="eyebrow">' + X(T.menuEy) + '</p>' +
        '<h1 class="h1 xl">' + X(T.menuT) + '</h1>' +
        '<p class="lede">' + X(T.menuS) + '</p>' +
      '</header>' +
      '<ul class="cards" role="list">' + REQS.map((r, i) =>
        '<li style="--i:' + i + '"><button type="button" class="card ' + r.fit + '" data-act="pick" data-id="' + r.id + '">' +
          '<span class="card-img" aria-hidden="true">' + art(r, i > 1) + '</span>' +
          '<span class="veil" aria-hidden="true"></span>' +
          '<span class="card-sheen" aria-hidden="true"></span>' +
          '<span class="card-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
          '<span class="card-top" aria-hidden="true"><span class="card-n">' + (fa() ? 'شمارهٔ ' + N(i + 1) : 'No. ' + pad(i + 1)) + '</span>' +
            '<svg class="ico" viewBox="0 0 48 48" aria-hidden="true">' + ICONS[r.id] + '</svg></span>' +
          '<span class="card-txt"><span class="card-t">' + X(r.t) + '</span><span class="card-d">' + X(r.d) + '</span>' +
          '<span class="card-cta" aria-hidden="true"><span>' + X(['Arrange', 'ترتیب بدهید']) + '</span><span class="card-go"></span></span></span>' +
        '</button></li>').join('') +
      '</ul>' +
    '</div>';
  if (fromKey) el.classList.add('from-key');
  const page = $('.page', el);
  if (S.menuScroll && prev.name === 'detail') page.scrollTop = S.menuScroll;
  const cards = $$('.card', el);
  /* cards draw their icon the first time they are seen */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } }), { root: page, threshold: 0.35 });
  cards.forEach(c => io.observe(c));
  onLeave(() => io.disconnect());
  /* slow parallax and a light sweep tied to the scroll; tilt follows the pointer or the phone */
  if (!reduced()) {
    let raf = 0;
    const upd = () => {
      raf = 0;
      const vh = page.clientHeight, pr = page.getBoundingClientRect();
      cards.forEach(c => {
        const b = c.getBoundingClientRect();
        const k = (b.top - pr.top + b.height / 2 - vh / 2) / vh;
        c.style.setProperty('--c', Math.max(-1.5, Math.min(1.5, k)).toFixed(3));
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    page.addEventListener('scroll', on, { passive: true });
    upd();
    onLeave(() => cancelAnimationFrame(raf));
    cards.forEach(c => {
      c.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const b = c.getBoundingClientRect();
        c.style.setProperty('--rx', (((e.clientY - b.top) / b.height - 0.5) * -2).toFixed(3));
        c.style.setProperty('--ry', (((e.clientX - b.left) / b.width - 0.5) * 2).toFixed(3));
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', 0); c.style.setProperty('--ry', 0); });
    });
    const tiltF = (gx, gy) => { if (el.isConnected) { el.style.setProperty('--tx', gx.toFixed(3)); el.style.setProperty('--ty', gy.toFixed(3)); } };
    onTilt(tiltF);
    onLeave(() => { const i = tiltSubs.indexOf(tiltF); if (i >= 0) tiltSubs.splice(i, 1); });
  }
  page.addEventListener('scroll', () => { S.menuScroll = page.scrollTop; }, { passive: true });
  onLeave(save);
}

/* ---------- 2b. the request's options ---------- */
function buildDetail(el, prev) {
  const r = REQ(route.id), d = draft(r);
  save();
  el.innerHTML =
    '<div class="page detail-page">' +
      '<div class="hero ' + r.fit + '"><span class="card-img">' + art(r) + '</span><span class="veil"></span>' +
        '<div class="hero-txt"><p class="eyebrow">' + X(T.menuEy) + '</p><h1 class="h1">' + X(r.t) + '</h1><p class="lede">' + X(r.d) + '</p></div></div>' +
      '<div class="opts">' + r.g.map((g, gi) => group(r, g, gi, d)).join('') + '</div>' +
    '</div>' +
    '<div class="confirm"><p class="sum" aria-live="polite"></p>' +
      '<button type="button" class="btn gold" data-act="confirm"><span>' + X(T.arrange) + '</span></button>' +
      '<p class="fine">' + X(T.note) + '</p></div>';
  updSummary(el, r, d);
  /* the chosen card opens into the hero */
  if (prev.name === 'menu' && lastCardRect && !reduced()) {
    const hero = $('.hero', el), a = app.getBoundingClientRect(), c = lastCardRect;
    const hh = hero.offsetHeight || a.height * 0.4, ch = Math.min(hh, c.bottom - c.top);
    const ins = '0px ' + Math.max(0, a.right - c.right) + 'px ' + Math.max(0, hh - ch) + 'px ' + Math.max(0, c.left - a.left) + 'px';
    el.classList.add('from-card');
    hero.animate([{ transform: 'translateY(' + (c.top - a.top) + 'px)', clipPath: 'inset(' + ins + ')' }, { transform: 'translateY(0)', clipPath: 'inset(0px 0px 0px 0px)' }], { duration: 760, easing: 'cubic-bezier(.65,0,.35,1)' });
  }
  lastCardRect = null;
}

function group(r, g, gi, d) {
  const id = 'g-' + r.id + '-' + g.k;
  if (g.step) {
    const v = d[g.k];
    return '<div class="grp" role="group" aria-labelledby="' + id + '"><p class="grp-l" id="' + id + '">' + X(g.l) + '</p>' +
      '<div class="stepper"><button type="button" class="st-b" data-act="step" data-k="' + g.k + '" data-d="-1" aria-label="' + X(T.fewer) + '"' + (v <= g.step[0] ? ' disabled' : '') + '><span class="st-minus" aria-hidden="true"></span></button>' +
      '<output class="st-v" aria-live="polite">' + N(v) + '</output>' +
      '<button type="button" class="st-b" data-act="step" data-k="' + g.k + '" data-d="1" aria-label="' + X(T.more) + '"' + (v >= g.step[1] ? ' disabled' : '') + '><span class="st-plus" aria-hidden="true"></span></button></div></div>';
  }
  const radio = (cls, act, k, v, on, lab) => '<button type="button" role="radio" class="chip' + cls + '" data-act="' + act + '" data-k="' + k + '" data-v="' + v + '" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '">' + lab + '</button>';
  let h = '<div class="grp"><p class="grp-l" id="' + id + '">' + X(g.l) + '</p><div class="chips" role="radiogroup" aria-labelledby="' + id + '">' +
    g.o.map(o => radio('', 'opt', g.k, o, d[g.k] === o, X(O[o]))).join('') + '</div>';
  if (g.pick) {
    const key = g.k + (g.pick === 'day' ? 'D' : 'T');
    const list = g.pick === 'day' ? daySlots() : timeSlots();
    if (!d[key] || list.indexOf(d[key]) < 0) d[key] = list[0];
    const open = d[g.k] === (g.pick === 'day' ? 'pick' : 'later');
    h += '<div class="more' + (open ? ' open' : '') + '" data-for="' + g.k + '"' + (open ? '' : ' hidden') + '><div class="more-in"><div class="chips row" role="radiogroup" aria-label="' + X(g.pick === 'day' ? T.pickDay : T.pickTime) + '">' +
      list.map(v => {
        const lab = g.pick === 'day'
          ? '<span class="dd-w">' + new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', { weekday: 'short' }).format(isoDate(v)) + '</span><span class="dd-d">' + N(new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', { day: 'numeric', month: 'short' }).format(isoDate(v))) + '</span>'
          : N(fa() ? v.replace(/^0/, '') : v);
        return radio(' ' + (g.pick === 'day' ? 'dd' : 'tt'), 'sub', key, v, d[key] === v, lab);
      }).join('') + '</div></div></div>';
  }
  return h + '</div>';
}
function updSummary(el, r, d) { const s = $('.sum', el); if (s) s.textContent = summary(r, d); }

/* ---------- 3. it's being done ---------- */
function buildLive(el) {
  const q = S.req, L = LIVE[q.id];
  el.innerHTML =
    '<div class="stage" aria-hidden="true"></div>' +
    '<div class="seq-ui">' +
      '<h1 class="sr" tabindex="-1">' + X(T.liveEy) + ' — ' + X(REQ(q.id).short) + '</h1>' +
      '<p class="eyebrow" aria-hidden="true">' + X(T.liveEy) + '</p>' +
      '<p class="cap" aria-live="polite"></p>' +
    '</div>' +
    '<div class="ovl" aria-hidden="true"></div>' +
    '<button type="button" class="skip" data-act="skip">' + X(T.skip) + '<span class="skip-bar" aria-hidden="true"></span></button>' +
    '<div class="page status-page"><div class="status" id="status" hidden></div></div>';
  const stage = $('.stage', el), cap = $('.cap', el), ov = $('.ovl', el);
  renderStatus($('#status', el), q);
  const caps = (CAPS_ALT[q.id] && CAPS_ALT[q.id](q.o)) || L.caps;
  let sc = null, raf = 0, dead = false, ended = false;
  const finish = instant => {
    if (ended) return; ended = true;
    cancelAnimationFrame(raf);
    if (sc) sc.frame(sc.dur, true);
    el.classList.add('ended');
    if (instant) el.classList.add('no-anim');
    const st = $('#status', el); st.hidden = false;
    const h = $('h2', st); if (h && !instant) { h.setAttribute('tabindex', '-1'); setTimeout(() => h.focus({ preventScroll: true }), 60); }
  };
  el._finish = finish;
  el._seek = t => { cancelAnimationFrame(raf); if (sc) sc.frame(t, true); };
  const start = ctl => {
    if (dead) { if (ctl.dispose) ctl.dispose(); return; }
    sc = ctl;
    el.classList.add('ready');
    if (q.played || reduced()) {
      sc.frame(sc.dur, true);
      requestAnimationFrame(() => finish(!!q.played));
      if (!q.played) { q.played = 1; save(); }
      return;
    }
    q.played = 1; save();
    let ci = -1;
    if (HOLD) { sc.frame(0, true); el._seek = t => { sc.frame(t, true); let k = 0; caps.forEach((c, i) => { if (t >= c[0]) k = i; }); cap.textContent = X(caps[k][1]); cap.classList.add('on'); }; return; }
    const t0 = performance.now();
    const loop = now => {
      if (ended || dead) return;
      const t = (now - t0) / 1000;
      sc.frame(Math.min(t, sc.dur));
      let k = -1; caps.forEach((c, i) => { if (t >= c[0]) k = i; });
      if (k !== ci) { ci = k; setCap(cap, X(caps[k][1])); }
      el.style.setProperty('--p', Math.min(1, t / sc.dur).toFixed(3));
      if (t >= sc.dur + 0.5) { finish(false); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  };
  onLeave(() => { dead = true; cancelAnimationFrame(raf); const s = sc; if (s && s.dispose) setTimeout(() => s.dispose(), 650); });
  if (glOK()) stillQ.then(() => makeSeqGL(stage, ov, q)).then(start).catch(e => { console.warn('The Vault: sequence falls back to the still drawing.', e && e.message); stage.innerHTML = ''; ov.innerHTML = ''; start(svgCtl(stage, ov, q)); });
  else start(svgCtl(stage, ov, q));
}
function svgCtl(stage, ov, q) { const s = SCENES[q.id](stage, ov, q); return { dur: s.dur, frame: t => s.frame(t) }; }
const HOLD = /[?&]hold\b/.test(location.search); /* testing aid: the sequence waits for __v5seek(t) */
window.__v5seek = t => { const s = $('.scr-live:not(.leave)'); if (s && s._seek) s._seek(t); };
function setCap(cap, txt) {
  cap.classList.remove('on'); void cap.offsetWidth;
  cap.textContent = txt; cap.classList.add('on');
}

function details(q) {
  const o = q.o, r = REQ(q.id), rows = [];
  const P = PEOPLE;
  const when = new Date(q.at);
  const whenTxt = () => {
    const same = new Date().toDateString() === when.toDateString();
    return (same ? X(O.today) : dayFmt(when, true)) + (fa() ? '، ساعت ' : ', ') + hm(when);
  };
  switch (q.id) {
    case 'car':
      rows.push([['Driver', 'راننده'], X(P.driver)]);
      rows.push([['Car', 'خودرو'], (o.kind === 'van' ? X(['Black van', 'ون مشکی']) : X(['Black sedan', 'سدان مشکی'])) + ' — ' + plate()]);
      rows.push([['Route', 'مسیر'], X(O[o.to]) + (fa() ? '، حدود ' + N(P.mins[o.to]) + ' دقیقه' : ', about ' + P.mins[o.to] + ' min')]);
      break;
    case 'table':
      rows.push([['Restaurant', 'رستوران'], X(P.rest) + (fa() ? '، ' : ', ') + X(o.mood === 'view' ? ['by the window', 'کنار پنجره'] : ['the corner table', 'میز گوشه'])]);
      rows.push([['When', 'کی'], whenTxt()]);
      rows.push([['Guests', 'مهمان'], optLabel(r.g[2], o.n, o)]);
      break;
    case 'tickets':
      rows.push([['Programme', 'برنامه'], X(P.show[o.kind])]);
      rows.push([['Venue', 'محل'], X(P.hall[o.kind]) + (fa() ? '، ' : ', ') + whenTxt()]);
      rows.push([['Seats', 'صندلی'], seatsTxt(o)]);
      break;
    case 'flowers':
      rows.push([['What', 'چه چیزی'], X(o.what === 'gift' ? ['A gift, chosen and wrapped', 'هدیه‌ای انتخاب‌شده و بسته‌بندی‌شده'] : o.what === 'both' ? ['White peonies, and a gift', 'صدتومانی سفید، همراه یک هدیه'] : ['White peonies, by hand', 'صدتومانی سفید، دست‌چین'])]);
      rows.push([['For', 'مناسبت'], X(O[o.for]) + ' — ' + X(O[o.budget])]);
      rows.push([['Delivery', 'تحویل'], whenTxt()]);
      break;
    case 'travel':
      if (o.what === 'hotel') rows.push([['Arrival', 'رسیدن'], whenTxt()]);
      else rows.push([['Flight', 'پرواز'], '<bdi dir="ltr">' + N(P.flight[o.to]) + '</bdi>' + (fa() ? '، ' : ', ') + whenTxt()]);
      rows.push([['Hotel', 'هتل'], X(P.hotelName[o.to]) + (fa() ? '، اتاق ' + N(512) : ', room 512')]);
      rows.push([['Travellers', 'مسافر'], optLabel(r.g[2], o.n, o) + (o.what === 'hotel' ? ' — ' + X(O.hotel) : '')]);
      break;
    case 'call':
      rows.push([['Your concierge', 'کانسیرژ شما'], X(P.concierge)]);
      rows.push([['How', 'چطور'], X(HOW[o.how])]);
      rows.push([['When', 'کی'], hm(when)]);
      break;
  }
  return rows;
}
const seatsTxt = o => fa()
  ? 'ردیف ' + N(6) + ' — صندلی ' + (o.n > 1 ? N(11) + ' تا ' + N(10 + Number(o.n)) : N(11))
  : 'Row F, ' + (o.n > 1 ? 'seats 11–' + (10 + Number(o.n)) : 'seat 11');
const plate = () => '<bdi dir="ltr" class="plate"><span class="pl-a">' + N(12) + '</span><span class="pl-b">' + (fa() ? 'ب' : 'B') + '</span><span class="pl-c">' + N(345) + '</span><span class="pl-d">' + N(67) + '</span></bdi>';

function renderStatus(box, q) {
  const r = REQ(q.id), L = LIVE[q.id];
  box.innerHTML =
    '<p class="eyebrow">' + X(r.t) + '</p>' +
    '<h2 class="h1 st-h"></h2>' +
    '<div class="cd"><span class="cd-l"></span><span class="cd-v" role="timer" aria-live="off"></span></div>' +
    '<dl class="rows">' + details(q).map(x => '<div class="row"><dt>' + X(x[0]) + '</dt><dd>' + x[1] + '</dd></div>').join('') + '</dl>' +
    '<ol class="tl">' + T.steps.map((s, i) => '<li class="tl-i" data-i="' + i + '"><span class="tl-dot" aria-hidden="true"><i></i></span><span class="tl-line" aria-hidden="true"></span><span class="tl-t">' + X(s) + '</span><span class="tl-s">' + X(L.sub[i]) + '</span><span class="tl-at"></span></li>').join('') + '</ol>' +
    '<div class="st-actions"><button type="button" class="btn gold" data-act="done"><span>' + X(T.done) + '</span></button>' +
    '<button type="button" class="btn ghost" data-act="other"><span>' + X(T.other) + '</span></button></div>';
  tickStatus(box, q);
}
function tickStatus(box, q) {
  const L = LIVE[q.id], s = reqState(q);
  const done = s.k === 3;
  $('.st-h', box).textContent = X(L.head[done ? 1 : 0]);
  $('.cd-l', box).textContent = s.left > 0 ? X(L.cd) : '';
  $('.cd-v', box).textContent = s.left > 0 ? fmtLeft(s.left) : X(L.after);
  box.classList.toggle('arrived', s.left === 0);
  $$('.tl-i', box).forEach((li, i) => {
    const st = i < s.k || (i === 3 && done) ? 'done' : i === s.k ? 'now' : 'next';
    const was = li.dataset.st;
    li.dataset.st = st;
    li.className = 'tl-i ' + st + (was && was !== st ? ' pop' : '');
    li.setAttribute('aria-current', st === 'now' ? 'step' : 'false');
    $('.tl-at', li).textContent = st === 'next' ? '' : hm(new Date(q.t0 + s.st[i] * 1000));
  });
}

/* one quiet clock for everything that is live */
setInterval(() => {
  if (!S.req) return;
  if (route.name === 'land') pill();
  if (route.name === 'live') { const b = $('.scr-live:not(.leave) #status'); if (b) tickStatus(b, S.req); }
}, 1000);

/* ================= actions ================= */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const a = b.dataset.act;
  const scr = b.closest('.scr');
  if (a === 'back') back();
  else if (a === 'home') { if (route.name !== 'land') go('#/'); }
  else if (a === 'lang') {
    lang = fa() ? 'en' : 'fa'; store.set('vault5.lang', lang); applyLang();
    const sc = $('.scr:not(.leave)', view);

    show(0);
    const lb = $('.bar .lang'); if (lb) lb.focus();
  }
  else if (a === 'ask') unlock();
  else if (a === 'live') go('#/live');
  else if (a === 'pick') {
    const r = b.getBoundingClientRect(); lastCardRect = { top: r.top, left: r.left, right: r.right, bottom: r.bottom };
    go('#/ask/' + b.dataset.id);
  }
  else if (a === 'opt' || a === 'sub' || a === 'step') {
    const r = REQ(route.id), d = draft(r);
    if (a === 'step') {
      const g = r.g.find(x => x.k === b.dataset.k);
      d[g.k] = Math.max(g.step[0], Math.min(g.step[1], d[g.k] + Number(b.dataset.d)));
      const wrap = b.parentNode;
      $('.st-v', wrap).textContent = N(d[g.k]);
      const bs = $$('.st-b', wrap); bs[0].disabled = d[g.k] <= g.step[0]; bs[1].disabled = d[g.k] >= g.step[1];
      if (b.disabled) (b === bs[0] ? bs[1] : bs[0]).focus();
    } else {
      d[b.dataset.k] = b.dataset.v;
      $$('[data-k="' + b.dataset.k + '"]', b.parentNode).forEach(c => { c.setAttribute('aria-checked', String(c === b)); c.tabIndex = c === b ? 0 : -1; });
      if (a === 'opt') {
        const g = r.g.find(x => x.k === b.dataset.k), more = $('.more[data-for="' + g.k + '"]', scr);
        if (more) {
          const open = b.dataset.v === (g.pick === 'day' ? 'pick' : 'later');
          if (open) { more.hidden = false; requestAnimationFrame(() => more.classList.add('open')); }
          else { more.classList.remove('open'); setTimeout(() => { if (!more.classList.contains('open')) more.hidden = true; }, 380); }
        }
      }
    }
    save(); updSummary(scr, r, d);
  }
  else if (a === 'confirm') {
    const r = REQ(route.id), d = draft(r);
    const now = Date.now();
    S.req = { id: r.id, o: Object.assign({}, d), t0: now, at: targetTime(r, d), played: 0 };
    save();
    const goLive = () => { history.replaceState({ i: idx }, '', '#/live'); show(1); };
    if (reduced()) goLive(); else wipe(b, goLive);
  }
  else if (a === 'skip') { const sc = b.closest('.scr'); if (sc && sc._finish) sc._finish(false); }
  else if (a === 'done') {
    const st = b.closest('.status');
    if (reduced() || !st) go('#/');
    else {
      const r = st.getBoundingClientRect(), ar = app.getBoundingClientRect();
      const tx = ar.left + ar.width / 2 - (r.left + r.width / 2), ty = ar.top + 90 - (r.top + r.height / 2);
      st.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(.18,.06)', opacity: 0 }], { duration: 560, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      setTimeout(() => go('#/'), 380);
    }
  }
  else if (a === 'other') go('#/ask');
});

document.addEventListener('keydown', e => {
  /* radio groups: arrows move and choose, mirrored in RTL */
  const rb = e.target.closest && e.target.closest('[role=radio]');
  if (rb && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
    const all = $$('[role=radio]', rb.parentNode), i = all.indexOf(rb);
    let d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && fa()) d = -d;
    const nx = e.key === 'Home' ? all[0] : e.key === 'End' ? all[all.length - 1] : all[(i + d + all.length) % all.length];
    e.preventDefault(); nx.focus(); nx.click();
    return;
  }
  if (e.key === 'Escape' && route.name !== 'land') {
    const sc = $('.scr-live:not(.leave):not(.ended)');
    if (sc && sc._finish) { sc._finish(false); return; }
    back();
  }
});

/* ================= the key: unlocking ================= */
let unlocking = false;
async function unlock() {
  if (unlocking) return;
  unlocking = true;
  const sc = $('.scr-land');
  if (sc && !reduced()) { sc.classList.add('unlocking'); app.classList.add('unlock'); setTimeout(() => app.classList.remove('unlock'), 2600); }
  try { if (key && key.unlock) await key.unlock(); else if (!reduced()) await wait(700); } catch (e) { /* never block */ }
  unlocking = false;
  go('#/ask');
}
const wait = ms => new Promise(r => setTimeout(r, ms));
/* a circle of gold that opens from the button, then closes into the sequence */
function wipe(btn, then) {
  const r = btn.getBoundingClientRect(), a = app.getBoundingClientRect();
  const w = document.createElement('div'); w.className = 'wipe';
  w.style.setProperty('--x', (r.left - a.left + r.width / 2) + 'px'); w.style.setProperty('--y', (r.top - a.top + r.height / 2) + 'px');
  app.appendChild(w);
  requestAnimationFrame(() => w.classList.add('on'));
  setTimeout(() => { then(); w.classList.add('off'); }, 520);
  setTimeout(() => w.remove(), 1500);
}

/* ================= WebGL: shared core ================= */
/* quality: 2 = full (MSAA, bloom, reflections), 1 = lighter, 0 = minimum. ?q=0|1|2 pins it (used for testing). */
const QPIN = /[?&]q=([012])\b/.exec(location.search);
const Q = {
  level: QPIN ? +QPIN[1] : (((navigator.deviceMemory || 8) <= 3 || (navigator.hardwareConcurrency || 8) <= 4) ? 1 : 2),
  locked: !!QPIN
};
window.__v5q = () => Q.level; /* testing aid */
const qDpr = l => { const d = Math.min(2, window.devicePixelRatio || 1); return l >= 2 ? d : l === 1 ? Math.min(d, 1.5) : Math.min(d, 1); };
let THREE_P = null;
const loadThree = () => (THREE_P || (THREE_P = import('./lib/three.r186.min.js' + V)));
let GL_OK = null;
function glOK() {
  if (GL_OK !== null) return GL_OK;
  try {
    const c = document.createElement('canvas'), g = c.getContext('webgl2');
    GL_OK = !!g && !/[?&]nogl\b/.test(location.search);
    if (g) { const l = g.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); }
  } catch (e) { GL_OK = false; }
  return GL_OK;
}
/* drops the quality level when frames run long; never raises it again within a session */
function perfGuard(onDrop) {
  let acc = 0, n = 0, slow = 0, skip = 20;
  return dt => {
    if (Q.locked || skip-- > 0) return;
    acc += dt; n++;
    if (n < 40) return;
    const avg = acc / n; acc = 0; n = 0;
    if (avg > 0.026) { if (++slow >= 2 && Q.level > 0) { Q.level--; slow = 0; skip = 30; onDrop(Q.level); } } else slow = 0;
  };
}

/* the finishing pass: grade, chromatic edge, tilt-shift softness, vignette, grain, flash */
const FINISH = {
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: null },
    uVig: { value: 0.9 }, uGrain: { value: 0.035 }, uCA: { value: 1 }, uTilt: { value: 0.6 }, uFocus: { value: 0.55 }, uBlur: { value: 2.6 }, uB0: { value: 0.16 }, uB1: { value: 0.55 }, uFlash: { value: 0 }, uFade: { value: 1 }
  },
  vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: [
    'uniform sampler2D tDiffuse;uniform float uTime,uVig,uGrain,uCA,uTilt,uFocus,uFlash,uFade,uBlur,uB0,uB1;uniform vec2 uRes;varying vec2 vUv;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
    'void main(){',
    ' vec2 uv=vUv,c=uv-.5;float asp=uRes.x/uRes.y;float r=length(c*vec2(asp,1.));',
    ' vec2 o=c*uCA*r*.0105;',
    ' vec3 col=vec3(texture2D(tDiffuse,uv+o).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-o).b);',
    ' float b=smoothstep(uB0,uB1,abs(uv.y-uFocus))*uTilt;',
    ' if(b>.01){vec2 px=b*uBlur/uRes;vec3 s=col;float n=1.;float j=h(uv*uRes)*6.2832;',          /* a 24-tap disc: soft, round out-of-focus */
    '  for(int i=0;i<24;i++){float a=float(i)*2.39996+j;float r=sqrt((float(i)+.5)/24.);s+=texture2D(tDiffuse,uv+vec2(cos(a),sin(a))*r*px).rgb;n+=1.;}',
    '  col=s/n;}',
    ' col=col*col*(3.-2.*col)*.22+col*.78;',                 /* gentle S-curve */
    ' col=pow(max(col,0.),vec3(1.0,1.02,1.08));',            /* warm grade */
    ' col+=vec3(.010,.007,.002);',
    ' col*=mix(1.,smoothstep(1.08,.22,r),uVig);',
    ' col+=(h(uv*uRes+fract(uTime*7.)*91.)-.5)*uGrain;',
    ' col+=uFlash*vec3(1.,.84,.58)*(1.15-r*.9);',
    ' gl_FragColor=vec4(col*uFade,1.);}'
  ].join('\n')
};

function makePipe(T, renderer, scene, camera, o) {
  o = o || {};
  const rt = new T.WebGLRenderTarget(4, 4, { type: T.HalfFloatType, samples: Q.level >= 2 ? 4 : 0 });
  const comp = new T.EffectComposer(renderer, rt);
  const rp = new T.RenderPass(scene, camera);
  comp.addPass(rp);
  const bloom = new T.UnrealBloomPass(new T.Vector2(256, 256), o.bloom != null ? o.bloom : 0.55, o.radius != null ? o.radius : 0.55, o.thresh != null ? o.thresh : 0.8);
  bloom.enabled = Q.level > 0;
  comp.addPass(bloom);
  comp.addPass(new T.OutputPass());
  const fin = new T.ShaderPass(FINISH);
  fin.uniforms.uRes.value = new T.Vector2(4, 4);
  comp.addPass(fin);
  const pipe = {
    comp, rp, bloom, fin, w: 4, h: 4,
    size(w, h) {
      const d = qDpr(Q.level);
      pipe.w = w; pipe.h = h;
      renderer.setPixelRatio(d); renderer.setSize(w, h, false);
      comp.setPixelRatio(d); comp.setSize(w, h);
      fin.uniforms.uRes.value.set(w * d, h * d);
      bloom.enabled = Q.level > 0;
    },
    render(dt) { fin.uniforms.uTime.value += dt; comp.render(dt); }
  };
  return pipe;
}

/* a studio to reflect: dark room, warm soft boxes, one cool strip (HDR values, filtered through PMREM) */
function studioEnv(T, renderer) {
  const s = new T.Scene();
  s.add(new T.Mesh(new T.BoxGeometry(24, 14, 24), new T.MeshBasicMaterial({ color: 0x070605, side: T.BackSide })));
  const panel = (w, h, col, k, p) => {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(col).multiplyScalar(k), side: T.DoubleSide }));
    m.position.set(p[0], p[1], p[2]); m.lookAt(0, 0, 0); s.add(m);
  };
  panel(9, 2.4, 0xffeedd, 6, [0, 6.5, 1.5]);      /* overhead soft box */
  panel(1.6, 9, 0xfff0dc, 5, [-8, 1, 3]);         /* tall strip, left */
  panel(1.0, 9, 0xb4ccff, 4, [8, 1.5, -4]);       /* cool kicker, right-back */
  panel(7, 0.8, 0xfff2e0, 2.2, [0, -3, 7]);       /* low front bounce */
  panel(2.5, 2.5, 0xffd2a0, 3, [5, 4, 6]);        /* small warm key */
  panel(3, 1.2, 0xffffff, 2, [-4, 5, -7]);
  const pm = new T.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.035).texture;
  pm.dispose();
  return tex;
}

/* a dark mirror that fades out towards its edge */
const FADE_MIRROR = {
  name: 'FadeMirror',
  uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null } },
  vertexShader: 'uniform mat4 textureMatrix;varying vec4 vUv;varying vec2 vL;void main(){vUv=textureMatrix*vec4(position,1.);vL=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'uniform vec3 color;uniform sampler2D tDiffuse;varying vec4 vUv;varying vec2 vL;void main(){vec4 b=texture2DProj(tDiffuse,vUv);float d=length(vL-.5)*2.;gl_FragColor=vec4(b.rgb*color,smoothstep(1.,.12,d));\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
};
/* soft round sprite, generated once */
let SPRITE = null;
function spriteTex(T) {
  if (SPRITE) return SPRITE;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,240,210,.55)'); gr.addColorStop(1, 'rgba(255,220,160,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  SPRITE = new T.CanvasTexture(c);
  return SPRITE;
}

/* points that drift, twinkle and catch a light beam; bokeh discs when big */
function dustMaterial(T, o) {
  return new T.ShaderMaterial({
    transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPx: { value: 1 }, uSize: { value: o.size || 1 }, uAlpha: { value: o.alpha || 0.7 }, uBeam: { value: new T.Vector3(0, 0, 0) }, uBeamR: { value: o.beamR || 1.8 }, uRing: { value: o.ring || 0 }, uRise: { value: o.rise || 0.02 }, uSpan: { value: o.span || 8 } },
    vertexShader:
      'attribute float aSeed;uniform float uTime,uPx,uSize,uBeamR,uRise,uSpan;uniform vec3 uBeam;varying float vA;' +
      'void main(){vec3 p=position;float s=aSeed*6.2831;' +
      'p.x+=sin(uTime*.09+s)*.35;p.z+=cos(uTime*.07+s*2.3)*.25;p.y+=sin(uTime*.06+s*1.7)*.4+uTime*uRise*(.4+aSeed);' +
      'p.y=mod(p.y-uBeam.y+uSpan*.5,uSpan)-uSpan*.5+uBeam.y;' +
      'vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;' +
      'float d=length(p.xz-uBeam.xz);float beam=1.-smoothstep(uBeamR*.4,uBeamR,d);' +
      'vA=(.18+.82*pow(.5+.5*sin(uTime*(.35+aSeed*.6)+s*7.),3.))*(.22+.78*beam);' +
      'gl_PointSize=uPx*uSize*(1.1+aSeed*2.4)*(7./-mv.z);}',
    fragmentShader:
      'uniform float uAlpha,uRing;varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);' +
      'float a=smoothstep(.5,.0,d);float ring=smoothstep(.5,.42,d)*smoothstep(.3,.44,d);a=mix(a,a*.5+ring*.6,uRing);' +
      'gl_FragColor=vec4(1.,.85,.6,a*vA*uAlpha);}'
  });
}
function dustPoints(T, n, box, seed, mat) {
  const pos = new Float32Array(n * 3), sd = new Float32Array(n), r = rng(seed);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = box[0] + r() * (box[1] - box[0]); pos[i * 3 + 1] = box[2] + r() * (box[3] - box[2]); pos[i * 3 + 2] = box[4] + r() * (box[5] - box[4]);
    sd[i] = r();
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new T.BufferAttribute(sd, 1));
  const p = new T.Points(g, mat); p.frustumCulled = false;
  return p;
}
/* a cone of light from above */
function lightShaft(T, o) {
  const g = new T.CylinderGeometry(o.top || 0.15, o.bottom || 1.8, o.h || 9, 48, 1, true);
  g.translate(0, -(o.h || 9) / 2, 0);
  const m = new T.ShaderMaterial({
    transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    uniforms: { uTime: { value: 0 }, uI: { value: o.i || 0.32 }, uCol: { value: new T.Color(o.color || 0xffd9a0) } },
    vertexShader: 'varying vec2 vUv;varying vec3 vN,vV;void main(){vUv=uv;vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'uniform float uTime,uI;uniform vec3 uCol;varying vec2 vUv;varying vec3 vN,vV;' +
      'void main(){float e=pow(abs(dot(vN,vV)),2.2);float y=vUv.y;float along=smoothstep(0.,.55,y)*smoothstep(1.,.86,y);' +
      'float st=.62+.38*sin(vUv.x*37.+uTime*.25)*sin(vUv.x*13.-uTime*.17+y*3.);' +
      'gl_FragColor=vec4(uCol,e*along*st*uI);}'
  });
  const mesh = new T.Mesh(g, m);
  mesh.renderOrder = 5;
  return mesh;
}

/* ================= the key: one design, shared by the 3D model and the still ================= */
const KEY = (() => {
  const lobes = [[0, 0.30, 0.36], [Math.PI / 2, 0.30, 0.36], [Math.PI, 0.30, 0.36], [3 * Math.PI / 2, 0.30, 0.36]];
  for (let k = 0; k < 4; k++) lobes.push([Math.PI / 4 + k * Math.PI / 2, 0.47, 0.1]);
  const rOut = a => { let b = 0; for (const [p, d, r] of lobes) { const s = Math.sin(a - p), c = Math.cos(a - p), q = r * r - d * d * s * s; if (q >= 0) b = Math.max(b, d * c + Math.sqrt(q)); } return b; };
  const ring = (fn, n, sc) => { const o = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, r = fn(a) * (sc || 1); o.push([Math.cos(a) * r, Math.sin(a) * r]); } return o; };
  const tear = (a, t, r, l) => { const o = []; for (let i = 0; i < 36; i++) { const u = i / 36 * Math.PI * 2; let x = Math.cos(u) * r; const y = Math.sin(u) * r; if (x > 0) x *= l; o.push([x * Math.cos(a) - y * Math.sin(a) + Math.cos(a) * t, x * Math.sin(a) + y * Math.cos(a) + Math.sin(a) * t]); } return o; };
  const holes = [];
  for (let k = 0; k < 3; k++) { const a = k * Math.PI / 2; holes.push(tear(a, rOut(a) * 0.85 - 0.02, 0.034, 2.2)); }
  for (let k = 0; k < 4; k++) holes.push(tear(Math.PI / 4 + k * Math.PI / 2, 0.5, 0.026, 1.8));
  return {
    rOut, ring, holes, INNER: 0.7, MED: 0.27, bowY: 1.4,
    V: [[-0.19, 0.16], [-0.06, 0.16], [-0.06, 0.135], [-0.095, 0.135], [0.01, -0.10], [0.115, 0.135], [0.08, 0.135], [0.08, 0.16], [0.185, 0.16], [0.185, 0.135], [0.155, 0.135], [0.02, -0.185], [-0.01, -0.185], [-0.15, 0.135], [-0.19, 0.135]],
    bit: [[0, -0.98], [0.42, -0.98], [0.44, -1.0], [0.44, -1.08], [0.33, -1.08], [0.33, -1.15], [0.49, -1.15], [0.51, -1.17], [0.51, -1.29], [0.38, -1.29], [0.38, -1.37], [0.46, -1.37], [0.48, -1.39], [0.48, -1.52], [0.46, -1.54], [0, -1.54]],
    lathe: (() => {
      const p = [[0, -1.74], [0.05, -1.735], [0.078, -1.71], [0.088, -1.66], [0.088, -0.95], [0.106, -0.93], [0.106, -0.875], [0.088, -0.86]];
      [-0.66, -0.46, -0.26].forEach(y => p.push([0.088, y - 0.012], [0.078, y], [0.088, y + 0.012]));
      p.push([0.088, -0.02], [0.108, 0.02], [0.126, 0.08], [0.108, 0.14], [0.088, 0.18], [0.088, 0.28], [0.078, 0.29], [0.088, 0.30],
        [0.088, 0.36], [0.106, 0.39], [0.15, 0.44], [0.172, 0.49], [0.156, 0.53], [0.12, 0.56], [0.118, 0.6], [0.142, 0.62], [0.166, 0.66], [0.172, 0.7], [0.13, 0.75], [0.07, 0.79], [0, 0.8]);
      return p;
    })()
  };
})();

function keySVG() {
  const s = 100, by = KEY.bowY;
  const P = pts => pts.map((p, i) => (i ? 'L' : 'M') + (p[0] * s).toFixed(1) + ',' + (-p[1] * s).toFixed(1)).join('') + 'Z';
  const at = (pts, dy) => pts.map(p => [p[0], p[1] + dy]);
  const bow = P(at(KEY.ring(KEY.rOut, 200), by)) + P(at(KEY.ring(KEY.rOut, 200, KEY.INNER), by).reverse()) + KEY.holes.map(h => P(at(h, by).reverse())).join('');
  const med = P(at(KEY.ring(() => KEY.MED, 90), by)) + P(at(KEY.V, by).reverse());
  let br = '';
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + k * Math.PI / 2, r0 = KEY.MED - 0.01, r1 = KEY.rOut(a) * KEY.INNER + 0.02, w = 0.018, ca = Math.cos(a), sa = Math.sin(a);
    br += P(at([[ca * r0 - sa * w, sa * r0 + ca * w], [ca * r1 - sa * w, sa * r1 + ca * w], [ca * r1 + sa * w, sa * r1 - ca * w], [ca * r0 + sa * w, sa * r0 - ca * w]], by));
  }
  const right = KEY.lathe, left = KEY.lathe.slice().reverse().map(p => [-p[0], p[1]]);
  const top = (by + 0.66 + 0.1) * -s;
  return '<svg class="key-svg" viewBox="-120 -260 240 470" role="img" aria-label="' + esc(X(T.keyAlt)) + '">' +
    '<defs>' +
      '<linearGradient id="kg-sh" x1="0" x2="1"><stop offset="0" stop-color="#4a3418"/><stop offset=".3" stop-color="#e2c180"/><stop offset=".48" stop-color="#fff3cf"/><stop offset=".68" stop-color="#b08643"/><stop offset="1" stop-color="#3c2a12"/></linearGradient>' +
      '<linearGradient id="kg-bw" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fbe9b8"/><stop offset=".4" stop-color="#cf9f55"/><stop offset=".72" stop-color="#6e4f22"/><stop offset="1" stop-color="#e8c784"/></linearGradient>' +
      '<radialGradient id="kg-md" cx=".4" cy=".35"><stop offset="0" stop-color="#fff2c8"/><stop offset=".6" stop-color="#d6aa62"/><stop offset="1" stop-color="#8a6630"/></radialGradient>' +
      '<radialGradient id="kg-glow"><stop offset="0" stop-color="#e9c48a" stop-opacity=".3"/><stop offset="1" stop-color="#cfae6e" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="kg-beam" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffdca6" stop-opacity=".22"/><stop offset="1" stop-color="#ffdca6" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="kg-pl" cy=".3"><stop offset="0" stop-color="#2a221a"/><stop offset="1" stop-color="#0b0a08"/></radialGradient>' +
    '</defs>' +
    '<path d="M-30,-260 L30,-260 L150,210 L-150,210Z" fill="url(#kg-beam)"/>' +
    '<ellipse cx="0" cy="-70" rx="120" ry="190" fill="url(#kg-glow)"/>' +
    '<ellipse cx="0" cy="196" rx="112" ry="16" fill="url(#kg-pl)" stroke="#cfae6e" stroke-opacity=".55" stroke-width=".8"/>' +
    '<g transform="translate(0,-14) rotate(-13)">' +
      '<path d="' + P(right.concat(left)) + '" fill="url(#kg-sh)"/>' +
      '<path d="' + P(KEY.bit) + '" fill="url(#kg-bw)" stroke="#f3dca0" stroke-opacity=".5" stroke-width=".8"/>' +
      '<path d="' + bow + '" fill="url(#kg-bw)" fill-rule="evenodd" stroke="#fbe7b5" stroke-opacity=".6" stroke-width=".8"/>' +
      '<path d="' + br + '" fill="#b98f4b"/>' +
      '<path d="' + med + '" fill="url(#kg-md)" fill-rule="evenodd" stroke="#5c421d" stroke-opacity=".5" stroke-width=".8"/>' +
      '<circle cx="0" cy="' + top.toFixed(1) + '" r="10" fill="none" stroke="url(#kg-bw)" stroke-width="5.5"/>' +
    '</g></svg>';
}

/* ================= the key: the 3D scene ================= */
let key = null;
function keyStage(on) {
  app.classList.toggle('on-land', on);
  if (key && key.active) key.active(on);
}

async function initKey() {
  keyHost.innerHTML = '<div class="key-fallback">' + keySVG() + '</div>';
  key = { frame() {}, unlock: null };
  if (!glOK()) { app.classList.add('no-gl'); return; }
  try {
    const T = await loadThree();
    key = makeKey(T);
    keyStage(route.name === 'land');
  } catch (e) {
    console.warn('The Vault: 3D key unavailable, showing the still.', e && e.message);
    app.classList.add('no-gl');
    key = { frame() {}, unlock: null };
  }
}

function buildKeyModel(T, mats) {
  const body = new T.Group();
  const v2 = p => new T.Vector2(p[0], p[1]);
  const { gold, bright, brushed } = mats;
  /* shaft and collar */
  body.add(new T.Mesh(new T.LatheGeometry(KEY.lathe.map(v2), 72), brushed));
  /* the bow: lobed rosette, pierced with teardrops */
  const bs = new T.Shape(KEY.ring(KEY.rOut, 260).map(v2));
  bs.holes.push(new T.Path(KEY.ring(KEY.rOut, 200, KEY.INNER).map(v2)));
  KEY.holes.forEach(h => bs.holes.push(new T.Path(h.map(v2))));
  const D = 0.11;
  const bowG = new T.ExtrudeGeometry(bs, { depth: D, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.022, bevelSegments: 3, curveSegments: 6 });
  bowG.translate(0, 0, -D / 2);
  const bow = new T.Group(); bow.position.y = KEY.bowY; body.add(bow);
  bow.add(new T.Mesh(bowG, gold));
  /* beaded rims, front and back, following the outline */
  const rim = (fn, sc, z, r) => {
    const pts = KEY.ring(fn, 160, sc).map(p => new T.Vector3(p[0], p[1], z));
    return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts, true), 320, r, 6, true), bright);
  };
  const zf = D / 2 + 0.03;
  [zf, -zf].forEach(z => { bow.add(rim(KEY.rOut, 0.955, z, 0.011)); bow.add(rim(KEY.rOut, KEY.INNER * 1.05, z, 0.009)); });
  /* the medallion, with the V pierced through it */
  const ms = new T.Shape(KEY.ring(() => KEY.MED, 96).map(v2));
  ms.holes.push(new T.Path(KEY.V.map(v2)));
  const mg = new T.ExtrudeGeometry(ms, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.014, bevelSegments: 3, curveSegments: 6 });
  mg.translate(0, 0, -0.035);
  bow.add(new T.Mesh(mg, bright));
  const medRim = new T.TorusGeometry(KEY.MED + 0.01, 0.013, 10, 96);
  [0.06, -0.06].forEach(z => { const m = new T.Mesh(medRim, gold); m.position.z = z; bow.add(m); });
  /* four fine bridges between medallion and bow */
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + k * Math.PI / 2, r0 = KEY.MED, r1 = KEY.rOut(a) * KEY.INNER + 0.01, len = r1 - r0;
    const b = new T.Mesh(new T.BoxGeometry(0.034, len, 0.05), gold);
    b.position.set(Math.cos(a) * (r0 + len / 2), Math.sin(a) * (r0 + len / 2), 0);
    b.rotation.z = a - Math.PI / 2;
    bow.add(b);
  }
  /* finial loop */
  const top = KEY.bowY + 0.66;
  const fin = new T.Mesh(new T.TorusGeometry(0.1, 0.03, 16, 48), gold); fin.position.y = top + 0.11; body.add(fin);
  const knob = new T.Mesh(new T.SphereGeometry(0.045, 20, 12), bright); knob.position.y = top + 0.0; body.add(knob);
  /* bead rings on the collar */
  [[0.172, 0.49, 0.016], [0.17, 0.7, 0.014], [0.106, -0.9, 0.012]].forEach(([r, y, t]) => { const m = new T.Mesh(new T.TorusGeometry(r, t, 12, 64), bright); m.rotation.x = Math.PI / 2; m.position.y = y; body.add(m); });
  /* the bit, with its cut wards and a slot */
  const bitS = new T.Shape(KEY.bit.map(v2));
  bitS.holes.push(new T.Path([[0.18, -1.21], [0.27, -1.21], [0.27, -1.3], [0.18, -1.3]].map(v2)));
  const bitG = new T.ExtrudeGeometry(bitS, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.016, bevelSize: 0.012, bevelSegments: 2 });
  bitG.translate(0, 0, -0.05);
  body.add(new T.Mesh(bitG, gold));
  body.position.y = -0.25;
  return body;
}

function makeKey(T) {
  const canvas = document.createElement('canvas');
  canvas.className = 'key-gl';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', X(T_('keyAlt')));
  const renderer = new T.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
  renderer.toneMapping = T.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = T.SRGBColorSpace;

  const scene = new T.Scene();
  scene.background = new T.Color(0x070605);
  scene.environment = studioEnv(T, renderer);
  scene.environmentIntensity = 0.62;
  const camera = new T.PerspectiveCamera(30, 1, 0.05, 80);

  /* backdrop: a warm glow behind the key, falling to black */
  const back = new T.Mesh(new T.PlaneGeometry(40, 30), new T.ShaderMaterial({
    depthWrite: false,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec2 vUv;void main(){vec2 c=(vUv-vec2(.5,.56))*vec2(1.33,1.);float d=length(c);vec3 a=vec3(.062,.046,.031),b=vec3(.016,.013,.011);gl_FragColor=vec4(mix(a,b,smoothstep(0.,.42,d)),1.);}'
  }));
  back.position.set(0, 1, -9); scene.add(back);

  /* the plinth: dark stone, gold inlay, a mirror-dark top */
  const plY = -1.98;
  const stone = new T.MeshPhysicalMaterial({ color: 0x120f0c, roughness: 0.5, metalness: 0.1, clearcoat: 0.4, clearcoatRoughness: 0.35 });
  const inlay = new T.MeshPhysicalMaterial({ color: 0xd9b06a, metalness: 1, roughness: 0.25, emissive: 0x3a2508, emissiveIntensity: 0.12 });
  const plinth = new T.Group(); scene.add(plinth);
  const p1 = new T.Mesh(new T.CylinderGeometry(1.34, 1.37, 0.2, 120), stone); p1.position.y = plY - 0.1; plinth.add(p1);
  const p2 = new T.Mesh(new T.CylinderGeometry(1.56, 1.6, 0.08, 120), new T.MeshStandardMaterial({ color: 0x0f0c0a, roughness: 0.75, metalness: 0.1 })); p2.position.y = plY - 0.24; plinth.add(p2);
  [[1.34, plY, 0.011], [1.56, plY - 0.2, 0.008]].forEach(([r, y, t]) => { const m = new T.Mesh(new T.TorusGeometry(r, t, 8, 160), inlay); m.rotation.x = Math.PI / 2; m.position.y = y; plinth.add(m); });
  let mirror = null;
  const topCap = new T.Mesh(new T.CircleGeometry(1.335, 120), new T.MeshPhysicalMaterial({ color: 0x0c0a08, roughness: 0.18, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 }));
  topCap.rotation.x = -Math.PI / 2; topCap.position.y = plY + 0.002;
  plinth.add(topCap);
  /* the floor is a dark mirror: the key and the plinth reflect in it, fading into the room */
  const floorY = plY - 0.285;
  const addMirror = () => {
    if (mirror || Q.level < 2) return;
    mirror = new T.Reflector(new T.CircleGeometry(7, 64), { textureWidth: 640, textureHeight: 640, color: 0x5a4e42, clipBias: 0.003, shader: FADE_MIRROR });
    mirror.material.transparent = true; mirror.material.depthWrite = false;
    mirror.rotation.x = -Math.PI / 2; mirror.position.y = floorY - 0.002; scene.add(mirror);
  };
  addMirror();
  const floor = new T.Mesh(new T.CircleGeometry(9, 64), new T.ShaderMaterial({
    transparent: true, depthWrite: false,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec2 vUv;void main(){float d=length(vUv-.5)*2.;gl_FragColor=vec4(.02,.016,.013,.38*smoothstep(1.,.2,d));}'
  }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = floorY; floor.renderOrder = 3; scene.add(floor);

  /* light: a warm shaft from above, warm key, cool rim */
  const spot = new T.SpotLight(0xffe4c0, 60, 0, 0.42, 0.9, 2);
  spot.position.set(-0.6, 7.2, 1.4); scene.add(spot); scene.add(spot.target); spot.target.position.set(0, 0.2, 0);
  const keyL = new T.DirectionalLight(0xffe2c0, 0.9); keyL.position.set(-3, 3, 5); scene.add(keyL);
  const rim = new T.DirectionalLight(0xccd9ff, 2.2); rim.position.set(4, 1.5, -4); scene.add(rim);
  const rim2 = new T.DirectionalLight(0xffb36b, 1.4); rim2.position.set(-4, -1, -3); scene.add(rim2);
  const shafts = [lightShaft(T, { bottom: 1.7, h: 10, i: 0.075 }), lightShaft(T, { bottom: 0.9, h: 10, i: 0.05, color: 0xffe6c2 })];
  shafts[0].position.set(-0.6, 7.6, 0.2); shafts[0].rotation.z = -0.06;
  shafts[1].position.set(0.5, 7.6, -0.6); shafts[1].rotation.z = 0.1;
  shafts.forEach(s => scene.add(s));

  /* the key */
  const mats = {
    gold: new T.MeshPhysicalMaterial({ color: 0xd8b06c, metalness: 1, roughness: 0.25, clearcoat: 0.45, clearcoatRoughness: 0.15 }),
    bright: new T.MeshPhysicalMaterial({ color: 0xe9c88a, metalness: 1, roughness: 0.18, clearcoat: 0.7, clearcoatRoughness: 0.08 }),
    brushed: new T.MeshPhysicalMaterial({ color: 0xd9b373, metalness: 1, roughness: 0.3, anisotropy: 0.75, anisotropyRotation: Math.PI / 2, clearcoat: 0.35, clearcoatRoughness: 0.2 })
  };
  const pivot = new T.Group(), spin = new T.Group();
  scene.add(pivot); pivot.add(spin);
  const body = buildKeyModel(T, mats);
  spin.add(body);
  const keyY = 0.62;

  /* dust in the beam, and a few out-of-focus motes near the lens */
  const dm = dustMaterial(T, { size: 1, alpha: 0.85, beamR: 1.9, span: 9 });
  dm.uniforms.uBeam.value.set(-0.3, 1, 0);
  const dust = dustPoints(T, 520, [-3.2, 3.2, -3.5, 5.5, -3, 2.2], 11, dm);
  scene.add(dust);
  const bm = dustMaterial(T, { size: 9, alpha: 0.13, ring: 0.7, beamR: 6, span: 9, rise: 0.01 });
  const bokeh = dustPoints(T, 16, [-2.4, 2.4, -2.5, 3.5, 3.0, 5.0], 5, bm);
  scene.add(bokeh);

  /* unlock: a burst of gold */
  const NB = 280, bp = new Float32Array(NB * 3), bv = new Float32Array(NB * 3), bs2 = new Float32Array(NB);
  const rb = rng(77);
  for (let i = 0; i < NB; i++) {
    const th = rb() * Math.PI * 2, ph = Math.acos(2 * rb() - 1), sp = 1.2 + rb() * 3.4;
    bv[i * 3] = Math.sin(ph) * Math.cos(th) * sp; bv[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * sp; bv[i * 3 + 2] = Math.abs(Math.cos(ph)) * sp * 0.6 + 0.4;
    bs2[i] = rb();
  }
  const bg = new T.BufferGeometry();
  bg.setAttribute('position', new T.BufferAttribute(bp, 3));
  bg.setAttribute('aV', new T.BufferAttribute(bv, 3));
  bg.setAttribute('aSeed', new T.BufferAttribute(bs2, 1));
  const burstM = new T.ShaderMaterial({
    transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    uniforms: { uT: { value: -1 }, uO: { value: new T.Vector3() }, uPx: { value: 1 } },
    vertexShader: 'attribute vec3 aV;attribute float aSeed;uniform float uT,uPx;uniform vec3 uO;varying float vA;' +
      'void main(){float t=max(uT,0.);vec3 p=uO+aV*(t*(1.-t*.28))+vec3(0.,-.6*t*t,0.);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;' +
      'vA=uT<0.?0.:(1.-smoothstep(.2,1.3+aSeed*.4,t));gl_PointSize=uPx*(2.+aSeed*5.)*(5./-mv.z);}',
    fragmentShader: 'varying float vA;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);gl_FragColor=vec4(vec3(1.4,1.05,.6)*(1.+a),a*vA);}'
  });
  const burst = new T.Points(bg, burstM); burst.frustumCulled = false; scene.add(burst);

  const pipe = makePipe(T, renderer, scene, camera, { bloom: 0.38, radius: 0.5, thresh: 0.9 });
  pipe.fin.uniforms.uTilt.value = 0.55;
  const guard = perfGuard(level => {
    pipe.size(pipe.w, pipe.h);
    if (level < 2 && mirror) { mirror.visible = false; }
    if (level < 1) { dust.geometry.setDrawRange(0, 220); shafts[1].visible = false; }
  });

  /* motion state */
  const idle = 0.2;
  let ang = 0.7, vel = idle, tiltX = 0, tiltV = 0, dragging = false, lastX = 0, lastY = 0, lastT = 0;
  let parX = 0, parY = 0, parTX = 0, parTY = 0, devX = 0, devY = 0;
  let t = 0, running = false, raf = 0, prev = 0, isActive = false, onScreen = true, ready = false;
  let unlockT = -1, unlockDone = null, unlockFrom = 0;
  let dist = 12, look = new T.Vector3(0, 0.3, 0), fitY = 0;
  pivot.rotation.z = 0.2;

  function fit(copy) {
    const w = keyHost.clientWidth || 1, h = keyHost.clientHeight || 1;
    pipe.size(w, h);
    dm.uniforms.uPx.value = bm.uniforms.uPx.value = burstM.uniforms.uPx.value = qDpr(Q.level);
    camera.aspect = w / h;
    const copyTop = copy && copy.offsetHeight ? h - copy.offsetHeight - (parseFloat(getComputedStyle(copy).bottom) || 0) : h * 0.62;
    const barH = $('.scr-land:not(.leave) .pill') ? 112 : 58;
    const free = Math.max(170, copyTop - barH + 6);
    /* the key and the plinth top must fit the space between the bar and the words */
    const content = 5.75;
    const visH = Math.max(content / (free / h), 3.3 / camera.aspect);
    dist = visH / 2 / Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    const centerPx = barH + free / 2;
    const midY = 0.12;                                    /* the middle of key + plinth, in world units */
    fitY = midY - (h / 2 - centerPx) / h * visH;          /* where the camera should look so that midY sits at centerPx */
    pipe.fin.uniforms.uFocus.value = 1 - centerPx / h;
    camera.updateProjectionMatrix();
    if (!running) draw(0);
  }
  function draw(dt) { pipe.render(dt); }

  const tmp = new T.Vector3();
  function update(dt) {
    t += dt;
    if (!dragging) {
      vel += (idle - vel) * (1 - Math.exp(-dt * 0.9));
      ang += vel * dt;
      tiltV += (-tiltX * 16 - tiltV * 5.5) * dt; tiltX += tiltV * dt;
      parTX *= Math.exp(-dt * 1.5); parTY *= Math.exp(-dt * 1.5);
    }
    parX += (parTX + devX - parX) * (1 - Math.exp(-dt * 4));
    parY += (parTY + devY - parY) * (1 - Math.exp(-dt * 4));
    let fly = 0, turn = 0, flash = 0;
    if (unlockT >= 0) {
      unlockT += dt;
      const u = unlockT;
      fly = eio(cl(u / 0.85));
      turn = eback(cl((u - 0.5) / 0.45));
      if (u > 0.92 && burstM.uniforms.uT.value < 0) {
        burstM.uniforms.uT.value = 0;
        pivot.localToWorld(tmp.set(0, KEY.bowY - 0.25, 0.1));
        burstM.uniforms.uO.value.copy(tmp);
      }
      if (burstM.uniforms.uT.value >= 0) burstM.uniforms.uT.value += dt;
      flash = cl((u - 0.88) / 0.18) * (1 - cl((u - 1.15) / 0.5));
      if (u > 1.32 && unlockDone) { const f = unlockDone; unlockDone = null; f(); }
    }
    /* the key: idle turn and bob — or the unlock: it squares up, comes to the lens, and turns a quarter, as in a lock */
    spin.rotation.y = unlockT >= 0 ? lerp(unlockFrom, Math.round(unlockFrom / (Math.PI * 2)) * Math.PI * 2, fly) + turn * Math.PI / 2 : ang;
    pivot.rotation.x = lerp(tiltX, 0, fly);
    pivot.rotation.z = lerp(0.2 + Math.sin(t * 0.33) * 0.025, 0, fly);
    pivot.position.set(0, lerp(keyY + Math.sin(t * 0.55) * 0.07, fitY + 0.15, fly), lerp(0, dist - 8.5, fly));
    /* camera: slow dolly, a breath of orbit, parallax from drag and tilt */
    const push = unlockT > 0.95 ? eio(cl((unlockT - 0.95) / 0.5)) : 0;
    const d = dist * (1 + 0.035 * Math.sin(t * 0.16)) - push * 5.2;
    const orb = 0.06 * Math.sin(t * 0.11) + parX * 0.22;
    camera.position.set(Math.sin(orb) * d * (1 - fly), fitY + lerp(1.9 + parY * 0.6, 0, fly), Math.cos(orb) * d);
    look.set(0, fitY, 0);
    camera.lookAt(look);
    rim.position.x = 4 * Math.cos(t * 0.21); rim.position.z = -4 + Math.sin(t * 0.21) * 1.5;
    spot.intensity = 60 * (0.92 + 0.08 * Math.sin(t * 0.7)) * (1 + flash * 2);
    shafts.forEach(s => { s.material.uniforms.uTime.value = t; });
    dm.uniforms.uTime.value = bm.uniforms.uTime.value = t;
    pipe.bloom.strength = 0.38 + flash * 1.2 + fly * 0.25;
    pipe.fin.uniforms.uFlash.value = flash * 0.42;
    pipe.fin.uniforms.uTilt.value = 0.55 * (1 - fly);
    if (mirror) mirror.visible = Q.level >= 2;
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - prev) / 1000 || 0); prev = now;
    guard(dt);
    update(dt); draw(dt);
    if (!ready) { ready = true; app.classList.add('gl-ready'); }
  }
  function sync() {
    const want = isActive && onScreen && !document.hidden && (!reduced() || unlockT >= 0);
    if (want && !running) { running = true; prev = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!want && running) { running = false; cancelAnimationFrame(raf); }
    if (!want && isActive && !document.hidden) { update(0); draw(0); if (!ready) { ready = true; app.classList.add('gl-ready'); } }
  }
  document.addEventListener('visibilitychange', sync);
  if (RM.addEventListener) RM.addEventListener('change', sync);
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; sync(); }).observe(keyHost);
  new ResizeObserver(() => fit($('.scr-land:not(.leave) .land-copy'))).observe(keyHost);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); app.classList.add('no-gl'); running = false; cancelAnimationFrame(raf); });

  /* drag to turn, with inertia; the camera leans with the hand */
  keyHost.addEventListener('pointerdown', e => {
    if (unlockT >= 0) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); vel = 0;
    if (keyHost.setPointerCapture) keyHost.setPointerCapture(e.pointerId);
    app.classList.add('turned');
    askTilt();
  });
  keyHost.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now = performance.now(), dts = Math.max(1, now - lastT) / 1000;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    ang += dx * 0.0105;
    vel = vel * 0.6 + (dx * 0.0105 / dts) * 0.4;
    tiltX = Math.max(-0.45, Math.min(0.45, tiltX + dy * 0.004));
    parTX = Math.max(-1, Math.min(1, parTX + dx * 0.004)); parTY = Math.max(-1, Math.min(1, parTY - dy * 0.003));
    lastX = e.clientX; lastY = e.clientY; lastT = now;
    if (!running) { update(0); draw(0); }
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    if (performance.now() - lastT > 90) vel = 0;
    vel = Math.max(-9, Math.min(9, vel));
    if (reduced()) { vel = 0; tiltX = 0; update(0); draw(0); }
  };
  keyHost.addEventListener('pointerup', end);
  keyHost.addEventListener('pointercancel', end);
  onTilt((gx, gy) => { devX = gx; devY = gy; });

  keyHost.appendChild(canvas);
  fit($('.scr-land .land-copy'));
  /* testing aid: render the unlock at a fixed moment */
  window.__v5unlockAt = u => { isActive = false; sync(); unlockFrom = ang; unlockT = u; burstM.uniforms.uT.value = u > 0.92 ? u - 0.92 : -1; if (u > 0.92) { pivot.updateMatrixWorld(); } update(0); draw(0); };

  return {
    frame(copy) { fit(copy); },
    active(on) {
      isActive = on;
      if (on) {
        unlockT = -1; burstM.uniforms.uT.value = -1; pipe.fin.uniforms.uFlash.value = 0;
        if (Q.level >= 2) addMirror();
      }
      sync();
    },
    unlock() {
      if (reduced() || (!running && !isActive)) return Promise.resolve();
      return new Promise(res => {
        dragging = false;
        unlockFrom = ang;
        unlockT = 0; unlockDone = res;
        sync();
        setTimeout(() => { if (unlockDone) { unlockDone = null; res(); } }, 2400);
      });
    }
  };
}

/* device tilt, shared by the key and the cards (iOS asks permission on the first touch) */
const tiltSubs = [];
let tiltAsked = false, tiltOn = false, tilt0 = null;
function onTilt(f) { tiltSubs.push(f); if (!tiltOn) startTilt(); }
function startTilt() {
  if (tiltOn || typeof DeviceOrientationEvent === 'undefined') return;
  if (typeof DeviceOrientationEvent.requestPermission === 'function') return; /* needs a gesture: see askTilt */
  tiltOn = true;
  addEventListener('deviceorientation', e => {
    if (e.beta == null || reduced()) return;
    if (!tilt0) tilt0 = [e.beta, e.gamma];
    const gx = Math.max(-1, Math.min(1, (e.gamma - tilt0[1]) / 30)), gy = Math.max(-1, Math.min(1, (e.beta - tilt0[0]) / 30));
    tiltSubs.forEach(f => f(gx, gy));
  });
}
function askTilt() {
  if (tiltAsked || typeof DeviceOrientationEvent === 'undefined' || typeof DeviceOrientationEvent.requestPermission !== 'function') return;
  tiltAsked = true;
  DeviceOrientationEvent.requestPermission().then(s => { if (s === 'granted') { DeviceOrientationEvent.requestPermission = null; startTilt(); } }).catch(() => {});
}
const T_ = k => T[k];
/* ================= motion sequences (SVG, code-driven) ================= */
const NS = 'http://www.w3.org/2000/svg';
function E(tag, at, parent, text) {
  const e = document.createElementNS(NS, tag);
  for (const k in at) e.setAttribute(k, at[k]);
  if (text != null) e.textContent = text;
  /* Persian runs keep their order: centred text is laid out right-to-left */
  if (tag === 'text' && fa() && at['text-anchor'] === 'middle') { e.setAttribute('direction', 'rtl'); e.style.unicodeBidi = 'plaintext'; }
  if (parent) parent.appendChild(e);
  return e;
}
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eio = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eout = x => 1 - Math.pow(1 - x, 3);
const eback = x => { const c = 1.5; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const ph = (t, a, b, f = eio) => f(cl((t - a) / (b - a)));
const lerp = (a, b, p) => a + (b - a) * p;
function rng(s) { return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
function drawable(p) { const L = p.getTotalLength() + 1; p.style.strokeDasharray = L + ' ' + L; p.style.strokeDashoffset = L; return k => { p.style.strokeDashoffset = L * (1 - k); }; }
const font = () => (fa() ? 'Noto Naskh Arabic' : 'Archivo');
const dfont = () => (fa() ? 'Noto Naskh Arabic' : 'Bodoni Moda');

function svgRoot(stage, slice) {
  const svg = E('svg', { viewBox: '0 0 390 780', preserveAspectRatio: slice ? 'xMidYMid slice' : 'xMidYMid meet', class: 'seq' }, stage);
  const defs = E('defs', {}, svg);
  defs.innerHTML =
    '<linearGradient id="sg-gold" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F4DFA6"/><stop offset=".5" stop-color="#CFAE6E"/><stop offset="1" stop-color="#8E6C33"/></linearGradient>' +
    '<radialGradient id="sg-glow"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".9"/><stop offset=".35" stop-color="#CFAE6E" stop-opacity=".35"/><stop offset="1" stop-color="#CFAE6E" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="sg-warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E9A65A" stop-opacity=".5"/><stop offset=".5" stop-color="#7A4A1C" stop-opacity=".18"/><stop offset="1" stop-color="#0A0908" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="sg-flame" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFFDF2"/><stop offset=".35" stop-color="#FFE3A0"/><stop offset=".8" stop-color="#E8953A" stop-opacity=".7"/><stop offset="1" stop-color="#E8953A" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="sg-petal" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stop-color="#8E6C33" stop-opacity=".35"/><stop offset=".55" stop-color="#E9D2A0" stop-opacity=".75"/><stop offset="1" stop-color="#FFF6E2" stop-opacity=".95"/></linearGradient>' +
    '<linearGradient id="sg-ivory" x1="0" x2="1"><stop offset="0" stop-color="#d9cdb5"/><stop offset=".5" stop-color="#fff8ea"/><stop offset="1" stop-color="#cbbd9f"/></linearGradient>' +
    '<linearGradient id="sg-shine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff6dd" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>';
  return svg;
}
function ovCard(ov, html) { ov.innerHTML = '<div class="ov-card">' + html + '</div>'; return $('.ov-card', ov); }
const show01 = (el, p, dy = 14) => { el.style.opacity = p; el.style.transform = 'translateY(' + ((1 - p) * dy).toFixed(1) + 'px)'; };

const SCENES = {
  /* a night map of Tehran in gold; the route; the car; Reza; the countdown */
  car(stage, ov, q) {
    const svg = svgRoot(stage, true);
    const cam = E('g', {}, svg);
    const r = rng(19), draws = [];
    const add = (el, a, b) => draws.push([drawable(el), a, b]);
    for (let k = 0; k < 3; k++) {
      let d = '';
      for (let x = -40; x <= 430; x += 5) {
        const y = 128 + k * 20 + Math.sin(x * 0.021 + k) * 13 * (1 - k * 0.2) + Math.sin(x * 0.057 + k * 3) * 6 + Math.sin(x * 0.13 + k) * 2.5;
        d += (x === -40 ? 'M' : 'L') + x + ',' + y.toFixed(1);
      }
      add(E('path', { d, class: 'mp-mtn', opacity: (0.5 - k * 0.13).toFixed(2) }, cam), 0.1 + k * 0.2, 1.7 + k * 0.2);
    }
    /* the street grid: one path per street, broken into blocks */
    const lights = E('g', { class: 'mp-lights', opacity: 0 }, cam);
    for (let i = 0; i < 30; i++) {
      const x = -30 + i * 16 + r() * 6;
      let y = 186 + r() * 50, d = '';
      while (y < 820) { const len = 30 + r() * 120; if (r() > 0.22) d += 'M' + x.toFixed(1) + ',' + y.toFixed(1) + 'L' + (x - len * 0.05).toFixed(1) + ',' + (y + len).toFixed(1); y += len + 3 + r() * 9; }
      add(E('path', { d, class: i % 4 ? 'mp-st' : 'mp-st mp-st2' }, cam), 0.15 + r() * 0.8, 1.3 + r() * 0.9);
    }
    for (let j = 0; j < 36; j++) {
      const y = 200 + j * 17 + r() * 6;
      let x = -40 + r() * 30, d = '';
      while (x < 430) { const len = 26 + r() * 110; if (r() > 0.25) { d += 'M' + x.toFixed(1) + ',' + y.toFixed(1) + 'L' + (x + len).toFixed(1) + ',' + (y + len * 0.03).toFixed(1); if (r() > 0.55) E('circle', { cx: (x + r() * len).toFixed(1), cy: y.toFixed(1), r: (0.6 + r() * 0.9).toFixed(2), class: r() > 0.7 ? 'tw' : '', style: 'animation-delay:' + (-r() * 4).toFixed(2) + 's' }, lights); } x += len + 3 + r() * 10; }
      add(E('path', { d, class: j % 5 ? 'mp-st' : 'mp-st mp-st2' }, cam), 0.2 + r() * 0.8, 1.4 + r() * 0.9);
    }
    ['M120,190 C112,300 104,420 98,800', 'M262,196 C250,300 228,400 205,800', 'M-20,402 C120,392 260,384 420,376', 'M196,470 C260,476 330,480 420,488', 'M140,470 C146,560 150,680 152,800', 'M-20,560 C60,548 130,540 196,536', 'M300,200 C318,320 330,520 336,800']
      .forEach((d, i) => add(E('path', { d, class: 'mp-hw' }, cam), 0.5 + i * 0.12, 1.9 + i * 0.12));
    E('path', { d: 'M35,548 l12,-6 M41,557 l12,-6', class: 'mp-hw' }, cam);
    E('path', { d: 'M18,402 l5,-14 l5,14 M20,396 h6', class: 'mp-hw' }, cam);
    const places = { club: [232, 330], home: [306, 232], thr: [52, 552], ika: [150, 760], office: [214, 430] };
    const lbl = { home: ['Niavaran', 'نیاوران'], thr: ['Mehrabad', 'مهرآباد'], ika: ['Imam Khomeini Airport', 'فرودگاه امام'], office: ['Vanak', 'ونک'] };
    const routes = {
      home: [[232, 330], [246, 300], [256, 268], [262, 244], [290, 238], [306, 232]],
      thr: [[232, 330], [229, 366], [222, 400], [150, 404], [116, 410], [110, 470], [80, 520], [52, 552]],
      ika: [[232, 330], [229, 366], [222, 400], [214, 470], [200, 540], [176, 640], [160, 720], [150, 760]],
      office: [[232, 330], [268, 340], [262, 384], [232, 396], [222, 400], [214, 430]]
    };
    const pts = routes[q.o.to] || routes.thr;
    const rd = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join('');
    const route = E('path', { d: rd, class: 'mp-route' }, cam);
    const trail = E('path', { d: rd, class: 'mp-trail' }, cam);
    const dRoute = drawable(route), L = trail.getTotalLength();
    trail.style.strokeDasharray = L + ' ' + L; trail.style.strokeDashoffset = L;
    const club = E('g', { transform: 'translate(' + places.club + ')' }, cam);
    const pulse = E('circle', { r: 10, class: 'mp-pulse' }, club);
    E('circle', { r: 26, fill: 'url(#sg-glow)', opacity: 0.6 }, club);
    E('path', { d: 'M-6,-6 L6,-6 L0,7Z', class: 'mp-v' }, club);
    const clubT = E('text', { x: 16, y: 5, class: 'mp-lbl hi', 'text-anchor': 'start', 'font-family': font() }, club, X(['The Vault', 'والت']));
    const dst = places[q.o.to] || places.thr;
    const dest = E('g', { transform: 'translate(' + dst + ')', opacity: 0 }, cam);
    E('circle', { r: 7, class: 'mp-dest' }, dest);
    E('circle', { r: 2.5, fill: '#CFAE6E' }, dest);
    E('text', { x: 0, y: 24, class: 'mp-lbl hi', 'text-anchor': 'middle', 'font-family': font() }, dest, X(lbl[q.o.to] || lbl.thr));
    const decor = E('g', { opacity: 0 }, cam);
    E('text', { x: 150, y: 176, class: 'mp-lbl', 'text-anchor': 'middle', 'font-family': font() }, decor, X(['Alborz', 'البرز']));
    E('text', { x: 236, y: 214, class: 'mp-lbl', 'text-anchor': 'middle', 'font-family': font() }, decor, X(['Tajrish', 'تجریش']));
    E('text', { x: 40, y: 380, class: 'mp-lbl', 'text-anchor': 'middle', 'font-family': font() }, decor, X(['Azadi', 'آزادی']));
    E('text', { x: 268, y: 640, class: 'mp-lbl', 'text-anchor': 'middle', 'font-family': font() }, decor, X(['Bazaar', 'بازار']));
    if (q.o.to !== 'thr') E('text', { x: 52, y: 580, class: 'mp-lbl', 'text-anchor': 'middle', 'font-family': font() }, decor, X(['Mehrabad', 'مهرآباد']));
    if (q.o.to !== 'home') E('text', { x: 314, y: 222, class: 'mp-lbl', 'text-anchor': 'middle', 'font-family': font() }, decor, X(['Niavaran', 'نیاوران']));
    const car = E('g', { opacity: 0 }, cam);
    E('ellipse', { cx: 18, cy: 0, rx: 22, ry: 9, fill: 'url(#sg-glow)', opacity: 0.85 }, car);
    E('rect', { x: -8, y: -4.2, width: 16, height: 8.4, rx: 3, fill: 'url(#sg-gold)' }, car);
    E('rect', { x: -2, y: -3, width: 6, height: 6, rx: 1.5, fill: '#2a2116' }, car);
    const mins = PEOPLE.mins[q.o.to] || 30;
    const card = ovCard(ov,
      '<div class="ov-row"><span class="ov-av" aria-hidden="true">' + (fa() ? 'ر' : 'R') + '</span><span class="ov-who"><span class="ov-n">' + X(PEOPLE.driver) + '</span><span class="ov-m">' + (q.o.kind === 'van' ? X(['Black van', 'ون مشکی']) : X(['Black sedan', 'سدان مشکی'])) + '</span></span>' + plate() + '</div>' +
      '<div class="ov-eta"><span class="ov-l">' + X(LIVE.car.cd) + '</span><span class="ov-big"></span></div>');
    const big = $('.ov-big', card);
    const target = Math.max(0, Math.round((q.at - q.t0) / 1000));
    show01(card, 0);
    let cx = 195, cy = 420;
    return {
      dur: 7.4,
      frame(t) {
        draws.forEach(d => d[0](ph(t, d[1], d[2])));
        decor.style.opacity = ph(t, 1.2, 2.4) * 0.8;
        lights.style.opacity = ph(t, 0.8, 2.6);
        dRoute(ph(t, 1.9, 3.2));
        dest.style.opacity = ph(t, 2.8, 3.4);
        pulse.setAttribute('r', (8 + ((t * 0.8) % 1) * 22).toFixed(1));
        pulse.style.opacity = (1 - ((t * 0.8) % 1)) * ph(t, 0.4, 1);
        clubT.style.opacity = ph(t, 0.6, 1.3);
        const k = ph(t, 3.0, 6.6);
        const at = trail.getPointAtLength(L * k), ah = trail.getPointAtLength(Math.min(L, L * k + 2));
        const a = Math.atan2(ah.y - at.y, ah.x - at.x) * 180 / Math.PI;
        car.setAttribute('transform', 'translate(' + at.x.toFixed(1) + ',' + at.y.toFixed(1) + ') rotate(' + a.toFixed(1) + ')');
        car.style.opacity = ph(t, 2.9, 3.3);
        trail.style.strokeDashoffset = L * (1 - k);
        const f = ph(t, 2.2, 4.6);
        const fx = lerp(cx, at.x, f), fy = lerp(cy, at.y, f);
        const s = 1 + 0.32 * ph(t, 2.0, 7.2);
        cam.setAttribute('transform', 'translate(195,' + (360).toFixed(0) + ') scale(' + s.toFixed(3) + ') translate(' + (-fx).toFixed(1) + ',' + (-fy).toFixed(1) + ')');
        show01(card, ph(t, 4.2, 5.0, eout));
        const e = ph(t, 4.4, 7.0, eout);
        big.textContent = liveLeft(q);
      }
    };
  },

  /* a place card set, a name written, a candle lit */
  table(stage, ov, q) {
    const svg = svgRoot(stage, false);
    const warm = E('ellipse', { cx: 300, cy: 330, rx: 360, ry: 420, fill: 'url(#sg-warm)', opacity: 0 }, svg);
    const g = E('g', {}, svg);
    const draws = [];
    const add = (el, a, b) => draws.push([drawable(el), a, b]);
    add(E('path', { d: 'M-10,520 L400,520', class: 'ln strong' }, g), 0, 1.2);
    for (let i = 0; i < 5; i++) { const x = 30 + i * 82; add(E('path', { d: 'M' + x + ',522 C' + (x - 4) + ',600 ' + (x - 10 + i) + ',700 ' + (x - 14 + i * 2) + ',800', class: 'ln drape' }, g), 0.3 + i * 0.05, 1.6 + i * 0.05); }
    add(E('ellipse', { cx: 195, cy: 600, rx: 128, ry: 30, class: 'ln' }, g), 0.5, 1.8);
    add(E('ellipse', { cx: 195, cy: 600, rx: 92, ry: 21, class: 'ln' }, g), 0.7, 1.9);
    add(E('ellipse', { cx: 195, cy: 600, rx: 70, ry: 15, class: 'ln faint' }, g), 0.9, 2.0);
    add(E('path', { d: 'M48,574 L36,650 M42,574 L40,590 M48,574 L46,590 M54,574 L52,590', class: 'ln' }, g), 1.0, 2.0);
    add(E('path', { d: 'M342,574 C350,600 350,620 348,650 M342,574 L340,612', class: 'ln' }, g), 1.1, 2.1);
    /* the place card */
    const pc = E('g', { opacity: 0 }, g);
    E('ellipse', { cx: 195, cy: 512, rx: 104, ry: 7, fill: '#000', opacity: 0.5 }, pc);
    E('path', { d: 'M110,410 L280,410 L276,404 L114,404Z', fill: '#2a241b' }, pc);
    E('path', { d: 'M104,508 L286,508 L280,410 L110,410Z', fill: '#17130e', stroke: 'url(#sg-gold)', 'stroke-width': 1.2 }, pc);
    E('path', { d: 'M114,500 L276,500 L271,418 L119,418Z', fill: 'none', stroke: '#CFAE6E', 'stroke-opacity': 0.45, 'stroke-width': 0.8 }, pc);
    const lightOnCard = E('path', { d: 'M104,508 L286,508 L280,410 L110,410Z', fill: 'url(#sg-warm)', opacity: 0 }, pc);
    const clipId = 'nm-clip';
    const clip = E('clipPath', { id: clipId }, svg);
    const cr = E('rect', { x: 110, y: 420, width: 0, height: 80 }, clip);
    const nm = E('text', { x: 195, y: 466, 'text-anchor': 'middle', class: 'pc-name', 'font-family': dfont(), 'clip-path': 'url(#' + clipId + ')' }, pc, X(['Mr Farahani', 'آقای فراهانی']));
    if (!fa()) nm.setAttribute('font-style', 'italic');
    const tm = new Date(q.at);
    const sm = E('text', { x: 195, y: 491, 'text-anchor': 'middle', class: 'pc-small', 'font-family': font(), opacity: 0 }, pc, X(['Table seven — ', 'میز هفت — ']) + hm(tm));
    /* the candle */
    const cd = E('g', {}, g);
    const cdraws = [];
    [E('path', { d: 'M298,508 C304,500 332,500 338,508', class: 'ln' }, cd), E('path', { d: 'M312,500 L314,482 L322,482 L324,500', class: 'ln' }, cd), E('path', { d: 'M303,482 L333,482', class: 'ln' }, cd)]
      .forEach((p, i) => cdraws.push([drawable(p), 0.6 + i * 0.15, 1.6 + i * 0.15]));
    const stick = E('rect', { x: 310, y: 332, width: 16, height: 150, rx: 2, fill: 'url(#sg-ivory)', opacity: 0 }, cd);
    E('path', { d: 'M318,332 L318,324', stroke: '#3a2d1c', 'stroke-width': 1.4 }, cd);
    const halo = E('circle', { cx: 318, cy: 312, r: 80, fill: 'url(#sg-glow)', opacity: 0 }, cd);
    const flame = E('path', { d: 'M0,0 C6,-6 6,-16 0,-30 C-6,-16 -6,-6 0,0Z', fill: 'url(#sg-flame)', opacity: 0 }, cd);
    const spark = E('circle', { cx: 318, cy: 322, r: 2, fill: '#FFF2D0', opacity: 0 }, cd);
    const card = ovCard(ov, '<div class="ov-row"><span class="ov-who"><span class="ov-n">' + X(PEOPLE.rest) + '</span><span class="ov-m">' + summary(REQ('table'), q.o) + '</span></span></div>');
    show01(card, 0);
    return {
      dur: 7,
      frame(t) {
        draws.forEach(d => d[0](ph(t, d[1], d[2])));
        cdraws.forEach(d => d[0](ph(t, d[1], d[2])));
        stick.style.opacity = ph(t, 1.2, 2.0);
        const p = ph(t, 1.5, 2.7, eout);
        pc.style.opacity = p;
        pc.setAttribute('transform', 'translate(0,' + ((1 - p) * -46).toFixed(1) + ')');
        const w = ph(t, 2.7, 4.1, x => x);
        if (fa()) { cr.setAttribute('x', (280 - 170 * w).toFixed(1)); }
        cr.setAttribute('width', (170 * w).toFixed(1));
        sm.style.opacity = ph(t, 3.8, 4.5);
        spark.style.opacity = t > 4.05 && t < 4.4 ? 1 - (t - 4.05) / 0.35 : 0;
        const fl = ph(t, 4.2, 4.8, eback);
        const fk = 1 + Math.sin(t * 13) * 0.05 + Math.sin(t * 23.7) * 0.035;
        flame.setAttribute('transform', 'translate(318,323) scale(' + (fl * (1 + Math.sin(t * 9) * 0.03)).toFixed(3) + ',' + (fl * fk).toFixed(3) + ')');
        flame.style.opacity = cl(fl);
        halo.style.opacity = ph(t, 4.3, 5.6) * (0.85 + Math.sin(t * 11) * 0.05);
        warm.style.opacity = ph(t, 4.3, 6.4);
        lightOnCard.style.opacity = ph(t, 4.4, 6.2) * 0.8;
        g.setAttribute('transform', 'translate(195,470) scale(' + (1 + 0.06 * ph(t, 0, 7, x => x)).toFixed(3) + ') translate(-195,-470)');
        show01(card, ph(t, 5.0, 5.8, eout));
      }
    };
  },

  /* a ticket printed, then torn */
  tickets(stage, ov, q) {
    const svg = svgRoot(stage, false);
    const draws = [];
    const add = (el, a, b) => draws.push([drawable(el), a, b]);
    add(E('rect', { x: 66, y: 140, width: 258, height: 58, rx: 12, class: 'ln' }, svg), 0, 0.9);
    add(E('path', { d: 'M90,190 L300,190', class: 'ln strong' }, svg), 0.3, 1.0);
    const led = E('circle', { cx: 300, cy: 162, r: 3, fill: '#CFAE6E', opacity: 0 }, svg);
    const clip = E('clipPath', { id: 'tk-clip' }, svg);
    E('rect', { x: 0, y: 191, width: 390, height: 700 }, clip);
    const outer = E('g', { 'clip-path': 'url(#tk-clip)' }, svg);
    const tk = E('g', {}, outer);
    const main = E('g', {}, tk), stub = E('g', {}, tk);
    const W = 200, X0 = 95, H1 = 236, H2 = 92;
    const notch = 'M' + X0 + ',0 L' + (X0 + W) + ',0 L' + (X0 + W) + ',' + (H1 - 9) + ' A9,9 0 0 0 ' + (X0 + W) + ',' + H1 + ' L' + X0 + ',' + H1 + ' A9,9 0 0 0 ' + X0 + ',' + (H1 - 9) + 'Z';
    E('path', { d: notch, fill: '#16120d', stroke: 'url(#sg-gold)', 'stroke-width': 1.2 }, main);
    E('rect', { x: X0 + 10, y: 10, width: W - 20, height: H1 - 24, fill: 'none', stroke: '#CFAE6E', 'stroke-opacity': 0.35 }, main);
    const hall = X(PEOPLE.hall[q.o.kind] || PEOPLE.hall.concert), show = X(PEOPLE.show[q.o.kind] || PEOPLE.show.concert);
    const c = X0 + W / 2;
    E('text', { x: c, y: 42, 'text-anchor': 'middle', class: 'tk-hall', 'font-family': font() }, main, fa() ? hall : hall.toUpperCase());
    const sp = show.split(' — ');
    E('text', { x: c, y: 82, 'text-anchor': 'middle', class: 'tk-show', 'font-family': dfont(), 'font-style': fa() ? 'normal' : 'italic' }, main, sp[0]);
    if (sp[1]) E('text', { x: c, y: 106, 'text-anchor': 'middle', class: 'tk-sub', 'font-family': font() }, main, sp[1]);
    E('text', { x: c, y: 132, 'text-anchor': 'middle', class: 'tk-sub', 'font-family': font() }, main, dayFmt(new Date(q.at), true) + ' — ' + hm(new Date(q.at)));
    E('path', { d: 'M' + (X0 + 24) + ',150 L' + (X0 + W - 24) + ',150', stroke: '#CFAE6E', 'stroke-opacity': 0.4 }, main);
    const n = Number(q.o.n);
    const cR = X0 + W * (fa() ? 0.76 : 0.26), cS = X0 + W * (fa() ? 0.34 : 0.7);
    E('text', { x: cR, y: 176, 'text-anchor': 'middle', class: 'tk-k', 'font-family': font() }, main, X(['ROW', 'ردیف']));
    E('text', { x: cR, y: 212, 'text-anchor': 'middle', class: 'tk-big', 'font-family': dfont() }, main, fa() ? N(6) : 'F');
    E('text', { x: cS, y: 176, 'text-anchor': 'middle', class: 'tk-k', 'font-family': font() }, main, X(['SEATS', 'صندلی']));
    E('text', { x: cS, y: 212, 'text-anchor': 'middle', class: 'tk-big', 'font-family': dfont() }, main, n > 1 ? (fa() ? N(11) + ' تا ' + N(10 + n) : '11–' + (10 + n)) : N(11));
    const sd = 'M' + X0 + ',' + (H1 + 2) + ' A9,9 0 0 1 ' + X0 + ',' + (H1 + 11) + ' L' + X0 + ',' + (H1 + H2) + ' L' + (X0 + W) + ',' + (H1 + H2) + ' L' + (X0 + W) + ',' + (H1 + 11) + ' A9,9 0 0 1 ' + (X0 + W) + ',' + (H1 + 2) + 'Z';
    E('path', { d: sd, fill: '#16120d', stroke: 'url(#sg-gold)', 'stroke-width': 1.2 }, stub);
    E('path', { d: 'M' + (X0 + 12) + ',' + (H1 + 1) + ' L' + (X0 + W - 12) + ',' + (H1 + 1), stroke: '#CFAE6E', 'stroke-dasharray': '2 4', 'stroke-opacity': 0.8 }, tk);
    E('text', { x: c, y: H1 + 34, 'text-anchor': 'middle', class: 'tk-k', 'font-family': font() }, stub, fa() ? 'ورود ' + N(n) + ' نفر' : 'ADMIT ' + ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'][n - 1]);
    const r = rng(5); let bx = X0 + 30;
    while (bx < X0 + W - 32) { const w = 1 + Math.floor(r() * 3); E('rect', { x: bx, y: H1 + 46, width: w, height: 30, fill: '#CFAE6E', opacity: 0.85 }, stub); bx += w + 1 + Math.floor(r() * 3); }
    const card = ovCard(ov, '<div class="ov-row"><span class="ov-who"><span class="ov-n">' + hall + '</span><span class="ov-m">' + seatsTxt(q.o) + '</span></span></div>');
    show01(card, 0);
    const total = H1 + H2;
    return {
      dur: 7,
      frame(t) {
        draws.forEach(d => d[0](ph(t, d[1], d[2])));
        led.style.opacity = t > 0.8 && t < 3.6 ? 0.4 + 0.6 * (Math.sin(t * 14) > 0 ? 1 : 0) : ph(t, 3.6, 3.8) * 0.5;
        const segs = 9, raw = ph(t, 1.0, 3.6, x => x) * segs, i = Math.floor(raw), f = raw - i;
        const pr = i >= segs ? 1 : (i + eout(cl(f * 1.6))) / segs;
        const topY = 190 - total + (total + 26) * pr;
        const lift = ph(t, 4.6, 6.2);
        tk.setAttribute('transform', 'translate(0,' + (topY - lift * 30).toFixed(1) + ')');
        const tear = ph(t, 3.9, 4.9, eback);
        stub.setAttribute('transform', 'translate(' + (tear * 18).toFixed(1) + ',' + (tear * 40).toFixed(1) + ') rotate(' + (tear * 9).toFixed(2) + ' ' + (X0 + W) + ' ' + H1 + ')');
        main.setAttribute('transform', 'rotate(' + (-lift * 3).toFixed(2) + ' ' + c + ' ' + H1 + ')');
        outer.setAttribute('clip-path', t > 4.2 ? '' : 'url(#tk-clip)');
        show01(card, ph(t, 5.0, 5.8, eout));
      }
    };
  },

  /* petals assembling into a peony */
  flowers(stage, ov, q) {
    const svg = svgRoot(stage, false);
    const cx = 195, cy = 300;
    const draws = [];
    const add = (el, a, b) => draws.push([drawable(el), a, b]);
    const glow = E('circle', { cx, cy, r: 170, fill: 'url(#sg-glow)', opacity: 0 }, svg);
    const stem = E('g', {}, svg);
    add(E('path', { d: 'M195,370 C190,420 200,470 193,560', class: 'ln strong' }, stem), 3.6, 4.6);
    add(E('path', { d: 'M194,420 C160,400 138,412 126,438 C150,444 176,438 194,420Z', class: 'ln' }, stem), 4.0, 5.0);
    add(E('path', { d: 'M196,462 C232,442 256,454 266,480 C240,486 214,480 196,462Z', class: 'ln' }, stem), 4.2, 5.2);
    add(E('path', { d: 'M193,512 C171,498 151,492 147,508 C151,524 173,522 193,512 C215,498 235,492 239,508 C235,524 213,522 193,512Z M193,512 L177,552 M193,512 L211,554', class: 'ln strong' }, stem), 4.6, 5.6);
    const tag = E('g', { opacity: 0 }, svg);
    E('path', { d: 'M211,552 L238,560', stroke: '#CFAE6E', 'stroke-opacity': 0.6 }, tag);
    E('rect', { x: 232, y: 548, width: 96, height: 46, rx: 3, fill: '#17130e', stroke: 'url(#sg-gold)' }, tag);
    E('text', { x: 280, y: 577, 'text-anchor': 'middle', class: 'pc-small', 'font-family': dfont(), 'font-style': fa() ? 'normal' : 'italic' }, tag, X(['For you', 'برای شما']));
    const bloom = E('g', {}, svg);
    const rings = [[5, 4, 26, 11], [8, 16, 36, 15], [11, 30, 48, 19], [13, 46, 58, 23], [16, 62, 64, 26]];
    const petals = [];
    const r = rng(42);
    rings.forEach((rg, ri) => {
      for (let k = 0; k < rg[0]; k++) {
        const a = k / rg[0] * 360 + ri * 17;
        const L = rg[2], W = rg[3];
        const p = E('path', { d: 'M0,0 C' + W + ',' + (-L * 0.25) + ' ' + (W * 0.85) + ',' + (-L) + ' 0,' + (-L) + ' C' + (-W * 0.85) + ',' + (-L) + ' ' + (-W) + ',' + (-L * 0.25) + ' 0,0Z', class: 'petal', opacity: 0 }, null);
        petals.push({ el: p, ri, a, rad: rg[1], sx: (r() - 0.5) * 700, sy: (r() - 0.5) * 900, sr: (r() - 0.5) * 540, delay: (rings.length - 1 - ri) * 0.42 + r() * 0.5 });
      }
    });
    petals.slice().sort((A, B) => B.ri - A.ri).forEach(p => bloom.appendChild(p.el));
    const core = E('g', { opacity: 0 }, bloom);
    for (let k = 0; k < 14; k++) { const a = k * 2.4, d = 3 + k * 0.9; E('circle', { cx: Math.cos(a) * d, cy: Math.sin(a) * d, r: 1.6, fill: '#FFE7B0' }, core); }
    const card = ovCard(ov, '<div class="ov-row"><span class="ov-who"><span class="ov-n">' + X(q.o.what === 'gift' ? ['A gift, chosen and wrapped', 'هدیه‌ای انتخاب‌شده و بسته‌بندی‌شده'] : ['White peonies, by hand', 'صدتومانی سفید، دست‌چین']) + '</span><span class="ov-m">' + X(O[q.o.for]) + ' — ' + X(O[q.o.budget]) + '</span></span></div>');
    show01(card, 0);
    return {
      dur: 7.2,
      frame(t) {
        draws.forEach(d => d[0](ph(t, d[1], d[2])));
        petals.forEach(p => {
          const k = ph(t, 0.3 + p.delay, 1.5 + p.delay, eout);
          const rad = p.a * Math.PI / 180;
          const tx = Math.sin(rad) * p.rad, ty = -Math.cos(rad) * p.rad;
          const x = lerp(p.sx, tx, k), y = lerp(p.sy, ty, k), rot = lerp(p.a + p.sr, p.a, k);
          const sc = lerp(0.6, 1, k) * (1 + 0.04 * ph(t, 4, 7));
          p.el.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') rotate(' + rot.toFixed(1) + ') scale(' + sc.toFixed(3) + ')');
          p.el.style.opacity = cl(k * 1.4);
        });
        core.style.opacity = ph(t, 3.6, 4.4);
        bloom.setAttribute('transform', 'translate(' + cx + ',' + cy + ') rotate(' + lerp(-24, 0, ph(t, 0, 5.4)).toFixed(2) + ')');
        glow.style.opacity = ph(t, 3.2, 5.2) * 0.7;
        tag.style.opacity = ph(t, 5.2, 5.9);
        show01(card, ph(t, 5.2, 6.0, eout));
      }
    };
  },

  /* a flight arc, a boarding pass, a hotel key card */
  travel(stage, ov, q) {
    const svg = svgRoot(stage, false);
    const code = PEOPLE.code[q.o.to] || 'IST';
    const arcD = 'M44,214 Q195,70 346,214';
    const arcBase = E('path', { d: arcD, class: 'ln faint', 'stroke-dasharray': '2 6' }, svg);
    const arc = E('path', { d: arcD, class: 'ln strong' }, svg);
    const dArc = drawable(arc), AL = arc.getTotalLength();
    arcBase.style.opacity = 0;
    const o1 = E('g', { opacity: 0 }, svg);
    E('circle', { cx: 44, cy: 214, r: 3.5, fill: '#CFAE6E' }, o1); E('circle', { cx: 346, cy: 214, r: 3.5, fill: '#CFAE6E' }, o1);
    E('text', { x: 44, y: 240, 'text-anchor': 'middle', class: 'mp-lbl hi', 'font-family': 'Archivo' }, o1, 'IKA');
    E('text', { x: 346, y: 240, 'text-anchor': 'middle', class: 'mp-lbl hi', 'font-family': 'Archivo' }, o1, code);
    const plane = E('path', { d: 'M8,0 L-6,-2 L-10,-9 L-13,-9 L-10,-1.5 L-14,-1 L-16,-4 L-18,-4 L-17,0 L-18,4 L-16,4 L-14,1 L-10,1.5 L-13,9 L-10,9 L-6,2Z', fill: 'url(#sg-gold)', opacity: 0 }, svg);
    /* boarding pass */
    const bp = E('g', {}, svg);
    E('rect', { x: 40, y: 290, width: 310, height: 176, rx: 14, fill: '#16120d', stroke: 'url(#sg-gold)', 'stroke-width': 1.2 }, bp);
    E('path', { d: 'M268,300 L268,456', stroke: '#CFAE6E', 'stroke-dasharray': '2 4', 'stroke-opacity': 0.7 }, bp);
    E('text', { x: 58, y: 318, class: 'tk-k', 'font-family': font(), 'text-anchor': 'start' }, bp, X(['BOARDING PASS', 'کارت پرواز']));
    if (fa()) { bp.lastChild.setAttribute('x', 252); bp.lastChild.setAttribute('text-anchor', 'end'); }
    E('text', { x: 58, y: 372, class: 'bp-code', 'font-family': 'Bodoni Moda' }, bp, 'IKA');
    E('path', { d: 'M136,360 L170,360 M163,354 L170,360 L163,366', stroke: '#CFAE6E', fill: 'none', 'stroke-width': 1.2 }, bp);
    E('text', { x: 178, y: 372, class: 'bp-code', 'font-family': 'Bodoni Moda' }, bp, code);
    E('text', { x: 58, y: 396, class: 'tk-sub', 'font-family': font() }, bp, X(['Tehran', 'تهران']));
    E('text', { x: 178, y: 396, class: 'tk-sub', 'font-family': font() }, bp, X(O[q.o.to]));
    const dep = new Date(q.at);
    const cols = [[['FLIGHT', 'پرواز'], PEOPLE.flight[q.o.to] || 'TK 879', 1], [['DATE', 'تاریخ'], N(new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', { day: 'numeric', month: 'short' }).format(dep))], [['SEAT', 'صندلی'], fa() ? N(2) + 'A' : '2A', 1], [['BOARDS', 'سوار شدن'], hm(new Date(q.at - 30 * 60000))]];
    cols.forEach((c, i) => {
      const x = 58 + i * 52;
      E('text', { x, y: 426, class: 'bp-k', 'font-family': font() }, bp, X(c[0]));
      const v = E('text', { x, y: 448, class: 'bp-v', 'font-family': font() }, bp, c[2] ? N(c[1]) : c[1]);
      if (c[2]) v.setAttribute('direction', 'ltr');
    });
    const r = rng(9);
    for (let i = 0; i < 26; i++) { const y = 306 + i * 5.6; E('rect', { x: 286, y, width: 48, height: 1 + Math.floor(r() * 3), fill: '#CFAE6E', opacity: 0.8 }, bp); }
    /* hotel key card */
    const kc = E('g', {}, svg);
    const kcClip = E('clipPath', { id: 'kc-clip' }, svg);
    E('rect', { x: 130, y: 470, width: 230, height: 144, rx: 12 }, kcClip);
    E('rect', { x: 130, y: 470, width: 230, height: 144, rx: 12, fill: '#1d1812', stroke: 'url(#sg-gold)', 'stroke-width': 1.2 }, kc);
    E('rect', { x: 150, y: 520, width: 34, height: 26, rx: 4, fill: 'url(#sg-gold)' }, kc);
    E('path', { d: 'M150,533 L184,533 M167,520 L167,546 M158,520 L158,546 M176,520 L176,546', stroke: '#6b5026', 'stroke-width': 0.8 }, kc);
    E('path', { d: 'M332,486 L338,486 L335,494Z', fill: '#CFAE6E' }, kc);
    E('text', { x: 150, y: 584, class: 'kc-name', 'font-family': dfont(), 'font-style': fa() ? 'normal' : 'italic' }, kc, X(PEOPLE.hotelName[q.o.to] || PEOPLE.hotelName.ist));
    E('text', { x: 150, y: 602, class: 'bp-k', 'font-family': font() }, kc, X(['ROOM 512', 'اتاق ۵۱۲']));
    if (fa()) { $$('text', kc).forEach(tx => { tx.setAttribute('x', 340); tx.setAttribute('text-anchor', 'end'); }); }
    const shine = E('rect', { x: -120, y: 440, width: 90, height: 200, fill: 'url(#sg-shine)', 'clip-path': 'url(#kc-clip)' }, svg);
    const showKey = true, showPass = q.o.what !== 'hotel';
    const ko = showPass ? 0 : -1.3, wdraws = [];
    if (!showPass) {
      [bp, arc, arcBase, o1, plane].forEach(x => { x.style.display = 'none'; });
      /* a tall arched window, and the view through it */
      const win = E('g', {}, svg);
      svg.insertBefore(win, kc);
      const wd = (d, cls, a, b) => wdraws.push([drawable(E('path', { d, class: cls }, win)), a, b]);
      wd('M95,470 L95,250 A100,100 0 0 1 295,250 L295,470', 'ln strong', 0, 1.6);
      wd('M108,470 L108,252 A87,87 0 0 1 282,252 L282,470', 'ln faint', 0.2, 1.8);
      wd('M195,152 L195,470 M95,330 L295,330', 'ln faint', 0.5, 1.6);
      wd('M108,420 L130,420 L130,398 L146,398 L146,410 L160,410 C160,380 196,380 196,410 L210,410 L210,372 L214,360 L218,372 L218,410 L236,410 L236,392 L256,392 L256,420 L282,420', 'ln', 0.8, 2.2);
      wd('M118,438 L150,438 M170,446 L222,446 M236,438 L270,438 M140,456 L176,456 M206,458 L250,458', 'ln faint', 1.2, 2.3);
      E('circle', { cx: 246, cy: 262, r: 14, fill: 'none', stroke: '#F1D9A2', 'stroke-opacity': 0.8, class: 'moon' }, win);
      E('circle', { cx: 246, cy: 262, r: 46, fill: 'url(#sg-glow)', opacity: 0.35 }, win);
      win.style.opacity = 1;
    }
    const card = ovCard(ov, '<div class="ov-row"><span class="ov-who"><span class="ov-n">' + X(O[q.o.to]) + ' — <bdi dir="ltr">' + N(PEOPLE.flight[q.o.to]) + '</bdi></span><span class="ov-m">' + X(PEOPLE.hotelName[q.o.to]) + (fa() ? '، اتاق ' + N(512) : ', room 512') + '</span></span></div>');
    show01(card, 0);
    return {
      dur: 7.4,
      frame(t) {
        dArc(ph(t, 0.2, 2.6));
        arcBase.style.opacity = ph(t, 0, 0.6) * 0.6;
        o1.style.opacity = ph(t, 0.2, 0.8);
        const k = ph(t, 0.4, 2.8);
        const p = arc.getPointAtLength(AL * k), p2 = arc.getPointAtLength(Math.min(AL, AL * k + 1));
        plane.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ') rotate(' + (Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI).toFixed(1) + ')');
        plane.style.opacity = ph(t, 0.4, 0.7) * (1 - ph(t, 2.8, 3.2));
        const b = ph(t, 1.6, 3.0, eout);
        bp.setAttribute('transform', 'translate(0,' + ((1 - b) * 520).toFixed(1) + ') rotate(' + lerp(-9, -3, b).toFixed(2) + ' 195 380)');
        wdraws.forEach(d => d[0](ph(t, d[1], d[2])));
        const c = ph(t, 3.4 + ko, 4.6 + ko, eout);
        kc.style.display = showKey ? '' : 'none';
        kc.setAttribute('transform', 'translate(' + ((1 - c) * 420).toFixed(1) + ',' + ((1 - c) * 20).toFixed(1) + ') rotate(' + lerp(16, 5, c).toFixed(2) + ' 245 540)');
        const sh = ph(t, 4.9 + ko, 6.1 + ko);
        shine.setAttribute('x', (lerp(80, 400, sh)).toFixed(1));
        shine.setAttribute('transform', 'rotate(' + lerp(16, 5, c).toFixed(2) + ' 245 540) translate(' + ((1 - c) * 420).toFixed(1) + ',0) skewX(-18)');
        shine.style.opacity = showKey && sh > 0 && sh < 1 ? 1 : 0;
        show01(card, ph(t, 5.2, 6.0, eout));
      }
    };
  },

  /* a phone line, pulsing */
  call(stage, ov, q) {
    const svg = svgRoot(stage, false);
    const y0 = 380, xa = 64, xb = 326;
    const draws = [];
    const add = (el, a, b) => draws.push([drawable(el), a, b]);
    const rings = [0, 1, 2].map(() => E('circle', { cx: xb, cy: y0, r: 20, fill: 'none', stroke: '#CFAE6E', 'stroke-width': 1 }, svg));
    E('circle', { cx: xb, cy: y0, r: 60, fill: 'url(#sg-glow)', opacity: 0.4 }, svg);
    const ph1 = E('circle', { cx: xb, cy: y0, r: 22, class: 'ln strong' }, svg);
    add(ph1, 0.1, 0.9);
    const hs = E('path', { d: 'M' + (xb - 9) + ',' + (y0 - 8) + ' c2,-2 5,-2 6,0 l2,4 c1,2 0,3 -2,4 c1,3 3,5 6,6 c1,-2 2,-3 4,-2 l4,2 c2,1 2,4 0,6 c-3,3 -9,2 -14,-3 c-5,-5 -6,-11 -6,-17Z', fill: 'url(#sg-gold)', opacity: 0 }, svg);
    const home = E('g', { opacity: 0 }, svg);
    E('circle', { cx: xa, cy: y0, r: 22, class: 'ln strong' }, home);
    E('path', { d: 'M' + (xa - 7) + ',' + (y0 - 6) + ' L' + (xa + 7) + ',' + (y0 - 6) + ' L' + xa + ',' + (y0 + 8) + 'Z', fill: 'url(#sg-gold)' }, home);
    const lab = E('g', { opacity: 0 }, svg);
    E('text', { x: xa, y: y0 + 50, 'text-anchor': 'middle', class: 'mp-lbl hi', 'font-family': font() }, lab, X(['The house', 'خانه']));
    E('text', { x: xb, y: y0 + 50, 'text-anchor': 'middle', class: 'mp-lbl hi', 'font-family': font() }, lab, X(['You', 'شما']));
    const line = E('path', { d: '', class: 'wave' }, svg);
    const base = E('path', { d: 'M' + (xa + 24) + ',' + y0 + ' L' + (xb - 24) + ',' + y0, class: 'ln faint' }, svg);
    add(base, 0.4, 1.4);
    if (fa()) { /* mirror: the house on the right, «شما» on the left; the words themselves stay readable */
      const mg = E('g', { transform: 'translate(390,0) scale(-1,1)' }, null);
      Array.from(svg.childNodes).forEach(n => { if (n !== lab && n.tagName !== 'defs') mg.appendChild(n); });
      svg.insertBefore(mg, lab);
      $$('text', lab).forEach(tx => tx.setAttribute('x', 390 - Number(tx.getAttribute('x'))));
    }
    const vis = q.o.how === 'visit';
    const card = ovCard(ov,
      '<div class="ov-row"><span class="ov-av" aria-hidden="true">' + (fa() ? 'ل' : 'L') + '</span><span class="ov-who"><span class="ov-n">' + X(PEOPLE.concierge) + '</span><span class="ov-m">' + X(['Your concierge tonight', 'کانسیرژ امشب شما']) + ' — ' + X(HOW[q.o.how]) + '</span></span></div>' +
      '<div class="ov-eta"><span class="ov-l">' + X(vis ? ['At your table in', 'تا سرِ میزتان'] : LIVE.call.cd) + '</span><span class="ov-big"></span></div>');
    const big = $('.ov-big', card);
    const target = Math.max(0, Math.round((q.at - q.t0) / 1000));
    show01(card, 0);
    return {
      dur: 6.8,
      frame(t) {
        draws.forEach(d => d[0](ph(t, d[1], d[2])));
        home.style.opacity = ph(t, 0.2, 0.9);
        lab.style.opacity = ph(t, 0.8, 1.5);
        hs.style.opacity = ph(t, 0.5, 1.1);
        const on = ph(t, 1.2, 1.8);
        let d = '';
        const per = 1.25, travel = 1.1;
        for (let x = xa + 24; x <= xb - 24; x += 2) {
          let y = 0;
          for (let k = 0; k < 6; k++) {
            const born = 1.4 + k * per; if (t < born) continue;
            const pos = xa + 24 + (t - born) / travel * (xb - xa - 48);
            const dx = (x - pos) / 9;
            if (Math.abs(dx) < 4) y += Math.exp(-dx * dx) * Math.sin(dx * 2.6) * 26 * (1 - cl((t - born - travel) / 0.2));
          }
          d += (d ? 'L' : 'M') + x + ',' + (y0 - y * on).toFixed(1);
        }
        line.setAttribute('d', d);
        rings.forEach((rg, i) => {
          let best = 1;
          for (let k = 0; k < 6; k++) { const at = 1.4 + k * per + travel; const u = (t - at - i * 0.18) / 1.3; if (u >= 0 && u < 1) best = Math.min(best, u); }
          rg.setAttribute('r', (22 + best * 36).toFixed(1));
          rg.style.opacity = best < 1 ? (1 - best) * 0.8 : 0;
        });
        show01(card, ph(t, 3.6, 4.4, eout));
        big.textContent = liveLeft(q);
      }
    };
  }
};


/* ================= motion sequences in WebGL ================= */
/* one renderer for all six sequences; each scene is built on demand and disposed when the screen leaves */
const SG = { r: null, canvas: null, env: null, pipe: null };
const FONTS_GL = ['italic 400 120px "Bodoni Moda"', '400 120px "Bodoni Moda"', 'italic 400 64px "Bodoni Moda"', '400 64px "Bodoni Moda"', '700 64px "Bodoni Moda"', '400 64px "Noto Naskh Arabic"', '600 64px "Noto Naskh Arabic"', '400 64px Archivo', '600 64px Archivo'];
const fontsGL = () => Promise.all(FONTS_GL.map(f => (document.fonts ? document.fonts.load(f).catch(() => null) : null)));
const CF = {
  disp: (px, it) => (fa() ? '400 ' + px + 'px "Noto Naskh Arabic"' : (it ? 'italic ' : '') + '400 ' + px + 'px "Bodoni Moda"'),
  txt: (px, w) => (fa() ? (w || 400) + ' ' + px + 'px "Noto Naskh Arabic"' : (w || 400) + ' ' + px + 'px Archivo'),
  lat: (px, w) => (w || 400) + ' ' + px + 'px Archivo',
  bod: (px, it) => (it ? 'italic ' : '') + '400 ' + px + 'px "Bodoni Moda"'
};
function cTex(TH, w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  const tx = new TH.CanvasTexture(c);
  tx.colorSpace = TH.SRGBColorSpace; tx.anisotropy = 8;
  const o = { tx, c, g, w, h, draw(fn) { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); g.direction = fa() ? 'rtl' : 'ltr'; fn(g, w, h); tx.needsUpdate = true; } };
  if (draw) o.draw(draw);
  return o;
}
function drawV(g, cx, cy, size, col) {
  g.save(); g.fillStyle = col; g.beginPath();
  KEY.V.forEach((p, i) => { const x = cx + p[0] / 0.38 * size, y = cy - p[1] / 0.38 * size; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
  g.closePath(); g.fill(); g.restore();
}
function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
/* shrink a font until the text's real ink (italic overhang included) fits maxW */
function fitFont(g, fontOf, size, txt, maxW, sp) {
  let px = size;
  for (; px > 10; px -= 2) {
    g.font = fontOf(px);
    const m = g.measureText(txt), ink = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width);
    if (Math.max(ink, m.width) + (sp || 0) * (Array.from(txt).length - 1) <= maxW) break;
  }
  return px;
}
/* "11–12" with the dash drawn as a rule, so it never depends on the font having the glyph */
function rangeText(g, a, b, x, y, px) {
  const wa = g.measureText(a).width, wb = g.measureText(b).width, dw = px * 0.42, gap = px * 0.1, tot = wa + gap + dw + gap + wb;
  const al = g.textAlign; g.textAlign = 'left';
  let cx = x - tot / 2;
  g.fillText(a, cx, y); cx += wa + gap;
  g.fillRect(cx, y - px * 0.3, dw, Math.max(2, px * 0.055)); cx += dw + gap;
  g.fillText(b, cx, y);
  g.textAlign = al;
}
function spaced(g, txt, x, y, sp) { /* letter-spaced Latin caps, centred on x */
  if (!sp) { g.fillText(txt, x, y); return; }
  const ch = Array.from(txt), ws = ch.map(c => g.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (ch.length - 1);
  const al = g.textAlign; g.textAlign = 'left';
  let cx = al === 'center' ? x - tot / 2 : al === 'right' ? x - tot : x;
  ch.forEach((c, i) => { g.fillText(c, cx, y); cx += ws[i] + sp; });
  g.textAlign = al;
}
function disposeScene(o) {
  o.traverse(m => {
    if (m.geometry) m.geometry.dispose();
    const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
    mats.forEach(mt => { ['map', 'alphaMap', 'emissiveMap', 'roughnessMap', 'metalnessMap', 'bumpMap'].forEach(k => { if (mt[k] && mt[k] !== SPRITE) mt[k].dispose(); }); mt.dispose(); });
  });
}
const GOLD = 0xd6a85c;
/* scenes are composed for a 4:3-ish frame; on a tall phone the camera steps back along its line of sight */
const fitK = (C, base, max) => Math.min(max || 1.75, Math.max(1, (base || 0.72) / C.aspect));
function aim(cam, look, K) { cam.position.sub(look).multiplyScalar(K).add(look); cam.lookAt(look); }

async function makeSeqGL(stage, ov, q, still) {
  const TH = await loadThree();
  await fontsGL();
  if (!SG.r) {
    SG.canvas = document.createElement('canvas'); SG.canvas.className = 'seq-gl';
    SG.r = new TH.WebGLRenderer({ canvas: SG.canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    SG.r.toneMapping = TH.NeutralToneMapping; SG.r.toneMappingExposure = 1;
    SG.r.outputColorSpace = TH.SRGBColorSpace;
    SG.r.localClippingEnabled = true;
    SG.r.shadowMap.enabled = true; SG.r.shadowMap.type = TH.PCFShadowMap;
    SG.env = studioEnv(TH, SG.r);
    SG.pipe = makePipe(TH, SG.r, new TH.Scene(), new TH.PerspectiveCamera(), { bloom: 0.7, radius: 0.6, thresh: 0.82 });
    SG.guard = perfGuard(() => { SG.pipe.size(SG.pipe.w, SG.pipe.h); });
    SG.canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); GL_OK = false; });
  }
  stage.appendChild(SG.canvas);
  const lbl = document.createElement('div'); lbl.className = 'lbls'; stage.appendChild(lbl);
  const w = stage.clientWidth || 390, h = stage.clientHeight || 844;
  SG.pipe.size(w, h);
  const labels = [];
  const C = {
    TH, q, ov, w, h, aspect: w / h, env: SG.env, still: !!still,
    label(text, v, cls) { const el = document.createElement('span'); el.className = 'lbl ' + (cls || ''); el.textContent = text; lbl.appendChild(el); const L = { el, v: v.clone(), o: 0 }; labels.push(L); return L; }
  };
  const sc = GL_SCENES[q.id](TH, C);
  window.__v5scene = sc.scene; /* testing aid */
  if (!sc.scene.environment) sc.scene.environment = SG.env;
  const P = SG.pipe;
  P.rp.scene = sc.scene; P.rp.camera = sc.camera;
  P.bloom.strength = sc.bloom != null ? sc.bloom : 0.7;
  P.bloom.threshold = sc.thresh != null ? sc.thresh : 0.82;
  P.bloom.radius = 0.6;
  P.fin.uniforms.uTilt.value = sc.tilt != null ? sc.tilt : 0.45;
  P.fin.uniforms.uFocus.value = sc.focus != null ? sc.focus : 0.5;
  P.fin.uniforms.uBlur.value = (sc.blur != null ? sc.blur : 2.6) * (sc.blur != null ? qDpr(Q.level) : 1);
  P.fin.uniforms.uB0.value = sc.b0 != null ? sc.b0 : 0.16; P.fin.uniforms.uB1.value = sc.b1 != null ? sc.b1 : 0.55;
  P.fin.uniforms.uFlash.value = 0; P.fin.uniforms.uFade.value = 1; P.fin.uniforms.uVig.value = 0.95;
  const pv = new TH.Vector3();
  let last = performance.now();
  const ro = new ResizeObserver(() => {
    const W = stage.clientWidth, H = stage.clientHeight; if (!W || !H) return;
    C.w = W; C.h = H; P.size(W, H); sc.camera.aspect = W / H; sc.camera.updateProjectionMatrix(); if (sc.resize) sc.resize(W / H); ctl.frame(ctl.t, true);
  });
  ro.observe(stage);
  const ctl = {
    dur: sc.dur, t: 0,
    frame(t, still) {
      const now = performance.now(), dt = still ? 0 : Math.min(0.05, (now - last) / 1000); last = now;
      if (!still) SG.guard(dt);
      ctl.t = t;
      sc.frame(t, dt);
      sc.camera.updateMatrixWorld();
      labels.forEach(L => {
        pv.copy(L.v).project(sc.camera);
        const vis = pv.z < 1 && L.o > 0.01 && (-pv.y * 0.5 + 0.5) * C.h > 170; /* never under the caption */
        L.el.style.opacity = vis ? L.o : 0;
        if (vis) L.el.style.transform = 'translate(' + ((pv.x * 0.5 + 0.5) * C.w).toFixed(1) + 'px,' + ((-pv.y * 0.5 + 0.5) * C.h).toFixed(1) + 'px)';
      });
      P.render(dt);
    },
    dispose() {
      ro.disconnect();
      if (sc.dispose) sc.dispose();
      disposeScene(sc.scene);
      lbl.remove();
      if (SG.canvas.parentNode === stage) SG.canvas.remove();
    }
  };
  return ctl;
}

/* a flat ribbon along a polyline (x,z) at height y; aU runs 0..1 along it */
function ribbonGeo(TH, pts, wdt, y) {
  const pos = [], u = [], idx = [];
  let total = 0; const acc = [0];
  for (let i = 1; i < pts.length; i++) { total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); acc.push(total); }
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let dx = b[0] - a[0], dz = b[1] - a[1]; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
    const nx = -dz * wdt / 2, nz = dx * wdt / 2;
    pos.push(pts[i][0] + nx, y, pts[i][1] + nz, pts[i][0] - nx, y, pts[i][1] - nz);
    u.push(acc[i] / total, acc[i] / total);
    if (i) { const k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
  }
  const g = new TH.BufferGeometry();
  g.setAttribute('position', new TH.Float32BufferAttribute(pos, 3));
  g.setAttribute('aU', new TH.Float32BufferAttribute(u, 1));
  g.setIndex(idx);
  return g;
}
/* many separate quads in one geometry (streets) */
function quadsGeo(TH, quads, y) {
  const pos = [], idx = [];
  quads.forEach(([x0, z0, x1, z1], i) => { pos.push(x0, y, z0, x1, y, z0, x1, y, z1, x0, y, z1); const k = i * 4; idx.push(k, k + 2, k + 1, k, k + 3, k + 2); });
  const g = new TH.BufferGeometry(); g.setAttribute('position', new TH.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g;
}
const addMat = (TH, col, k, op) => new TH.MeshBasicMaterial({ color: new TH.Color(col).multiplyScalar(k), transparent: true, opacity: op == null ? 1 : op, blending: TH.AdditiveBlending, depthWrite: false, side: TH.DoubleSide });
function beacon(TH, h, col) {
  const g = new TH.CylinderGeometry(0.03, 0.15, h, 24, 1, true); g.translate(0, h / 2, 0);
  return new TH.Mesh(g, new TH.ShaderMaterial({
    transparent: true, depthWrite: false, blending: TH.AdditiveBlending, side: TH.DoubleSide,
    uniforms: { uI: { value: 0 }, uCol: { value: new TH.Color(col || 0xffcf8a) } },
    vertexShader: 'varying vec2 vUv;varying vec3 vN,vV;void main(){vUv=uv;vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'uniform float uI;uniform vec3 uCol;varying vec2 vUv;varying vec3 vN,vV;void main(){float e=pow(abs(dot(vN,vV)),1.6);gl_FragColor=vec4(uCol*2.,e*pow(1.-vUv.y,1.6)*uI);}'
  }));
}
function glowSprite(TH, col, s, k) {
  const sp = new TH.Sprite(new TH.SpriteMaterial({ map: spriteTex(TH), color: new TH.Color(col).multiplyScalar(k || 1), transparent: true, blending: TH.AdditiveBlending, depthWrite: false }));
  sp.scale.set(s, s, s);
  return sp;
}

const GL_SCENES = {
  /* ---------- a car: Tehran at night, in gold ---------- */
  car(TH, C) {
    const q = C.q, scene = new TH.Scene();
    /* fog matched to the sky's horizon, so the far ground melts into it (no dark band) */
    const FOGC = new TH.Color().setRGB(0.13, 0.085, 0.05);
    scene.background = FOGC.clone();
    scene.fog = new TH.FogExp2(FOGC, 0.0144);
    scene.environmentIntensity = 0.28;
    const cam = new TH.PerspectiveCamera(36, C.aspect, 0.1, 400);
    const r = rng(23), cell = 1.6;
    /* sky with a warm city glow at the horizon */
    scene.add(new TH.Mesh(new TH.SphereGeometry(200, 32, 16), new TH.ShaderMaterial({
      side: TH.BackSide, depthWrite: false, fog: false,
      vertexShader: 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec3 vP;void main(){float y=normalize(vP).y;vec3 hz=vec3(.13,.085,.05),top=vec3(.01,.01,.014);gl_FragColor=vec4(mix(hz,top,smoothstep(-.03,.3,y)),1.);}'
    })));
    const moon = glowSprite(TH, 0xfff1d6, 26, 0.5); moon.position.set(-60, 52, -150); moon.material.fog = false; scene.add(moon);
    const moonD = glowSprite(TH, 0xfff6e6, 5, 1.6); moonD.position.copy(moon.position); moonD.material.fog = false; scene.add(moonD);
    const ground = new TH.Mesh(new TH.PlaneGeometry(500, 500), new TH.MeshStandardMaterial({ color: 0x0d0b09, roughness: 0.95 }));
    ground.rotation.x = -Math.PI / 2; scene.add(ground);
    /* Alborz on the horizon */
    const ridge = x => 7 + 4.2 * Math.sin(x * 0.035 + 1.3) + 2.4 * Math.abs(Math.sin(x * 0.12 + 0.4)) + 1.3 * Math.abs(Math.sin(x * 0.37 + 2)) + 0.6 * Math.sin(x * 0.9);
    const mg = new TH.PlaneGeometry(420, 70, 360, 30); mg.rotateX(-Math.PI / 2);
    const mp = mg.attributes.position, crest = [];
    for (let i = 0; i < mp.count; i++) {
      const x = mp.getX(i), z = mp.getZ(i), f = Math.max(0, 1 - Math.abs(z + 8) / 35);
      const hgt = ridge(x) * Math.pow(f, 1.25) * (1 + 0.08 * Math.sin(z * 0.9 + x * 0.3));
      mp.setY(i, hgt);
    }
    mg.computeVertexNormals();
    { const cols = new Float32Array(mp.count * 3);
      for (let i = 0; i < mp.count; i++) { const y = mp.getY(i), snow = Math.max(0, Math.min(1, (y - 9.5) / 3)) * (0.6 + 0.4 * Math.sin(mp.getX(i) * 0.7) ** 2), base = Math.max(0, 1 - y / 4.5); /* foothills melt into the horizon haze */ cols[i * 3] = lerp(0.08 + snow * 0.3, 0.13, base); cols[i * 3 + 1] = lerp(0.066 + snow * 0.28, 0.085, base); cols[i * 3 + 2] = lerp(0.054 + snow * 0.26, 0.05, base); }
      mg.setAttribute('color', new TH.BufferAttribute(cols, 3)); }
    const mtn = new TH.Mesh(mg, new TH.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, fog: false }));
    mtn.position.z = -125; scene.add(mtn);
    for (let x = -210; x <= 210; x += 1) crest.push(new TH.Vector3(x, ridge(x) + 0.1, -133));
    const crestL = new TH.Line(new TH.BufferGeometry().setFromPoints(crest), new TH.LineBasicMaterial({ color: new TH.Color(0xffe2b0).multiplyScalar(0.9), transparent: true, opacity: 0.85, fog: false }));
    scene.add(crestL);
    const moonL = new TH.DirectionalLight(0x9fb3d8, 0.5); moonL.position.set(-30, 40, -60); scene.add(moonL);
    /* the city: blocks of buildings that rise, windows lit by world position */
    const city = new TH.Group(); scene.add(city);
    const wt = cTex(TH, 64, 128, g => {
      g.fillStyle = '#000'; g.fillRect(0, 0, 64, 128);
      for (let cx = 0; cx < 4; cx++) for (let cy = 0; cy < 10; cy++) {
        if (r() < 0.3) { const k = 0.35 + r() * 0.65; g.fillStyle = 'rgba(255,' + Math.round(196 + r() * 40) + ',' + Math.round(120 + r() * 60) + ',' + k + ')'; g.fillRect(cx * 16 + 4, cy * 12.8 + 3, 8, 6); }
      }
    });
    wt.tx.wrapS = wt.tx.wrapT = TH.RepeatWrapping; wt.tx.colorSpace = TH.SRGBColorSpace;
    const bGeo = new TH.BoxGeometry(1, 1, 1); bGeo.translate(0, 0.5, 0);
    const nr = bGeo.attributes.normal, side = new Float32Array(nr.count);
    for (let i = 0; i < nr.count; i++) side[i] = Math.abs(nr.getY(i)) < 0.5 ? 1 : 0;
    bGeo.setAttribute('aSide', new TH.BufferAttribute(side, 1));
    const bMat = new TH.MeshStandardMaterial({ color: 0x1d1813, roughness: 0.6, metalness: 0.35, emissive: 0xffc98a, emissiveIntensity: 0.95, emissiveMap: wt.tx });
    bMat.onBeforeCompile = sh => {
      sh.vertexShader = 'attribute float aSide;varying float vSide;varying vec3 vWP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvSide=aSide;\n#ifdef USE_INSTANCING\nvWP=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;\n#else\nvWP=(modelMatrix*vec4(transformed,1.)).xyz;\n#endif');
      sh.fragmentShader = 'varying float vSide;varying vec3 vWP;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', 'totalEmissiveRadiance*=texture2D(emissiveMap,vec2((vWP.x+vWP.z)*1.9,vWP.y*1.5+.13)).rgb*vSide;');
    };
    const R0 = { home: [[0, 0], [0, -4.8], [4.8, -4.8], [4.8, -11.2], [9.6, -11.2], [9.6, -14.4]], thr: [[0, 0], [0, 3.2], [-9.6, 3.2], [-9.6, 1.6], [-19.2, 1.6], [-19.2, 3.2]], ika: [[0, 0], [0, 4.8], [-3.2, 4.8], [-3.2, 14.4], [-6.4, 14.4], [-6.4, 24]], office: [[0, 0], [1.6, 0], [1.6, 4.8], [-3.2, 4.8], [-3.2, 8]] };
    const pts = R0[q.o.to] || R0.thr;
    /* distance from a point to the route, so the blocks along it can thin out and the road reads */
    const routeD = (x, z) => { let b = 1e9; for (let i = 1; i < pts.length; i++) { const [ax, az] = pts[i - 1], [bx, bz] = pts[i], dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz || 1, u = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)); b = Math.min(b, Math.hypot(x - ax - u * dx, z - az - u * dz)); } return b; };
    const mats = [];
    for (let gx = -18; gx < 18; gx++) for (let gz = -26; gz < 20; gz++) {
      const cx = gx * cell + cell / 2, cz = gz * cell + cell / 2, dd = Math.hypot(cx, cz * 0.85);
      if (dd > 30 || r() < 0.07) continue;
      const centre = 1 + 1.0 * Math.max(0, 1 - dd / 14);
      for (let sx = 0; sx < 2; sx++) for (let sz = 0; sz < 2; sz++) {
        if (r() < 0.22) continue;
        const half = (cell - 0.42) / 2, ox = gx * cell + 0.21 + sx * half, oz = gz * cell + 0.21 + sz * half;
        const wdt = half * (0.7 + r() * 0.28), dep = half * (0.7 + r() * 0.28);
        let hh = (0.16 + Math.pow(r(), 2.8) * 1.5) * (0.75 + centre * 0.4);
        if (r() < 0.02) hh = 2.4 + r() * 2;
        const rd = routeD(ox + half / 2, oz + half / 2);
        if (rd < 2.8 && r() < 0.45) continue;            /* about 40% fewer blocks along the route */
        if (rd < 1.6) hh = Math.min(hh, 0.45);            /* and low ones right beside it */
        mats.push([ox + half / 2, oz + half / 2, wdt, hh, dep]);
      }
    }
    const blocks = new TH.InstancedMesh(bGeo, bMat, mats.length);
    const m4 = new TH.Matrix4();
    mats.forEach((b, i) => { m4.makeScale(b[2], b[3], b[4]); m4.setPosition(b[0], 0, b[1]); blocks.setMatrixAt(i, m4); });
    city.add(blocks);
    /* streets: minor in dim gold, every fifth brighter */
    const minor = [], major = [];
    for (let gx = -18; gx <= 18; gx++) (gx % 5 === 0 ? major : minor).push([gx * cell - (gx % 5 === 0 ? 0.07 : 0.03), -44, gx * cell + (gx % 5 === 0 ? 0.07 : 0.03), 34]);
    for (let gz = -27; gz <= 20; gz++) (gz % 5 === 0 ? major : minor).push([-30, gz * cell - (gz % 5 === 0 ? 0.07 : 0.03), 30, gz * cell + (gz % 5 === 0 ? 0.07 : 0.03)]);
    const stMinor = new TH.Mesh(quadsGeo(TH, minor, 0.012), addMat(TH, 0xd9a35a, 0.42, 0));
    const stMajor = new TH.Mesh(quadsGeo(TH, major, 0.014), addMat(TH, 0xffc77a, 0.55, 0));
    scene.add(stMinor, stMajor);
    /* Valiasr: the long, gently curving artery from Tajrish down through the city; and Hemmat across it */
    const valiasr = new TH.CatmullRomCurve3([[7.5, -46], [6.2, -32], [3.4, -20], [2.6, -9], [1.1, 0.8], [-1.6, 10], [-3.2, 20], [-6.4, 32]].map(v => new TH.Vector3(v[0], 0, v[1])));
    const hemmat = new TH.CatmullRomCurve3([[-30, -6], [-16, -7.8], [-4, -6.4], [8, -8.6], [30, -7]].map(v => new TH.Vector3(v[0], 0, v[1])));
    const hw = [[valiasr, 0.14, 0.85], [hemmat, 0.1, 0.5]].map(([c, wdt, k]) => new TH.Mesh(ribbonGeo(TH, c.getPoints(200).map(v => [v.x, v.z]), wdt, 0.018), addMat(TH, 0xffd08a, k, 0)));
    hw.forEach(m => scene.add(m));
    /* exponential height fog, layered close to the ground */
    const fogs = [0.35, 0.8, 1.4].map((y, i) => {
      const m = new TH.Mesh(new TH.PlaneGeometry(140, 140), new TH.ShaderMaterial({
        transparent: true, depthWrite: false, fog: false,
        uniforms: { uA: { value: 0 } },
        vertexShader: 'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
        fragmentShader: 'uniform float uA;varying vec3 vW;void main(){float d=length(vW.xz);float a=uA*smoothstep(4.,40.,d)*(1.-smoothstep(55.,70.,d));gl_FragColor=vec4(.11,.085,.06,a);}'
      }));
      m.rotation.x = -Math.PI / 2; m.position.y = y; m.renderOrder = 4 + i; scene.add(m); return m;
    });
    /* traffic: tiny lights running along the bright streets */
    const NT = 360, tp = new Float32Array(NT * 3), td = new Float32Array(NT * 4);
    for (let i = 0; i < NT; i++) {
      const vert = r() < 0.5, line = (Math.round((r() * 2 - 1) * 3) * 5) * cell;
      tp[i * 3] = vert ? line + (r() < 0.5 ? -0.04 : 0.04) : -30; tp[i * 3 + 1] = 0.05; tp[i * 3 + 2] = vert ? -44 : line + (r() < 0.5 ? -0.04 : 0.04);
      td[i * 4] = vert ? 0 : 1; td[i * 4 + 1] = vert ? 1 : 0; td[i * 4 + 2] = (0.6 + r() * 1.4) * (r() < 0.5 ? 1 : -1); td[i * 4 + 3] = r() * 80;
    }
    const tg = new TH.BufferGeometry(); tg.setAttribute('position', new TH.BufferAttribute(tp, 3)); tg.setAttribute('aD', new TH.BufferAttribute(td, 4));
    const tMat = new TH.ShaderMaterial({
      transparent: true, depthWrite: false, blending: TH.AdditiveBlending,
      uniforms: { uT: { value: 0 }, uA: { value: 0 }, uPx: { value: qDpr(Q.level) } },
      vertexShader: 'attribute vec4 aD;uniform float uT,uPx;varying float vF;void main(){vec3 p=position;float L=aD.x>.5?60.:78.;float s=mod(aD.w+uT*aD.z,L);if(s<0.)s+=L;p+=vec3(aD.x,0.,aD.y)*s;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;vF=clamp(1.-(-mv.z-10.)/60.,0.,1.);gl_PointSize=uPx*2.2*(18./-mv.z);}',
      fragmentShader: 'uniform float uA;varying float vF;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(1.6,1.15,.6,smoothstep(.5,0.,d)*uA*vF);}'
    });
    const traffic = new TH.Points(tg, tMat); traffic.frustumCulled = false; scene.add(traffic);
    /* Milad tower */
    const tw = new TH.Group(); tw.position.set(-5.8, 0, -24); tw.scale.setScalar(1.05); scene.add(tw);
    const towerPts = [[0.95, 0], [0.55, 0.35], [0.24, 1.1], [0.18, 6.2], [0.5, 6.35], [0.78, 6.7], [0.8, 7.05], [0.6, 7.35], [0.3, 7.55], [0.16, 7.8], [0.07, 10.6], [0, 11.2]].map(p => new TH.Vector2(p[0], p[1]));
    tw.add(new TH.Mesh(new TH.LatheGeometry(towerPts, 40), new TH.MeshStandardMaterial({ color: 0x2a231b, metalness: 0.7, roughness: 0.35 })));
    [6.72, 7.0].forEach(y => { const ring = new TH.Mesh(new TH.TorusGeometry(0.79, 0.03, 8, 60), new TH.MeshBasicMaterial({ color: new TH.Color(0xffcf8a).multiplyScalar(2.2) })); ring.rotation.x = Math.PI / 2; ring.position.y = y; tw.add(ring); });
    const twTip = glowSprite(TH, 0xffb070, 1.2, 1.4); twTip.position.y = 11.3; tw.add(twTip);
    const twPod = glowSprite(TH, 0xffcf8a, 2.4, 0.7); twPod.position.y = 6.9; tw.add(twPod);
    for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2, wl = glowSprite(TH, 0xffe2b0, 0.22, 2.2); wl.position.set(Math.cos(a) * 0.8, 6.86, Math.sin(a) * 0.8); tw.add(wl); } /* the pod's window lights */
    const twShaft = new TH.Mesh(new TH.CylinderGeometry(0.03, 0.03, 5, 8), new TH.MeshBasicMaterial({ color: new TH.Color(0xffcf8a).multiplyScalar(1.4) })); twShaft.position.set(0, 3.7, 0.2); tw.add(twShaft);
    /* the route */

    const curve = new TH.CurvePath();
    for (let i = 1; i < pts.length; i++) curve.add(new TH.LineCurve3(new TH.Vector3(pts[i - 1][0], 0, pts[i - 1][1]), new TH.Vector3(pts[i][0], 0, pts[i][1])));
    const rMat = new TH.ShaderMaterial({
      transparent: true, depthWrite: false, blending: TH.AdditiveBlending, side: TH.DoubleSide,
      uniforms: { uP: { value: 0 }, uPrev: { value: 0 } },
      vertexShader: 'attribute float aU;varying float vU;void main(){vU=aU;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float uP,uPrev;varying float vU;void main(){float pre=step(vU,uPrev)*.3;float on=step(vU,uP);float head=smoothstep(uP-.08,uP,vU)*on;vec3 c=vec3(1.,.8,.48);gl_FragColor=vec4(c*(1.1+head*3.),max(pre,on*.9));}'
    });
    const route = new TH.Mesh(ribbonGeo(TH, curve.getSpacedPoints(400).map(v => [v.x, v.z]), 0.15, 0.05), rMat);
    scene.add(route);
    /* markers: the club, and where you are going */
    const marker = (x, z) => {
      const g = new TH.Group(); g.position.set(x, 0, z);
      const ring = new TH.Mesh(new TH.RingGeometry(0.34, 0.42, 48), addMat(TH, 0xffd08a, 2, 0)); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.06; g.add(ring);
      const b = beacon(TH, 6); g.add(b);
      const s = glowSprite(TH, 0xffd9a0, 0.9, 1.0); s.position.y = 0.3; g.add(s);
      scene.add(g);
      return { g, ring, b, s };
    };
    const mClub = marker(0, 0), dst = pts[pts.length - 1], mDest = marker(dst[0], dst[1]);
    mDest.s.material.opacity = 0; mDest.ring.material.opacity = 0;
    /* the car: a warm glowing marker carrying its own light */
    const car = new TH.Group(); scene.add(car);
    const capsule = new TH.Mesh(new TH.CapsuleGeometry(0.075, 0.24, 6, 16), new TH.MeshPhysicalMaterial({ color: 0x15100b, metalness: 0.8, roughness: 0.25, clearcoat: 1, emissive: 0xffc27a, emissiveIntensity: 0.35 }));
    capsule.rotation.x = Math.PI / 2; car.add(capsule);
    const coneG = new TH.ConeGeometry(0.32, 1.3, 24, 1, true); coneG.translate(0, -0.65, 0);
    const coneM = new TH.ShaderMaterial({ transparent: true, depthWrite: false, blending: TH.AdditiveBlending, side: TH.DoubleSide,
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec2 vUv;void main(){gl_FragColor=vec4(vec3(1.4,1.15,.75),pow(vUv.y,1.6)*.35);}' });
    [-0.05, 0.05].forEach(x => { const c = new TH.Mesh(coneG, coneM); c.rotation.x = -Math.PI / 2; c.position.set(x, 0, 0.16); car.add(c); });
    const halo = glowSprite(TH, 0xffc77a, 0.7, 0.8); car.add(halo);
    const carL = new TH.PointLight(0xffc27a, 0, 0, 2); carL.position.y = 0.7; car.add(carL);
    car.visible = false;
    /* labels */
    const L = PEOPLE;
    const lbls = {
      club: C.label(X(['The Vault', 'والت']), new TH.Vector3(0, 1.1, 0), 'hi'),
      dest: C.label(X(({ home: ['Niavaran', 'نیاوران'], thr: ['Mehrabad', 'مهرآباد'], ika: ['Imam Khomeini Airport', 'فرودگاه امام'], office: ['Vanak', 'ونک'] })[q.o.to] || ['', '']), new TH.Vector3(dst[0], 1.1, dst[1]), 'hi'),
      milad: C.label(X(['Milad Tower', 'برج میلاد']), new TH.Vector3(-5.8 + 0.95, 7.25, -24), 'hi lead'),   /* beside the pod, on a hairline leader */
      valiasr: C.label(X(['Valiasr', 'ولیعصر']), new TH.Vector3(3.0, 0.6, -14), 'gold'),
      alborz: C.label(X(['Alborz', 'البرز']), new TH.Vector3(30, 17, -133))
    };
    /* the driver card */
    const mins = L.mins[q.o.to] || 30;
    const card = ovCard(C.ov,
      '<div class="ov-row"><span class="ov-av" aria-hidden="true">' + (fa() ? 'ر' : 'R') + '</span><span class="ov-who"><span class="ov-n">' + X(L.driver) + '</span><span class="ov-m">' + (q.o.kind === 'van' ? X(['Black van', 'ون مشکی']) : X(['Black sedan', 'سدان مشکی'])) + '</span></span>' + plate() + '</div>' +
      '<div class="ov-eta"><span class="ov-l">' + X(LIVE.car.cd) + '</span><span class="ov-big"></span></div>');
    const big = $('.ov-big', card);
    const target = Math.max(0, Math.round((q.at - q.t0) / 1000));
    show01(card, 0);
    const cp = new TH.Vector3(), cp2 = new TH.Vector3(), camP = new TH.Vector3(), camL = new TH.Vector3(), tmp = new TH.Vector3();
    const P0 = new TH.Vector3(6, 7, 34), L0 = new TH.Vector3(-4, 6, -60), P1 = new TH.Vector3(8, 24, 26), L1 = new TH.Vector3(0, 0, -2);
    return {
      scene, camera: cam, dur: 7.6, bloom: 0.55, thresh: 0.86, tilt: 0.7, focus: 0.45,
      frame(t) {
        const rise = ph(t, 0.1, 2.3, eout);
        city.scale.y = 0.02 + 0.98 * rise;
        stMinor.material.opacity = ph(t, 0.2, 1.6);
        stMajor.material.opacity = ph(t, 0.5, 2.0);
        hw.forEach((m, i) => { m.material.opacity = ph(t, 0.7 + i * 0.2, 2.1 + i * 0.2); });
        tMat.uniforms.uT.value = t; tMat.uniforms.uA.value = ph(t, 1.2, 2.4);
        rMat.uniforms.uPrev.value = ph(t, 2.0, 3.2);
        const k = ph(t, 3.2, 6.7);
        rMat.uniforms.uP.value = k * (t > 3.2 ? 1 : 0);
        curve.getPointAt(Math.min(0.999, k), cp); curve.getPointAt(Math.min(1, k + 0.001), cp2);
        car.visible = t > 3.05;
        car.position.set(cp.x, 0.12, cp.z);
        car.lookAt(cp2.x + (cp2.x - cp.x) * 50, 0.12, cp2.z + (cp2.z - cp.z) * 50);
        carL.intensity = 9 * ph(t, 3.0, 3.6);
        halo.scale.setScalar(0.7 + Math.sin(t * 6) * 0.05);
        fogs.forEach((m, i) => { m.material.uniforms.uA.value = ph(t, 0.2, 1.5) * (0.22 - i * 0.05) * 0.6; });
        const pulse = (t * 0.7) % 1;
        mClub.ring.scale.setScalar(1 + pulse * 2.4); mClub.ring.material.opacity = (1 - pulse) * ph(t, 0.6, 1.2);
        mClub.b.material.uniforms.uI.value = ph(t, 0.5, 1.5) * 0.22;
        mDest.b.material.uniforms.uI.value = ph(t, 2.6, 3.4) * 0.22;
        mDest.s.material.opacity = ph(t, 2.6, 3.2);
        const p2 = (t * 0.7 + 0.5) % 1; mDest.ring.scale.setScalar(1 + p2 * 2.4); mDest.ring.material.opacity = (1 - p2) * ph(t, 2.6, 3.2);
        /* camera: overview → over the shoulder of the route */
        const a = ph(t, 1.2, 3.4, eio);
        camP.lerpVectors(P0, P1, a); camL.lerpVectors(L0, L1, a);
        const f = ph(t, 3.0, 5.0);
        const off = tmp.set(4.2, 12.5, 11.5).applyAxisAngle(new TH.Vector3(0, 1, 0), -0.3 * ph(t, 3, 7.6));
        camP.lerp(cp2.copy(cp).add(off), f);
        camL.lerp(cp, f);
        cam.position.copy(camP); cam.lookAt(camL);
        lbls.club.o = ph(t, 0.7, 1.4); lbls.dest.o = ph(t, 2.8, 3.4); lbls.milad.o = ph(t, 0.8, 1.6) * (1 - ph(t, 4.4, 5)); lbls.alborz.o = ph(t, 0.6, 1.4) * 0.85 * (1 - ph(t, 3.0, 3.6)); lbls.valiasr.o = ph(t, 1.0, 1.6) * (1 - ph(t, 4.4, 5));
        show01(card, ph(t, 4.4, 5.2, eout));
        big.textContent = liveLeft(q);
      }
    };
  },

  /* ---------- a table: the place card set, the candle lit ---------- */
  table(TH, C) {
    const q = C.q, scene = new TH.Scene();
    scene.background = new TH.Color(0x060505);
    scene.environmentIntensity = 0.16;
    const cam = new TH.PerspectiveCamera(34, C.aspect, 0.05, 60);
    /* the cloth */
    /* linen: a woven normal map drawn in code */
    const weave = cTex(TH, 256, 256, (g, W, H) => {
      const img = g.createImageData(W, H), d = img.data, hgt = (x, y) => { const u = x / W * 48 * Math.PI, v = y / H * 48 * Math.PI, warp = (Math.floor(x / W * 24) + Math.floor(y / H * 24)) % 2; return warp ? Math.abs(Math.sin(v)) * 0.6 + 0.4 * Math.abs(Math.sin(u * 0.5)) : Math.abs(Math.sin(u)) * 0.6 + 0.4 * Math.abs(Math.sin(v * 0.5)); };
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const dx = hgt(x + 1, y) - hgt(x - 1, y), dy = hgt(x, y + 1) - hgt(x, y - 1), k = 1.6;
        let nx = -dx * k, ny = -dy * k, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
        const i = (y * W + x) * 4; d[i] = (nx * 0.5 + 0.5) * 255; d[i + 1] = (ny * 0.5 + 0.5) * 255; d[i + 2] = (nz * 0.5 + 0.5) * 255; d[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
    });
    weave.tx.colorSpace = TH.LinearSRGBColorSpace; weave.tx.wrapS = weave.tx.wrapT = TH.RepeatWrapping; weave.tx.repeat.set(10, 7.5);
    const cloth = new TH.Mesh(new TH.PlaneGeometry(16, 12), new TH.MeshPhysicalMaterial({ color: 0x1d1813, roughness: 0.9, sheen: 1, sheenRoughness: 0.5, sheenColor: new TH.Color(0x7a6448), normalMap: weave.tx, normalScale: new TH.Vector2(0.6, 0.6) }));
    cloth.rotation.x = -Math.PI / 2; cloth.receiveShadow = true; scene.add(cloth);
    const runner = new TH.Mesh(new TH.PlaneGeometry(16, 1.5), new TH.MeshPhysicalMaterial({ color: 0x2a2219, roughness: 0.7, sheen: 1, sheenRoughness: 0.35, sheenColor: new TH.Color(0xd9a95e), metalness: 0.1 }));
    runner.rotation.x = -Math.PI / 2; runner.position.set(0, 0.004, -1.25); runner.receiveShadow = true; scene.add(runner);
    const goldM = new TH.MeshPhysicalMaterial({ color: GOLD, metalness: 1, roughness: 0.26, clearcoat: 0.4 });
    const porcelain = new TH.MeshPhysicalMaterial({ color: 0xece4d4, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.06 });
    const v2 = a => a.map(p => new TH.Vector2(p[0], p[1]));
    /* charger, plate and a gold rim */
    const set = new TH.Group(); set.position.set(0, 0, 0.7); scene.add(set);
    set.add(new TH.Mesh(new TH.LatheGeometry(v2([[0, 0.006], [1.18, 0.006], [1.3, 0.025], [1.36, 0.05], [1.32, 0.064], [1.22, 0.05], [1.1, 0.03], [0, 0.03]]), 96), goldM));
    set.add(new TH.Mesh(new TH.LatheGeometry(v2([[0, 0.04], [0.68, 0.04], [0.84, 0.06], [0.98, 0.11], [1.03, 0.13], [1.0, 0.135], [0.95, 0.12], [0.82, 0.08], [0.66, 0.06], [0, 0.06]]), 96), porcelain));
    const prim = new TH.Mesh(new TH.TorusGeometry(1.02, 0.007, 8, 120), goldM); prim.rotation.x = Math.PI / 2; prim.position.y = 0.134; set.add(prim);
    /* gold flatware */
    const knifeS = new TH.Shape(v2([[0, -0.05], [1.0, -0.05], [1.65, -0.045], [1.9, 0.0], [1.65, 0.06], [1.0, 0.055], [0, 0.04], [-0.05, 0]]));
    const forkS = new TH.Shape(v2([[0, -0.05], [1.05, -0.045], [1.25, -0.09], [1.75, -0.09], [1.75, -0.06], [1.32, -0.06], [1.32, -0.02], [1.75, -0.02], [1.75, 0.02], [1.32, 0.02], [1.32, 0.06], [1.75, 0.06], [1.75, 0.09], [1.25, 0.09], [1.05, 0.045], [0, 0.05], [-0.05, 0]]));
    const flat = (s, x, z) => { const g = new TH.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2 }); const m = new TH.Mesh(g, goldM); m.rotation.set(-Math.PI / 2, 0, Math.PI / 2); m.position.set(x, 0.02, z); return m; };
    set.add(flat(knifeS, 1.62, 0.95), flat(forkS, -1.62, 0.95));
    /* the place card: a folded tent, its face drawn on canvas */
    const pcW = 1.7, pcH = 0.74;
    const face = cTex(TH, 1024, 446);
    const nameTxt = X(['Mr Farahani', 'آقای فراهانی']), sub = X(['Table seven — ', 'میز هفت — ']) + hm(new Date(q.at));
    const drawCard = w => face.draw((g, W, H) => {
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#f4ecdb'); gr.addColorStop(1, '#e4d8c0'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.strokeStyle = '#b48a43'; g.lineWidth = 4; g.strokeRect(26, 26, W - 52, H - 52); g.lineWidth = 1.5; g.strokeRect(40, 40, W - 80, H - 80);
      g.fillStyle = '#b48a43'; [[26, 26], [W - 26, 26], [26, H - 26], [W - 26, H - 26]].forEach(([x, y]) => { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillRect(-7, -7, 14, 14); g.restore(); });
      /* the name inks in word by word, each word whole: never clipped mid-glyph */
      g.fillStyle = '#1d1711'; g.textBaseline = 'middle'; g.textAlign = 'left'; g.direction = 'ltr';
      fitFont(g, px => CF.disp(px, true), fa() ? 104 : 116, nameTxt, W * 0.8);
      const words = nameTxt.split(' '), sp = g.measureText(' ').width, ws = words.map(x => g.measureText(x).width);
      const tot = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
      const order = fa() ? words.map((x, i) => i).reverse() : words.map((x, i) => i);
      let xx = W / 2 - tot / 2;
      order.forEach(i => { g.globalAlpha = cl(w * words.length * 1.15 - i); g.fillText(words[i], xx, H * 0.43); xx += ws[i] + sp; });
      g.globalAlpha = 1; g.direction = fa() ? 'rtl' : 'ltr';
      g.globalAlpha = cl((w - 0.85) / 0.15); g.fillStyle = '#9a7434'; g.textAlign = 'center';
      fitFont(g, px => CF.txt(px, fa() ? 600 : 400), fa() ? 38 : 30, fa() ? sub : sub.toUpperCase(), W * 0.8, fa() ? 0 : 4);
      if (fa()) g.fillText(sub, W / 2, H * 0.76); else spaced(g, sub.toUpperCase(), W / 2, H * 0.76, 4);
      g.globalAlpha = 1;
    });
    drawCard(0);
    const paper = new TH.MeshStandardMaterial({ color: 0xe9dfca, roughness: 0.86 });
    const pc = new TH.Group(); pc.position.set(-0.15, 0, -0.85); scene.add(pc);
    const fG = new TH.PlaneGeometry(pcW, pcH); fG.translate(0, pcH / 2, 0);
    const front = new TH.Mesh(fG, new TH.MeshStandardMaterial({ map: face.tx, roughness: 0.82, side: TH.FrontSide }));
    const frontB = new TH.Mesh(fG, paper); frontB.rotation.y = Math.PI;
    const fp = new TH.Group(); fp.add(front, frontB); fp.position.z = 0.24; fp.rotation.x = -0.33; pc.add(fp);
    const bp = new TH.Mesh(fG, paper); bp.position.z = -0.24; bp.rotation.x = 0.33; bp.rotation.y = Math.PI; pc.add(bp);
    const pcShadow = new TH.Mesh(new TH.PlaneGeometry(2.1, 0.9), new TH.MeshBasicMaterial({ map: spriteTex(TH), color: 0x000000, transparent: true, opacity: 0.0, depthWrite: false }));
    pcShadow.rotation.x = -Math.PI / 2; pcShadow.position.set(-0.15, 0.008, -0.85); scene.add(pcShadow);
    /* the candle */
    const cx = 0.95, cz = -1.85;
    const holder = new TH.Mesh(new TH.LatheGeometry(v2([[0, 0], [0.34, 0], [0.36, 0.03], [0.3, 0.06], [0.1, 0.1], [0.07, 0.3], [0.09, 0.42], [0.2, 0.47], [0.22, 0.5], [0.13, 0.52], [0, 0.52]]), 64), goldM);
    holder.position.set(cx, 0, cz); scene.add(holder);
    const wax = new TH.MeshPhysicalMaterial({ color: 0xf0e7d6, roughness: 0.45, sheen: 0.6, sheenColor: new TH.Color(0xffd7a6), emissive: 0xffa555, emissiveIntensity: 0 });
    const candle = new TH.Mesh(new TH.CylinderGeometry(0.095, 0.1, 1.5, 40), wax); candle.position.set(cx, 0.5 + 0.75, cz); scene.add(candle);
    const wick = new TH.Mesh(new TH.CylinderGeometry(0.008, 0.008, 0.08, 6), new TH.MeshBasicMaterial({ color: 0x1a120a })); wick.position.set(cx, 2.04, cz); scene.add(wick);
    const flameM = new TH.ShaderMaterial({
      transparent: true, depthWrite: false, blending: TH.AdditiveBlending,
      uniforms: { uT: { value: 0 }, uOn: { value: 0 } },
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float uT,uOn;varying vec2 vUv;void main(){vec2 p=vUv;p.x+=(sin(uT*13.+p.y*6.)*.05+sin(uT*27.)*.02)*p.y*p.y;' +
        'float r=.5*sin(3.1416*pow(clamp(p.y,0.,1.),.62))*(1.-.25*p.y);float d=abs(p.x-.5)/max(r,.001);' +
        'float a=smoothstep(1.,.55,d)*smoothstep(0.,.07,p.y);vec3 hot=vec3(1.,.97,.86),warm=vec3(1.,.62,.2);' +
        'vec3 c=mix(warm,hot,smoothstep(.15,.85,1.-d)*smoothstep(.0,.55,p.y));c=mix(vec3(.35,.45,1.),c,smoothstep(.0,.16,p.y));' +
        'gl_FragColor=vec4(c*3.2*uOn,a*uOn);}'
    });
    const flame = new TH.Mesh(new TH.PlaneGeometry(0.14, 0.38), flameM); flame.position.set(cx, 2.23, cz); scene.add(flame);
    const halo = glowSprite(TH, 0xffb15e, 1.5, 0.7); halo.position.set(cx, 2.22, cz); halo.material.opacity = 0; scene.add(halo);
    const candleL = new TH.PointLight(0xffa860, 0, 0, 2); candleL.position.set(cx, 2.25, cz); scene.add(candleL);
    /* the candle casts soft shadows (one point-light shadow, skipped on the lightest quality) */
    if (Q.level >= 1) {
      candleL.castShadow = true; candleL.shadow.mapSize.set(512, 512); candleL.shadow.radius = 6; candleL.shadow.bias = -0.003; candleL.shadow.camera.near = 0.05;
      [set, pc, holder].forEach(o => o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }));
    }
    const moon = new TH.DirectionalLight(0x8396bb, 0.35); moon.position.set(-4, 5, -3); scene.add(moon);
    const fill = new TH.DirectionalLight(0xffcf9a, 0.25); fill.position.set(2, 4, 6); scene.add(fill);
    /* a spark when the wick takes */
    const sp = dustMaterial(TH, { size: 0.5, alpha: 1, beamR: 9, span: 4, rise: 0.4 });
    const sparks = dustPoints(TH, 40, [cx - 0.12, cx + 0.12, 2.0, 2.4, cz - 0.12, cz + 0.12], 3, sp); sparks.visible = false; scene.add(sparks);
    const motes = dustMaterial(TH, { size: 0.9, alpha: 0.5, beamR: 3, span: 5, rise: 0.03 });
    motes.uniforms.uBeam.value.set(cx, 2, cz);
    scene.add(dustPoints(TH, 160, [-3, 4, 0.2, 4, -3, 2], 8, motes));
    const card = ovCard(C.ov, '<div class="ov-row"><span class="ov-who"><span class="ov-n">' + X(PEOPLE.rest) + '</span><span class="ov-m">' + summary(REQ('table'), q.o) + '</span></span></div>');
    show01(card, 0);
    let wrote = -1;
    const look = new TH.Vector3();
    return {
      scene, camera: cam, dur: 7.2, bloom: 0.9, thresh: 0.8, tilt: 1.05, focus: 0.5,
      frame(t, dt) {
        /* the card falls, lands, and settles with a small damped rock */
        const f = cl((t - 1.2) / 0.5), fall = f * f;
        const u = cl((t - 1.7) / 0.9), rock = Math.sin(u * Math.PI * 3) * Math.pow(1 - u, 2) * (t > 1.7 ? 1 : 0);
        pc.position.y = (1 - fall) * 1.4;
        pc.rotation.set(rock * 0.06, (1 - fall) * 0.35, (1 - fall) * 0.08 + rock * 0.02);
        pcShadow.material.opacity = fall * 0.55;
        const w = ph(t, 2.5, 4.0, x => x);
        if (Math.abs(w - wrote) > 0.004 || (w === 1 && wrote !== 1)) { drawCard(w); wrote = w; }
        const on = ph(t, 4.1, 4.7, eback);
        const fk = 1 + Math.sin(t * 13) * 0.05 + Math.sin(t * 23.7) * 0.035 + Math.sin(t * 5.3) * 0.03;
        flameM.uniforms.uT.value = t; flameM.uniforms.uOn.value = cl(on);
        flame.scale.set(cl(on) * (1 + Math.sin(t * 9) * 0.03), cl(on) * fk, 1);
        flame.quaternion.copy(cam.quaternion);
        halo.material.opacity = cl(on) * 0.85 * fk;
        candleL.intensity = cl(on) * 7.5 * fk;
        wax.emissiveIntensity = cl(on) * 0.12;
        scene.environmentIntensity = 0.12 + 0.18 * cl(on);
        sparks.visible = t > 3.95 && t < 4.8; sp.uniforms.uTime.value = (t - 3.95) * 3; sp.uniforms.uAlpha.value = 1 - ph(t, 4.2, 4.8);
        motes.uniforms.uTime.value = t;
        const k = ph(t, 0, 7.2, x => eio(x));
        cam.position.set(lerp(-0.9, 0.35, k), lerp(3.4, 2.3, k), lerp(5.8, 4.4, k));
        look.set(lerp(-0.05, 0.08, k), lerp(0.95, 1.1, k), lerp(-0.7, -0.95, k));
        aim(cam, look, fitK(C, 0.74));
        show01(card, ph(t, 5.1, 5.9, eout));
      }
    };
  },

  /* ---------- tickets: printed, flipped, torn ---------- */
  tickets(TH, C) {
    const q = C.q, scene = new TH.Scene();
    scene.background = new TH.Color(0x070605);
    scene.environmentIntensity = 0.85;
    const cam = new TH.PerspectiveCamera(32, C.aspect, 0.05, 60);
    const back = new TH.Mesh(new TH.PlaneGeometry(30, 20), new TH.ShaderMaterial({ depthWrite: false, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: 'varying vec2 vUv;void main(){float d=length((vUv-vec2(.5,.55))*vec2(1.4,1.));gl_FragColor=vec4(mix(vec3(.09,.066,.042),vec3(.022,.018,.015),smoothstep(0.,.45,d)),1.);}' }));
    back.position.z = -6; scene.add(back);
    const key = new TH.DirectionalLight(0xffdcae, 1.6); key.position.set(-3, 4, 5); scene.add(key);
    const rim = new TH.DirectionalLight(0xa6c4ff, 2.2); rim.position.set(4, 2, -3); scene.add(rim);
    /* the printer */
    const printer = new TH.Group(); printer.position.set(0, 3.05, 0); scene.add(printer);
    /* a bevelled, rounded body in dark lacquer, a gold top edge and a slot that glows */
    const ps = new TH.Shape(); { const w = 1.35, h = 0.4, r = 0.12; ps.moveTo(-w + r, -h); ps.lineTo(w - r, -h); ps.quadraticCurveTo(w, -h, w, -h + r); ps.lineTo(w, h - r); ps.quadraticCurveTo(w, h, w - r, h); ps.lineTo(-w + r, h); ps.quadraticCurveTo(-w, h, -w, h - r); ps.lineTo(-w, -h + r); ps.quadraticCurveTo(-w, -h, -w + r, -h); }
    const pg2 = new TH.ExtrudeGeometry(ps, { depth: 0.9, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4, curveSegments: 10 }); pg2.translate(0, 0, -0.45);
    const pBody = new TH.Mesh(pg2, new TH.MeshPhysicalMaterial({ color: 0x17120d, roughness: 0.32, metalness: 0.45, clearcoat: 1, clearcoatRoughness: 0.12 }));
    printer.add(pBody);
    const gm = new TH.MeshPhysicalMaterial({ color: GOLD, metalness: 1, roughness: 0.22 });
    const topEdge = new TH.Mesh(new TH.BoxGeometry(2.4, 0.018, 0.02), gm); topEdge.position.set(0, 0.44, 0.52); printer.add(topEdge);
    const sheen = new TH.Mesh(new TH.PlaneGeometry(2.3, 0.05), new TH.MeshBasicMaterial({ color: new TH.Color(0xfff0d0).multiplyScalar(0.5), transparent: true, opacity: 0.6, blending: TH.AdditiveBlending, depthWrite: false }));
    sheen.position.set(0, 0.36, 0.515); printer.add(sheen);
    const slotGlow = new TH.Mesh(new TH.BoxGeometry(2.05, 0.022, 0.05), new TH.MeshBasicMaterial({ color: new TH.Color(0xffd29a).multiplyScalar(1.4) }));
    slotGlow.position.set(0, -0.455, 0.3); printer.add(slotGlow);
    const slotL = new TH.PointLight(0xffc98a, 1.2, 0, 2); slotL.position.set(0, -0.75, 0.6); printer.add(slotL);
    /* everything above the slot is inside the printer */
    const slotPlane = new TH.Plane(new TH.Vector3(0, -1, 0), 2.62);
    const clipMats = [];
    const led = new TH.Mesh(new TH.SphereGeometry(0.025, 10, 8), new TH.MeshBasicMaterial({ color: new TH.Color(0xffc27a).multiplyScalar(3) })); led.position.set(1.1, 0.12, 0.56); printer.add(led);
    /* the ticket: paper with ink, and a foil layer that really is metal */
    const W = 1.9, H = 3.6, cut = 0.72;
    const hall = X(PEOPLE.hall[q.o.kind] || PEOPLE.hall.concert), show = X(PEOPLE.show[q.o.kind] || PEOPLE.show.concert).split(' — ');
    const n = Number(q.o.n), at = new Date(q.at);
    const layout = (g, Wc, Hc, foil) => {
      const ink = foil ? '#fff' : '#1e1813', gold = foil ? '#fff' : '#a9813d';
      if (!foil) { const gr = g.createLinearGradient(0, 0, Wc, Hc); gr.addColorStop(0, '#f3ead8'); gr.addColorStop(1, '#e2d5bb'); g.fillStyle = gr; g.fillRect(0, 0, Wc, Hc); const rr = rng(4); g.fillStyle = 'rgba(120,90,50,.05)'; for (let i = 0; i < 900; i++) g.fillRect(rr() * Wc, rr() * Hc, 1 + rr() * 2, 1); }
      g.strokeStyle = gold; g.lineWidth = 6; g.strokeRect(22, 22, Wc - 44, Hc * cut - 34); g.lineWidth = 2; g.strokeRect(38, 38, Wc - 76, Hc * cut - 66);
      g.strokeRect(22, Hc * cut + 12, Wc - 44, Hc * (1 - cut) - 34);
      g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      const inner = (Wc - 76) * 0.8;
      g.fillStyle = gold; fitFont(g, px => (fa() ? CF.txt(px, 600) : CF.lat(px, 600)), fa() ? 40 : 30, fa() ? hall : hall.toUpperCase(), inner, fa() ? 0 : 7);
      if (fa()) g.fillText(hall, Wc / 2, 120); else spaced(g, hall.toUpperCase(), Wc / 2, 118, 7);
      if (!foil) {
        g.fillStyle = ink; fitFont(g, px => CF.disp(px, true), fa() ? 54 : 64, show[0], inner); g.fillText(show[0], Wc / 2, 230);
        if (show[1]) { fitFont(g, px => CF.txt(px), fa() ? 38 : 32, show[1], inner); g.fillStyle = '#5b4a35'; g.fillText(show[1], Wc / 2, 290); }
        const dl = dayFmt(at, true) + ' — ' + hm(at); fitFont(g, px => CF.txt(px), fa() ? 34 : 28, dl, inner); g.fillStyle = '#5b4a35'; g.fillText(dl, Wc / 2, 350);
      }
      g.fillStyle = gold; g.fillRect(90, 400, Wc - 180, 3);
      const cR = Wc * (fa() ? 0.73 : 0.27), cS = Wc * (fa() ? 0.3 : 0.7);
      g.font = fa() ? CF.txt(34, 600) : CF.lat(24, 600); g.fillStyle = gold;
      if (fa()) { g.fillText('ردیف', cR, 470); g.fillText('صندلی', cS, 470); } else { spaced(g, 'ROW', cR, 470, 5); spaced(g, 'SEATS', cS, 470, 5); }
      if (!foil) {
        g.fillStyle = ink; g.font = fa() ? CF.disp(92) : CF.bod(110);
        g.fillText(fa() ? N(6) : 'F', cR, 600);
        const sz = fa() ? (n > 1 ? 70 : 92) : (n > 1 ? 92 : 110);
        g.font = fa() ? CF.disp(sz) : CF.bod(sz);
        if (n > 1 && !fa()) rangeText(g, '11', String(10 + n), cS, 600, sz);
        else g.fillText(n > 1 ? N(11) + ' تا ' + N(10 + n) : N(11), cS, 600);
      }
      /* the monogram, in foil */
      drawV(g, Wc / 2, 690, 62, gold); g.fillStyle = gold;
      g.font = CF.lat(20, 600); spaced(g, 'THE VAULT', Wc / 2, 752, 6);
      /* perforation */
      g.fillStyle = foil ? 'rgba(0,0,0,0)' : 'rgba(30,24,19,.55)';
      if (!foil) for (let x = 40; x < Wc - 30; x += 18) { g.beginPath(); g.arc(x, Hc * cut, 3.2, 0, Math.PI * 2); g.fill(); }
      /* stub */
      g.font = fa() ? CF.txt(38, 600) : CF.lat(26, 600); g.fillStyle = gold;
      if (fa()) g.fillText('ورود ' + N(n) + ' نفر', Wc / 2, Hc * cut + 92); else spaced(g, 'ADMIT ' + ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'][n - 1], Wc / 2, Hc * cut + 90, 6);
      if (!foil) { const rr = rng(5); let bx = 110; g.fillStyle = ink; while (bx < Wc - 110) { const bw = 2 + Math.floor(rr() * 6); g.fillRect(bx, Hc * cut + 130, bw, 120); bx += bw + 3 + Math.floor(rr() * 6); } }
    };
    const ink = cTex(TH, 600, 1137, (g, w, h) => layout(g, w, h, false));
    const foil = cTex(TH, 600, 1137, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); layout(g, w, h, true); });
    foil.tx.colorSpace = TH.LinearSRGBColorSpace;
    const backInk = cTex(TH, 600, 1137, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1b1611'); gr.addColorStop(1, '#0f0c09'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    });
    const backFoil = cTex(TH, 600, 1137, (g, w, h) => {
      g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.fillStyle = '#fff';
      g.lineWidth = 3; g.strokeRect(30, 30, w - 60, h - 60);
      for (let y = 90; y < h - 60; y += 70) for (let x = 70 + ((y / 70) % 2) * 35; x < w - 50; x += 70) { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.strokeRect(-9, -9, 18, 18); g.restore(); }
      g.fillStyle = '#000'; g.fillRect(w / 2 - 150, h * 0.36, 300, 260); g.fillStyle = '#fff';
      g.textAlign = 'center'; drawV(g, w / 2, h * 0.36 + 120, 150, '#fff'); g.font = CF.lat(24, 600); spaced(g, 'THE VAULT', w / 2, h * 0.36 + 240, 8);
    });
    backFoil.tx.colorSpace = TH.LinearSRGBColorSpace;
    const part = (v0, v1, y0, y1) => {
      const g = new TH.Group();
      const geo = new TH.PlaneGeometry(W, y1 - y0); geo.translate(0, (y0 + y1) / 2, 0);
      const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, v0 + uv.getY(i) * (v1 - v0));
      const bgeo = geo.clone(); bgeo.rotateY(Math.PI);
      const buv = bgeo.attributes.uv; for (let i = 0; i < buv.count; i++) buv.setX(i, 1 - buv.getX(i));
      g.add(new TH.Mesh(geo, new TH.MeshStandardMaterial({ map: ink.tx, roughness: 0.82 })));
      const fm = new TH.Mesh(geo, new TH.MeshPhysicalMaterial({ color: 0xe8bf6e, metalness: 1, roughness: 0.22, clearcoat: 0.5, alphaMap: foil.tx, transparent: true, alphaTest: 0.35, polygonOffset: true, polygonOffsetFactor: -2 }));
      fm.position.z = 0.002; g.add(fm);
      g.add(new TH.Mesh(bgeo, new TH.MeshStandardMaterial({ map: backInk.tx, roughness: 0.7 })));
      const bf = new TH.Mesh(bgeo, new TH.MeshPhysicalMaterial({ color: 0xe8bf6e, metalness: 1, roughness: 0.25, alphaMap: backFoil.tx, transparent: true, alphaTest: 0.35 }));
      bf.position.z = -0.002; g.add(bf);
      g.children.forEach(m => { m.material.clippingPlanes = [slotPlane]; clipMats.push(m.material); });
      return g;
    };
    const ticket = new TH.Group(); scene.add(ticket);           /* origin at the top edge */
    const main = part(1 - cut, 1, -H * cut, 0); ticket.add(main);
    const stubPivot = new TH.Group(); stubPivot.position.set(-W / 2, -H * cut, 0); ticket.add(stubPivot);
    const stub = part(0, 1 - cut, -H, -H * cut); stub.position.set(W / 2, H * cut, 0); stubPivot.add(stub);
    const sl = new TH.Vector3(), look = new TH.Vector3();
    const fibre = dustMaterial(TH, { size: 0.6, alpha: 0.9, beamR: 9, span: 6, rise: -0.3 });
    const fibres = dustPoints(TH, 60, [-1, 1, -0.6, 0.2, 0.9, 1.4], 6, fibre); fibres.visible = false; scene.add(fibres);
    const motes = dustMaterial(TH, { size: 0.8, alpha: 0.45, beamR: 4, span: 8 });
    scene.add(dustPoints(TH, 140, [-3, 3, -3, 4, -3, 2], 12, motes));
    const card = ovCard(C.ov, '<div class="ov-row"><span class="ov-who"><span class="ov-n">' + hall + '</span><span class="ov-m">' + seatsTxt(q.o) + '</span></span></div>');
    show01(card, 0);
    return {
      scene, camera: cam, dur: 7.2, bloom: 0.7, thresh: 0.85, tilt: 0.45, focus: 0.5,
      frame(t) {
        /* printing, in stutters */
        const segs = 10, raw = ph(t, 0.4, 2.8, x => x) * segs, i = Math.floor(raw), f = raw - i;
        const pr = i >= segs ? 1 : (i + eout(cl(f * 1.7))) / segs;
        const slot = 2.65;
        const fly = ph(t, 2.9, 4.2, eio);
        ticket.position.set(lerp(0, 0.05, fly), lerp(slot + H * (1 - pr), 1.55, fly), lerp(0, 1.4, fly));
        ticket.rotation.set(lerp(0, -0.08, fly), fly * Math.PI * 2, lerp(0, -0.05, fly));
        printer.position.y = 3.05 + ph(t, 3.0, 4.2) * 1.6;
        slotPlane.constant = t < 2.95 ? 2.62 : 1e4;
        slotGlow.material.color.setScalar(t > 0.3 && t < 3.0 ? 1.5 + Math.sin(t * 20) * 0.25 : 0.8).multiply(new TH.Color(1, 0.82, 0.6));
        slotL.intensity = t > 0.3 && t < 3.1 ? 1.2 : 0.4;
        led.material.color.setScalar(t > 0.4 && t < 2.9 ? (Math.sin(t * 16) > 0 ? 3 : 0.4) : 0.4).multiply(new TH.Color(1, 0.75, 0.45));
        const tear = ph(t, 4.4, 5.5, eout);
        stubPivot.rotation.z = -tear * 0.42;
        stub.position.y = H * cut - tear * 0.35; stub.position.x = W / 2 + tear * 0.12;
        fibres.visible = t > 4.4 && t < 5.6; fibre.uniforms.uTime.value = (t - 4.4) * 2; fibre.uniforms.uAlpha.value = 1 - ph(t, 4.8, 5.6);
        stubPivot.localToWorld(sl.set(W / 2, 0, 0));
        fibres.position.set(sl.x, sl.y + 0.2, 0);
        const fl = ph(t, 5.4, 7.2);
        ticket.position.y += Math.sin(t * 1.2) * 0.03 * fl;
        motes.uniforms.uTime.value = t;
        const k = ph(t, 0, 7.2, eio);
        cam.position.set(lerp(-0.9, 0.35, k), lerp(2.2, 0.95, k), lerp(9.4, 7.4, k));
        look.set(0, lerp(1.7, 0.35, k), 0);
        aim(cam, look, fitK(C, 0.74));
        show01(card, ph(t, 5.2, 6.0, eout));
      }
    };
  },

  /* ---------- flowers: one white peony, opening from the bud outward ---------- */
  flowers(TH, C) {
    const q = C.q, scene = new TH.Scene();
    scene.background = new TH.Color(0x070605);
    scene.environmentIntensity = 0.32;
    const cam = new TH.PerspectiveCamera(24, C.aspect, 0.05, 80);
    const back = new TH.Mesh(new TH.PlaneGeometry(60, 40), new TH.ShaderMaterial({ depthWrite: false, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: 'varying vec2 vUv;void main(){float d=length((vUv-vec2(.42,.55))*vec2(1.4,1.));gl_FragColor=vec4(mix(vec3(.085,.06,.045),vec3(.016,.013,.011),smoothstep(0.,.5,d)),1.);}' }));
    back.position.set(0, -6, -10); back.lookAt(0, 6, 8); scene.add(back);
    /* light: a warm key from the side, a cool rim behind, a breath of fill */
    const keyL = new TH.DirectionalLight(0xffdcb6, 1.1); keyL.position.set(4, 3.5, 3); scene.add(keyL);
    const rim = new TH.DirectionalLight(0xffd2a0, 3.6); rim.position.set(-2, 2.2, -5); scene.add(rim); /* warm backlight, behind-left, 2x the key */
    const fill = new TH.DirectionalLight(0xffeedd, 0.35); fill.position.set(2, 5, 4); scene.add(fill);
    const glow = new TH.DirectionalLight(0xffc48a, 0.9); glow.position.set(0.6, 0.15, 4); scene.add(glow); /* warm light from low in front: the backlit guard petals glow amber */
    /* the petal: a soft oval, cupped across on a sine profile, creased along its length,
       and the outer quarter of the rim curled back by 20–35° (a different curl per variant) */
    const petalGeo = (curlDeg, cup, seed) => {
      const g = new TH.PlaneGeometry(1, 1, 36, 40); g.translate(0, 0.5, 0);
      const pa = g.attributes.position, curl = curlDeg * Math.PI / 180;
      for (let i = 0; i < pa.count; i++) {
        const u = pa.getX(i) * 2, y = pa.getY(i);
        /* obovate: narrow claw at the base, widest high up, a full round top */
        let w = 0.5 * (0.22 + 0.78 * Math.sin(Math.PI * 0.5 * Math.min(1, y / 0.68)));
        if (y > 0.68) { const q2 = (y - 0.68) / 0.32; w *= Math.sqrt(Math.max(0, 1 - q2 * q2 * q2)); }
        w *= 1 + 0.04 * Math.sin(y * 6 + seed * 2.1) * Math.abs(u);
        const X = u * w;
        let z = -cup * w * (1 - Math.cos(Math.PI * u)) / 2;     /* cup across */
        z += 0.12 * X * X;                                          /* lengthwise crease */
        const Y = y;
        if (y > 0.75) {                                             /* the rim curls back, outward */
          const s2 = (y - 0.75) / 0.25;
          z += Math.tan(curl) * 0.25 * s2 * s2 * 0.7;
        }
        z += 0.04 * Math.sin(u * 7 + seed * 3) * Math.sin(y * 3 + seed) * y * y + 0.05 * Math.sin(y * 9 + seed * 1.7) * Math.pow(Math.abs(u), 3) * y;   /* soft ruffle */
        pa.setXYZ(i, X, Y, z);
      }
      g.computeVertexNormals();
      return g;
    };
    const tint = cTex(TH, 128, 256, (g, W, H) => {
      const gr = g.createLinearGradient(0, H, 0, 0); gr.addColorStop(0, '#e9dccb'); gr.addColorStop(0.25, '#f1e6d6'); gr.addColorStop(0.75, '#fbf2e9'); gr.addColorStop(1, '#fff7f0');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(170,120,100,.06)'; g.lineWidth = 1;
      for (let k = 0; k < 13; k++) { g.beginPath(); g.moveTo(W / 2, H); g.quadraticCurveTo(W / 2 + (k - 6) * 4, H * 0.5, W / 2 + (k - 6) * 10, 4); g.stroke(); }
    });
    const petalM = new TH.MeshPhysicalMaterial({
      color: 0xffffff, map: tint.tx, side: TH.DoubleSide, roughness: 0.5, envMapIntensity: 0.35,
      sheen: 1, sheenRoughness: 0.45, sheenColor: new TH.Color(0xfff4ea),
      transmission: 0, thickness: 0.4, attenuationColor: new TH.Color(0xf4d9c4), attenuationDistance: 0.6
    });
    /* rims glow warm against the dark */
    petalM.onBeforeCompile = sh => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\nfloat fr = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0);\ntotalEmissiveRadiance += vec3(1.0, 0.74, 0.5) * fr * 0.22;');
    };
    /* rings, each a little further out than the last (by more than a petal's thickness) so nothing
       intersects; inner rings smaller and more tightly cupped. Outer rings open first. */
    const RINGS = [
      { n: 8, r0: 0.06, r1: 0.08, t0: -0.1, t1: 0.05, s: 0.5, cup: 0.3, start: 2.6 },
      { n: 9, r0: 0.09, r1: 0.12, t0: -0.04, t1: 0.16, s: 0.62, cup: 0.28, start: 2.1 },
      { n: 10, r0: 0.12, r1: 0.16, t0: 0.02, t1: 0.3, s: 0.74, cup: 0.26, start: 1.6 },
      { n: 11, r0: 0.15, r1: 0.21, t0: 0.08, t1: 0.45, s: 0.86, cup: 0.24, start: 1.1 },
      { n: 12, r0: 0.18, r1: 0.26, t0: 0.12, t1: 0.46, s: 0.96, cup: 0.22, start: 0.6 },
      { n: 12, r0: 0.21, r1: 0.32, t0: 0.18, t1: 0.6, s: 1.04, cup: 0.2, start: 0.3 }
    ];
    const meshes = [], info = [], rr = rng(31), col = new TH.Color();
    RINGS.forEach((R, ri) => {
      const m = new TH.InstancedMesh(petalGeo(14 + ri * 2.5, R.cup, ri + 1), petalM, R.n); scene.add(m); meshes.push(m);
      for (let k = 0; k < R.n; k++) {
        const a = k / R.n * Math.PI * 2 + (ri === 5 ? -0.5 : ri === 4 ? -0.5 + Math.PI / 12 : ri * 0.53);   /* a guard petal square to the lens */
        info.push({ R, a, mesh: m, slot: k, stag: (k % 2) * 0.012, roll: (rr() - 0.5) * 0.18, sz: R.s * (0.95 + rr() * 0.1), wide: 1.05 + rr() * 0.2 });   /* petals nearly as wide as long, overlapping their neighbours */
        const wk = ri >= 4 ? 1.3 : 1; info[info.length - 1].wide *= wk;
        const v = Math.max(0.88, (0.9 + 0.1 * ri / (RINGS.length - 1)) * (1 + (rr() - 0.5) * 0.04)); col.setRGB(v, v * (1 + (rr() - 0.5) * 0.04), v * (1 + (rr() - 0.5) * 0.06)); m.setColorAt(k, col);
      }
    });
    /* the closed soft dome at the heart: 12 small, tightly cupped petals curving over the centre */
    const domeG = petalGeo(6, 0.55, 9);
    const NC = 22, centre = new TH.InstancedMesh(domeG, petalM, NC);
    { const o2 = new TH.Object3D(); o2.rotation.order = 'YXZ';
      for (let i = 0; i < NC; i++) { const layer = i < 9 ? 0 : i < 16 ? 1 : 2, a = i * 2.39996, rad = 0.025 + layer * 0.025; o2.rotation.set(-0.42 + layer * 0.2, a, 0); o2.position.set(Math.sin(a) * rad, 0.06 - layer * 0.01, Math.cos(a) * rad); const sc = 0.34 + layer * 0.08; o2.scale.set(sc * 1.2, sc, sc * 1.2); o2.updateMatrix(); centre.setMatrixAt(i, o2.matrix); const v = 0.9 + layer * 0.04; col.setRGB(v, v * 0.98, v * 0.95); centre.setColorAt(i, col); } }
    scene.add(centre);
    const core = new TH.Mesh(new TH.SphereGeometry(0.11, 24, 16), new TH.MeshStandardMaterial({ color: 0xcdb99f, roughness: 0.9 })); core.position.y = 0.05; scene.add(core);
    /* contact shadow under the bloom */
    const ao = new TH.Mesh(new TH.PlaneGeometry(3.4, 3.4), new TH.MeshBasicMaterial({ map: spriteTex(TH), color: 0x000000, transparent: true, opacity: 0.7, depthWrite: false }));
    ao.rotation.x = -Math.PI / 2; ao.position.y = -0.2; scene.add(ao);
    /* the heart: gold stamens */
    const st = new TH.InstancedMesh(new TH.SphereGeometry(0.018, 8, 6), new TH.MeshStandardMaterial({ color: 0xe9bf5c, roughness: 0.5, emissive: 0x4a3008, emissiveIntensity: 0.4 }), 70);
    for (let i = 0; i < 70; i++) { const rad = Math.sqrt(i / 70) * 0.13, a = i * 2.39996; const m4 = new TH.Matrix4().setPosition(Math.cos(a) * rad, 0.1 + (0.13 - rad) * 0.5, Math.sin(a) * rad); st.setMatrixAt(i, m4); }
    scene.add(st);
    /* bokeh and a few drifting motes */
    const bm = dustMaterial(TH, { size: 14, alpha: 0.12, ring: 0.7, beamR: 20, span: 10, rise: 0.01 });
    scene.add(dustPoints(TH, 22, [-6, 6, -4, 2, -9, -3], 7, bm));
    const pollen = dustMaterial(TH, { size: 0.9, alpha: 0.7, beamR: 2, span: 3, rise: 0.05 });
    pollen.uniforms.uBeam.value.set(0, 0.4, 0);
    scene.add(dustPoints(TH, 120, [-1.6, 1.6, -0.2, 2, -1.6, 1.6], 21, pollen));
    const card = ovCard(C.ov, '<div class="ov-row"><span class="ov-who"><span class="ov-n">' + X(q.o.what === 'gift' ? ['A gift, chosen and wrapped', 'هدیه‌ای انتخاب‌شده و بسته‌بندی‌شده'] : ['White peonies, by hand', 'صدتومانی سفید، دست‌چین']) + '</span><span class="ov-m">' + X(O[q.o.for]) + ' — ' + X(O[q.o.budget]) + '</span></span></div>');
    show01(card, 0);
    const o = new TH.Object3D(), look = new TH.Vector3();
    o.rotation.order = 'YXZ';
    return {
      scene, camera: cam, dur: 7.4, bloom: 0.42, thresh: 0.88, tilt: 1, focus: 0.36, blur: 10, b0: 0.04, b1: 0.2,
      frame(t) {
        info.forEach(p => {
          const R = p.R, k = ph(t, R.start + p.stag * 20, R.start + 2.6, eio) * (0.65 + 0.35 * Math.pow((RINGS.indexOf(R) + 1) / RINGS.length, 1.6));
          const rad = lerp(R.r0, R.r1, k) + p.stag;
          o.rotation.set(lerp(R.t0, R.t1, k), p.a + (1 - k) * 0.2, p.roll * k);
          o.position.set(Math.sin(p.a) * rad, 0.04 - lerp(0, 0.03, k) * (R.n - 5), Math.cos(p.a) * rad);
          const sz = p.sz * lerp(0.82, 1, k);
          o.scale.set(sz * Math.min(2.3, p.wide), sz, sz);
          o.updateMatrix(); p.mesh.setMatrixAt(p.slot, o.matrix);
        });
        meshes.forEach(m => { m.instanceMatrix.needsUpdate = true; });
        st.visible = t > 2.2;
        pollen.uniforms.uTime.value = t; bm.uniforms.uTime.value = t;
        const m = ph(t, 0, 7.4, eio), a = lerp(-0.6, -0.45, m), el = lerp(0.56, 0.52, m), d = lerp(7.6, 6.8, m) * fitK(C, 0.5, 1.3);
        look.set(0, lerp(0.12, 0.06, m), 0);
        cam.position.set(Math.sin(a) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(a) * Math.cos(el) * d);
        cam.lookAt(look);
        show01(card, ph(t, 5.3, 6.1, eout));
      }
    };
  },

  /* ---------- travel: a slow globe, a flight arc, a boarding pass and a key card ---------- */
  travel(TH, C) {
    const q = C.q, scene = new TH.Scene();
    scene.background = new TH.Color(0x060506);
    scene.environmentIntensity = 0.8;
    const cam = new TH.PerspectiveCamera(34, C.aspect, 0.05, 80);
    const keyL = new TH.DirectionalLight(0xffdcb0, 1.8); keyL.position.set(-4, 5, 5); scene.add(keyL);
    const rim = new TH.DirectionalLight(0xa9c2ff, 2.6); rim.position.set(5, 2, -4); scene.add(rim);
    /* the globe */
    const globe = new TH.Group(); globe.position.set(0, 1.55, -1.5); scene.add(globe);
    const GR = 2.1;
    globe.add(new TH.Mesh(new TH.SphereGeometry(GR, 64, 40), new TH.MeshStandardMaterial({ color: 0x0e0c0a, roughness: 0.85, metalness: 0.1, envMapIntensity: 0.15 })));
    /* a thin fresnel rim (the atmosphere shell below) and one small specular light, instead of studio reflections */
    const spec = new TH.PointLight(0xfff2dc, 6, 0, 2); spec.position.set(-2.2, 2.6, 2.6); globe.add(spec);
    const grat = [];
    for (let la = -60; la <= 60; la += 20) for (let lo = 0; lo < 360; lo += 4) { const a = THEO(la, lo, GR * 1.003), b = THEO(la, lo + 4, GR * 1.003); grat.push(a, b); }
    for (let lo = 0; lo < 360; lo += 20) for (let la = -80; la < 80; la += 4) { grat.push(THEO(la, lo, GR * 1.003), THEO(la + 4, lo, GR * 1.003)); }
    function THEO(la, lo, r) { const p = la * Math.PI / 180, l = lo * Math.PI / 180; return new TH.Vector3(Math.cos(p) * Math.sin(l) * r, Math.sin(p) * r, Math.cos(p) * Math.cos(l) * r); }
    globe.add(new TH.LineSegments(new TH.BufferGeometry().setFromPoints(grat), new TH.LineBasicMaterial({ color: new TH.Color(0xd9a75a).multiplyScalar(0.5), transparent: true, opacity: 0.45 })));
    /* land as a field of points (a soft impression, not a map) */
    const land = [], NL = 3200, gold = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NL; i++) {
      const y = 1 - (i / (NL - 1)) * 2, rad = Math.sqrt(1 - y * y), th = gold * i;
      const x = Math.cos(th) * rad, z = Math.sin(th) * rad;
      const la = Math.asin(y) * 180 / Math.PI, lo = Math.atan2(x, z) * 180 / Math.PI;
      const n = Math.sin(la * 0.09 + 1.2) * Math.cos(lo * 0.05) + Math.sin(lo * 0.11 + la * 0.04) * 0.6 + Math.sin(la * 0.21 - lo * 0.07) * 0.3;
      if (n > 0.35 && Math.abs(la) < 72) land.push(x * GR * 1.006, y * GR * 1.006, z * GR * 1.006);
    }
    const lg = new TH.BufferGeometry(); lg.setAttribute('position', new TH.Float32BufferAttribute(land, 3));
    globe.add(new TH.Points(lg, new TH.PointsMaterial({ color: new TH.Color(0xe7bb6c).multiplyScalar(0.9), size: 0.035, transparent: true, opacity: 0.75, depthWrite: false })));
    const atm = new TH.Mesh(new TH.SphereGeometry(GR * 1.12, 48, 32), new TH.ShaderMaterial({
      transparent: true, depthWrite: false, blending: TH.AdditiveBlending, side: TH.BackSide,
      vertexShader: 'varying vec3 vN,vV;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'varying vec3 vN,vV;void main(){float f=pow(1.-abs(dot(vN,vV)),5.);gl_FragColor=vec4(vec3(1.,.78,.45)*.6,f*.12);}'
    }));
    globe.add(atm);
    const city = { thr: [35.7, 51.4], ist: [41.0, 29.0], dxb: [25.2, 55.3], kih: [26.5, 54.0], cdg: [48.9, 2.35] };
    const from = THEO(city.thr[0], city.thr[1], GR), dc = city[q.o.to] || city.ist, to = THEO(dc[0], dc[1], GR);
    const dot = p => { const s = glowSprite(TH, 0xffd08a, 0.22, 1.4); s.position.copy(p).multiplyScalar(1.01); globe.add(s); return s; };
    dot(from); const dDot = dot(to);
    /* the arc */
    const arcPts = [];
    for (let i = 0; i <= 80; i++) { const k = i / 80; const p = new TH.Vector3().copy(from).normalize().lerp(new TH.Vector3().copy(to).normalize(), k).normalize(); p.multiplyScalar(GR * (1 + Math.sin(Math.PI * k) * 0.28)); arcPts.push(p); }
    const arcC = new TH.CatmullRomCurve3(arcPts);
    const arcG = new TH.TubeGeometry(arcC, 160, 0.014, 6, false);
    const arc = new TH.Mesh(arcG, new TH.MeshBasicMaterial({ color: new TH.Color(0xffd28c).multiplyScalar(2.4) }));
    globe.add(arc);
    const head = glowSprite(TH, 0xffe0a8, 0.32, 1.8); globe.add(head);
    /* orient the globe so the journey faces us */
    const mid = new TH.Vector3().addVectors(from, to).normalize();
    const baseQ = new TH.Quaternion().setFromUnitVectors(mid, new TH.Vector3(0, 0.35, 1).normalize());
    /* the boarding pass */
    const code = PEOPLE.code[q.o.to] || 'IST', dep = new Date(q.at);
    const pass = cTex(TH, 1100, 500, (g, W, H) => {
      rrect(g, 4, 4, W - 8, H - 8, 34); g.save(); g.clip();
      const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#f4ecdb'); gr.addColorStop(1, '#e0d2b6'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.fillStyle = '#16120d'; g.fillRect(0, 0, W, 92);
      g.fillStyle = '#d6aa62'; g.textBaseline = 'middle'; g.textAlign = fa() ? 'right' : 'left';
      g.font = fa() ? CF.txt(36, 600) : CF.lat(24, 600);
      if (fa()) g.fillText('کارت پرواز', W - 300 - 50, 48); else spaced(g, 'BOARDING PASS', 50, 48, 6);
      g.textAlign = 'left'; drawV(g, fa() ? 70 : W - 316, 46, 30, '#d6aa62');
      g.strokeStyle = 'rgba(30,24,19,.45)'; g.setLineDash([6, 8]); g.lineWidth = 3; g.beginPath(); g.moveTo(W - 290, 110); g.lineTo(W - 290, H - 20); g.stroke(); g.setLineDash([]);
      g.fillStyle = '#1d1711'; g.font = CF.bod(120); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      g.fillText('IKA', 50, 250); g.fillText(code, 470, 250);
      g.strokeStyle = '#a9813d'; g.lineWidth = 3; g.beginPath(); g.moveTo(320, 205); g.lineTo(420, 205); g.moveTo(405, 192); g.lineTo(420, 205); g.lineTo(405, 218); g.stroke();
      g.font = CF.txt(fa() ? 34 : 28); g.fillStyle = '#5b4a35';
      g.textAlign = 'left'; g.fillText(X(['Tehran', 'تهران']), 54, 300);
      fitFont(g, px => CF.txt(px), fa() ? 34 : 28, X(O[q.o.to]), 300); g.fillText(X(O[q.o.to]), 474, 300);
      const cols = [[['FLIGHT', 'پرواز'], N(PEOPLE.flight[q.o.to] || 'TK 879')], [['DATE', 'تاریخ'], N(new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', { day: 'numeric', month: 'short' }).format(dep))], [['SEAT', 'صندلی'], fa() ? N(2) + 'A' : '2A'], [['BOARDS', 'سوار شدن'], hm(new Date(q.at - 30 * 60000))]];
      cols.forEach((c, i) => { const x = 54 + i * 190; g.fillStyle = '#a9813d'; g.font = fa() ? CF.txt(28, 600) : CF.lat(20, 600); if (fa()) g.fillText(X(c[0]), x, 380); else spaced(g, X(c[0]), x, 380, 3); g.fillStyle = '#1d1711'; fitFont(g, px => CF.txt(px, 600), fa() ? 38 : 34, c[1], 170); g.fillText(c[1], x, 430); });
      const r2 = rng(9); g.fillStyle = '#1d1711'; for (let y = 130; y < H - 40; y += 9) { g.fillRect(W - 240, y, 190, 2 + Math.floor(r2() * 4)); }
      g.restore();
    });
    const passM = new TH.Mesh(new TH.PlaneGeometry(3.3, 1.5), new TH.MeshStandardMaterial({ map: pass.tx, roughness: 0.8, transparent: true, alphaTest: 0.5, side: TH.DoubleSide }));
    scene.add(passM);
    /* the key card: brushed dark gold, printed */
    const cs = new TH.Shape(); { const w = 2.3, h = 1.44, r = 0.12; cs.moveTo(-w / 2 + r, -h / 2); cs.lineTo(w / 2 - r, -h / 2); cs.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); cs.lineTo(w / 2, h / 2 - r); cs.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); cs.lineTo(-w / 2 + r, h / 2); cs.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); cs.lineTo(-w / 2, -h / 2 + r); cs.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); }
    const kcG = new TH.ExtrudeGeometry(cs, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
    const kc = new TH.Group(); scene.add(kc);
    kc.add(new TH.Mesh(kcG, new TH.MeshPhysicalMaterial({ color: 0x3a2c19, metalness: 0.95, roughness: 0.3, anisotropy: 0.9, clearcoat: 0.8, clearcoatRoughness: 0.12 })));
    const kprint = cTex(TH, 920, 576, (g, W, H) => {
      g.fillStyle = '#e2bd77'; rrect(g, 70, 210, 130, 100, 14); g.fill(); g.strokeStyle = '#6b5026'; g.lineWidth = 3; g.beginPath(); g.moveTo(70, 260); g.lineTo(200, 260); g.moveTo(135, 210); g.lineTo(135, 310); g.moveTo(100, 210); g.lineTo(100, 310); g.moveTo(170, 210); g.lineTo(170, 310); g.stroke();
      g.fillStyle = '#f1d9a2'; g.textBaseline = 'alphabetic';
      g.textAlign = fa() ? 'right' : 'left';
      const hn = X(PEOPLE.hotelName[q.o.to] || PEOPLE.hotelName.ist);
      fitFont(g, px => CF.disp(px, true), fa() ? 64 : 72, hn, (W - 140) * 0.8); g.fillText(hn, fa() ? W - 70 : 70, 440);
      g.font = fa() ? CF.txt(38, 600) : CF.lat(26, 600); g.fillStyle = '#cfae6e';
      if (fa()) g.fillText('اتاق ' + N(512), W - 70, 500); else spaced(g, 'ROOM 512', 70, 500, 6);
      g.textAlign = 'right'; drawV(g, W - 100, 90, 44, '#cfae6e');
    });
    const kpm = new TH.Mesh(new TH.PlaneGeometry(2.3, 1.44), new TH.MeshBasicMaterial({ map: kprint.tx, transparent: true }));
    kpm.position.z = 0.037; kc.add(kpm);
    const showPass = q.o.what !== 'hotel';
    passM.visible = showPass; arc.visible = showPass; head.visible = showPass;
    const stars = dustMaterial(TH, { size: 0.7, alpha: 0.6, beamR: 20, span: 14, rise: 0.005 });
    scene.add(dustPoints(TH, 260, [-9, 9, -5, 9, -9, -4], 31, stars));
    const card = ovCard(C.ov, '<div class="ov-row"><span class="ov-who"><span class="ov-n">' + X(O[q.o.to]) + (showPass ? ' — <bdi dir="ltr">' + N(PEOPLE.flight[q.o.to]) + '</bdi>' : '') + '</span><span class="ov-m">' + X(PEOPLE.hotelName[q.o.to]) + (fa() ? '، اتاق ' + N(512) : ', room 512') + '</span></span></div>');
    show01(card, 0);
    const ko = showPass ? 0 : -1.4;
    const look = new TH.Vector3(), segs = arcG.index.count;
    return {
      scene, camera: cam, dur: 7.4, bloom: 0.32, thresh: 0.92, tilt: 0.5, focus: 0.45,
      frame(t) {
        globe.quaternion.copy(baseQ).premultiply(new TH.Quaternion().setFromAxisAngle(new TH.Vector3(0, 1, 0), (t - 3.5) * 0.05));
        const k = ph(t, 0.5, 2.9);
        arcG.setDrawRange(0, Math.floor(segs * k / 6) * 6);
        head.position.copy(arcC.getPointAt(Math.min(1, k)));
        head.material.opacity = ph(t, 0.5, 0.8) * (1 - ph(t, 3.0, 3.6));
        dDot.scale.setScalar(0.22 * (1 + ph(t, 2.7, 3.1) * 0.8 * (1 - ph(t, 3.1, 3.8))));
        const b = ph(t, 1.9, 3.3, eout);
        passM.position.set(0.05, lerp(-4.6, -0.55, b), 1.6); passM.scale.setScalar(0.88);
        passM.rotation.set(lerp(-0.5, -0.12, b), lerp(0.25, 0.06, b), lerp(-0.12, -0.05, b));
        const c = ph(t, 3.5 + ko, 4.9 + ko, eout);
        kc.position.set(lerp(4.4, showPass ? 0.55 : 0.0, c), showPass ? -1.15 : -0.6, showPass ? 2.2 : 1.9);
        kc.rotation.set(lerp(-0.2, -0.16, c), lerp(-0.9, -0.22 + Math.sin(t * 0.6) * 0.05, c), lerp(0.4, 0.09, c));
        stars.uniforms.uTime.value = t;
        const m = ph(t, 0, 7.4, eio);
        cam.position.set(lerp(0.4, 0, m), lerp(1.9, 0.75, m), lerp(6.6, 8.4, m));
        look.set(0, lerp(1.6, 0.45, m), 0);
        aim(cam, look, fitK(C, 0.8));
        show01(card, ph(t, 5.3, 6.1, eout));
      }
    };
  },

  /* ---------- call me: a ribbon of light carrying your call ---------- */
  call(TH, C) {
    const q = C.q, scene = new TH.Scene();
    scene.background = new TH.Color(0x060505);
    const cam = new TH.PerspectiveCamera(34, C.aspect, 0.05, 80);
    const X0 = 1.6, xa = fa() ? X0 : -X0, xb = -xa; /* the house sits where the reader starts: right in FA */
    const ribbons = [];
    for (let i = 0; i < 6; i++) {
      const g = new TH.PlaneGeometry(X0 * 2, 0.012 + i * 0.006, 360, 1);
      const m = new TH.ShaderMaterial({
        transparent: true, depthWrite: false, blending: TH.AdditiveBlending, side: TH.DoubleSide,
        uniforms: { uT: { value: 0 }, uA: { value: 0 }, uI: { value: i } },
        vertexShader: 'uniform float uT,uI;varying float vX,vP;' +
          'float pulse(float x,float c){float d=(x-c)/.26;return exp(-d*d)*sin(d*3.2);}' +
          'void main(){vec3 p=position;float x=(p.x+1.6)/3.2;vX=x;float env=sin(3.1416*x);' +
          'float y=sin(x*9.+uT*1.3+uI*.8)*.06+sin(x*23.-uT*2.1+uI)*.025;float P=0.;' +
          'for(int k=0;k<6;k++){float b=1.3+float(k)*1.15;float c=-1.6+(uT-b)/1.05*3.2;if(uT>b&&uT<b+1.3)P+=pulse(p.x,c);}' +
          'vP=abs(P);y+=P*(.55-uI*.06);p.y+=y*env*(1.-uI*.09);p.z+=uI*.09-.25+sin(x*5.+uT)*.05*uI;' +
          'gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
        fragmentShader: 'uniform float uA,uI;varying float vX,vP;void main(){float e=smoothstep(0.,.08,vX)*smoothstep(1.,.92,vX);vec3 c=vec3(1.,.76,.4)*(1.3+vP*4.);gl_FragColor=vec4(c,e*uA*(1.-uI*.13));}'
      });
      const mesh = new TH.Mesh(g, m); if (fa()) mesh.rotation.y = Math.PI; scene.add(mesh); ribbons.push(m);
    }
    const node = (x, label) => {
      const g = new TH.Group(); g.position.x = x; scene.add(g);
      const ring = new TH.Mesh(new TH.TorusGeometry(0.34, 0.016, 12, 80), new TH.MeshBasicMaterial({ color: new TH.Color(0xffcf8a).multiplyScalar(2.2) })); g.add(ring);
      const core = glowSprite(TH, 0xffd9a0, 1.4, 1.1); g.add(core);
      const waves = [0, 1, 2].map(() => { const w = new TH.Mesh(new TH.RingGeometry(0.33, 0.35, 80), addMat(TH, 0xffd08a, 1.6, 0)); g.add(w); return w; });
      return { g, ring, core, waves, lab: C.label(label, new TH.Vector3(x, -0.98, 0), 'hi') };
    };
    const A = node(xa, X(['The house', 'خانه'])), B = node(xb, X(['You', 'شما']));
    /* the V and the handset, as glowing marks inside the rings */
    const vS = new TH.Shape(KEY.V.map(p => new TH.Vector2(p[0] * 0.9, p[1] * 0.9)));
    const vM = new TH.Mesh(new TH.ShapeGeometry(vS), new TH.MeshBasicMaterial({ color: new TH.Color(0xffd9a0).multiplyScalar(1.6) })); A.g.add(vM);
    const hs = new TH.Shape(); hs.moveTo(-0.14, 0.1); hs.quadraticCurveTo(-0.12, 0.16, -0.06, 0.14); hs.lineTo(-0.03, 0.06); hs.quadraticCurveTo(-0.04, 0.02, -0.07, 0.02); hs.quadraticCurveTo(-0.04, -0.04, 0.02, -0.07); hs.quadraticCurveTo(0.02, -0.04, 0.06, -0.03); hs.lineTo(0.14, -0.06); hs.quadraticCurveTo(0.16, -0.12, 0.1, -0.14); hs.quadraticCurveTo(-0.16, -0.12, -0.14, 0.1);
    const hM = new TH.Mesh(new TH.ShapeGeometry(hs), new TH.MeshBasicMaterial({ color: new TH.Color(0xffd9a0).multiplyScalar(1.6) })); B.g.add(hM);
    const sparks = dustMaterial(TH, { size: 0.8, alpha: 0.7, beamR: 4, span: 4, rise: 0.02 });
    scene.add(dustPoints(TH, 220, [-3.4, 3.4, -1.2, 1.2, -1.6, 1], 13, sparks));
    const vis = q.o.how === 'visit';
    const card = ovCard(C.ov,
      '<div class="ov-row"><span class="ov-av" aria-hidden="true">' + (fa() ? 'ل' : 'L') + '</span><span class="ov-who"><span class="ov-n">' + X(PEOPLE.concierge) + '</span><span class="ov-m">' + X(['Your concierge tonight', 'کانسیرژ امشب شما']) + ' — ' + X(HOW[q.o.how]) + '</span></span></div>' +
      '<div class="ov-eta"><span class="ov-l">' + X(vis ? ['At your table in', 'تا سرِ میزتان'] : LIVE.call.cd) + '</span><span class="ov-big"></span></div>');
    const big = $('.ov-big', card);
    const target = Math.max(0, Math.round((q.at - q.t0) / 1000));
    show01(card, 0);
    const look = new TH.Vector3();
    return {
      scene, camera: cam, dur: 7, bloom: 0.6, thresh: 0.8, tilt: 0.6, focus: 0.5,
      frame(t) {
        ribbons.forEach(m => { m.uniforms.uT.value = t; m.uniforms.uA.value = ph(t, 0.5, 1.6); });
        [A, B].forEach((n, j) => {
          n.ring.material.color.setScalar(2.2 * ph(t, 0.1 + j * 0.2, 0.9 + j * 0.2)).multiply(new TH.Color(1, 0.8, 0.5));
          n.core.material.opacity = ph(t, 0.2, 1.0) * 0.8;
          n.lab.o = ph(t, 0.8, 1.5);
        });
        vM.material.opacity = 1; hM.material.opacity = 1;
        B.waves.forEach((w, i) => {
          let best = 1;
          for (let k = 0; k < 6; k++) { const at = 1.3 + k * 1.15 + 1.05; const u = (t - at - i * 0.16) / 1.2; if (u >= 0 && u < 1) best = Math.min(best, u); }
          w.scale.setScalar(1 + best * 1.5); w.material.opacity = best < 1 ? (1 - best) * 0.9 : 0;
        });
        sparks.uniforms.uTime.value = t;
        const m = ph(t, 0, 7, eio);
        /* frame both ends with room for their labels: about 24px inside each edge */
        const half = X0 + 1.2, dist = half / (Math.tan(cam.fov * Math.PI / 360) * cam.aspect);
        cam.position.set(lerp(-0.25, 0.25, m), lerp(0.7, 0.35, m), dist * lerp(1.06, 1, m));
        look.set(0, 0.05, 0);
        cam.lookAt(look);
        show01(card, ph(t, 3.6, 4.4, eout));
        big.textContent = liveLeft(q);
      }
    };
  }
};
/* ================= boot ================= */
applyLang();
show(0);
initKey();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (key && key.frame) key.frame($('.scr-land:not(.leave) .land-copy')); });
