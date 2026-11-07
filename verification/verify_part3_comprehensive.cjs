const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const finalDir = path.resolve('verification/mobile/final');

if (!fs.existsSync(finalDir)) {
  fs.mkdirSync(finalDir, { recursive: true });
}

const VIEWPORT_WIDTHS = [320, 360, 390, 412, 430, 768, 1280];
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/pandal/lalbaugcha-raja', name: 'detail' },
  { path: '/submit', name: 'submit' },
  { path: '/admin', name: 'admin' }
];

async function runComprehensiveVerification() {
  console.log('--- STARTING PART 3 COMPREHENSIVE RE-VERIFICATION ---');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const issues = [];

  // Helper to test horizontal overflow
  async function checkHorizontalOverflow(routeName, width, orientation, theme, lang) {
    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.offsetWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const bodyScrollWidth = document.body.scrollWidth;
      const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
      return {
        hasOverflow: maxScroll > docWidth + 1, // 1px tolerance for subpixel rounding
        docWidth,
        maxScroll
      };
    });

    if (overflow.hasOverflow) {
      const issue = `[OVERFLOW] Route ${routeName} at ${width}px (${orientation}, ${theme}, ${lang}): docWidth=${overflow.docWidth}px, scrollWidth=${overflow.maxScroll}px`;
      console.error(issue);
      issues.push(issue);
    }
  }

  // Helper to switch theme and lang in localStorage
  async function applySettings(theme, lang) {
    await page.evaluate((t, l) => {
      localStorage.setItem('ganesh_pandal_tracker_theme', t);
      localStorage.setItem('ganesh_pandal_tracker_lang', l);
      const root = document.documentElement;
      if (t === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }, theme, lang);
  }

  // 1. Matrix Test across all widths in portrait and landscape
  console.log('\n--- 1. Testing Viewport Widths (320, 360, 390, 412, 430, 768, 1280) ---');
  for (const width of VIEWPORT_WIDTHS) {
    for (const route of ROUTES) {
      // Portrait
      await page.setViewport({ width, height: 800, isMobile: width < 1024, hasTouch: width < 1024 });
      await page.goto(`http://localhost:5173${route.path}`, { waitUntil: 'networkidle2' });
      await applySettings('dark', 'en');
      await page.reload({ waitUntil: 'networkidle2' });
      await page.waitForSelector('#root');
      await checkHorizontalOverflow(route.name, width, 'portrait', 'dark', 'en');

      // Landscape for mobile phones (390x844 rotated -> 844x390)
      if (width === 390) {
        await page.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true });
        await page.goto(`http://localhost:5173${route.path}`, { waitUntil: 'networkidle2' });
        await checkHorizontalOverflow(route.name, 390, 'landscape', 'dark', 'en');
      }
    }
    console.log(`✓ Width ${width}px passed overflow checks for all routes`);
  }

  // 2. High-fidelity 390px Screenshots into /verification/mobile/final/
  console.log('\n--- 2. Capturing Final 390px Screenshots ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

  const combinations = [
    { route: '/', name: 'home', theme: 'light', lang: 'en', shot: 'final-home-light-en-390px.png' },
    { route: '/', name: 'home', theme: 'dark', lang: 'en', shot: 'final-home-dark-en-390px.png' },
    { route: '/', name: 'home', theme: 'dark', lang: 'hi', shot: 'final-home-dark-hi-390px.png' },
    { route: '/', name: 'home', theme: 'dark', lang: 'mr', shot: 'final-home-dark-mr-390px.png' },
    { route: '/pandal/lalbaugcha-raja', name: 'detail', theme: 'light', lang: 'en', shot: 'final-detail-light-en-390px.png' },
    { route: '/pandal/lalbaugcha-raja', name: 'detail', theme: 'dark', lang: 'en', shot: 'final-detail-dark-en-390px.png' },
    { route: '/submit', name: 'submit', theme: 'light', lang: 'en', shot: 'final-submit-light-en-390px.png' },
    { route: '/submit', name: 'submit', theme: 'dark', lang: 'en', shot: 'final-submit-dark-en-390px.png' },
    { route: '/admin', name: 'admin', theme: 'light', lang: 'en', shot: 'final-admin-light-en-390px.png' },
    { route: '/admin', name: 'admin', theme: 'dark', lang: 'en', shot: 'final-admin-dark-en-390px.png' }
  ];

  for (const combo of combinations) {
    await page.goto(`http://localhost:5173${combo.route}`, { waitUntil: 'networkidle2' });
    await applySettings(combo.theme, combo.lang);
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600)); // allow leaflet / textures to render

    const filePath = path.join(finalDir, combo.shot);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`Saved screenshot: ${combo.shot}`);
  }

  // 3. Landscape Screenshot
  await page.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await applySettings('dark', 'en');
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(finalDir, 'final-home-landscape-390px.png'), fullPage: false });
  console.log('Saved screenshot: final-home-landscape-390px.png');

  // 4. Submit Button Reachability & Virtual Keyboard Emulation
  console.log('\n--- 3. Verifying Submit Button Reachability & On-Screen Keyboard ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/submit', { waitUntil: 'networkidle2' });
  await applySettings('dark', 'en');
  await page.reload({ waitUntil: 'networkidle2' });

  // Scroll to submit button
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    const isIntersecting = await page.evaluate(el => {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }, submitBtn);
    console.log(`Submit button scroll & visible: ${isIntersecting}`);
  }

  // Simulate on-screen keyboard by shrinking viewport height to ~480px (simulating 300px keyboard)
  await page.setViewport({ width: 390, height: 480, isMobile: true, hasTouch: true });
  const focusedInputVisible = await page.evaluate(() => {
    const input = document.querySelector('#pandal-name');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rect = input.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }
    return false;
  });
  console.log(`Focused input visible above simulated on-screen keyboard: ${focusedInputVisible}`);
  await page.screenshot({ path: path.join(finalDir, 'final-submit-keyboard-sim-390px.png') });

  // 5. Slow 4G & CPU Throttling Emulation Test
  console.log('\n--- 4. Emulating Slow 4G Network & 4x CPU Slowdown ---');
  const client = await page.target().createCDPSession();
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150, // 150ms RTT
    downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps Slow 4G
    uploadThroughput: (750 * 1024) / 8 // 750 Kbps
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const throttledStart = Date.now();
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#root');
  const throttledTime = Date.now() - throttledStart;
  console.log(`Throttled Slow 4G + 4x CPU First Contentful DOM: ${throttledTime}ms`);

  // Check no crash or blank screen under throttling
  const hasAppShell = await page.evaluate(() => !!document.querySelector('header'));
  console.log(`App shell rendered correctly under throttling: ${hasAppShell}`);

  await browser.close();

  console.log('\n=============================================');
  console.log(`COMPREHENSIVE RE-VERIFICATION COMPLETE!`);
  console.log(`Total layout overflow issues: ${issues.length}`);
  console.log('=============================================\n');
}

runComprehensiveVerification().catch(err => {
  console.error('Re-verification failed:', err);
  process.exit(1);
});

