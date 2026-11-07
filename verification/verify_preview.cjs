const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function waitForServer(port, timeoutMs = 10000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(`http://localhost:${port}`, () => {
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Timeout waiting for preview server'));
        } else {
          setTimeout(check, 300);
        }
      });
      req.end();
    };
    check();
  });
}

async function run() {
  console.log('Spawning vite preview on port 4173...');
  const previewProcess = spawn('npx.cmd', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    shell: true,
    stdio: 'pipe'
  });

  previewProcess.stdout.on('data', (d) => console.log(`[preview stdout]: ${d.toString().trim()}`));
  previewProcess.stderr.on('data', (d) => console.error(`[preview stderr]: ${d.toString().trim()}`));

  try {
    await waitForServer(4173);
    console.log('Preview server ready at http://localhost:4173');

    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const consoleLogs = [];
    const pageErrors = [];

    page.on('console', msg => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });
    page.on('pageerror', err => {
      pageErrors.push(err.message);
    });

    console.log('Navigating to http://localhost:4173...');
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' });

    console.log('Waiting for .leaflet-container...');
    await page.waitForSelector('.leaflet-container', { timeout: 10000 });

    console.log('Checking page title...');
    const title = await page.title();
    console.log(`Page title: "${title}"`);

    const hasMap = await page.evaluate(() => !!document.querySelector('.leaflet-container'));
    console.log(`Leaflet map rendered in production build: ${hasMap}`);

    const markersCount = await page.evaluate(() => document.querySelectorAll('.leaflet-marker-icon').length);
    console.log(`Leaflet map markers rendered: ${markersCount}`);

    console.log(`Console logs recorded: ${consoleLogs.length}`);
    consoleLogs.forEach(l => console.log(`[Browser ${l.type}]: ${l.text}`));

    console.log(`Page errors recorded: ${pageErrors.length}`);
    if (pageErrors.length > 0) {
      pageErrors.forEach(e => console.error(`[Page Error]: ${e}`));
    }

    await browser.close();
    console.log('--- PREVIEW VERIFICATION SUCCESSFUL ---');
  } catch (err) {
    console.error('Preview verification failed:', err);
    process.exitCode = 1;
  } finally {
    console.log('Stopping preview process...');
    previewProcess.kill('SIGTERM');
  }
}

run();
