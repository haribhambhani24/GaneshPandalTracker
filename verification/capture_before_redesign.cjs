const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('verification/redesign');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const SCREENS = [
  { route: '/', name: 'home' },
  { route: '/pandal/lalbaugcha-raja', name: 'detail' },
  { route: '/submit', name: 'submit' },
  { route: '/admin', name: 'admin' },
];

const VIEWPORTS = [
  { width: 390, height: 844, isMobile: true, label: '390px' },
  { width: 1280, height: 800, isMobile: false, label: '1280px' },
];

const THEMES = ['light', 'dark'];

async function run() {
  console.log('Capturing BEFORE screenshots across all screens, viewports, and themes...');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      deviceScaleFactor: 2,
    });

    for (const theme of THEMES) {
      for (const screen of SCREENS) {
        const url = `http://localhost:5173${screen.route}`;
        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.evaluate((t) => {
          localStorage.setItem('ganesh_pandal_tracker_theme', t);
          const root = document.documentElement;
          if (t === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
          } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
          }
        }, theme);

        await page.reload({ waitUntil: 'networkidle2' });
        await new Promise((r) => setTimeout(r, 600));

        const fileName = `before-${screen.name}-${vp.label}-${theme}.png`;
        const filePath = path.join(outDir, fileName);
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(`Captured: ${fileName}`);
      }
    }
  }

  await browser.close();
  console.log('--- ALL BEFORE SCREENSHOTS CAPTURED ---');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

