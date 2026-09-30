'use strict';

const intro = document.getElementById('intro');
const video = document.getElementById('opening-video');
const content = document.querySelector('main.sections');
const enterButton = document.getElementById('enter-button');
const soundButton = document.getElementById('sound-button');
const SEEN_KEY = 'wedding-intro-seen';

content.setAttribute('aria-hidden', 'true');
content.inert = true;

// Returning guests: skip straight past the intro instead of replaying it.
if (sessionStorage.getItem(SEEN_KEY)) {
  intro.hidden = true;
  document.body.classList.remove('intro-open');
  content.inert = false;
  content.removeAttribute('aria-hidden');
} else {
  startIntro();
}

function startIntro() {
  // Muted autoplay works everywhere (iOS/Chrome/Firefox); sound is opt-in via the button.
  const attempt = video.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(() => {
      // Even muted autoplay was blocked (e.g. data-saver) - don't strand the guest on a black screen.
      revealFallback();
    });
  }
  soundButton.hidden = false;

  // If the video never starts playing (slow network, decode error), let people in anyway.
  const stallTimer = setTimeout(revealFallback, 6000);
  video.addEventListener('playing', () => clearTimeout(stallTimer), { once: true });
  video.addEventListener('error', () => { clearTimeout(stallTimer); revealFallback(); }, { once: true });

  video.addEventListener('ended', () => { soundButton.hidden = true; });
}

function revealFallback() {
  soundButton.hidden = true;
}

soundButton.addEventListener('click', () => {
  const wantsSound = soundButton.getAttribute('aria-pressed') !== 'true';
  video.muted = !wantsSound;
  soundButton.setAttribute('aria-pressed', String(wantsSound));
  soundButton.textContent = wantsSound ? '🔊 إيقاف الصوت' : '🔈 تشغيل الصوت';
});

enterButton.addEventListener('click', () => {
  enterButton.disabled = true;
  soundButton.disabled = true;
  sessionStorage.setItem(SEEN_KEY, '1');
  window.scrollTo(0, 0);
  content.classList.add('is-entering');
  intro.classList.add('is-leaving');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    finishOpening();
    return;
  }

  const initialVolume = video.volume;
  const startedAt = performance.now();
  const fadeAudio = setInterval(() => {
    const progress = Math.min(1, (performance.now() - startedAt) / 700);
    video.volume = initialVolume * (1 - progress);
    if (progress === 1) clearInterval(fadeAudio);
  }, 50);

  setTimeout(() => {
    clearInterval(fadeAudio);
    finishOpening();
  }, 900);
});

function finishOpening() {
  video.pause();
  intro.hidden = true;
  document.body.classList.remove('intro-open');
  content.inert = false;
  content.removeAttribute('aria-hidden');
  content.classList.remove('is-entering');
  content.querySelector('h1').focus({ preventScroll: true });
}
