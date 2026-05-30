import https from 'node:https';
import fs from 'node:fs';
https.get('https://cdn.worldvectorlogo.com/logos/equinor.svg', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
