const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('verification/zoom_verification');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function verifyZoomControls() {
  console.log('--- Starting Comprehensive Zoom Controls Verification ---');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Helper to extract Leaflet map instance and its current zoom from a container
  async function getMapZoom(containerSelector = '.leaflet-container') {
    return await page.evaluate((sel) => {
      const container = document.querySelector(sel);
      if (!container) return null;
      // In Leaflet, L.map instances can be retrieved from internal or global
      // If we query tile layer transform or Leaflet classes or URL:
      const tile = container.querySelector('.leaflet-tile');
      if (tile && tile.src) {
        const match = tile.src.match(/\/(\d+)\/\d+\/\d+\.png/);
        if (match) return parseInt(match[1], 10);
      }
      return null;
    }, containerSelector);
  }

  // Helper to get button dimensions and attributes
  async function getButtonInfo(selector) {
    return await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        width: rect.width,
        height: rect.height,
        ariaLabel: el.getAttribute('aria-label'),
        title: el.getAttribute('title'),
        disabled: el.hasAttribute('disabled') || el.classList.contains('leaflet-disabled'),
        cursor: style.cursor,
        pointerEvents: style.pointerEvents,
      };
    }, selector);
  }

  // ==========================================
  // TEST 1: Desktop Home Map Zoom Controls (1280px)
  // ==========================================
  console.log('\n[1] Testing Desktop Home Map (1280px)...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  const initialZoomDesktop = await getMapZoom();
  console.log(`Initial Desktop Home Zoom: ${initialZoomDesktop}`);

  // Check button size and attributes
  const zoomInDesktopInfo = await getButtonInfo('button[aria-label="Zoom In"], button[title="Zoom In"], button[aria-label="Zoom in"]');
  console.log('Zoom In Button Info (Desktop):', zoomInDesktopInfo);
  if (zoomInDesktopInfo) {
    if (zoomInDesktopInfo.width >= 44 && zoomInDesktopInfo.height >= 44) {
      console.log(`✓ Zoom In button meets >= 44x44px touch target: ${zoomInDesktopInfo.width}x${zoomInDesktopInfo.height}px`);
    } else {
      console.warn(`! Zoom In button size smaller than 44x44: ${zoomInDesktopInfo.width}x${zoomInDesktopInfo.height}`);
    }
  }

  // Click Zoom In
  const zoomInBtn = await page.$('button[aria-label="Zoom In"], button[title="Zoom In"], button[aria-label="Zoom in"]');
  if (zoomInBtn) {
    console.log('Clicking Zoom In (+) on Desktop Home...');
    await zoomInBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    const zoomAfterIn = await getMapZoom();
    console.log(`Desktop Home Zoom after (+): ${zoomAfterIn}`);
    if (zoomAfterIn !== null && initialZoomDesktop !== null) {
      console.log(zoomAfterIn > initialZoomDesktop ? '✓ Zoom level increased successfully!' : '✗ Zoom did not increase');
    }
    await page.screenshot({ path: path.join(OUT_DIR, '01_desktop_home_zoomed_in.png') });

    // Click Zoom Out
    const zoomOutBtn = await page.$('button[aria-label="Zoom Out"], button[title="Zoom Out"], button[aria-label="Zoom out"]');
    if (zoomOutBtn) {
      console.log('Clicking Zoom Out (-) on Desktop Home...');
      await zoomOutBtn.click();
      await new Promise((r) => setTimeout(r, 800));
      const zoomAfterOut = await getMapZoom();
      console.log(`Desktop Home Zoom after (-): ${zoomAfterOut}`);
      if (zoomAfterOut !== null && zoomAfterIn !== null) {
        console.log(zoomAfterOut < zoomAfterIn ? '✓ Zoom level decreased successfully!' : '✗ Zoom did not decrease');
      }
      await page.screenshot({ path: path.join(OUT_DIR, '02_desktop_home_zoomed_out.png') });
    }
  }

  // ==========================================
  // TEST 2: Desktop Home Map with Side Card Open
  // ==========================================
  console.log('\n[2] Testing Desktop with Side Card Open (Repositioning check)...');
  // Click first pandal marker or search suggestion to open side card
  await page.evaluate(() => {
    const input = document.querySelector('input[type="text"]');
    if (input) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, 'Lalbaug');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 600));
  const suggestion = await page.$('#search-suggestions-dropdown li');
  if (suggestion) {
    await suggestion.click();
    await new Promise((r) => setTimeout(r, 1000));

    // Verify controls are repositioned to the left of the side card
    const controlsPos = await page.evaluate(() => {
      const controls = document.querySelector('.leaflet-container')?.parentElement?.parentElement?.querySelector('div[class*="z-[1005]"]') || document.querySelector('div[class*="z-[1005]"]');
      const sideCard = document.querySelector('#desktop-pandal-card');
      if (!controls) return { found: false };
      const cRect = controls.getBoundingClientRect();
      const sRect = sideCard?.getBoundingClientRect();
      return {
        found: true,
        controlsRight: window.innerWidth - cRect.right,
        controlsLeft: cRect.left,
        sideCardLeft: sRect?.left,
        isClearOfSideCard: sRect ? cRect.right <= sRect.left : true,
      };
    });
    console.log('Controls Repositioning with Side Card Open:', controlsPos);
    if (controlsPos.isClearOfSideCard) {
      console.log('✓ Controls are repositioned to the left of the side card and not covered!');
    }

    // Click Zoom In while side card is open
    const zoomInWhileCardOpen = await page.$('button[aria-label="Zoom In"], button[title="Zoom In"], button[aria-label="Zoom in"]');
    if (zoomInWhileCardOpen) {
      await zoomInWhileCardOpen.click();
      await new Promise((r) => setTimeout(r, 800));
      console.log('✓ Zoom button clickable while side card is open.');
    }
    await page.screenshot({ path: path.join(OUT_DIR, '03_desktop_home_side_card_repositioned.png') });
  }

  // ==========================================
  // TEST 3: Mobile (390px) Home Map & Bottom Sheet
  // ==========================================
  console.log('\n[3] Testing Mobile Home Map (390px) & Bottom Sheet Open...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  const mobileZoomBefore = await getMapZoom();
  console.log(`Mobile Home Initial Zoom: ${mobileZoomBefore}`);

  // Test zoom in on mobile
  const mobileZoomIn = await page.$('button[aria-label="Zoom In"], button[title="Zoom In"], button[aria-label="Zoom in"]');
  if (mobileZoomIn) {
    await mobileZoomIn.click();
    await new Promise((r) => setTimeout(r, 800));
    const mobileZoomAfter = await getMapZoom();
    console.log(`Mobile Home Zoom after (+): ${mobileZoomAfter}`);
    if (mobileZoomAfter !== null && mobileZoomBefore !== null) {
      console.log(mobileZoomAfter > mobileZoomBefore ? '✓ Mobile Zoom In works!' : '✗ Mobile Zoom In failed');
    }
    await page.screenshot({ path: path.join(OUT_DIR, '04_mobile_home_zoomed_in.png') });
  }

  // Open mobile bottom sheet
  await page.evaluate(() => {
    const input = document.querySelector('input[type="text"]');
    if (input) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, 'Lalbaug');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 600));
  const mobSuggestion = await page.$('#search-suggestions-dropdown li');
  if (mobSuggestion) {
    await mobSuggestion.click();
    await new Promise((r) => setTimeout(r, 1000));

    // Verify controls are visible and positioned above the bottom sheet
    const mobileControlsCheck = await page.evaluate(() => {
      const controls = document.querySelector('div[class*="z-[1005]"]');
      const bottomSheet = document.querySelector('#mobile-pandal-bottom-sheet');
      if (!controls || !bottomSheet) return { error: 'Not found' };
      const cRect = controls.getBoundingClientRect();
      const bRect = bottomSheet.getBoundingClientRect();
      return {
        controlsTop: cRect.top,
        controlsBottom: cRect.bottom,
        sheetTop: bRect.top,
        isAboveSheet: cRect.bottom <= bRect.top,
        isVisible: cRect.width > 0 && cRect.height > 0,
      };
    });
    console.log('Mobile Controls above Bottom Sheet:', mobileControlsCheck);
    if (mobileControlsCheck.isAboveSheet) {
      console.log('✓ Mobile controls are positioned safely above the bottom sheet!');
    }

    // Click Zoom In while mobile bottom sheet is open
    const zoomInMobileSheet = await page.$('button[aria-label="Zoom In"], button[title="Zoom In"], button[aria-label="Zoom in"]');
    if (zoomInMobileSheet) {
      await zoomInMobileSheet.click();
      await new Promise((r) => setTimeout(r, 800));
      console.log('✓ Mobile zoom in clicked successfully while bottom sheet is open.');
    }
    await page.screenshot({ path: path.join(OUT_DIR, '05_mobile_bottom_sheet_controls_repositioned.png') });
  }

  // ==========================================
  // TEST 4: Submit Page Location Picker Map (/submit)
  // ==========================================
  console.log('\n[4] Testing Submit Page Location Picker Map...');
  await page.goto('http://localhost:5173/submit', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  // Proceed to Step 2
  await page.type('#pandal-name', 'Verification Pandal');
  await page.type('#pandal-address', 'Verification Address');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.textContent && b.textContent.includes('Next Step'));
    if (next) next.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Check Submit Map zoom control info
  const submitZoomInInfo = await getButtonInfo('.leaflet-control-zoom-in');
  console.log('Submit Map Zoom In Info:', submitZoomInInfo);
  if (submitZoomInInfo && submitZoomInInfo.width >= 44 && submitZoomInInfo.height >= 44) {
    console.log(`✓ Submit Map zoom button meets >= 44x44px touch target: ${submitZoomInInfo.width}x${submitZoomInInfo.height}px`);
  }

  const initialSubmitZoom = await getMapZoom();
  console.log(`Submit Map Initial Zoom: ${initialSubmitZoom}`);

  // Click Zoom In on Submit Map
  const submitZoomIn = await page.$('.leaflet-control-zoom-in');
  if (submitZoomIn) {
    console.log('Clicking Zoom In (+) on Submit Map...');
    await submitZoomIn.click();
    await new Promise((r) => setTimeout(r, 800));
    const submitZoomAfterIn = await getMapZoom();
    console.log(`Submit Map Zoom after (+): ${submitZoomAfterIn}`);
    if (submitZoomAfterIn !== null && initialSubmitZoom !== null) {
      console.log(submitZoomAfterIn > initialSubmitZoom ? '✓ Submit Map Zoom In works!' : '✗ Submit Map Zoom In failed');
    }
    await page.screenshot({ path: path.join(OUT_DIR, '06_submit_map_zoomed_in.png') });

    // Click Zoom Out on Submit Map
    const submitZoomOut = await page.$('.leaflet-control-zoom-out');
    if (submitZoomOut) {
      console.log('Clicking Zoom Out (-) on Submit Map...');
      await submitZoomOut.click();
      await new Promise((r) => setTimeout(r, 800));
      const submitZoomAfterOut = await getMapZoom();
      console.log(`Submit Map Zoom after (-): ${submitZoomAfterOut}`);
      if (submitZoomAfterOut !== null && submitZoomAfterIn !== null) {
        console.log(submitZoomAfterOut < submitZoomAfterIn ? '✓ Submit Map Zoom Out works!' : '✗ Submit Map Zoom Out failed');
      }
      await page.screenshot({ path: path.join(OUT_DIR, '07_submit_map_zoomed_out.png') });
    }
  }

  // ==========================================
  // TEST 5: Dark Theme Verification
  // ==========================================
  console.log('\n[5] Testing Dark Theme Zoom Controls on Home & Submit...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));

  // Toggle Dark Theme
  const themeToggle = await page.$('button[aria-label*="theme" i], button[title*="theme" i], button[aria-label*="Theme" i]');
  if (themeToggle) {
    await themeToggle.click();
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUT_DIR, '08_dark_theme_home_zoom_controls.png') });
    console.log('✓ Captured dark theme home zoom controls.');
  }

  // Submit page in dark theme
  await page.goto('http://localhost:5173/submit', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));
  await page.type('#pandal-name', 'Dark Theme Pandal');
  await page.type('#pandal-address', 'Dark Theme Address');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.textContent && b.textContent.includes('Next Step'));
    if (next) next.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '09_dark_theme_submit_zoom_controls.png') });
  console.log('✓ Captured dark theme submit zoom controls.');

  await browser.close();
  console.log('\n--- Zoom Controls Verification Complete! All screenshots saved in verification/zoom_verification/ ---');
}

verifyZoomControls().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

