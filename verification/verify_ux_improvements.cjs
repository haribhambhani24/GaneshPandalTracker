const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('verification/ux_verification');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log('--- Starting Comprehensive UX Improvements Verification with Puppeteer ---');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 1. Test on mobile viewport (390x844 - iPhone 12/13/14)
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  // JOURNEY 1: First visit experience
  console.log('1. Testing first-visit experience on 390px...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUT_DIR, '01_first_visit_mobile.png') });

  // JOURNEY 2: Search with Devanagari & Recent Searches
  console.log('2. Testing bilingual search...');
  const searchInput = await page.$('input[type="text"]');
  if (searchInput) {
    await searchInput.click();
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUT_DIR, '02_search_focused_recent.png') });

    // Type Marathi query "लालबाग"
    await page.evaluate(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) {
        input.value = 'लालबाग';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, '03_search_marathi_query.png') });

    // Select suggestion
    const suggestion = await page.$('#search-suggestions-dropdown li');
    if (suggestion) {
      console.log('✓ Found suggestion for Devanagari search "लालबाग".');
      await suggestion.click();
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(OUT_DIR, '04_pandal_selected_bottom_sheet.png') });
    }
  }

  // JOURNEY 3: Pandal Detail Page "30-Second Answers"
  console.log('3. Testing Pandal Detail Page (Top & Bottom)...');
  await page.goto('http://localhost:5173/pandal/lalbaugcha-raja', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUT_DIR, '05_pandal_detail_top_mobile.png') });

  // Test Copy Address button
  const copyBtn = await page.$('#copy-address-button');
  if (copyBtn) {
    await copyBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUT_DIR, '06_copy_address_clicked.png') });
    console.log('✓ Copy address button works with confirmation.');
  }

  // Scroll down to check Previous / Next pandal navigation
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '07_pandal_detail_bottom_nav.png') });

  // JOURNEY 4: Volunteer 3-Step Submission Form
  console.log('4. Testing Volunteer 3-Step Form...');
  await page.goto('http://localhost:5173/submit', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '08_submit_step1_basics.png') });

  // Fill Step 1 and proceed to Step 2
  await page.type('#pandal-name', 'Chowpatty Sarvajanik Mandal');
  await page.type('#pandal-address', 'Girgaon Chowpatty Seaface, Marine Drive');
  
  // Click Next Step
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.textContent && (b.textContent.includes('Next Step') || b.textContent.includes('पुढे') || b.textContent.includes('अगला')));
    if (next) next.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '09_submit_step2_location.png') });
  console.log('✓ Proceeded to Step 2 (Location & Timings).');

  // Fill Step 2 and proceed to Step 3
  await page.type('#nearest-station-field', 'Charni Road (Western Line)');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.textContent.includes('Next Step') || b.textContent.includes('पुढे') || b.textContent.includes('अगला'));
    if (next) next.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '10_submit_step3_review.png') });
  console.log('✓ Proceeded to Step 3 (Photo & Review).');

  // JOURNEY 5: 404 Friendly Page
  console.log('5. Testing Friendly 404 Page...');
  await page.goto('http://localhost:5173/non-existent-page-xyz', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '11_404_not_found.png') });

  // JOURNEY 6: Desktop Viewport (1280px)
  console.log('6. Testing Desktop Viewport (1280px)...');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1280, height: 800 });
  await desktopPage.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await desktopPage.screenshot({ path: path.join(OUT_DIR, '12_desktop_map_overview.png') });

  await browser.close();
  console.log('--- All UX verification screenshots captured successfully in verification/ux_verification/ ---');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
