const fs = require('fs');

const data = JSON.parse(fs.readFileSync('verification/lighthouse/before.json', 'utf8'));

console.log('=== AUDIT FAILURES / OPPORTUNITIES ===');

for (const [, audit] of Object.entries(data.audits || {})) {
  if (audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== 'notApplicable') {
    console.log(`[${audit.score * 100}%] ${audit.id}: ${audit.title}`);
    if (audit.displayValue) console.log(`   Value: ${audit.displayValue}`);
    if (audit.explanation) console.log(`   Explanation: ${audit.explanation}`);
  }
}

console.log('\n=== PWA AUDITS ===');
for (const [key, audit] of Object.entries(data.audits || {})) {
  if (key.startsWith('pwa') || key.includes('installable') || key.includes('service-worker') || key.includes('splash') || key.includes('maskable') || key.includes('apple-touch-icon') || key.includes('theme-color') || key.includes('manifest')) {
    console.log(`${key} (${audit.score}): ${audit.title} -> ${audit.scoreDisplayMode}`);
    if (audit.explanation) console.log(`   ${audit.explanation}`);
  }
}
