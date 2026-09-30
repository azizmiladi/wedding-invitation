'use strict';

// The date is given in Tunisian local time. Add the confirmed venue later.
const WEDDING = {
  dateISO: '2027-03-21T17:00:00+01:00',
  venueName: '',
  mapQuery: ''
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
    document.querySelector('.countdown-heading').textContent = 'حان موعد حفل الزفاف';
    clearInterval(countdownTimer);
  }
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

if (WEDDING.venueName) {
  document.getElementById('venue-name').textContent = WEDDING.venueName;
}
const mapSearch = WEDDING.mapQuery || WEDDING.venueName;
if (mapSearch) {
  const map = document.getElementById('venue-map');
  map.src = `https://www.google.com/maps?q=${encodeURIComponent(mapSearch)}&output=embed`;
  map.hidden = false;
  document.getElementById('map-placeholder').hidden = true;
}
