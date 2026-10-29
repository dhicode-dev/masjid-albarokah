# CLAUDE.md

## Ringkasan stack

- HTML5, CSS3, JavaScript ES6+
- Bootstrap 5 + Bootstrap Icons via CDN
- Chart.js via CDN hanya untuk halaman keuangan
- Tanpa framework atau build step
- GitHub Pages untuk hosting statis

## Aturan proyek

- Semua path harus relatif.
- Bahasa antarmuka adalah Indonesia.
- Gunakan data contoh yang jelas dan tidak meniru data asli.
- Selalu gunakan `data-sample="true"` untuk blok data contoh.
- Seluruh halaman harus memiliki tag `meta name="robots" content="noindex"` sampai data resmi diganti.
- `robots.txt` dan `sitemap.xml` dibuat sejak awal.
- Tidak ada data sensitif di repo publik.

## Prinsip utama

- Konten bermanfaat dan relevan lokal.
- SEO teknis dasar dilakukan dengan benar.
- Struktur data dikelola di file JSON.
- Setiap halaman harus dapat dipelihara tanpa backend.
