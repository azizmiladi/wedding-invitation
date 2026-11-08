'use strict';
const intro = document.getElementById('intro');
const video = document.getElementById('opening-video');
const content = document.querySelector('main.sections');
const enterButton = document.getElementById('enter-button');
const soundButton = document.getElementById('sound-button');
const languageGate = document.getElementById('language-gate');
const languageNav = document.querySelector('.language-switch');
let openingStarted = false;
let videoRequest = 0;
content.setAttribute('aria-hidden', 'true');
content.inert = true;

function syncSoundButton() {
  soundButton.setAttribute('aria-pressed', String(!video.muted));
  window.WeddingI18n.updateSoundLabel();
}
function loadVideo(language, fromTap) {
  const request = ++videoRequest;
  video.pause();
  video.src = language === 'en' ? 'assets/wedding-en.mp4' : 'assets/wedding-ar.mp4';
  video.preload = 'auto'; video.volume = 1; video.muted = !fromTap; video.load();
  soundButton.hidden = false;
  syncSoundButton();
  const attempt = video.play();
  if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {
    if (request !== videoRequest) return;
    video.muted = true; syncSoundButton();
    const fallback = video.play();
    if (fallback && typeof fallback.catch === 'function') fallback.catch(() => {});
  });
}
function beginInvitation(language, fromTap) {
  window.WeddingI18n.setLanguage(language);
  openingStarted = true;
  languageGate.hidden = true; languageNav.hidden = false; intro.hidden = false;
  document.body.classList.remove('language-pending');
  loadVideo(language, fromTap);
  enterButton.focus({ preventScroll: true });
}
document.querySelectorAll('[data-start-language]').forEach(button => {
  button.addEventListener('click', () => beginInvitation(button.dataset.startLanguage, true));
});
window.addEventListener('wedding:languagechange', () => {
  if (openingStarted && !intro.hidden && !intro.classList.contains('is-leaving')) loadVideo(document.documentElement.lang, true);
});
soundButton.addEventListener('click', () => {
  video.muted = soundButton.getAttribute('aria-pressed') === 'true';
  syncSoundButton();
  if (video.paused) {
    if (video.ended) video.currentTime = 0;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  }
});
video.addEventListener('ended', () => { soundButton.hidden = true; });
enterButton.addEventListener('click', () => {
  if (enterButton.disabled) return;
  enterButton.disabled = true; soundButton.disabled = true;
  window.scrollTo(0, 0);
  content.classList.add('is-entering'); intro.classList.add('is-leaving');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finishOpening(); return; }
  const initialVolume = video.volume, startedAt = performance.now();
  const fadeAudio = setInterval(() => {
    const progress = Math.min(1, (performance.now() - startedAt) / 700);
    video.volume = initialVolume * (1 - progress);
    if (progress === 1) clearInterval(fadeAudio);
  }, 50);
  setTimeout(() => { clearInterval(fadeAudio); finishOpening(); }, 900);
});
function finishOpening() {
  video.pause(); intro.hidden = true;
  document.body.classList.remove('intro-open');
  content.inert = false; content.removeAttribute('aria-hidden');
  content.classList.remove('is-entering');
  content.querySelector('h1').focus({ preventScroll: true });
}
// Standard URL waits for a choice; a language-specific URL starts directly.
if (window.WeddingI18n.directLanguage) beginInvitation(window.WeddingI18n.directLanguage, false);
