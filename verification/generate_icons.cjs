const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const publicDir = path.resolve('public');

async function generate() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const configs = [
    { name: 'icon-192.png', size: 192, maskable: false },
    { name: 'icon-512.png', size: 512, maskable: false },
    { name: 'icon-maskable-192.png', size: 192, maskable: true },
    { name: 'icon-maskable-512.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180, maskable: false }
  ];

  for (const cfg of configs) {
    await page.setViewport({ width: cfg.size, height: cfg.size, deviceScaleFactor: 1 });
    const fontSize = cfg.maskable ? Math.round(cfg.size * 0.5) : Math.round(cfg.size * 0.58);
    const radius = cfg.maskable ? '0px' : `${Math.round(cfg.size * 0.22)}px`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body, html { width: ${cfg.size}px; height: ${cfg.size}px; overflow: hidden; background: transparent; }
            .icon-box {
              width: ${cfg.size}px;
              height: ${cfg.size}px;
              background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%);
              border-radius: ${radius};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: ${cfg.maskable ? 'none' : 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 6px rgba(0,0,0,0.3)'};
            }
            .symbol {
              font-size: ${fontSize}px;
              line-height: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              filter: drop-shadow(0 2px 8px rgba(0,0,0,0.35));
              user-select: none;
            }
          </style>
        </head>
        <body>
          <div class="icon-box">
            <div class="symbol">🕉️</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(html);
    const filePath = path.join(publicDir, cfg.name);
    await page.screenshot({ path: filePath, omitBackground: !cfg.maskable });
    console.log(`Generated: ${cfg.name} (${cfg.size}x${cfg.size})`);
  }

  await browser.close();
  console.log('All PWA icons generated successfully in public/');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
