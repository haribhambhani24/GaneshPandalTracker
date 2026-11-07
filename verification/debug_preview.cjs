const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function test() {
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], { shell: true, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 2000));

  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('[Browser Console]:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[Browser PageError]:', err.message));

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' });
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML snippet:', html.slice(0, 300));
  await browser.close();
  preview.kill();
}

test();

