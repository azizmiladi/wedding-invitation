'use strict';

const intro = document.getElementById('intro');
const video = document.getElementById('opening-video');
const content = document.querySelector('main.sections');
const enterButton = document.getElementById('enter-button');
const soundButton = document.getElementById('sound-button');
const playButton = document.getElementById('play-button');

content.setAttribute('aria-hidden', 'true');
content.inert = true;

function playOpening() {
  const attempt = video.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.then(() => { playButton.hidden = true; })
      .catch(() => { playButton.hidden = false; });
  }
}

playOpening();
playButton.addEventListener('click', playOpening);

soundButton.addEventListener('click', () => {
  video.muted = !video.muted;
  soundButton.textContent = video.muted ? 'تشغيل الصوت' : 'كتم الصوت';
  if (video.paused && !video.ended) playOpening();
});

enterButton.addEventListener('click', () => {
  video.pause();
  intro.hidden = true;
  document.body.classList.remove('intro-open');
  content.inert = false;
  content.removeAttribute('aria-hidden');
  window.scrollTo(0, 0);
  content.querySelector('h1').focus({ preventScroll: true });
});
