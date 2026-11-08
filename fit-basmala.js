'use strict';

const heading = document.querySelector('.basmala');
const word = heading.querySelector('span');

function fitBasmala() {
  word.style.transform = 'none';
  const naturalWidth = word.getBoundingClientRect().width;
  const spaceInsideFrame = Math.max(80, heading.clientWidth - 56);
  if (naturalWidth > 0) {
    word.style.transform = `scale(${Math.min(1, spaceInsideFrame / naturalWidth)})`;
  }
}

fitBasmala();
document.fonts.ready.then(fitBasmala);
window.addEventListener('resize', fitBasmala, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(fitBasmala).observe(heading);
