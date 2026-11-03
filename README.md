# Website Profil Masjid (GitHub Pages)

Proyek ini adalah landing page statis untuk Masjid Al Barokah (contoh) yang dibuat dengan HTML, CSS, dan JavaScript murni. Situs ini dirancang agar dapat di-hosting ke GitHub Pages tanpa backend, dengan fokus pada tampilan responsif, struktur SEO, dan kemudahan pemeliharaan.

## GitHub Pages

1. Inisialisasi repo Git jika belum ada.
2. Commit semua file.
3. Push ke repository GitHub.
4. Buka Settings > Pages.
5. Pilih branch `main` dan folder root.
6. Aktifkan Enforce HTTPS.

## Pembaruan keuangan

- Bendahara menyiapkan data keuangan terbaru di file JSON di `data/keuangan/`.
- Admin memeriksa format data dan menyetujui.
- Commit dan push ke repository.
- Situs otomatis diperbarui saat GitHub Pages merebuild.


## Menambah kategori baru

1. Tambahkan kolom di Sheets sebelum kolom `Saldo Akhir` dan update rumus `Saldo Akhir`.
2. Tambahkan nama header ke daftar `pemasukan` atau `pengeluaran` di `data/config.json`.
3. Selesai. Kode tidak perlu diubah lagi karena semua total dan grafik dibangun dari konfigurasi.

## Pengembangan lanjutan

- Ganti `data/config.json` dengan data real.
- Perbarui `baseUrl` di konfigurasi dan sitemap.
- Gunakan Google Search Console untuk verifikasi dan submit sitemap.
- Tambahkan Google Analytics jika diperlukan.
- Setelah data resmi siap, hapus `noindex` dari setiap halaman.

> **Catatan domain:** Jika memakai domain sendiri (CNAME), ganti `base_url` di `data/config.json` lalu jalankan ulang `node tools/cek-meta.js` agar canonical, og:url, sitemap, dan JSON-LD ikut berubah.

## Catatan keamanan

Pastikan tidak ada API key, token, kata sandi, atau data donatur asli dimasukkan ke repository publik. Pembayaran otomatis dan dashboard admin membutuhkan backend terpisah.
