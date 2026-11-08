'use strict';
const intro = document.getElementById('intro');
const video = document.getElementById('opening-video');
const content = document.querySelector('main.sections');
const enterButton = document.getElementById('enter-button');
const soundButton = document.getElementById('sound-button');
const playButton = document.getElementById('play-button');
const videoError = document.getElementById('video-error');
const languageGate = document.getElementById('language-gate');
const languageNav = document.querySelector('.language-switch');
let openingStarted = false;
let videoRequest = 0;
let stallTimer;
content.setAttribute('aria-hidden', 'true');
content.inert = true;

function syncSoundButton() {
  soundButton.setAttribute('aria-pressed', String(!video.muted));
  window.WeddingI18n.updateSoundLabel();
}
function introActive() { return openingStarted && !intro.hidden && !intro.classList.contains('is-leaving'); }
function attemptPlayback(allowMutedRetry = true) {
  if (!introActive()) return;
  const request = videoRequest;
  const attempt = video.play();
  if (!attempt || typeof attempt.catch !== 'function') return;
  attempt.then(() => {
    if (request === videoRequest) { playButton.hidden = true; syncSoundButton(); }
  }).catch(() => {
    if (request !== videoRequest || !introActive()) return;
    if (!video.muted && allowMutedRetry) {
      video.muted = true; syncSoundButton(); attemptPlayback(false);
    } else playButton.hidden = false;
  });
}
function loadVideo(language) {
  const request = ++videoRequest;
  clearTimeout(stallTimer);
  video.pause();
  // Set both properties and HTML attributes before assigning the media source.
  video.defaultMuted = true;
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  try { video.volume = 1; } catch {}
  video.src = language === 'en' ? 'assets/wedding-en.mp4' : 'assets/wedding-ar.mp4';
  video.preload = 'auto'; video.load();
  playButton.hidden = true; videoError.hidden = true;
  soundButton.hidden = false;
  syncSoundButton();
  attemptPlayback();
  stallTimer = setTimeout(() => {
    if (request === videoRequest && introActive() && video.paused && !video.ended) playButton.hidden = false;
  }, 6000);
}
function beginInvitation(language) {
  window.WeddingI18n.setLanguage(language);
  openingStarted = true;
  languageGate.hidden = true; languageNav.hidden = false; intro.hidden = false;
  document.body.classList.remove('language-pending');
  loadVideo(language);
  enterButton.focus({ preventScroll: true });
}
document.querySelectorAll('[data-start-language]').forEach(button => {
  button.addEventListener('click', () => beginInvitation(button.dataset.startLanguage));
});
window.addEventListener('wedding:languagechange', () => {
  if (introActive()) loadVideo(document.documentElement.lang);
});
soundButton.addEventListener('click', () => {
  video.muted = soundButton.getAttribute('aria-pressed') === 'true';
  syncSoundButton();
  if (video.paused) {
    if (video.ended) video.currentTime = 0;
    attemptPlayback();
  }
});
playButton.addEventListener('click', () => {
  if (video.ended) video.currentTime = 0;
  video.muted = false; syncSoundButton(); attemptPlayback();
});
function retryWhenReady() {
  if (introActive() && video.paused && !video.ended && video.muted) attemptPlayback();
}
video.addEventListener('loadeddata', retryWhenReady);
video.addEventListener('canplay', retryWhenReady);
window.addEventListener('pageshow', retryWhenReady);
document.addEventListener('visibilitychange', () => { if (!document.hidden) retryWhenReady(); });
video.addEventListener('playing', () => {
  clearTimeout(stallTimer); playButton.hidden = true; videoError.hidden = true;
});
video.addEventListener('error', () => {
  clearTimeout(stallTimer);
  if (introActive()) { videoError.hidden = false; playButton.hidden = true; }
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
  clearTimeout(stallTimer);
  video.pause(); intro.hidden = true;
  document.body.classList.remove('intro-open');
  content.inert = false; content.removeAttribute('aria-hidden');
  content.classList.remove('is-entering');
  content.querySelector('h1').focus({ preventScroll: true });
}
// Standard URL waits for a choice; a language-specific URL starts directly.
if (window.WeddingI18n.directLanguage) beginInvitation(window.WeddingI18n.directLanguage);
