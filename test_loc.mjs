import fetch from 'node-fetch';

fetch('https://nominatim.openstreetmap.org/search?q=Opp.+Police+Station,+Surat&format=json')
  .then(r => r.json())
  .then(d => d.length ? console.log(d[0]) : console.log("Not found"));
