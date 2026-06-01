const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('dialog', async dialog => {
    console.log('DIALOG MESSAGE:', dialog.message());
    await dialog.accept();
  });
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000/#/registration', { waitUntil: 'networkidle0' });
  
  await page.type('input[placeholder="Please enter email or phone number"]', 'testuser123');
  await page.type('input[placeholder="Please enter the password"]', 'secretpass');
  await page.type('input[placeholder="Please enter the confirm Password"]', 'secretpass');

  // click sign up
  const buttons = await page.$$('button');
  for (let btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.trim() === 'Sign up') {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
