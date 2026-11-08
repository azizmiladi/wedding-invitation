'use strict';

// Event time is in Tunisia local time; the exact Maps link stays in the page.
const WEDDING = {
  dateISO: '2027-05-02T17:00:00+01:00',
  venueName: 'Espace Ennassim la Marsa',
  mapQuery: 'Espace Ennassim la Marsa, Tunisia'
};

const target = new Date(WEDDING.dateISO).getTime();
const fields = {
  days: document.getElementById('countdown-days'),
  hours: document.getElementById('countdown-hours'),
  minutes: document.getElementById('countdown-minutes'),
  seconds: document.getElementById('countdown-seconds')
};

function updateCountdown() {
  let remaining = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const days = Math.floor(remaining / 86400);
  remaining %= 86400;
  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  for (const [part, value] of Object.entries({ days, hours, minutes, seconds })) {
    fields[part].textContent = String(value).padStart(2, '0');
  }
  if (target <= Date.now()) {
    document.querySelector('.countdown-heading').textContent = window.WeddingI18n.t('started');
    clearInterval(countdownTimer);
  }
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();
window.addEventListener('wedding:languagechange', updateCountdown);

if (WEDDING.venueName) {
  document.getElementById('venue-name').textContent = WEDDING.venueName;
}
const mapSearch = WEDDING.mapQuery || WEDDING.venueName;
function loadMap() {
  if (!mapSearch) return;
  const map = document.getElementById('venue-map');
  if (map.src) return;
  map.src = `https://www.google.com/maps?q=${encodeURIComponent(mapSearch)}&output=embed`;
  map.hidden = false;
  document.getElementById('map-placeholder').hidden = true;
}
// The map is heavy: load it only once the guest has entered the invitation,
// so it does not compete with the opening video for bandwidth.
if (document.body.classList.contains('intro-open')) {
  window.addEventListener('wedding:opened', loadMap, { once: true });
} else {
  loadMap();
}
