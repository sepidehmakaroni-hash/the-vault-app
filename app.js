/* The Vault Members' Club — screens logic and all UI strings (EN + FA).
   State lives in this.state; renderVals() returns everything the template in index.html needs. */
class VaultApp extends View {
renderVals() {
var self = this;
var s = this.state || {};
var screen = s.screen || this.props.start || 'home';
var lang = s.lang || this.props.lang || 'en';
var full = this.props.full === true || this.props.full === 'true';
var isFa = lang === 'fa';
var FA = '۰۱۲۳۴۵۶۷۸۹';
var num = function (n) { return isFa ? String(n).replace(/[0-9]/g, function (d) { return FA[d]; }) : String(n); };
var T = {
en: {
langBtn: 'فا', langAria: 'تغییر زبان به فارسی', prev: 'Back', prevAria: 'Previous slide', nextAria: 'Next slide',
navMem: 'MEMBERSHIP', navEve: 'EVENTS', navExp: 'EXPERIENCES', flMem: 'Membership', flEve: 'Events', flExp: 'Experiences',
slides: [
{ eyebrow: 'PRIVATE MEMBERS’ CLUB', a: 'The Vault', b: 'Members’ Club', body: 'Join a community of professional, art-loving and influential people, and enjoy exclusive events, selected offers and personalised services.' },
{ eyebrow: 'CURATED CULTURAL NIGHTS', a: 'Member', b: 'Lounge', body: 'Private evenings, selected lounges and professional connections in a calm, precise, invitation-led setting for members of The Vault.' },
{ eyebrow: 'RESTAURANTS & LOUNGES', a: 'Private', b: 'Dining', body: 'Limited reservations, distinctive hospitality and curated offers for members who take quality and distinction seriously.' }
],
ctaRequest: 'Request membership', memberLogin: 'Member login',
meBody: 'A private calendar of art experiences and networking for selected members.',
statement: 'The Vault is an experience like a contemporary private club; a place that connects professionals, artists, designers, hosts and brands who take quality and distinction seriously.',
expTitle: 'Hospitality and lounge experiences',
expBody: 'Limited reservations, selected offers and programmes curated for members of the club.',
seeBenefits: 'View benefits',
calTitle: 'A private calendar of culture and art',
events: [
{ day: '24', month: 'Ordibehesht', title: 'Contemporary art preview', place: 'The Vault Gallery Hall' },
{ day: '8', month: 'Khordad', title: 'Design and architecture table', place: 'Members’ Studio' },
{ day: '21', month: 'Khordad', title: 'Collectors’ brunch', place: 'Chamber Lounge' }
],
c1: 'Private gallery', c1d: 'Art programmes, selected collections and early access to cultural experiences.',
c2: 'Restaurant and lounge', c2d: 'Exclusive reservations, limited offers and hospitality experiences for members of the club.',
c3: 'Member events', c3d: 'Invitations to openings, talks and private evenings to connect with a selected community.',
readyTitle: 'Ready to join?',
readyBody: 'To have your membership reviewed, submit your request. Our team will contact you after review.',
submitRequest: 'Submit request',
formEyebrow: 'MEMBERSHIP REQUEST',
formSub: 'After review, we will contact you. Please enter your details carefully so the review can move faster.',
steps: ['Personal information', 'Online presence', 'Introduction', 'Referrer', 'Terms'],
next: 'Next',
first: 'First name', last: 'Last name', mobile: 'Mobile number', countryCode: 'Country code', iran: 'Iran', tehran: 'Tehran',
email: 'Email', gender: 'Gender', titles: ['Mr', 'Ms'], country: 'Country', city: 'City',
birth: 'Date of birth', day: 'Day', month: 'Month', year: 'Year',
web: 'Website', insta: 'Instagram', instaPh: '@username or full link', linkedin: 'LinkedIn', linkedinPh: 'LinkedIn profile link',
field: 'Field of activity',
fields: ['Art', 'Technology', 'Media', 'Investment', 'Hospitality', 'Fashion & lifestyle', 'Health & wellness', 'Architecture & design'],
role: 'Position / job title', rolePh: 'CEO, designer, ...',
bio: 'Short introduction', bioPh: 'Write about yourself and your activities...',
why: 'Reason for membership', whyPh: 'Why do you want to become a member of The Vault?',
interests: 'Interests',
interestList: ['Dining', 'Hotels', 'Wellness', 'Events', 'Shopping', 'Travel', 'Co-working space'],
refNote: 'If you were referred by someone, enter their details. This section is optional.',
refName: 'Referrer name', refNamePh: 'Referrer’s full name', refPhone: 'Referrer phone number',
refRel: 'About your relationship', refRelPh: 'How did you get to know the referrer?',
agree1: 'I have read and accept The Vault’s terms and conditions and privacy policy.', readRules: 'View terms and conditions',
agree2: 'I confirm that all the information entered is correct.',
submit: 'Submit request',
sentBody: 'Your membership request has been submitted successfully and is under review. You will be notified of the result by SMS.',
backHome: 'Back to home', toLogin: 'Log in to account',
loginTitle: 'Log in to account',
loginBody: 'To log in, you can receive a one-time code, or enter with your mobile / email / username and password.',
tabs: ['Log in with code', 'Log in with password'],
sendCode: 'Send verification code', login: 'Log in', forgot: 'Forgot password?',
userId: 'Mobile / email / username', password: 'Password'
},
fa: {
langBtn: 'EN', langAria: 'Switch to English', prev: 'قبلی', prevAria: 'اسلاید قبلی', nextAria: 'اسلاید بعدی',
navMem: 'عضویت', navEve: 'رویدادها', navExp: 'تجربه‌ها', flMem: 'عضویت', flEve: 'رویدادها', flExp: 'تجربه‌ها',
slides: [
{ eyebrow: 'PRIVATE MEMBERS’ CLUB', a: 'The Vault', b: 'Members’ Club', body: 'به جامعه‌ای از افراد حرفه‌ای، هنردوست و تأثیرگذار بپیوندید و از رویدادهای اختصاصی، پیشنهادهای منتخب و خدمات شخصی‌سازی‌شده بهره‌مند شوید.' },
{ eyebrow: 'CURATED CULTURAL NIGHTS', a: 'Member', b: 'Lounge', body: 'شب‌های خصوصی، لانژهای منتخب و ارتباطات حرفه‌ای در فضایی آرام، دقیق و دعوت‌محور برای اعضای د والت.' },
{ eyebrow: 'RESTAURANTS & LOUNGES', a: 'Private', b: 'Dining', body: 'رزروهای محدود، تجربه‌های پذیرایی خاص و پیشنهادهای curated برای اعضایی که کیفیت و تمایز را جدی می‌گیرند.' }
],
ctaRequest: 'درخواست عضویت', memberLogin: 'ورود اعضا',
meBody: 'تقویم خصوصی تجربه‌های هنری و شبکه‌سازی برای اعضای منتخب.',
statement: 'د والت، تجربه‌ای شبیه یک باشگاه خصوصی معاصر است؛ جایی برای اتصال حرفه‌ای‌ها، هنرمندان، طراحان، میزبان‌ها و برندهایی که کیفیت و تمایز را جدی می‌گیرند.',
expTitle: 'تجربه‌های پذیرایی و لانژ',
expBody: 'رزروهای محدود، پیشنهادهای منتخب و برنامه‌هایی که برای اعضای باشگاه curated می‌شوند.',
seeBenefits: 'مشاهده مزایا',
calTitle: 'تقویم خصوصی فرهنگ و هنر',
events: [
{ day: '۲۴', month: 'اردیبهشت', title: 'پیش‌نمایش هنر معاصر', place: 'سالن گالری د والت' },
{ day: '۸', month: 'خرداد', title: 'میز طراحی و معماری', place: 'استودیوی اعضا' },
{ day: '۲۱', month: 'خرداد', title: 'برانچ کلکسیونرها', place: 'Chamber Lounge' }
],
c1: 'گالری خصوصی', c1d: 'برنامه‌های هنری، کلکسیون‌های منتخب و دسترسی زودهنگام به تجربه‌های فرهنگی.',
c2: 'رستوران و لانژ', c2d: 'رزرو اختصاصی، پیشنهادهای محدود و تجربه‌های پذیرایی برای اعضای باشگاه.',
c3: 'رویدادهای اعضا', c3d: 'دعوت به افتتاحیه‌ها، نشست‌ها و شب‌های خصوصی برای ارتباط با جامعه منتخب.',
readyTitle: 'آماده پیوستن هستید؟',
readyBody: 'برای بررسی عضویت، درخواست خود را ثبت کنید. تیم ما پس از بررسی با شما تماس خواهد گرفت.',
submitRequest: 'ثبت درخواست',
formEyebrow: 'درخواست عضویت',
formSub: 'پس از بررسی، با شما تماس خواهیم گرفت. لطفاً اطلاعات را با دقت وارد کنید تا فرآیند بررسی سریع‌تر انجام شود.',
steps: ['اطلاعات شخصی', 'حضور آنلاین', 'معرفی', 'معرف', 'شرایط'],
next: 'بعدی',
first: 'نام', last: 'نام خانوادگی', mobile: 'شماره موبایل', countryCode: 'کد کشور', iran: 'ایران', tehran: 'تهران',
email: 'ایمیل', gender: 'جنسیت', titles: ['آقا', 'خانم'], country: 'کشور', city: 'شهر',
birth: 'تاریخ تولد', day: 'روز', month: 'ماه', year: 'سال',
web: 'وب‌سایت', insta: 'اینستاگرام', instaPh: '@username یا لینک کامل', linkedin: 'لینکدین', linkedinPh: 'لینک پروفایل لینکدین',
field: 'حوزه فعالیت',
fields: ['هنر', 'فناوری', 'رسانه', 'سرمایه‌گذاری', 'مهمان‌نوازی', 'مد و سبک زندگی', 'سلامت و تندرستی', 'معماری و طراحی'],
role: 'سمت / عنوان شغلی', rolePh: 'مدیرعامل، طراح، ...',
bio: 'معرفی کوتاه', bioPh: 'درباره خودتان و فعالیت‌هایتان بنویسید...',
why: 'انگیزه عضویت', whyPh: 'چرا می‌خواهید عضو د والت شوید؟',
interests: 'علاقه‌مندی‌ها',
interestList: ['غذاخوری', 'هتل‌ها', 'سلامت و آرامش', 'رویدادها', 'خرید', 'سفر', 'فضای کار مشترک'],
refNote: 'اگر توسط فردی معرفی شده‌اید، اطلاعات او را وارد کنید. این بخش اختیاری است.',
refName: 'نام معرف', refNamePh: 'نام کامل معرف', refPhone: 'شماره تماس معرف',
refRel: 'توضیحات رابطه', refRelPh: 'چگونه با معرف آشنا شدید؟',
agree1: 'شرایط و قوانین د والت و سیاست حریم خصوصی را مطالعه کرده و می‌پذیرم.', readRules: 'مشاهده شرایط و قوانین',
agree2: 'تأیید می‌کنم که تمام اطلاعات واردشده صحیح است.',
submit: 'ثبت درخواست',
sentBody: 'درخواست عضویت شما با موفقیت ثبت شد و در حال بررسی است. نتیجه بررسی از طریق پیامک به شما اطلاع داده خواهد شد.',
backHome: 'بازگشت به صفحه اصلی', toLogin: 'ورود به حساب',
loginTitle: 'ورود به حساب',
loginBody: 'برای ورود می‌توانید کد یکبارمصرف دریافت کنید یا با موبایل / ایمیل / نام کاربری و رمز عبور وارد شوید.',
tabs: ['ورود با کد', 'ورود با رمز'],
sendCode: 'ارسال کد تأیید', login: 'ورود', forgot: 'فراموشی رمز عبور؟',
userId: 'موبایل / ایمیل / نام کاربری', password: 'رمز عبور'
}
};
var t = T[lang];
var GOLD = 'var(--btn-bg)';
var flow = ['s1', 's2', 's3', 's4', 's5', 'sent'];
var go = function (to) { return function () { self.setState({ screen: to }); }; };
var stepN = ['s1', 's2', 's3', 's4', 's5'].indexOf(screen) + 1;
var next = function () { var i = flow.indexOf(screen); if (i > -1 && i < flow.length - 1) { self.setState({ screen: flow[i + 1] }); } };
var back = function () { var i = flow.indexOf(screen); if (i > 0 && screen !== 'sent') { self.setState({ screen: flow[i - 1] }); return; } self.setState({ screen: 'home' }); };
var chip = function (label, on, pick) {
return { label: label, on: on ? 'true' : 'false', pick: pick,
bg: on ? GOLD : 'rgb(var(--ground-rgb) / 0.66)', fg: on ? 'var(--btn-fg)' : 'var(--text)', fw: on ? '600' : '400',
bd: on ? 'var(--accent)' : 'rgb(var(--accent-rgb) / 0.5)' };
};
var tabChip = function (label, on, pick) {
return { label: label, on: on ? 'true' : 'false', pick: pick, bg: on ? GOLD : 'transparent', fg: on ? 'var(--btn-fg)' : 'var(--accent-l)', fw: on ? '600' : '400' };
};
var picked = s.interests || {};
var roman = ['I', 'II', 'III', 'IV', 'V'];
var slideI = s.slide != null ? s.slide : (Number(this.props.slide) || 0);
var mode = s.mode || 'code';
var bioLen = s.bioLen || 0, whyLen = s.whyLen || 0;
var TX = {
en: {
menu: 'Menu', close: 'Close', home: 'Home', membership: 'Membership', eventsL: 'Events', experiences: 'Experiences',
howTitle: 'How to request', already: 'Already a member', date: 'Date', place: 'Place',
evNote: 'Members reply from their account. Seats are limited and held by name.',
termsTitle: 'Terms and house rules', termsBody: 'The house runs on a few short rules. They apply to every member and every guest, with no exceptions at the door.',
rules: [['Guests', 'Every guest is named before the night. A guest never pays.'], ['The bill', 'Nothing is settled at the table. It comes off your charge.'], ['Photography', 'No photographs anywhere in the house.'], ['Privacy', 'The club never confirms or denies who is a member.'], ['Age', 'No one under fifteen, at any hour, in any room.'], ['Smoking', 'The terrace only. Cigars in the bar.']],
otpTitle: 'Enter the code', otpBody: 'We sent a four-digit code to your mobile number.', resend: 'Send the code again', confirm: 'Open',
forgotTitle: 'Reset your password', forgotBody: 'Enter your mobile number. We will send a code, and you can set a new password after it.',
openToday: 'Open today', nextVisit: 'Your next visit', noVisit: 'Nothing reserved yet', noVisitSub: 'Choose a room and a time', tonight: 'Next at the club',
qReserve: 'Reserve', qGuest: 'Name a guest', qConc: 'Concierge',
morning: 'Good morning.', afternoon: 'Good afternoon.', evening: 'Good evening.',
tabs: ['Home', 'Reserve', 'Events', 'Concierge', 'Account'],
reserveEy: 'Reserve', reserveTitle: 'Where would you like to sit?',
zones: [['The lounge', 'The heart of the club. No reservation needed by day.', 'lounge', 'Open from 08:00. After 19:00 a table is held for you.'], ['Dining room', 'One room, one service. Lunch and dinner.', 'dining', 'Tell us of any allergy in the guest names box.'], ['Sushi counter', 'Eight seats in front of the itamae.', 'sushi', 'Counter seats are for parties of up to four.'], ['Bar and humidor', 'Cigars are smoked here and nowhere else.', 'humidor', 'Your own humidor shelf is kept at 70% and 19°.'], ['The terrace', 'Open air, dinner served. Smoking.', 'terrace', 'The terrace is always a smoking area.'], ['The Japanese garden', 'Granted, not sold. Ask the concierge.', 'garden', 'The garden is given for an occasion. Your concierge will answer the same night.'], ['Meeting room', 'A private door. Arranged only by the concierge.', 'meeting', 'No names are written anywhere. Your concierge arranges it in person.']],
day: 'Day', days: ['Today', 'Tomorrow', 'This week', 'Another day'], time: 'Time', party: 'How many, with you',
guestNames: 'Names of your guests', guestNamesPh: 'One name per line', guestRule: 'A guest whose name is on the list walks in. A guest who is not waits at the bench until you come for them.',
confirmResv: 'Hold the table', resvDone: 'It is held.', resvBody: 'Your table is kept under your name. Nothing more is needed at the door.', backMember: 'Back to home',
going: 'I will be there', notGoing: 'Reply', 
concEy: 'Concierge', concTitle: 'What can we arrange?', concBody: 'Ask for anything. If it can be done, it will be, and you will hear back the same night.',
concWhat: 'It is about', cats: ['A table elsewhere', 'Hotel', 'Car and driver', 'Flowers or a gift', 'Tickets', 'Travel', 'Courier', 'Something else'],
concDetail: 'Tell us', concPh: 'For whom, when, and anything we should know', concWhen: 'When', whens: ['Today', 'This week', 'No hurry'], concSend: 'Send to the concierge',
concHours: 'Concierge hours', concDone: 'Received.', concDoneBody: 'Your concierge has it and will confirm tonight. After 02:30, requests are picked up at nine in the morning.', request: 'Request',
accEy: 'Account', accTitle: 'Your membership', balance: 'Charge balance', balHidden: 'Tap to show', balShown: 'Example: 1,250,000,000', balNote: 'The balance is shown here only. It is never spoken in the house, and what is left at year end carries over.',
accRows: [['Guests', 'Name the people coming with you'], ['Top up', 'Add to your charge'], ['Statement', 'Every visit, listed'], ['House rules', 'Six short rules'], ['Log out', 'Close the vault']],
guestsTitle: 'Name a guest', guestsSend: 'Add to the list', guestsDone: 'On the list.', guestsDoneBody: 'The names sit on that night’s list only. No record of a guest is kept afterwards.', names: 'Guests',
topDone: 'Request sent.', topBody: 'The finance desk will contact you privately. Nothing changes at your table tonight.', topK: 'Top up', topV: 'Requested',
stDone: 'Statement requested.', stBody: 'It will be sent to you privately. A list is given only when asked for.', stK: 'Statement', stV: 'On its way'
},
fa: {
menu: 'منو', close: 'بستن', home: 'خانه', membership: 'عضویت', eventsL: 'رویدادها', experiences: 'تجربه‌ها',
howTitle: 'مراحل درخواست', already: 'عضو هستید', date: 'تاریخ', place: 'مکان',
evNote: 'اعضا از حساب خود پاسخ می‌دهند. جا محدود است و به نام نگه داشته می‌شود.',
termsTitle: 'شرایط و قوانین خانه', termsBody: 'خانه با چند قانون کوتاه اداره می‌شود. این قوانین برای هر عضو و هر مهمان یکسان است و دمِ در استثنا ندارد.',
rules: [['مهمان', 'نام هر مهمان از قبل داده می‌شود. مهمان هرگز چیزی پرداخت نمی‌کند.'], ['صورتحساب', 'هیچ حسابی سر میز بسته نمی‌شود؛ از شارژ شما کم می‌شود.'], ['عکس', 'در هیچ جای خانه عکس‌برداری نداریم.'], ['حریم', 'کلاب عضویت هیچ‌کس را تأیید یا تکذیب نمی‌کند.'], ['سن', 'زیر پانزده سال، در هیچ ساعتی و هیچ فضایی.'], ['سیگار', 'فقط تراس. سیگار برگ در بار.']],
otpTitle: 'کد را وارد کنید', otpBody: 'یک کد چهاررقمی به شماره موبایل شما فرستادیم.', resend: 'ارسال دوباره کد', confirm: 'باز کن',
forgotTitle: 'بازیابی رمز عبور', forgotBody: 'شماره موبایل خود را وارد کنید. کدی می‌فرستیم و بعد از آن رمز تازه می‌گذارید.',
openToday: 'امروز باز است', nextVisit: 'حضور بعدی شما', noVisit: 'هنوز چیزی رزرو نشده', noVisitSub: 'یک فضا و یک ساعت انتخاب کنید', tonight: 'برنامهٔ بعدی کلاب',
qReserve: 'رزرو', qGuest: 'ثبت مهمان', qConc: 'کانسیرج',
morning: 'صبح بخیر.', afternoon: 'عصر بخیر.', evening: 'شب بخیر.',
tabs: ['خانه', 'رزرو', 'رویدادها', 'کانسیرج', 'حساب'],
reserveEy: 'رزرو', reserveTitle: 'کجا می‌نشینید؟',
zones: [['لانژ', 'قلب کلاب. در روز رزرو نمی‌خواهد.', 'lounge', 'از ۰۸:۰۰ باز است. بعد از ۱۹:۰۰ میز برایتان نگه داشته می‌شود.'], ['سالن غذاخوری', 'یک سالن، یک سرویس. ناهار و شام.', 'dining', 'اگر حساسیت غذایی هست در بخش نام مهمان‌ها بنویسید.'], ['کانتر سوشی', 'هشت صندلی روبه‌روی ایتامائه.', 'sushi', 'کانتر برای جمع‌های تا چهار نفر است.'], ['بار و هیومیدور', 'سیگار برگ فقط اینجا.', 'humidor', 'قفسهٔ شخصی شما در رطوبت ۷۰٪ و دمای ۱۹ درجه نگه داشته می‌شود.'], ['تراس', 'فضای باز، با سرو شام. سیگاری.', 'terrace', 'تراس همیشه سیگاری است.'], ['باغ ژاپنی', 'فروخته نمی‌شود، اعطا می‌شود. از کانسیرج بخواهید.', 'garden', 'باغ برای یک مناسبت داده می‌شود. کانسیرج همان شب جواب می‌دهد.'], ['اتاق جلسه', 'درِ جدا. فقط از طریق کانسیرج.', 'meeting', 'هیچ نامی جایی نوشته نمی‌شود. کانسیرج حضوری هماهنگ می‌کند.']],
day: 'روز', days: ['امروز', 'فردا', 'همین هفته', 'روز دیگر'], time: 'ساعت', party: 'چند نفر، با خودتان',
guestNames: 'نام مهمان‌ها', guestNamesPh: 'هر نام در یک خط', guestRule: 'مهمانی که نامش در فهرست است وارد می‌شود. مهمانی که نیست روی نیمکت می‌ماند تا خودتان بیایید.',
confirmResv: 'میز را نگه دار', resvDone: 'نگه داشته شد.', resvBody: 'میز به نام شماست. دمِ در چیز دیگری لازم نیست.', backMember: 'بازگشت به خانه',
going: 'می‌آیم', notGoing: 'اعلام حضور',
concEy: 'کانسیرج', concTitle: 'چه چیزی هماهنگ کنیم؟', concBody: 'هر چیزی بخواهید. اگر شدنی باشد انجام می‌شود و همان شب خبرش را می‌گیرید.',
concWhat: 'موضوع', cats: ['میز در جای دیگر', 'هتل', 'ماشین و راننده', 'گل یا هدیه', 'بلیت', 'سفر', 'پیک', 'چیز دیگر'],
concDetail: 'بنویسید', concPh: 'برای چه کسی، چه زمانی، و هر چه باید بدانیم', concWhen: 'زمان', whens: ['امروز', 'همین هفته', 'عجله‌ای نیست'], concSend: 'ارسال به کانسیرج',
concHours: 'ساعت کانسیرج', concDone: 'دریافت شد.', concDoneBody: 'کانسیرج شما آن را دارد و همین امشب تأیید می‌کند. بعد از ۰۲:۳۰، درخواست‌ها از نُه صبح پیگیری می‌شود.', request: 'درخواست',
accEy: 'حساب', accTitle: 'عضویت شما', balance: 'ماندهٔ شارژ', balHidden: 'برای دیدن لمس کنید', balShown: 'نمونه: ۱٬۲۵۰٬۰۰۰٬۰۰۰', balNote: 'مانده فقط همین‌جا دیده می‌شود و در خانه هرگز گفته نمی‌شود. ماندهٔ آخر سال به سال بعد می‌رود.',
accRows: [['مهمان‌ها', 'نام همراهان خود را بدهید'], ['شارژ', 'افزودن به شارژ'], ['صورت‌وضعیت', 'فهرست هر حضور'], ['قوانین خانه', 'شش قانون کوتاه'], ['خروج', 'بستن گاوصندوق']],
guestsTitle: 'ثبت مهمان', guestsSend: 'افزودن به فهرست', guestsDone: 'در فهرست است.', guestsDoneBody: 'نام‌ها فقط روی فهرست همان شب می‌نشیند و بعد از آن هیچ سابقه‌ای از مهمان نمی‌ماند.', names: 'مهمان‌ها',
topDone: 'درخواست ثبت شد.', topBody: 'واحد مالی خصوصی با شما تماس می‌گیرد. امشب سر میز شما چیزی تغییر نمی‌کند.', topK: 'شارژ', topV: 'درخواست شد',
stDone: 'صورت‌وضعیت درخواست شد.', stBody: 'خصوصی برایتان فرستاده می‌شود. فهرست فقط وقتی خواسته شود داده می‌شود.', stK: 'صورت‌وضعیت', stV: 'در راه است'
}
};
var xt = TX[lang];
var hist = s.hist || [];
var snap = { screen: screen, pg: s.pg, tab: s.tab, sub: s.sub, zone: s.zone, done: s.done };
var nav = function (patch) { return function () { self.setState(Object.assign({ hist: hist.concat([snap]), menu: false }, patch)); }; };
var back2 = function () {
if (stepN > 1 || screen === 'sent') { back(); return; }
if (hist.length) { var h = hist[hist.length - 1]; self.setState({ screen: h.screen, pg: h.pg, tab: h.tab, sub: h.sub, zone: h.zone, done: h.done, hist: hist.slice(0, -1), menu: false }); return; }
back();
};
var pgGo = function (k) { return nav({ screen: 'pg', pg: k }); };
var evGo = [pgGo('ev0'), pgGo('ev1'), pgGo('ev2')];
var stepRows = t.steps.map(function (st, i) { return { k: roman[i], t: st, d: '', go: nav({ screen: 's1' }), chev: '' }; });
var ruleRows = xt.rules.map(function (r, i) { return { k: roman[i] || 'VI', t: r[0], d: r[1], go: function () {}, chev: 'nochev' }; });
var evRows = function (i) { var e = t.events[i]; return [{ k: e.day, t: e.month, d: xt.date, go: function () {}, chev: 'nochev' }, { k: '·', t: e.place, d: xt.place, go: function () {}, chev: 'nochev' }]; };
var PG = {
membership: { ph: 'vault', eyebrow: 'INVITATION ONLY', title: xt.membership, body: t.statement, rows: stepRows, cta: nav({ screen: 's1' }), ctaLabel: t.ctaRequest },
events: { ph: 'opera', eyebrow: 'THE VAULT CALENDAR', title: t.calTitle, body: t.meBody, rows: t.events.map(function (e, i) { return { k: e.day, t: e.title, d: e.month + ' · ' + e.place, go: evGo[i], chev: '' }; }), cta: nav({ screen: 's1' }), ctaLabel: t.ctaRequest },
experiences: { ph: 'dining', eyebrow: 'RESTAURANTS & LOUNGES', title: t.expTitle, body: t.expBody, rows: [{ k: 'I', t: t.c1, d: '', go: pgGo('gallery'), chev: '' }, { k: 'II', t: t.c2, d: '', go: pgGo('restaurant'), chev: '' }, { k: 'III', t: t.c3, d: '', go: pgGo('mevents'), chev: '' }], cta: nav({ screen: 's1' }), ctaLabel: t.ctaRequest },
gallery: { ph: 'corridor', eyebrow: 'I', title: t.c1, body: t.c1d, rows: [], cta: nav({ screen: 's1' }), ctaLabel: t.ctaRequest },
restaurant: { ph: 'table', eyebrow: 'II', title: t.c2, body: t.c2d, rows: [], cta: nav({ screen: 's1' }), ctaLabel: t.ctaRequest },
mevents: { ph: 'opera', eyebrow: 'III', title: t.c3, body: t.c3d, rows: t.events.map(function (e, i) { return { k: e.day, t: e.title, d: e.month + ' · ' + e.place, go: evGo[i], chev: '' }; }), cta: nav({ screen: 's1' }), ctaLabel: t.ctaRequest },
ev0: { ph: 'auction', eyebrow: 'THE VAULT CALENDAR', title: t.events[0].title, body: xt.evNote, rows: evRows(0), cta: nav({ screen: 'login' }), ctaLabel: t.memberLogin },
ev1: { ph: 'bar', eyebrow: 'THE VAULT CALENDAR', title: t.events[1].title, body: xt.evNote, rows: evRows(1), cta: nav({ screen: 'login' }), ctaLabel: t.memberLogin },
ev2: { ph: 'lounge', eyebrow: 'THE VAULT CALENDAR', title: t.events[2].title, body: xt.evNote, rows: evRows(2), cta: nav({ screen: 'login' }), ctaLabel: t.memberLogin },
terms: { ph: 'library', eyebrow: 'THE HOUSE', title: xt.termsTitle, body: xt.termsBody, rows: ruleRows, cta: back2, ctaLabel: t.prev },
forgot: { ph: 'door', eyebrow: 'MEMBER LOGIN', title: xt.forgotTitle, body: xt.forgotBody, rows: [], cta: nav({ screen: 'otp' }), ctaLabel: t.sendCode }
};
var PR = self.props || {};
var tab = s.tab || PR.tab || 'home', sub = s.sub != null ? s.sub : (PR.sub || '');
var isM = screen === 'm';
var mGo = function (tb, sb, extra) { return nav(Object.assign({ screen: 'm', tab: tb, sub: sb || '' }, extra || {})); };
var zoneI = s.zone != null ? s.zone : (Number(PR.zone) || 0), zr = xt.zones[zoneI];
var hr = new Date().getHours();
var resv = s.resv;
var dayI = s.dayI || 0, timeI = s.timeI == null ? 3 : s.timeI, sizeI = s.sizeI == null ? 1 : s.sizeI, catI = s.catI || 0, whenI = s.whenI || 0;
var TIMES = ['12:30', '14:00', '19:30', '20:30', '21:30', '22:30'];
var rsvp = s.rsvp || {};
var DONE = {
resv: [xt.resvDone, xt.resvBody, zr[0], xt.days[dayI] + ' · ' + TIMES[timeI]],
conc: [xt.concDone, xt.concDoneBody, xt.request, xt.cats[catI]],
guests: [xt.guestsDone, xt.guestsDoneBody, xt.names, xt.days[dayI]],
top: [xt.topDone, xt.topBody, xt.topK, xt.topV],
st: [xt.stDone, xt.stBody, xt.stK, xt.stV]
}[s.done || PR.done || 'resv'];
var IC = function (d) { return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23CDB57E' stroke-width='1.3'%3E" + d + "%3C/svg%3E"; };
var ICONS = [IC("%3Cpath d='M5 20V11a7 7 0 0 1 14 0v9zM3 20h18M12 14v6'/%3E"), IC("%3Crect x='4' y='5.5' width='16' height='14'/%3E%3Cpath d='M4 10h16M8.5 3v4M15.5 3v4'/%3E"), IC("%3Cpath d='M12 3.5l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.5 6.8 19.4 8 13.6l-4.4-4 5.9-.7z'/%3E"), IC("%3Cpath d='M4.5 17.5c0-4.4 3.3-8 7.5-8s7.5 3.6 7.5 8zM3 17.5h18M12 9.5V7M10 7h4'/%3E"), IC("%3Ccircle cx='12' cy='8.5' r='3.8'/%3E%3Cpath d='M4.5 20.5c.8-4 3.7-6 7.5-6s6.7 2 7.5 6'/%3E")];
var TABK = ['home', 'reserve', 'events', 'concierge', 'account'];
var accGo = [mGo('account', 'guests'), mGo('account', 'done', { done: 'top' }), mGo('account', 'done', { done: 'st' }), pgGo('terms'), function () { self.setState({ screen: 'home', hist: [], tab: 'home', sub: '', menu: false }); }];
var X = {
t: xt,
isPg: screen === 'pg', pg: PG[s.pg || (self.props || {}).pg || 'membership'],
isOtp: screen === 'otp', enter: function () { self.setState({ screen: 'm', tab: 'home', sub: '', hist: [], menu: false }); }, noop: function () {},
loginGo: mode === 'code' ? nav({ screen: 'otp' }) : function () { self.setState({ screen: 'm', tab: 'home', sub: '', hist: [], menu: false }); },
goForgot: pgGo('forgot'),
pMembership: pgGo('membership'), pEvents: pgGo('events'), pExperiences: pgGo('experiences'), pGallery: pgGo('gallery'), pRestaurant: pgGo('restaurant'), pMevents: pgGo('mevents'), pTerms: pgGo('terms'),
evGo: evGo, ev0: pgGo('ev0'), e0: t.events[0],
menu: s.menu != null ? !!s.menu : ((self.props || {}).menu === true || (self.props || {}).menu === 'true'), openMenu: function () { self.setState({ menu: true }); }, closeMenu: function () { self.setState({ menu: false }); },
menuItems: [[xt.home, function () { self.setState({ screen: 'home', menu: false, hist: [] }); }], [xt.membership, pgGo('membership')], [xt.eventsL, pgGo('events')], [xt.experiences, pgGo('experiences')], [t.ctaRequest, nav({ screen: 's1' })], [t.memberLogin, nav({ screen: 'login' })]].map(function (m, i) { return { k: '0' + (i + 1), t: m[0], go: m[1] }; }),
isM: isM, backVis: (isM && sub === '') ? 'hidden' : 'visible',
mHome: isM && tab === 'home', mReserve: isM && tab === 'reserve' && sub === '', mForm: isM && tab === 'reserve' && sub === 'form', mDone: isM && sub === 'done',
mEvents: isM && tab === 'events', mConc: isM && tab === 'concierge' && sub === '', mAccount: isM && tab === 'account' && sub === '', mGuests: isM && tab === 'account' && sub === 'guests',
greet: hr < 12 ? xt.morning : (hr < 18 ? xt.afternoon : xt.evening),
visitTitle: resv ? resv[0] : xt.noVisit, visitSub: resv ? resv[1] : xt.noVisitSub,
tabHome: mGo('home'), tabReserve: mGo('reserve'), tabConc: mGo('concierge'), goGuests: mGo('account', 'guests'),
zones: xt.zones.map(function (z, i) { return { t: z[0], d: z[1], ph: z[2], go: mGo('reserve', 'form', { zone: i }) }; }),
zone: { t: zr[0], ph: zr[2], note: zr[3] },
days: xt.days.map(function (d, i) { return chip(d, dayI === i, function () { self.setState({ dayI: i }); }); }),
times: TIMES.map(function (d, i) { return chip(d, timeI === i, function () { self.setState({ timeI: i }); }); }),
sizes: ['1', '2', '3', '4', '5', '6+'].map(function (d, i) { return chip(d, sizeI === i, function () { self.setState({ sizeI: i }); }); }),
confirmResv: function () { self.setState({ hist: hist.concat([snap]), screen: 'm', tab: 'reserve', sub: 'done', done: 'resv', resv: [zr[0], xt.days[dayI] + ' · ' + TIMES[timeI]] }); },
doneTitle: DONE[0], doneBody: DONE[1], doneK: DONE[2], doneV: DONE[3],
mev: t.events.map(function (e, i) { var on = !!rsvp[i]; var c = chip(on ? xt.going : xt.notGoing, on, function () { var n = Object.assign({}, rsvp); n[i] = !n[i]; self.setState({ rsvp: n }); }); return { day: e.day, month: e.month, title: e.title, place: e.place, ph: ['auction', 'bar', 'lounge'][i], go: evGo[i], rsvp: c.pick, on: c.on, fw: c.fw, bg: c.bg, fg: c.fg, bd: c.bd, label: c.label }; }),
cats: xt.cats.map(function (d, i) { return chip(d, catI === i, function () { self.setState({ catI: i }); }); }),
whens: xt.whens.map(function (d, i) { return chip(d, whenI === i, function () { self.setState({ whenI: i }); }); }),
sendConc: mGo('concierge', 'done', { done: 'conc' }),
sendGuests: mGo('account', 'done', { done: 'guests' }),
toggleBal: function () { self.setState({ bal: !s.bal }); }, balText: s.bal ? xt.balShown : '•••• ••••',
accRows: xt.accRows.map(function (r, i) { return { t: r[0], d: r[1], go: accGo[i] }; }),
tabsM: xt.tabs.map(function (l, i) { return { label: l, icon: ICONS[i], cls: tab === TABK[i] ? 'on' : '', cur: tab === TABK[i] ? 'page' : 'false', go: function () { self.setState({ screen: 'm', tab: TABK[i], sub: '', hist: [], menu: false }); } }; })
};
return {
t: t,
x: X,
dir: isFa ? 'rtl' : 'ltr',
font: isFa ? "'Vazirmatn', sans-serif" : "'Archivo', 'Vazirmatn', sans-serif",
titleFont: isFa ? "'Vazirmatn', sans-serif" : 'var(--display)',
numFont: isFa ? "'Vazirmatn', sans-serif" : "'Bodoni Moda', serif",
titleW: isFa ? '300' : '400',
track: isFa ? '0' : '0.2em',
track2: isFa ? '0' : '0.06em',
navSize: isFa ? '13px' : '10px',
startAlign: isFa ? 'right' : 'left',
introSize: isFa ? '21px' : '20px',
introLh: isFa ? '40px' : '33px',

backRot: isFa ? '135deg' : '-45deg',
isHome: screen === 'home',
showBar: screen !== 'home' && screen !== 'sent',
isStep: stepN > 0,
isS1: screen === 's1', isS2: screen === 's2', isS3: screen === 's3', isS4: screen === 's4', isS5: screen === 's5',
isSent: screen === 'sent',
isLogin: screen === 'login',
toggleLang: function () { self.setState({ lang: isFa ? 'en' : 'fa' }); },
goLogin: go('login'), goHome: go('home'), goRequest: go('s1'),
next: next, back: back2,
slide: t.slides[slideI],
o0: slideI === 0 ? '1' : '0', o1: slideI === 1 ? '1' : '0', o2: slideI === 2 ? '1' : '0',
dots: [0, 1, 2].map(function (i) { return { w: i === slideI ? '26px' : '6px', bg: i === slideI ? 'var(--accent-l)' : 'rgb(var(--text-rgb) / 0.4)' }; }),
prevSlide: function () { self.setState({ slide: (slideI + 2) % 3 }); },
nextSlide: function () { self.setState({ slide: (slideI + 1) % 3 }); },
events: t.events.map(function (e, i) { return { day: e.day, month: e.month, title: e.title, place: e.place, go: evGo[i], line: i < 2 ? 'rgb(var(--accent-rgb) / 0.3)' : 'transparent' }; }),
segs: [1, 2, 3, 4, 5].map(function (i) { return { cls: i < stepN ? 'done' : (i === stepN ? 'cur' : 'todo'), num: roman[i - 1], bg: i < stepN ? GOLD : 'var(--ground)', fg: i < stepN ? 'var(--btn-fg)' : (i === stepN ? 'var(--accent-l)' : 'rgb(var(--accent-rgb) / 0.55)') }; }),
stepTitle: stepN > 0 ? t.steps[stepN - 1] : '',
stepPct: (stepN * 20) + '%', sDeg: (-slideI * 120) + 'deg', sPrev: (-(slideI - 1) * 120 - 80) + 'deg', dialDeg: (-(stepN - 1) * 72) + 'deg', dialPrev: (-(stepN - 2) * 72) + 'deg', stepCount: '0' + stepN + ' / 05', stepOf: isFa ? 'گام ' + num(stepN) + ' از ' + num(5) : 'Step ' + stepN + ' of 5',
stepCta: screen === 's5' ? t.submit : t.next,
titles: t.titles.map(function (label, i) { return chip(label, s.title === i, function () { self.setState({ title: i }); }); }),
fields: t.fields.map(function (label, i) { return chip(label, s.field === i, function () { self.setState({ field: i }); }); }),
interests: t.interestList.map(function (label, i) {
return chip(label, !!picked[i], function () { var n = Object.assign({}, picked); n[i] = !n[i]; self.setState({ interests: n }); });
}),
bioCount: bioLen + '/600', whyCount: whyLen + '/600',
onBio: function (e) { self.setState({ bioLen: e.target.value.length }); },
onWhy: function (e) { self.setState({ whyLen: e.target.value.length }); },
tabs: [tabChip(t.tabs[0], mode === 'code', function () { self.setState({ mode: 'code' }); }), tabChip(t.tabs[1], mode === 'pass', function () { self.setState({ mode: 'pass' }); })],
byCode: mode === 'code', byPass: mode === 'pass',
loginCta: mode === 'code' ? t.sendCode : t.login
};
}
}

mount(VaultApp, document.getElementById("app-template"), document.getElementById("app"));
