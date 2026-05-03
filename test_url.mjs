import fetch from 'node-fetch';

fetch('https://nominatim.openstreetmap.org/search?q=Kapodra+Patiya+Surat&format=json')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(console.error);
