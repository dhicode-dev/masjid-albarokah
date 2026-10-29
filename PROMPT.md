# PROMPT PROYEK: WEBSITE PROFIL MASJID (GITHUB PAGES)

Kamu adalah senior front-end developer sekaligus spesialis SEO teknis. Bangun website profil SATU masjid yang modern, responsif, ringan, profesional, dan dapat diakses publik secara gratis lewat GitHub Pages, di folder kerja saat ini (`masjid_profile`).

---

## 1. TEKNOLOGI & BATASAN

- HTML5, CSS3, JavaScript ES6+, Bootstrap 5 + Bootstrap Icons (CDN, versi di-pin). Chart.js (CDN, versi di-pin) hanya untuk grafik keuangan. Tanpa framework lain, tanpa build step.
- Hosting: GitHub Pages. TANPA backend (PHP/Laravel) dan TANPA database server.
- Semua path RELATIF agar jalan di `https://<user>.github.io/masjid_profile/` maupun custom domain.
- Kode rapi, modular, komentar singkat berbahasa Indonesia, mudah dikembangkan. Bahasa antarmuka: Indonesia.
- Jangan menjanjikan peringkat pertama Google. Fokus pada konten bermanfaat, SEO teknis yang benar, relevansi lokal, dan perbaikan bertahap.

---

## 2. ATURAN DATA CONTOH (BERLAKU UNTUK SELURUH PROYEK)

Jika data belum tersedia, ISI dengan DATA CONTOH yang realistis, lengkap, dan konsisten antarhalaman, sehingga website langsung tampak utuh dan bisa dites. JANGAN meninggalkan kolom kosong dan JANGAN memakai lorem ipsum.

### Aturan keamanan data contoh
- Semua data contoh harus FIKTIF dan jelas bukan data asli: nama masjid, orang, nomor telepon, rekening, dan QRIS tidak boleh menyerupai milik orang atau lembaga sungguhan.
- Nomor telepon/WhatsApp: pola jelas palsu (0812-0000-0000).
- Rekening: bank fiktif "Bank Contoh Syariah", nomor 000-000-0000-0, atas nama "DKM Masjid Al Barokah (CONTOH)". Jangan memakai nama bank atau nomor nyata.
- QRIS: buat gambar SVG placeholder bertuliskan "QRIS CONTOH - TIDAK DAPAT DIPINDAI". Jangan membuat kode QR yang berfungsi.
- Email memakai domain contoh: `info@masjid-contoh.example`.
- Foto: placeholder netral (SVG/gradien bertuliskan "Foto Contoh"), bukan foto orang atau masjid sungguhan.
- Nama orang: fiktif, diberi akhiran "(contoh)" di `data/pengurus.json`.

### Data contoh yang digunakan (simpan di `data/config.json` dan file JSON terkait sebagai sumber tunggal)
- Nama: Masjid Al Barokah (contoh) | Tahun berdiri: 1998 | Daya tampung: 800 jamaah
- LOKASI ASLI (BUKAN data contoh, sudah disiapkan pemilik, jangan diganti dan jangan diberi lencana "Data contoh"):
  - Alamat: kkp Sipak 1, RT.02/RW.04, Desa Sipak, Kec. Jasinga, Kabupaten Bogor, Jawa Barat 16670
  - Plus Code: GF9G+XF2 (Jasinga, Kabupaten Bogor)
  - Koordinat: lat -6.480113, lng 106.476141 (hasil konversi Plus Code)
  - Gunakan lokasi ini secara konsisten di config.json, footer, kontak.html, JSON-LD (PostalAddress: streetAddress "kkp Sipak 1, RT.02/RW.04, Sipak", addressLocality "Jasinga", addressRegion "Jawa Barat", postalCode "16670", addressCountry "ID"; GeoCoordinates sesuai di atas), embed Google Maps, tautan "Petunjuk Arah" (https://www.google.com/maps/dir/?api=1&destination=-6.480113,106.476141), dan Jadwal Salat (parameter latitude/longitude API).
  - Kata kunci SEO lokal: Jasinga, Sipak, Kabupaten Bogor.
  - Nama masjid, telepon, rekening, dan data lain di bawah tetap data contoh.
- WhatsApp: 0812-0000-0000 | Telepon: (021) 000-0000 | Email: lihat di atas
- Jam operasional: terbuka 04.00-22.00 WIB
- Sosial media: akun contoh (@masjidalikhlas.contoh)
- Pengurus (fiktif): Ketua DKM, Wakil Ketua, Sekretaris, Bendahara, serta seksi Dakwah, Pendidikan, Sosial, Humas, dan Sarana-Prasarana (tiap jabatan 1-2 nama fiktif).
- Fasilitas: area salat putra/putri, tempat wudhu, parkir, toilet difabel, perpustakaan, ruang TPQ, ruang serbaguna, AC, kantin, ambulans jenazah.
- Kegiatan rutin: kajian Subuh, kajian Ahad pagi, TPQ sore, Jumat Berkah, kajian remaja, bakti sosial bulanan, peringatan hari besar Islam.
- Berita/artikel: 3-5 artikel keagamaan umum yang bermanfaat, tidak mengutip tokoh nyata dan tidak memuat klaim fakta spesifik.
- Pengumuman: 4-5 contoh (jadwal kajian, kerja bakti, penerimaan zakat, dll).
- Donasi dana: target Rp 250.000.000, terkumpul Rp 87.500.000 (35%), periode 1 Januari - 31 Desember tahun berjalan, untuk renovasi atap dan perluasan area wudhu putri.
- Kebutuhan barang (8-10 item, kategori beragam, jumlah dibutuhkan/terpenuhi bervariasi, semua prioritas dan status terwakili): sajadah/karpet, Al-Qur'an dan buku, peralatan kebersihan, kipas angin/AC, lampu dan listrik, pengeras suara, material renovasi, peralatan TPQ, perlengkapan sosial.
- Anggaran proposal: rincian RAB contoh yang totalnya sama dengan target dana.
- Keuangan: contoh laporan 6 bulan (tahun berjalan) dengan status campuran (sebagian "Terverifikasi", bulan terakhir "Menunggu verifikasi"). Angka harus masuk akal dan rumus saldo akhir cocok, misalnya: saldo awal Rp 12.000.000 + pemasukan Rp 18.500.000 - pengeluaran Rp 15.250.000 = saldo akhir Rp 15.250.000. Variasikan angka bulan lain, dan sisakan SATU bulan dengan `saldo_akhir` tercatat yang sengaja salah untuk menguji peringatan "Data perlu diperiksa".

### Pelabelan wajib
- Setiap blok berisi data contoh memakai atribut `data-sample="true"` dan menampilkan lencana "Data contoh" (komponen Bootstrap yang mudah dihapus).
- Halaman donasi, keuangan, dan proposal menampilkan banner menonjol: "DATA CONTOH, BUKAN LAPORAN/REKENING RESMI".
- Footer menampilkan catatan kecil "Website ini masih memakai data contoh" selama masih ada `data-sample`.
- Seluruh halaman diberi `<meta name="robots" content="noindex">` selama masih memakai data contoh. `sitemap.xml` dan `robots.txt` tetap dibuat, tetapi README menjelaskan bahwa noindex harus DIHAPUS setelah data resmi terisi.
- Buat skrip `check-sample.js` (Node.js) yang memindai repo untuk atribut `data-sample`, teks "contoh", "(contoh)", "example", pola `0812-0000-0000` dan `000-000-0000-0`, lalu mencetak daftar file/baris yang masih berisi data contoh. Dijalankan sebelum publikasi resmi.
- Buat `DATA-CONTOH.md`: tabel daftar semua data contoh, lokasi file, dan apa yang harus diganti dengan data asli oleh pengurus.

---

## 3. STRUKTUR PROYEK

```
masjid_profile/
├── index.html, profil.html, jadwal-salat.html, kegiatan.html, berita.html,
│   pengumuman.html, galeri.html, donasi.html, proposal.html,
│   pengurus.html, fasilitas.html, kontak.html, 404.html
├── berita/                  (artikel .html, minimal 3 contoh)
├── assets/
│   ├── css/                 (style.css + variabel tema)
│   ├── js/                  (main.js, prayer-times.js, gallery.js, donasi.js,
│   │                         keuangan.js, theme.js, dst.)
│   ├── images/              (hero, galeri, ikon, og-image, qris/)
│   └── docs/                (tempat PDF proposal)
├── data/
│   ├── config.json, jadwal-cadangan.json, kegiatan.json, pengumuman.json,
│   │   pengurus.json, fasilitas.json, galeri.json, donasi.json,
│   │   kebutuhan-barang.json
│   └── keuangan/            (index.json + <tahun>.json)
├── sitemap.xml, robots.txt, manifest.webmanifest
├── check-sample.js
├── DATA-CONTOH.md
├── CLAUDE.md                (ringkasan stack & aturan proyek untuk sesi berikutnya)
└── README.md
```

Navbar dan footer harus identik di semua halaman. Utamakan menyalin langsung ke tiap HTML agar tautan bisa dirayapi mesin pencari. Jika memakai JS include, pastikan konten navigasi tetap tersedia tanpa JavaScript.

---

## 4. HALAMAN UMUM

- **index.html**: hero banner foto (placeholder) + CTA, jadwal salat hari ini dengan hitung mundur salat berikutnya, ringkasan profil, kegiatan terdekat, pengumuman dan berita terbaru, ajakan donasi, peta lokasi singkat.
- **profil.html**: profil, sejarah (timeline), visi-misi.
- **jadwal-salat.html**: jadwal harian + bulanan, tanggal Hijriah, imsak/terbit, penyesuaian menit iqomah, jadwal Jumat (imam/khatib). Ambil dari API publik gratis (mis. Aladhan, metode Kemenag RI, berdasarkan koordinat di config.json) langsung dari browser. Sediakan fallback ke `jadwal-cadangan.json` dan tampilkan pesan jika API gagal.
- **kegiatan.html**: kegiatan rutin dan kajian (jadwal, pemateri, lokasi), filter kategori.
- **berita.html + berita/<slug>.html**: tiap artikel punya title, meta description, tanggal, penulis, dan schema Article sendiri.
- **pengumuman.html**: tanggal, kategori, masa berlaku.
- **galeri.html**: lightbox, lazy-load.
- **pengurus.html**: struktur pengurus/DKM (kartu + bagan sederhana).
- **fasilitas.html**: fasilitas dengan ikon dan foto.
- **kontak.html**: alamat, jam operasional, telepon, WhatsApp (wa.me), email, embed Google Maps, tombol "Petunjuk Arah", formulir kontak yang mengirim ke WhatsApp/mailto (tanpa backend).
- **404.html**: halaman galat ramah pengguna.

---

## 5. PROGRAM DONASI & PENGEMBANGAN MASJID

### A. donasi.html: Donasi Dana
- Tujuan dan kebutuhan pendanaan (pembangunan, renovasi, pemeliharaan, pengembangan fasilitas) + progres penggalangan (target, terkumpul, persen, periode) dengan progress bar dari `data/donasi.json`.
- Kartu rekening: nama bank, nomor rekening, nama pemilik, tombol "Salin nomor rekening" (Clipboard API + fallback, umpan balik "Tersalin").
- QRIS tampil hanya jika `donasi.json` berisi `qris.aktif = true` dan gambar ada; jika tidak, tampilkan "QRIS belum tersedia".
- Petunjuk transfer 3-4 langkah dan tombol "Konfirmasi Donasi via WhatsApp" (wa.me dengan pesan template yang diisi donatur: nama, nominal, tanggal).
- Disclaimer: donasi bersifat sukarela.
- Peringatan keamanan menonjol: "Pastikan nomor rekening sesuai dengan yang tertera di halaman ini dan diverifikasi ke kontak resmi pengurus sebelum transfer. Pengurus tidak meminta donasi lewat rekening pribadi atau tautan lain."
- Jangan mengklaim donasi berhasil karena tombol diklik. Tulis: "Konfirmasi ini bukan bukti penerimaan. Penerimaan dicatat pengurus setelah verifikasi."
- Kontak resmi verifikasi donasi di halaman donasi, footer, dan kontak.

### B. donasi.html: Donasi Barang
- Dari `data/kebutuhan-barang.json`: nama barang, kategori, jumlah dibutuhkan, jumlah terpenuhi, progress bar, prioritas (Tinggi/Sedang/Rendah, lencana warna), status (Dibutuhkan / Sebagian terpenuhi / Terpenuhi / Tidak menerima lagi).
- Filter kategori dan prioritas, urut berdasarkan prioritas.
- Kontak pengurus untuk koordinasi penyerahan barang + tombol WhatsApp dengan template "Saya ingin menyumbang [nama barang]".

### C. proposal.html: Proposal Singkat Pengembangan Masjid
Halaman HTML (agar terbaca di HP dan bisa diindeks) berisi 10 bagian berurutan:
1. Nama dan identitas masjid
2. Latar belakang dan kondisi saat ini
3. Permasalahan/kebutuhan
4. Tujuan dan manfaat
5. Rencana kegiatan pembangunan/pengembangan
6. Rincian anggaran (tabel)
7. Target dana dan periode penggalangan
8. Daftar kebutuhan barang (dari kebutuhan-barang.json)
9. Mekanisme penyaluran donasi
10. Komitmen pelaporan penggunaan dana

Tombol "Unduh Proposal (PDF)" menuju `assets/docs/proposal-pengembangan-masjid.pdf`. Jika file belum ada, tombol nonaktif dengan teks "PDF tersedia setelah dokumen resmi disahkan pengurus" (jangan buat tautan rusak).

### E. Implementasi statis
Semua data lewat JSON/HTML statis; pembaruan lewat commit ke repository. Jangan menaruh API key, kata sandi, token, atau data donatur di repository publik. Catat di README bahwa pembayaran otomatis, pencatatan real-time, dan dashboard admin berautentikasi memerlukan backend terpisah (di luar cakupan proyek ini).

---

## 6. DESAIN UI/UX

- Nuansa Islami modern: hijau-teal (primer `#006A5E`), aksen emas lembut, latar terang bersih, mode gelap opsional, pola geometris Islami halus.
- Tipografi jelas (Google Fonts: Poppins/Inter; Amiri/Scheherazade untuk teks Arab bila dipakai).
- Navbar responsif dengan penanda halaman aktif, tombol "Donasi" menonjol, tombol WhatsApp mengambang, tombol kembali ke atas.
- Mobile-first (360px sampai desktop), animasi ringan via CSS/IntersectionObserver dan hormati `prefers-reduced-motion`. Warna konsisten.
- Aksesibilitas: HTML semantik, kontras WCAG AA, fokus terlihat, aria-label, skip-to-content link, alt pada semua gambar.

---

## 7. SEO TEKNIS (PER HALAMAN)

- `<title>` dan meta description UNIK, memuat nama masjid + lokasi secara alami (tanpa keyword stuffing, tanpa konten duplikat).
- Satu H1 per halaman, lalu H2/H3 berjenjang.
- Canonical, Open Graph, Twitter Card (og:image 1200x630), `lang="id"`, meta viewport, theme-color, favicon lengkap, web manifest.
- JSON-LD valid dan hanya memuat data yang benar-benar tampil di halaman: Mosque/PlaceOfWorship (+ LocalBusiness) di beranda/kontak (nama, alamat, geo, telepon, jam buka, sameAs, logo, image); BreadcrumbList di halaman dalam; Event untuk kegiatan; Article/NewsArticle untuk artikel; ContactPoint di kontak. Jangan membuat DonateAction/MonetaryGrant dari data contoh.
- `sitemap.xml` (halaman + artikel, lastmod, URL absolut dari config.json) dan `robots.txt` (izinkan semua + tautan sitemap). Seluruh halaman tetap noindex sampai data contoh diganti dengan data resmi.
- SEO lokal: NAP (Nama, Alamat, Telepon) konsisten di semua halaman, footer, JSON-LD, dan kontak.
- Gambar: WebP/AVIF bila memungkinkan, width/height eksplisit, `loading="lazy"` (kecuali hero), alt deskriptif, nama file deskriptif.
- Performa: minimalkan CSS/JS, defer script, preconnect font, tanpa dependensi tak perlu. Target Lighthouse >= 90 (Performance, Accessibility, Best Practices, SEO).

---

## 8. INTEGRASI GOOGLE (SIAPKAN + PETUNJUK DI README)

- **Search Console**: slot meta `google-site-verification` di `<head>` beranda (isi dari config.json), panduan verifikasi, submit sitemap, request indexing.
- **Google Maps**: embed di kontak.html + tautan "Petunjuk Arah".
- **Google Business Profile**: panduan singkat (kapan layak, cara klaim, menjaga NAP konsisten dengan website).
- **Google Analytics 4**: OPSIONAL, nonaktif secara default, aktif lewat config (Measurement ID). Tambahkan catatan privasi.

---

## 9. KEAMANAN & KUALITAS KODE

- Anti-XSS: jangan `innerHTML` dengan data mentah tanpa escape.
- Tangani error (API/JSON gagal, data kosong -> empty state).
- Tautan eksternal memakai `rel="noopener noreferrer"`.
- Tidak ada error JavaScript di console pada semua halaman.
- Tidak ada rahasia (kata sandi, API key, token, data donatur) di repository.

---

## 10. PENGUJIAN (LAKUKAN SENDIRI SEBELUM SELESAI)

- Jalankan lokal: `python -m http.server 8000`, cek semua halaman.
- Tulis skrip pengecek semua href/src internal untuk menemukan tautan/aset rusak. Validasi JSON-LD, sitemap.xml, dan robots.txt.
- Cek responsivitas di 360px, 768px, 1280px dan pastikan console bersih.
- Uji rumus saldo akhir (termasuk saldo negatif, data kosong, dan bulan yang sengaja salah), tombol salin, tautan WhatsApp, filter barang, arsip laporan, serta tombol PDF nonaktif.
- Jalankan `check-sample.js` dan laporkan daftar data contoh yang masih harus diganti.
- Laporkan hasil pengujian dan perbaiki bug yang ditemukan.

---

## 11. README.md (LANGKAH DEMI LANGKAH)

- Deskripsi proyek dan cara menjalankan lokal.
- Daftar semua data contoh beserta file/lokasinya (rujuk DATA-CONTOH.md).
- Membuat repository GitHub, `git init/add/commit/push`.
- Mengaktifkan GitHub Pages (Settings > Pages, branch main / root) dan "Enforce HTTPS".
- Mengganti data contoh lewat config.json dan file JSON di `data/`, serta memperbarui base URL di canonical, sitemap.xml, robots.txt, dan JSON-LD.
- Alur pembaruan keuangan: bendahara menyetujui -> admin edit JSON -> commit/push -> situs ter-update.
- Menambah artikel/pengumuman/kegiatan dan memperbarui sitemap.
- Menghapus noindex dan lencana/banner "Data contoh" setelah data resmi terisi.
- Uji lewat URL publik, verifikasi dan submit sitemap di Search Console, minta pengindeksan. Opsional: custom domain (CNAME + DNS).

---

## 12. KRITERIA KEBERHASILAN

- Semua halaman dapat diakses publik; tampilan responsif; navigasi berfungsi.
- Tidak ada tautan/aset rusak dan tidak ada error JS yang mengganggu.
- sitemap.xml dan robots.txt dapat diakses; praktik SEO teknis terpenuhi.
- Donatur memahami tujuan program, dapat memilih donasi dana atau barang, mudah menemukan rekening dan kontak resmi, proposal terbaca, dan laporan keuangan transparan dengan periode serta tanggal pembaruan.
- Data contoh terlabel jelas dan mudah diganti; data resmi dapat dipertanggungjawabkan pengurus.
- Struktur mudah diperbarui dan dikembangkan; situs siap diajukan ke Google setelah data resmi masuk.

---

## 13. CARA KERJA (BERTAHAP)

Mulai dengan rencana singkat struktur proyek, lalu kerjakan per tahap dan BERHENTI di akhir tiap tahap untuk saya periksa:

- **TAHAP 1**: kerangka proyek, config.json, navbar/footer, desain dasar, beranda, profil, kontak.
- **TAHAP 2**: jadwal salat, kegiatan, berita + artikel, pengumuman, galeri, pengurus, fasilitas, donasi, keuangan, proposal.
- **TAHAP 3**: SEO (JSON-LD, sitemap, robots, OG), integrasi Google, pengujian, check-sample.js, DATA-CONTOH.md, README.md, CLAUDE.md.

Di akhir tiap tahap, ringkas apa yang dibuat. Di akhir Tahap 3, tampilkan daftar data contoh yang HARUS saya ganti dan saran pengembangan berikutnya.
