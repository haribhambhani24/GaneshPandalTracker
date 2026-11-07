const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('verification/ui');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function verifyFilterBar() {
  console.log('--- Starting Comprehensive Filter Bar Consistency Verification ---');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const viewports = [
    { width: 320, height: 600, name: '320px', expectedHeight: 40 },
    { width: 390, height: 844, name: '390px', expectedHeight: 40 },
    { width: 1280, height: 800, name: '1280px', expectedHeight: 36 },
  ];

  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.name} (Expected Height: ${vp.expectedHeight}px) ===`);
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.width < 768, hasTouch: vp.width < 768 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 800));

    // 1. Measure all controls in the main scrollable row
    const controlsMetrics = await page.evaluate(() => {
      // Find the row containing the filter controls
      const row = document.querySelector('div[class*="overflow-x-auto"][class*="scroll-smooth"]');
      if (!row) return null;

      const controls = Array.from(row.querySelectorAll('button, select'));
      return controls.map((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const icon = el.querySelector('svg') || el.parentElement?.querySelector('svg');
        const iconRect = icon ? icon.getBoundingClientRect() : null;

        return {
          tag: el.tagName,
          id: el.id,
          text: el.textContent?.trim().slice(0, 20),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          borderRadius: style.borderRadius,
          borderWidth: style.borderWidth,
          paddingLeft: style.paddingLeft,
          paddingRight: style.paddingRight,
          iconWidth: iconRect ? Math.round(iconRect.width) : null,
          iconHeight: iconRect ? Math.round(iconRect.height) : null,
        };
      });
    });

    console.log(`Controls count found in bar: ${controlsMetrics?.length}`);
    let allHeightsMatch = true;
    for (const ctrl of controlsMetrics || []) {
      const heightOk = Math.abs(ctrl.height - vp.expectedHeight) <= 1; // within 1px for browser sub-pixel rounding
      if (!heightOk) {
        allHeightsMatch = false;
        console.warn(`! Inconsistent height on ${ctrl.tag} "${ctrl.text}": got ${ctrl.height}px, expected ${vp.expectedHeight}px`);
      } else {
        console.log(`✓ ${ctrl.tag} "${ctrl.text}": ${ctrl.width}x${ctrl.height}px, font: ${ctrl.fontSize}, border: ${ctrl.borderWidth}, icon: ${ctrl.iconWidth}x${ctrl.iconHeight}px`);
      }
    }
    if (allHeightsMatch) {
      console.log(`✓ ALL controls in ${vp.name} have identical unified height (${vp.expectedHeight}px)!`);
    }

    // Capture Light Theme Screenshot
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUT_DIR, `after_light_${vp.name}.png`) });

    // Capture Dark Theme Screenshot
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUT_DIR, `after_dark_${vp.name}.png`) });
    console.log(`Saved after screenshots for ${vp.name} in light & dark.`);
  }

  // TEST MULTILINGUAL: Hindi & Marathi text width expansion without wrapping
  console.log('\n=== Testing Multilingual Layout in Hindi and Marathi (390px) ===');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 600));

  // Switch to Hindi
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find((x) => x.textContent?.trim() === 'HI' || x.textContent?.trim() === 'हिंदी');
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const hindiMetrics = await page.evaluate(() => {
    const row = document.querySelector('div[class*="overflow-x-auto"][class*="scroll-smooth"]');
    if (!row) return null;
    const controls = Array.from(row.querySelectorAll('button, select'));
    return controls.map((c) => ({
      text: c.textContent?.trim().slice(0, 20),
      height: Math.round(c.getBoundingClientRect().height),
      width: Math.round(c.getBoundingClientRect().width),
    }));
  });
  console.log('Hindi controls metrics:', hindiMetrics);
  await page.screenshot({ path: path.join(OUT_DIR, 'after_hindi_390px.png') });

  // Switch to Marathi
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find((x) => x.textContent?.trim() === 'MR' || x.textContent?.trim() === 'मराठी');
    if (b) b.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const marathiMetrics = await page.evaluate(() => {
    const row = document.querySelector('div[class*="overflow-x-auto"][class*="scroll-smooth"]');
    if (!row) return null;
    const controls = Array.from(row.querySelectorAll('button, select'));
    return controls.map((c) => ({
      text: c.textContent?.trim().slice(0, 20),
      height: Math.round(c.getBoundingClientRect().height),
      width: Math.round(c.getBoundingClientRect().width),
    }));
  });
  console.log('Marathi controls metrics:', marathiMetrics);
  await page.screenshot({ path: path.join(OUT_DIR, 'after_marathi_390px.png') });

  await browser.close();
  console.log('\n--- Filter Bar Consistency Verification Complete! ---');
}

verifyFilterBar().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

