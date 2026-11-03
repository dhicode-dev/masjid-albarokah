#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'data', 'config.json');

// Kata/istilah teknis yang tidak boleh tampil ke pengunjung
const FORBIDDEN_TERMS = [
  { pattern: /\bspreadsheet\b/gi, label: 'spreadsheet' },
  { pattern: /\bGoogle Sheets\b/gi, label: 'Google Sheets' },
  { pattern: /\bCSV\b/g, label: 'CSV' },
  { pattern: /\bJSON\b/g, label: 'JSON' },
  { pattern: /\bconfig\b/gi, label: 'config' },
  { pattern: /\bdata contoh\b/gi, label: 'data contoh' },
  { pattern: /\bdata cadangan\b/gi, label: 'data cadangan' },
  { pattern: /\bplaceholder\b/gi, label: 'placeholder' },
  { pattern: /\[.*?\]/g, label: '[ ... ] (kurung siku literal)' }
];

// Tag/konteks yang dikecualikan dari pemeriksaan teks terlarang
// (atribut, nama variabel, key config, nama fungsi, URL, kode)
const EXEMPT_CONTEXTS = [
  /data-i18n/i, /data-i18n-placeholder/i, /\bconst\s+\w+\s*=/, /\bfunction\s+\w+/,
  /\.json["'\s\)]/i, /https?:\/\//, /console\./, /require\(/, /import\s/,
  /fetch\(/, /parseCsv/, /getSpreadsheetData/, /resolveSpreadsheetCsvUrl/,
  /<script/i, /<style/i, /<!--/, /-->/
];

let totalViolations = 0;
let scannedPages = 0;

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('[FATAL] data/config.json tidak ditemukan.');
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const baseUrl = cfg.site?.base_url || cfg.site?.baseUrl;
  if (!baseUrl) {
    console.error('[FATAL] base_url/baseUrl tidak ditemukan di config.json.');
    process.exit(1);
  }
  return baseUrl;
}

function findHtmlFiles(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath, list);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      list.push(fullPath);
    }
  }
  return list;
}

function extractAttr(html, tag, attr) {
  // Matches self-closing meta/link tags with the given attribute
  const re = new RegExp(`<${tag}[^>]*?\\b${attr}\\s*=\\s*"([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

function extractAllAttrs(html, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*?\\b${attr}\\s*=\\s*"([^"]*)"`, 'gi');
  const values = [];
  let m;
  while ((m = re.exec(html)) !== null) values.push(m[1]);
  return values;
}

/**
 * Hapus semua <script>, <style>, atribut, dan komentar agar tersisa teks yang
 * benar-benar terlihat pengunjung.
 */
function visibleTextOnly(html) {
  let text = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  // Hapus semua tag, sisakan teks
  text = text.replace(/<[^>]+>/g, ' ');
  // Decode entities dasar
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  return text;
}

function expectedCanonical(filePath, baseUrl) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return baseUrl;
  return baseUrl + rel;
}

function checkPage(filePath, baseUrl) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const violations = [];
  const html = fs.readFileSync(filePath, 'utf8');
  scannedPages++;

  const canonical = extractAttr(html, 'link', 'href'); // first link[rel=canonical]
  const canonicalFromTag = extractCanonical(html);
  const ogUrl = extractAttr(html, 'meta', 'content') ? extractMetaProp(html, 'og:url') : null;
  const ogImage = extractMetaProp(html, 'og:image');
  const twitterImage = extractMetaName(html, 'twitter:image');

  // --- (a) canonical & og:url ---
  const expected = expectedCanonical(filePath, baseUrl);
  if (!canonicalFromTag) {
    violations.push(`  [canonical] TIDAK ADA <link rel="canonical">`);
  } else if (!canonicalFromTag.startsWith(baseUrl)) {
    violations.push(`  [canonical] Tidak diawali base_url: ${canonicalFromTag}`);
  }
  if (ogUrl && !ogUrl.startsWith(baseUrl)) {
    violations.push(`  [og:url] Tidak diawali base_url: ${ogUrl}`);
  }
  if (canonicalFromTag && ogUrl && canonicalFromTag !== ogUrl) {
    violations.push(`  [mismatch] canonical (${canonicalFromTag}) != og:url (${ogUrl})`);
  }

  // --- (b) og:image & twitter:image ---
  for (const [label, val] of [['og:image', ogImage], ['twitter:image', twitterImage]]) {
    if (!val) {
      violations.push(`  [${label}] TIDAK ADA`);
    } else if (!val.startsWith('https://')) {
      violations.push(`  [${label}] Bukan alamat penuh: ${val}`);
    } else {
      // Cek file ada lokal
      const localPath = val.replace(baseUrl, ROOT + '/').replace(/\?.*$/, '');
      if (!fs.existsSync(localPath)) {
        violations.push(`  [${label}] File lokal tidak ditemukan: ${localPath}`);
      }
    }
  }

  // --- (c) Dilarang: masjidalbarokah.org, example.com, background-masjid.jpg ---
  const banned = [
    { pattern: /masjidalbarokah\.org/g, label: 'masjidalbarokah.org' },
    { pattern: /example\.com/g, label: 'example.com' },
    { pattern: /background-masjid\.jpg/g, label: 'background-masjid.jpg' }
  ];
  // Cek khusus di dalam tag canonical, og:*, twitter:*
  const metaBlock = (html.match(/<meta[^>]*>/gi) || []).join('\n')
    + '\n' + (html.match(/<link[^>]*rel="canonical"[^>]*>/gi) || []).join('\n');
  for (const b of banned) {
    const m = metaBlock.match(b.pattern);
    if (m) {
      violations.push(`  [dilarang] "${b.label}" ditemukan di meta/canonical`);
    }
  }

  // --- (d) Teks terlarang ---
  const visible = visibleTextOnly(html);
  for (const term of FORBIDDEN_TERMS) {
    term.pattern.lastIndex = 0;
    const m = visible.match(term.pattern);
    if (m) {
      violations.push(`  [teks terlarang] "${term.label}" tampil ke pengunjung`);
    }
  }

  return violations;
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)
    || html.match(/<link[^>]*href="([^"]*)"[^>]*rel="canonical"/i);
  return m ? m[1] : null;
}

function extractMetaProp(html, prop) {
  const m = html.match(new RegExp(`<meta[^>]*property="og:${prop.slice(3)}"[^>]*content="([^"]*)"`, 'i'))
    || html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*property="og:${prop.slice(3)}"`, 'i'));
  return m ? m[1] : null;
}

function extractMetaName(html, name) {
  const m = html.match(new RegExp(`<meta[^>]*name="${name}"[^>]*content="([^"]*)"`, 'i'))
    || html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*name="${name}"`, 'i'));
  return m ? m[1] : null;
}

function checkStaticFiles() {
  const violations = [];

  // sitemap.xml
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    violations.push('[sitemap.xml] TIDAK DITEMUKAN');
  } else {
    const xml = fs.readFileSync(sitemapPath, 'utf8');
    const locs = xml.match(/<loc>([^<]*)<\/loc>/gi) || [];
    for (const loc of locs) {
      const url = loc.replace(/<\/?loc>/gi, '');
      if (!url.startsWith('https://dhicode-dev.github.io/masjid-albarokah/')
          && !url.startsWith('https://dhicode-dev.github.io/masjid-albarokah')) {
        violations.push(`[sitemap.xml] <loc> tidak sesuai base_url: ${url}`);
      }
    }
  }

  // robots.txt
  const robotsPath = path.join(ROOT, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    const txt = fs.readFileSync(robotsPath, 'utf8');
    const sitemapLine = txt.match(/Sitemap:\s*(\S+)/i);
    if (sitemapLine && !sitemapLine[1].includes('dhicode-dev.github.io/masjid-albarokah')) {
      violations.push(`[robots.txt] Sitemap tidak sesuai: ${sitemapLine[1]}`);
    }
  }

  // manifest.webmanifest
  const manifestPath = path.join(ROOT, 'manifest.webmanifest');
  if (fs.existsSync(manifestPath)) {
    const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (m.description && /contoh/i.test(m.description)) {
      violations.push(`[manifest.webmanifest] description masih mengandung "contoh"`);
    }
  }

  return violations;
}

function main() {
  const baseUrl = readConfig();
  console.log(`\nBase URL: ${baseUrl}\n`);
  console.log('='.repeat(70));
  console.log('MEMINDAI HALAMAN HTML...');
  console.log('='.repeat(70));

  const htmlFiles = findHtmlFiles(ROOT);
  const allViolations = new Map();

  for (const file of htmlFiles) {
    const violations = checkPage(file, baseUrl);
    if (violations.length > 0) {
      allViolations.set(path.relative(ROOT, file).replace(/\\/g, '/'), violations);
    }
  }

  const staticViolations = checkStaticFiles();

  // Cetak hasil
  if (allViolations.size === 0 && staticViolations.length === 0) {
    console.log(`\n✅  SEMUA LULUS. ${scannedPages} halaman dipindai tanpa pelanggaran.\n`);
    return;
  }

  console.log('\n❌  PELANGGARAN DITEMUKAN:\n');
  for (const [file, violations] of allViolations) {
    console.log(`📄  ${file}`);
    violations.forEach(v => console.log(v));
    console.log('');
    totalViolations += violations.length;
  }

  if (staticViolations.length > 0) {
    console.log('📄  FILE STATIS');
    staticViolations.forEach(v => console.log(`  ${v}`));
    console.log('');
    totalViolations += staticViolations.length;
  }

  console.log('='.repeat(70));
  console.log(`Ringkasan: ${scannedPages} halaman dipindai, ${allViolations.size + (staticViolations.length ? 1 : 0)} file bermasalah, ${totalViolations} pelanggaran.`);
  console.log('='.repeat(70));
  process.exit(totalViolations > 0 ? 1 : 0);
}

main();
