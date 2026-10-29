const fs = require('fs');
const path = require('path');

const root = __dirname;
const patterns = [
  /data-sample\s*=\s*"true"/i,
  /data-sample="true"/i,
  /contoh/i,
  /\(contoh\)/i,
  /example/i,
  /0812-0000-0000/i,
  /000-000-0000-0/i,
];

const filesToCheck = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['.git', 'node_modules'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile()) {
      filesToCheck.push(full);
    }
  }
}

walk(root);

const results = [];
for (const file of filesToCheck) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  if (['.gitignore', 'check-sample.js', 'README.md', 'CLAUDE.md', 'DATA-CONTOH.md', 'PROMPT.md', 'PANDUAN-BENDAHARA.md', 'sitemap.xml', 'robots.txt', 'manifest.webmanifest'].includes(path.basename(file))) {
    continue;
  }

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const matches = [];

  lines.forEach((line, idx) => {
    if (patterns.some((pattern) => pattern.test(line))) {
      matches.push({ line: idx + 1, text: line.trim() });
    }
  });

  if (matches.length) {
    results.push({ file: relative, matches });
  }
}

if (!results.length) {
  console.log('Tidak ditemukan data contoh di repo ini.');
  process.exit(0);
}

console.log('Daftar file dan baris yang masih mengandung data contoh:\n');
for (const item of results) {
  console.log(`- ${item.file}`);
  for (const match of item.matches) {
    console.log(`  [baris ${match.line}] ${match.text}`);
  }
}
