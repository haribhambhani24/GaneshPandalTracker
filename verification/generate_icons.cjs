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
    const radius = cfg.maskable ? '0px' : `${Math.round(cfg.size * 0.22)}px`;
    const iconScale = cfg.maskable ? 0.5 : 0.6;
    const pinSize = Math.round(cfg.size * iconScale);

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
              background-color: #D9531E;
              border-radius: ${radius};
              display: flex;
              align-items: center;
              justify-content: center;
            }
            svg {
              width: ${pinSize}px;
              height: ${pinSize}px;
            }
          </style>
        </head>
        <body>
          <div class="icon-box">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 4C10.477 4 6 8.477 6 14C6 21.5 16 29 16 29C16 29 26 21.5 26 14C26 8.477 21.523 4 16 4ZM16 18.5C13.515 18.5 11.5 16.485 11.5 14C11.5 11.515 13.515 9.5 16 9.5C18.485 9.5 20.5 11.515 20.5 14C20.5 16.485 18.485 18.5 16 18.5Z" fill="#FFFFFF"/>
              <circle cx="16" cy="14" r="3.5" fill="#D9531E"/>
            </svg>
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
  console.log('All professional PWA icons generated successfully in public/');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
