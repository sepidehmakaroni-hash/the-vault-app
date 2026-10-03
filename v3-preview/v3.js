/* The Vault — v3 "Tehran Night" (شب تهران). Front-end prototype: vanilla JS, no build, no libraries.
   Routes live in the URL hash (#/m/wallet …) with real history entries, so Back, reload and deep links work.
   State is kept in sessionStorage ('vault3'); the chosen language in localStorage ('vault3.lang').
   Nothing needs typing: every flow is a sequence of buttons. */
(function () {
'use strict';

/* ================= strings ================= */
var T = {
en: {
lang: 'فا', langName: 'فارسی', back: 'Back', close: 'Close', unit: 'Toman', home: 'The Vault, home', mono: 'AF',
// title sequence
cred1: 'A private members’ club', cred2: 'Tehran', the: 'The', vault: 'Vault', sub: 'Where value is kept.',
enterM: 'Members — enter', request: 'Request membership', skip: 'Tap to skip', scene: 'Maryam St, Tehran', hours: '08:00 – 02:00',
coords: '<bdi dir="ltr">35°41′ N</bdi>&nbsp;&nbsp;<bdi dir="ltr">51°25′ E</bdi>',
// login
loginEy: 'Members', loginTitle: 'The door is expecting you.', loginBody: 'This device is known to the house.', loginWho: 'Arash Farahani · Nº 001', enter: 'Enter', notYou: 'Not a member yet? Request membership',
loginCap: '— Maryam Street, a little after nine.', presents: 'The Vault presents', starring: 'Arash Farahani',
// apply
applyEy: 'Request membership', reel: 'Reel %1 of %2', next: 'Continue', send: 'Send my request', change: 'Change', sendNote: 'By sending, you accept the house rules and the privacy policy. The committee will call you; there is nothing to fill in.',
steps: [['What do you do?', 'Choose the field closest to your work.'], ['What draws you here?', 'Choose as many as you like.'], ['How did you find us?', 'Membership is by introduction — but not only.'], ['Ready to send.', 'Read it once. The committee reads every request.']],
fields: ['Art', 'Technology', 'Media', 'Investment', 'Hospitality', 'Fashion & lifestyle', 'Health & wellness', 'Architecture & design'],
interests: ['Dining', 'Art', 'Wellness', 'Events', 'Travel', 'Business', 'Music'],
hows: ['A member introduced me', 'I was a guest at an event', 'I found the house myself'],
rvField: 'Field', rvInterests: 'Interests', rvHow: 'Introduction', notChosen: 'Not chosen — that is fine',
sentEy: 'Request received', sentTitle: 'Your request is sealed.', sentBody: 'The committee reads every request in person. We will call you within ten days, either way.', ref: 'Reference', toStart: 'Back to the beginning', rulesLink: 'Read the house rules',
// member cover
issue: 'Nº 214 · The %1 issue', seasons: ['winter', 'spring', 'summer', 'autumn'], morning: 'Good morning, Arash.', afternoon: 'Good afternoon, Arash.', evening: 'Good evening, Arash.',
featEy: 'Tonight’s feature', featTitle: 'The chef’s table', featDeck: 'Eight guests, one long table, a menu of the season. From 20:30.', featCta: 'Reserve a seat at 20:30', featCap: '— The dining room, half past eight.',
nextEy: 'Your next booking', nothing: 'Nothing booked yet.', nothingB: 'Five rooms are waiting. Choose one and a time.', chooseRoom: 'Choose a room',
insideEy: 'In this issue', read: 'Read',
stories: [['Art', 'The artist in the room', 'Five painters and one winter collection — a first look before the preview.', 'artist'], ['Kitchen', 'The chef’s quince', 'Why this season’s menu begins with a single fruit from Isfahan.', 'quince'], ['Members', 'A member’s table', 'How one member hosts eight friends on a Thursday night.', 'members']],
dock: ['Home', 'Reserve', 'Events', 'Concierge', 'Wallet'],
// reserve
resEy: 'Reserve', resTitle: 'Five rooms. One evening.', resBody: 'Choose a room, then a day and a time. Room 6 is arranged by the concierge; the Japanese garden is never booked — it is offered by the house.', chapter: 'Nº %1', reserveRoom: 'Reserve this room', garden: ['The Japanese garden', 'The rarest room in the house. It is never booked and never sold; the house offers it, now and then.', 'Ask the concierge', 'Ext. The garden — dusk'],
yourBookings: 'Your bookings', cancel: 'Cancel', cancelQ: 'Cancel this booking?', cancelYes: 'Yes, cancel it', keep: 'Keep it', cancelled: 'The booking is cancelled.',
rooms: [['The lounge', 'The heart of the club. Hold a table for the evening.', 'lounge', 'Int. The lounge — evening', 'Hold a table for the evening'], ['The dining room', 'One room, one service. Lunch, and dinner at the chef’s table.', 'dining', 'Int. Dining room — evening'], ['The sushi counter', 'Eight seats in front of the itamae.', 'sushi', 'Int. Sushi counter — late'], ['The humidor', 'Cigars are kept and smoked here, and nowhere else.', 'humidor-room', 'Int. Humidor — after dinner'], ['The terrace', 'Open air above the city. Dinner served.', 'terrace', 'Ext. Terrace — night']],
day: 'Day', time: 'Time', party: 'Guests, with you', full: 'full', hold: 'Hold the table', pickTime: 'Choose a time to hold the table.', confirmT: 'Your table', confirm: 'Confirm', heldT: 'Your table is held.', heldB: 'It is kept under your name. Nothing more is needed at the door — Reza, the host, will be waiting.', heldToast: 'Your table is held.', done: 'Done', room: 'Room', date: 'Date', guests: 'Guests', people: '%1 people', person: 'Just you', today: 'Today', tomorrow: 'Tomorrow', less: 'One fewer', more: 'One more', at: '%1 at %2',
// events
evEy: 'The calendar', evTitle: 'This season, in four evenings.', seats: '%1 seats left', seatsK: 'Seats left', attend: 'Hold my seat', going: 'You are going', details: 'Details', bring: 'Guests you bring', rsvpOn: 'Your seat is held.', rsvpOff: 'Your seat is released.', release: 'Release my seat', addCal: 'Add to calendar', calAdded: 'Added to your calendar.', place: 'Place', evNo: 'Nº %1',
kinds: ['Art', 'Design', 'Music', 'Collectors'],
events: [['Contemporary art preview', 'The art corridor', '19:00', 'A first look at the winter collection, with the artists in the room.'], ['Design & architecture table', 'The dining room', '20:00', 'Twelve seats, one long table, three architects and a question.'], ['An evening recital', 'The lounge', '20:30', 'A string trio from Istanbul plays Schubert and Komitas. Seated, quiet, members only.', '“Schubert, Komitas, and a very quiet room.”'], ['Collectors’ evening', 'The lounge', '19:30', 'A private sale of six works, introduced by the curator who found them.']],
// concierge
concEy: 'Concierge', concTitle: 'What can we arrange?', concBody: 'Choose, and it is done. One line, day and night.', when: 'When', sendC: 'Send to the concierge', sentC: 'The concierge has it.',
topics: [['A table, anywhere', 'Restaurants in the city and beyond', ['Tonight', 'Tomorrow', 'This weekend']], ['Room 6, or a table here', 'In the house, arranged quietly', ['Today', 'Tomorrow', 'This week'], 'Room 6 is for meetings that stay between you. It is arranged only through the concierge.'], ['Car and driver', 'To the door, or for the evening', ['Now', 'In 30 minutes', 'Later tonight']], ['Flowers and gifts', 'Chosen and delivered', ['Today', 'Tomorrow', 'No hurry']], ['Travel and tickets', 'Flights, hotels, concerts, theatre', ['This week', 'This month', 'No hurry']], ['Humidor locker Nº 14', 'Nine cigars, kept for you', ['Bring to my table', 'Keep for later']], ['The Japanese garden', 'Offered by the house, never sold', ['This week', 'This month', 'Whenever it can be'], 'The garden is not booked. Tell the concierge you would like an hour there, and the house will offer it when it can.']],
concAlso: 'Also, without a second thought: a courier, dry-cleaning and the tailor, a doctor’s introduction, care for a pet.', nightReply: 'Your message has been received. Our team follows up from nine in the morning and will let you know.',
lockerB: 'Kept at 70% humidity and 18°C. The keeper holds the key.', cigars: [['Cohiba Behike 54', 3], ['Montecristo Nº 2', 4], ['Padrón 1964 Anniversary', 2]],
yourReq: 'Your requests', st: ['Received', 'In progress', 'Done'], replyFrom: 'From the concierge', noReply: 'No reply yet. The concierge will be in touch shortly.', asked: 'You asked',
seedConc: [[2, 'A car for two after dinner on Thursday, to Niavaran.', 2, 'A black sedan will wait at the door at 23:30. The driver’s name is Bahram.'], [3, 'White peonies for a birthday, delivered Saturday morning.', 1, '']],
// wallet
walletEy: 'Wallet', charge: 'Prepaid charge', hiddenAmt: 'Hidden amount. Tap to show figures.', hideAll: 'Hide figures', showAll: 'Show figures',
floor: 'The floor', fee: 'Joining fee', feeNote: 'One-off, paid on %1', carried: 'Carried from last year', topups: 'Top-ups this year', spent: 'Spent this year',
privateNote: 'A private note', floorNear: 'Your charge is close to its floor. Top up whenever it suits you, or settle each visit as it comes. Nothing about your evenings changes.', floorBelow: 'Your charge is below its floor. Top up whenever it suits you, or settle each visit as it comes. Nothing about your evenings changes.',
rollNote: 'Unused charge rolls into next year and is never forfeited. There is no minimum spend.', guestNote: 'Guests never pay. What they enjoy comes off your charge.',
ledgerT: 'The year in figures', byPlace: 'Spend by room', activity: 'Activity', filt: ['All', 'Spending', 'Top-ups'], topup: 'Top up', statement: 'Statement', stSent: 'Your statement will be sent privately.',
topT: 'Top up your charge', amount: 'Amount', method: 'How', methods: ['Card', 'Bank transfer', 'At the desk'], topSend: 'Request top-up', topNote: 'Added to your charge once the finance desk confirms.', topDone: 'Requested.', pending: 'Pending',
txTop: 'Top-up', txCarry: 'Carried from last year', settled: 'Settled', receipt: 'Receipt', status: 'Status', report: 'Report a problem', reported: 'The finance desk will contact you.',
// account
accEy: 'Account', name: 'Arash Farahani', tier: 'Founding member · Nº 001',
guestsH: 'Your regular guests', addGuest: 'Add a guest', addGuestB: 'People who have been your guest this year.', noGuests: 'No regular guests yet.', guestsNote: 'Name a guest before the night. A guest never pays.', removed: 'Removed.', added: 'Added.', remove: 'Remove %1', allAdded: 'Everyone is already on your list.',
settings: 'Settings', language: 'Language', notif: 'Notifications', notifs: ['Bookings', 'Events', 'Concierge replies'], rules: 'House rules', rulesEy: 'The house',
leave: 'Leave the house', leaveQ: 'Leave the house?', leaveB: 'You will need to enter again on this device. Your bookings stay as they are.', stay: 'Stay', leaveYes: 'Leave', left: 'You have left the house. Goodnight.',
rulesBody: 'A few short rules for every member and every guest, with no exceptions at the door.', houseLine: 'Maryam St, Tehran · 08:00 – 02:00',
rulesList: [['Guests', 'Every guest is named before the night. A guest never pays.'], ['The bill', 'Nothing is settled at the table. It comes off your charge.'], ['Photography', 'No photographs of other members, anywhere in the house.'], ['Privacy', 'The club never confirms or denies who is a member.'], ['Age', 'No one under fifteen is admitted, at any hour, in any room.'], ['Smoking', 'On the terrace only. Cigars only in the humidor.']]
},
fa: {
lang: 'EN', langName: 'English', back: 'بازگشت', close: 'بستن', unit: 'تومان', home: 'د والت، خانه', mono: 'آف',
cred1: 'باشگاه خصوصی اعضا', cred2: 'تهران', the: 'THE VAULT', vault: 'د والت', sub: 'جایی که ارزش نگه‌داشته می‌شود.',
enterM: 'ورود اعضا', request: 'درخواست عضویت', skip: 'برای رد شدن بزنید', scene: 'خیابان مریم، تهران', hours: '۰۸:۰۰ تا ۰۲:۰۰',
coords: '<bdi dir="ltr">۳۵°۴۱′</bdi> شمالی،&nbsp;<bdi dir="ltr">۵۱°۲۵′</bdi> شرقی',
loginEy: 'اعضا', loginTitle: 'درِ خانه منتظر شماست.', loginBody: 'این دستگاه برای خانه آشناست.', loginWho: 'آرش فراهانی · عضو شمارهٔ ۱', enter: 'ورود', notYou: 'هنوز عضو نیستید؟ درخواست عضویت',
loginCap: '— خیابان مریم، کمی بعد از نه شب.', presents: 'د والت تقدیم می‌کند', starring: 'آرش فراهانی',
applyEy: 'درخواست عضویت', reel: 'حلقهٔ %1 از %2', next: 'ادامه', send: 'ارسال درخواست', change: 'تغییر', sendNote: 'با ارسال، قوانین خانه و سیاست حریم خصوصی را می‌پذیرید. کمیته با شما تماس می‌گیرد؛ چیزی برای پر کردن نیست.',
steps: [['کار شما چیست؟', 'نزدیک‌ترین حوزه به کارتان را انتخاب کنید.'], ['چه چیزی شما را به اینجا می‌کشد؟', 'هر چند مورد که می‌خواهید.'], ['ما را چطور پیدا کردید؟', 'عضویت با معرفی است — اما نه فقط با معرفی.'], ['آمادهٔ ارسال.', 'یک بار بخوانید. کمیته هر درخواست را می‌خواند.']],
fields: ['هنر', 'فناوری', 'رسانه', 'سرمایه‌گذاری', 'مهمان‌نوازی', 'مد و سبک زندگی', 'سلامت', 'معماری و طراحی'],
interests: ['غذا', 'هنر', 'سلامت', 'رویدادها', 'سفر', 'کسب‌وکار', 'موسیقی'],
hows: ['عضوی مرا معرفی کرد', 'مهمان یکی از رویدادها بودم', 'خودم خانه را پیدا کردم'],
rvField: 'حوزه', rvInterests: 'علاقه‌ها', rvHow: 'معرفی', notChosen: 'انتخاب نشده — اشکالی ندارد',
sentEy: 'درخواست رسید', sentTitle: 'درخواست شما مهر و موم شد.', sentBody: 'کمیته هر درخواست را شخصاً می‌خواند. نتیجه هر چه باشد، تا ده روز دیگر با شما تماس می‌گیریم.', ref: 'شمارهٔ پیگیری', toStart: 'بازگشت به آغاز', rulesLink: 'خواندن قوانین خانه',
issue: 'شمارهٔ ۲۱۴ · ویژهٔ %1', seasons: ['زمستان', 'بهار', 'تابستان', 'پاییز'], morning: 'صبح بخیر، آرش.', afternoon: 'عصر بخیر، آرش.', evening: 'شب بخیر، آرش.',
featEy: 'ویژهٔ امشب', featTitle: 'میز سرآشپز', featDeck: 'هشت مهمان، یک میز بلند، منوی فصل. از ساعت ۲۰:۳۰.', featCta: 'رزرو یک صندلی برای ساعت ۲۰:۳۰', featCap: '— سالن غذاخوری، هشت و نیم شب.',
nextEy: 'رزرو بعدی شما', nothing: 'هنوز رزروی ندارید.', nothingB: 'پنج فضا منتظر است. یکی را با یک ساعت انتخاب کنید.', chooseRoom: 'انتخاب فضا',
insideEy: 'در این شماره', read: 'خواندن',
stories: [['هنر', 'هنرمند در تالار', 'پنج نقاش و یک مجموعهٔ زمستانی؛ نگاهی پیش از افتتاح.', 'artist'], ['آشپزخانه', 'بِهِ سرآشپز', 'چرا منوی این فصل با یک دانه بِهِ اصفهان آغاز می‌شود.', 'quince'], ['اعضا', 'میزِ یک عضو', 'یک عضو چطور پنجشنبه‌شب از هشت دوستش پذیرایی می‌کند.', 'members']],
dock: ['خانه', 'رزرو', 'رویدادها', 'کانسیرج', 'کیف پول'],
resEy: 'رزرو', resTitle: 'پنج فضا. یک شب.', resBody: 'یک فضا را انتخاب کنید، بعد روز و ساعت. اتاق ۶ را کانسیرج هماهنگ می‌کند؛ باغ ژاپنی رزرو نمی‌شود، خانه آن را پیشکش می‌کند.', chapter: 'شمارهٔ %1', reserveRoom: 'رزرو این فضا', garden: ['باغ ژاپنی', 'کمیاب‌ترین فضای خانه. نه رزرو می‌شود و نه فروخته؛ خانه گاه‌به‌گاه آن را پیشکش می‌کند.', 'پرسیدن از کانسیرج', 'خارجی. باغ — غروب'],
yourBookings: 'رزروهای شما', cancel: 'لغو', cancelQ: 'این رزرو لغو شود؟', cancelYes: 'بله، لغو شود', keep: 'نگه دارید', cancelled: 'رزرو لغو شد.',
rooms: [['لانژ', 'قلب باشگاه. میزی برای شب نگه دارید.', 'lounge', 'داخلی. لانژ — شب', 'نگه داشتن میز برای شب'], ['سالن غذاخوری', 'یک سالن، یک سرویس. ناهار، و شام سر میز سرآشپز.', 'dining', 'داخلی. سالن غذاخوری — غروب'], ['کانتر سوشی', 'هشت صندلی روبه‌روی ایتامه.', 'sushi', 'داخلی. کانتر سوشی — دیروقت'], ['بار و هیومیدور', 'سیگار برگ فقط اینجا نگه داشته و کشیده می‌شود.', 'humidor-room', 'داخلی. بار و هیومیدور — بعد از شام'], ['بالکن / تراس', 'فضای باز بالای شهر، با شام.', 'terrace', 'خارجی. بالکن / تراس — شب']],
day: 'روز', time: 'ساعت', party: 'مهمان‌ها، با خودتان', full: 'پر', hold: 'نگه داشتن میز', pickTime: 'برای نگه داشتن میز یک ساعت انتخاب کنید.', confirmT: 'میز شما', confirm: 'تأیید', heldT: 'میز شما نگه داشته شد.', heldB: 'به نام شما نگه داشته می‌شود. در ورودی چیز دیگری لازم نیست — رضا، میزبان، منتظرتان است.', heldToast: 'میز شما نگه داشته شد.', done: 'تمام', room: 'فضا', date: 'تاریخ', guests: 'مهمان‌ها', people: '%1 نفر', person: 'فقط خودتان', today: 'امروز', tomorrow: 'فردا', less: 'یک نفر کمتر', more: 'یک نفر بیشتر', at: '%1، ساعت %2',
evEy: 'تقویم', evTitle: 'این فصل، در چهار شب.', seats: '%1 جای خالی', seatsK: 'جای خالی', attend: 'جایم را نگه دارید', going: 'شما می‌آیید', details: 'جزئیات', bring: 'مهمان همراه', rsvpOn: 'جای شما نگه داشته شد.', rsvpOff: 'جای شما آزاد شد.', release: 'آزاد کردن جایم', addCal: 'افزودن به تقویم', calAdded: 'به تقویم شما اضافه شد.', place: 'مکان', evNo: 'شمارهٔ %1',
kinds: ['هنر', 'طراحی', 'موسیقی', 'مجموعه‌داران'],
events: [['پیش‌نمایش هنر معاصر', 'کریدور هنر', '19:00', 'نخستین نگاه به مجموعهٔ زمستان، با حضور هنرمندان.'], ['میز طراحی و معماری', 'سالن غذاخوری', '20:00', 'دوازده صندلی، یک میز بلند، سه معمار و یک پرسش.'], ['شب رسیتال', 'لانژ', '20:30', 'یک تریوی زهی از استانبول، شوبرت و کومیتاس می‌نوازد. نشسته، آرام، فقط برای اعضا.', '«شوبرت، کومیتاس، و اتاقی بسیار آرام.»'], ['شب مجموعه‌داران', 'لانژ', '19:30', 'فروش خصوصی شش اثر، با معرفی کیوریتوری که آن‌ها را یافته است.']],
concEy: 'کانسیرج', concTitle: 'چه کاری برایتان انجام دهیم؟', concBody: 'انتخاب کنید، انجام می‌شود. یک خط، شبانه‌روز.', when: 'کی', sendC: 'ارسال به کانسیرج', sentC: 'کانسیرج درخواست شما را دارد.',
topics: [['میز در هر جای شهر', 'رستوران‌ها، در تهران و فراتر از آن', ['امشب', 'فردا', 'آخر هفته']], ['اتاق ۶، یا میزی در خانه', 'در خود خانه، بی‌سروصدا', ['امروز', 'فردا', 'همین هفته'], 'اتاق ۶ برای دیدارهایی است که میان خودتان می‌ماند. فقط کانسیرج آن را هماهنگ می‌کند.'], ['ماشین و راننده', 'دمِ در، یا برای تمام شب', ['همین حالا', '۳۰ دقیقهٔ دیگر', 'آخر شب']], ['گل و هدیه', 'انتخاب و ارسال', ['امروز', 'فردا', 'عجله‌ای نیست']], ['سفر و بلیت', 'پرواز، هتل، کنسرت، تئاتر', ['همین هفته', 'همین ماه', 'عجله‌ای نیست']], ['قفسهٔ هیومیدور شمارهٔ ۱۴', 'نه سیگار برگ، برای شما', ['سر میزم بیاورید', 'بماند برای بعد']], ['باغ ژاپنی', 'پیشکشِ خانه، هرگز فروشی نیست', ['همین هفته', 'همین ماه', 'هر وقت که بشود'], 'باغ رزرو نمی‌شود. به کانسیرج بگویید ساعتی در آن را می‌خواهید؛ خانه هر وقت بتواند آن را پیشکش می‌کند.']],
concAlso: 'و بی‌آنکه دوباره فکرش را بکنید: پیک، خشک‌شویی و خیاط، معرفی پزشک، نگهداری از حیوان خانگی.', nightReply: 'پیام شما دریافت شد. همکاران ما از ساعت نُه صبح پیگیری می‌کنند و خبر می‌دهند.',
lockerB: 'در رطوبت ۷۰٪ و دمای ۱۸ درجه نگه داشته می‌شود. کلید نزد مسئول هیومیدور است.', cigars: [['کوهیبا بهیکه ۵۴', 3], ['مونته‌کریستو شمارهٔ ۲', 4], ['پادرون ۱۹۶۴ آنیورسری', 2]],
yourReq: 'درخواست‌های شما', st: ['دریافت شد', 'در حال انجام', 'انجام شد'], replyFrom: 'پاسخ کانسیرج', noReply: 'هنوز پاسخی نیامده. کانسیرج به‌زودی خبر می‌دهد.', asked: 'درخواست شما',
seedConc: [[2, 'یک ماشین برای دو نفر بعد از شام پنجشنبه، به نیاوران.', 2, 'یک سدان مشکی ساعت ۲۳:۳۰ جلوی در منتظر است. نام راننده بهرام است.'], [3, 'گل صدتومانی سفید برای تولد، شنبه صبح.', 1, '']],
walletEy: 'کیف پول', charge: 'شارژ پیش‌پرداخت', hiddenAmt: 'مبلغ پنهان است. برای نمایش ارقام بزنید.', hideAll: 'پنهان کردن ارقام', showAll: 'نمایش ارقام',
floor: 'کفِ شارژ', fee: 'ورودیه', feeNote: 'یک‌بار، پرداخت‌شده در %1', carried: 'منتقل‌شده از سال گذشته', topups: 'شارژهای امسال', spent: 'خرجِ امسال',
privateNote: 'یادداشتی خصوصی', floorNear: 'شارژ شما به کفِ خود نزدیک است. هر وقت مناسب بود شارژ کنید، یا هر بار جداگانه تسویه کنید. در شب‌های شما چیزی تغییر نمی‌کند.', floorBelow: 'شارژ شما از کفِ خود پایین‌تر است. هر وقت مناسب بود شارژ کنید، یا هر بار جداگانه تسویه کنید. در شب‌های شما چیزی تغییر نمی‌کند.',
rollNote: 'شارژِ مصرف‌نشده به سال بعد منتقل می‌شود و هرگز از بین نمی‌رود. حداقل خرجی در کار نیست.', guestNote: 'مهمان هرگز پرداخت نمی‌کند؛ هزینهٔ مهمان‌ها از شارژ شما کم می‌شود.',
ledgerT: 'سال در یک نگاه', byPlace: 'خرج به تفکیک فضا', activity: 'گردش شارژ', filt: ['همه', 'خرج', 'شارژ'], topup: 'شارژ کردن', statement: 'صورت‌حساب', stSent: 'صورت‌حساب به‌صورت خصوصی برایتان فرستاده می‌شود.',
topT: 'شارژ کردن', amount: 'مبلغ', method: 'روش', methods: ['کارت', 'حواله', 'در پذیرش'], topSend: 'درخواست شارژ', topNote: 'پس از تأیید واحد مالی به شارژ شما افزوده می‌شود.', topDone: 'درخواست ثبت شد.', pending: 'در انتظار',
txTop: 'شارژ', txCarry: 'منتقل‌شده از سال گذشته', settled: 'تسویه‌شده', receipt: 'رسید', status: 'وضعیت', report: 'گزارش مشکل', reported: 'واحد مالی با شما تماس می‌گیرد.',
accEy: 'حساب', name: 'آرش فراهانی', tier: 'عضو مؤسس · شمارهٔ ۱',
guestsH: 'مهمان‌های همیشگی', addGuest: 'افزودن مهمان', addGuestB: 'کسانی که امسال مهمان شما بوده‌اند.', noGuests: 'هنوز مهمانی ثبت نشده.', guestsNote: 'نام مهمان را پیش از شب بدهید. مهمان هرگز پرداخت نمی‌کند.', removed: 'حذف شد.', added: 'اضافه شد.', remove: 'حذف %1', allAdded: 'همه در فهرست شما هستند.',
settings: 'تنظیمات', language: 'زبان', notif: 'اعلان', notifs: ['رزروها', 'رویدادها', 'پاسخ کانسیرج'], rules: 'قوانین خانه', rulesEy: 'خانه',
leave: 'خروج از خانه', leaveQ: 'از خانه خارج می‌شوید؟', leaveB: 'برای ورود دوباره روی این دستگاه باید از نو وارد شوید. رزروهای شما سر جایشان می‌مانند.', stay: 'می‌مانم', leaveYes: 'خروج', left: 'از خانه خارج شدید. شب خوش.',
rulesBody: 'چند قانون کوتاه برای هر عضو و هر مهمان، بی‌استثنا.', houseLine: 'خیابان مریم، تهران؛ از ۰۸:۰۰ تا ۰۲:۰۰',
rulesList: [['مهمان', 'نام هر مهمان از پیش داده می‌شود. مهمان هرگز پرداخت نمی‌کند.'], ['صورت‌حساب', 'هیچ حسابی سر میز بسته نمی‌شود. از شارژ شما کم می‌شود.'], ['عکاسی', 'از اعضای دیگر، هیچ‌جای خانه عکس گرفته نمی‌شود.'], ['حریم', 'باشگاه عضویت هیچ‌کس را تأیید یا رد نمی‌کند.'], ['سن', 'هیچ‌کس زیر پانزده سال پذیرفته نمی‌شود، در هیچ ساعت و هیچ فضایی.'], ['دخانیات', 'فقط در بالکن / تراس. سیگار برگ فقط در هیومیدور.']]
}
};
var GUESTS = { en: ['Shirin Ahmadi', 'Kaveh Tehrani', 'Leila Karimi', 'Dariush Nikpour', 'Mina Sadeghi'], fa: ['شیرین احمدی', 'کاوه تهرانی', 'لیلا کریمی', 'داریوش نیک‌پور', 'مینا صادقی'] };

/* photographs: one per place, all carrying the house grade (no CSS filter). [src, object-position]
   Only the title hero loads eagerly; everything else is lazy. */
var SRC = {
  'title': ['img/ph-title-entrance.webp', '50% 40%'], 'open-door': ['img/ph-open-door.webp', '66% 50%'], 'pen': ['img/ph-pen.webp', '50% 62%'], 'tray': ['img/ph-tray.webp', '50% 58%'],
  'cover': ['img/ph-cover-chef.webp', '50% 60%'], 'artist': ['img/ph-artist.webp', '62% 50%'], 'quince': ['img/ph-quince.webp', '42% 55%'], 'members': ['img/ph-members.webp', '50% 50%'],
  'lounge': ['img/ph-lounge.webp', '40% 60%'], 'dining': ['img/ph-dining-room.webp', '35% 60%'], 'sushi': ['img/ph-sushi-chef.webp', '50% 55%'],
  'humidor-room': ['img/ph-humidor-room.webp', '50% 55%'], 'terrace': ['img/ph-terrace-couple.webp', '58% 50%'], 'garden': ['img/ph-garden-a.webp', '40% 55%'],
  'ev-art': ['img/ph-ev-art.webp', '55% 50%'], 'ev-dining': ['img/ph-dining.webp', '45% 45%'], 'ev-lounge': ['img/ph-lounge-members.webp', '70% 62%'],
  'concierge': ['img/ph-concierge-desk.webp', '50% 42%'], 'jibdoor': ['img/ph-jibdoor.webp', '62% 50%'], 'humidor': ['img/ph-humidor.webp', '62% 55%'],
  'card': ['img/ph-card.webp', '50% 40%'], 'seal': ['img/ph-seal.webp', '50% 45%'], 'corridor': ['img/ph-corridor.webp', '50% 50%']
};

/* ================= helpers ================= */
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var app = $('#app'), view = $('#view'), bar = $('#bar'), dock = $('#dock'), sheet = $('#sheet'), curtain = $('#curtain');
var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
var DAY = 864e5;
var P = { lang: ls.get('vault3.lang') === 'fa' ? 'fa' : 'en' };
var fa = function () { return P.lang === 'fa'; };
var L = function () { return T[P.lang]; };
var fill = function (s) { var a = arguments; return String(s).replace(/%(\d)/g, function (_, i) { return a[i]; }); };
var digits = function (s) { return fa() ? String(s).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }) : String(s); };
var n = function (x) { return new Intl.NumberFormat(fa() ? 'fa-IR' : 'en-US').format(x); };
var loc = function () { return fa() ? 'fa-IR-u-ca-persian-nu-arabext' : 'en-GB'; };
var dfmt = function (d, o) { var s = new Intl.DateTimeFormat(loc(), o).format(d); return fa() ? digits(s.replace(/,/g, '،')) : s; };
var monthYear = function (d) { var p = new Intl.DateTimeFormat(loc(), { month: 'long', year: 'numeric' }).formatToParts(d), g = function (t) { return (p.filter(function (x) { return x.type === t; })[0] || {}).value || ''; }; return digits(g('month') + ' ' + g('year')); };
var dayOf = function (off) { var d = new Date(); d.setHours(12, 0, 0, 0); return new Date(d.getTime() + off * DAY); };
var roman = function (i) { return fa() ? digits(i + 1) : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i]; };
// ordinals: "01" in English; in Persian never zero-padded ("۰۱" reads as dots)
var two = function (i) { return fa() ? digits(i + 1) : (i < 9 ? '0' : '') + (i + 1); };
/* separators. In Persian a middle dot beside a Persian digit reads like a zero (۷ · ۸ → ۷۰۸):
   next to a digit it becomes a dash, elsewhere it stays a spaced middle dot. */
var sep = function (h) { return fa() ? String(h).replace(/\s*·\s*/g, ' — ') : h; };
function img(key, eager, cls) {
  var s = SRC[key] || [key], pos = s[1] || '50% 50%';
  return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + s[0] + '" alt=""' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async" style="object-position:' + pos + ';transform-origin:' + pos + '">';
}
function dayName(off, o) { var l = L(); return off === 0 ? l.today : (off === 1 ? l.tomorrow : dfmt(dayOf(off), o || { weekday: 'long' })); }

/* ================= state that survives Back and reload ================= */
var S = (function () {
  var base = { authed: false, intro: false, ap: { field: null, interests: {}, how: null }, sent: null,
    res: [{ room: 4, day: 2, time: 3, party: 2 }], rf: {}, rsvp: { 2: true }, bring: {}, conc: null, cq: {},
    hide: true, filt: 0, pend: [], notif: [true, true, true], guests: [0, 1] };
  try { var s = JSON.parse(sessionStorage.getItem('vault3') || 'null'); if (s) return Object.assign(base, s); } catch (e) {}
  return base;
})();
function save() { try { sessionStorage.setItem('vault3', JSON.stringify(S)); } catch (e) {} }

var toastT;
function toast(msg) { var el = $('.toast'); el.textContent = sep(msg); el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 1800); }
function clearToast() { clearTimeout(toastT); $('.toast').classList.remove('on'); }

/* ================= data ================= */
var TIMES = ['12:30', '14:00', '19:30', '20:30', '21:30', '22:30'];
var isFull = function (day, ti, room) { return (day * 7 + ti * 3 + room * 2 + 1) % 5 === 0; };
var ZONE = [5, 11, 10, 8, 12];   // rooms follow the house zones: lounge 5, dining 11, sushi 10, humidor 8, terrace 12 (room 6 via the concierge, garden 13 offered)
var FEATURE = { room: 1, day: 0, time: 3 };   // the chef's table: dining room, today, 20:30 (never full)
var EV = [{ off: 3, seats: 12, img: 'ev-art', ar: '4/3' }, { off: 9, seats: 4, img: 'ev-dining', ar: '3/4' }, { off: 16, seats: 20, img: null }, { off: 27, seats: 9, img: 'ev-lounge', ar: '4/5' }];
function seatsLeft(i) { return EV[i].seats - (S.rsvp[i] ? 1 + (S.bring[i] || 0) : 0); }
/* wallet: a one-off joining fee, then a prepaid charge with a floor. Unused charge rolls into the next year;
   there is no minimum spend, no credit and nothing owed. Guests never pay: their share comes off the host's charge.
   tx: [kind, amount, days ago, room index, guests]   kind: 'carry' | 'top' | 'spend'. Sample figures that add up. */
var W = { fee: 250000000, feeDay: -420, floor: 100000000,
  tx: [['top', 300000000, -40], ['spend', 60000000, -2, 0, 3], ['spend', 90000000, -6, 1, 4], ['spend', 120000000, -12, 2, 2], ['spend', 50000000, -20, 3, 2], ['spend', 70000000, -25, 4, 1],
    ['spend', 110000000, -33, 1, 6], ['spend', 95000000, -70, 0, 2], ['spend', 70000000, -80, 3, 3], ['spend', 140000000, -95, 1, 4], ['spend', 95000000, -110, 2, 1],
    ['top', 500000000, -120], ['spend', 135000000, -150, 1, 8], ['spend', 80000000, -160, 4, 4], ['top', 400000000, -185], ['carry', 40000000, -190]] };
function wallet() {
  var carry = 0, top = 0, spent = 0, by = [0, 0, 0, 0, 0];
  W.tx.forEach(function (t) { if (t[0] === 'carry') carry += t[1]; else if (t[0] === 'top') top += t[1]; else { spent += t[1]; by[t[3]] += t[1]; } });
  var bal = carry + top - spent;
  return { carry: carry, top: top, spent: spent, bal: bal, by: by, near: bal < W.floor * 1.5, below: bal < W.floor };
}
function txName(t) { var l = L(); return t[0] === 'carry' ? l.txCarry : (t[0] === 'top' ? l.txTop : l.rooms[t[3]][0]); }
/* amounts. Persian is written the way it is said: «۴۵ میلیون», «۱ میلیارد و ۲۴۵ میلیون».
   Full figures (thin-space grouped) only on a receipt. */
function faWords(x) {
  x = Math.abs(x); var b = Math.floor(x / 1e9), m = Math.round((x - b * 1e9) / 1e6), parts = [];
  if (b) parts.push(digits(b) + ' میلیارد'); if (m) parts.push(digits(m) + ' میلیون');
  return parts.length ? parts.join(' و ') : n(x);
}
function amount(x, full) { if (!fa()) return n(Math.abs(x)); return full ? n(Math.abs(x)).replace(/[٬,]/g, ' ') : faWords(x); }
/* money: private by default. A hidden figure is a 44px button showing «••••••», never the number. */
function money(x, o) {
  o = o || {}; var l = L(), u = '<span class="u">' + l.unit + '</span>', cls = 'money ' + (o.cls || '');
  if (S.hide && !o.always) return '<button type="button" class="' + cls + ' masked" data-act="reveal" aria-label="' + esc(l.hiddenAmt) + '"><span class="dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>' + u + '</button>';
  var a = amount(x, o.full), sign = fa() ? '' : (o.sign || '');
  var num = fa() ? (o.full ? '<bdi dir="ltr">' + a + '</bdi>' : a) : '<bdi dir="ltr">' + sign + a + '</bdi>';
  return '<span class="' + cls + '"><span class="num">' + num + '</span>' + u + '</span>';
}
function party(k) { return k > 1 ? fill(L().people, digits(k)) : L().person; }
function whenLine(day, ti) {
  var d = dayOf(day), date = day < 2 ? dayName(day) + (fa() ? '، ' : ', ') + dfmt(d, { day: 'numeric', month: 'long' }) : dfmt(d, { weekday: 'long', day: 'numeric', month: 'long' });
  return fill(L().at, date, digits(TIMES[ti]));
}
/* the concierge line is open around the clock; between 02:00 and 09:00 the night reply answers */
function night() { var h = new Date().getHours(); return h >= 2 && h < 9; }
function concList() { if (!S.conc) { S.conc = L().seedConc.map(function (c, i) { return { seed: i, st: c[2] }; }); save(); } return S.conc; }
function season() { var m = Number(new Intl.DateTimeFormat('en-US-u-ca-persian', { month: 'numeric' }).format(new Date()).replace(/\D/g, '')); return [1, 1, 1, 2, 2, 2, 3, 3, 3, 0, 0, 0][m - 1]; }

/* ================= router ================= */
var route = { key: null, path: null }, depth = 0, scrolls = {}, ignorePop = false, busy = false, afterPop = null, skipping = false, heldOpen = false;
function curPath() { return (location.hash || '').replace(/^#\/?/, '').split('?')[0]; }
function go(path, o) {
  o = o || {};
  if (o.replace) history.replaceState({ i: depth }, '', '#/' + path);
  else { depth++; history.pushState({ i: depth }, '', '#/' + path); }
  render(o.back ? 'back' : 'fwd', o);
}
function goBack(fallback) { if (depth > 0) history.back(); else go(fallback, { replace: true, back: true }); }
/* after a confirmed booking, leave the room page behind: Back (or Done) lands where the guest came from */
function leaveRoom() {
  heldOpen = false;
  if (depth > 0) { skipping = true; history.back(); }
  else { history.replaceState({ i: 0 }, '', '#/m/reserve'); render('back', { fade: true }); toast(L().heldToast); }
}
window.addEventListener('popstate', function (e) {
  var i = (e.state && e.state.i) || 0;
  if (ignorePop) { ignorePop = false; depth = i; if (afterPop) { var f = afterPop; afterPop = null; f(); } return; }
  if (skipping) { skipping = false; depth = i; render('back'); toast(L().heldToast); return; }
  if (busy) skipCurtain();
  if (app.classList.contains('sheet-open')) {
    depth = i; var wasHeld = heldOpen; closeSheet(true);
    if (wasHeld) { leaveRoom(); return; }
    if (curPath() === route.path) return;
  }
  var to = curPath();
  // Back never logs out: from the member cover, Back stays inside
  if (S.authed && route.key && route.key.indexOf('m') === 0 && to.indexOf('m') !== 0) { depth = i; history.pushState({ i: ++depth }, '', '#/' + route.path); if (route.key !== 'm') go('m', { replace: true, back: true }); return; }
  // after sending a request, Back returns to the title, not into the finished form
  if (route.key === 'sent') { depth = i; history.replaceState({ i: depth }, '', '#/'); render('back'); return; }
  var dir = i < depth ? 'back' : 'fwd'; depth = i;
  render(dir);
});

var ROUTES = {};
function R(key, def) { ROUTES[key] = def; }
function resolve(path) {
  var p = path.split('/');
  if (p[0] === 'apply' && /^[1-4]$/.test(p[1] || '')) return { key: 'apply', step: Number(p[1]) };
  if (p[0] === 'apply' && p[1] === 'sent') return { key: 'sent' };
  if (p[0] === 'm' && p[1] === 'reserve' && /^[0-4]$/.test(p[2] || '')) return { key: 'm/room', room: Number(p[2]) };
  if (ROUTES[path]) return { key: path };
  return { key: '' };
}
function render(dir, o) {
  o = o || {};
  var path = curPath(), r = resolve(path);
  if (r.key.indexOf('m') === 0 && !S.authed) { history.replaceState({ i: depth }, '', '#/login'); r = { key: 'login' }; path = 'login'; }
  if (r.key === 'login' && S.authed) { history.replaceState({ i: depth }, '', '#/m'); r = { key: 'm' }; path = 'm'; }
  if (r.key === 'sent' && !S.sent) { r = { key: 'apply', step: 1 }; path = 'apply/1'; history.replaceState({ i: depth }, '', '#/apply/1'); }
  if (r.key === 'm/wallet' && route.key !== 'm/wallet' && dir !== 'same') { S.hide = true; save(); }
  if (dir !== 'same') clearToast();
  var def = ROUTES[r.key];
  var old = $('.page:not(.leave)', view);
  if (old && route.path != null) scrolls[route.path] = old.scrollTop;
  var first = route.key == null;
  r.path = path; route = r;

  document.documentElement.lang = fa() ? 'fa' : 'en'; document.documentElement.dir = fa() ? 'rtl' : 'ltr';
  document.documentElement.classList.toggle('fa', fa());
  app.classList.toggle('member', !!def.member); app.classList.toggle('fa', fa());
  app.setAttribute('data-route', r.key.replace(/\//g, '-') || 'title');
  drawBar(def); drawDock(def);

  var pg = document.createElement('div');
  pg.className = 'page ' + (def.cls || '') + ((first || o.fade) ? ' fade' : (dir === 'back' ? ' enter pback' : ' enter'));
  pg.innerHTML = sep(def.html(r));
  view.appendChild(pg);
  if (old) { old.classList.add('leave'); old.setAttribute('aria-hidden', 'true'); old.inert = true; setTimeout(function () { old.remove(); }, calm ? 0 : 620); }
  if (dir === 'back' && scrolls[path]) pg.scrollTop = scrolls[path]; else if (dir !== 'same') scrolls[path] = 0;
  bar.classList.toggle('scrolled', pg.scrollTop > 8);
  if (def.after) def.after(pg, r, dir);
  setTitle(def, r);
  if (!first && dir !== 'same' && !o.noFocus) { var h = $('h1', pg); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
}
function rerender() {
  var pg = $('.page:not(.leave)', view); if (!pg) return; var top = pg.scrollTop, def = ROUTES[route.key];
  var foc = document.activeElement && document.activeElement.closest && document.activeElement.closest('.page') === pg ? focusKey(document.activeElement) : null;
  pg.classList.remove('enter', 'fade', 'pback'); pg.classList.add('static'); pg.innerHTML = sep(def.html(route)); pg.scrollTop = top;
  if (def.after) def.after(pg, route, 'same');
  if (foc) { var t = pg.querySelector(foc); if (t) t.focus({ preventScroll: true }); }
}
function focusKey(el) { var a = el.getAttribute('data-act'), g = el.getAttribute('data-go'), v = el.getAttribute('data-v'); if (a) return '[data-act="' + a + '"]' + (v != null ? '[data-v="' + v + '"]' : ''); if (g != null) return '[data-go="' + g + '"]'; return null; }
function setTitle(def, r) { var h = $('.page:not(.leave) h1'); document.title = (h && r.key ? h.textContent.trim() + ' — ' : '') + 'The Vault'; }
// the masthead goes solid as soon as content scrolls under it
view.addEventListener('scroll', function (e) { var t = e.target; if (t.classList && t.classList.contains('page') && !t.classList.contains('leave')) bar.classList.toggle('scrolled', t.scrollTop > 8); }, true);

/* ================= masthead and navigation ================= */
var MARK = '<span class="mk" aria-hidden="true"></span>';
function drawBar(def) {
  var l = L(), monoTo = def.member ? 'm' : '';
  var left = def.back ? '<button type="button" class="nb back" data-act="back"><span class="arr" aria-hidden="true"></span><span>' + l.back + '</span></button>'
    : '<button type="button" class="nb mono" data-go="' + monoTo + '" aria-label="' + esc(l.home) + '">' + MARK + '</button>';
  var mid = (def.bare || def.noWord) ? '' : '<span class="word" aria-hidden="true">THE VAULT</span>';
  var right = '<button type="button" class="nb lang" data-act="lang" lang="' + (fa() ? 'en' : 'fa') + '" aria-label="' + l.langName + '">' + l.lang + '</button>' +
    (def.member ? '<button type="button" class="nb av" data-go="m/account" aria-label="' + esc(l.accEy) + '"' + (route.key === 'm/account' ? ' aria-current="page"' : '') + '>' + l.mono + '</button>' : '');
  bar.innerHTML = '<div class="bl">' + left + '</div>' + mid + '<div class="br">' + right + '</div>';
  bar.className = 'bar' + (def.bare ? ' bare' : '');
}
var DOCK = ['m', 'm/reserve', 'm/events', 'm/concierge', 'm/wallet'];
function drawDock(def) {
  dock.hidden = !def.member;
  if (!def.member) { dock.innerHTML = ''; return; }
  var k = route.key === 'm/room' ? 'm/reserve' : route.key;
  dock.setAttribute('aria-label', fa() ? 'بخش‌ها' : 'Sections');
  dock.innerHTML = DOCK.map(function (d, i) { return '<button type="button" data-go="' + d + '" data-tab="1"' + (k === d ? ' aria-current="page"' : '') + '><span>' + L().dock[i] + '</span></button>'; }).join('');
}

/* ================= pages: the title sequence ================= */
R('', { bare: true, cls: 'title-page', html: function () {
  var l = L(), done = S.intro || calm;
  return '<section class="seq' + (done ? ' done' : '') + '" aria-labelledby="ttl">' +
    '<div class="kb" aria-hidden="true">' + img('title', true) + '</div><div class="veil" aria-hidden="true"></div>' +
    '<div class="lb top" aria-hidden="true"><span>' + l.coords + '</span></div>' +
    '<div class="credits">' +
      '<p class="cr c1">' + l.cred1 + '</p>' +
      '<p class="cr c2">' + l.cred2 + '</p>' +
      '<h1 class="ttl" id="ttl"><span class="the" lang="en">' + l.the + '</span><span class="big">' + l.vault + '</span></h1>' +
      '<p class="subt"><span>' + l.sub + '</span></p>' +
      '<div class="acts"><button type="button" class="btn solid" data-go="login">' + l.enterM + '</button><button type="button" class="btn line" data-go="apply/1">' + l.request + '</button></div>' +
    '</div>' +
    '<div class="lb bot"><span aria-hidden="true">' + l.scene + '</span><span class="skiphint" aria-hidden="true">' + (done ? l.hours : l.skip) + '</span></div>' +
  '</section>';
}, after: function (pg) {
  var seq = $('.seq', pg);
  if (!seq.classList.contains('done')) {
    var t;
    var finish = function () { clearTimeout(t); seq.classList.add('done'); S.intro = true; save(); var sk = $('.skiphint', seq); if (sk) sk.textContent = L().hours; };
    t = setTimeout(finish, 5600);
    seq.addEventListener('click', function (e) { if (!seq.classList.contains('done') && !e.target.closest('button')) finish(); });
    seq.addEventListener('keydown', function () { finish(); }, { once: true });
    seq.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) { S.intro = true; save(); } });
  }
} });

/* ================= pages: login ================= */
R('login', { back: true, bare: true, cls: 'login-page', html: function () {
  var l = L();
  return '<section class="still">' +
    '<div class="kb slow" aria-hidden="true">' + img('open-door') + '</div><div class="veil" aria-hidden="true"></div>' +
    '<div class="still-copy"><p class="kicker">' + l.loginEy + '</p><h1 class="display">' + l.loginTitle + '</h1><p class="lede">' + l.loginBody + '</p>' +
    '<p class="who">' + l.loginWho + '</p>' +
    '<button type="button" class="btn solid" data-act="enter">' + l.enter + '</button>' +
    '<button type="button" class="tl" data-go="apply/1">' + l.notYou + '</button>' +
    '<p class="caption">' + l.loginCap + '</p></div></section>';
} });

/* cinematic transition into the house: the letterbox closes, a credit, then it opens on the cover */
var curtT = [];
function enterHouse() {
  if (busy) return; busy = true;
  var l = L();
  $('.c-a', curtain).textContent = sep(l.presents); $('.c-b', curtain).textContent = sep(l.starring);
  S.authed = true; save();
  if (calm) { busy = false; go('m', { replace: true, fade: true }); return; }
  curtain.classList.add('on'); curtain.classList.remove('open');
  void curtain.offsetWidth; curtain.classList.add('close');
  curtT.push(setTimeout(function () { go('m', { replace: true, fade: true, noFocus: true }); }, 1400));
  curtT.push(setTimeout(function () { curtain.classList.add('open'); }, 1800));
  curtT.push(setTimeout(endCurtain, 2750));
}
function endCurtain() { curtT.forEach(clearTimeout); curtT = []; curtain.classList.remove('on', 'close', 'open'); busy = false; var h = $('.page:not(.leave) h1'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
function skipCurtain() { if (!busy) return; if (route.key !== 'm') go('m', { replace: true, fade: true, noFocus: true }); endCurtain(); }
curtain.addEventListener('click', skipCurtain);

/* ================= option lists: radios for one choice, checkboxes for many ================= */
function opt(act, v, on, label, radio, extra) {
  return '<button type="button" class="opt" ' + (radio ? 'role="radio" aria-checked="' + !!on + '"' : 'aria-pressed="' + !!on + '"') + ' data-act="' + act + '" data-v="' + v + '"' + (extra || '') + '><span class="tick' + (radio ? ' round' : '') + '" aria-hidden="true"></span><span>' + esc(label) + '</span></button>';
}
function radios(label, act, list, cur, cls) { return '<div class="opts ' + (cls || '') + '" role="radiogroup" aria-label="' + esc(label) + '">' + list.map(function (f, i) { return opt(act, i, cur === i, f, true, cur === i || (cur == null && i === 0) ? '' : ' tabindex="-1"'); }).join('') + '</div>'; }

/* ================= pages: membership request (buttons only) ================= */
R('apply', { back: true, cls: 'apply-page', html: function (r) {
  var l = L(), s = r.step, st = l.steps[s - 1], a = S.ap, body = '';
  if (s === 1) body = radios(st[0], 'apField', l.fields, a.field);
  if (s === 2) body = '<div class="opts two" role="group" aria-label="' + esc(st[0]) + '">' + l.interests.map(function (f, i) { return opt('apInt', i, a.interests[i], f); }).join('') + '</div>';
  if (s === 3) body = radios(st[0], 'apHow', l.hows, a.how);
  if (s === 4) {
    var ints = Object.keys(a.interests).filter(function (k) { return a.interests[k]; }).map(function (k) { return l.interests[k]; });
    var row = function (k, label, val) { return '<div class="rv"><span class="rk">' + roman(k - 1) + ' · ' + label + '</span><span class="rvv' + (val ? '' : ' none') + '">' + (val || l.notChosen) + '</span><button type="button" class="tl small" data-go="apply/' + k + '" data-v="' + k + '">' + l.change + '</button></div>'; };
    body = '<div class="review">' + row(1, l.rvField, a.field != null ? l.fields[a.field] : '') + row(2, l.rvInterests, ints.join(fa() ? '، ' : ', ')) + row(3, l.rvHow, a.how != null ? l.hows[a.how] : '') + '</div>' +
      '<p class="fine">' + l.sendNote + '</p><button type="button" class="tl" data-go="rules">' + l.rulesLink + '</button>';
  }
  var reel = '<ol class="reel" aria-label="' + esc(fill(l.reel, digits(s), digits(4))) + '">' + [1, 2, 3, 4].map(function (k) { return '<li' + (k === s ? ' aria-current="step" class="cur"' : (k < s ? ' class="past"' : '')) + '><span>' + roman(k - 1) + '</span></li>'; }).join('') + '</ol>';
  return (s === 1 ? '<div class="ap-photo" aria-hidden="true">' + img('pen') + '</div>' : '') + '<div class="ap-in' + (s === 1 ? ' over' : '') + '"><p class="kicker">' + l.applyEy + ' · ' + fill(l.reel, digits(s), digits(4)) + '</p>' + reel +
    '<h1 class="display">' + st[0] + '</h1><p class="lede">' + st[1] + '</p>' + body +
    '<div class="ap-cta"><button type="button" class="btn solid" data-act="apNext">' + (s === 4 ? l.send : l.next) + '</button></div></div>';
} });
R('sent', { bare: true, cls: 'sent-page', html: function () {
  var l = L();
  return '<section class="still sealed"><div class="sent-photo" aria-hidden="true">' + img('tray') + '</div>' +
    '<div class="still-copy"><p class="kicker">' + l.sentEy + '</p><h1 class="display">' + l.sentTitle + '</h1><p class="lede">' + l.sentBody + '</p>' +
    '<p class="refno"><span>' + l.ref + '</span><b dir="ltr">' + digits(S.sent.ref) + '</b></p>' +
    '<button type="button" class="btn line" data-act="toStart">' + l.toStart + '</button></div></section>';
} });

/* ================= pages: the member cover ================= */
function greeting() { var h = new Date().getHours(), l = L(); return h < 12 ? l.morning : (h < 18 ? l.afternoon : l.evening); }
var STORY_GO = ['data-go="m/events"', 'data-act="feature"', 'data-go="m/reserve/0"'];
R('m', { member: true, bare: true, cls: 'cover-page', html: function () {
  var l = L(), nx = S.res[0];
  var cover = '<section class="cover" aria-labelledby="coverH"><div class="kb" aria-hidden="true">' + img('cover') + '</div><div class="veil" aria-hidden="true"></div>' +
    '<header class="mast"><p class="m-name" aria-hidden="true">' + (fa() ? 'د والت' : 'THE VAULT') + '</p><p class="m-line"><span>' + fill(l.issue, l.seasons[season()]) + '</span><span>' + dfmt(new Date(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '</span></p><p class="greet">' + greeting() + '</p></header>' +
    '<div class="cover-copy"><p class="kicker gold">' + l.featEy + '</p><h1 class="cover-h" id="coverH">' + l.featTitle + '</h1><p class="lede">' + l.featDeck + '</p>' +
    '<button type="button" class="btn solid" data-act="feature">' + l.featCta + '</button><p class="caption">' + l.featCap + '</p></div></section>';
  var next = '<section class="next" aria-labelledby="nextH"><p class="kicker" id="nextH">' + l.nextEy + '</p>' +
    (nx ? '<button type="button" class="credit" data-go="m/reserve"><span class="cr-room">' + l.rooms[nx.room][0] + '</span><span class="cr-when">' + whenLine(nx.day, nx.time) + '</span><span class="cr-who">' + party(nx.party) + '</span><span class="go" aria-hidden="true"></span></button>'
      : '<div class="credit empty"><span class="cr-room">' + l.nothing + '</span><span class="cr-when">' + l.nothingB + '</span><button type="button" class="btn line" data-go="m/reserve">' + l.chooseRoom + '</button></div>') + '</section>';
  var stories = '<section class="stories" aria-labelledby="tocH"><p class="kicker" id="tocH">' + l.insideEy + '</p><ol>' + l.stories.map(function (s, i) {
    return '<li><button type="button" class="story" ' + STORY_GO[i] + '><span class="th" aria-hidden="true">' + img(s[3]) + '</span><span class="st-tx"><span class="st-k">' + s[0] + '</span><b>' + s[1] + '</b><i>' + s[2] + '</i></span></button></li>'; }).join('') + '</ol></section>';
  return cover + stories + next;
} });

/* ================= pages: reserve — rooms as chapters ================= */
R('m/reserve', { member: true, cls: 'chapters', html: function () {
  var l = L();
  var mine = S.res.length ? '<div class="mine"><p class="kicker">' + l.yourBookings + '</p><ul>' + S.res.map(function (r, i) { return '<li><span><b>' + l.rooms[r.room][0] + '</b><i>' + whenLine(r.day, r.time) + ' · ' + party(r.party) + '</i></span><button type="button" class="tl small" data-act="cancelRes" data-v="' + i + '">' + l.cancel + '</button></li>'; }).join('') + '</ul></div>' : '';
  return '<section class="chap intro"><div class="chap-in"><p class="kicker">' + l.resEy + '</p><h1 class="display xl">' + l.resTitle + '</h1><p class="lede">' + l.resBody + '</p>' + mine + '</div></section>' +
    l.rooms.map(function (r, i) {
      return '<section class="chap" aria-labelledby="ch' + i + '"><div class="kb" aria-hidden="true">' + img(r[2]) + '</div><div class="veil" aria-hidden="true"></div>' +
        '<div class="chap-in"><p class="slug">' + r[3] + '</p><p class="chno"><span>' + fill(l.chapter, digits(ZONE[i])) + '</span></p><h2 class="chap-h" id="ch' + i + '">' + r[0] + '</h2><p class="lede">' + r[1] + '</p>' +
        '<button type="button" class="btn solid" data-go="m/reserve/' + i + '">' + (r[4] || l.reserveRoom) + '</button></div></section>';
    }).join('') +
    // the garden (zone 13) closes the chapters: it is never booked, only asked for through the concierge
    '<section class="chap garden" aria-labelledby="chG"><div class="kb" aria-hidden="true">' + img('garden') + '</div><div class="veil" aria-hidden="true"></div>' +
      '<div class="chap-in"><p class="slug">' + l.garden[3] + '</p><p class="chno"><span>' + fill(l.chapter, digits(13)) + '</span></p><h2 class="chap-h" id="chG">' + l.garden[0] + '</h2><p class="lede">' + l.garden[1] + '</p>' +
      '<button type="button" class="btn line" data-act="topic" data-v="6">' + l.garden[2] + '</button></div></section>';
}, after: function (pg) {
  if (calm || !('IntersectionObserver' in window)) { $$('.chap', pg).forEach(function (c) { c.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); }); }, { root: pg, threshold: 0.3 });
  $$('.chap', pg).forEach(function (c) { io.observe(c); });
} });

function rf(i) { if (!S.rf[i]) S.rf[i] = { day: 0, time: null, party: 2 }; return S.rf[i]; }
R('m/room', { member: true, back: true, cls: 'room-page', html: function (r) {
  var l = L(), room = l.rooms[r.room], f = rf(r.room);
  var days = '<div class="days" role="radiogroup" aria-label="' + l.day + '">' + Array.apply(null, Array(10)).map(function (_, i) {
    return '<button type="button" class="dbtn" role="radio" data-act="rday" data-v="' + i + '" aria-checked="' + (f.day === i) + '"' + (f.day === i ? '' : ' tabindex="-1"') + '><span>' + (i === 0 ? l.today : dfmt(dayOf(i), { weekday: 'short' })) + '</span><b>' + dfmt(dayOf(i), { day: 'numeric' }) + '</b><span>' + dfmt(dayOf(i), { month: 'short' }) + '</span></button>'; }).join('') + '</div>';
  var firstFree = TIMES.map(function (_, i) { return i; }).filter(function (i) { return !isFull(f.day, i, r.room); })[0];
  var times = '<div class="times" role="radiogroup" aria-label="' + l.time + '">' + TIMES.map(function (t, i) { var full = isFull(f.day, i, r.room), tab = f.time === i || (f.time == null && i === firstFree);
    return '<button type="button" class="tbtn" role="radio" data-act="rtime" data-v="' + i + '" aria-checked="' + (f.time === i) + '"' + (full ? ' disabled' : '') + (tab ? '' : ' tabindex="-1"') + '><b>' + digits(t) + '</b>' + (full ? '<span>' + l.full + '</span>' : '') + '</button>'; }).join('') + '</div>';
  var ready = f.time != null;
  return '<section class="room-hero"><div class="kb" aria-hidden="true">' + img(room[2]) + '</div><div class="veil" aria-hidden="true"></div><div class="rh-in"><p class="chno"><span>' + fill(l.chapter, digits(ZONE[r.room])) + '</span></p><h1 class="chap-h">' + room[0] + '</h1><p class="slug">' + room[3] + '</p></div></section>' +
    '<div class="book"><div class="blk"><h2 class="lab">' + l.day + '</h2>' + days + '</div>' +
    '<div class="blk"><h2 class="lab">' + l.time + '</h2>' + times + '</div>' +
    '<div class="blk"><h2 class="lab">' + l.party + '</h2><div class="stepper"><button type="button" data-act="party" data-v="-1" aria-label="' + l.less + '"' + (f.party <= 1 ? ' disabled' : '') + '><span class="pm" aria-hidden="true"></span></button><output aria-live="polite">' + party(f.party) + '</output><button type="button" data-act="party" data-v="1" aria-label="' + l.more + '"' + (f.party >= 8 ? ' disabled' : '') + '><span class="pm plus" aria-hidden="true"></span></button></div></div>' +
    '<div class="hold">' + (ready ? '' : '<p class="hint" id="holdHint">' + l.pickTime + '</p>') +
    '<button type="button" class="btn ' + (ready ? 'solid' : 'line') + '" data-act="hold"' + (ready ? '' : ' aria-disabled="true" aria-describedby="holdHint"') + '>' + l.hold + '</button></div></div>';
} });

/* ================= pages: events — magazine spreads ================= */
R('m/events', { member: true, cls: 'spreads', html: function () {
  var l = L();
  return '<header class="pg-head"><p class="kicker">' + l.evEy + '</p><h1 class="display xl">' + l.evTitle + '</h1></header>' +
    l.events.map(function (e, i) {
      var d = dayOf(EV[i].off), on = !!S.rsvp[i];
      var dt = '<p class="sp-date" aria-hidden="true"><b>' + dfmt(d, { day: 'numeric' }) + '</b><span>' + dfmt(d, { month: 'long' }) + '</span></p><p class="sp-no" aria-hidden="true">' + (fa() ? fill(l.evNo, two(i)) : two(i)) + '</p>';
      var head = EV[i].img ? '<div class="sp-img" style="aspect-ratio:' + EV[i].ar + '"><div class="kb" aria-hidden="true">' + img(EV[i].img) + '</div>' + dt + '</div>'
        : '<div class="sp-type"><p class="sp-no" aria-hidden="true">' + (fa() ? fill(l.evNo, two(i)) : two(i)) + '</p><div class="sp-row"><p class="sp-date" aria-hidden="true"><b>' + dfmt(d, { day: 'numeric' }) + '</b><span>' + dfmt(d, { month: 'long' }) + '</span></p><p class="pull" aria-hidden="true">' + e[4] + '</p></div></div>';
      return '<article class="spread s' + (i % 2) + (EV[i].img ? '' : ' type') + '" aria-labelledby="ev' + i + '">' + head +
        '<div class="sp-copy"><p class="kicker gold">' + l.kinds[i] + ' · ' + e[1] + '</p><h2 class="sp-h" id="ev' + i + '">' + e[0] + '</h2><p class="lede">' + e[3] + '</p>' +
        '<p class="meta">' + fill(l.at, dfmt(d, { weekday: 'long', day: 'numeric', month: 'long' }), digits(e[2])) + '<br>' + fill(l.seats, digits(seatsLeft(i))) + '</p>' +
        '<div class="sp-acts"><button type="button" class="btn ' + (on ? 'line on' : 'solid') + '" data-act="rsvp" data-v="' + i + '" aria-pressed="' + on + '">' + (on ? '✓ ' + l.going : l.attend) + '</button><button type="button" class="btn ghost" data-act="event" data-v="' + i + '">' + l.details + '</button></div></div></article>';
    }).join('');
} });

/* ================= pages: concierge ================= */
R('m/concierge', { member: true, cls: 'conc-page', html: function () {
  var l = L(), list = concList();
  var hist = '<section class="reqs" aria-labelledby="reqH"><p class="kicker" id="reqH">' + l.yourReq + '</p><ul>' + list.map(function (c, i) {
    var topic = l.topics[c.seed != null ? l.seedConc[c.seed][0] : c.t][0], text = c.seed != null ? l.seedConc[c.seed][1] : l.topics[c.t][2][c.w];
    return '<li><button type="button" data-act="concItem" data-v="' + i + '"><span class="tt"><b>' + topic + '</b><i>' + esc(text) + '</i></span><span class="st s' + c.st + '">' + l.st[c.st] + '</span></button></li>'; }).join('') + '</ul></section>';
  return '<section class="conc-hero"><div class="kb" aria-hidden="true">' + img('concierge') + '</div><div class="veil" aria-hidden="true"></div><div class="ch-in"><p class="kicker">' + l.concEy + '</p><h1 class="display xl">' + l.concTitle + '</h1><p class="lede">' + l.concBody + '</p></div></section>' +
    '<ol class="index">' + l.topics.slice(0, 6).map(function (t, i) { return '<li><button type="button" data-act="topic" data-v="' + i + '"><span class="pn">' + two(i) + '</span><span class="tt"><b>' + t[0] + '</b><i>' + t[1] + '</i></span><span class="go" aria-hidden="true"></span></button></li>'; }).join('') + '</ol><p class="fine also">' + l.concAlso + '</p>' + hist;
} });

/* ================= pages: wallet ================= */
function txRows() {
  var l = L(), f = S.filt, rows = [];
  if (f !== 1) S.pend.forEach(function (p) { rows.push({ at: p.at, h: '<li class="tx"><span class="tt"><b>' + l.txTop + ' · ' + l.methods[p.m] + '</b><i>' + dfmt(new Date(p.at), { day: 'numeric', month: 'long' }) + ' · ' + l.pending + '</i></span>' + money(p.amt) + '</li>' }); });
  W.tx.forEach(function (t, i) {
    var inn = t[0] !== 'spend'; if ((f === 1 && inn) || (f === 2 && !inn)) return;
    rows.push({ at: dayOf(t[2]).getTime(), h: '<li class="tx"><button type="button" class="txb" data-act="tx" data-v="' + i + '"><span class="tt"><b>' + txName(t) + '</b><i>' + dfmt(dayOf(t[2]), { weekday: 'short', day: 'numeric', month: 'short' }) + (inn ? '' : ' · ' + party(t[4] + 1)) + '</i></span></button>' + money(t[1]) + '</li>' });
  });
  rows.sort(function (a, b) { return b.at - a.at; });   // newest first
  return rows.map(function (r) { return r.h; }).join('');
}
R('m/wallet', { member: true, cls: 'wallet-page', html: function () {
  var l = L(), w = wallet(), f = S.filt, feeD = dayOf(W.feeDay);
  var order = w.by.map(function (v, i) { return i; }).sort(function (a, b) { return w.by[b] - w.by[a]; }), maxBy = w.by[order[0]];
  var fig = function (label, v, note) { return '<div class="fig"><dt>' + label + (note ? '<small>' + note + '</small>' : '') + '</dt><dd>' + money(v) + '</dd></div>'; };
  // near or below the floor: a quiet, private note, shown only with the figures
  var note = !S.hide && w.near ? '<p class="note"><b>' + l.privateNote + '</b>' + (w.below ? l.floorBelow : l.floorNear) + '</p>' : '';
  return '<section class="w-hero" aria-hidden="true"><div class="kb slow">' + img('card') + '</div><div class="veil"></div></section>' +
    '<header class="pg-head"><p class="kicker">' + l.walletEy + '</p><h1 class="sr">' + l.walletEy + '</h1></header>' +
    '<section class="wcard" aria-label="' + esc(l.charge) + '"><div class="wc-in"><div class="wc-top"><p class="wc-k">' + l.charge + '</p><span class="mk" aria-hidden="true"></span></div>' +
      '<div class="wc-amt">' + money(w.bal, { cls: 'huge' }) + '</div>' +
      '<div class="wc-av"><span>' + l.floor + '</span>' + money(W.floor) + '</div></div></section>' +
    '<div class="reveal"><button type="button" class="eye" data-act="eye" aria-pressed="' + !S.hide + '"><span class="eye-i' + (S.hide ? '' : ' off') + '" aria-hidden="true"></span>' + (S.hide ? l.showAll : l.hideAll) + '</button></div>' + note +
    '<div class="w-acts"><button type="button" class="btn solid" data-act="topup">' + l.topup + '</button><button type="button" class="btn line" data-act="statement">' + l.statement + '</button></div>' +
    '<section aria-labelledby="ledH"><h2 class="lab" id="ledH">' + l.ledgerT + '</h2><dl class="figs">' +
      fig(l.fee, W.fee, fill(l.feeNote, dfmt(feeD, { day: 'numeric', month: 'long', year: 'numeric' }))) + fig(l.carried, w.carry) + fig(l.topups, w.top) + fig(l.spent, w.spent) + '</dl>' +
      '<div class="w-notes"><p>' + l.rollNote + '</p><p>' + l.guestNote + '</p></div></section>' +
    '<section aria-labelledby="bpH"><h2 class="lab" id="bpH">' + l.byPlace + '</h2><ul class="bars">' + order.map(function (i) { var v = w.by[i]; return '<li><span class="bp-n">' + l.rooms[i][0] + '</span>' + money(v) + (S.hide ? '' : '<span class="meter thin" aria-hidden="true"><i style="--w:' + (v / maxBy * 100) + '%"></i></span>') + '</li>'; }).join('') + '</ul></section>' +
    '<section aria-labelledby="acH"><h2 class="lab" id="acH">' + l.activity + '</h2><div class="seg" role="radiogroup" aria-label="' + l.activity + '">' + l.filt.map(function (x, i) { return '<button type="button" role="radio" data-act="filt" data-v="' + i + '" aria-checked="' + (f === i) + '"' + (f === i ? '' : ' tabindex="-1"') + '>' + x + '</button>'; }).join('') + '</div><ul class="txs">' + txRows() + '</ul></section>';
} });

/* ================= pages: account and rules ================= */
R('m/account', { member: true, back: true, cls: 'acc-page', html: function () {
  var l = L(), G = GUESTS[P.lang];
  var sw = function (act, on, label, v) { return '<li><button type="button" class="sw" role="switch" aria-checked="' + !!on + '" data-act="' + act + '"' + (v != null ? ' data-v="' + v + '"' : '') + '><span>' + label + '</span><span class="knob" aria-hidden="true"></span></button></li>'; };
  return '<section class="acc-hero"><div class="kb slow" aria-hidden="true">' + img('seal') + '</div><div class="veil" aria-hidden="true"></div><div class="ah-in"><span class="mk acc-mark" aria-hidden="true"></span><p class="kicker">' + l.accEy + '</p><h1 class="display xl">' + l.name + '</h1><p class="meta">' + l.tier + '</p><p class="meta">' + (fa() ? 'عضو از ' + monthYear(dayOf(-420)) : 'Member since ' + monthYear(dayOf(-420))) + '</p></div></section>' +
    '<section aria-labelledby="gH"><h2 class="lab" id="gH">' + l.guestsH + '</h2><p class="fine g-note">' + l.guestsNote + '</p><ul class="glist">' + (S.guests.length ? S.guests.map(function (g, i) { return '<li><span>' + G[g] + '</span><button type="button" class="x" data-act="rmGuest" data-v="' + i + '" aria-label="' + esc(fill(l.remove, G[g])) + '"><span class="xi" aria-hidden="true"></span></button></li>'; }).join('') : '<li class="none">' + l.noGuests + '</li>') + '</ul>' +
      '<button type="button" class="btn line" data-act="addGuest">' + l.addGuest + '</button></section>' +
    '<section aria-labelledby="sH"><h2 class="lab" id="sH">' + l.settings + '</h2><ul class="setl">' +
      '<li class="langrow"><span>' + l.language + '</span><div class="seg small" role="group" aria-label="' + l.language + '"><button type="button" data-act="setLang" data-v="en" lang="en" aria-pressed="' + !fa() + '">English</button><button type="button" data-act="setLang" data-v="fa" lang="fa" aria-pressed="' + fa() + '">فارسی</button></div></li>' +
      l.notifs.map(function (x, i) { return sw('notif', S.notif[i], l.notif + ' · ' + x, i); }).join('') +
      '<li><button type="button" class="sw" data-go="m/rules"><span>' + l.rules + '</span><span class="go" aria-hidden="true"></span></button></li></ul></section>' +
    '<button type="button" class="btn ghost leave" data-act="leave">' + l.leave + '</button>';
} });
function rulesHTML() { var l = L(); return '<section class="rule-hero"><div class="kb slow" aria-hidden="true">' + img('corridor') + '</div><div class="veil" aria-hidden="true"></div><div class="rh-in"><p class="kicker">' + l.rulesEy + '</p><h1 class="display">' + l.rules + '</h1></div></section><p class="lede">' + l.rulesBody + '</p><p class="meta house">' + l.houseLine + '</p><ol class="rules">' + l.rulesList.map(function (r, i) { return '<li><span class="pn">' + roman(i) + '</span><span class="tt"><b>' + r[0] + '</b><i>' + r[1] + '</i></span></li>'; }).join('') + '</ol>'; }
R('rules', { back: true, cls: 'rules-page', html: rulesHTML });
R('m/rules', { member: true, back: true, cls: 'rules-page', html: rulesHTML });

/* ================= sheet: focus trap, Escape, Back ================= */
var sheetFrom = null, sheetHist = false;
function openSheet(title, html) {
  var wasOpen = app.classList.contains('sheet-open');
  if (!wasOpen) { sheetFrom = document.activeElement; if (!sheetHist) { sheetHist = true; history.pushState({ i: ++depth, sheet: 1 }, '', '#/' + route.path); } }
  $('#sheetT').textContent = sep(title); $('#sheetB').innerHTML = sep(html); $('#sheetX').setAttribute('aria-label', L().close);
  app.classList.add('sheet-open'); sheet.setAttribute('aria-hidden', 'false'); [view, bar, dock].forEach(function (x) { x.inert = true; });
  $('#sheetB').scrollTop = 0;
  setTimeout(function () { var first = $('#sheetB [data-first]') || $('#sheetX'); first.focus({ preventScroll: true }); }, wasOpen ? 0 : 80);
}
function closeSheet(fromPop, then) {
  if (!app.classList.contains('sheet-open')) { if (then) then(); return; }
  if (sheetHist && fromPop !== true) { ignorePop = true; afterPop = then || null; history.back(); }
  else if (then) setTimeout(then, 0);
  sheetHist = false; heldOpen = false; app.classList.remove('sheet-open'); sheet.setAttribute('aria-hidden', 'true'); [view, bar, dock].forEach(function (x) { x.inert = false; });
  if (sheetFrom && sheetFrom.focus && document.contains(sheetFrom)) sheetFrom.focus({ preventScroll: true });
}
sheet.addEventListener('keydown', function (e) {
  if (e.key !== 'Tab') return;
  var f = $$('button:not([disabled]):not([tabindex="-1"]),[href],[tabindex]:not([tabindex="-1"])', sheet).filter(function (x) { return x.offsetParent !== null; });
  if (!f.length) return; var a = f[0], z = f[f.length - 1];
  if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { if (busy) skipCurtain(); else if (heldOpen) history.back(); else closeSheet(); return; }
  // arrow keys move within a radio group, as on a native radio set
  var el = e.target; if (!el.getAttribute || el.getAttribute('role') !== 'radio') return;
  var k = e.key, rtl = fa(), step = k === 'ArrowDown' || (k === 'ArrowRight' && !rtl) || (k === 'ArrowLeft' && rtl) ? 1 : (k === 'ArrowUp' || (k === 'ArrowLeft' && !rtl) || (k === 'ArrowRight' && rtl) ? -1 : 0);
  if (!step) return; e.preventDefault();
  var group = $$('[role=radio]:not([disabled])', el.closest('[role=radiogroup]')), i = group.indexOf(el), nx = group[(i + step + group.length) % group.length];
  if (nx) { nx.click(); setTimeout(function () { var again = document.querySelector('[role=radio][data-act="' + nx.getAttribute('data-act') + '"][data-v="' + nx.getAttribute('data-v') + '"]'); (again || nx).focus(); }, 0); }
});
(function dragToClose() {
  var head = $('.sheet-head'), y0 = null, dy = 0;
  head.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; sheet.classList.add('drag'); head.setPointerCapture(e.pointerId); });
  head.addEventListener('pointermove', function (e) { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sheet.style.setProperty('--dy', dy + 'px'); });
  var up = function () { if (y0 == null) return; y0 = null; sheet.classList.remove('drag'); sheet.style.removeProperty('--dy'); if (dy > 90) { if (heldOpen) history.back(); else closeSheet(); } };
  head.addEventListener('pointerup', up); head.addEventListener('pointercancel', up);
})();

function kv(k, v) { return '<div class="kv"><dt>' + k + '</dt><dd>' + v + '</dd></div>'; }
function eventSheet(i) {
  var l = L(), e = l.events[i], d = dayOf(EV[i].off), on = !!S.rsvp[i], b = S.bring[i] || 0;
  openSheet(e[0], '<dl class="kvs">' + kv(l.date, fill(l.at, dfmt(d, { weekday: 'long', day: 'numeric', month: 'long' }), digits(e[2]))) + kv(l.place, e[1]) + kv(l.seatsK, digits(seatsLeft(i))) + '</dl>' +
    '<p class="lede">' + e[3] + '</p>' +
    (on ? '<div class="blk"><h3 class="lab">' + l.bring + '</h3><div class="stepper"><button type="button" data-act="bring" data-v="-1" data-e="' + i + '" aria-label="' + l.less + '"' + (b <= 0 ? ' disabled' : '') + '><span class="pm" aria-hidden="true"></span></button><output aria-live="polite">' + digits(b) + '</output><button type="button" data-act="bring" data-v="1" data-e="' + i + '" aria-label="' + l.more + '"' + (b >= 2 ? ' disabled' : '') + '><span class="pm plus" aria-hidden="true"></span></button></div></div>' : '') +
    '<button type="button" class="btn ' + (on ? 'line' : 'solid') + '" data-act="rsvp" data-v="' + i + '" data-first>' + (on ? l.release : l.attend) + '</button>' +
    '<button type="button" class="btn ghost" data-act="cal">' + l.addCal + '</button>');
}
var TOPIC_IMG = { 1: 'jibdoor', 5: 'humidor' };   // room 6 behind its jib door; the member's humidor drawer
var AMTS = [50000000, 100000000, 200000000, 500000000];
function pick(sel, el) { $$(sel).forEach(function (b) { var on = b === el; if (b.hasAttribute('aria-checked')) { b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; } else b.setAttribute('aria-pressed', String(on)); }); }

/* ================= one handler for every tap ================= */
app.addEventListener('click', function (e) {
  var el = e.target.closest('[data-go],[data-act]'); if (!el || busy) return;
  if (el.getAttribute('aria-disabled') === 'true' && el.getAttribute('data-act') !== 'hold') return;
  var l = L(), v = el.getAttribute('data-v');
  if (el.hasAttribute('data-go')) {
    var to = el.getAttribute('data-go');
    if (sheetHist) { closeSheet(false, function () { go(to); }); return; }
    if (to === route.path) { var pg = $('.page:not(.leave)'); if (pg) pg.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); return; }
    // switching between member sections replaces the entry (Back returns to the cover, not through every tab)
    var tab = el.hasAttribute('data-tab') && route.key !== 'm' && DOCK.indexOf(route.key) > 0;
    go(to, { replace: tab });
    return;
  }
  var A = {
    back: function () { goBack(route.key.indexOf('m') === 0 ? 'm' : (route.key === 'apply' && route.step > 1 ? 'apply/' + (route.step - 1) : '')); },
    close: function () { if (heldOpen) history.back(); else closeSheet(); },
    lang: function () { setLang(fa() ? 'en' : 'fa'); },
    setLang: function () { setLang(v); },
    enter: enterHouse,
    apField: function () { S.ap.field = Number(v); save(); rerender(); },
    apInt: function () { S.ap.interests[v] = !S.ap.interests[v]; save(); rerender(); },
    apHow: function () { S.ap.how = Number(v); save(); rerender(); },
    apNext: function () {
      if (route.step < 4) { go('apply/' + (route.step + 1)); return; }
      S.sent = { ref: 'TV-' + String(Date.now()).slice(-6) }; save(); go('apply/sent', { replace: true, fade: true });
    },
    toStart: function () { S.sent = null; S.ap = { field: null, interests: {}, how: null }; save(); depth = 0; history.replaceState({ i: 0 }, '', '#/'); render('back', { fade: true }); },
    feature: function () { S.rf[FEATURE.room] = { day: FEATURE.day, time: FEATURE.time, party: 2 }; save(); go('m/reserve/' + FEATURE.room); },
    rday: function () { var f = rf(route.room); f.day = Number(v); if (f.time != null && isFull(f.day, f.time, route.room)) f.time = null; save(); rerender(); },
    rtime: function () { rf(route.room).time = Number(v); save(); rerender(); },
    party: function () { var f = rf(route.room); f.party = Math.max(1, Math.min(8, f.party + Number(v))); save(); rerender(); },
    hold: function () {
      var f = rf(route.room);
      if (f.time == null) { var t = $('.page:not(.leave) .tbtn:not([disabled])'); if (t) { t.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' }); t.focus({ preventScroll: true }); } return; }
      openSheet(l.confirmT, '<div class="credit-roll"><p class="kicker">' + fill(l.chapter, digits(ZONE[route.room])) + '</p><p class="cr-room">' + l.rooms[route.room][0] + '</p></div><dl class="kvs">' + kv(l.date, f.day < 2 ? dayName(f.day) + (fa() ? '، ' : ', ') + dfmt(dayOf(f.day), { day: 'numeric', month: 'long' }) : dfmt(dayOf(f.day), { weekday: 'long', day: 'numeric', month: 'long' })) + kv(l.time, digits(TIMES[f.time])) + kv(l.guests, party(f.party)) + '</dl>' +
        '<div class="two-btn"><button type="button" class="btn line" data-act="close">' + l.change + '</button><button type="button" class="btn solid" data-act="confirm" data-first>' + l.confirm + '</button></div>');
    },
    confirm: function () {
      var f = rf(route.room), r = { room: route.room, day: f.day, time: f.time, party: f.party };
      S.res.push(r); S.res.sort(function (a, b) { return a.day - b.day || a.time - b.time; }); delete S.rf[route.room]; save();
      openSheet(l.heldT, '<div class="credit-roll"><span class="mk" aria-hidden="true"></span><p class="cr-room">' + l.rooms[r.room][0] + '</p><p class="meta">' + whenLine(r.day, r.time) + '<br>' + party(r.party) + '</p></div><p class="lede">' + l.heldB + '</p>' +
        '<div class="two-btn"><button type="button" class="btn line" data-act="cal">' + l.addCal + '</button><button type="button" class="btn solid" data-act="heldDone" data-first>' + l.done + '</button></div>');
      heldOpen = true;
    },
    heldDone: function () { history.back(); },   // the popstate closes the sheet and skips the finished form
    cancelRes: function () { var i = Number(v); openSheet(l.cancelQ, '<p class="lede">' + l.rooms[S.res[i].room][0] + '<br>' + whenLine(S.res[i].day, S.res[i].time) + '</p><div class="two-btn"><button type="button" class="btn line" data-act="close" data-first>' + l.keep + '</button><button type="button" class="btn solid danger" data-act="cancelYes" data-v="' + i + '">' + l.cancelYes + '</button></div>'); },
    cancelYes: function () { S.res.splice(Number(v), 1); save(); closeSheet(false, function () { rerender(); toast(l.cancelled); }); },
    event: function () { eventSheet(Number(v)); },
    rsvp: function () { var i = Number(v); S.rsvp[i] = !S.rsvp[i]; if (!S.rsvp[i]) S.bring[i] = 0; save(); toast(S.rsvp[i] ? l.rsvpOn : l.rsvpOff); if (app.classList.contains('sheet-open')) eventSheet(i); if (route.key === 'm/events') rerender(); },
    bring: function () { var i = Number(el.getAttribute('data-e')); S.bring[i] = Math.max(0, Math.min(2, (S.bring[i] || 0) + Number(v))); save(); eventSheet(i); var b = $('#sheetB [data-act="bring"][data-v="' + v + '"]'); if (b && !b.disabled) b.focus(); if (route.key === 'm/events') rerender(); },
    cal: function () { toast(l.calAdded); },
    topic: function () {
      var i = Number(v), t = l.topics[i]; S.cq[i] = S.cq[i] || 0; save();
      openSheet(t[0], (TOPIC_IMG[i] ? '<div class="sh-img" aria-hidden="true">' + img(TOPIC_IMG[i]) + '</div>' : '') + (i === 5 ? '<p class="lede">' + l.lockerB + '</p><dl class="kvs">' + l.cigars.map(function (c) { return kv(c[0], '× ' + digits(c[1])); }).join('') + '</dl>' : '<p class="lede">' + (t[3] || t[1]) + '</p>') +
        '<div class="blk"><h3 class="lab">' + l.when + '</h3><div class="opts" role="radiogroup" aria-label="' + l.when + '">' + t[2].map(function (o, k) { return opt('cq', k, S.cq[i] === k, o, true, ' data-t="' + i + '"' + (k === S.cq[i] ? ' data-first' : ' tabindex="-1"')); }).join('') + '</div></div>' +
        '<button type="button" class="btn solid" data-act="sendConc" data-v="' + i + '">' + l.sendC + '</button>');
    },
    cq: function () { var i = Number(el.getAttribute('data-t')); S.cq[i] = Number(v); save(); pick('#sheetB [data-act="cq"]', el); },
    sendConc: function () { var i = Number(v); concList().unshift({ t: i, w: S.cq[i] || 0, st: 0 }); S.cq[i] = 0; save(); closeSheet(false, function () { rerender(); toast(night() ? l.nightReply : l.sentC); }); },
    concItem: function () {
      var c = concList()[Number(v)], ti = c.seed != null ? l.seedConc[c.seed][0] : c.t, text = c.seed != null ? l.seedConc[c.seed][1] : l.topics[c.t][2][c.w], reply = c.seed != null ? l.seedConc[c.seed][3] : '';
      openSheet(l.topics[ti][0], '<p class="st s' + c.st + '">' + l.st[c.st] + '</p><div class="quote"><p class="kicker">' + l.asked + '</p><p>' + esc(text) + '</p></div>' +
        '<div class="quote reply"><p class="kicker gold">' + l.replyFrom + '</p><p>' + esc(reply || (night() ? l.nightReply : l.noReply)) + '</p></div>');
    },
    reveal: function () { S.hide = false; save(); rerender(); var b = $('.page:not(.leave) [data-act=eye]'); if (b) b.focus({ preventScroll: true }); },
    eye: function () { S.hide = !S.hide; save(); rerender(); },
    filt: function () { S.filt = Number(v); save(); rerender(); },
    statement: function () { toast(l.stSent); },
    topup: function () {
      S.top = S.top || { a: 1, m: 0 }; save();
      openSheet(l.topT, '<div class="blk"><h3 class="lab">' + l.amount + ' · ' + l.unit + '</h3><div class="opts two" role="radiogroup" aria-label="' + l.amount + '">' + AMTS.map(function (a, i) { return opt('topA', i, S.top.a === i, fa() ? faWords(a) : n(a), true, S.top.a === i ? ' data-first' : ' tabindex="-1"'); }).join('') + '</div></div>' +
        '<div class="blk"><h3 class="lab">' + l.method + '</h3><div class="seg" role="radiogroup" aria-label="' + l.method + '">' + l.methods.map(function (m, i) { return '<button type="button" role="radio" data-act="topM" data-v="' + i + '" aria-checked="' + (S.top.m === i) + '"' + (S.top.m === i ? '' : ' tabindex="-1"') + '>' + m + '</button>'; }).join('') + '</div></div>' +
        '<p class="fine pre">' + l.topNote + '</p><button type="button" class="btn solid" data-act="topSend">' + l.topSend + '</button>');
    },
    topA: function () { S.top.a = Number(v); save(); pick('#sheetB [data-act="topA"]', el); },
    topM: function () { S.top.m = Number(v); save(); pick('#sheetB [data-act="topM"]', el); },
    topSend: function () { var amt = AMTS[S.top.a]; S.pend.unshift({ amt: amt, m: S.top.m || 0, at: Date.now() }); S.top = null; save(); closeSheet(false, function () { rerender(); toast(l.topDone); }); },
    tx: function () {
      var t = W.tx[Number(v)], inn = t[0] !== 'spend', d = dayOf(t[2]);
      openSheet(txName(t), '<p class="sh-amt">' + money(t[1], { full: true, always: true }) + '</p><dl class="kvs">' + kv(l.date, dfmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })) +
        (inn ? '' : kv(l.room, l.rooms[t[3]][0]) + kv(l.guests, party(t[4] + 1))) + kv(l.status, l.settled) + kv(l.receipt, '<bdi dir="ltr">' + digits('R-' + (40211 + Number(v) * 37)) + '</bdi>') + '</dl>' +
        '<button type="button" class="btn ghost" data-act="report" data-first>' + l.report + '</button>');
    },
    report: function () { closeSheet(false, function () { toast(l.reported); }); },
    addGuest: function () {
      var G = GUESTS[P.lang], left = G.map(function (g, i) { return i; }).filter(function (i) { return S.guests.indexOf(i) < 0; });
      openSheet(l.addGuest, '<p class="lede">' + l.addGuestB + '</p>' + (left.length ? '<div class="opts">' + left.map(function (i, k) { return '<button type="button" class="opt" data-act="pickGuest" data-v="' + i + '"' + (k === 0 ? ' data-first' : '') + '><span class="tick plus" aria-hidden="true"></span><span>' + G[i] + '</span></button>'; }).join('') + '</div>' : '<p class="fine">' + l.allAdded + '</p>'));
    },
    pickGuest: function () { S.guests.push(Number(v)); save(); closeSheet(false, function () { rerender(); toast(l.added); }); },
    rmGuest: function () { S.guests.splice(Number(v), 1); save(); rerender(); toast(l.removed); var b = $('.page:not(.leave) [data-act="rmGuest"]') || $('.page:not(.leave) [data-act="addGuest"]'); if (b) b.focus({ preventScroll: true }); },
    notif: function () { S.notif[Number(v)] = !S.notif[Number(v)]; save(); el.setAttribute('aria-checked', String(S.notif[Number(v)])); },
    leave: function () {
      openSheet(l.leaveQ, '<p class="lede">' + l.leaveB + '</p><div class="two-btn"><button type="button" class="btn line" data-act="close" data-first>' + l.stay + '</button><button type="button" class="btn solid" data-act="leaveYes">' + l.leaveYes + '</button></div>');
    },
    leaveYes: function () {
      closeSheet(false, function () { S.authed = false; S.hide = true; save(); depth = 0; history.replaceState({ i: 0 }, '', '#/'); render('back', { fade: true }); toast(l.left); });
    }
  };
  var act = el.getAttribute('data-act');
  if (A[act]) A[act]();
});
// figures are hidden again whenever the app goes to the background
document.addEventListener('visibilitychange', function () { if (document.hidden && !S.hide) { S.hide = true; save(); if (route.key === 'm/wallet') rerender(); } });
function setLang(x) {
  P.lang = x === 'fa' ? 'fa' : 'en'; ls.set('vault3.lang', P.lang);
  var pg = $('.page:not(.leave)'), top = pg ? pg.scrollTop : 0;
  if (app.classList.contains('sheet-open')) closeSheet();
  render('same', { fade: true, noFocus: true });
  var np = $('.page:not(.leave)'); if (np) np.scrollTop = top;
  var b = route.key === 'm/account' ? $('.page:not(.leave) [data-act=setLang][aria-pressed=true]') : $('.bar .lang');
  if (b) b.focus({ preventScroll: true });
}

/* ================= start ================= */
var q = new URLSearchParams(location.search);
if (q.get('lang')) { P.lang = q.get('lang') === 'fa' ? 'fa' : 'en'; ls.set('vault3.lang', P.lang); }
history.replaceState({ i: 0 }, '', location.hash || '#/');
render('fwd', { fade: true });
})();
