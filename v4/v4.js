/* والت · The Vault — v4 "Iranian Today" (ایرانیِ امروز).
   Persian first, English as the translation. No build, no libraries.
   Girih (گره‌چینی) is drawn in code with Hankin's method; mirror-work (آینه‌کاری) facets catch a moving light.
   Routes live in the hash (#/m/wallet …) so Back, reload and deep links work. State: sessionStorage 'vault4'. */
(function () {
'use strict';

/* ================= strings: Persian first ================= */
var T = {
fa: {
lang: 'EN', langName: 'English', back: 'بازگشت', close: 'بستن', unit: 'تومان', brand: 'والت', menu: 'منوی اعضا',
eyebrow: 'باشگاه خصوصی اعضا، تهران', tagline: 'جایی که ارزش نگه‌داشته می‌شود.',
intro: 'سیزده فضا پشت یک در، در خیابان مریم. عضویت فقط با معرفی است.',
members: 'ورود اعضا', request: 'درخواست عضویت', rulesLink: 'قوانین خانه', scrollHint: 'آشنایی با خانه',
roomsT: 'فضاهای خانه', memT: 'عضویت، در چهار گام',
memSteps: ['با چند لمس، خودتان را معرفی کنید.', 'عضوی که شما را می‌شناسد، معرف شما می‌شود.', 'کمیته هر درخواست را شخصاً می‌خواند.', 'پاسخ، هر چه باشد، با پیامک می‌رسد.'],
foot: 'والت، تهران، از ۱۴۰۴',
words: { home: 'والت', login: 'ورود', apply: 'عضویت', sent: 'سپاس', reserve: 'رزرو', events: 'رویدادها', conc: 'کانسیرژ', wallet: 'کیف پول', account: 'حساب', rules: 'قوانین' },
loginT: 'خوش برگشتید.', loginB: 'این دستگاه شما را می‌شناسد. یک لمس کافی است تا گره باز شود.', asMember: 'ادامه به نام آرش', faceId: 'ورود با Face ID', notMember: 'عضو نیستید؟ درخواست عضویت', memberName: 'آرش فراهانی', memberLine: 'عضو مؤسس، شمارهٔ ۰۰۱', opening: 'گره باز می‌شود…',
stepOf: 'گام %1 از ۴', next: 'بعدی', edit: 'تغییر', chooseOne: 'یکی را انتخاب کنید',
aSteps: [['حوزهٔ کار شما', 'یکی را انتخاب کنید؛ بعداً دربارهٔ آن گفت‌وگو می‌کنیم.'], ['در والت دنبال چه هستید؟', 'هر چند مورد که می‌خواهید.'], ['معرف و راه تماس', 'چه کسی شما را می‌شناسد و چطور با شما تماس بگیریم.'], ['یک بار دیگر ببینید', 'اگر همه درست است، بفرستید.']],
fields: ['هنر', 'فناوری', 'رسانه', 'سرمایه‌گذاری', 'مهمان‌نوازی', 'مد و سبک زندگی', 'سلامت', 'معماری و طراحی'],
interests: ['غذا', 'هنر', 'سلامت', 'رویدادها', 'سفر', 'کسب‌وکار', 'موسیقی'],
refT: 'معرف', refs: ['یکی از اعضا معرف من است', 'از یک رویداد والت آمده‌ام', 'بدون معرف'],
contactT: 'راه تماس', contacts: ['پیامک', 'تماس تلفنی', 'ایمیل'],
rvField: 'حوزه', rvInt: 'علاقه‌ها', rvRef: 'معرف', rvContact: 'تماس',
submit: 'می‌پذیرم و می‌فرستم', agreeNote: 'با فرستادن، قوانین خانه و سیاست حریم خصوصی را می‌پذیرید.',
sentT: 'درخواست شما مهر و موم شد.', sentB: 'کمیته هر درخواست را شخصاً می‌خواند. تا ده روز دیگر با پیامک خبر می‌گیرید.', ref: 'شمارهٔ پیگیری', toHome: 'بازگشت به آستانه',
rulesT: 'قوانین خانه', rulesB: 'چند قانون کوتاه برای هر عضو و هر مهمان، بی‌استثنا.',
rules: [['مهمان', 'نام هر مهمان از پیش داده می‌شود. مهمان هرگز پرداخت نمی‌کند.'], ['صورت‌حساب', 'هیچ حسابی سر میز بسته نمی‌شود؛ از شارژ شما کم می‌شود.'], ['عکاسی', 'از اعضای دیگر، هیچ‌جای خانه عکس گرفته نمی‌شود.'], ['حریم', 'باشگاه عضویت هیچ‌کس را تأیید یا رد نمی‌کند.'], ['سن', 'هیچ‌کس زیر پانزده سال، در هیچ ساعتی.'], ['دخانیات', 'فقط در تراس. سیگار برگ در هیومیدور.']],
memberNo: 'عضو شمارهٔ ۰۰۱', morning: 'صبح بخیر', afternoon: 'عصر بخیر', evening: 'شب بخیر',
cardHint: 'برای کارت ورود، روی کارت بزنید', tier: 'عضو مؤسس', passT: 'کارت ورود', passB: 'دربان این نقش را می‌خواند. هر بار عوض می‌شود.', passGuests: 'امشب، %1 مهمان همراه شما', passAlone: 'امشب، بدون مهمان', heldLine: 'میز شما در %1 برای %2 نگه داشته شده.',
nextVisit: 'حضور بعدی شما', nothing: 'هنوز رزروی نیست', chooseRoom: 'یک فضا و یک ساعت انتخاب کنید',
tonight: 'امشب و این هفته', chefT: 'میز سرآشپز', chefD: 'امشب، هشت صندلی، منوی فصل', terrT: 'تراس باز است', terrD: 'شام زیر آسمان، تا نیمه‌شب', today: 'امروز',
tiles: [['فهرست مهمان', 'مهمان‌های همیشگی'], ['ماشین دم در', 'هر وقت آماده‌اید'], ['قفسهٔ هیومیدور', 'شمارهٔ ۱۴، نه سیگار'], ['قوانین خانه', 'شش قانون کوتاه']],
carT: 'ماشین شما', carB: 'متصدی پارکینگ آن را دم در می‌آورد. بگویید کی.', carWhen: ['همین حالا', '۱۵ دقیقهٔ دیگر', '۳۰ دقیقهٔ دیگر'], carSend: 'ماشینم را بیاورید', carDone: 'ماشین شما در راه در ورودی است.',
lockerT: 'قفسهٔ هیومیدور شمارهٔ ۱۴', lockerB: 'در رطوبت ۷۰٪ و دمای ۱۸ درجه نگه داشته می‌شود. کلید نزد مسئول هیومیدور است.', cigars: [['کوهیبا بهیکه ۵۴', 3], ['مونته‌کریستو شمارهٔ ۲', 4], ['پادرون ۱۹۶۴', 2]], ask: 'درخواست از مسئول', asked: 'مسئول هیومیدور انتخاب شما را می‌آورد.',
dock: ['خانه', 'رزرو', 'رویدادها', 'کانسیرژ', 'کیف پول'],
reserveT: 'کجا می‌خواهید بنشینید؟', yourRes: 'رزروهای شما', cancel: 'لغو', cancelQ: 'این رزرو لغو شود؟', cancelYes: 'بله، لغو شود', keep: 'نگه دار', cancelled: 'رزرو لغو شد.',
rooms: [['لانژ', 'قلب باشگاه. روزها بدون رزرو.', 'lounge'], ['سالن غذاخوری', 'یک سالن، یک سرویس. ناهار و شام.', 'room-table'], ['پیشخوان سوشی', 'هشت صندلی روبه‌روی ایتامه.', 'room-sushi'], ['بار و هیومیدور', 'سیگار برگ فقط اینجا.', 'room-humidor'], ['تراس', 'فضای باز، با شام.', 'room-terrace'], ['باغچهٔ ژاپنی', 'فروشی نیست؛ داده می‌شود.', 'room-garden']],
day: 'روز', time: 'ساعت', party: 'چند نفر، با خودتان', full: 'پر', reserveBtn: 'نگه داشتن میز', confirmT: 'تأیید رزرو', confirm: 'تأیید', change: 'تغییر', placeT: 'جا', dateT: 'تاریخ', guestsT: 'نفرات',
heldT: 'میز شما نگه داشته شد', heldB: 'به نام شما نگه داشته می‌شود. رضا، میزبان، منتظرتان است.', addCal: 'افزودن به تقویم', done: 'تمام', calAdded: 'به تقویم شما اضافه شد.',
people: '%1 نفر', minus: 'یک نفر کمتر', plus: 'یک نفر بیشتر',
eventsT: 'تقویم خصوصی فرهنگ و هنر.', seats: '%1 جای خالی', going: 'می‌آیم', youGo: 'جای شما نگه داشته شده', bring: 'مهمان همراه', attend: 'جایم را نگه دارید', release: 'جایم را آزاد کنید', rsvpOn: 'جای شما نگه داشته شد.', rsvpOff: 'جای شما آزاد شد.', share: 'اشتراک',
events: [['پیش‌نمایش هنر معاصر', 'تالار گالری', '19:00', 'نخستین نگاه به مجموعهٔ زمستان، با حضور هنرمندان.'], ['میز طراحی و معماری', 'استودیوی اعضا', '20:00', 'دوازده صندلی، یک میز بلند، سه معمار و یک پرسش.'], ['جاز در لانژ', 'لانژ', '22:00', 'یک تریو از استانبول. دیروقت، آرام، فقط برای اعضا.'], ['برانچ مجموعه‌داران', 'لانژ چمبر', '11:00', 'مجموعه‌داران، یک کیوریتور و یک صبحانهٔ خیلی خوب.']],
concT: 'چه کاری برایتان انجام دهیم؟', concB: 'یک لمس کافی است. اگر شدنی باشد، انجام می‌شود و همین امشب خبر می‌گیرید.',
topics: [['میز در جای دیگر', ['شام دونفره', 'ناهار کاری', 'جایی آرام']], ['ماشین و راننده', ['تا خانه', 'فرودگاه امام', 'یک ساعت در شهر']], ['گل یا هدیه', ['گل سفید', 'شیرینی', 'به سلیقهٔ کانسیرژ']], ['بلیت', ['کنسرت', 'تئاتر', 'نمایشگاه']], ['سفر', ['هتل', 'پرواز', 'هر دو']], ['با من تماس بگیرید', ['تماس تلفنی', 'پیام']]],
what: 'چه', soon: 'کی', whens: ['امروز', 'همین هفته', 'عجله‌ای نیست'], sendC: 'ارسال به کانسیرژ', sentC: 'کانسیرژ درخواست شما را دارد.',
yourReq: 'درخواست‌های شما', st: ['دریافت شد', 'در حال انجام', 'انجام شد'], replyFrom: 'پاسخ کانسیرژ',
seedConc: [[1, 0, 1, 'یک سدان مشکی ساعت ۲۳:۳۰ جلوی در منتظر است. نام راننده رضاست.', 2], [2, 0, 1, '', 1]],
privacy: 'مبالغ پنهان‌اند. برای دیدن، لمس کنید.', show: 'نمایش مبالغ', hide: 'پنهان کردن', hiddenAmt: 'مبلغ پنهان',
balance: 'مانده', inCredit: 'بستانکار', inDebt: 'بدهی به خانه', topup: 'شارژ حساب', statement: 'صورت‌حساب', stSent: 'صورت‌حساب به‌صورت خصوصی برایتان فرستاده می‌شود.',
creditT: 'اعتبار حساب', limit: 'سقف اعتبار', used: 'بدهی', avail: 'قابل خرج', creditNote: 'تا وقتی بدهی به سقف نرسیده، با اعتبار خرج می‌کنید. با رسیدن به سقف، خرید با حساب تا تسویه متوقف می‌شود.',
yearT: 'این سال عضویت', fee: 'حق عضویت', topped: 'جمع شارژها', spent: 'جمع خرج', remain: 'ماندهٔ شارژ', debt: 'بدهی',
feeNote: 'حق عضویت در %1 پرداخت شده. تمدید در %2.', byPlace: 'خرج به تفکیک جا', activity: 'گردش حساب', filt: ['همه', 'خرج', 'شارژ'],
places: ['سالن غذاخوری', 'لانژ', 'پیشخوان سوشی', 'رویدادها', 'کانسیرژ'],
topT: 'شارژ حساب', topAmt: 'مبلغ', method: 'روش', methods: ['کارت', 'حواله', 'در پذیرش'], topSend: 'درخواست شارژ', topDone: 'ثبت شد. پس از تأیید بخش مالی به حساب می‌نشیند.', pending: 'در انتظار',
txTop: 'شارژ', txFee: 'حق عضویت', receipt: 'رسید', statusT: 'وضعیت', settled: 'تسویه‌شده', report: 'گزارش مشکل', reported: 'بخش مالی با شما تماس می‌گیرد.',
since: 'عضو از %1', guestsH: 'مهمان‌های همیشگی', addGuest: 'افزودن از آشنایان', noGuests: 'هنوز مهمانی ثبت نشده.', removed: 'حذف شد.', remove: 'حذف %1', added: 'اضافه شد.',
settings: 'تنظیمات', language: 'زبان', notif: 'اعلان', notifs: ['رزروها', 'رویدادها', 'پاسخ کانسیرژ'], faceid: 'باز کردن با Face ID', lock: 'بستن گره و خروج', locked: 'گره بسته شد.', motion: 'نور آینه‌ها با حرکت گوشی', motionOn: 'آینه‌ها حالا با گوشی شما نور می‌گیرند.'
},
en: {
lang: 'فا', langName: 'فارسی', back: 'Back', close: 'Close', unit: 'Toman', brand: 'The Vault', menu: 'Member menu',
eyebrow: 'Private members’ club · Tehran', tagline: 'Where value is kept.',
intro: 'Thirteen rooms behind one door on Maryam Street. Membership is by introduction only.',
members: 'Members', request: 'Request membership', rulesLink: 'House rules', scrollHint: 'The house',
roomsT: 'The rooms', memT: 'Membership, in four steps',
memSteps: ['Introduce yourself in a few taps.', 'A member who knows you becomes your referrer.', 'The committee reads every request in person.', 'The answer, either way, arrives by message.'],
foot: 'The Vault · Tehran · since 2025',
words: { home: 'The Vault', login: 'Members', apply: 'Membership', sent: 'Thank you', reserve: 'Reserve', events: 'Events', conc: 'Concierge', wallet: 'Wallet', account: 'Account', rules: 'House rules' },
loginT: 'Welcome back.', loginB: 'This device knows you. One tap and the knot opens.', asMember: 'Continue as Arash', faceId: 'Open with Face ID', notMember: 'Not a member? Request membership', memberName: 'Arash Farahani', memberLine: 'Founding member · Nº 001', opening: 'The knot is opening…',
stepOf: 'Step %1 of 4', next: 'Next', edit: 'Change', chooseOne: 'Choose one',
aSteps: [['Your field', 'Choose one; we will talk about it later.'], ['What brings you to The Vault?', 'As many as you like.'], ['Referrer and contact', 'Who knows you, and how we should reach you.'], ['One last look', 'If all is right, send it.']],
fields: ['Art', 'Technology', 'Media', 'Investment', 'Hospitality', 'Fashion & lifestyle', 'Health & wellness', 'Architecture & design'],
interests: ['Dining', 'Art', 'Wellness', 'Events', 'Travel', 'Business', 'Music'],
refT: 'Referrer', refs: ['A member is my referrer', 'I came through a Vault event', 'No referrer'],
contactT: 'Contact', contacts: ['Text message', 'Phone call', 'Email'],
rvField: 'Field', rvInt: 'Interests', rvRef: 'Referrer', rvContact: 'Contact',
submit: 'Accept and send', agreeNote: 'By sending, you accept the house rules and the privacy policy.',
sentT: 'Your request is sealed.', sentB: 'The committee reads every request in person. You will hear from us by message within ten days.', ref: 'Reference', toHome: 'Back to the threshold',
rulesT: 'House rules', rulesB: 'A few short rules for every member and every guest, with no exceptions.',
rules: [['Guests', 'Every guest is named before the night. A guest never pays.'], ['The bill', 'Nothing is settled at the table; it comes off your charge.'], ['Photography', 'No photographs of other members, anywhere in the house.'], ['Privacy', 'The club never confirms or denies who is a member.'], ['Age', 'No one under fifteen, at any hour.'], ['Smoking', 'The terrace only. Cigars in the humidor.']],
memberNo: 'Member Nº 001', morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening',
cardHint: 'Tap the card for your door pass', tier: 'Founding member', passT: 'Door pass', passB: 'The doorman reads this pattern. It changes every visit.', passGuests: 'Tonight · %1 guests with you', passAlone: 'Tonight · no guests', heldLine: 'Your table in %1 is held for %2.',
nextVisit: 'Your next visit', nothing: 'Nothing reserved yet', chooseRoom: 'choose a room and a time',
tonight: 'Tonight and this week', chefT: 'The chef’s table', chefD: 'Tonight · eight seats · a menu of the season', terrT: 'The terrace is open', terrD: 'Dinner under the sky · until midnight', today: 'Today',
tiles: [['Guest list', 'Your regular guests'], ['Car at the door', 'Ready when you are'], ['Humidor locker', 'Nº 14 · nine cigars'], ['House rules', 'Six short rules']],
carT: 'Your car', carB: 'The valet brings it to the door. Tell us when.', carWhen: ['Now', 'In 15 minutes', 'In 30 minutes'], carSend: 'Bring my car', carDone: 'Your car is on its way to the door.',
lockerT: 'Humidor locker Nº 14', lockerB: 'Kept at 70% humidity, 18°C. The humidor keeper holds the key.', cigars: [['Cohiba Behike 54', 3], ['Montecristo Nº 2', 4], ['Padrón 1964', 2]], ask: 'Ask the keeper', asked: 'The keeper will bring your selection.',
dock: ['Home', 'Reserve', 'Events', 'Concierge', 'Wallet'],
reserveT: 'Where would you like to sit?', yourRes: 'Your reservations', cancel: 'Cancel', cancelQ: 'Cancel this reservation?', cancelYes: 'Yes, cancel it', keep: 'Keep it', cancelled: 'The reservation is cancelled.',
rooms: [['The lounge', 'The heart of the club. No reservation by day.', 'lounge'], ['Dining room', 'One room, one service. Lunch and dinner.', 'room-table'], ['Sushi counter', 'Eight seats in front of the itamae.', 'room-sushi'], ['Bar and humidor', 'Cigars here and nowhere else.', 'room-humidor'], ['The terrace', 'Open air, dinner served.', 'room-terrace'], ['The Japanese garden', 'Granted, not sold.', 'room-garden']],
day: 'Day', time: 'Time', party: 'How many, with you', full: 'Full', reserveBtn: 'Hold the table', confirmT: 'Confirm the reservation', confirm: 'Confirm', change: 'Change', placeT: 'Place', dateT: 'Date', guestsT: 'Party',
heldT: 'Your table is held', heldB: 'It is kept under your name. Reza, the host, will be waiting.', addCal: 'Add to calendar', done: 'Done', calAdded: 'Added to your calendar.',
people: '%1 people', minus: 'One fewer', plus: 'One more',
eventsT: 'A private calendar of culture and art.', seats: '%1 seats left', going: 'Going', youGo: 'Your seat is held', bring: 'Guests you bring', attend: 'Hold my seat', release: 'Release my seat', rsvpOn: 'Your seat is held.', rsvpOff: 'Your seat is released.', share: 'Share',
events: [['Contemporary art preview', 'The Gallery Hall', '19:00', 'A first look at the winter collection, with the artists in the room.'], ['Design and architecture table', 'Members’ Studio', '20:00', 'Twelve seats, one long table, three architects and a question.'], ['Jazz in the lounge', 'The lounge', '22:00', 'A trio from Istanbul. Late, quiet, and only for members.'], ['Collectors’ brunch', 'Chamber Lounge', '11:00', 'Collectors, a curator and a very good breakfast.']],
concT: 'What can we arrange?', concB: 'One tap is enough. If it can be done, it will be, and you will hear back tonight.',
topics: [['A table elsewhere', ['Dinner for two', 'Business lunch', 'Somewhere quiet']], ['Car and driver', ['Home', 'Imam Khomeini Airport', 'An hour in the city']], ['Flowers or a gift', ['White flowers', 'Pastries', 'Concierge’s choice']], ['Tickets', ['Concert', 'Theatre', 'Exhibition']], ['Travel', ['Hotel', 'Flight', 'Both']], ['Call me', ['Phone call', 'Message']]],
what: 'What', soon: 'When', whens: ['Today', 'This week', 'No hurry'], sendC: 'Send to the concierge', sentC: 'The concierge has it.',
yourReq: 'Your requests', st: ['Received', 'In progress', 'Done'], replyFrom: 'From the concierge',
seedConc: [[1, 0, 1, 'A black sedan will wait at the door at 23:30. The driver’s name is Reza.', 2], [2, 0, 1, '', 1]],
privacy: 'Amounts are hidden. Tap to see them.', show: 'Show amounts', hide: 'Hide', hiddenAmt: 'hidden amount',
balance: 'Balance', inCredit: 'in credit', inDebt: 'owed to the house', topup: 'Top up', statement: 'Statement', stSent: 'Your statement will be sent privately.',
creditT: 'Credit on account', limit: 'Credit limit', used: 'Owed', avail: 'Available', creditNote: 'You can keep spending on account until what you owe reaches the limit. At the limit, charges pause until you settle.',
yearT: 'This membership year', fee: 'Membership fee', topped: 'Total top-ups', spent: 'Total spent', remain: 'Remaining charge', debt: 'Owed',
feeNote: 'Membership fee paid on %1. Renews on %2.', byPlace: 'Spend by place', activity: 'Activity', filt: ['All', 'Spending', 'Top-ups'],
places: ['Dining room', 'The lounge', 'Sushi counter', 'Events', 'Concierge'],
topT: 'Top up your charge', topAmt: 'Amount', method: 'How', methods: ['Card', 'Bank transfer', 'At the desk'], topSend: 'Request top-up', topDone: 'Requested. It is credited once the finance desk confirms.', pending: 'Pending',
txTop: 'Top-up', txFee: 'Membership fee', receipt: 'Receipt', statusT: 'Status', settled: 'Settled', report: 'Report a problem', reported: 'The finance desk will contact you.',
since: 'Member since %1', guestsH: 'Your regular guests', addGuest: 'Add from people you know', noGuests: 'No regular guests yet.', removed: 'Removed.', remove: 'Remove %1', added: 'Added.',
settings: 'Settings', language: 'Language', notif: 'Notifications', notifs: ['Reservations', 'Events', 'Concierge replies'], faceid: 'Open with Face ID', lock: 'Close the knot and sign out', locked: 'The knot is closed.', motion: 'Mirrors follow the phone’s tilt', motionOn: 'The mirrors now catch light as you tilt.'
}
};
var NAMES = [['شیرین احمدی', 'Shirin Ahmadi'], ['کاوه تهرانی', 'Kaveh Tehrani'], ['نگار صدری', 'Negar Sadri'], ['بهرام نیک‌نام', 'Bahram Niknam'], ['لیلا کاشانی', 'Leila Kashani']];

/* ================= helpers ================= */
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var app = $('#app'), view = $('#view'), bar = $('#bar'), dock = $('#dock'), field = $('#field'), sheet = $('#sheet');
var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
var DAY = 864e5;
var P = { lang: store.get('vault4.lang') === 'en' ? 'en' : 'fa' };
var fa = function () { return P.lang === 'fa'; };
var L = function () { return T[P.lang]; };
var fill = function (s) { var a = arguments; return String(s).replace(/%(\d)/g, function (_, i) { return a[i]; }); };
var n = function (x) { return new Intl.NumberFormat(fa() ? 'fa-IR' : 'en-US').format(x); };
var digits = function (s) { return fa() ? String(s).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }) : String(s); };
var dfmt = function (d, o) { var s = new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', o).format(d); return fa() ? s.replace(/,/g, '،') : s; };
var monthYear = function (d) { var p = new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', { month: 'long', year: 'numeric' }).formatToParts(d), g = function (t) { return (p.filter(function (x) { return x.type === t; })[0] || {}).value || ''; }; return g('month') + ' ' + g('year'); };
var dayOf = function (off) { var d = new Date(); d.setHours(12, 0, 0, 0); return new Date(d.getTime() + off * DAY); };
var rnd = function (i) { var x = Math.sin(i * 99.13 + 7.7) * 43758.5453; return x - Math.floor(x); };
var SEP = function () { return fa() ? '، ' : ' · '; };
var nm = function (i) { return NAMES[i][fa() ? 0 : 1]; };
var party = function (k) { return fill(L().people, digits(k)); };
var img = function (name, alt, eager) { return '<img src="../v2/img/' + name + '.webp" alt="' + esc(alt || '') + '"' + (eager ? '' : ' loading="lazy"') + ' decoding="async">'; };

/* ================= state that survives Back and reload ================= */
var S = (function () {
  var base = { authed: false, form: { field: null, int: {}, ref: null, contact: 0 }, sent: null,
    res: [], rf: {}, rsvp: { 0: true }, bring: {}, conc: null, cq: null, guests: [0, 1], show: false, filt: 0, pend: [], top: null,
    notif: [true, true, true], faceid: false, carW: 0 };
  try { var s = JSON.parse(sessionStorage.getItem('vault4') || 'null'); if (s) return Object.assign(base, s); } catch (e) {}
  return base;
})();
var saveT;
function save() { clearTimeout(saveT); saveT = setTimeout(function () { try { sessionStorage.setItem('vault4', JSON.stringify(S)); } catch (e) {} }, 80); }
window.addEventListener('pagehide', function () { try { sessionStorage.setItem('vault4', JSON.stringify(S)); } catch (e) {} });

/* ================= icons: thin geometric line drawings ================= */
var ICO = (function () {
  var s = function (b) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' + b + '</svg>'; };
  return {
    home: s('<path d="M6 6h12v12H6z"/><path d="M12 3.5 20.5 12 12 20.5 3.5 12z"/><circle cx="12" cy="12" r="2"/>'),
    reserve: s('<path d="M5.5 20.5V11c0-3.6 3-6 6.5-8 3.5 2 6.5 4.4 6.5 8v9.5"/><path d="M3 20.5h18"/><path d="M9.5 20.5v-4.8a2.5 2.5 0 0 1 5 0v4.8"/>'),
    events: s('<path d="M12 2.8v2.4"/><path d="M8.6 5.2h6.8l2.6 4v6.6l-2.6 4h-6.8l-2.6-4V9.2z"/><path d="M12 9.4l1.6 3-1.6 3-1.6-3z"/>'),
    conc: s('<path d="M3.5 20h17"/><path d="M5.5 17a6.5 6.5 0 0 1 13 0z"/><path d="M12 10.5V8.2"/><path d="M10.3 8.2h3.4"/>'),
    wallet: s('<path d="M3.5 6.5h17v11h-17z"/><path d="M12 8.6l3.4 3.4-3.4 3.4-3.4-3.4z"/><path d="M3.5 9.5h2.6M17.9 14.5h2.6"/>'),
    back: s('<path d="M9.5 5.5 15.5 12l-6 6.5"/>'),
    close: s('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
    eye: s('<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"/><path d="M12 9.2l2.8 2.8-2.8 2.8-2.8-2.8z"/>'),
    eyeoff: s('<path d="M3 3l18 18"/><path d="M10.4 6A9 9 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a16 16 0 0 1-3 3.6M6.4 7.6A15.6 15.6 0 0 0 2.5 12S6 18.2 12 18.2a8.7 8.7 0 0 0 4-1"/>'),
    lock: s('<path d="M5.5 10.5h13v10h-13z"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/><path d="M12 13.6l1.4 1.4-1.4 1.4-1.4-1.4z"/>'),
    guests: s('<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M15.5 6.2a3 3 0 0 1 0 5.6M17.5 14.4a5.5 5.5 0 0 1 3 5.1"/>'),
    car: s('<path d="M4 15.5V12l2-4.5h12l2 4.5v3.5z"/><path d="M4 12h16"/><circle cx="7.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/>'),
    humidor: s('<path d="M5 5.5h14v14H5z"/><path d="M5 10h14"/><path d="M9 7.7h6"/><path d="M8 14.5h8M8 17h5"/>'),
    rules: s('<path d="M6 3.5h12v17H6z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>'),
    table: s('<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21"/>'),
    gift: s('<path d="M4.5 10h15v10h-15z"/><path d="M3.5 7h17v3h-17z"/><path d="M12 7v13"/><path d="M12 7c-1.5-3-5-3-4.5-1S12 7 12 7s3.5-.6 4.5-1-3-2-4.5 1"/>'),
    ticket: s('<path d="M3.5 7.5h17v3a1.6 1.6 0 0 0 0 3v3h-17v-3a1.6 1.6 0 0 0 0-3z"/><path d="M15 8v8" stroke-dasharray="1.4 1.6"/>'),
    plane: s('<path d="M21 4 3.5 11l6.5 2.5L12.5 20z"/><path d="M10 13.5 21 4"/>'),
    phone: s('<path d="M7.5 3.5h9v17h-9z"/><path d="M11 17.5h2"/>'),
    plus: s('<path d="M12 5v14M5 12h14"/>'),
    minus: s('<path d="M5 12h14"/>'),
    check: s('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    cal: s('<path d="M4 6h16v14H4z"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
    share: s('<path d="M12 15V3.8M8 7.5l4-4 4 4"/><path d="M5.5 11v9h13v-9"/>'),
    inArr: s('<path d="M12 4v13M7 12l5 5 5-5M5 20.5h14"/>'),
    outArr: s('<path d="M12 20V7M7 12l5-5 5 5M5 3.5h14"/>'),
    star: s('<path d="M7 7h10v10H7z"/><path d="M12 4.9 19.1 12 12 19.1 4.9 12z"/>')
  };
})();
ICO.chev = ICO.back.replace('class="ico"', 'class="ico chev"');
var TOPIC_ICO = ['table', 'car', 'gift', 'ticket', 'plane', 'phone'];

/* ================= girih: Hankin's method on polygon tilings ================= */
var G = (function () {
  var PI = Math.PI;
  function rot(v, a) { var c = Math.cos(a), s = Math.sin(a); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; }
  function nrm(v) { var l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; }
  function area(p) { var s = 0; for (var i = 0; i < p.length; i++) { var a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
  function ccw(p) { return area(p) < 0 ? p.slice().reverse() : p; }
  function inter(p, d, q, e) { var den = d[0] * e[1] - d[1] * e[0]; if (Math.abs(den) < 1e-9) return null; var t = ((q[0] - p[0]) * e[1] - (q[1] - p[1]) * e[0]) / den; return [p[0] + d[0] * t, p[1] + d[1] * t]; }
  function cen(p) { var x = 0, y = 0; p.forEach(function (q) { x += q[0]; y += q[1]; }); return [x / p.length, y / p.length]; }
  function reg(cx, cy, r, k, a0) { var p = []; for (var i = 0; i < k; i++) { var a = a0 + i * 2 * PI / k; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; }
  // one closed star line per polygon: edge midpoint → contact point → next midpoint …
  function star(poly, th) {
    poly = ccw(poly); var k = poly.length, pts = [];
    for (var i = 0; i < k; i++) {
      var a = poly[i], v = poly[(i + 1) % k], b = poly[(i + 2) % k];
      var m1 = [(a[0] + v[0]) / 2, (a[1] + v[1]) / 2], m2 = [(v[0] + b[0]) / 2, (v[1] + b[1]) / 2];
      var u = nrm([v[0] - a[0], v[1] - a[1]]), w = nrm([b[0] - v[0], b[1] - v[1]]);
      var X = inter(m1, rot(u, th), m2, rot([-w[0], -w[1]], -th));
      pts.push(m1); if (X) pts.push(X);
    }
    return pts;
  }
  function t488(x0, y0, x1, y1, a) {
    var W = a * (1 + Math.SQRT2), ro = a / (2 * Math.sin(PI / 8)), rs = a / Math.SQRT2, out = [];
    for (var y = Math.floor(y0 / W) - 1; y * W < y1 + W; y++) for (var x = Math.floor(x0 / W) - 1; x * W < x1 + W; x++) {
      out.push(reg(x * W, y * W, ro, 8, PI / 8));
      out.push(reg(x * W + W / 2, y * W + W / 2, rs, 4, 0));
    }
    return out;
  }
  function rosette(a) {
    var R = a / (2 * Math.sin(PI / 10)), dec = reg(0, 0, R, 10, -PI / 2), out = [dec];
    for (var i = 0; i < 10; i++) {
      var A = dec[i], B = dec[(i + 1) % 10], best = null;
      [1, -1].forEach(function (sg) {
        var pts = [B, A], d = [A[0] - B[0], A[1] - B[1]];
        for (var j = 0; j < 3; j++) { d = rot(d, sg * 2 * PI / 5); var l = pts[pts.length - 1]; pts.push([l[0] + d[0], l[1] + d[1]]); }
        var c = cen(pts); if (!best || Math.hypot(c[0], c[1]) > Math.hypot(best.c[0], best.c[1])) best = { p: pts, c: c };
      });
      out.push(best.p);
    }
    return out;
  }
  var f = function (x) { return Math.round(x * 10) / 10; };
  function d(pts, close) { return 'M' + pts.map(function (q) { return f(q[0]) + ' ' + f(q[1]); }).join('L') + (close ? 'Z' : ''); }
  // mirror facets: each polygon cut into triangles from its centre; a facet's normal leans outward
  function facets(poly, split) {
    var c = cen(poly), out = [];
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i], b = poly[(i + 1) % poly.length];
      var tri = split ? [[c, a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]], [c, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b]] : [[c, a, b]];
      tri.forEach(function (t) { var tc = cen(t); out.push({ t: t, ang: Math.atan2(tc[1] - c[1], tc[0] - c[0]) }); });
    }
    return out;
  }
  return { star: star, t488: t488, rosette: rosette, d: d, facets: facets, cen: cen, PI: PI };
})();

/* mirror light: 32 facet groups, each with a slightly different tilt; a light moves and the matching facets flash */
var NG = 32, GN = [];
for (var gi = 0; gi < NG; gi++) { var ga = gi * 2 * Math.PI / NG + (rnd(gi + 3) - 0.5) * 0.3, gm = 0.35 + rnd(gi + 40) * 0.5; GN.push([Math.cos(ga) * gm, Math.sin(ga) * gm]); }
function groupFor(ang, seed) { var g = Math.round(((ang + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * NG); g += Math.floor(rnd(seed) * 5) - 2; return ((g % NG) + NG) % NG; }
(function groupCSS() {
  var css = ''; for (var i = 0; i < NG; i++) css += '.fct.g' + i + '{fill-opacity:calc(.035 + var(--g' + i + ',0) * .62)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();

var uid = 0;
var ROS = (function () {
  var polys = G.rosette(34), th = 72 * Math.PI / 180, seed = 1;
  return polys.map(function (p, i) {
    var c = G.cen(p), dist = Math.hypot(c[0], c[1]);
    return { line: G.d(G.star(p, th), true), out: G.d(p, true), c: c, dir: dist ? [c[0] / dist, c[1] / dist] : [0, 0],
      fc: G.facets(p, true).map(function (x) { seed++; return '<path class="fct g' + groupFor(x.ang, seed) + '" d="' + G.d(x.t, true) + '"/>'; }).join('') };
  });
})();
// the seal: a ten-fold rosette (شمسه) of eleven pieces that can fly apart and come together
function seal(o) {
  o = o || {}; var id = 'sg' + (++uid);
  var pcs = ROS.map(function (p, i) {
    var a = rnd(i * 7 + 1) * Math.PI * 2, r = 120 + rnd(i * 5 + 2) * 90;
    var tx = i ? p.dir[0] * 34 + Math.cos(a) * 16 : Math.cos(a) * 8, ty = i ? p.dir[1] * 34 + Math.sin(a) * 16 : Math.sin(a) * 8;
    return '<g class="pc' + (i ? '' : ' core') + '" style="--tx:' + Math.round(tx) + 'px;--ty:' + Math.round(ty) + 'px;--r:' + Math.round((rnd(i * 3 + 9) - 0.5) * 140) + 'deg;--ox:' + Math.round(p.dir[0] * 260) + 'px;--oy:' + Math.round(p.dir[1] * 260) + 'px;--d:' + (i ? (60 + ((i * 3) % 10) * 55) : 620) + 'ms">' +
      '<path class="body" d="' + p.out + '"/>' + p.fc + '<path class="ln" d="' + p.line + '"/>' + (o.glint && !calm ? '<path class="lg" d="' + p.line + '" stroke="url(#' + id + ')"/>' : '') + '</g>';
  }).join('');
  return '<svg class="seal mirror' + (o.apart ? ' apart' : '') + (o.cls ? ' ' + o.cls : '') + '" viewBox="-128 -128 256 256" aria-hidden="true" focusable="false">' +
    (o.glint && !calm ? '<defs><linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="-40" y1="-30" x2="40" y2="30"><stop offset="0" stop-color="#FFF6DE" stop-opacity="0"/><stop offset=".5" stop-color="#FFF6DE" stop-opacity=".95"/><stop offset="1" stop-color="#FFF6DE" stop-opacity="0"/><animateTransform attributeName="gradientTransform" type="translate" values="-260 -60;260 60;260 60" keyTimes="0;.55;1" dur="9s" repeatCount="indefinite"/></linearGradient></defs>' : '') +
    '<circle class="ring" r="121"/><circle class="ring2" r="125.5"/>' + pcs + '</svg>';
}
// mirror-work card face: an eight-fold field cut into facets
var CARD = (function () {
  var polys = G.t488(0, 0, 340, 214, 19), th = 72 * Math.PI / 180, fcs = '', lines = '', seed = 500;
  polys.forEach(function (p) {
    var c = G.cen(p); if (c[0] < -40 || c[0] > 380 || c[1] < -40 || c[1] > 254) return;
    G.facets(p, false).forEach(function (x) { seed++; fcs += '<path class="fct g' + groupFor(x.ang + rnd(seed * 3) * 6, seed) + '" d="' + G.d(x.t, true) + '"/>'; });
    lines += G.d(G.star(p, th), true);
  });
  return '<svg class="cardface mirror" viewBox="0 0 340 214" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g class="fcs">' + fcs + '</g><path class="ln" d="' + lines + '"/></svg>';
})();

/* background field of eight-fold stars, drawn in once on arrival */
var fieldDrawn = false, fieldKey = '';
function drawField(animate) {
  var w = Math.max(320, innerWidth), h = Math.max(480, innerHeight), key = w + 'x' + h;
  if (key === fieldKey && !animate) return; fieldKey = key;
  var polys = G.t488(0, 0, w, h, 30), th = 72 * Math.PI / 180, buckets = [], NB = 9, cx = w / 2, cy = h * 0.22, maxd = Math.hypot(w, h);
  for (var b = 0; b < NB; b++) buckets.push('');
  polys.forEach(function (p) { var c = G.cen(p); if (c[0] < -60 || c[0] > w + 60 || c[1] < -60 || c[1] > h + 60) return; var k = Math.min(NB - 1, Math.floor(Math.hypot(c[0] - cx, c[1] - cy) / maxd * NB * 1.6)); buckets[k] += '<path pathLength="1" d="' + G.d(G.star(p, th), true) + '"/>'; });
  field.setAttribute('viewBox', '0 0 ' + w + ' ' + h); field.setAttribute('preserveAspectRatio', 'xMidYMin slice');
  field.innerHTML = buckets.map(function (s, i) { return '<g style="--i:' + i + '">' + s + '</g>'; }).join('');
  field.classList.toggle('draw', !!animate && !calm);
}

/* ================= light: pointer, phone tilt, or a slow sweep ================= */
var light = { x: 0.5, y: -0.4, tx: 0.5, ty: -0.4, last: 0, t: 0, gyro: false }, mirrors = [], lightRAF = 0, lastPaint = 0;
function rescanMirrors() { mirrors = $$('.mirror').filter(function (m) { return !m.closest('.leave'); }); paintLight(true); if (!lightRAF && !calm) lightRAF = requestAnimationFrame(lightLoop); }
function paintLight(force) {
  var vals = [];
  for (var i = 0; i < NG; i++) { var dx = GN[i][0] - light.x, dy = GN[i][1] - light.y; vals.push(Math.exp(-(dx * dx + dy * dy) / 0.045).toFixed(3)); }
  mirrors.forEach(function (m) { for (var i = 0; i < NG; i++) m.style.setProperty('--g' + i, vals[i]); });
}
function lightLoop(now) {
  lightRAF = 0;
  if (document.hidden || !mirrors.length) return;
  var idle = now - light.last > 2600;
  if (idle && !light.gyro) { light.t += 0.0045; light.tx = Math.cos(light.t * 1.3) * 0.62; light.ty = Math.sin(light.t) * 0.55; }
  light.x += (light.tx - light.x) * 0.12; light.y += (light.ty - light.y) * 0.12;
  if (now - lastPaint > 40) { lastPaint = now; paintLight(); }
  lightRAF = requestAnimationFrame(lightLoop);
}
window.addEventListener('pointermove', function (e) { if (light.gyro) return; light.last = performance.now(); light.tx = (e.clientX / innerWidth - 0.5) * 1.5; light.ty = (e.clientY / innerHeight - 0.5) * 1.5; }, { passive: true });
function onTilt(e) { if (e.beta == null) return; light.gyro = true; light.last = performance.now(); light.tx = Math.max(-1, Math.min(1, (e.gamma || 0) / 30)); light.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); }
var tiltOn = false;
function startTilt(ask) {
  if (tiltOn || calm || !window.DeviceOrientationEvent) return;
  var D = window.DeviceOrientationEvent;
  if (typeof D.requestPermission === 'function') { if (!ask) return; D.requestPermission().then(function (r) { if (r === 'granted') { tiltOn = true; window.addEventListener('deviceorientation', onTilt); toast(L().motionOn); } }).catch(function () {}); }
  else { tiltOn = true; window.addEventListener('deviceorientation', onTilt); }
}
document.addEventListener('visibilitychange', function () { if (!document.hidden && !calm && !lightRAF) lightRAF = requestAnimationFrame(lightLoop); });

/* pointed-arch (طاق) windows for photos, as responsive clip-paths */
(function archCSS() {
  function poly(A, r) {
    var h = Math.sqrt(r * r - (0.5 - r) * (0.5 - r)), pts = ['0% 100%'], N = 18, i, x, y;
    var Y = function (x) { return (h - Math.sqrt(Math.max(0, r * r - (x - r) * (x - r)))) / A * 100; };
    for (i = 0; i <= N; i++) { x = 0.5 * i / N; y = Y(x); pts.push((x * 100).toFixed(2) + '% ' + y.toFixed(2) + '%'); }
    for (i = N - 1; i >= 0; i--) { x = 0.5 * i / N; y = Y(x); pts.push(((1 - x) * 100).toFixed(2) + '% ' + y.toFixed(2) + '%'); }
    pts.push('100% 100%'); return 'polygon(' + pts.join(',') + ')';
  }
  var st = document.createElement('style');
  st.textContent = '.arch{clip-path:' + poly(4 / 3, 0.6) + '}.arch.wide{clip-path:' + poly(0.8, 0.6) + '}.arch.reel{clip-path:' + poly(1.45, 0.6) + '}.arch.thumb{clip-path:' + poly(1.3, 0.6) + '}';
  document.head.appendChild(st);
})();

/* ================= wallet model (sample figures that add up) =================
   tx: [kind, amount, days ago, place index, guests] */
var W = { fee: 300000000, feeDay: -210, limit: 200000000,
  tx: [
    ['top', 300000000, -40], ['spend', 90000000, -2, 1, 3], ['spend', 90000000, -6, 0, 4], ['spend', 120000000, -12, 2, 2], ['spend', 50000000, -20, 3, 2], ['spend', 80000000, -25, 4, 0],
    ['spend', 110000000, -33, 0, 6], ['spend', 100000000, -70, 1, 2], ['spend', 70000000, -80, 3, 3], ['spend', 140000000, -95, 0, 4], ['spend', 95000000, -110, 2, 1],
    ['top', 500000000, -120], ['spend', 180000000, -150, 0, 8], ['spend', 120000000, -160, 1, 4], ['top', 400000000, -190]
  ] };
function wallet() {
  var top = 0, spent = 0, by = [0, 0, 0, 0, 0];
  W.tx.forEach(function (t) { if (t[0] === 'top') top += t[1]; else { spent += t[1]; by[t[3]] += t[1]; } });
  var bal = top - spent, debt = Math.max(0, -bal), remain = Math.max(0, bal);
  return { top: top, spent: spent, bal: bal, debt: debt, remain: remain, avail: remain + Math.max(0, W.limit - debt), by: by };
}
// money is private: blurred until the member taps it
function money(x, sign) {
  var v = n(Math.abs(x));
  if (!S.show) return '<span class="amtw"><bdi class="amt hid" aria-hidden="true">' + v + '</bdi><span class="sr">' + L().hiddenAmt + '</span></span>';
  return '<bdi class="amt">' + (sign ? '<span class="sign">' + sign + '</span>' : '') + v + '</bdi>';
}
var EV = [{ off: 3, seats: 12 }, { off: 9, seats: 4 }, { off: 16, seats: 20 }, { off: 27, seats: 9 }];
var EVPH = ['member-events', 'gallery', 'bar', 'events'];
var TIMES = ['12:30', '14:00', '19:30', '20:30', '21:30', '22:30'];
var isFull = function (day, ti, room) { return (day * 7 + ti * 3 + room) % 5 === 0; };
function seatsLeft(i) { return EV[i].seats - (S.rsvp[i] ? 1 + (S.bring[i] || 0) : 0); }

/* ================= toast ================= */
var toastT;
function toast(msg) { var el = $('#toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2800); }
function buzz(ms) { if (navigator.vibrate) try { navigator.vibrate(ms || 8); } catch (e) {} }

/* ================= router ================= */
var route = { key: null }, depth = 0, scrolls = {}, busy = false, sheetOpen = false, sheetHist = false, ignorePop = false, sheetFrom = null;
function curPath() { return (location.hash || '').replace(/^#\/?/, '').split('?')[0]; }
function go(path, o) {
  o = o || {};
  if (o.replace) history.replaceState({ i: depth }, '', '#/' + path);
  else { depth++; history.pushState({ i: depth }, '', '#/' + path); }
  render(o.back ? 'back' : 'fwd', o);
}
function goBack(fallback) { if (depth > 0) history.back(); else go(fallback, { replace: true, back: true }); }
window.addEventListener('popstate', function (e) {
  var i = (e.state && e.state.i) || 0;
  if (ignorePop) { ignorePop = false; depth = i; return; }
  if (busy) { history.pushState({ i: ++depth }, '', '#/' + route.path); return; }
  if (sheetOpen) { depth = i; closeSheet(true); return; }
  var to = curPath(), inM = route.key && route.key.indexOf('m') === 0;
  // Back never signs a member out: leaving the member area returns to the member home instead
  if (S.authed && inM && to.indexOf('m') !== 0) { depth = i; history.pushState({ i: ++depth }, '', '#/' + route.path); if (route.key !== 'm') go('m', { replace: true, back: true }); return; }
  // after sending a request, Back goes to the threshold, not into the finished steps
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
  if (p[0] === 'm' && p[1] === 'reserve' && /^[0-5]$/.test(p[2] || '')) return { key: 'm/room', room: Number(p[2]) };
  if (ROUTES[path]) return { key: path };
  return { key: '' };
}

function render(dir, o) {
  o = o || {};
  var path = curPath(), r = resolve(path);
  if (r.key.indexOf('m') === 0 && !S.authed) { history.replaceState({ i: depth }, '', '#/'); r = { key: '' }; path = ''; }
  if ((r.key === '' || r.key === 'login') && S.authed) { history.replaceState({ i: depth }, '', '#/m'); r = { key: 'm' }; path = 'm'; }
  if (r.key === 'sent' && !S.sent) { r = { key: 'apply', step: 1 }; path = 'apply/1'; history.replaceState({ i: depth }, '', '#/apply/1'); }
  if (r.key === 'm/wallet' && route.key !== 'm/wallet' && dir !== 'same') { S.show = false; save(); }
  var def = ROUTES[r.key];
  var old = $('.page:not(.leave)', view);
  if (old && route.path != null) scrolls[route.path] = old.scrollTop;
  var first = route.key == null;
  r.path = path; route = r;

  document.documentElement.lang = fa() ? 'fa' : 'en'; document.documentElement.dir = fa() ? 'rtl' : 'ltr';
  app.classList.toggle('en', !fa());
  app.classList.toggle('inside', def.scene === 'in'); app.classList.toggle('has-dock', def.scene === 'in');
  app.classList.toggle('loud', !!def.loud);
  document.title = (r.key === '' ? '' : (def.title ? def.title(r) + SEP() : '')) + (fa() ? 'والت · The Vault' : 'The Vault · والت');
  drawBar(def); drawDock(); app.classList.remove('scrolled');
  if (def.loud && !fieldDrawn) { fieldDrawn = true; drawField(true); }

  var pg = document.createElement('div');
  pg.className = 'page ' + (def.cls || '') + ' enter' + (o.fade || first ? ' fade' : (dir === 'back' ? ' pback' : ''));
  pg.setAttribute('role', 'region'); pg.setAttribute('aria-label', def.title ? def.title(r) : L().brand);
  pg.innerHTML = '<div class="wrap">' + def.html(r) + '</div>';
  view.appendChild(pg);
  if (old) { old.classList.add('leave'); old.setAttribute('aria-hidden', 'true'); if (dir === 'back') old.classList.add('pback'); if (o.fade) old.classList.add('fade'); setTimeout(function () { old.remove(); }, calm ? 0 : 360); }
  if (dir === 'back' && scrolls[path]) pg.scrollTop = scrolls[path];
  fit(pg); if (def.after) def.after(pg, r);
  rescanMirrors();
  if (!first && !o.keepFocus) { var h = $('h1', pg); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
}
function rerender() {   // same page, fresh content: no animation, scroll kept
  var pg = $('.page:not(.leave)', view); if (!pg) return; var top = pg.scrollTop, def = ROUTES[route.key];
  var act = document.activeElement, key = act && act.getAttribute && (act.getAttribute('data-act') + '|' + act.getAttribute('data-v') + '|' + act.getAttribute('data-go'));
  pg.classList.remove('enter', 'fade', 'pback'); pg.innerHTML = '<div class="wrap">' + def.html(route) + '</div>'; pg.scrollTop = top;
  $$('.rise', pg).forEach(function (x) { x.classList.remove('rise'); });
  fit(pg); if (def.after) def.after(pg, route); rescanMirrors();
  if (key && act && !sheetOpen) { var same = $$('button', pg).filter(function (b) { return (b.getAttribute('data-act') + '|' + b.getAttribute('data-v') + '|' + b.getAttribute('data-go')) === key; })[0]; if (same) same.focus({ preventScroll: true }); }
}
// the huge Persian word is always as large as the column allows, never wider
function fit(root) {
  $$('.big', root).forEach(function (el) {
    el.style.fontSize = ''; var box = el.parentNode.clientWidth; if (!box) return;
    var fs = parseFloat(getComputedStyle(el).fontSize), w = el.scrollWidth;
    if (w > box) el.style.fontSize = Math.floor(fs * box / w * 0.97) + 'px';
  });
}
var rzT; window.addEventListener('resize', function () { clearTimeout(rzT); rzT = setTimeout(function () { fit(view); drawField(false); }, 150); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(view); });

/* ================= bar and dock ================= */
function drawBar(def) {
  var l = L(), inM = def.scene === 'in';
  var mark = '<button type="button" class="brand" data-go="' + (inM ? 'm' : '') + '" aria-label="' + (fa() ? 'والت، خانه' : 'The Vault, home') + '"><img src="../assets/img/mark-gold.png" alt="" width="22" height="23"><span lang="fa">والت</span></button>';
  var start = def.back ? '<button type="button" class="backb" data-act="back">' + ICO.back + '<span>' + l.back + '</span></button>' : mark;
  var end = '<button type="button" class="langb" data-act="lang" lang="' + (fa() ? 'en' : 'fa') + '" aria-label="' + l.langName + '">' + l.lang + '</button>' +
    (inM ? '<button type="button" class="avatar" data-go="m/account" aria-label="' + T[P.lang].words.account + '"' + (route.key === 'm/account' ? ' aria-current="page"' : '') + '><span lang="fa">آ</span></button>' : '');
  bar.innerHTML = '<div class="bar-s">' + start + '</div><div class="bar-e">' + end + '</div>';
}
var DOCK = [['m', 'home'], ['m/reserve', 'reserve'], ['m/events', 'events'], ['m/concierge', 'conc'], ['m/wallet', 'wallet']];
function drawDock() {
  var k = route.key === 'm/room' ? 'm/reserve' : route.key;
  dock.setAttribute('aria-label', L().menu);
  dock.innerHTML = '<div class="dock-in">' + DOCK.map(function (d, i) { return '<button type="button" data-go="' + d[0] + '" data-dock="1"' + (k === d[0] ? ' aria-current="page"' : '') + '>' + ICO[d[1]] + '<span>' + L().dock[i] + '</span></button>'; }).join('') + '</div>';
}

/* ================= shared pieces ================= */
// page head: the Persian word is the hero. In English it stays, as the brand’s voice, with the English title under it.
function head(key, lead, eyb, word) {
  var faw = word || T.fa.words[key], enw = T.en.words[key] || '';
  return '<header class="ph rise">' + (eyb ? '<p class="eyb">' + eyb + '</p>' : '') +
    (fa() ? '<h1 class="big" lang="fa">' + faw + '</h1>' : '<div class="big" lang="fa" aria-hidden="true">' + faw + '</div><h1 class="h1">' + (word ? enw : enw) + '</h1>') +
    (lead ? '<p class="lead">' + lead + '</p>' : '') + '</header>';
}
function chips(act, list, sel, multi, extra) {
  return '<div class="chips" role="group">' + list.map(function (c, i) { var on = multi ? !!(sel || {})[i] : sel === i; return '<button type="button" class="chip" data-act="' + act + '" data-v="' + i + '" aria-pressed="' + on + '"' + (extra || '') + '>' + (on && multi ? ICO.check : '') + '<span>' + c + '</span></button>'; }).join('') + '</div>';
}
function starNum(i) { return '<span class="snum" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/><path d="M12 3.5 20.5 12 12 20.5 3.5 12z"/></svg><b>' + digits(i) + '</b></span>'; }
function greeting() { var h = new Date().getHours(); return h < 12 ? 'morning' : (h < 18 ? 'afternoon' : 'evening'); }
function resLine(r) { return L().rooms[r.room][0] + SEP() + dfmt(dayOf(r.day), { weekday: 'short', day: 'numeric', month: 'short' }) + SEP() + digits(r.time); }

/* ================= public pages ================= */
R('', { loud: true, cls: 'landing', title: function () { return L().brand; }, html: function () {
  var l = L();
  return '<section class="hero">' +
      '<div class="hero-seal rise">' + seal({ glint: true }) + '</div>' +
      '<p class="eyb rise">' + l.eyebrow + '</p>' +
      (fa() ? '<h1 class="big hero-word rise" lang="fa">والت</h1>' : '<div class="big hero-word rise" lang="fa" aria-hidden="true">والت</div><h1 class="h1 rise">The Vault</h1>') +
      '<p class="tag rise">' + l.tagline + '</p><p class="lead rise">' + l.intro + '</p>' +
      '<div class="btns rise"><button type="button" class="btn solid" data-go="login">' + l.members + '</button><button type="button" class="btn line" data-go="apply/1">' + l.request + '</button></div>' +
      '<button type="button" class="textlink rise" data-go="rules">' + l.rulesLink + '</button>' +
    '</section>' +
    '<section class="sec"><h2 class="h2">' + l.roomsT + '</h2><div class="hscroll" role="list">' + l.rooms.map(function (r, i) { return '<div class="roomc" role="listitem"><div class="arch reel">' + img(r[2], r[0]) + '</div><b>' + r[0] + '</b><i>' + r[1] + '</i></div>'; }).join('') + '</div></section>' +
    '<section class="sec"><h2 class="h2">' + l.memT + '</h2><ol class="steps">' + l.memSteps.map(function (s, i) { return '<li>' + starNum(i + 1) + '<span>' + s + '</span></li>'; }).join('') + '</ol>' +
      '<button type="button" class="btn line" data-go="apply/1">' + l.request + '</button></section>' +
    '<footer class="foot">' + l.foot + '</footer>';
} });

R('login', { loud: true, back: true, cls: 'login', title: function () { return T[P.lang].words.login; }, html: function () {
  var l = L();
  return head('login', '') +
    '<div class="login-seal">' + seal({ apart: true }) + '<p class="opening" aria-live="polite"></p></div>' +
    '<div class="who rise"><span class="avatar lg" aria-hidden="true"><span lang="fa">آ</span></span><span><b>' + l.memberName + '</b><i>' + l.memberLine + '</i></span></div>' +
    '<p class="lead rise center">' + l.loginT + ' ' + l.loginB + '</p>' +
    '<div class="btns rise"><button type="button" class="btn solid" data-act="unlock">' + l.asMember + '</button><button type="button" class="btn line" data-act="unlock">' + l.faceId + '</button></div>' +
    '<button type="button" class="textlink rise" data-go="apply/1">' + l.notMember + '</button>';
} });

function stepsBar(k) { return '<div class="stepbar" aria-hidden="true">' + [1, 2, 3, 4].map(function (i) { return '<span class="' + (i < k ? 'done' : (i === k ? 'now' : '')) + '"><svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/><path d="M12 3.5 20.5 12 12 20.5 3.5 12z"/></svg></span>'; }).join('<i></i>') + '</div>'; }
R('apply', { back: true, cls: 'apply', title: function (r) { return T[P.lang].words.apply + SEP() + digits(r.step); }, html: function (r) {
  var l = L(), f = S.form, k = r.step, st = l.aSteps[k - 1], body = '';
  if (k === 1) body = '<div class="f"><span class="lab" id="lb1">' + l.chooseOne + '</span>' + chips('fField', l.fields, f.field) + '</div>';
  if (k === 2) body = '<div class="f">' + chips('fInt', l.interests, f.int, true) + '</div>';
  if (k === 3) body = '<div class="f"><span class="lab">' + l.refT + '</span>' + chips('fRef', l.refs, f.ref, false, ' data-wide="1"') + '</div><div class="f"><span class="lab">' + l.contactT + '</span>' + chips('fContact', l.contacts, f.contact) + '</div>';
  if (k === 4) {
    var sep = fa() ? '، ' : ', ', ints = Object.keys(f.int || {}).filter(function (x) { return f.int[x]; }).map(function (x) { return l.interests[x]; });
    var row = function (lab, val, step) { return '<div class="rv"><span class="k">' + lab + '</span><span class="v">' + (val || '—') + '</span><button type="button" class="mini" data-go="apply/' + step + '" aria-label="' + l.edit + SEP() + lab + '">' + l.edit + '</button></div>'; };
    body = '<div class="panel rvs">' + row(l.rvField, f.field != null ? l.fields[f.field] : '', 1) + row(l.rvInt, ints.join(sep), 2) + row(l.rvRef, f.ref != null ? l.refs[f.ref] : '', 3) + row(l.rvContact, l.contacts[f.contact || 0], 3) + '</div>' +
      '<p class="small">' + l.agreeNote + ' <button type="button" class="inl" data-go="rules">' + l.rulesLink + '</button></p>';
  }
  return '<p class="eyb rise">' + fill(l.stepOf, digits(k)) + '</p>' + stepsBar(k) + head('apply', st[1], '', '').replace('<header class="ph rise">', '<header class="ph rise">').replace(/<p class="lead">/, '<h2 class="h2 qa">' + st[0] + '</h2><p class="lead">') +
    '<div class="fields rise">' + body + '</div>' +
    '<div class="cta">' + (k < 4 ? '<button type="button" class="btn solid" data-go="apply/' + (k + 1) + '">' + l.next + '</button>' : '<button type="button" class="btn solid" data-act="submit">' + l.submit + '</button>') + '</div>';
} });

R('sent', { loud: true, cls: 'sent', title: function () { return T[P.lang].words.sent; }, html: function () {
  var l = L();
  return '<div class="sent-seal">' + seal({ glint: true }) + '</div>' + head('sent', l.sentB, '') .replace('<p class="lead">', '<h2 class="h2 qa">' + l.sentT + '</h2><p class="lead">') +
    '<div class="panel refbox rise"><span>' + l.ref + '</span><b dir="ltr">' + digits(S.sent || '') + '</b></div>' +
    '<div class="cta"><button type="button" class="btn line" data-act="toHome">' + l.toHome + '</button></div>';
} });

function rulesHTML() { var l = L(); return head('rules', l.rulesB, '') + '<ol class="rules rise">' + l.rules.map(function (r, i) { return '<li>' + starNum(i + 1) + '<span><b>' + r[0] + '</b><i>' + r[1] + '</i></span></li>'; }).join('') + '</ol>'; }
R('rules', { back: true, title: function () { return T[P.lang].words.rules; }, html: rulesHTML });
R('m/rules', { scene: 'in', back: true, title: function () { return T[P.lang].words.rules; }, html: rulesHTML });

/* ================= member pages ================= */
R('m', { scene: 'in', cls: 'home', title: function () { return T[P.lang].words.home; }, html: function () {
  var l = L(), g = greeting(), nx = S.res[0], ev = l.events[0];
  var nextRow = nx ? '<button type="button" class="panel row" data-go="m/reserve"><span class="grow"><b>' + resLine(nx) + '</b><i>' + party(nx.party) + '</i></span>' + ICO.chev + '</button>'
    : '<button type="button" class="panel row empty" data-go="m/reserve"><span class="grow"><b>' + l.nothing + '</b><i>' + l.chooseRoom + '</i></span>' + ICO.chev + '</button>';
  var reel = function (attrs, ph, title, sub, tag) { return '<button type="button" class="reelc" ' + attrs + '><span class="arch reel">' + img(ph, '') + '</span>' + (tag ? '<span class="tag">' + tag + '</span>' : '') + '<b>' + title + '</b><i>' + sub + '</i></button>'; };
  return '<header class="ph rise"><p class="eyb">' + l.memberNo + SEP() + dfmt(new Date(), { weekday: 'long', day: 'numeric', month: 'long' }) + '</p>' +
      (fa() ? '<h1 class="big" lang="fa">' + T.fa[g] + '</h1>' : '<div class="big" lang="fa" aria-hidden="true">' + T.fa[g] + '</div><h1 class="h1">' + T.en[g] + '</h1>') +
      (nx ? '<p class="lead">' + fill(l.heldLine, l.rooms[nx.room][0], (nx.day ? dfmt(dayOf(nx.day), { weekday: 'long' }) + ' ' : '') + digits(nx.time)) + '</p>' : '') + '</header>' +
    '<div class="rise"><button type="button" class="mcard" id="mcard" aria-label="' + l.passT + '">' + CARD +
      '<span class="mc-veil"></span><span class="mc-word" lang="fa">والت</span><span class="mc-seal">' + seal() + '</span>' +
      '<span class="mc-name"><b>' + l.memberName + '</b><i>' + l.tier + '</i></span><span class="mc-no"><bdi>' + (fa() ? '۰۰۱' : 'Nº 001') + '</bdi></span></button>' +
      '<p class="hint">' + l.cardHint + '</p></div>' +
    '<section class="sec"><h2 class="eyb">' + l.nextVisit + '</h2>' + nextRow + '</section>' +
    '<section class="sec"><h2 class="eyb">' + l.tonight + '</h2><div class="hscroll reels">' +
      reel('data-act="event" data-v="0"', EVPH[0], ev[0], ev[1] + SEP() + digits(ev[2]), dfmt(dayOf(EV[0].off), { day: 'numeric', month: 'short' })) +
      reel('data-go="m/reserve/1"', 'dining', l.chefT, l.chefD, l.today) +
      reel('data-go="m/reserve/4"', 'room-terrace', l.terrT, l.terrD, l.today) +
      reel('data-act="event" data-v="2"', EVPH[2], l.events[2][0], l.events[2][1] + SEP() + digits(l.events[2][2]), dfmt(dayOf(EV[2].off), { day: 'numeric', month: 'short' })) +
    '</div></section>' +
    '<section class="tiles">' + l.tiles.map(function (t, i) { return '<button type="button" class="tile" ' + ['data-go="m/account"', 'data-act="car"', 'data-act="locker"', 'data-go="m/rules"'][i] + '>' + ICO[['guests', 'car', 'humidor', 'rules'][i]] + '<b>' + t[0] + '</b><i>' + t[1] + '</i></button>'; }).join('') + '</section>';
} });

R('m/reserve', { scene: 'in', title: function () { return T[P.lang].words.reserve; }, html: function () {
  var l = L();
  var mine = S.res.length ? '<section class="sec"><h2 class="eyb">' + l.yourRes + '</h2><div class="panel list">' + S.res.map(function (r, i) { return '<div class="row"><span class="grow"><b>' + resLine(r) + '</b><i>' + party(r.party) + '</i></span><button type="button" class="mini" data-act="cancelRes" data-v="' + i + '">' + l.cancel + '</button></div>'; }).join('') + '</div></section>' : '';
  return head('reserve', l.reserveT) + mine +
    '<div class="rooms rise">' + l.rooms.map(function (r, i) { return '<button type="button" class="roomb" data-go="m/reserve/' + i + '"><span class="arch">' + img(r[2], '') + '</span><b>' + r[0] + '</b><i>' + r[1] + '</i></button>'; }).join('') + '</div>';
} });

function rf(i) { if (!S.rf[i]) S.rf[i] = { day: 0, time: null, party: 2 }; return S.rf[i]; }
R('m/room', { scene: 'in', back: true, cls: 'room', title: function (r) { return L().rooms[r.room][0]; }, html: function (r) {
  var l = L(), room = l.rooms[r.room], f = rf(r.room);
  if (f.time != null && isFull(f.day, f.time, r.room)) f.time = null;
  var days = '<div class="days hscroll" role="group" aria-label="' + l.day + '">' + Array.apply(null, Array(10)).map(function (_, i) { var d = dayOf(i); return '<button type="button" class="day" data-act="rday" data-v="' + i + '" aria-pressed="' + (f.day === i) + '" aria-label="' + dfmt(d, { weekday: 'long', day: 'numeric', month: 'long' }) + '"><span>' + (i === 0 ? l.today : dfmt(d, { weekday: 'short' })) + '</span><b>' + dfmt(d, { day: 'numeric' }) + '</b><i>' + dfmt(d, { month: 'short' }) + '</i></button>'; }).join('') + '</div>';
  var times = '<div class="times" role="group" aria-label="' + l.time + '">' + TIMES.map(function (t, i) { var full = isFull(f.day, i, r.room); return '<button type="button" class="chip time" data-act="rtime" data-v="' + i + '" aria-pressed="' + (f.time === i) + '"' + (full ? ' disabled aria-label="' + digits(t) + SEP() + l.full + '"' : '') + '><span>' + digits(t) + '</span>' + (full ? '<small>' + l.full + '</small>' : '') + '</button>'; }).join('') + '</div>';
  return '<div class="room-hero rise"><span class="arch wide">' + img(room[2], room[0], true) + '</span></div>' +
    head('reserve', room[1], '', T.fa.rooms[r.room][0]).replace(/<h1 class="h1">[^<]*<\/h1>/, '<h1 class="h1">' + T.en.rooms[r.room][0] + '</h1>') +
    '<div class="fields rise"><div class="f"><span class="lab">' + l.day + '</span>' + days + '</div>' +
    '<div class="f"><span class="lab">' + l.time + '</span>' + times + '</div>' +
    '<div class="f"><span class="lab">' + l.party + '</span><div class="stepper"><button type="button" data-act="party" data-v="-1" aria-label="' + l.minus + '"' + (f.party <= 1 ? ' disabled' : '') + '>' + ICO.minus + '</button><output aria-live="polite">' + party(f.party) + '</output><button type="button" data-act="party" data-v="1" aria-label="' + l.plus + '"' + (f.party >= 8 ? ' disabled' : '') + '>' + ICO.plus + '</button></div></div></div>' +
    '<div class="cta sticky"><button type="button" class="btn solid" data-act="hold"' + (f.time == null ? ' aria-describedby="needtime"' : '') + '>' + l.reserveBtn + '</button></div>';
} });

R('m/events', { scene: 'in', title: function () { return T[P.lang].words.events; }, html: function () {
  var l = L();
  return head('events', l.eventsT) + '<div class="evlist rise">' + l.events.map(function (e, i) {
    var d = dayOf(EV[i].off), on = !!S.rsvp[i];
    return '<button type="button" class="evrow" data-act="event" data-v="' + i + '"><span class="evd"><b>' + dfmt(d, { day: 'numeric' }) + '</b><i>' + dfmt(d, { month: 'long' }) + '</i></span>' +
      '<span class="grow"><b>' + e[0] + '</b><i>' + e[1] + SEP() + dfmt(d, { weekday: 'long' }) + SEP() + digits(e[2]) + '</i><i class="seats">' + (on ? '<span class="pill ok">' + ICO.check + l.going + '</span>' : fill(l.seats, digits(seatsLeft(i)))) + '</i></span>' +
      '<span class="arch thumb">' + img(EVPH[i], '') + '</span></button>';
  }).join('') + '</div>';
} });

function concList() { if (!S.conc) { S.conc = T.fa.seedConc.map(function (c) { return { t: c[0], o: c[1], w: c[2], st: c[4], seed: true }; }); save(); } return S.conc; }
R('m/concierge', { scene: 'in', title: function () { return T[P.lang].words.conc; }, html: function () {
  var l = L(), list = concList();
  return head('conc', l.concB, '', '').replace('<p class="lead">', '<h2 class="h2 qa">' + l.concT + '</h2><p class="lead">') +
    '<div class="topics rise">' + l.topics.map(function (t, i) { return '<button type="button" class="topic" data-act="topic" data-v="' + i + '">' + ICO[TOPIC_ICO[i]] + '<b>' + t[0] + '</b></button>'; }).join('') + '</div>' +
    '<section class="sec"><h2 class="eyb">' + l.yourReq + '</h2><div class="panel list">' + list.map(function (c, i) {
      return '<button type="button" class="row" data-act="concItem" data-v="' + i + '"><span class="grow"><b>' + l.topics[c.t][0] + '</b><i>' + l.topics[c.t][1][c.o] + SEP() + l.whens[c.w] + '</i></span><span class="pill' + (c.st === 2 ? ' ok' : '') + '">' + l.st[c.st] + '</span></button>';
    }).join('') + '</div></section>';
} });

R('m/wallet', { scene: 'in', cls: 'walletp', title: function () { return T[P.lang].words.wallet; }, html: function () {
  var l = L(), w = wallet(), used = Math.min(100, w.debt / W.limit * 100), feeD = dayOf(W.feeDay), renew = new Date(feeD.getTime() + 365 * DAY), f = S.filt, rows = '';
  if (f !== 1) rows += S.pend.map(function (p) { return '<div class="tx"><span class="dot">' + ICO.inArr + '</span><span class="grow"><b>' + l.txTop + '</b><i>' + dfmt(new Date(p.at), { day: 'numeric', month: 'short' }) + SEP() + l.methods[p.m] + '</i></span><span class="a">' + money(p.amt, '+') + '<small>' + l.pending + '</small></span></div>'; }).join('');
  rows += W.tx.map(function (t, i) { return { t: t, i: i }; }).filter(function (x) { return f === 0 || (f === 1 ? x.t[0] === 'spend' : x.t[0] === 'top'); }).map(function (x) {
    var t = x.t, top = t[0] === 'top';
    return '<button type="button" class="tx" data-act="tx" data-v="' + x.i + '"><span class="dot">' + (top ? ICO.inArr : ICO.outArr) + '</span><span class="grow"><b>' + (top ? l.txTop : l.places[t[3]]) + '</b><i>' + dfmt(dayOf(t[2]), { weekday: 'short', day: 'numeric', month: 'short' }) + (top ? '' : SEP() + party(t[4] + 1)) + '</i></span><span class="a' + (top ? ' plus' : '') + '">' + money(t[1], top ? '+' : '−') + '</span></button>';
  }).join('');
  if (f !== 1) rows += '<div class="tx"><span class="dot">' + ICO.star + '</span><span class="grow"><b>' + l.txFee + '</b><i>' + dfmt(feeD, { day: 'numeric', month: 'short', year: 'numeric' }) + '</i></span><span class="a">' + money(W.fee) + '</span></div>';
  var maxBy = Math.max.apply(null, w.by);
  return head('wallet', '') +
    '<div class="privbar rise"><p>' + (S.show ? '' : l.privacy) + '</p><button type="button" class="eyeb" data-act="eye" aria-pressed="' + S.show + '">' + (S.show ? ICO.eyeoff + l.hide : ICO.eye + l.show) + '</button></div>' +
    '<div class="balance rise"><p class="eyb">' + l.balance + '</p><div class="bigamt' + (w.bal < 0 ? ' neg' : '') + '">' + money(w.bal, w.bal < 0 ? '−' : '') + '</div><p class="unit">' + l.unit + SEP() + (w.bal < 0 ? l.inDebt : l.inCredit) + '</p>' +
      '<div class="grid2"><button type="button" class="btn solid" data-act="topup">' + l.topup + '</button><button type="button" class="btn line" data-act="statement">' + l.statement + '</button></div></div>' +
    '<section class="panel credit rise"><h2 class="h3">' + l.creditT + '</h2>' +
      '<div class="meter" role="img" aria-label="' + l.used + ' ' + digits(Math.round(used)) + '٪"><i style="width:' + used + '%"></i></div>' +
      '<div class="kv3"><span><i>' + l.used + '</i>' + money(w.debt) + '</span><span><i>' + l.limit + '</i>' + money(W.limit) + '</span><span class="ok"><i>' + l.avail + '</i>' + money(w.avail) + '</span></div>' +
      '<p class="small">' + l.creditNote + '</p></section>' +
    '<section class="sec"><h2 class="eyb">' + l.yearT + '</h2><div class="stats">' +
      [[l.fee, W.fee], [l.topped, w.top], [l.spent, w.spent], [l.remain, w.remain], [l.debt, w.debt, 'neg'], [l.avail, w.avail, 'ok']].map(function (s) { return '<div class="stat ' + (s[2] || '') + '"><span>' + s[0] + '</span><b>' + money(s[1]) + '</b></div>'; }).join('') +
    '</div><p class="small">' + fill(l.feeNote, dfmt(feeD, { day: 'numeric', month: 'long', year: 'numeric' }), dfmt(renew, { day: 'numeric', month: 'long', year: 'numeric' })) + '</p></section>' +
    '<section class="sec"><h2 class="eyb">' + l.byPlace + '</h2><div class="bars">' + w.by.map(function (v, i) { return '<div class="barrow"><span>' + l.places[i] + '</span>' + money(v) + '<span class="meter thin"><i style="width:' + (v / maxBy * 100) + '%"></i></span></div>'; }).join('') + '</div></section>' +
    '<section class="sec"><h2 class="eyb">' + l.activity + '</h2><div class="seg" role="group">' + l.filt.map(function (x, i) { return '<button type="button" data-act="filt" data-v="' + i + '" aria-pressed="' + (f === i) + '">' + x + '</button>'; }).join('') + '</div><div class="list txs">' + rows + '</div></section>';
} });

R('m/account', { scene: 'in', back: true, title: function () { return T[P.lang].words.account; }, html: function () {
  var l = L();
  var sw = function (act, on, label, v) { return '<button type="button" class="row swrow" role="switch" aria-checked="' + !!on + '" data-act="' + act + '"' + (v != null ? ' data-v="' + v + '"' : '') + '><span class="grow"><b>' + label + '</b></span><span class="switch" aria-hidden="true"></span></button>'; };
  var others = NAMES.map(function (_, i) { return i; }).filter(function (i) { return S.guests.indexOf(i) < 0; });
  return head('account', '') +
    '<div class="panel prof rise"><span class="avatar lg" aria-hidden="true"><span lang="fa">آ</span></span><span><b>' + l.memberName + '</b><i>' + l.tier + SEP() + (fa() ? 'شمارهٔ ۰۰۱' : 'Nº 001') + '</i><i>' + fill(l.since, monthYear(dayOf(-420))) + '</i></span></div>' +
    '<section class="sec"><h2 class="eyb">' + l.guestsH + '</h2><div class="panel list">' + (S.guests.length ? S.guests.map(function (g, i) { return '<div class="row"><span class="grow"><b>' + nm(g) + '</b></span><button type="button" class="mini" data-act="rmGuest" data-v="' + i + '" aria-label="' + fill(l.remove, nm(g)) + '">' + ICO.close + '</button></div>'; }).join('') : '<p class="small pad">' + l.noGuests + '</p>') + '</div>' +
      (others.length ? '<p class="lab">' + l.addGuest + '</p><div class="chips">' + others.map(function (i) { return '<button type="button" class="chip" data-act="addGuest" data-v="' + i + '">' + ICO.plus + '<span>' + nm(i) + '</span></button>'; }).join('') + '</div>' : '') + '</section>' +
    '<section class="sec"><h2 class="eyb">' + l.settings + '</h2><div class="panel list">' +
      '<div class="row"><span class="grow"><b>' + l.language + '</b></span><div class="seg two" role="group" aria-label="' + l.language + '"><button type="button" data-act="setLang" data-v="fa" lang="fa" aria-pressed="' + fa() + '">فارسی</button><button type="button" data-act="setLang" data-v="en" lang="en" aria-pressed="' + !fa() + '">English</button></div></div>' +
      l.notifs.map(function (x, i) { return sw('notif', S.notif[i], l.notif + SEP() + x, i); }).join('') + sw('faceid', S.faceid, l.faceid) + sw('tilt', tiltOn, l.motion) +
      '<button type="button" class="row" data-go="m/rules"><span class="grow"><b>' + l.rulesT + '</b></span>' + ICO.chev + '</button></div></section>' +
    '<div class="cta"><button type="button" class="btn line" data-act="lock">' + ICO.lock + '<span>' + l.lock + '</span></button></div>';
} });

/* ================= sheet: focus trap, Escape and Back close it ================= */
function openSheet(title, html) {
  if (!sheetOpen) { sheetFrom = document.activeElement; if (!sheetHist) { sheetHist = true; history.pushState({ i: ++depth, sheet: 1 }, '', '#/' + route.path); } }
  $('#sheetT').textContent = title; $('#sheetB').innerHTML = html; $('#sheetX').setAttribute('aria-label', L().close); $('#sheetX').innerHTML = ICO.close;
  sheet.hidden = false; sheetOpen = true; [view, bar, dock].forEach(function (x) { x.inert = true; });
  requestAnimationFrame(function () { app.classList.add('sheet-open'); });
  setTimeout(function () { var first = $('#sheetB button:not([disabled])') || $('#sheetX'); ($('#sheetX')).focus({ preventScroll: true }); }, 40);
  rescanMirrors();
}
function closeSheet(fromPop) {
  if (!sheetOpen) return;
  if (sheetHist && fromPop !== true) { sheetHist = false; ignorePop = true; history.back(); }
  sheetHist = false; sheetOpen = false; app.classList.remove('sheet-open'); [view, bar, dock].forEach(function (x) { x.inert = false; });
  setTimeout(function () { if (!sheetOpen) { sheet.hidden = true; $('#sheetB').innerHTML = ''; rescanMirrors(); } }, calm ? 0 : 320);
  if (sheetFrom && sheetFrom.focus && document.contains(sheetFrom)) sheetFrom.focus({ preventScroll: true });
}
sheet.addEventListener('keydown', function (e) {
  if (e.key !== 'Tab') return;
  var f = $$('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])', sheet).filter(function (x) { return x.offsetParent !== null; });
  if (!f.length) return; var a = f[0], z = f[f.length - 1];
  if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
});
(function dragToClose() {
  var g = $('.sheet-grab'), y0 = null, dy = 0;
  var start = function (e) { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; sheet.classList.add('dragging'); };
  var move = function (e) { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sheet.style.setProperty('--drag', dy + 'px'); };
  var up = function () { if (y0 == null) return; y0 = null; sheet.classList.remove('dragging'); sheet.style.setProperty('--drag', '0px'); if (dy > 90) closeSheet(); };
  [g, $('.sheet-head')].forEach(function (el) { el.addEventListener('pointerdown', start); });
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
})();

function kv(k, v) { return '<div class="kv"><span>' + k + '</span><span>' + v + '</span></div>'; }
function eventSheet(i) {
  var l = L(), e = l.events[i], d = dayOf(EV[i].off), on = !!S.rsvp[i], b = S.bring[i] || 0;
  openSheet(e[0], '<span class="sheetimg">' + img(EVPH[i], e[0], true) + '</span>' +
    '<div class="kvs">' + kv(l.dateT, dfmt(d, { weekday: 'long', day: 'numeric', month: 'long' }) + SEP() + digits(e[2])) + kv(l.placeT, e[1]) + kv(fill(l.seats, '').trim() || l.seats, '<b>' + digits(seatsLeft(i)) + '</b>') + '</div>' +
    '<p class="lead">' + e[3] + '</p>' +
    (on ? '<div class="f"><span class="lab">' + l.bring + '</span><div class="stepper"><button type="button" data-act="bring" data-v="-1" data-e="' + i + '" aria-label="' + l.minus + '"' + (b <= 0 ? ' disabled' : '') + '>' + ICO.minus + '</button><output aria-live="polite">' + digits(b) + '</output><button type="button" data-act="bring" data-v="1" data-e="' + i + '" aria-label="' + l.plus + '"' + (b >= 2 ? ' disabled' : '') + '>' + ICO.plus + '</button></div></div>' : '') +
    (on ? '<p class="okline">' + ICO.check + l.youGo + '</p><button type="button" class="btn line" data-act="rsvp" data-v="' + i + '">' + l.release + '</button>' : '<button type="button" class="btn solid" data-act="rsvp" data-v="' + i + '">' + l.attend + '</button>') +
    '<div class="grid2"><button type="button" class="btn ghost" data-act="cal">' + l.addCal + '</button><button type="button" class="btn ghost" data-act="share" data-v="' + i + '">' + l.share + '</button></div>');
}
function qr() {   // a believable door code drawn as a small girih-like grid; not a real code
  var N = 21, cells = '', fin = function (x, y) { return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#0A0E18"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#F1EADB"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#0A0E18"/>'; };
  var seed = Math.floor(Date.now() / 60000);
  for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { var inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12); if (!inF && rnd(y * N + x + seed) > 0.52) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="#0A0E18"/>'; }
  return '<svg viewBox="-1 -1 23 23" shape-rendering="crispEdges" role="img" aria-label="' + L().passT + '"><rect x="-1" y="-1" width="23" height="23" fill="#F1EADB"/>' + cells + fin(0, 0) + fin(14, 0) + fin(0, 14) + '</svg>';
}
function guestsTonight() { var r = S.res.filter(function (x) { return x.day === 0; })[0]; var g = r ? r.party - 1 : 0; for (var k in S.bring) if (S.rsvp[k] && EV[k] && EV[k].off === 0) g += S.bring[k]; return g; }

/* ================= the knot opens: login ================= */
function unlock() {
  if (busy) return;
  var pg = $('.page:not(.leave)'), src = pg && $('.login-seal .seal', pg), r = src && src.getBoundingClientRect();
  S.authed = true; save(); buzz(20);
  if (calm || !r || !r.width) { go('m', { replace: true, fade: true }); return; }
  busy = true;
  var gate = document.createElement('div'); gate.className = 'gate'; gate.setAttribute('aria-hidden', 'true');
  gate.innerHTML = seal({ apart: true, glint: true, cls: 'gseal' });
  var sv = gate.firstChild; sv.style.left = r.left + 'px'; sv.style.top = r.top + 'px'; sv.style.width = r.width + 'px'; sv.style.height = r.height + 'px';
  app.appendChild(gate); src.style.visibility = 'hidden'; pg.classList.add('dim');
  var op = $('.opening', pg); if (op) op.textContent = L().opening;
  rescanMirrors();
  requestAnimationFrame(function () { requestAnimationFrame(function () {
    sv.classList.remove('apart');
    var s = Math.min(innerWidth, innerHeight) * 0.78, cx = innerWidth / 2, cy = innerHeight / 2;
    sv.style.left = (cx - s / 2) + 'px'; sv.style.top = (cy - s / 2) + 'px'; sv.style.width = s + 'px'; sv.style.height = s + 'px';
  }); });
  setTimeout(function () { gate.classList.add('shine'); light.t += 2.2; light.last = 0; }, 1300);
  setTimeout(function () { go('m', { replace: true, fade: true }); gate.classList.add('open'); }, 2050);
  setTimeout(function () { gate.remove(); busy = false; rescanMirrors(); var h = $('.page:not(.leave) h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }, 3100);
}
function lock() {
  closeSheet(true); S.authed = false; S.show = false; save();
  depth = 0; history.replaceState({ i: 0 }, '', '#/');
  if (!calm) {
    var gate = document.createElement('div'); gate.className = 'gate closing'; gate.setAttribute('aria-hidden', 'true'); gate.innerHTML = seal({ cls: 'gseal' });
    var s = Math.min(innerWidth, innerHeight) * 0.6, sv = gate.firstChild; sv.style.left = (innerWidth - s) / 2 + 'px'; sv.style.top = (innerHeight - s) / 2 + 'px'; sv.style.width = s + 'px'; sv.style.height = s + 'px';
    app.appendChild(gate); busy = true; rescanMirrors();
    setTimeout(function () { render('back', { fade: true }); gate.classList.add('open'); }, 700);
    setTimeout(function () { gate.remove(); busy = false; toast(L().locked); rescanMirrors(); }, 1600);
  } else { render('back', { fade: true }); toast(L().locked); }
}

/* ================= one handler for every tap ================= */
app.addEventListener('click', function (e) {
  if (busy) return;
  // a hidden amount is revealed by touching it
  if (e.target.closest('.amt.hid, .amtw')) { S.show = true; save(); rerender(); buzz(6); return; }
  if (e.target.closest('#mcard')) { startTilt(true); passSheet(); return; }
  var el = e.target.closest('[data-go],[data-act]'); if (!el || el.disabled) return;
  var l = L(), v = el.getAttribute('data-v');
  if (el.hasAttribute('data-go')) {
    var to = el.getAttribute('data-go'), fromSheet = sheetHist;
    if (sheetOpen) closeSheet(true);
    if (to === route.path) { var pg = $('.page:not(.leave)'); if (pg) pg.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); return; }
    // dock taps between member sections replace each other, so Back from any section returns home
    var dockSwap = el.hasAttribute('data-dock') && route.key !== 'm' && route.key.indexOf('m') === 0;
    go(to, { replace: fromSheet || dockSwap }); return;
  }
  var A = {
    back: function () { goBack(route.key.indexOf('m') === 0 ? 'm' : (route.key === 'apply' && route.step > 1 ? 'apply/' + (route.step - 1) : '')); },
    close: function () { closeSheet(); },
    lang: function () { setLang(fa() ? 'en' : 'fa'); },
    setLang: function () { setLang(v); },
    unlock: unlock,
    fField: function () { S.form.field = Number(v); save(); rerender(); buzz(5); },
    fInt: function () { S.form.int[v] = !S.form.int[v]; save(); rerender(); buzz(5); },
    fRef: function () { S.form.ref = Number(v); save(); rerender(); buzz(5); },
    fContact: function () { S.form.contact = Number(v); save(); rerender(); buzz(5); },
    submit: function () { S.sent = 'VA-' + (40211 + Math.floor(Math.random() * 900)); S.form = { field: null, int: {}, ref: null, contact: 0 }; save(); buzz(20); go('apply/sent', { fade: true }); },
    toHome: function () { S.sent = null; save(); depth = 0; history.replaceState({ i: 0 }, '', '#/'); render('back', { fade: true }); },
    rday: function () { var f = rf(route.room); f.day = Number(v); if (f.time != null && isFull(f.day, f.time, route.room)) f.time = null; save(); rerender(); },
    rtime: function () { rf(route.room).time = Number(v); save(); rerender(); buzz(5); },
    party: function () { var f = rf(route.room); f.party = Math.max(1, Math.min(8, f.party + Number(v))); save(); rerender(); },
    hold: function () {
      var f = rf(route.room);
      if (f.time == null) { for (var ti = 0; ti < TIMES.length; ti++) if (!isFull(f.day, ti, route.room)) { f.time = ti; break; } save(); rerender(); }
      var room = route.room;
      openSheet(l.confirmT, '<div class="kvs">' + kv(l.placeT, l.rooms[room][0]) + kv(l.dateT, dfmt(dayOf(f.day), { weekday: 'long', day: 'numeric', month: 'long' })) + kv(l.time, digits(TIMES[f.time])) + kv(l.guestsT, party(f.party)) + '</div>' +
        '<div class="grid2"><button type="button" class="btn line" data-act="close">' + l.change + '</button><button type="button" class="btn solid" data-act="confirmRes">' + l.confirm + '</button></div>');
    },
    confirmRes: function () {
      var f = rf(route.room), r = { room: route.room, day: f.day, time: TIMES[f.time], party: f.party };
      S.res.push(r); S.res.sort(function (a, b) { return a.day - b.day || a.time.localeCompare(b.time); }); delete S.rf[route.room]; save(); buzz(20);
      openSheet(l.heldT, '<div class="sheet-seal">' + seal({ glint: true }) + '</div><p class="lead center">' + l.heldB + '</p><div class="kvs">' + kv(l.placeT, l.rooms[r.room][0]) + kv(l.dateT, dfmt(dayOf(r.day), { weekday: 'long', day: 'numeric', month: 'long' }) + SEP() + digits(r.time)) + kv(l.guestsT, party(r.party)) + '</div>' +
        '<div class="grid2"><button type="button" class="btn line" data-act="cal">' + l.addCal + '</button><button type="button" class="btn solid" data-go="m">' + l.done + '</button></div>');
      rerender();
    },
    cancelRes: function () { var i = Number(v); openSheet(l.cancelQ, '<p class="lead">' + resLine(S.res[i]) + '</p><div class="grid2"><button type="button" class="btn line" data-act="close">' + l.keep + '</button><button type="button" class="btn danger" data-act="cancelYes" data-v="' + i + '">' + l.cancelYes + '</button></div>'); },
    cancelYes: function () { S.res.splice(Number(v), 1); save(); closeSheet(); rerender(); toast(l.cancelled); },
    event: function () { eventSheet(Number(v)); },
    rsvp: function () { var i = Number(v); S.rsvp[i] = !S.rsvp[i]; if (!S.rsvp[i]) S.bring[i] = 0; save(); buzz(10); toast(S.rsvp[i] ? l.rsvpOn : l.rsvpOff); eventSheet(i); if (route.key === 'm/events' || route.key === 'm') rerender(); },
    bring: function () { var i = Number(el.getAttribute('data-e')); S.bring[i] = Math.max(0, Math.min(2, (S.bring[i] || 0) + Number(v))); save(); eventSheet(i); var b = $('#sheetB [data-act="bring"][data-v="' + v + '"]'); if (b && !b.disabled) b.focus(); if (route.key === 'm/events') rerender(); },
    cal: function () { toast(l.calAdded); },
    share: function () { var e2 = l.events[Number(v)]; if (navigator.share) navigator.share({ title: L().brand, text: e2[0] }).catch(function () {}); else toast(e2[0]); },
    topic: function () { S.cq = { t: Number(v), o: 0, w: 0 }; save(); topicSheet(); },
    cqO: function () { S.cq.o = Number(v); save(); topicSheet(); var b = $('#sheetB [data-act="cqO"][data-v="' + v + '"]'); if (b) b.focus(); },
    cqW: function () { S.cq.w = Number(v); save(); topicSheet(); var b = $('#sheetB [data-act="cqW"][data-v="' + v + '"]'); if (b) b.focus(); },
    sendConc: function () { concList().unshift({ t: S.cq.t, o: S.cq.o, w: S.cq.w, st: 0 }); S.cq = null; save(); closeSheet(); buzz(12); toast(l.sentC); rerender(); },
    concItem: function () {
      var c = concList()[Number(v)], reply = c.seed ? (T[P.lang].seedConc.filter(function (s) { return s[0] === c.t; })[0] || [])[3] : '';
      openSheet(l.topics[c.t][0], '<span class="pill' + (c.st === 2 ? ' ok' : '') + '">' + l.st[c.st] + '</span><div class="kvs">' + kv(l.what, l.topics[c.t][1][c.o]) + kv(l.soon, l.whens[c.w]) + '</div>' +
        (reply ? '<div class="panel reply"><p class="eyb">' + l.replyFrom + '</p><p class="lead">' + reply + '</p></div>' : ''));
    },
    car: function () { carSheet(); },
    carW: function () { S.carW = Number(v); save(); carSheet(); var b = $('#sheetB [data-act="carW"][data-v="' + v + '"]'); if (b) b.focus(); },
    carSend: function () { closeSheet(); buzz(12); toast(l.carDone); },
    locker: function () { openSheet(l.lockerT, '<p class="lead">' + l.lockerB + '</p><div class="kvs">' + l.cigars.map(function (c) { return kv(c[0], '× ' + digits(c[1])); }).join('') + '</div><button type="button" class="btn line" data-act="asked">' + l.ask + '</button>'); },
    asked: function () { closeSheet(); toast(l.asked); },
    eye: function () { S.show = !S.show; save(); rerender(); },
    filt: function () { S.filt = Number(v); save(); rerender(); },
    statement: function () { toast(l.stSent); },
    topup: function () { S.top = S.top || { a: 1, m: 0 }; save(); topSheet(); },
    topA: function () { S.top.a = Number(v); save(); topSheet(); var b = $('#sheetB [data-act="topA"][data-v="' + v + '"]'); if (b) b.focus(); },
    topM: function () { S.top.m = Number(v); save(); topSheet(); var b = $('#sheetB [data-act="topM"][data-v="' + v + '"]'); if (b) b.focus(); },
    topSend: function () { S.pend.unshift({ amt: TOPS[S.top.a], m: S.top.m, at: Date.now() }); S.top = null; save(); closeSheet(); buzz(12); toast(l.topDone); rerender(); },
    tx: function () {
      var t = W.tx[Number(v)], top = t[0] === 'top', d = dayOf(t[2]);
      openSheet(top ? l.txTop : l.places[t[3]], '<div class="balance in-sheet"><div class="bigamt' + (top ? ' plus' : '') + '"><bdi class="amt">' + (top ? '+' : '−') + n(t[1]) + '</bdi></div><p class="unit">' + l.unit + '</p></div><div class="kvs">' +
        kv(l.dateT, dfmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })) + (top ? '' : kv(l.placeT, l.places[t[3]]) + kv(l.guestsT, party(t[4] + 1))) +
        kv(l.statusT, '<span class="okc">' + l.settled + '</span>') + kv(l.receipt, '<bdi>' + digits('R-' + (40211 + Number(v) * 37)) + '</bdi>') + '</div><button type="button" class="btn ghost" data-act="report">' + l.report + '</button>');
    },
    report: function () { closeSheet(); toast(l.reported); },
    rmGuest: function () { S.guests.splice(Number(v), 1); save(); rerender(); toast(l.removed); },
    addGuest: function () { S.guests.push(Number(v)); save(); rerender(); toast(l.added); },
    notif: function () { S.notif[Number(v)] = !S.notif[Number(v)]; save(); el.setAttribute('aria-checked', String(S.notif[Number(v)])); buzz(5); },
    faceid: function () { S.faceid = !S.faceid; save(); el.setAttribute('aria-checked', String(S.faceid)); buzz(5); },
    tilt: function () { startTilt(true); setTimeout(function () { el.setAttribute('aria-checked', String(tiltOn)); }, 400); },
    lock: lock
  };
  if (A[el.getAttribute('data-act')]) A[el.getAttribute('data-act')]();
});
var TOPS = [50000000, 100000000, 200000000, 500000000];
function topSheet() {
  var l = L();
  openSheet(l.topT, '<div class="f"><span class="lab">' + l.topAmt + SEP() + l.unit + '</span>' + chips('topA', TOPS.map(function (a) { return n(a); }), S.top.a) + '</div>' +
    '<div class="f"><span class="lab">' + l.method + '</span>' + chips('topM', l.methods, S.top.m) + '</div>' +
    '<button type="button" class="btn solid" data-act="topSend">' + l.topSend + '</button><p class="small">' + l.topDone + '</p>');
}
function topicSheet() {
  var l = L(), q = S.cq, t = l.topics[q.t];
  openSheet(t[0], '<div class="f"><span class="lab">' + l.what + '</span>' + chips('cqO', t[1], q.o) + '</div><div class="f"><span class="lab">' + l.soon + '</span>' + chips('cqW', l.whens, q.w) + '</div>' +
    '<button type="button" class="btn solid" data-act="sendConc">' + l.sendC + '</button>');
}
function carSheet() { var l = L(); openSheet(l.carT, '<p class="lead">' + l.carB + '</p>' + chips('carW', l.carWhen, S.carW || 0) + '<button type="button" class="btn solid" data-act="carSend">' + l.carSend + '</button>'); }
function passSheet() {
  var l = L(), g = guestsTonight(), nx = S.res.filter(function (x) { return x.day === 0; })[0];
  openSheet(l.passT, '<div class="pass"><div class="qr">' + qr() + '</div><b>' + l.memberName + '</b><i>' + l.tier + SEP() + (fa() ? 'شمارهٔ ۰۰۱' : 'Nº 001') + '</i></div>' +
    '<p class="lead center">' + (g ? fill(l.passGuests, digits(g)) : l.passAlone) + (nx ? '<br>' + resLine(nx) : '') + '</p><p class="small center">' + l.passB + '</p>');
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheetOpen) { e.preventDefault(); closeSheet(); } });
// amounts hide again when the app goes to the background
document.addEventListener('visibilitychange', function () { if (document.hidden && S.show) { S.show = false; save(); if (route.key === 'm/wallet' && !sheetOpen) rerender(); } });
function setLang(x) {
  P.lang = x === 'en' ? 'en' : 'fa'; store.set('vault4.lang', P.lang);
  var pg = $('.page:not(.leave)'), top = pg ? pg.scrollTop : 0;
  if (sheetOpen) closeSheet();
  render('same', { fade: true, keepFocus: true }); pg = $('.page:not(.leave)'); if (pg && top) pg.scrollTop = top;
  var b = $('.langb'); if (b) b.focus({ preventScroll: true });
}
view.addEventListener('scroll', function (e) { var t = e.target; if (t.classList && t.classList.contains('page') && !t.classList.contains('leave')) app.classList.toggle('scrolled', t.scrollTop > 8); }, true);

/* ================= start ================= */
var q = new URLSearchParams(location.search);
if (q.get('lang')) P.lang = q.get('lang') === 'en' ? 'en' : 'fa';
history.replaceState({ i: 0 }, '', location.hash || '#/');
drawField(false);
render('fwd', { fade: true });
startTilt(false);
})();
