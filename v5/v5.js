/* The Vault — v5 «هر چه بخواهید» / "Ask for anything".
   Phase 1 prototype: the concierge is the hero. Three screens:
     #/         the key (real-time three.js, SVG fallback)
     #/ask      choose a request   (#/ask/<id> sets its options, buttons only)
     #/live     "it's being done": a code-driven motion sequence, then a live status card
   Vanilla ES module, no build. three.js is self-hosted (lib/) and loaded on demand.
   State: sessionStorage 'vault5'. Language: localStorage 'vault5.lang' (default fa). */

const V = '?v=1';
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
const hm = d => N(pad(d.getHours()) + ':' + pad(d.getMinutes()));
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
  { id: 'flowers', img: '../v2/img/room-garden.webp', fit: 'p-garden',
    t: ['Flowers or a gift', 'گل یا هدیه'], d: ['Chosen, wrapped and delivered.', 'انتخاب، بسته‌بندی و تحویل.'],
    short: ['Flowers', 'گل'],
    g: [{ k: 'what', l: ['What', 'چه چیزی'], o: ['flowers', 'gift', 'both'] },
        { k: 'for', l: ['The occasion', 'به چه مناسبتی'], o: ['bday', 'thanks', 'just'] },
        { k: 'budget', l: ['Around', 'حدود هزینه'], o: ['b2', 'b5', 'yours'] },
        { k: 'when', l: ['When', 'کی'], o: ['today', 'tomorrow', 'pick'], pick: 'day' }] },
  { id: 'travel', img: '../v2/img/room-terrace.webp', fit: 'p-terrace',
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
  hotelName: { ist: ['Pera House', 'پرا هاوس'], dxb: ['The Creek House', 'کریک هاوس'], kih: ['Marjan Residence', 'اقامتگاه مرجان'], cdg: ['Hôtel Rivoli', 'هتل ریوولی'] },
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
    sub: [['The desk has it', 'به میز کانسیرژ رسید'], ['White peonies, in linen', 'صدتومانی سفید، در کتان'], ['With Sina, the courier', 'همراه سینا، پیک خانه'], ['Delivered', 'تحویل شد']],
    caps: [[0, ['The florist is choosing.', 'گل‌فروش در حال انتخاب است.']], [2.6, ['White peonies, opening.', 'صدتومانی‌های سفید، شکفته.']], [4.6, ['Wrapped in linen.', 'در کتان پیچیده شد.']]] },
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
function fmtLeft(s) {
  if (s >= 86400) {
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    return (d === 1 ? X(T.day1) : X(T.days).replace('%1', N(d))) + (fa() ? ' و ' : ' ') + N(pad(h) + ':' + pad(m));
  }
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return N(h ? h + ':' + pad(m) + ':' + pad(x) : pad(m) + ':' + pad(x));
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
  if (!q) { slot.innerHTML = ''; return; }
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
}

/* ---------- 2. choose a request ---------- */
let lastCardRect = null;
function buildMenu(el, prev) {
  const fromKey = prev.name === 'land';
  el.innerHTML =
    '<div class="page menu-page">' +
      '<header class="menu-head">' +
        '<p class="eyebrow">' + X(T.menuEy) + '</p>' +
        '<h1 class="h1">' + X(T.menuT) + '</h1>' +
        '<p class="lede">' + X(T.menuS) + '</p>' +
      '</header>' +
      '<ul class="cards" role="list">' + REQS.map((r, i) =>
        '<li style="--i:' + i + '"><button type="button" class="card ' + r.fit + '" data-act="pick" data-id="' + r.id + '">' +
          '<span class="card-img" aria-hidden="true"><img src="' + r.img + V + '" alt="" decoding="async"' + (i > 1 ? ' loading="lazy"' : '') + '></span>' +
          '<span class="veil" aria-hidden="true"></span>' +
          '<span class="card-txt"><span class="card-n" aria-hidden="true">' + N(pad(i + 1)) + '</span>' +
          '<span class="card-t">' + X(r.t) + '</span><span class="card-d">' + X(r.d) + '</span></span>' +
          '<span class="card-go" aria-hidden="true"></span>' +
        '</button></li>').join('') +
      '</ul>' +
    '</div>';
  if (fromKey) el.classList.add('from-key');
  const page = $('.page', el);
  if (S.menuScroll && prev.name === 'detail') page.scrollTop = S.menuScroll;
  /* slow parallax: each photograph drifts against the scroll */
  if (!reduced()) {
    let raf = 0;
    const imgs = $$('.card-img', el);
    const upd = () => {
      raf = 0;
      const vh = page.clientHeight;
      imgs.forEach(im => {
        const b = im.parentNode.getBoundingClientRect(), pr = page.getBoundingClientRect();
        const c = (b.top - pr.top + b.height / 2 - vh / 2) / vh;
        im.style.transform = 'translate3d(0,' + (c * -34).toFixed(1) + 'px,0)';
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    page.addEventListener('scroll', on, { passive: true });
    upd();
    onLeave(() => cancelAnimationFrame(raf));
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
      '<div class="hero ' + r.fit + '"><span class="card-img"><img src="' + r.img + V + '" alt="" decoding="async"></span><span class="veil"></span>' +
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
  let h = '<div class="grp" role="group" aria-labelledby="' + id + '"><p class="grp-l" id="' + id + '">' + X(g.l) + '</p><div class="chips">' +
    g.o.map(o => '<button type="button" class="chip" data-act="opt" data-k="' + g.k + '" data-v="' + o + '" aria-pressed="' + (d[g.k] === o) + '">' + X(O[o]) + '</button>').join('') + '</div>';
  if (g.pick) {
    const key = g.k + (g.pick === 'day' ? 'D' : 'T');
    const list = g.pick === 'day' ? daySlots() : timeSlots();
    if (!d[key] || list.indexOf(d[key]) < 0) d[key] = list[0];
    const open = d[g.k] === (g.pick === 'day' ? 'pick' : 'later');
    h += '<div class="more' + (open ? ' open' : '') + '" data-for="' + g.k + '"' + (open ? '' : ' hidden') + '><div class="more-in"><div class="chips row" role="group" aria-label="' + X(g.pick === 'day' ? T.pickDay : T.pickTime) + '">' +
      list.map(v => {
        const lab = g.pick === 'day'
          ? '<span class="dd-w">' + new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', { weekday: 'short' }).format(isoDate(v)) + '</span><span class="dd-d">' + N(new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', { day: 'numeric', month: 'short' }).format(isoDate(v))) + '</span>'
          : N(v);
        return '<button type="button" class="chip ' + (g.pick === 'day' ? 'dd' : 'tt') + '" data-act="sub" data-k="' + key + '" data-v="' + v + '" aria-pressed="' + (d[key] === v) + '">' + lab + '</button>';
      }).join('') + '</div></div></div>';
  }
  return h + '</div>';
}
function updSummary(el, r, d) { const s = $('.sum', el); if (s) s.textContent = summary(r, d); }

/* ---------- 3. it's being done ---------- */
let seqStop = null;
function buildLive(el) {
  const q = S.req, r = REQ(q.id), L = LIVE[q.id];
  el.innerHTML =
    '<div class="stage" aria-hidden="true"></div>' +
    '<div class="seq-ui">' +
      '<p class="eyebrow">' + X(T.liveEy) + '</p>' +
      '<p class="cap" aria-live="polite"></p>' +
    '</div>' +
    '<div class="ovl" aria-hidden="true"></div>' +
    '<button type="button" class="skip" data-act="skip">' + X(T.skip) + '<span class="skip-bar" aria-hidden="true"></span></button>' +
    '<div class="page status-page"><div class="status" id="status" hidden></div></div>';
  const stage = $('.stage', el), cap = $('.cap', el);
  const sc = SCENES[q.id](stage, $('.ovl', el), q);
  renderStatus($('#status', el), q);
  const finish = instant => {
    if (seqStop) { seqStop(); seqStop = null; }
    sc.frame(sc.dur);
    el.classList.add('ended');
    if (instant) el.classList.add('no-anim');
    const st = $('#status', el); st.hidden = false;
    const h = $('h2', st); if (h && !instant) { h.setAttribute('tabindex', '-1'); setTimeout(() => h.focus({ preventScroll: true }), 50); }
  };
  if (q.played || reduced()) {
    sc.frame(sc.dur);
    requestAnimationFrame(() => finish(q.played));
    if (!q.played) { q.played = 1; save(); }
    return;
  }
  q.played = 1; save();
  let ci = -1;
  const caps = (CAPS_ALT[q.id] && CAPS_ALT[q.id](q.o)) || L.caps;
  const t0 = performance.now();
  let raf = 0;
  const loop = now => {
    const t = (now - t0) / 1000;
    sc.frame(Math.min(t, sc.dur));
    let k = -1; caps.forEach((c, i) => { if (t >= c[0]) k = i; });
    if (k !== ci) { ci = k; setCap(cap, X(caps[k][1])); }
    el.style.setProperty('--p', Math.min(1, t / sc.dur));
    if (t >= sc.dur + 0.6) { finish(false); return; }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  seqStop = () => cancelAnimationFrame(raf);
  el._finish = finish;
  onLeave(() => { if (seqStop) { seqStop(); seqStop = null; } });
}
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
      rows.push([['What', 'چه چیزی'], X(o.what === 'gift' ? ['A gift, chosen and wrapped', 'هدیه‌ای انتخاب‌شده و بسته‌بندی‌شده'] : o.what === 'both' ? ['White peonies, and a gift', 'صدتومانی سفید، همراه یک هدیه'] : ['White peonies, wrapped in linen', 'صدتومانی سفید، پیچیده در کتان'])]);
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
    '<ol class="tl">' + T.steps.map((s, i) => '<li class="tl-i" data-i="' + i + '"><span class="tl-dot" aria-hidden="true"></span><span class="tl-t">' + X(s) + '</span><span class="tl-s">' + X(L.sub[i]) + '</span><span class="tl-at"></span></li>').join('') + '</ol>' +
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
    li.className = 'tl-i ' + st;
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
    if (sc && sc._finish && seqStop) sc._finish(true);
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
      $$('[data-k="' + b.dataset.k + '"]', b.parentNode).forEach(c => c.setAttribute('aria-pressed', String(c === b)));
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
    history.replaceState({ i: idx }, '', '#/ask');
    go('#/live');
  }
  else if (a === 'skip') { const sc = b.closest('.scr'); if (sc && sc._finish) sc._finish(false); }
  else if (a === 'done') go('#/');
  else if (a === 'other') go('#/ask');
});

document.addEventListener('keydown', e => {
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

/* ================= the key: geometry shared by 3D and the SVG fallback ================= */
const KEY = {
  R: 0.62, Ri: 0.44, bowY: 1.33,
  outer: a => 1 + 0.075 * Math.cos(4 * a) + 0.02 * Math.cos(12 * a),
  inner: a => 1 + 0.075 * Math.cos(4 * a),
  V: [[-0.43, 0.33], [-0.10, 0.33], [-0.10, 0.275], [-0.175, 0.275], [0.015, -0.19], [0.235, 0.275], [0.175, 0.275], [0.175, 0.33], [0.41, 0.33], [0.41, 0.275], [0.315, 0.275], [0.04, -0.41], [0.03, -0.54], [-0.03, -0.54], [-0.045, -0.41], [-0.335, 0.275], [-0.43, 0.275]],
  bit: [[0, -0.98], [0.40, -0.98], [0.40, -1.08], [0.30, -1.08], [0.30, -1.16], [0.47, -1.16], [0.47, -1.30], [0.36, -1.30], [0.36, -1.38], [0.44, -1.38], [0.44, -1.54], [0, -1.54]],
  lathe: [[0, -1.72], [0.05, -1.71], [0.075, -1.68], [0.085, -1.62], [0.085, -0.95], [0.102, -0.92], [0.102, -0.88], [0.085, -0.85], [0.085, 0.05], [0.104, 0.08], [0.104, 0.14], [0.085, 0.17], [0.085, 0.38], [0.11, 0.42], [0.155, 0.47], [0.165, 0.52], [0.15, 0.56], [0.115, 0.59], [0.115, 0.63], [0.15, 0.66], [0.16, 0.71], [0.12, 0.76], [0.06, 0.79], [0, 0.80]],
  ring(fn, r, n) { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; const k = r * fn(a); p.push([Math.cos(a) * k, Math.sin(a) * k]); } return p; }
};

function keySVG() {
  const s = 100, by = KEY.bowY;
  const P = pts => pts.map((p, i) => (i ? 'L' : 'M') + (p[0] * s).toFixed(1) + ',' + (-p[1] * s).toFixed(1)).join('') + 'Z';
  const bow = pts => pts.map(p => [p[0], p[1] + by]);
  const outer = P(bow(KEY.ring(KEY.outer, KEY.R, 180)));
  const inner = P(bow(KEY.ring(KEY.inner, KEY.Ri, 120)).reverse());
  const v = P(KEY.V.map(p => [p[0], p[1] + by]));
  const right = KEY.lathe, left = KEY.lathe.slice().reverse().map(p => [-p[0], p[1]]);
  const shaft = P(right.concat(left));
  const bit = P(KEY.bit);
  const top = (by + KEY.R * 1.095 + 0.1) * -s;
  return '<svg class="key-svg" viewBox="-110 -245 220 450" role="img" aria-label="' + esc(X(T.keyAlt)) + '">' +
    '<defs>' +
      '<linearGradient id="kg-sh" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#5b4320"/><stop offset=".32" stop-color="#e9cd8e"/><stop offset=".5" stop-color="#fff1c9"/><stop offset=".7" stop-color="#b48a45"/><stop offset="1" stop-color="#4a3418"/></linearGradient>' +
      '<linearGradient id="kg-bw" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f6e1aa"/><stop offset=".45" stop-color="#c99b52"/><stop offset=".75" stop-color="#7c5a28"/><stop offset="1" stop-color="#e3c27f"/></linearGradient>' +
      '<linearGradient id="kg-v" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff0c4"/><stop offset=".6" stop-color="#d1a65c"/><stop offset="1" stop-color="#8a6630"/></linearGradient>' +
      '<radialGradient id="kg-glow"><stop offset="0" stop-color="#cfae6e" stop-opacity=".28"/><stop offset="1" stop-color="#cfae6e" stop-opacity="0"/></radialGradient>' +
    '</defs>' +
    '<ellipse cx="0" cy="-60" rx="105" ry="170" fill="url(#kg-glow)"/>' +
    '<g transform="rotate(-15)">' +
      '<path d="' + shaft + '" fill="url(#kg-sh)"/>' +
      '<path d="' + bit + '" fill="url(#kg-bw)" stroke="#f3dca0" stroke-opacity=".5" stroke-width=".8"/>' +
      '<path d="' + outer + inner + '" fill="url(#kg-bw)" fill-rule="evenodd" stroke="#fbe7b5" stroke-opacity=".55" stroke-width=".8"/>' +
      '<path d="' + v + '" fill="url(#kg-v)" stroke="#5c421d" stroke-opacity=".5" stroke-width=".8"/>' +
      '<circle cx="0" cy="' + top.toFixed(1) + '" r="10" fill="none" stroke="url(#kg-bw)" stroke-width="5.5"/>' +
    '</g></svg>';
}

/* ================= the key: three.js ================= */
let key = null;
function keyStage(on) {
  app.classList.toggle('on-land', on);
  if (key && key.active) key.active(on);
}

async function initKey() {
  keyHost.innerHTML = '<div class="key-fallback">' + keySVG() + '</div>';
  key = { frame() {}, unlock: null };
  let ok = false;
  try {
    const probe = document.createElement('canvas');
    const g2 = probe.getContext('webgl2');
    ok = !!g2;
    if (g2) { const l = g2.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); }
  } catch (e) { ok = false; }
  if (!ok || /[?&]nogl\b/.test(location.search)) { app.classList.add('no-gl'); return; }
  try {
    const THREE = await import('./lib/three.r186.min.js' + V);
    key = make3D(THREE);
    keyStage(route.name === 'land');
  } catch (e) {
    console.warn('The Vault: 3D key unavailable, showing the still.', e && e.message);
    app.classList.add('no-gl');
    key = { frame() {}, unlock: null };
  }
}

function make3D(THREE) {
  const canvas = document.createElement('canvas');
  canvas.className = 'key-gl';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', X(T.keyAlt));
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.42;
  scene.environmentRotation.set(0.35, 2.2, 0);
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 0, 9);

  /* light: a warm key from above-left, a cool rim from behind-right */
  const keyL = new THREE.DirectionalLight(0xffd6a0, 2.6); keyL.position.set(-3, 4, 5); scene.add(keyL);
  const rim = new THREE.DirectionalLight(0x9cc0ff, 4.2); rim.position.set(4, 1.5, -4); scene.add(rim);
  const low = new THREE.DirectionalLight(0xffb36b, 0.6); low.position.set(0, -4, 2); scene.add(low);

  const gold = new THREE.MeshPhysicalMaterial({ color: 0xcca15a, metalness: 1, roughness: 0.27, clearcoat: 0.5, clearcoatRoughness: 0.16 });
  const goldBright = new THREE.MeshPhysicalMaterial({ color: 0xd9b26c, metalness: 1, roughness: 0.22, clearcoat: 0.65, clearcoatRoughness: 0.12 });

  const pivot = new THREE.Group(), spin = new THREE.Group(), body = new THREE.Group();
  scene.add(pivot); pivot.add(spin); spin.add(body);
  body.position.y = -0.21;

  const v2 = p => new THREE.Vector2(p[0], p[1]);
  /* shaft and collar: one lathe */
  const shaft = new THREE.Mesh(new THREE.LatheGeometry(KEY.lathe.map(v2), 64), gold);
  body.add(shaft);
  /* the bow: a scalloped quatrefoil ring */
  const bowShape = new THREE.Shape(KEY.ring(KEY.outer, KEY.R, 220).map(v2));
  bowShape.holes.push(new THREE.Path(KEY.ring(KEY.inner, KEY.Ri, 160).map(v2)));
  const bowGeo = new THREE.ExtrudeGeometry(bowShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.024, bevelSegments: 4, curveSegments: 8 });
  bowGeo.translate(0, 0, -0.05);
  const bow = new THREE.Mesh(bowGeo, gold); bow.position.y = KEY.bowY; body.add(bow);
  /* the V monogram, standing proud of the ring */
  const vGeo = new THREE.ExtrudeGeometry(new THREE.Shape(KEY.V.map(v2)), { depth: 0.13, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.016, bevelSegments: 3 });
  vGeo.translate(0, 0, -0.065);
  const vm = new THREE.Mesh(vGeo, goldBright); vm.position.y = KEY.bowY; body.add(vm);
  /* finial loop and bead rings */
  const top = KEY.bowY + KEY.R * 1.095;
  const fin = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.034, 20, 48), gold); fin.position.y = top + 0.1; body.add(fin);
  const bead = new THREE.Mesh(new THREE.TorusGeometry(0.158, 0.02, 16, 64), goldBright); bead.rotation.x = Math.PI / 2; bead.position.y = 0.47; body.add(bead);
  const bead2 = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 12, 48), goldBright); bead2.rotation.x = Math.PI / 2; bead2.position.y = -0.9; body.add(bead2);
  /* the bit, with its cut wards */
  const bitGeo = new THREE.ExtrudeGeometry(new THREE.Shape(KEY.bit.map(v2)), { depth: 0.11, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 2 });
  bitGeo.translate(0, 0, -0.055);
  body.add(new THREE.Mesh(bitGeo, gold));

  /* dust in the light */
  const NP = 340, pos = new Float32Array(NP * 3), seed = new Float32Array(NP);
  let rs = 11; const rnd = () => ((rs = (rs * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < NP; i++) { pos[i * 3] = (rnd() - 0.5) * 7; pos[i * 3 + 1] = (rnd() - 0.5) * 8; pos[i * 3 + 2] = (rnd() - 0.6) * 6; seed[i] = rnd(); }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const pm = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() } },
    vertexShader: 'attribute float aSeed;uniform float uTime;uniform float uPx;varying float vA;' +
      'void main(){vec3 p=position;float s=aSeed*6.2831;' +
      'p.x+=sin(uTime*.09+s)*.35;p.y+=sin(uTime*.06+s*1.7)*.45+uTime*.02*(aSeed-.3);p.z+=cos(uTime*.07+s*2.3)*.25;' +
      'p.y=mod(p.y+4.,8.)-4.;' +
      'vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;' +
      'float beam=smoothstep(-2.5,2.5,p.y-p.x*.8);' +
      'vA=(.15+.85*pow(.5+.5*sin(uTime*(.35+aSeed*.6)+s*7.),3.))*(.25+.75*beam);' +
      'gl_PointSize=uPx*(1.2+aSeed*2.6)*(7./-mv.z);}',
    fragmentShader: 'varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);float a=smoothstep(.5,.0,d);gl_FragColor=vec4(1.,.86,.62,a*vA*.8);}'
  });
  const dust = new THREE.Points(pg, pm);
  scene.add(dust);

  /* motion */
  const idle = 0.22;
  let ang = 0.6, vel = idle, tiltX = 0, tiltV = 0, dragging = false, lastX = 0, lastY = 0, lastT = 0, held = 0;
  let t = 0, running = false, raf = 0, prev = 0, isActive = false, onScreen = true, unlockT = -1, unlockDone = null;
  let fitY = 0, dist = 9, ready = false;
  pivot.rotation.z = 0.26;

  function fit(copy) {
    const w = keyHost.clientWidth || 1, h = keyHost.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const copyTop = copy ? copy.getBoundingClientRect().top - keyHost.getBoundingClientRect().top : h * 0.62;
    const barH = 64;
    const free = Math.max(160, copyTop - barH);
    const visH = Math.max(4.25 / (free / h * 0.92), 2.7 / camera.aspect);
    dist = visH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const centerPx = barH + free / 2;
    fitY = (h / 2 - centerPx) / h * visH;
    camera.position.set(0, 0, dist);
    camera.updateProjectionMatrix();
    if (!running) draw();
  }
  function draw() { renderer.render(scene, camera); }

  function update(dt) {
    t += dt;
    if (!dragging) {
      vel += (idle - vel) * (1 - Math.exp(-dt * 0.9));
      ang += vel * dt;
      tiltV += (-tiltX * 18 - tiltV * 6) * dt; tiltX += tiltV * dt;
    }
    let push = 0;
    if (unlockT >= 0) {
      unlockT += dt;
      const u = unlockT;
      const e1 = Math.min(1, u / 0.9), ez = 1 - Math.pow(1 - e1, 4);
      ang = unlockFrom + (unlockTo - unlockFrom) * ez;
      push = Math.max(0, (u - 0.35) / 0.9); push = push * push;
      if (u > 1.15 && unlockDone) { const f = unlockDone; unlockDone = null; f(); }
    }
    spin.rotation.y = ang;
    pivot.rotation.x = tiltX;
    pivot.position.y = fitY + Math.sin(t * 0.55) * 0.06;
    pivot.rotation.z = 0.26 + Math.sin(t * 0.33) * 0.025;
    camera.position.z = dist * (1 - push * 0.55);
    rim.position.x = 4 * Math.cos(t * 0.21); rim.position.z = -4 + Math.sin(t * 0.21) * 1.5;
    pm.uniforms.uTime.value = t;
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - prev) / 1000 || 0); prev = now;
    update(dt); draw();
    if (!ready) { ready = true; app.classList.add('gl-ready'); }
  }
  function sync() {
    const want = isActive && onScreen && !document.hidden && (!reduced() || unlockT >= 0);
    if (want && !running) { running = true; prev = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!want && running) { running = false; cancelAnimationFrame(raf); }
    if (!want && isActive && !document.hidden) { update(0); draw(); if (!ready) { ready = true; app.classList.add('gl-ready'); } }
  }
  document.addEventListener('visibilitychange', sync);
  RM.addEventListener && RM.addEventListener('change', sync);
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; sync(); }).observe(keyHost);
  new ResizeObserver(() => fit($('.scr-land:not(.leave) .land-copy'))).observe(keyHost);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); app.classList.add('no-gl'); running = false; cancelAnimationFrame(raf); });

  /* drag to turn, with inertia */
  keyHost.addEventListener('pointerdown', e => {
    if (unlockT >= 0) return;
    dragging = true; held = 0; lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); vel = 0;
    keyHost.setPointerCapture && keyHost.setPointerCapture(e.pointerId);
    app.classList.add('turned');
  });
  keyHost.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now = performance.now(), dt = Math.max(1, now - lastT) / 1000;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    ang += dx * 0.0105;
    const v = dx * 0.0105 / dt;
    vel = vel * 0.6 + v * 0.4;
    tiltX = Math.max(-0.45, Math.min(0.45, tiltX + dy * 0.004));
    lastX = e.clientX; lastY = e.clientY; lastT = now;
    if (!running) { update(0); draw(); }
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    if (performance.now() - lastT > 90) vel = 0;
    vel = Math.max(-9, Math.min(9, vel));
    if (reduced()) { vel = 0; tiltX = 0; update(0); draw(); }
  };
  keyHost.addEventListener('pointerup', end);
  keyHost.addEventListener('pointercancel', end);

  let unlockFrom = 0, unlockTo = 0;
  keyHost.appendChild(canvas);
  fit($('.scr-land .land-copy'));

  return {
    frame(copy) { fit(copy); },
    active(on) {
      isActive = on;
      if (on) { unlockT = -1; camera.position.z = dist; }
      sync();
    },
    unlock() {
      if (reduced() || !running && !isActive) return Promise.resolve();
      return new Promise(res => {
        dragging = false;
        unlockFrom = ang;
        const q = Math.PI / 2;
        unlockTo = (Math.round(ang / q) + 1.0) * q + q * (vel >= 0 ? 0.0 : 0);
        if (unlockTo - unlockFrom < q * 0.6) unlockTo += q;
        unlockT = 0; unlockDone = res;
        sync();
        setTimeout(() => { if (unlockDone) { unlockDone = null; res(); } }, 2000);
      });
    }
  };
}

/* ================= motion sequences (SVG, code-driven) ================= */
const NS = 'http://www.w3.org/2000/svg';
function E(tag, at, parent, text) {
  const e = document.createElementNS(NS, tag);
  for (const k in at) e.setAttribute(k, at[k]);
  if (text != null) e.textContent = text;
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
        big.textContent = fmtLeft(Math.round(lerp(target + mins * 12, target, e)));
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
    const card = ovCard(ov, '<div class="ov-row"><span class="ov-who"><span class="ov-n">' + X(q.o.what === 'gift' ? ['A gift, chosen and wrapped', 'هدیه‌ای انتخاب‌شده و بسته‌بندی‌شده'] : ['White peonies, in linen', 'صدتومانی سفید، در کتان']) + '</span><span class="ov-m">' + X(O[q.o.for]) + ' — ' + X(O[q.o.budget]) + '</span></span></div>');
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
          rg.setAttribute('r', (22 + best * 70).toFixed(1));
          rg.style.opacity = best < 1 ? (1 - best) * 0.8 : 0;
        });
        show01(card, ph(t, 3.6, 4.4, eout));
        big.textContent = fmtLeft(Math.round(lerp(target + 40, target, ph(t, 3.8, 6.6, eout))));
      }
    };
  }
};

/* ================= boot ================= */
applyLang();
show(0);
initKey();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (key && key.frame) key.frame($('.scr-land:not(.leave) .land-copy')); });
