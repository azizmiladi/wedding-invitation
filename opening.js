'use strict';

const intro = document.getElementById('intro');
const video = document.getElementById('opening-video');
const content = document.querySelector('main.sections');
const enterButton = document.getElementById('enter-button');
const playButton = document.getElementById('play-button');

content.setAttribute('aria-hidden', 'true');
content.inert = true;

function playOpening(fromTap = false) {
  if (video.ended) video.currentTime = 0;
  video.muted = false;
  const attempt = video.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.then(() => { playButton.hidden = true; })
      .catch(() => {
        playButton.hidden = false;
        if (!fromTap) {
          // If sound blocks autoplay, keep the opening moving until a guest taps play.
          video.muted = true;
          const silentAttempt = video.play();
          if (silentAttempt && typeof silentAttempt.catch === 'function') silentAttempt.catch(() => {});
        }
      });
  }
}

playOpening();
playButton.addEventListener('click', () => playOpening(true));

enterButton.addEventListener('click', () => {
  enterButton.disabled = true;
  playButton.disabled = true;
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
