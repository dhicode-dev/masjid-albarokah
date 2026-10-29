# Website Profil Masjid (GitHub Pages)

Proyek ini adalah landing page statis untuk Masjid Al Barokah (contoh) yang dibuat dengan HTML, CSS, dan JavaScript murni. Situs ini dirancang agar dapat di-hosting ke GitHub Pages tanpa backend, dengan fokus pada tampilan responsif, struktur SEO, dan kemudahan pemeliharaan.

## Cara menjalankan lokal

1. Buka terminal di folder proyek.
2. Jalankan:

```bash
python -m http.server 8000
```

3. Buka `http://localhost:8000` di browser.

## Struktur utama

- `index.html` halaman beranda
- `profil.html` profil masjid
- `jadwal-salat.html` jadwal shalat
- `kegiatan.html`, `berita.html`, `pengumuman.html`, `galeri.html`, `pengurus.html`, `fasilitas.html`
- `kontak.html` kontak dan lokasi
- `donasi.html`, `proposal.html`
- `data/` berisi file JSON sumber data
- `assets/` berisi CSS, JS, dan gambar

## Catatan data contoh

Semua halaman saat ini masih menggunakan data contoh dan dilengkapi label `Data contoh`. Setelah data resmi dimasukkan, pengurus wajib:

- mengganti data di `data/config.json` dan file JSON lain,
- mengecek semua halaman yang memuat label `data-sample`,
- menghapus tag `noindex` dari HTML,
- menghapus banner dan catatan data contoh,
- memperbarui `robots.txt`, `sitemap.xml`, dan canonical URL.

Untuk daftar lengkap, lihat [DATA-CONTOH.md](DATA-CONTOH.md).

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

## Kolom di Sheets

Tabel spreadsheet untuk tab `Keuangan` harus mengikuti header berikut tanpa mengubah teks header, urutan fitur, atau nama tab:

| Bulan | Infak | Sedekah | Donasi | Lainnya | Operasional | Kebersihan | Listrik | Air | Kegiatan | Pembangunan | Saldo Akhir |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Aturan penting:
- Baris 2 tetap harus berisi `Saldo Awal` dan hanya kolom `Saldo Akhir` yang diisi.
- Isi angka tanpa tanda `Rp`.
- Jangan mengubah nama tab `Keuangan`.
- Jangan menambah header baru kecuali sudah di-update di `data/config.json`.
- Jika kolom tidak ada di sheet, halaman akan menganggap nilainya 0 dengan peringatan di area data.

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

## Catatan keamanan

Pastikan tidak ada API key, token, kata sandi, atau data donatur asli dimasukkan ke repository publik. Pembayaran otomatis dan dashboard admin membutuhkan backend terpisah.
