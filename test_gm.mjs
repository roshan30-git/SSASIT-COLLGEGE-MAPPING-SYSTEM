import https from 'https';
https.get('https://maps.app.goo.gl/epycCp5EYGiMya48A?g_st=ac', (res) => {
  console.log(res.headers.location);
});
