/* Demo behavior only. No API calls, credentials or personal data are persisted. */
const VaultDemo = (() => {
  const digits = value => String(value).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const localDate = date => [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
  const strings = {
    en: {
      note: 'Interactive demo · No requests or payments are sent', required: 'Please complete this field.',
      choose: 'Please choose an option.', interests: 'Choose at least one interest.', phone: 'Enter a valid mobile number for the selected country.',
      email: 'Enter a valid email address.', url: 'Enter a valid website address.', birth: 'Enter a valid date of birth, or leave all three boxes empty.', age: 'Membership is available from age 15.',
      terms: 'Please accept both statements before submitting.', code: 'For this demo, enter 1234.',
      otpHint: 'Demo code: 1234 · No SMS is sent', resetTitle: 'Choose a new password', resetBody: 'This is a demonstration; no real password is changed.',
      confirmPassword: 'Confirm password', resetCta: 'Save demo password', password: 'Use at least 8 characters.', mismatch: 'The passwords do not match.',
      date: 'Choose a date', invalidDate: 'Choose a valid date in the selected period.', invalidTime: 'Choose a future time, or another day.',
      people: 'people', guests: 'Guests', member: 'Demo member · Active membership · No. 001', resetSuccess: 'Demo password reset completed.',
      sent: 'Demo completed. Your request has not been sent.', guestDone: 'Demo guest list updated. No names have been sent.',
      concDone: 'Demo request recorded. Nothing has been sent to the concierge.', topDone: 'Demo top-up request. No payment has been made.',
      statementDone: 'Demo statement request. Nothing has been sent.', minDate: 'Date', saved: 'Demo reservation saved. No real table has been booked.',
      demoFirst: 'Alex', demoLast: 'Morgan', digit: 'Code digit', recovery: 'Continue', names: 'Enter at least one guest name.', details: 'Describe what you would like us to arrange.'
    },
    fa: {
      note: 'دموی تعاملی · درخواست و پرداختی ارسال نمی‌شود', required: 'لطفاً این قسمت را تکمیل کنید.',
      choose: 'لطفاً یک گزینه انتخاب کنید.', interests: 'حداقل یک علاقه‌مندی انتخاب کنید.', phone: 'شمارهٔ موبایل معتبر متناسب با کشور انتخاب‌شده وارد کنید.',
      email: 'نشانی ایمیل معتبر وارد کنید.', url: 'نشانی وب‌سایت معتبر وارد کنید.', birth: 'تاریخ تولد شمسی معتبر وارد کنید یا هر سه کادر را خالی بگذارید.', age: 'حداقل سن عضویت ۱۵ سال است.',
      terms: 'برای ثبت درخواست، هر دو مورد را تأیید کنید.', code: 'در این دمو کد ۱۲۳۴ را وارد کنید.',
      otpHint: 'کد دمو: ۱۲۳۴ · پیامکی ارسال نمی‌شود', resetTitle: 'انتخاب رمز عبور جدید', resetBody: 'این فرایند نمایشی است و رمز واقعی تغییر نمی‌کند.',
      confirmPassword: 'تکرار رمز عبور', resetCta: 'ثبت رمز نمایشی', password: 'حداقل ۸ نویسه وارد کنید.', mismatch: 'دو رمز واردشده یکسان نیستند.',
      date: 'انتخاب تاریخ دقیق', invalidDate: 'تاریخ معتبر در بازهٔ انتخاب‌شده وارد کنید.', invalidTime: 'یک ساعت آینده یا روز دیگر انتخاب کنید.',
      people: 'نفر', guests: 'مهمان‌ها', member: 'عضو نمونه · عضویت فعال · شمارهٔ ۰۰۱', resetSuccess: 'بازیابی رمز نمایشی انجام شد.',
      sent: 'درخواست در دمو تکمیل شد. اطلاعاتی برای باشگاه ارسال نشده است.', guestDone: 'فهرست مهمان‌ها در دمو ثبت شد. نامی ارسال نشده است.',
      concDone: 'درخواست در دمو ثبت شد. پیامی برای کانسیرژ ارسال نشده است.', topDone: 'درخواست شارژ نمایشی است؛ پرداختی انجام نشده است.',
      statementDone: 'درخواست صورت‌وضعیت نمایشی است؛ چیزی ارسال نشده است.', minDate: 'تاریخ', saved: 'رزرو در دمو ثبت شد؛ میز واقعی رزرو نشده است.',
      demoFirst: 'آرمان', demoLast: 'راد', digit: 'رقم کد', recovery: 'ادامه', names: 'نام حداقل یک مهمان را وارد کنید.', details: 'شرح درخواست خود را وارد کنید.'
    }
  };
  const node = field => document.querySelector('[data-field="'+field+'"]');
  const clearFieldError = el => {
    el.removeAttribute('aria-invalid');
    const id = el.getAttribute('aria-describedby');
    if (id && id.startsWith('error-')) { const message = document.getElementById(id); if (message) message.remove(); el.removeAttribute('aria-describedby'); }
  };
  const clearErrors = () => {
    document.querySelectorAll('.field-error').forEach(el=>el.remove());
    document.querySelectorAll('[aria-invalid]').forEach(clearFieldError);
  };
  const error = (field, message, focus=true) => {
    let el = node(field);
    if (!el) el = document.querySelector('.step .chip');
    if (!el) el = document.querySelector('.gold');
    if (!el) return false;
    el.setAttribute('aria-invalid','true');
    const id = 'error-'+field;
    const existing = document.getElementById(id); if (existing) existing.remove();
    const note = document.createElement('p'); note.className='field-error'; note.id=id; note.setAttribute('role','alert'); note.textContent=message;
    const anchor = el.closest('label') || (el.classList.contains('chip') ? el.parentElement : el);
    anchor.insertAdjacentElement('afterend',note); el.setAttribute('aria-describedby',id);
    if (focus) { el.focus({preventScroll:true}); el.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }
    return false;
  };
  const normalizeInput = (el, root) => {
    const converted = digits(el.value);
    if (el.inputMode !== 'numeric') { el.value=converted; return; }
    let val=converted.replace(/\D/g,'');
    const all=Array.from((el.closest('.otpin,.dob') || root).querySelectorAll('input[inputmode="numeric"]'));
    const i=all.indexOf(el);
    if (el.closest('.otpin') && val.length>1) {
      val.slice(0,4-i).split('').forEach((d,k)=>all[i+k].value=d);
      all[Math.min(i+val.length,all.length)-1].focus(); return;
    }
    el.value=val;
    const max=el.closest('.otpin') ? 1 : Number(el.maxLength);
    if (val.length>=max && all[i+1]) { all[i+1].focus(); all[i+1].select(); }
  };
  document.addEventListener('paste', e => {
    const el=e.target; if (!el.closest || !el.closest('.otpin')) return;
    const text=digits(e.clipboardData.getData('text')).replace(/\D/g,'');
    if (!text) return;
    e.preventDefault(); el.value=text; el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  document.addEventListener('keydown', e => {
    const el=e.target;
    if (e.key!=='Backspace' || !el.closest || !el.closest('.otpin,.dob') || el.value) return;
    const all=Array.from(el.closest('.otpin,.dob').querySelectorAll('input')), prev=all[all.indexOf(el)-1];
    if (prev) { e.preventDefault(); prev.value=''; prev.focus(); prev.dispatchEvent(new Event('input',{bubbles:true})); }
  });
  const validPhone = (value, cc) => {
    const raw=digits(value).replace(/[\s()\-]/g,'');
    const codes=['98','971','90','44','49','33','1','1'];
    const code=codes[cc || 0];
    let number=raw;
    if (number.startsWith('+'+code)) number=number.slice(code.length+1);
    else if (number.startsWith('00'+code)) number=number.slice(code.length+2);
    number=number.replace(/^0/,'');
    if (!/^\d+$/.test(number)) return false;
    if ((cc || 0)===0) return /^9\d{9}$/.test(number);
    const lengths={1:[9,9],2:[10,10],3:[10,10],4:[7,12],5:[9,9],6:[10,10],7:[10,10]};
    const range=lengths[cc] || [7,12]; return number.length>=range[0] && number.length<=range[1];
  };
  const validURL = value => { try { const u=new URL(/^https?:\/\//i.test(value)?value:'https://'+value); return ['http:','https:'].includes(u.protocol) && u.hostname.includes('.'); } catch (_) { return false; } };
  const birthDate = (day,month,year,lang) => {
    if (lang==='en') { const date=new Date(year,month-1,day); return date.getFullYear()===year && date.getMonth()===month-1 && date.getDate()===day ? date : null; }
    if (year<1200 || year>1600 || month<1 || month>12 || day<1 || day>31) return null;
    const fmt=new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric',month:'numeric',day:'numeric'});
    const date=new Date(year+621,0,1);
    for(let i=0;i<730;i++) { const parts=Object.fromEntries(fmt.formatToParts(date).map(p=>[p.type,p.value])); if (+parts.year===year && +parts.month===month && +parts.day===day) return new Date(date); date.setDate(date.getDate()+1); }
    return null;
  };
  function forView(view) {
    const values=()=>{ view.captureFields(); return view.fields; };
    const clear=keys=>keys.forEach(k=>{ const el=node(k); if(el) el.value=''; view.fields[k]=''; });
    const validateStep=(screen,state,lang) => {
      clearErrors(); const f=values(), m=strings[lang], val=k=>(f[k]||'').trim();
      const fail=(field,message)=>{ if(view.state.screen!==screen) view.setState({screen}); return error(field,message); };
      const required=keys=>{ for(const k of keys) if(!val(k)) return fail(k,m.required); return true; };
      if(screen==='s1') {
        if(!required(['first','last','mobile','country','city'])) return false;
        if(!validPhone(val('mobile'),state.cc)) return fail('mobile',m.phone);
        if(val('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) return fail('email',m.email);
        if(state.title == null) return fail('title',m.choose);
        if(val('birthDay')||val('birthMonth')||val('birthYear')) {
          const date=birthDate(+val('birthDay'),+val('birthMonth'),+val('birthYear'),f.birthCalendar||lang);
          if(!date || !val('birthYear')) return fail('birthDay',m.birth);
          const limit=new Date(); limit.setFullYear(limit.getFullYear()-15);
          if(date>limit) return fail('birthYear',m.age);
        }
      }
      if(screen==='s2') {
        if(state.field==null) return fail('field',m.choose);
        if(!required(['role'])) return false;
        for(const k of ['website','linkedin']) if(val(k) && !validURL(val(k))) return fail(k,m.url);
      }
      if(screen==='s3') {
        if(!required(['bio','why'])) return false;
        if(!Object.values(state.interests||{}).some(Boolean)) return fail('interests',m.interests);
      }
      if(screen==='s4' && val('refPhone') && !validPhone(val('refPhone'),state.refCc)) return fail('refPhone',m.phone);
      if(screen==='s5') {
        // Deep links remain useful, but final submission checks the complete application.
        for(const step of ['s1','s2','s3','s4']) {
          if(!validateStep(step,view.state,lang)) return false;
        }
        if(!f.agreeTerms || !f.agreeInfo) return fail(!f.agreeTerms?'agreeTerms':'agreeInfo',m.terms);
      }
      return true;
    };
    const enhance=(x,c) => {
      const m=strings[c.lang], s=c.state, f=view.fields;
      const sayNumber=value=>c.isFa?String(value).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]):String(value);
      const dateText=value=>new Intl.DateTimeFormat(c.isFa?'fa-IR':'en-GB',{year:'numeric',month:'short',day:'numeric'}).format(new Date(value+'T12:00:00'));
      const move=patch=>view.setState(patch);
      x.demoNote=m.note; x.otpHint=m.otpHint; x.isForgot=c.screen==='pg' && s.pg==='forgot';
      x.isReset=c.screen==='reset'; x.resetTitle=m.resetTitle; x.resetBody=m.resetBody; x.confirmPassword=m.confirmPassword; x.resetCta=m.resetCta;
      [1,2,3,4].forEach(i=>x['digit'+i]=m.digit+' '+sayNumber(i));
      x.memberDetails=m.member; x.memberNo=c.isFa?'عضو شمارهٔ ۰۰۱':'MEMBER Nº 001'; x.openHours=sayNumber('08:00 – 02:00');
      x.birthCalendarLabel=(f.birthCalendar||c.lang)==='fa'?'شمسی':'Gregorian';
      const sendCode=(field,cc,purpose)=>{
        clearErrors(); const f=values();
        if(!validPhone(f[field]||'',cc)) return error(field,m.phone);
        move({screen:'otp',otpPurpose:purpose,resendUntil:Date.now()+30000});
      };
      x.loginGo=()=>{
        if((s.mode || 'code')==='code') return sendCode('loginPhone',s.loginCc,'login');
        clearErrors();const f=values();
        if(!(f.loginId||'').trim()) return error('loginId',m.required);
        if(!(f.password||'')) return error('password',m.required);
        clear(['password']); move({screen:'m',tab:'home',sub:'',hist:[],menu:false,bal:false});
      };
      if(x.isForgot) { x.pg=Object.assign({},x.pg,{cta:()=>sendCode('forgotPhone',0,'reset')}); }
      if(c.screen==='sent') x.demoNote=m.sent;
      x.enter=()=>{
        clearErrors();const f=values();
        if(['otp0','otp1','otp2','otp3'].map(k=>f[k]||'').join('')!=='1234') return error('otp0',m.code);
        clear(['otp0','otp1','otp2','otp3']);
        move(s.otpPurpose==='reset'?{screen:'reset'}:{screen:'m',tab:'home',sub:'',hist:[],menu:false,bal:false});
      };
      x.savePassword=()=>{
        clearErrors();const f=values();
        if((f.newPassword||'').length<8) return error('newPassword',m.password);
        if(f.confirmPassword!==f.newPassword) return error('confirmPassword',m.mismatch);
        clear(['newPassword','confirmPassword']);
        move({screen:'login',mode:'pass',otpPurpose:'',toast:m.resetSuccess});
      };
      // Route concierge-only spaces through the concierge, with an editable request.
      x.zones=x.zones.map((z,i)=> i<5?Object.assign({},z,{go:()=>move({screen:'m',tab:'reserve',sub:'form',zone:i,sizeI:i===2?Math.min(s.sizeI==null?1:s.sizeI,3):(s.sizeI==null?1:s.sizeI)})}):Object.assign({},z,{go:()=>{
        f.concDetails=c.isFa?'درخواست هماهنگی برای '+z.t:'Please arrange '+z.t;
        move({screen:'m',tab:'concierge',sub:'',catI:7});
      }}));
      x.needsDate=(s.dayI||0)>=2; x.dateLabel=m.date;
      const today=new Date(), maxDate=new Date(); maxDate.setDate(today.getDate()+((s.dayI||0)===2?6:365));
      x.minDate=localDate(today); x.maxDate=localDate(maxDate);
      const sizeIndex=s.sizeI==null?1:s.sizeI;
      x.sizes=x.sizes.map((chip,i)=>Object.assign({},chip,{on:i===(c.zone===2?Math.min(sizeIndex,3):sizeIndex)?'true':'false'}));
      const currentTime=today.getHours()*60+today.getMinutes();
      x.times=x.times.map((chip,i)=> {
        const past=(s.dayI||0)===0 && +c.times[i].slice(0,2)*60 + +c.times[i].slice(3)<=currentTime;
        return Object.assign({},chip,{disabled:past?'disabled':null});
      });
      x.confirmResv=()=>{
        clearErrors();const f=values();
        if(c.zone>=5) { f.concDetails=c.isFa?'درخواست هماهنگی برای '+c.zoneName:'Please arrange '+c.zoneName; move({screen:'m',tab:'concierge',sub:'',catI:7}); return; }
        const day=s.dayI||0, time=s.timeI==null?3:s.timeI;
        let date=new Date(); date.setDate(date.getDate()+(day===1?1:0));let iso=localDate(date);
        if(day>=2) {
          iso=f.reserveDate||'';
          if(!/^\d{4}-\d{2}-\d{2}$/.test(iso) || iso<x.minDate || iso>x.maxDate || Number.isNaN(new Date(iso+'T12:00:00').getTime())) return error('reserveDate',m.invalidDate);
        }
        if(iso===localDate(today) && +c.times[time].slice(0,2)*60 + +c.times[time].slice(3)<=currentTime) return error('reserveDate',m.invalidTime);
        const count=c.zone===2?Math.min(sizeIndex,3)+1:(sizeIndex===5?'6+':sizeIndex+1);
        const reservation={zone:c.zone,date:iso,time:c.times[time],count:count,guests:(f.reserveGuests||'').trim()};
        move({screen:'m',tab:'reserve',sub:'done',done:'resv',reservation,resv:[c.zoneName,dateText(iso)+' · '+sayNumber(c.times[time])]});
      };
      if(s.reservation) {
        const r=s.reservation; const zoneNames=x.t.zones;
        x.visitTitle=zoneNames[r.zone][0]; x.visitSub=dateText(r.date)+' · '+sayNumber(r.time)+' · '+sayNumber(r.count)+' '+m.people;
        if((s.done||'resv')==='resv') {
          x.doneK=zoneNames[r.zone][0]; x.doneV=dateText(r.date)+' · '+sayNumber(r.time);
          x.doneDetail=sayNumber(r.count)+' '+m.people+(r.guests?'\n'+m.guests+': '+r.guests:'');
        }
      }
      x.sendConc=()=>{ clearErrors();const f=values(); if(!(f.concDetails||'').trim()) return error('concDetails',m.details); move({screen:'m',tab:'concierge',sub:'done',done:'conc',concReceipt:{details:f.concDetails,cat:s.catI||0,when:s.whenI||0}}); };
      x.sendGuests=()=>{ clearErrors();const f=values(); if(!(f.guestNames||'').trim()) return error('guestNames',m.names); move({screen:'m',tab:'account',sub:'done',done:'guests',guestReceipt:{names:f.guestNames,day:s.dayI||0}}); };
      if(s.sub==='done') {
        x.doneBody={resv:m.saved,conc:m.concDone,guests:m.guestDone,top:m.topDone,st:m.statementDone}[s.done||'resv'];
        if(s.done==='conc' && s.concReceipt) { x.doneV=x.t.cats[s.concReceipt.cat]; x.doneDetail=s.concReceipt.details+'\n'+x.t.whens[s.concReceipt.when]; }
        if(s.done==='guests' && s.guestReceipt) x.doneDetail=s.guestReceipt.names;
      }
      const logout=x.accRows[x.accRows.length-1];
      logout.go=()=>{
        ['loginPhone','loginId','password','newPassword','confirmPassword','otp0','otp1','otp2','otp3','reserveGuests','guestNames','concDetails'].forEach(k=>delete f[k]);
        // Remove mounted fields before rendering so the runtime cannot capture cleared secrets again.
        document.querySelectorAll('[data-field]').forEach(el=>{if(!(el.dataset.field in f)){el.value='';}});
        move({screen:'home',hist:[],tab:'home',sub:'',menu:false,bal:false,reservation:null,resv:null,rsvp:{},concReceipt:null,guestReceipt:null});
      };
      x.digitLabel=m.digit;
    };
    return {validateStep,enhance};
  }
  const convertBirthFields=(view,lang)=>{
    const f=view.fields;
    const date=birthDate(+f.birthDay,+f.birthMonth,+f.birthYear,f.birthCalendar||view.state.lang);
    if(!date) return;
    const parts=Object.fromEntries(new Intl.DateTimeFormat(lang==='fa'?'en-US-u-ca-persian':'en-US',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date).map(p=>[p.type,p.value]));
    for(const [field,key] of [['birthDay','day'],['birthMonth','month'],['birthYear','year']]) { f[field]=parts[key]; const el=node(field); if(el) el.value=parts[key]; }
    f.birthCalendar=lang;
  };
  return {forView,normalizeInput,clearFieldError,digits,convertBirthFields};
})();
