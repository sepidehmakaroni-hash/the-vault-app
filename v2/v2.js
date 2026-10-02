/* The Vault — v2 "The Real Vault". Front-end prototype, no build step, no libraries.
   Routes live in the URL hash (#/m/wallet …) so Back, reload and deep links work.
   Everything the person types is kept (sessionStorage) until they send it; nothing is lost on Back. */
(function () {
'use strict';

/* ================= strings ================= */
var T = {
en: {
lang: 'فا', back: 'Back', close: 'Close', sound: 'Sound', unit: 'Toman',
eyebrow: 'Private members’ club · Tehran', title: 'Where value is kept.', spin: 'Turn the dial',
members: 'Members — open the vault', request: 'Request membership', explore: 'Explore the house',
loginTitle: 'Members', loginBody: 'Your combination arrives by message: three numbers that open the door.',
byCode: 'Combination', byPass: 'Password', mobile: 'Mobile number', send: 'Send my combination',
user: 'Mobile, email or username', pass: 'Password', show: 'Show', hide: 'Hide', enter: 'Open the vault', forgot: 'Forgot password?',
comboEy: 'Your combination', comboBody: 'Turn the dial to each number in your message and let go.', typeInstead: 'Type the numbers instead', useDial: 'Use the dial', changeNum: 'Change number', open: 'Open', sentCombo: 'Your combination is on its way.',
forgotTitle: 'Reset your password', forgotBody: 'We will send a four-digit code to your mobile.', sendCode: 'Send code', codeSent: 'The code is on its way.', codeLab: 'Code from your message', newPass: 'New password', newPass2: 'Repeat the new password', setPass: 'Set new password', passShort: 'At least 8 characters.', passMatch: 'The two passwords are different.', needCode: 'Enter the four digits.', passDone: 'Your new password is set.', resend: 'Send the code again', resendIn: 'Send again in', sec: 's',
houseEy: 'The house', houseTitle: 'A private house for people who take quality seriously.', houseBody: 'Thirteen rooms behind one door on Maryam Street, from the lounge to a Japanese garden. Membership is by introduction.',
roomsT: 'The rooms', calT: 'The calendar', calNote: 'Members reply from their account. Seats are held by name.', memT: 'Membership',
memSteps: ['Tell us who you are, in five short steps.', 'A member who knows you may introduce you.', 'The committee reads every request.', 'You hear from us by message, either way.'],
rulesT: 'House rules', rulesBody: 'A few short rules for every member and every guest, with no exceptions at the door.',
rules: [['Guests', 'Every guest is named before the night. A guest never pays.'], ['The bill', 'Nothing is settled at the table. It comes off your charge.'], ['Photography', 'No photographs of other members, anywhere in the house.'], ['Privacy', 'The club never confirms or denies who is a member.'], ['Age', 'No one under fifteen, at any hour.'], ['Smoking', 'The terrace only. Cigars in the humidor.']],
reqEy: 'Request membership', stepOf: 'Step %1 of 5', saved: 'Saved on this device', next: 'Next', toReview: 'Save and return to review', submit: 'Send my request', edit: 'Edit', fixFirst: 'Please check the marked fields.',
steps: [['Personal information', 'As it appears on your ID.'], ['Online presence', 'Where your work can be seen.'], ['Introduction', 'In your own words.'], ['Referrer', 'Optional. A member who knows you.'], ['Review and send', 'Check everything once, then send.']],
first: 'First name', last: 'Last name', email: 'Email', gender: 'Title', genders: ['Mr', 'Ms', 'Prefer not to say'], country: 'Country', city: 'City', dob: 'Date of birth', day: 'Day', month: 'Month', year: 'Year',
months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
website: 'Website', insta: 'Instagram', linkedin: 'LinkedIn', field: 'Field of activity', fields: ['Art', 'Technology', 'Media', 'Investment', 'Hospitality', 'Fashion & lifestyle', 'Health & wellness', 'Architecture & design'], position: 'Position or job title', positionPh: 'Founder, architect, collector…',
intro: 'A short introduction', introPh: 'Who you are and what you do…', reason: 'Why The Vault', reasonPh: 'What you hope to find here…', interests: 'Interests', interestList: ['Dining', 'Art', 'Wellness', 'Events', 'Travel', 'Business', 'Music'],
refName: 'Referrer’s name', refPhone: 'Referrer’s mobile', rel: 'How you know them', rels: ['Friend', 'Colleague', 'Family', 'Other'],
agree1: 'I have read and accept the house rules and the privacy policy.', agree2: 'I confirm that the information I have given is correct.', readRules: 'Read the house rules',
e: { req: 'This is needed.', phone: 'Use at least 10 digits.', email: 'This email does not look right.', date: 'This date does not look right.', one: 'Choose at least one.', short: 'A few more words, please (at least 20 characters).', agree: 'Please confirm.', code: 'Enter the four digits.', pshort: 'At least 8 characters.', match: 'The two passwords are different.', text: 'Tell us a little more.', time: 'Choose a time.' },
sentEy: 'Request received', sentTitle: 'Your request is sealed.', sentBody: 'The committee reads every request in person. You will hear from us by message within ten days.', ref: 'Reference', toDoor: 'Back to the door',
memberNo: 'Member Nº 001', morning: 'Good morning.', afternoon: 'Good afternoon.', evening: 'Good evening.',
cardHint: 'Tap the card to show it at the door', cardBackT: 'Show at the door', cardBackD: 'The doorman scans this. It changes every visit.',
avail: 'Available to spend', owed: 'Owed', ofLimit: 'of %1 credit',
nextVisit: 'Your next visit', nothing: 'Nothing reserved yet', chooseRoom: 'choose a room and a time',
boxes: [['Reserve', 'A table, a room'], ['Calendar', 'What is on'], ['Concierge', 'Anything, tonight'], ['Wallet', 'Charge and credit']],
tonight: 'Next at the house',
dock: ['Home', 'Reserve', 'Events', 'Concierge', 'Wallet'],
reserveEy: 'Reserve', reserveTitle: 'Where would you like to sit?', yourRes: 'Your reservations', cancel: 'Cancel', cancelQ: 'Cancel this reservation?', cancelYes: 'Yes, cancel it', keep: 'Keep it', cancelled: 'The reservation is cancelled.',
rooms: [['The lounge', 'The heart of the club. No reservation needed by day.', 'lounge'], ['Dining room', 'One room, one service. Lunch and dinner.', 'room-table'], ['Sushi counter', 'Eight seats in front of the itamae.', 'room-sushi'], ['Bar and humidor', 'Cigars are smoked here and nowhere else.', 'room-humidor'], ['The terrace', 'Open air. Dinner served. Smoking.', 'room-terrace'], ['The Japanese garden', 'Granted, not sold. Ask the concierge.', 'room-garden']],
when: 'Day', time: 'Time', party: 'How many, with you', guestNames: 'Names of your guests', guestPh: 'One name per line', noteLab: 'Anything we should know', notePh: 'An occasion, an allergy…', hold: 'Hold the table', full: 'Full',
heldT: 'Your table is held', heldB: 'It is kept under your name. Nothing more is needed at the door.', addCal: 'Add to calendar', done: 'Done', calAdded: 'Added to your calendar.',
people: '%1 people', person: '1 person',
eventsEy: 'The calendar', eventsTitle: 'A private calendar of culture and art.', seats: '%1 seats left', seatsK: 'Seats left', going: 'Going', youGo: 'You are going', bring: 'Guests you bring', share: 'Share', rsvpOn: 'Your seat is held.', rsvpOff: 'Your seat is released.', attend: 'Hold my seat',
events: [['Contemporary art preview', 'The Gallery Hall', '19:00', 'A first look at the winter collection, with the artists in the room.'], ['Design and architecture table', 'Members’ Studio', '20:00', 'Twelve seats, one long table, three architects and a question.'], ['Jazz in the lounge', 'The lounge', '22:00', 'A trio from Istanbul. Late, quiet, and only for members.'], ['Collectors’ brunch', 'Chamber Lounge', '11:00', 'Collectors, a curator and a very good breakfast.']],
concEy: 'Concierge', concTitle: 'What can we arrange?', concBody: 'Ask for anything. If it can be done, it will be, and you will hear back tonight.', about: 'It is about', topics: ['A table elsewhere', 'Car and driver', 'Flowers or a gift', 'Tickets', 'Travel', 'Something else'],
tell: 'Tell us', tellPh: 'For whom, when, and anything we should know', soon: 'When', whens: ['Today', 'This week', 'No hurry'], sendC: 'Send to the concierge', sentC: 'The concierge has it.',
yourReq: 'Your requests', st: ['Received', 'In progress', 'Done'], replyFrom: 'From the concierge',
seedConc: [['Car and driver', 'A car for two after dinner on Thursday, to Niavaran.', 2, 'A black sedan will wait at the door at 23:30. The driver’s name is Reza.'], ['Flowers or a gift', 'White peonies for a birthday, delivered Saturday morning.', 1, '']],
walletEy: 'Wallet', balanceNow: 'Balance', inCredit: 'in credit', inDebt: 'owed to the house', eyeHide: 'Hide amounts', eyeShow: 'Show amounts',
creditT: 'Credit on account', limit: 'Limit', used: 'Used', creditNote: 'You can keep spending on account until what you owe reaches the limit. At the limit, charges pause until you settle.', creditStop: 'You have reached the credit limit. Charges are paused until you settle.',
statsT: 'This membership year', fee: 'Membership fee paid', topped: 'Total charged', spent: 'Total spent', remain: 'Remaining charge', debt: 'Owed', availS: 'Available',
byPlace: 'Where it was spent', activity: 'Activity', filt: ['All', 'Spending', 'Top-ups'], topup: 'Top up', statementB: 'Statement', stSent: 'Your statement will be sent privately.',
topT: 'Top up your charge', topAmt: 'Amount', other: 'Another amount', method: 'How', methods: ['Card', 'Bank transfer', 'At the desk'], topSend: 'Request top-up', topDone: 'Requested. It is credited once the finance desk confirms.', pending: 'Pending', needAmt: 'Choose or enter an amount.',
txTop: 'Top-up', txFee: 'Membership fee', receipt: 'Receipt', dateT: 'Date', placeT: 'Place', guestsT: 'Guests', statusT: 'Status', settled: 'Settled', report: 'Report a problem', reported: 'The finance desk will contact you.',
feeNote: 'Membership fee of %1 paid on %2. Renews on %3.',
places: ['Dining room', 'The lounge', 'Sushi counter', 'Events', 'Concierge'],
accEy: 'Account', since: 'Member since %1', tier: 'Founding member', guestsH: 'Your regular guests', guestAdd: 'Add', guestPh2: 'Full name', noGuests: 'No regular guests yet.', removed: 'Removed.',
settings: 'Settings', language: 'Language', notif: 'Notifications', notifs: ['Reservations', 'Events', 'Concierge replies'], faceid: 'Open with Face ID', lock: 'Lock the vault', locked: 'The vault is locked.', allDev: 'Sign out on all devices', allDevDone: 'Signed out everywhere else.'
},
fa: {
lang: 'EN', back: 'بازگشت', close: 'بستن', sound: 'صدا', unit: 'تومان',
eyebrow: 'باشگاه خصوصی اعضا · تهران', title: 'جایی که ارزش نگه داشته می‌شود.', spin: 'قفل را بچرخانید',
members: 'اعضا — باز کردن گاوصندوق', request: 'درخواست عضویت', explore: 'آشنایی با خانه',
loginTitle: 'ورود اعضا', loginBody: 'رمز شما با پیامک می‌رسد: سه عدد که در را باز می‌کند.',
byCode: 'رمز سه‌عددی', byPass: 'رمز عبور', mobile: 'شمارهٔ موبایل', send: 'رمزم را بفرستید',
user: 'موبایل، ایمیل یا نام کاربری', pass: 'رمز عبور', show: 'نمایش', hide: 'پنهان', enter: 'باز کردن گاوصندوق', forgot: 'رمز را فراموش کرده‌اید؟',
comboEy: 'رمز شما', comboBody: 'قفل را روی هر عدد پیام بچرخانید و رها کنید.', typeInstead: 'تایپ عددها', useDial: 'چرخاندن قفل', changeNum: 'تغییر شماره', open: 'باز کن', sentCombo: 'رمز شما فرستاده شد.',
forgotTitle: 'رمز تازه', forgotBody: 'یک کد چهاررقمی به موبایل شما می‌فرستیم.', sendCode: 'ارسال کد', codeSent: 'کد فرستاده شد.', codeLab: 'کد پیامک', newPass: 'رمز تازه', newPass2: 'تکرار رمز تازه', setPass: 'ثبت رمز تازه', passShort: 'حداقل ۸ نویسه.', passMatch: 'دو رمز یکسان نیستند.', needCode: 'چهار رقم را وارد کنید.', passDone: 'رمز تازهٔ شما ثبت شد.', resend: 'ارسال دوبارهٔ کد', resendIn: 'ارسال دوباره تا', sec: 'ثانیه',
houseEy: 'خانه', houseTitle: 'خانه‌ای خصوصی برای کسانی که کیفیت را جدی می‌گیرند.', houseBody: 'سیزده فضا پشت یک در در خیابان مریم، از لانژ تا باغچهٔ ژاپنی. عضویت فقط با معرفی است.',
roomsT: 'فضاها', calT: 'تقویم', calNote: 'اعضا از حساب خود پاسخ می‌دهند. جا به نام نگه داشته می‌شود.', memT: 'عضویت',
memSteps: ['در پنج گام کوتاه خودتان را معرفی کنید.', 'عضوی که شما را می‌شناسد می‌تواند معرفتان باشد.', 'کمیته هر درخواست را می‌خواند.', 'نتیجه، هر چه باشد، با پیامک به شما می‌رسد.'],
rulesT: 'قوانین خانه', rulesBody: 'چند قانون کوتاه برای هر عضو و هر مهمان، بی‌استثنا.',
rules: [['مهمان', 'نام هر مهمان از پیش داده می‌شود. مهمان هرگز پرداخت نمی‌کند.'], ['صورت‌حساب', 'هیچ حسابی سر میز بسته نمی‌شود. از شارژ شما کم می‌شود.'], ['عکاسی', 'از اعضای دیگر، هیچ‌جای خانه عکس گرفته نمی‌شود.'], ['حریم', 'باشگاه عضویت هیچ‌کس را تأیید یا رد نمی‌کند.'], ['سن', 'هیچ‌کس زیر پانزده سال، در هیچ ساعتی.'], ['دخانیات', 'فقط در تراس. سیگار برگ در هیومیدور.']],
reqEy: 'درخواست عضویت', stepOf: 'گام %1 از ۵', saved: 'روی همین دستگاه ذخیره شد', next: 'بعدی', toReview: 'ذخیره و بازگشت به مرور', submit: 'ارسال درخواست', edit: 'ویرایش', fixFirst: 'لطفاً فیلدهای مشخص‌شده را بررسی کنید.',
steps: [['اطلاعات شخصی', 'همان‌طور که در کارت شناسایی آمده.'], ['حضور آنلاین', 'جایی که کار شما دیده می‌شود.'], ['معرفی', 'با کلمات خودتان.'], ['معرف', 'اختیاری. عضوی که شما را می‌شناسد.'], ['مرور و ارسال', 'یک بار همه را ببینید، بعد بفرستید.']],
first: 'نام', last: 'نام خانوادگی', email: 'ایمیل', gender: 'عنوان', genders: ['آقا', 'خانم', 'ترجیح می‌دهم نگویم'], country: 'کشور', city: 'شهر', dob: 'تاریخ تولد', day: 'روز', month: 'ماه', year: 'سال',
months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
website: 'وب‌سایت', insta: 'اینستاگرام', linkedin: 'لینکدین', field: 'حوزهٔ فعالیت', fields: ['هنر', 'فناوری', 'رسانه', 'سرمایه‌گذاری', 'مهمان‌نوازی', 'مد و سبک زندگی', 'سلامت', 'معماری و طراحی'], position: 'سمت یا عنوان شغلی', positionPh: 'بنیان‌گذار، معمار، مجموعه‌دار…',
intro: 'معرفی کوتاه', introPh: 'چه کسی هستید و چه می‌کنید…', reason: 'چرا والت', reasonPh: 'امیدوارید اینجا چه پیدا کنید…', interests: 'علاقه‌مندی‌ها', interestList: ['غذا', 'هنر', 'سلامت', 'رویدادها', 'سفر', 'کسب‌وکار', 'موسیقی'],
refName: 'نام معرف', refPhone: 'موبایل معرف', rel: 'نسبت شما', rels: ['دوست', 'همکار', 'خانواده', 'دیگر'],
agree1: 'قوانین خانه و سیاست حریم خصوصی را خوانده‌ام و می‌پذیرم.', agree2: 'تأیید می‌کنم اطلاعاتی که داده‌ام درست است.', readRules: 'خواندن قوانین خانه',
e: { req: 'این مورد لازم است.', phone: 'حداقل ۱۰ رقم.', email: 'این ایمیل درست به نظر نمی‌رسد.', date: 'این تاریخ درست نیست.', one: 'حداقل یکی را انتخاب کنید.', short: 'کمی بیشتر بنویسید (حداقل ۲۰ نویسه).', agree: 'لطفاً تأیید کنید.', code: 'چهار رقم را وارد کنید.', pshort: 'حداقل ۸ نویسه.', match: 'دو رمز یکسان نیستند.', text: 'کمی بیشتر بگویید.', time: 'یک ساعت انتخاب کنید.' },
sentEy: 'درخواست رسید', sentTitle: 'درخواست شما مهر و موم شد.', sentBody: 'کمیته هر درخواست را شخصاً می‌خواند. تا ده روز دیگر با پیامک خبر می‌گیرید.', ref: 'شمارهٔ پیگیری', toDoor: 'بازگشت به در',
memberNo: 'عضو شمارهٔ ۰۰۱', morning: 'صبح بخیر.', afternoon: 'عصر بخیر.', evening: 'شب بخیر.',
cardHint: 'برای نشان دادن در ورودی، روی کارت بزنید', cardBackT: 'نمایش در ورودی', cardBackD: 'دربان این را اسکن می‌کند. هر بار عوض می‌شود.',
avail: 'قابل خرج', owed: 'بدهی', ofLimit: 'از %1 اعتبار',
nextVisit: 'حضور بعدی شما', nothing: 'هنوز رزروی نیست', chooseRoom: 'یک فضا و یک ساعت انتخاب کنید',
boxes: [['رزرو', 'یک میز، یک فضا'], ['تقویم', 'برنامهٔ خانه'], ['کانسیرژ', 'هر چه بخواهید'], ['کیف پول', 'شارژ و اعتبار']],
tonight: 'برنامهٔ بعدی خانه',
dock: ['خانه', 'رزرو', 'رویدادها', 'کانسیرژ', 'کیف پول'],
reserveEy: 'رزرو', reserveTitle: 'کجا می‌خواهید بنشینید؟', yourRes: 'رزروهای شما', cancel: 'لغو', cancelQ: 'این رزرو لغو شود؟', cancelYes: 'بله، لغو شود', keep: 'نگه دار', cancelled: 'رزرو لغو شد.',
rooms: [['لانژ', 'قلب باشگاه. روزها بدون رزرو.', 'lounge'], ['سالن غذاخوری', 'یک سالن، یک سرویس. ناهار و شام.', 'room-table'], ['پیشخوان سوشی', 'هشت صندلی روبه‌روی ایتامه.', 'room-sushi'], ['بار و هیومیدور', 'سیگار برگ فقط اینجا.', 'room-humidor'], ['تراس', 'فضای باز، با شام. سیگار آزاد.', 'room-terrace'], ['باغچهٔ ژاپنی', 'فروشی نیست، داده می‌شود. از کانسیرژ بپرسید.', 'room-garden']],
when: 'روز', time: 'ساعت', party: 'چند نفر، با خودتان', guestNames: 'نام مهمان‌ها', guestPh: 'هر نام در یک خط', noteLab: 'چیزی که باید بدانیم', notePh: 'یک مناسبت، یک حساسیت غذایی…', hold: 'نگه داشتن میز', full: 'پر',
heldT: 'میز شما نگه داشته شد', heldB: 'به نام شما نگه داشته می‌شود. در ورودی چیز دیگری لازم نیست.', addCal: 'افزودن به تقویم', done: 'تمام', calAdded: 'به تقویم شما اضافه شد.',
people: '%1 نفر', person: '۱ نفر',
eventsEy: 'تقویم', eventsTitle: 'تقویم خصوصی فرهنگ و هنر.', seats: '%1 جای خالی', seatsK: 'جای خالی', going: 'می‌آیم', youGo: 'شما می‌آیید', bring: 'مهمان همراه', share: 'اشتراک', rsvpOn: 'جای شما نگه داشته شد.', rsvpOff: 'جای شما آزاد شد.', attend: 'جایم را نگه دارید',
events: [['پیش‌نمایش هنر معاصر', 'تالار گالری', '۱۹:۰۰', 'نخستین نگاه به مجموعهٔ زمستان، با حضور هنرمندان.'], ['میز طراحی و معماری', 'استودیوی اعضا', '۲۰:۰۰', 'دوازده صندلی، یک میز بلند، سه معمار و یک پرسش.'], ['جاز در لانژ', 'لانژ', '۲۲:۰۰', 'یک تریو از استانبول. دیروقت، آرام، فقط برای اعضا.'], ['برانچ مجموعه‌داران', 'لانژ چمبر', '۱۱:۰۰', 'مجموعه‌داران، یک کیوریتور و یک صبحانهٔ خیلی خوب.']],
concEy: 'کانسیرژ', concTitle: 'چه کاری برایتان انجام دهیم؟', concBody: 'هر چه بخواهید. اگر شدنی باشد، انجام می‌شود و همین امشب خبر می‌گیرید.', about: 'دربارهٔ', topics: ['میز در جای دیگر', 'ماشین و راننده', 'گل یا هدیه', 'بلیت', 'سفر', 'چیز دیگر'],
tell: 'بگویید', tellPh: 'برای چه کسی، چه زمانی، و هر چه باید بدانیم', soon: 'کی', whens: ['امروز', 'همین هفته', 'عجله‌ای نیست'], sendC: 'ارسال به کانسیرژ', sentC: 'کانسیرژ درخواست شما را دارد.',
yourReq: 'درخواست‌های شما', st: ['دریافت شد', 'در حال انجام', 'انجام شد'], replyFrom: 'پاسخ کانسیرژ',
seedConc: [['ماشین و راننده', 'یک ماشین برای دو نفر بعد از شام پنجشنبه، به نیاوران.', 2, 'یک سدان مشکی ساعت ۲۳:۳۰ جلوی در منتظر است. نام راننده رضاست.'], ['گل یا هدیه', 'گل صدتومانی سفید برای تولد، شنبه صبح.', 1, '']],
walletEy: 'کیف پول', balanceNow: 'مانده', inCredit: 'بستانکار', inDebt: 'بدهی به خانه', eyeHide: 'پنهان کردن مبالغ', eyeShow: 'نمایش مبالغ',
creditT: 'اعتبار حساب', limit: 'سقف', used: 'استفاده‌شده', creditNote: 'تا وقتی بدهی شما به سقف نرسیده، می‌توانید با اعتبار خرج کنید. با رسیدن به سقف، خرید با حساب تا تسویه متوقف می‌شود.', creditStop: 'به سقف اعتبار رسیده‌اید. خرید با حساب تا تسویه متوقف است.',
statsT: 'این سال عضویت', fee: 'حق عضویت پرداخت‌شده', topped: 'جمع شارژ', spent: 'جمع خرج', remain: 'ماندهٔ شارژ', debt: 'بدهی', availS: 'قابل خرج',
byPlace: 'کجا خرج شده', activity: 'گردش حساب', filt: ['همه', 'خرج', 'شارژ'], topup: 'شارژ حساب', statementB: 'صورت‌حساب', stSent: 'صورت‌حساب به‌صورت خصوصی برایتان فرستاده می‌شود.',
topT: 'شارژ حساب', topAmt: 'مبلغ', other: 'مبلغ دیگر', method: 'روش', methods: ['کارت', 'حواله', 'در پذیرش'], topSend: 'درخواست شارژ', topDone: 'ثبت شد. پس از تأیید بخش مالی به حساب می‌نشیند.', pending: 'در انتظار', needAmt: 'یک مبلغ انتخاب یا وارد کنید.',
txTop: 'شارژ', txFee: 'حق عضویت', receipt: 'رسید', dateT: 'تاریخ', placeT: 'محل', guestsT: 'مهمان‌ها', statusT: 'وضعیت', settled: 'تسویه‌شده', report: 'گزارش مشکل', reported: 'بخش مالی با شما تماس می‌گیرد.',
feeNote: 'حق عضویت %1 در %2 پرداخت شده. تمدید در %3.',
places: ['سالن غذاخوری', 'لانژ', 'پیشخوان سوشی', 'رویدادها', 'کانسیرژ'],
accEy: 'حساب', since: 'عضو از %1', tier: 'عضو مؤسس', guestsH: 'مهمان‌های همیشگی', guestAdd: 'افزودن', guestPh2: 'نام کامل', noGuests: 'هنوز مهمانی ثبت نشده.', removed: 'حذف شد.',
settings: 'تنظیمات', language: 'زبان', notif: 'اعلان', notifs: ['رزروها', 'رویدادها', 'پاسخ کانسیرژ'], faceid: 'باز کردن با Face ID', lock: 'قفل کردن گاوصندوق', locked: 'گاوصندوق قفل شد.', allDev: 'خروج از همهٔ دستگاه‌ها', allDevDone: 'از همهٔ دستگاه‌های دیگر خارج شدید.'
}
};
var COUNTRIES = [['Iran', 'ایران', '+98'], ['UAE', 'امارات', '+971'], ['Turkey', 'ترکیه', '+90'], ['United Kingdom', 'بریتانیا', '+44'], ['Germany', 'آلمان', '+49'], ['Canada', 'کانادا', '+1'], ['United States', 'آمریکا', '+1']];

/* ================= helpers ================= */
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var app = $('#app'), view = $('#view'), bar = $('#bar'), dock = $('#dock'), dial = $('#dial');
var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
var wait = function (ms) { return new Promise(function (r) { setTimeout(r, calm ? 0 : ms); }); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
var DAY = 864e5;
// prototype: nothing has to be filled in to move on. Set to false to switch the checks (and their messages) back on.
var FREE = true;

var P = { lang: ls.get('vault.lang') || 'en', sound: ls.get('vault.sound') !== 'off' };
var fa = function () { return P.lang === 'fa'; };
var L = function () { return T[P.lang]; };
var fill = function (s) { var a = arguments; return String(s).replace(/%(\d)/g, function (_, i) { return a[i]; }); };
var n = function (x) { return new Intl.NumberFormat(fa() ? 'fa-IR' : 'en-US').format(x); };
var digits = function (s) { return fa() ? String(s).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }) : String(s); };
var money = function (x) { return '<span class="money">' + n(Math.abs(x)) + '</span>'; };
var dfmt = function (d, o) { return new Intl.DateTimeFormat(fa() ? 'fa-IR-u-ca-persian' : 'en-GB', o).format(d); };
var dayOf = function (off) { var d = new Date(); d.setHours(12, 0, 0, 0); return new Date(d.getTime() + off * DAY); };

/* ================= state that survives Back and reload ================= */
var S = (function () {
  var base = { form: { cc: 0, interests: {}, fields: {} }, errs: {}, done: {}, reviewing: false, sent: null, authed: false,
    res: [], rf: {}, rsvp: { 0: true }, bring: {}, conc: null, cf: { topic: 0, when: 0, text: '' }, guests: ['Shirin Ahmadi', 'Kaveh Tehrani'],
    pend: [], hide: false, filt: 0, notif: [true, true, true], faceid: false, login: { mode: 0, cc: 0 }, fp: { step: 0, cc: 0 }, typing: false };
  try { var s = JSON.parse(sessionStorage.getItem('vault.v2') || 'null'); if (s) return Object.assign(base, s); } catch (e) {}
  return base;
})();
var saveT;
function save() { clearTimeout(saveT); saveT = setTimeout(function () { try { sessionStorage.setItem('vault.v2', JSON.stringify(S)); } catch (e) {} }, 120); }
function get(path) { return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, S); }
function set(path, v) { var ks = path.split('.'), o = S; for (var i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = {}; o = o[ks[i]]; } o[ks[ks.length - 1]] = v; save(); }

/* ================= sound and touch ================= */
var AC = null, NOISE = null;
function audio() {
  if (!P.sound) return null;
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
  tick: function () { var ac = audio(); if (ac) noise(ac, ac.currentTime, 0.014, 'bandpass', 2600 + Math.random() * 900, 4, 0.2); },
  set: function () { var ac = audio(); if (!ac) return; var t = ac.currentTime; noise(ac, t, 0.03, 'bandpass', 1800, 2, 0.32); tone(ac, t, 190, 80, 0.16, 0.32); },
  bolts: function () { var ac = audio(); if (!ac) return; var t = ac.currentTime; for (var i = 0; i < 4; i++) { noise(ac, t + i * 0.1, 0.05, 'lowpass', 1300, 1, 0.28); tone(ac, t + i * 0.1, 120, 55, 0.12, 0.28); } },
  seal: function () { var ac = audio(); if (!ac) return; var t = ac.currentTime; noise(ac, t, 0.5, 'lowpass', 900, 0.6, 0.18); tone(ac, t, 70, 50, 0.3, 0.25); },
  swing: function () { var ac = audio(); if (!ac) return; var t = ac.currentTime; noise(ac, t, 2.4, 'lowpass', 240, 0.7, 0.26); tone(ac, t, 58, 36, 2.2, 0.15); },
  shut: function () { var ac = audio(); if (!ac) return; var t = ac.currentTime; tone(ac, t, 90, 35, 0.55, 0.6); noise(ac, t, 0.25, 'lowpass', 500, 1, 0.5); }
};
var hsw = document.createElement('label');
hsw.setAttribute('aria-hidden', 'true'); hsw.style.cssText = 'position:fixed;left:-99px;top:0;width:1px;height:1px;overflow:hidden';
hsw.innerHTML = '<input type="checkbox" switch tabindex="-1">'; document.body.appendChild(hsw);
var lastBuzz = 0;
function buzz(ms) { var now = performance.now(); if (now - lastBuzz < 45) return; lastBuzz = now; if (navigator.vibrate) navigator.vibrate(ms || 6); else hsw.click(); }
var toastT;
function toast(msg) { var el = $('.toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2800); }

/* ================= icons ================= */
var ICON = {};
function ic(name, body) { ICON[name] = 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>') + '")'; }
ic('home', '<path d="M4 11l8-6.5 8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>');
ic('reserve', '<rect x="4" y="5.5" width="16" height="14.5" rx="1"/><path d="M4 10h16M8.5 3v4M15.5 3v4"/>');
ic('events', '<path d="M12 3.5l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.5l-5.2 2.9L8 13.6l-4.4-4 5.9-.7z"/>');
ic('conc', '<path d="M4.5 17.5c0-4.4 3.3-8 7.5-8s7.5 3.6 7.5 8z"/><path d="M3 17.5h18M12 9.5V7M10 7h4"/>');
ic('wallet', '<rect x="3.5" y="6" width="17" height="13" rx="1.5"/><path d="M3.5 9.5h17M15.5 14h2"/><path d="M6 6l9-2.5 1 2.5"/>');
ic('sound', '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>');
ic('mute', '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>');
ic('eye', '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>');
ic('eyeoff', '<path d="M3 3l18 18M10.6 6.1A8.8 8.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-3 3.6M6.4 7.6A15.7 15.7 0 0 0 2.5 12S6 18 12 18a8.7 8.7 0 0 0 4-1"/>');
ic('in', '<path d="M12 4v13M6.5 11.5L12 17l5.5-5.5M5 20h14"/>');
ic('out', '<path d="M12 20V7M6.5 12.5L12 7l5.5 5.5M5 4h14"/>');
ic('lock', '<rect x="5" y="10.5" width="14" height="10" rx="1"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>');
var I = function (name) { return '<span class="ico" style="--i:' + ICON[name].replace(/"/g, '&quot;') + '"></span>'; };
var KEYHOLE = '<svg class="keyhole" viewBox="0 0 16 24" aria-hidden="true"><circle cx="8" cy="7.5" r="5.5" fill="#0b0a08" stroke="rgba(205,181,126,.55)"/><path d="M5.2 11h5.6l1.8 10.5H3.4z" fill="#0b0a08" stroke="rgba(205,181,126,.55)"/></svg>';

/* ================= wallet model (sample figures that add up) =================
   tx: [kind, amount, days ago (negative), place index, guests] */
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
var EV = [{ off: 3, seats: 12 }, { off: 9, seats: 4 }, { off: 16, seats: 20 }, { off: 27, seats: 9 }];
var EVPH = ['gallery', 'member-events', 'bar', 'events'];

/* ================= the door ================= */
(function buildDoor() {
  var bolts = $('.bolts');
  for (var i = 0; i < 12; i++) { var b = document.createElement('span'); b.className = 'bolt'; b.style.setProperty('--a', (i * 30 + 15) + 'deg'); b.style.setProperty('--i', i); bolts.appendChild(b); }
  var dep = $('.depth');
  for (var k = 1; k <= 9; k++) { var l = document.createElement('i'); l.style.transform = 'translateZ(' + (-k * 3.2) + 'px)'; dep.appendChild(l); }
  var svg = '';
  for (var x = 0; x < 100; x++) {
    var cls = x % 10 === 0 ? 'm10' : (x % 5 === 0 ? 'm5' : ''), len = x % 10 === 0 ? 11 : (x % 5 === 0 ? 8 : 5);
    svg += '<line class="' + cls + '" x1="100" y1="4" x2="100" y2="' + (4 + len) + '" transform="rotate(' + (x * 3.6) + ' 100 100)"/>';
    if (x % 10 === 0) svg += '<text x="100" y="27" transform="rotate(' + (x * 3.6) + ' 100 100)">' + x + '</text>';
  }
  $('#dialFace').innerHTML = svg;
})();

var rot = 0, dragging = false, prevA = 0, lastStep = 0, lockT = null, slots = [], busy = false;
function valueAt(r) { return ((Math.round(-r / 3.6) % 100) + 100) % 100; }
function pad(v) { return (v < 10 ? '0' : '') + v; }
function paintDial() {
  dial.style.setProperty('--rot', rot.toFixed(2) + 'deg');
  var v = valueAt(rot); dial.setAttribute('aria-valuenow', v);
  if (route.key === 'combo') { var cur = $$('.page:not(.leave) .slot')[slots.length]; if (cur) cur.textContent = pad(v); }
}
function angle(e) { var r = dial.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; }
function stepTo(r) { var s = Math.round(r / 3.6); if (s !== lastStep) { SFX.tick(); buzz(4); lastStep = s; } rot = r; paintDial(); }
// a little weight: the dial carries on briefly after you let go, then settles on a number
var vel = 0, lastT = 0, spinRaf = 0;
function settle() {
  cancelAnimationFrame(spinRaf);
  var target = Math.round((rot + vel * 8) / 3.6) * 3.6;
  (function ease() {
    var d = target - rot;
    if (Math.abs(d) < 0.05) { stepTo(target); if (route.key === 'combo' && !S.typing) lockT = setTimeout(setNumber, 460); return; }
    stepTo(rot + d * 0.18); spinRaf = requestAnimationFrame(ease);
  })();
}
dial.addEventListener('pointerdown', function (e) {
  if (busy || !(route.key === '' || route.key === 'combo')) return;
  audio(); dragging = true; prevA = angle(e); vel = 0; lastT = performance.now(); clearTimeout(lockT); cancelAnimationFrame(spinRaf);
  dial.setPointerCapture(e.pointerId);
});
dial.addEventListener('pointermove', function (e) {
  if (!dragging) return;
  var a = angle(e), d = a - prevA; if (d > 180) d -= 360; if (d < -180) d += 360; prevA = a;
  var now = performance.now(), dt = Math.max(1, now - lastT); lastT = now; vel = vel * 0.6 + (d / dt) * 16 * 0.4;
  stepTo(rot + d);
});
function release() { if (!dragging) return; dragging = false; vel = Math.max(-6, Math.min(6, vel)); settle(); }
dial.addEventListener('pointerup', release); dial.addEventListener('pointercancel', release);
dial.addEventListener('keydown', function (e) {
  if (busy) return; var k = e.key;
  if (k === 'ArrowRight' || k === 'ArrowUp') { e.preventDefault(); stepTo(rot - 3.6); }
  else if (k === 'ArrowLeft' || k === 'ArrowDown') { e.preventDefault(); stepTo(rot + 3.6); }
  else if ((k === 'Enter' || k === ' ') && route.key === 'combo') { e.preventDefault(); setNumber(); }
});
function setNumber() {
  if (route.key !== 'combo' || slots.length >= 3 || busy) return;
  var v = valueAt(rot), el = $$('.page:not(.leave) .slot'); if (!el.length) return;
  slots.push(v); el[slots.length - 1].textContent = pad(v); el[slots.length - 1].className = 'slot set';
  SFX.set(); buzz(14);
  if (slots.length < 3) { el[slots.length].className = 'slot cur'; el[slots.length].textContent = pad(v); } else unlock();
}

/* open: the bolts draw back, the seal breaks, the door swings, and we walk through into the pattern */
function unlock() {
  busy = true; S.authed = true; S.typing = false; save();
  app.classList.add('scene-combo'); app.classList.remove('scene-login');
  view.style.transition = 'opacity .5s'; view.style.opacity = '0';
  wait(380).then(function () { SFX.bolts(); buzz(30); app.classList.add('unbolted'); return wait(1150); })
  .then(function () { SFX.seal(); app.classList.add('cracked'); return wait(420); })
  .then(function () { SFX.swing(); app.classList.add('opening'); return wait(1550); })
  .then(function () { app.classList.add('through', 'inside'); return wait(1350); })
  .then(function () { view.style.opacity = ''; go('m', { replace: true, fade: true }); return wait(900); })
  .then(function () {
    app.classList.add('instant'); app.classList.remove('unbolted', 'cracked', 'opening', 'through'); slots = [];
    void app.offsetWidth; app.classList.remove('instant'); view.style.transition = ''; busy = false;
  });
}
/* close: step back out of the pattern, the door swings shut, the bolts go home */
function lockVault() {
  if (busy) return; closeSheet(); S.authed = false; save();
  app.classList.add('instant', 'unbolted', 'cracked', 'opening', 'through');
  go('', { replace: true, fade: true });
  busy = true;
  void app.offsetWidth; app.classList.remove('instant');
  requestAnimationFrame(function () { requestAnimationFrame(function () { app.classList.remove('through', 'inside'); }); });
  wait(1500).then(function () { app.classList.remove('opening'); SFX.swing(); return wait(2750); })
  .then(function () { app.classList.remove('cracked'); SFX.shut(); buzz(40); return wait(300); })
  .then(function () { app.classList.remove('unbolted'); return wait(700); })
  .then(function () { busy = false; toast(L().locked); });
}

/* ================= router ================= */
var route = { key: null }, depth = 0, scrolls = {};
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
  if (busy) { history.pushState({ i: ++depth }, '', '#/' + route.path); return; }
  closeSheet();
  var to = curPath();
  // Back out of the member area never shows a public page with the vault still open: it locks instead
  if (S.authed && route.key.indexOf('m') === 0 && to.indexOf('m') !== 0) { depth = i; history.pushState({ i: ++depth }, '', '#/' + route.path); lockVault(); return; }
  var dir = i < depth ? 'back' : 'fwd'; depth = i;
  render(dir);
});

var ROUTES = {};
function R(key, def) { ROUTES[key] = def; }
function resolve(path) {
  var p = path.split('/');
  if (p[0] === 'apply' && /^[1-5]$/.test(p[1] || '')) return { key: 'apply', step: Number(p[1]) };
  if (p[0] === 'apply' && p[1] === 'sent') return { key: 'sent' };
  if (p[0] === 'm' && p[1] === 'reserve' && /^\d$/.test(p[2] || '')) return { key: 'm/room', room: Number(p[2]) };
  if (ROUTES[path]) return { key: path };
  return { key: '' };
}

function render(dir, o) {
  o = o || {};
  var path = curPath(), r = resolve(path);
  if (r.key.indexOf('m') === 0 && !S.authed) { history.replaceState({ i: depth }, '', '#/'); r = { key: '' }; path = ''; }
  if (r.key === 'sent' && !S.sent) r = { key: 'apply', step: 1 };
  var def = ROUTES[r.key];
  var old = $('.page:not(.leave)', view);
  if (old && route.path != null) scrolls[route.path] = old.scrollTop;
  var first = route.key == null;
  r.path = path; route = r;

  app.classList.toggle('inside', def.scene === 'in' || app.classList.contains('through'));
  ['door', 'login', 'combo'].forEach(function (s) { app.classList.toggle('scene-' + s, def.scene === s); });
  app.classList.toggle('has-dock', def.scene === 'in');
  app.setAttribute('dir', fa() ? 'rtl' : 'ltr'); document.documentElement.lang = fa() ? 'fa' : 'en';
  dial.tabIndex = (def.scene === 'door' || def.scene === 'combo') ? 0 : -1;
  drawBar(def); drawDock();

  var pg = document.createElement('div');
  pg.className = 'page ' + (def.cls || '') + ' enter' + (o.fade || first ? ' fade' : (dir === 'back' ? ' back' : ''));
  pg.innerHTML = def.html(r);
  view.appendChild(pg);
  if (old) { old.classList.add('leave'); if (dir === 'back') old.classList.add('back'); if (o.fade) old.classList.add('fade'); setTimeout(function () { old.remove(); }, calm ? 0 : 340); }
  hydrate(pg);
  if (dir === 'back' && scrolls[path]) pg.scrollTop = scrolls[path];
  if (r.key === 'combo') slots = [];
  if (def.after) def.after(pg, r);
}
function rerender() {   // same page, fresh content (errors, toggles): no animation, scroll kept
  var pg = $('.page:not(.leave)', view); if (!pg) return; var top = pg.scrollTop;
  var def = ROUTES[route.key]; pg.classList.remove('enter', 'fade', 'back'); pg.innerHTML = def.html(route); hydrate(pg); pg.scrollTop = top;
  $$('.rise', pg).forEach(function (x) { x.classList.remove('rise'); });
  if (def.after) def.after(pg, route);
}

/* ================= bar and dock ================= */
function drawBar(def) {
  var l = L(), monoTo = def.scene === 'in' ? 'm' : '';
  var mono = '<button type="button" class="mono" data-go="' + monoTo + '" aria-label="The Vault"><span class="mk"></span></button>';
  var left = def.back ? '<button type="button" class="back" data-act="back"><i></i><span>' + l.back + '</span></button>' : mono;
  var right = def.scene === 'in' ? '<button type="button" class="avatar" data-go="m/account" aria-label="' + l.accEy + '">AF</button>'
    : '<button type="button" class="ibtn" data-act="sound" aria-label="' + l.sound + '" aria-pressed="' + P.sound + '">' + I(P.sound ? 'sound' : 'mute') + '</button><button type="button" class="ibtn" data-act="lang">' + l.lang + '</button>';
  bar.innerHTML = '<div class="bar-l">' + left + '</div>' + (def.back ? '<div>' + mono + '</div>' : '') + '<div class="bar-r">' + right + '</div>';
}
var DOCK = [['m', 'home'], ['m/reserve', 'reserve'], ['m/events', 'events'], ['m/concierge', 'conc'], ['m/wallet', 'wallet']];
function drawDock() {
  var k = route.key === 'm/room' ? 'm/reserve' : route.key;
  dock.innerHTML = DOCK.map(function (d, i) { return '<button type="button" data-go="' + d[0] + '" data-replace="1"' + (k === d[0] ? ' aria-current="page"' : '') + '>' + I(d[1]) + '<span>' + L().dock[i] + '</span></button>'; }).join('');
}

/* ================= form plumbing: every keystroke is kept ================= */
function hydrate(root) {
  $$('[data-k]', root).forEach(function (el) { var v = get(el.getAttribute('data-k')); if (el.type === 'checkbox') el.checked = !!v; else if (v != null) el.value = v; });
  $$('[data-count]', root).forEach(countUpdate);
}
function countUpdate(el) { var c = $('[data-cnt="' + el.getAttribute('data-k') + '"]'); if (c) c.textContent = digits(el.value.length) + ' / ' + digits(el.getAttribute('maxlength')); }
function clearErr(key) { if (key && S.errs[key]) { delete S.errs[key]; save(); var f = $('.page:not(.leave) [data-f="' + key + '"]'); if (f) { f.classList.remove('bad'); var e = $('.err', f); if (e) e.remove(); } } }
view.addEventListener('input', function (e) {
  var el = e.target, k = el.getAttribute('data-k');
  if (el.hasAttribute('data-digits')) {
    el.value = el.value.replace(/\D/g, '');
    var max = Number(el.maxLength) || 1, sib = Array.prototype.slice.call(el.parentNode.querySelectorAll('input'));
    if (el.value.length > max && sib.indexOf(el) === 0) { var all = el.value; sib.forEach(function (s, i) { s.value = all.slice(i * max, (i + 1) * max); if (s.getAttribute('data-k')) set(s.getAttribute('data-k'), s.value); }); sib[sib.length - 1].focus(); return; }
    if (el.value.length >= max) { var nx = sib[sib.indexOf(el) + 1]; if (nx) nx.focus(); }
  }
  if (!k) return;
  set(k, el.type === 'checkbox' ? el.checked : el.value);
  clearErr(el.closest('[data-f]') && el.closest('[data-f]').getAttribute('data-f'));
  if (el.hasAttribute('data-count')) countUpdate(el);
});
view.addEventListener('keydown', function (e) {
  var el = e.target; if (e.key !== 'Backspace' || !el.hasAttribute || !el.hasAttribute('data-digits') || el.value) return;
  var sib = Array.prototype.slice.call(el.parentNode.querySelectorAll('input')), p = sib[sib.indexOf(el) - 1]; if (p) { e.preventDefault(); p.focus(); p.value = ''; if (p.getAttribute('data-k')) set(p.getAttribute('data-k'), ''); }
});
view.addEventListener('change', function (e) { var el = e.target, k = el.getAttribute('data-k'); if (k && el.tagName === 'SELECT') { set(k, el.value); clearErr(el.closest('[data-f]') && el.closest('[data-f]').getAttribute('data-f')); } });

function err(key) { var m = S.errs[key]; return m ? '<p class="err" role="alert">' + L().e[m] + '</p>' : ''; }
function fld(key, label, inner, req) { return '<div class="f' + (S.errs[key] ? ' bad' : '') + '" data-f="' + key + '"><label class="lab"><span>' + label + (req ? ' <em>*</em>' : '') + '</span>' + (inner.cnt || '') + '</label>' + inner.html + err(key) + '</div>'; }
function input(key, path, label, attrs, req) { return fld(key, label, { html: '<input class="in" data-k="' + path + '" ' + (attrs || '') + '>' }, req); }
function area(key, path, label, ph, req) { return fld(key, label, { html: '<textarea class="in" data-k="' + path + '" data-count maxlength="600" placeholder="' + esc(ph) + '"></textarea>', cnt: '<span class="cnt" data-cnt="' + path + '"></span>' }, req); }
function chips(key, path, list, multi, req, label) {
  var cur = get(path);
  var h = '<div class="chips" role="group">' + list.map(function (c, i) {
    var on = multi ? !!(cur && cur[i]) : (cur != null && String(cur) === String(i));
    return '<button type="button" class="chip" data-chip="' + path + '" data-v="' + i + '"' + (multi ? ' data-multi="1"' : '') + ' data-e="' + key + '" aria-pressed="' + on + '">' + esc(c) + '</button>';
  }).join('') + '</div>';
  return label ? fld(key, label, { html: h }, req) : h;
}
function ccSelect(path) { return '<select class="in" data-k="' + path + '" aria-label="Country code">' + COUNTRIES.map(function (c, i) { return '<option value="' + i + '">' + (fa() ? c[1] : c[0]) + '  ⁦' + c[2] + '⁩</option>'; }).join('') + '</select>'; }
function phone(key, ccPath, numPath, label, req) { return fld(key, label, { html: '<div class="phone">' + ccSelect(ccPath) + '<input class="in" type="tel" inputmode="tel" autocomplete="tel-national" dir="ltr" placeholder="0912 345 6789" data-k="' + numPath + '"></div>' }, req); }
function showErrors() {
  var first = $('.page:not(.leave) .f.bad'); if (!first) return;
  first.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
  $$('.page:not(.leave) .f.bad').forEach(function (f) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); });
  buzz(20);
  var inp = $('input,textarea,select', first); if (inp && inp.type !== 'checkbox') setTimeout(function () { inp.focus({ preventScroll: true }); }, 380);
}
var digitsOnly = function (s) { return String(s || '').replace(/[۰-۹]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); }).replace(/\D/g, ''); };
function img(name, alt) { return '<img src="../assets/photos/' + name + '.jpg" alt="' + esc(alt || '') + '" loading="lazy" decoding="async">'; }

/* ================= pages: the door ================= */
R('', { scene: 'door', cls: 'door-page', html: function () {
  var l = L();
  return '<div class="door-copy rise"><p class="eyb">' + l.eyebrow + '</p><h1 class="h1">' + l.title + '</h1><p class="ornament">' + l.spin + '</p></div>' +
    '<div class="btns rise"><button type="button" class="btn gold" data-go="login">' + l.members + '</button><button type="button" class="btn line" data-go="apply/1">' + l.request + '</button><button type="button" class="btn ghost" data-go="house">' + l.explore + '</button></div>';
} });

R('login', { scene: 'login', back: true, cls: 'door-page login', html: function () {
  var l = L(), m = S.login.mode;
  var h = '<div class="head center rise"><h1 class="h2">' + l.loginTitle + '</h1><p class="p">' + l.loginBody + '</p></div>' +
    '<div class="seg" role="tablist"><button type="button" role="tab" data-act="lmode" data-v="0" aria-pressed="' + (m === 0) + '">' + l.byCode + '</button><button type="button" role="tab" data-act="lmode" data-v="1" aria-pressed="' + (m === 1) + '">' + l.byPass + '</button></div>';
  if (m === 0) h += '<div class="fields">' + phone('lphone', 'login.cc', 'login.phone', l.mobile, true) + '</div><button type="button" class="btn gold" data-act="sendCombo">' + l.send + '</button>';
  else h += '<div class="fields">' + input('luser', 'login.user', l.user, 'autocomplete="username" autocapitalize="off" spellcheck="false" dir="ltr"', true) +
    fld('lpass', l.pass, { html: '<div class="pw"><input class="in" type="' + (S.login.show ? 'text' : 'password') + '" autocomplete="current-password" dir="ltr" data-k="login.pass"><button type="button" data-act="showpw">' + (S.login.show ? l.hide : l.show) + '</button></div>' }, true) +
    '</div><button type="button" class="btn gold" data-act="passLogin">' + l.enter + '</button><div class="links"><button type="button" class="link" data-go="forgot">' + l.forgot + '</button></div>';
  return h;
} });

R('combo', { scene: 'combo', back: true, cls: 'door-page', html: function () {
  var l = L();
  return '<div class="head center"><p class="eyb">' + l.comboEy + '</p></div>' +
    (S.typing ? '<div class="grid3" dir="ltr">' + [1, 2, 3].map(function (i) { return '<input class="in" data-digits inputmode="numeric" maxlength="2"' + (i === 1 ? ' autocomplete="one-time-code"' : '') + ' aria-label="' + i + '" style="text-align:center;font-size:22px;height:58px">'; }).join('') + '</div><button type="button" class="btn gold" data-act="typedOpen">' + l.open + '</button>'
      : '<div class="slots" dir="ltr" aria-live="polite"><span class="slot cur">' + pad(valueAt(rot)) + '</span><span class="slot"></span><span class="slot"></span></div><p class="p center">' + l.comboBody + '</p>' + (FREE ? '<button type="button" class="btn gold" data-act="typedOpen">' + l.open + '</button>' : '')) +
    '<div class="links"><button type="button" class="link" data-act="typing">' + (S.typing ? l.useDial : l.typeInstead) + '</button><button type="button" class="link" data-act="back">' + l.changeNum + '</button></div>';
}, after: function () { if (!S.typing) setTimeout(function () { dial.focus({ preventScroll: true }); }, 350); } });

R('forgot', { scene: 'flat', back: true, html: function () {
  var l = L(), st = S.fp.step;
  var h = '<div class="head rise"><p class="eyb">' + l.loginTitle + '</p><h1 class="h1">' + l.forgotTitle + '</h1><p class="p">' + l.forgotBody + '</p></div><div class="fields">';
  h += phone('fphone', 'fp.cc', 'fp.phone', l.mobile, true);
  if (st >= 1) {
    var w = Math.max(0, Math.ceil(((S.fp.until || 0) - Date.now()) / 1000));
    h += fld('fcode', l.codeLab, { html: '<div class="otp" dir="ltr">' + [0, 1, 2, 3].map(function (i) { return '<input class="in" data-digits inputmode="numeric" maxlength="1" ' + (i === 0 ? 'autocomplete="one-time-code" ' : '') + 'data-k="fp.c' + i + '" aria-label="' + (i + 1) + '">'; }).join('') + '</div>' }, true) +
      '<div><button type="button" class="link" data-act="resend"' + (w ? ' disabled style="opacity:.5;text-decoration:none"' : '') + ' aria-live="polite">' + (w ? l.resendIn + ' ' + digits(w) + ' ' + l.sec : l.resend) + '</button></div>' +
      fld('fp1', l.newPass, { html: '<input class="in" type="password" autocomplete="new-password" dir="ltr" data-k="fp.p1">' }, true) +
      fld('fp2', l.newPass2, { html: '<input class="in" type="password" autocomplete="new-password" dir="ltr" data-k="fp.p2">' }, true);
  }
  return h + '</div><button type="button" class="btn gold" data-act="' + (st ? 'setPass' : 'sendReset') + '">' + (st ? l.setPass : l.sendCode) + '</button>';
}, after: function () {
  clearTimeout(window._fpT);
  if (S.fp.step && S.fp.until > Date.now()) window._fpT = setTimeout(function () { if (route.key === 'forgot') { var b = $('.page:not(.leave) [data-act=resend]'); var w = Math.max(0, Math.ceil((S.fp.until - Date.now()) / 1000)); if (b) { b.textContent = w ? L().resendIn + ' ' + digits(w) + ' ' + L().sec : L().resend; if (!w) { b.disabled = false; b.removeAttribute('style'); } } ROUTES.forgot.after(); } }, 1000);
} });

/* ================= pages: the house (public) ================= */
R('house', { scene: 'flat', back: true, html: function () {
  var l = L();
  return '<div class="head rise"><p class="eyb">' + l.houseEy + '</p><h1 class="h1">' + l.houseTitle + '</h1><p class="p">' + l.houseBody + '</p></div>' +
    '<div class="arch">' + img('room-vault', '') + '</div>' +
    '<div class="sec"><h2 class="h2">' + l.roomsT + '</h2><div class="hscroll">' + l.rooms.map(function (r) { return '<div class="roomc"><div class="arch">' + img(r[2], r[0]) + '</div><b>' + r[0] + '</b><i>' + r[1] + '</i></div>'; }).join('') + '</div></div>' +
    '<div class="sec"><h2 class="h2">' + l.calT + '</h2><div class="list">' + l.events.slice(0, 3).map(function (e, i) { var d = dayOf(EV[i].off); return '<div class="row"><span class="k num">' + dfmt(d, { day: 'numeric' }) + '<small>' + dfmt(d, { month: 'short' }) + '</small></span><span class="grow"><b>' + e[0] + '</b><i>' + e[1] + '</i></span></div>'; }).join('') + '</div><p class="small">' + l.calNote + '</p></div>' +
    '<div class="sec"><h2 class="h2">' + l.memT + '</h2><ol class="steps4">' + l.memSteps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div>' +
    '<div class="btns"><button type="button" class="btn gold" data-go="apply/1">' + l.request + '</button><button type="button" class="btn line" data-go="login">' + l.members + '</button><button type="button" class="btn ghost" data-go="rules">' + l.rulesT + '</button></div>';
} });
function rulesHTML() { var l = L(); return '<div class="head rise"><p class="eyb">' + l.houseEy + '</p><h1 class="h1">' + l.rulesT + '</h1><p class="p">' + l.rulesBody + '</p></div><div class="list">' + l.rules.map(function (r, i) { return '<div class="row"><span class="k num">' + ['I', 'II', 'III', 'IV', 'V', 'VI'][i] + '</span><span class="grow"><b>' + r[0] + '</b><i>' + r[1] + '</i></span></div>'; }).join('') + '</div>'; }
R('rules', { scene: 'flat', back: true, html: rulesHTML });
R('m/rules', { scene: 'in', back: true, html: rulesHTML });

/* ================= pages: membership request ================= */
var ROMAN = ['I', 'II', 'III', 'IV', 'V'];
function validate(step) {
  if (FREE) return {};
  var f = S.form, e = {}, req = function (k) { if (!String(f[k] || '').trim()) e[k] = 'req'; };
  if (step === 1) {
    req('first'); req('last'); req('country'); req('city');
    if (digitsOnly(f.phone).length < 10) e.phone = 'phone';
    if (f.gender == null) e.gender = 'req';
    if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = 'email';
    if (f.dd || f.yy || (f.mm != null && f.mm !== '')) { var dd = Number(digitsOnly(f.dd)), yy = Number(digitsOnly(f.yy)); if (!(dd >= 1 && dd <= 31) || !(yy >= 1300 && yy <= 2015) || f.mm == null || f.mm === '') e.dob = 'date'; }
  }
  if (step === 2) { req('position'); if (!Object.keys(f.fields || {}).some(function (k) { return f.fields[k]; })) e.fields = 'one'; }
  if (step === 3) {
    if (String(f.intro || '').trim().length < 20) e.intro = f.intro ? 'short' : 'req';
    if (String(f.reason || '').trim().length < 20) e.reason = f.reason ? 'short' : 'req';
    if (!Object.keys(f.interests || {}).some(function (k) { return f.interests[k]; })) e.interests = 'one';
  }
  if (step === 4) { if (f.refPhone && digitsOnly(f.refPhone).length < 10) e.refPhone = 'phone'; }
  if (step === 5) { if (!f.agree1) e.agree1 = 'agree'; if (!f.agree2) e.agree2 = 'agree'; }
  return e;
}
var nErr = function (s) { return Object.keys(validate(s)).length; };
R('apply', { scene: 'flat', back: true, html: function (r) {
  var l = L(), s = r.step, st = l.steps[s - 1];
  var tum = '<div class="tumblers">' + ROMAN.map(function (x, i) {
    var k = i + 1, cls = k === s ? 'cur' : (S.done[k] ? (k < 5 && nErr(k) ? 'bad' : 'done') : '');
    return '<button type="button" class="tum ' + cls + '" data-go="apply/' + k + '" data-replace="1" aria-label="' + l.steps[i][0] + '"' + (k === s ? ' aria-current="step"' : '') + '>' + x + '</button>';
  }).join('') + '</div>';
  var h = '<div class="head rise"><p class="eyb">' + l.reqEy + ' · ' + fill(l.stepOf, digits(s)) + '</p><h1 class="h1">' + st[0] + '</h1><p class="p">' + st[1] + '</p></div>' + tum + '<div class="fields">';
  if (s === 1) h += '<div class="grid2">' + input('first', 'form.first', l.first, 'autocomplete="given-name"', true) + input('last', 'form.last', l.last, 'autocomplete="family-name"', true) + '</div>' +
    phone('phone', 'form.cc', 'form.phone', l.mobile, true) + input('email', 'form.email', l.email, 'type="email" inputmode="email" autocomplete="email" dir="ltr" autocapitalize="off"') +
    chips('gender', 'form.gender', l.genders, false, true, l.gender) +
    '<div class="grid2">' + input('country', 'form.country', l.country, 'autocomplete="country-name"', true) + input('city', 'form.city', l.city, 'autocomplete="address-level2"', true) + '</div>' +
    fld('dob', l.dob, { html: '<div class="grid3"><input class="in" inputmode="numeric" maxlength="2" placeholder="' + l.day + '" aria-label="' + l.day + '" autocomplete="bday-day" data-k="form.dd" style="text-align:center"><select class="in" data-k="form.mm" aria-label="' + l.month + '"><option value="">' + l.month + '</option>' + l.months.map(function (m, i) { return '<option value="' + i + '">' + m + '</option>'; }).join('') + '</select><input class="in" inputmode="numeric" maxlength="4" placeholder="' + l.year + '" aria-label="' + l.year + '" autocomplete="bday-year" data-k="form.yy" style="text-align:center"></div>' });
  if (s === 2) h += input('website', 'form.website', l.website, 'type="url" dir="ltr" autocapitalize="off" spellcheck="false" placeholder="https://"') +
    input('insta', 'form.insta', l.insta, 'dir="ltr" autocapitalize="off" spellcheck="false" placeholder="@username"') + input('linkedin', 'form.linkedin', l.linkedin, 'type="url" dir="ltr" autocapitalize="off" spellcheck="false" placeholder="linkedin.com/in/…"') +
    chips('fields', 'form.fields', l.fields, true, true, l.field) + input('position', 'form.position', l.position, 'autocomplete="organization-title" placeholder="' + esc(l.positionPh) + '"', true);
  if (s === 3) h += area('intro', 'form.intro', l.intro, l.introPh, true) + area('reason', 'form.reason', l.reason, l.reasonPh, true) + chips('interests', 'form.interests', l.interestList, true, true, l.interests);
  if (s === 4) h += input('refName', 'form.refName', l.refName, 'autocomplete="off"') + fld('refPhone', l.refPhone, { html: '<input class="in" type="tel" inputmode="tel" dir="ltr" placeholder="0912 345 6789" data-k="form.refPhone">' }) + chips('rel', 'form.rel', l.rels, false, false, l.rel);
  if (s === 5) h += reviewHTML() + '<div class="f' + (S.errs.agree1 ? ' bad' : '') + '" data-f="agree1"><label class="check"><input type="checkbox" data-k="form.agree1"><span>' + l.agree1 + '</span></label>' + err('agree1') + '</div>' +
    '<button type="button" class="link" data-go="rules" style="align-self:flex-start">' + l.readRules + '</button>' +
    '<div class="f' + (S.errs.agree2 ? ' bad' : '') + '" data-f="agree2"><label class="check"><input type="checkbox" data-k="form.agree2"><span>' + l.agree2 + '</span></label>' + err('agree2') + '</div>';
  return h + '</div><div class="cta-bar"><button type="button" class="btn gold" data-act="stepNext">' + (s === 5 ? l.submit : (S.reviewing ? l.toReview : l.next)) + '</button><p class="saved">' + l.saved + '</p></div>';
} });
function reviewHTML() {
  var l = L(), f = S.form, v = function (x) { return x == null || String(x).trim() === '' ? '—' : esc(x); }, sep = fa() ? '، ' : ', ';
  var pick = function (list, i) { return i == null || i === '' ? '—' : list[i]; };
  var multi = function (list, o) { var a = Object.keys(o || {}).filter(function (k) { return o[k]; }).map(function (k) { return list[k]; }); return a.length ? a.join(sep) : '—'; };
  var sec = function (k, rows) {
    return '<div class="panel"><div class="sech"><h3 class="h3">' + ROMAN[k - 1] + ' · ' + l.steps[k - 1][0] + '</h3><button type="button" class="more" data-act="editStep" data-v="' + k + '">' + l.edit + '</button></div><div class="review">' +
      rows.map(function (r) { return '<div class="rv' + (r[2] ? ' miss' : '') + '"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>'; }).join('') + '</div>' + (nErr(k) ? '<p class="err" style="margin-top:10px">' + l.fixFirst + '</p>' : '') + '</div>';
  };
  var e1 = validate(1), e2 = validate(2), e3 = validate(3);
  return sec(1, [[l.first, v([f.first, f.last].filter(Boolean).join(' ')), e1.first || e1.last], [l.mobile, f.phone ? '<span dir="ltr">' + COUNTRIES[f.cc || 0][2] + ' ' + esc(f.phone) + '</span>' : '—', e1.phone], [l.email, v(f.email), e1.email], [l.gender, pick(l.genders, f.gender), e1.gender], [l.city, v([f.city, f.country].filter(Boolean).join(sep)), e1.city || e1.country]]) +
    sec(2, [[l.position, v(f.position), e2.position], [l.field, multi(l.fields, f.fields), e2.fields], [l.insta, v(f.insta)]]) +
    sec(3, [[l.intro, f.intro ? esc(f.intro.slice(0, 90)) + (f.intro.length > 90 ? '…' : '') : '—', e3.intro], [l.reason, f.reason ? esc(f.reason.slice(0, 90)) + (f.reason.length > 90 ? '…' : '') : '—', e3.reason], [l.interests, multi(l.interestList, f.interests), e3.interests]]) +
    sec(4, [[l.refName, v(f.refName)], [l.rel, pick(l.rels, f.rel)]]);
}
function stepNext() {
  var s = route.step, e = validate(s);
  S.done[s] = true; S.errs = e; save();
  if (Object.keys(e).length) { rerender(); showErrors(); return; }
  if (s < 5) { buzz(10); SFX.set(); var to = S.reviewing ? 5 : s + 1; if (to === 5) S.reviewing = false; save(); go('apply/' + to); return; }
  for (var i = 1; i <= 4; i++) { var ei = validate(i); if (Object.keys(ei).length) { S.done[i] = true; S.errs = ei; save(); go('apply/' + i); setTimeout(showErrors, 500); toast(L().fixFirst); return; } }
  S.sent = { ref: 'TV-' + String(Date.now()).slice(-6) }; S.reviewing = false; save();
  SFX.seal(); buzz(30);
  go('apply/sent', { replace: true, fade: true });
}
R('sent', { scene: 'flat', html: function () {
  var l = L();
  return '<div class="envelope"><div class="addr">THE VAULT</div><div class="wax"><span class="mk"></span></div></div>' +
    '<div class="head center rise"><p class="eyb">' + l.sentEy + '</p><h1 class="h1">' + l.sentTitle + '</h1><p class="p">' + l.sentBody + '</p></div>' +
    '<div class="panel center"><p class="eyb">' + l.ref + '</p><p class="h2 num" dir="ltr" style="margin-top:6px">' + digits(S.sent.ref) + '</p></div>' +
    '<button type="button" class="btn gold" data-act="toDoor">' + l.toDoor + '</button>';
} });

/* ================= pages: inside the vault ================= */
function greeting() { var h = new Date().getHours(), l = L(); return h < 12 ? l.morning : (h < 18 ? l.afternoon : l.evening); }
function qr() {   // a believable QR face; not a real code
  var N = 21, cells = '', rnd = function (i) { var x = Math.sin(i * 99.13 + 7) * 43758.5; return x - Math.floor(x); };
  var fin = function (x, y) { return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#111"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#ECE5D6"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#111"/>'; };
  for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { var inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12); if (!inF && rnd(y * N + x) > 0.52) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="#111"/>'; }
  return '<svg viewBox="0 0 21 21" shape-rendering="crispEdges">' + cells + fin(0, 0) + fin(14, 0) + fin(0, 14) + '</svg>';
}
function resLine(r) { return L().rooms[r.room][0] + ' · ' + dfmt(dayOf(r.day), { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + digits(r.time); }
function party(k) { return k > 1 ? fill(L().people, digits(k)) : L().person; }
R('m', { scene: 'in', html: function () {
  var l = L(), w = wallet(), nx = S.res[0], ev = l.events[0], d0 = dayOf(EV[0].off), used = Math.min(100, w.debt / W.limit * 100);
  return '<div class="head rise"><p class="eyb">' + l.memberNo + '</p><h1 class="h1">' + greeting() + '</h1></div>' +
    '<div class="rise"><div class="card-stage"><div class="card" id="card" role="button" tabindex="0" aria-label="' + l.cardBackT + '">' +
      '<div class="cside"><div class="cpat"></div><div class="chipm"><span class="mk"></span></div><div class="cword">THE VAULT</div><div class="cmeta" dir="ltr"><span>ARASH FARAHANI</span><span>Nº 001</span></div><div class="glare"></div></div>' +
      '<div class="cside backside"><div class="cpat"></div><div class="qr">' + qr() + '</div><div class="backtext"><b>' + l.cardBackT + '</b><i>' + l.cardBackD + '</i></div></div>' +
    '</div></div><p class="fliphint">' + l.cardHint + '</p></div>' +
    '<button type="button" class="panel wstrip' + (S.hide ? ' hide' : '') + '" data-go="m/wallet"><span class="top"><span><span class="eyb">' + l.avail + '</span><br><span class="amt num">' + money(w.avail) + '</span> <span class="unit">' + l.unit + '</span></span><span class="chev"></span></span>' +
      '<span class="meter debt" style="--w:' + used + '%"><i></i></span><span class="ends"><span>' + l.owed + ' ' + money(w.debt) + '</span><span>' + fill(l.ofLimit, money(W.limit)) + '</span></span></button>' +
    '<div class="sec"><p class="eyb">' + l.nextVisit + '</p>' + (nx ? '<button type="button" class="panel row" data-go="m/reserve" style="padding:16px 18px"><span class="grow"><b>' + resLine(nx) + '</b><i>' + party(nx.party) + '</i></span><span class="chev"></span></button>' : '<button type="button" class="empty" data-go="m/reserve" style="width:100%">' + l.nothing + ' — ' + l.chooseRoom + '</button>') + '</div>' +
    '<div class="boxes">' + l.boxes.map(function (b, i) { return '<button type="button" class="box" data-go="' + ['m/reserve', 'm/events', 'm/concierge', 'm/wallet'][i] + '"><span class="plate">Nº 0' + (i + 1) + '</span>' + KEYHOLE + '<span><b>' + b[0] + '</b><i>' + b[1] + '</i></span></button>'; }).join('') + '</div>' +
    '<div class="sec"><p class="eyb">' + l.tonight + '</p><button type="button" class="panel row" data-act="event" data-v="0" style="padding:16px 18px"><span class="k num">' + dfmt(d0, { day: 'numeric' }) + '<small>' + dfmt(d0, { month: 'short' }) + '</small></span><span class="grow"><b>' + ev[0] + '</b><i>' + ev[1] + ' · ' + ev[2] + '</i></span><span class="chev"></span></button></div>';
}, after: function () { cardTilt(); } });

R('m/reserve', { scene: 'in', html: function () {
  var l = L();
  var mine = S.res.length ? '<div class="sec"><p class="eyb">' + l.yourRes + '</p><div class="panel list" style="padding:0 18px">' + S.res.map(function (r, i) { return '<div class="row"><span class="grow"><b>' + resLine(r) + '</b><i>' + party(r.party) + '</i></span><button type="button" class="more" data-act="cancelRes" data-v="' + i + '">' + l.cancel + '</button></div>'; }).join('') + '</div></div>' : '';
  return '<div class="head rise"><p class="eyb">' + l.reserveEy + '</p><h1 class="h1">' + l.reserveTitle + '</h1></div>' + mine +
    '<div class="list">' + l.rooms.map(function (r, i) { return '<button type="button" class="row" data-go="m/reserve/' + i + '"><img class="thumb" src="../assets/photos/' + r[2] + '.jpg" alt="" loading="lazy" decoding="async"><span class="grow"><b>' + r[0] + '</b><i>' + r[1] + '</i></span><span class="chev"></span></button>'; }).join('') + '</div>';
} });
var TIMES = ['12:30', '14:00', '19:30', '20:30', '21:30', '22:30'];
function rf(i) { if (!S.rf[i]) S.rf[i] = { day: 0, time: null, party: 2, guests: '', note: '' }; return S.rf[i]; }
var isFull = function (day, ti, room) { return (day * 7 + ti * 3 + room) % 5 === 0; };
R('m/room', { scene: 'in', back: true, html: function (r) {
  var l = L(), room = l.rooms[r.room], f = rf(r.room);
  var days = '<div class="days" role="group">' + Array.apply(null, Array(10)).map(function (_, i) { var d = dayOf(i); return '<button type="button" class="day" data-act="rday" data-v="' + i + '" aria-pressed="' + (f.day === i) + '"><span>' + dfmt(d, { weekday: 'short' }) + '</span><b class="num">' + dfmt(d, { day: 'numeric' }) + '</b></button>'; }).join('') + '</div>';
  var times = '<div class="chips">' + TIMES.map(function (t, i) { var full = isFull(f.day, i, r.room); return '<button type="button" class="chip" data-act="rtime" data-v="' + i + '" aria-pressed="' + (f.time === i) + '"' + (full ? ' disabled aria-label="' + t + ' · ' + l.full + '"' : '') + '>' + digits(t) + '</button>'; }).join('') + '</div>';
  return '<div class="arch" style="aspect-ratio:4/3.3">' + img(room[2], room[0]) + '</div>' +
    '<div class="head rise"><p class="eyb">' + l.reserveEy + '</p><h1 class="h1">' + room[0] + '</h1><p class="p">' + room[1] + '</p></div>' +
    '<div class="fields"><div class="f"><span class="lab">' + l.when + '</span>' + days + '</div>' +
    '<div class="f' + (S.errs.rtime ? ' bad' : '') + '" data-f="rtime"><span class="lab">' + l.time + '</span>' + times + err('rtime') + '</div>' +
    '<div class="f"><span class="lab">' + l.party + '</span><div class="stepper"><button type="button" data-act="party" data-v="-1" aria-label="−">−</button><output class="num">' + digits(f.party) + '</output><button type="button" data-act="party" data-v="1" aria-label="+">+</button></div></div>' +
    (f.party > 1 ? '<div class="f"><label class="lab">' + l.guestNames + '</label><textarea class="in" style="min-height:90px" placeholder="' + l.guestPh + '" data-k="rf.' + r.room + '.guests"></textarea></div>' : '') +
    '<div class="f"><label class="lab">' + l.noteLab + '</label><input class="in" placeholder="' + esc(l.notePh) + '" data-k="rf.' + r.room + '.note"></div></div>' +
    '<div class="cta-bar"><button type="button" class="btn gold" data-act="hold">' + l.hold + '</button></div>';
} });

R('m/events', { scene: 'in', html: function () {
  var l = L();
  return '<div class="head rise"><p class="eyb">' + l.eventsEy + '</p><h1 class="h1">' + l.eventsTitle + '</h1></div><div class="list">' +
    l.events.map(function (e, i) { var d = dayOf(EV[i].off), on = !!S.rsvp[i]; return '<button type="button" class="row" data-act="event" data-v="' + i + '"><span class="k num">' + dfmt(d, { day: 'numeric' }) + '<small>' + dfmt(d, { month: 'short' }) + '</small></span><span class="grow"><b>' + e[0] + '</b><i>' + e[1] + ' · ' + e[2] + ' · ' + fill(l.seats, digits(seatsLeft(i))) + '</i></span>' + (on ? '<span class="pill ok">' + l.going + '</span>' : '<span class="chev"></span>') + '</button>'; }).join('') + '</div>';
} });
function seatsLeft(i) { return EV[i].seats - (S.rsvp[i] ? 1 + (S.bring[i] || 0) : 0); }

function concList() { if (!S.conc) { S.conc = L().seedConc.map(function (c, i) { return { st: c[2], seed: i }; }); save(); } return S.conc; }
R('m/concierge', { scene: 'in', html: function () {
  var l = L(), list = concList();
  var hist = '<div class="sec"><p class="eyb">' + l.yourReq + '</p><div class="list">' + list.map(function (c, i) {
    var topic = c.seed != null ? l.seedConc[c.seed][0] : l.topics[c.topicI], text = c.seed != null ? l.seedConc[c.seed][1] : c.text;
    return '<button type="button" class="row" data-act="concItem" data-v="' + i + '"><span class="grow"><b>' + esc(topic) + '</b><i>' + esc(String(text).slice(0, 70)) + '</i></span><span class="pill' + (c.st === 2 ? ' ok' : '') + '">' + l.st[c.st] + '</span></button>';
  }).join('') + '</div></div>';
  return '<div class="head rise"><p class="eyb">' + l.concEy + '</p><h1 class="h1">' + l.concTitle + '</h1><p class="p">' + l.concBody + '</p></div>' +
    '<div class="fields"><div class="f"><span class="lab">' + l.about + '</span>' + chips('ctopic', 'cf.topic', l.topics, false) + '</div>' +
    fld('ctext', l.tell, { html: '<textarea class="in" data-k="cf.text" placeholder="' + esc(l.tellPh) + '"></textarea>' }, true) +
    '<div class="f"><span class="lab">' + l.soon + '</span>' + chips('cwhen', 'cf.when', l.whens, false) + '</div>' +
    '<button type="button" class="btn gold" data-act="sendConc">' + l.sendC + '</button></div>' + hist;
} });

R('m/wallet', { scene: 'in', html: function () {
  var l = L(), w = wallet(), used = Math.min(100, w.debt / W.limit * 100), atLimit = w.debt >= W.limit;
  var feeD = dayOf(W.feeDay), renew = new Date(feeD.getTime() + 365 * DAY), f = S.filt, rows = '';
  if (f !== 1) rows += S.pend.map(function (p) { return '<div class="tx"><span class="dot">' + I('in') + '</span><span class="grow"><b>' + l.txTop + '</b><i>' + dfmt(new Date(p.at), { day: 'numeric', month: 'short' }) + ' · ' + l.methods[p.m] + '</i></span><span class="a"><span class="num">+' + money(p.amt) + '</span><small>' + l.pending + '</small></span></div>'; }).join('');
  rows += W.tx.map(function (t, i) { return { t: t, i: i }; }).filter(function (x) { return f === 0 || (f === 1 ? x.t[0] === 'spend' : x.t[0] === 'top'); }).map(function (x) {
    var t = x.t, top = t[0] === 'top';
    return '<button type="button" class="tx" data-act="tx" data-v="' + x.i + '"><span class="dot">' + I(top ? 'in' : 'out') + '</span><span class="grow"><b>' + (top ? l.txTop : l.places[t[3]]) + '</b><i>' + dfmt(dayOf(t[2]), { weekday: 'short', day: 'numeric', month: 'short' }) + (top ? '' : ' · ' + party(t[4] + 1)) + '</i></span><span class="a num' + (top ? ' plus' : '') + '">' + (top ? '+' : '−') + money(t[1]) + '</span></button>';
  }).join('');
  if (f !== 1) rows += '<div class="tx"><span class="dot">' + I('wallet') + '</span><span class="grow"><b>' + l.txFee + '</b><i>' + dfmt(feeD, { day: 'numeric', month: 'short', year: 'numeric' }) + '</i></span><span class="a num">' + money(W.fee) + '</span></div>';
  var maxBy = Math.max.apply(null, w.by);
  return '<div class="' + (S.hide ? 'hide' : '') + '" style="display:flex;flex-direction:column;gap:22px">' +
    '<div class="wallet-hero rise"><p class="eyb">' + l.walletEy + ' · ' + l.balanceNow + '</p><div class="amt num' + (w.bal < 0 ? ' neg' : '') + '">' + (w.bal < 0 ? '−' : '') + money(w.bal) + '</div><span class="unit">' + l.unit + ' · ' + (w.bal < 0 ? l.inDebt : l.inCredit) + '</span>' +
      '<button type="button" class="eye" data-act="eye">' + I(S.hide ? 'eye' : 'eyeoff') + (S.hide ? l.eyeShow : l.eyeHide) + '</button></div>' +
    '<div class="grid2"><button type="button" class="btn gold" data-act="topup">' + l.topup + '</button><button type="button" class="btn line" data-act="statement">' + l.statementB + '</button></div>' +
    '<div class="panel credit"><div class="sech"><h3 class="h3">' + l.creditT + '</h3><span class="pill' + (atLimit ? ' warn' : ' ok') + '">' + l.availS + ' ' + money(w.avail) + '</span></div>' +
      '<div class="meter debt" style="--w:' + used + '%"><i></i></div><div class="ends"><span>' + l.used + ' ' + money(w.debt) + '</span><span>' + l.limit + ' ' + money(W.limit) + '</span></div>' +
      '<p class="note' + (atLimit ? ' warn' : '') + '">' + (atLimit ? l.creditStop : l.creditNote) + '</p></div>' +
    '<div class="sec"><p class="eyb">' + l.statsT + '</p><div class="stats">' +
      [[l.fee, W.fee], [l.topped, w.top], [l.spent, w.spent], [l.remain, w.remain], [l.debt, w.debt, w.debt > 0], [l.availS, w.avail]].map(function (s) { return '<div class="stat"><span>' + s[0] + '</span><b class="num' + (s[2] ? ' neg' : '') + '">' + money(s[1]) + '</b></div>'; }).join('') +
    '</div><p class="small">' + fill(l.feeNote, n(W.fee) + ' ' + l.unit, dfmt(feeD, { day: 'numeric', month: 'long', year: 'numeric' }), dfmt(renew, { day: 'numeric', month: 'long', year: 'numeric' })) + '</p></div>' +
    '<div class="sec"><p class="eyb">' + l.byPlace + '</p><div class="bars">' + w.by.map(function (v, i) { return '<div class="barrow"><span>' + l.places[i] + '</span><span class="num">' + money(v) + '</span><span class="meter" style="--w:' + (v / maxBy * 100) + '%"><i></i></span></div>'; }).join('') + '</div></div>' +
    '<div class="sec"><p class="eyb">' + l.activity + '</p><div class="seg three">' + l.filt.map(function (x, i) { return '<button type="button" data-act="filt" data-v="' + i + '" aria-pressed="' + (f === i) + '">' + x + '</button>'; }).join('') + '</div><div class="list">' + rows + '</div></div></div>';
} });

R('m/account', { scene: 'in', back: true, html: function () {
  var l = L();
  var sw = function (act, on, label, v) { return '<div class="row"><span class="grow"><b>' + label + '</b></span><button type="button" class="switch" role="switch" aria-checked="' + !!on + '" aria-label="' + esc(label) + '" data-act="' + act + '"' + (v != null ? ' data-v="' + v + '"' : '') + '></button></div>'; };
  return '<div class="panel rise" style="display:flex;gap:16px;align-items:center"><span class="avatar" style="width:58px;height:58px;font-size:20px;flex-shrink:0">AF</span><span><b style="font-weight:500;font-size:17px">Arash Farahani</b><br><span class="small">' + l.tier + ' · Nº ' + digits('001') + '</span><br><span class="small">' + fill(l.since, dfmt(dayOf(-420), { month: 'long', year: 'numeric' })) + '</span></span></div>' +
    '<div class="sec"><p class="eyb">' + l.guestsH + '</p><div class="list">' + (S.guests.length ? S.guests.map(function (g, i) { return '<div class="row"><span class="grow"><b>' + esc(g) + '</b></span><button type="button" class="more" data-act="rmGuest" data-v="' + i + '" aria-label="×">×</button></div>'; }).join('') : '<p class="small">' + l.noGuests + '</p>') + '</div>' +
      '<div class="phone" style="grid-template-columns:1fr auto"><input class="in" placeholder="' + l.guestPh2 + '" data-k="newGuest" autocomplete="off"><button type="button" class="btn line" style="width:auto;padding:0 18px;height:52px" data-act="addGuest">' + l.guestAdd + '</button></div></div>' +
    '<div class="sec"><p class="eyb">' + l.settings + '</p><div class="list">' +
      '<div class="row"><span class="grow"><b>' + l.language + '</b></span><div class="seg" style="width:140px"><button type="button" data-act="setLang" data-v="en" aria-pressed="' + !fa() + '">EN</button><button type="button" data-act="setLang" data-v="fa" aria-pressed="' + fa() + '">فا</button></div></div>' +
      sw('sound', P.sound, l.sound) + l.notifs.map(function (x, i) { return sw('notif', S.notif[i], l.notif + ' · ' + x, i); }).join('') + sw('faceid', S.faceid, l.faceid) +
      '<button type="button" class="row" data-go="m/rules"><span class="grow"><b>' + l.rulesT + '</b></span><span class="chev"></span></button></div></div>' +
    '<div class="btns"><button type="button" class="btn line" data-act="lock">' + I('lock') + l.lock + '</button><button type="button" class="btn ghost" data-act="allDev">' + l.allDev + '</button></div>';
} });

/* ================= card: tilt with the phone or the finger, tap to turn it over ================= */
var gyro = false, orientOn = false;
function tilt(c, rx, ry) {
  rx = Math.max(-13, Math.min(13, rx)); ry = Math.max(-16, Math.min(16, ry));
  c.style.setProperty('--rx', rx.toFixed(2) + 'deg'); c.style.setProperty('--ry', ry.toFixed(2) + 'deg');
  c.style.setProperty('--gx', (50 + ry * 3).toFixed(1) + '%'); c.style.setProperty('--gy', (30 - rx * 3).toFixed(1) + '%');
}
function onOrient(e) { var c = $('#card'); if (!c || e.beta == null) return; gyro = true; c.classList.add('live'); tilt(c, -(e.beta - 45) * 0.35, e.gamma * 0.45); }
function cardTilt() {
  var c = $('#card'); if (!c || calm) return;
  if (!orientOn && window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') { orientOn = true; window.addEventListener('deviceorientation', onOrient); }
  c.addEventListener('pointermove', function (e) { if (gyro) return; var r = c.getBoundingClientRect(); c.classList.add('live'); tilt(c, -((e.clientY - r.top) / r.height - 0.5) * 22, ((e.clientX - r.left) / r.width - 0.5) * 28); });
  c.addEventListener('pointerleave', function () { if (!gyro) { c.classList.remove('live'); tilt(c, 0, 0); } });
}
function askMotion() {
  if (orientOn || calm) return; var D = window.DeviceOrientationEvent;
  if (D && typeof D.requestPermission === 'function') D.requestPermission().then(function (r) { if (r === 'granted') { orientOn = true; window.addEventListener('deviceorientation', onOrient); } }).catch(function () {});
}

/* ================= sheet ================= */
var sheetFrom = null;
function openSheet(title, html) {
  if (!app.classList.contains('sheet-open')) sheetFrom = document.activeElement;
  $('#sheetT').textContent = title; $('#sheetB').innerHTML = html; $('#sheetX').setAttribute('aria-label', L().close);
  app.classList.add('sheet-open'); hydrate($('#sheetB'));
  setTimeout(function () { $('#sheetX').focus({ preventScroll: true }); }, 60);
}
function closeSheet() { if (!app.classList.contains('sheet-open')) return; app.classList.remove('sheet-open'); $('.sheet').style.removeProperty('--drag'); if (sheetFrom && sheetFrom.focus && document.contains(sheetFrom)) sheetFrom.focus({ preventScroll: true }); }
(function () {
  var head = $('.sheet-head'), sh = $('.sheet'), y0 = null, dy = 0;
  head.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; sh.classList.add('dragging'); head.setPointerCapture(e.pointerId); });
  head.addEventListener('pointermove', function (e) { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.setProperty('--drag', dy + 'px'); });
  var up = function () { if (y0 == null) return; y0 = null; sh.classList.remove('dragging'); if (dy > 90) closeSheet(); else sh.style.setProperty('--drag', '0px'); };
  head.addEventListener('pointerup', up); head.addEventListener('pointercancel', up);
})();
$('#sheetB').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (k) set(k, e.target.value); });

function eventSheet(i) {
  var l = L(), e = l.events[i], d = dayOf(EV[i].off), on = !!S.rsvp[i], b = S.bring[i] || 0;
  openSheet(e[0], '<div class="arch" style="aspect-ratio:16/9;border-radius:4px">' + img(EVPH[i], e[0]) + '</div>' +
    '<div><div class="kv"><span>' + l.dateT + '</span><span>' + dfmt(d, { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + e[2] + '</span></div><div class="kv"><span>' + l.placeT + '</span><span>' + e[1] + '</span></div><div class="kv"><span>' + l.seatsK + '</span><span class="num">' + digits(seatsLeft(i)) + '</span></div></div>' +
    '<p class="p">' + e[3] + '</p>' +
    (on ? '<div class="f"><span class="lab">' + l.bring + '</span><div class="stepper"><button type="button" data-act="bring" data-v="-1" data-e="' + i + '" aria-label="−">−</button><output class="num">' + digits(b) + '</output><button type="button" data-act="bring" data-v="1" data-e="' + i + '" aria-label="+">+</button></div></div>' : '') +
    '<button type="button" class="btn ' + (on ? 'line' : 'gold') + '" data-act="rsvp" data-v="' + i + '">' + (on ? l.youGo + ' ✓' : l.attend) + '</button>' +
    '<div class="grid2"><button type="button" class="btn ghost" data-act="cal">' + l.addCal + '</button><button type="button" class="btn ghost" data-act="share" data-v="' + i + '">' + l.share + '</button></div>');
}

/* ================= one handler for every tap ================= */
document.addEventListener('pointerdown', function () { audio(); }, { once: true });
app.addEventListener('click', function (e) {
  var cardEl = e.target.closest('#card');
  if (cardEl) { askMotion(); cardEl.classList.toggle('flipped'); buzz(8); return; }
  var el = e.target.closest('[data-go],[data-act],[data-chip]'); if (!el || busy) return;
  var l = L(), v = el.getAttribute('data-v');
  if (el.hasAttribute('data-go')) {
    var to = el.getAttribute('data-go');
    closeSheet();
    if (to === route.path) { var pg = $('.page:not(.leave)'); if (pg) pg.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); return; }
    go(to, { replace: el.hasAttribute('data-replace') && route.key !== '' && route.key.indexOf('m') === to.indexOf('m') }); return;
  }
  if (el.hasAttribute('data-chip')) {
    var path = el.getAttribute('data-chip');
    if (el.hasAttribute('data-multi')) { var o = Object.assign({}, get(path) || {}); o[v] = !o[v]; set(path, o); el.setAttribute('aria-pressed', String(!!o[v])); }
    else { set(path, Number(v)); $$('[data-chip="' + path + '"]').forEach(function (c) { c.setAttribute('aria-pressed', String(c === el)); }); }
    clearErr(el.getAttribute('data-e')); buzz(5); return;
  }
  var A = {
    back: function () { goBack(route.key.indexOf('m') === 0 ? 'm' : (route.key === 'apply' && route.step > 1 ? 'apply/' + (route.step - 1) : '')); },
    close: closeSheet,
    lang: function () { setLang(fa() ? 'en' : 'fa'); },
    setLang: function () { setLang(v); },
    sound: function () { P.sound = !P.sound; ls.set('vault.sound', P.sound ? 'on' : 'off'); if (route.key === 'm/account') rerender(); else drawBar(ROUTES[route.key]); if (P.sound) SFX.tick(); },
    lmode: function () { S.login.mode = Number(v); S.errs = {}; save(); rerender(); },
    showpw: function () { S.login.show = !S.login.show; save(); rerender(); },
    sendCombo: function () {
      if (!FREE && digitsOnly(S.login.phone).length < 10) { S.errs = { lphone: 'phone' }; save(); rerender(); showErrors(); return; }
      S.errs = {}; S.typing = false; save(); go('combo');
    },
    passLogin: function () {
      var e2 = {}; if (!String(S.login.user || '').trim()) e2.luser = 'req'; if (!S.login.pass) e2.lpass = 'req';
      if (!FREE && Object.keys(e2).length) { S.errs = e2; save(); rerender(); showErrors(); return; }
      S.errs = {}; S.login.pass = ''; save(); unlock();
    },
    typing: function () { S.typing = !S.typing; save(); rerender(); if (S.typing) setTimeout(function () { var i = $('.page:not(.leave) .in'); if (i) i.focus(); }, 60); },
    typedOpen: function () { slots = [0, 0, 0]; unlock(); },
    sendReset: function () { if (!FREE && digitsOnly(S.fp.phone).length < 10) { S.errs = { fphone: 'phone' }; save(); rerender(); showErrors(); return; } S.errs = {}; S.fp.step = 1; S.fp.until = Date.now() + 30000; save(); toast(l.codeSent); rerender(); },
    resend: function () { S.fp.until = Date.now() + 30000; save(); toast(l.codeSent); rerender(); },
    setPass: function () {
      var f = S.fp, e2 = {};
      if ([0, 1, 2, 3].some(function (i) { return !f['c' + i]; })) e2.fcode = 'code';
      if (String(f.p1 || '').length < 8) e2.fp1 = 'pshort'; else if (f.p1 !== f.p2) e2.fp2 = 'match';
      if (!FREE && Object.keys(e2).length) { S.errs = e2; save(); rerender(); showErrors(); return; }
      S.errs = {}; S.fp = { step: 0, cc: 0 }; save(); toast(l.passDone); goBack('login');
    },
    stepNext: stepNext,
    editStep: function () { S.reviewing = true; S.errs = validate(Number(v)); save(); go('apply/' + v); },
    toDoor: function () { S.sent = null; S.form = { cc: 0, interests: {}, fields: {} }; S.done = {}; S.errs = {}; save(); depth = 0; history.replaceState({ i: 0 }, '', '#/'); render('back', { fade: true }); },
    lock: lockVault,
    allDev: function () { toast(l.allDevDone); },
    event: function () { eventSheet(Number(v)); },
    rsvp: function () { var i = Number(v); S.rsvp[i] = !S.rsvp[i]; if (!S.rsvp[i]) S.bring[i] = 0; save(); buzz(10); toast(S.rsvp[i] ? l.rsvpOn : l.rsvpOff); eventSheet(i); if (route.key === 'm/events') rerender(); },
    bring: function () { var i = Number(el.getAttribute('data-e')); S.bring[i] = Math.max(0, Math.min(2, (S.bring[i] || 0) + Number(v))); save(); eventSheet(i); if (route.key === 'm/events') rerender(); },
    cal: function () { toast(l.calAdded); },
    share: function () { var e2 = l.events[Number(v)]; if (navigator.share) navigator.share({ title: 'The Vault', text: e2[0] }).catch(function () {}); else toast(e2[0]); },
    rday: function () { var f = rf(route.room); f.day = Number(v); if (f.time != null && isFull(f.day, f.time, route.room)) f.time = null; save(); rerender(); },
    rtime: function () { rf(route.room).time = Number(v); delete S.errs.rtime; save(); rerender(); },
    party: function () { var f = rf(route.room); f.party = Math.max(1, Math.min(8, f.party + Number(v))); save(); rerender(); },
    hold: function () {
      var f = rf(route.room);
      if (f.time == null && FREE) { for (var ti = 0; ti < TIMES.length; ti++) if (!isFull(f.day, ti, route.room)) { f.time = ti; break; } }
      if (f.time == null) { S.errs = { rtime: 'time' }; save(); rerender(); showErrors(); return; }
      var r = { room: route.room, day: f.day, time: TIMES[f.time], party: f.party, guests: f.guests, note: f.note };
      S.res.push(r); S.res.sort(function (a, b) { return a.day - b.day || a.time.localeCompare(b.time); }); delete S.rf[route.room]; S.errs = {}; save();
      SFX.set(); buzz(20); rerender();
      openSheet(l.heldT, '<p class="p">' + l.heldB + '</p><div><div class="kv"><span>' + l.placeT + '</span><span>' + l.rooms[r.room][0] + '</span></div><div class="kv"><span>' + l.dateT + '</span><span>' + dfmt(dayOf(r.day), { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + digits(r.time) + '</span></div><div class="kv"><span>' + l.guestsT + '</span><span>' + party(r.party) + '</span></div></div><div class="grid2"><button type="button" class="btn line" data-act="cal">' + l.addCal + '</button><button type="button" class="btn gold" data-go="m">' + l.done + '</button></div>');
    },
    cancelRes: function () { var i = Number(v); openSheet(l.cancelQ, '<p class="p">' + resLine(S.res[i]) + '</p><div class="grid2"><button type="button" class="btn line" data-act="close">' + l.keep + '</button><button type="button" class="btn danger" data-act="cancelYes" data-v="' + i + '">' + l.cancelYes + '</button></div>'); },
    cancelYes: function () { S.res.splice(Number(v), 1); save(); closeSheet(); rerender(); toast(l.cancelled); },
    sendConc: function () {
      if (!FREE && String(S.cf.text || '').trim().length < 6) { S.errs = { ctext: 'text' }; save(); rerender(); showErrors(); return; }
      concList().unshift({ topicI: S.cf.topic, text: String(S.cf.text || '').trim() || L().whens[S.cf.when || 0], st: 0 }); S.cf = { topic: 0, when: 0, text: '' }; S.errs = {}; save(); SFX.set(); buzz(12); toast(l.sentC); rerender();
    },
    concItem: function () {
      var c = concList()[Number(v)], topic = c.seed != null ? l.seedConc[c.seed][0] : l.topics[c.topicI], text = c.seed != null ? l.seedConc[c.seed][1] : c.text, reply = c.seed != null ? l.seedConc[c.seed][3] : '';
      openSheet(topic, '<span class="pill' + (c.st === 2 ? ' ok' : '') + '" style="align-self:flex-start">' + l.st[c.st] + '</span><div class="panel"><p class="p" style="color:var(--ivory)">' + esc(text) + '</p></div>' + (reply ? '<div class="panel" style="border-color:var(--line2)"><p class="eyb">' + l.replyFrom + '</p><p class="p" style="margin-top:8px;color:var(--ivory)">' + esc(reply) + '</p></div>' : ''));
    },
    eye: function () { S.hide = !S.hide; save(); rerender(); },
    filt: function () { S.filt = Number(v); save(); rerender(); },
    statement: function () { toast(l.stSent); },
    topup: function () {
      var amts = [50000000, 100000000, 200000000, 500000000];
      S.top = S.top || { a: 1, m: 0, other: '' }; save();
      openSheet(l.topT, '<div class="f"><span class="lab">' + l.topAmt + ' · ' + l.unit + '</span><div class="chips">' + amts.map(function (a, i) { return '<button type="button" class="chip" data-chip="top.a" data-v="' + i + '" aria-pressed="' + (S.top.a === i) + '">' + n(a) + '</button>'; }).join('') + '</div></div>' +
        '<div class="f"><label class="lab">' + l.other + '</label><input class="in" inputmode="numeric" dir="ltr" data-k="top.other" placeholder="0"></div>' +
        '<div class="f"><span class="lab">' + l.method + '</span><div class="seg three">' + l.methods.map(function (m, i) { return '<button type="button" data-chip="top.m" data-v="' + i + '" aria-pressed="' + (S.top.m === i) + '">' + m + '</button>'; }).join('') + '</div></div>' +
        '<button type="button" class="btn gold" data-act="topSend">' + l.topSend + '</button><p class="small">' + l.topDone + '</p>');
    },
    topSend: function () {
      var other = Number(digitsOnly(S.top.other)), amt = other > 0 ? other : [50000000, 100000000, 200000000, 500000000][S.top.a];
      if (!amt) { toast(l.needAmt); return; }
      S.pend.unshift({ amt: amt, m: S.top.m || 0, at: Date.now() }); S.top = null; save(); closeSheet(); SFX.set(); toast(l.topDone); rerender();
    },
    tx: function () {
      var t = W.tx[Number(v)], top = t[0] === 'top', d = dayOf(t[2]);
      openSheet(top ? l.txTop : l.places[t[3]], '<div class="wallet-hero"><div class="amt num' + (top ? ' plus' : '') + '" style="font-size:34px">' + (top ? '+' : '−') + n(t[1]) + '</div><span class="unit">' + l.unit + '</span></div><div>' +
        '<div class="kv"><span>' + l.dateT + '</span><span>' + dfmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '</span></div>' +
        (top ? '' : '<div class="kv"><span>' + l.placeT + '</span><span>' + l.places[t[3]] + '</span></div><div class="kv"><span>' + l.guestsT + '</span><span>' + party(t[4] + 1) + '</span></div>') +
        '<div class="kv"><span>' + l.statusT + '</span><span class="plus">' + l.settled + '</span></div><div class="kv"><span>' + l.receipt + '</span><span class="num" dir="ltr">' + digits('R-' + (40211 + Number(v) * 37)) + '</span></div></div>' +
        '<button type="button" class="btn ghost" data-act="report">' + l.report + '</button>');
    },
    report: function () { closeSheet(); toast(l.reported); },
    addGuest: function () { var g = String(S.newGuest || '').trim(); if (!g) return; S.guests.push(g); S.newGuest = ''; save(); rerender(); },
    rmGuest: function () { S.guests.splice(Number(v), 1); save(); rerender(); toast(l.removed); },
    notif: function () { S.notif[Number(v)] = !S.notif[Number(v)]; save(); el.setAttribute('aria-checked', String(S.notif[Number(v)])); buzz(5); },
    faceid: function () { S.faceid = !S.faceid; save(); el.setAttribute('aria-checked', String(S.faceid)); buzz(5); }
  };
  if (A[el.getAttribute('data-act')]) A[el.getAttribute('data-act')]();
});
app.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.id === 'card') { e.preventDefault(); e.target.click(); } });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
// amounts are hidden when the app goes to the background (app switcher)
document.addEventListener('visibilitychange', function () { if (document.hidden && route.key === 'm/wallet' && !S.hide) { S.hide = true; save(); rerender(); } });
function setLang(x) { P.lang = x === 'fa' ? 'fa' : 'en'; ls.set('vault.lang', P.lang); var top = ($('.page:not(.leave)') || {}).scrollTop; render('same', { fade: true }); var pg = $('.page:not(.leave)'); if (pg && top) pg.scrollTop = top; }

/* ================= start ================= */
var q = new URLSearchParams(location.search);
if (q.get('lang')) P.lang = q.get('lang') === 'fa' ? 'fa' : 'en';
if (q.get('demo') === 'in') { S.authed = true; save(); }
history.replaceState({ i: 0 }, '', location.hash || '#/');
render('fwd', { fade: true });
paintDial();
})();
