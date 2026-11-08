'use strict';

(() => {
  const translations = {
    ar: {
      title: 'دعوة زفاف محمد العزيز وأمينة',
      description: 'يسرنا دعوتكم لحضور حفل زفاف محمد العزيز وأمينة، يوم 2 ماي 2027 في Espace Ennassim la Marsa.',
      videoLabel: 'فيديو افتتاح دعوة الزفاف', videoFallback: 'متصفحك لا يدعم تشغيل الفيديو.',
      enter: 'الدخول إلى الدعوة', soundOn: '🔈 تشغيل الصوت', soundOff: '🔊 إيقاف الصوت', playVideo: 'تشغيل الفيديو', videoError: 'تعذر تحميل الفيديو. يمكنك متابعة الدعوة بالزر أدناه.',
      sectionsLabel: 'أقسام الدعوة', firstSection: 'القسم الأول', invitationText: 'نص الدعوة',
      familiesIntro: 'يسر عائلتا',
      groomFamily: 'سامي الميلادي وحرمه سنية الهواق',
      brideFamily: 'صبري القروي وحرمه مهنية لعبيدي',
      message: 'أن تشارككم أجمل لحظات العمر وتتشرف بحضوركم',
      wedding: 'حفل زفاف', groom: 'محمد العزيز', bride: 'أمينة', couple: 'محمد العزيز وأمينة', and: 'و', coupleConnector: 'و',
      closing: 'وذلك بمشيئة الله تعالى', dateTitle: 'الموعد', date: '2 ماي 2027',
      timeLabel: 'الساعة', time: '17:00', countdown: 'الوقت المتبقي لحفل الزفاف',
      days: 'يوم', hours: 'ساعة', minutes: 'دقيقة', seconds: 'ثانية', started: 'حان موعد حفل الزفاف',
      placeTitle: 'المكان', mapTitle: 'خريطة مكان الحفل',
      mapPlaceholder: 'ستظهر الخريطة هنا عند تحديد المكان', mapLink: 'فتح الموقع في خرائط Google ↗'
    },
    en: {
      title: 'Mohamed Aziz & Amina — Wedding Invitation',
      description: 'Join us for the wedding of Mohamed Aziz and Amina on 2 May 2027 at Espace Ennassim la Marsa.',
      videoLabel: 'Wedding invitation opening video', videoFallback: 'Your browser does not support video playback.',
      enter: 'Open the invitation', soundOn: '🔈 Enable sound', soundOff: '🔊 Mute sound', playVideo: 'Play video', videoError: 'The video could not load. You can still open the invitation below.',
      sectionsLabel: 'Wedding invitation', firstSection: 'Opening blessing', invitationText: 'Invitation text',
      familiesIntro: 'Together with their families,',
      groomFamily: 'Sami Miladi and Sonia Lahouague',
      brideFamily: 'Sabri Karoui and Mhenia Laabidi',
      message: 'would love for you to join them\nin celebrating their wedding',
      wedding: 'the wedding of their children', groom: 'Mohamed Aziz', bride: 'Amina', couple: 'Mohamed Aziz and Amina', and: 'and', coupleConnector: '&',
      closing: 'By the will of Allah', dateTitle: 'Date & time', date: 'Sunday, 2 May 2027',
      timeLabel: 'at', time: '5 PM', countdown: 'Counting down to our wedding',
      days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', started: 'Our wedding day is here',
      placeTitle: 'Location', mapTitle: 'Wedding venue map',
      mapPlaceholder: 'The venue map will appear here', mapLink: 'Open in Google Maps ↗'
    }
  };
  let language = 'ar';
  function t(key) { return translations[language][key] ?? key; }
  function updateSoundLabel() {
    const button = document.getElementById('sound-button');
    if (button) button.textContent = t(button.getAttribute('aria-pressed') === 'true' ? 'soundOff' : 'soundOn');
  }
  function setLanguage(value) {
    language = value === 'en' ? 'en' : 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    for (const attribute of ['aria-label', 'title']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
      });
    }
    document.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    document.querySelectorAll('.waw').forEach(element => { element.lang = language; });
    document.querySelectorAll('[data-ar-only]').forEach(element => { element.hidden = language === 'en'; });
    const couple = document.querySelector('.couple-names');
    if (language === 'en') document.querySelector('.invitation-message').before(couple);
    else document.querySelector('.wedding-heading').after(couple);
    document.querySelector('.enter-arrow').textContent = language === 'en' ? '→' : '←';
    document.title = t('title');
    document.querySelector('meta[property="og:title"]').content = t('title');
    document.querySelector('meta[name="description"]').content = t('description');
    document.querySelector('meta[property="og:description"]').content = t('description');
    updateSoundLabel();
    try { localStorage.setItem('wedding-language', language); } catch {}
    window.dispatchEvent(new Event('wedding:languagechange'));
    if (typeof window.fitBasmala === 'function') requestAnimationFrame(window.fitBasmala);
  }
  window.WeddingI18n = { t, setLanguage, updateSoundLabel };
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });
  let saved = 'ar';
  try { saved = localStorage.getItem('wedding-language') || 'ar'; } catch {}
  const requested = new URLSearchParams(location.search).get('lang');
  window.WeddingI18n.directLanguage = ['ar', 'en'].includes(requested) ? requested : null;
  setLanguage(requested || saved);
})();
