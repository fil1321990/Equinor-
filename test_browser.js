import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://127.0.0.1:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  // click checkin
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const checkinBtn = btns.find(b => b.innerText.includes('Check in'));
    if (checkinBtn) checkinBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  const html = await page.evaluate(() => {
    const el = document.getElementById('root');
    return el ? el.innerHTML : 'no root';
  });
  console.log("HTML START\n" + html.substring(0, 1000) + "\nHTML END");
  
  await browser.close();
})();
