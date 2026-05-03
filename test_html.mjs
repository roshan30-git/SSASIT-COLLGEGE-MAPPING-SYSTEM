import fetch from 'node-fetch';

async function main() {
  const url = 'https://www.google.com/search?q=SSASIT+Surat+coordinates';
  const html = await fetch(url).then(r => r.text());
  const match = html.match(/-?\d{2}\.\d{4,},\s*-?\d{2}\.\d{4,}/g);
  if (match) {
    console.log(match);
  } else {
    console.log("no match");
  }
}
main();
