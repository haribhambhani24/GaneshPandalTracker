const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetFile = process.argv[2] || 'before.json';
const outPath = path.resolve('verification/lighthouse', targetFile);

function waitForServer(port, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(`http://localhost:${port}/`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 && body.includes('<div id="root">')) {
            setTimeout(resolve, 500);
          } else {
            setTimeout(check, 300);
          }
        });
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
  console.log('Building production bundle before Lighthouse run...');
  execSync('npm run build', { stdio: 'inherit' });

  const port = 4173;
  console.log(`Starting preview server on port ${port}...`);
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', String(port), '--strictPort'], {
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer(port);
    console.log(`Preview server ready on port ${port}. Running Lighthouse Mobile Audit...`);

    // Lighthouse command
    const lhCmd = `npx.cmd lighthouse http://localhost:${port} --form-factor=mobile --output=json --output-path="${outPath}" --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet`;
    console.log(`Executing: ${lhCmd}`);
    execSync(lhCmd, { stdio: 'inherit' });

    console.log(`Lighthouse audit complete. Saved to ${outPath}`);

    if (fs.existsSync(outPath)) {
      const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      const categories = data.categories || {};
      console.log('--- LIGHTHOUSE MOBILE SCORES ---');
      for (const [key, cat] of Object.entries(categories)) {
        console.log(`${cat.title} (${key}): ${Math.round(cat.score * 100)}%`);
      }
    }
  } catch (err) {
    console.error('Lighthouse run failed:', err.message);
  } finally {
    console.log('Terminating preview server...');
    preview.kill('SIGTERM');
  }
}

run();
