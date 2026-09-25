# Backlog 30 Hari - Kalkulator Finansial

**Legenda:** `[x]` sudah dikerjakan, `[ ]` belum dikerjakan.

Backlog ini disusun berdasarkan kondisi project saat ini. Targetnya adalah memiliki aplikasi kalkulator finansial yang stabil, mudah dipakai, teruji, dan siap dikembangkan.

## Hari 1 - Fondasi project

- [x] Menentukan stack Node.js, Express, HTML, CSS, dan JavaScript.
- [x] Membuat struktur folder frontend dan backend.
- [x] Menambahkan `package.json` dan dependency Express.
- [ ] Menambahkan aturan kualitas kode dan format file.

## Hari 2 - Server dan routing

- [x] Membuat server Express.
- [x] Menyajikan aset statis dari folder `public`.
- [x] Menambahkan route `/`, `/kpr`, dan `/zakat`.
- [ ] Menambahkan halaman 404 yang informatif.
- [ ] Menambahkan konfigurasi environment untuk development dan production.

## Hari 3 - Beranda aplikasi

- [x] Membuat halaman beranda Ledger.
- [x] Menampilkan kartu akses ke kalkulator KPR dan zakat.
- [x] Menambahkan navigasi antarhalaman.
- [ ] Menambahkan status kalkulator yang akan datang secara aktif.

## Hari 4 - Kalkulator KPR: backend

- [x] Membuat rumus cicilan anuitas.
- [x] Mendukung skenario bunga 0%.
- [x] Menghitung cicilan bulanan, total bunga, total pembayaran, dan jumlah bulan.
- [x] Membuat endpoint `POST /api/kalkulator/kpr`.
- [x] Menambahkan validasi tipe dan nilai input dasar.
- [ ] Menambahkan batas maksimum input untuk mencegah nilai tidak wajar.

## Hari 5 - Kalkulator zakat: backend

- [x] Membuat perhitungan nisab berdasarkan 85 gram emas.
- [x] Menghitung pendapatan tahunan dan zakat 2,5%.
- [x] Menentukan status wajib atau belum wajib zakat.
- [x] Membuat endpoint `POST /api/kalkulator/zakat`.
- [x] Menambahkan validasi tipe dan nilai input dasar.
- [ ] Menambahkan penjelasan sumber dan variasi metode perhitungan zakat.

## Hari 6 - Form dan integrasi KPR

- [x] Membuat form input pinjaman, bunga, dan tenor.
- [x] Mengirim input KPR ke backend menggunakan `fetch`.
- [x] Menampilkan hasil cicilan dan rincian pembayaran.
- [x] Menampilkan pesan error untuk input yang tidak valid atau server gagal diakses.
- [x] Menambahkan format angka Rupiah pada input dan hasil.

## Hari 7 - Form dan integrasi zakat

- [x] Membuat form pendapatan bulanan dan harga emas.
- [x] Mengirim input zakat ke backend menggunakan `fetch`.
- [x] Menampilkan status wajib zakat, zakat bulanan, pendapatan tahunan, dan nisab.
- [x] Menampilkan pesan error untuk input yang tidak valid atau server gagal diakses.
- [x] Menambahkan format angka Rupiah pada input.

## Hari 8 - UX dan tampilan dasar

- [x] Membuat layout responsif untuk halaman beranda dan kalkulator.
- [x] Menambahkan state loading pada tombol KPR.
- [x] Menambahkan animasi kemunculan hasil.
- [x] Menghormati preferensi `prefers-reduced-motion` pada animasi angka KPR.
- [ ] Menyamakan state loading antara kalkulator KPR dan zakat.
- [ ] Menambahkan indikator fokus keyboard yang konsisten.

## Hari 9 - Dokumentasi penggunaan

- [x] Menulis README berisi cara install dan menjalankan aplikasi.
- [x] Mendokumentasikan struktur folder.
- [x] Mendokumentasikan cara kerja frontend, backend, dan endpoint.
- [ ] Menambahkan contoh request dan response API.
- [ ] Menambahkan bagian batasan perhitungan dan disclaimer penggunaan.

## Hari 10 - Test manual terstruktur

- [ ] Menguji input normal KPR dengan bunga lebih dari 0%.
- [ ] Menguji input KPR dengan bunga 0%.
- [ ] Menguji input KPR kosong, nol, negatif, desimal, dan teks.
- [ ] Menguji input normal zakat dan batas nisab.
- [ ] Menguji kegagalan koneksi ke backend.
- [ ] Mencatat hasil pengujian dan bug dalam issue atau dokumen.

## Hari 11 - Test otomatis backend

- [ ] Memilih framework test, misalnya Node.js test runner atau Jest.
- [ ] Mengekstrak fungsi perhitungan agar mudah diuji.
- [ ] Menambahkan test rumus KPR untuk bunga normal dan 0%.
- [ ] Menambahkan test rumus zakat untuk kondisi wajib dan belum wajib.
- [ ] Menambahkan test validasi endpoint.

## Hari 12 - Perbaikan validasi input

- [ ] Menolak nilai `NaN`, `Infinity`, dan angka yang terlalu besar.
- [ ] Menetapkan batas wajar pinjaman, bunga, tenor, pendapatan, dan harga emas.
- [ ] Menyamakan pesan validasi frontend dan backend.
- [ ] Menambahkan validasi khusus format desimal bunga.

## Hari 13 - Perbaikan frontend bersama

- [ ] Menggunakan helper bersama untuk format dan parsing di kedua kalkulator.
- [ ] Menghapus duplikasi fungsi pada `zakat.js`.
- [ ] Menambahkan state disabled/loading pada tombol zakat.
- [ ] Menangani response JSON yang rusak atau bukan JSON.

## Hari 14 - Aksesibilitas

- [ ] Memastikan semua form dapat digunakan dengan keyboard.
- [ ] Menambahkan `aria-live` pada pesan error dan area hasil.
- [ ] Memastikan kontras warna memenuhi standar aksesibilitas.
- [ ] Memastikan label dan fokus input terbaca jelas oleh screen reader.

## Hari 15 - Responsif dan kompatibilitas

- [ ] Menguji tampilan pada mobile, tablet, dan desktop.
- [ ] Menguji browser Chrome, Edge, dan Firefox.
- [ ] Memperbaiki overflow, ukuran teks, dan jarak pada layar kecil.
- [ ] Menambahkan test smoke untuk route utama.

## Hari 16 - Kalkulator dana darurat

- [ ] Menentukan input biaya hidup bulanan dan target bulan perlindungan.
- [ ] Membuat endpoint perhitungan dana darurat.
- [ ] Membuat halaman dan form kalkulator dana darurat.
- [ ] Menampilkan target dana dan kekurangan dana jika ada.

## Hari 17 - Kalkulator investasi sederhana

- [ ] Menentukan input modal awal, setoran bulanan, imbal hasil, dan durasi.
- [ ] Menentukan asumsi dan disclaimer hasil investasi.
- [ ] Membuat fungsi perhitungan nilai akhir.
- [ ] Membuat endpoint dan tampilan kalkulator investasi.

## Hari 18 - Ringkasan dan visualisasi

- [ ] Menambahkan tabel rincian per tahun atau per bulan untuk KPR.
- [ ] Menambahkan visualisasi sederhana komposisi pokok dan bunga.
- [ ] Memastikan visualisasi memiliki alternatif teks.
- [ ] Menguji visualisasi pada data ekstrem.

## Hari 19 - Riwayat perhitungan lokal

- [ ] Menentukan format data riwayat.
- [ ] Menyimpan hasil terakhir menggunakan `localStorage`.
- [ ] Menampilkan daftar riwayat per kalkulator.
- [ ] Menambahkan aksi hapus riwayat dan hapus semua.

## Hari 20 - Export dan berbagi hasil

- [ ] Menambahkan tombol salin ringkasan hasil.
- [ ] Menambahkan export hasil ke JSON atau CSV.
- [ ] Menambahkan tampilan ringkasan yang ramah cetak.
- [ ] Memastikan data pribadi tidak dikirim ke pihak ketiga.

## Hari 21 - Keamanan aplikasi

- [ ] Menambahkan Helmet atau konfigurasi header keamanan yang sesuai.
- [ ] Membatasi ukuran body JSON.
- [ ] Menambahkan rate limiting pada endpoint kalkulator.
- [ ] Memastikan output tidak membuka celah XSS.
- [ ] Meninjau dependency dengan audit keamanan.

## Hari 22 - Observability dan error handling

- [ ] Menambahkan logging request dan error yang aman.
- [ ] Membuat error handler Express terpusat.
- [ ] Menetapkan format response error API yang konsisten.
- [ ] Menambahkan health check endpoint.

## Hari 23 - Performa

- [ ] Mengukur waktu respons endpoint dan ukuran aset.
- [ ] Mengaktifkan cache atau compression jika sesuai.
- [ ] Mengoptimalkan font dan aset yang dimuat.
- [ ] Memastikan kalkulator tetap responsif pada perangkat rendah daya.

## Hari 24 - SEO dan metadata

- [ ] Meninjau title dan description setiap halaman.
- [ ] Menambahkan Open Graph metadata.
- [ ] Menambahkan `robots.txt` dan sitemap jika diperlukan.
- [ ] Memastikan heading dan struktur semantic HTML konsisten.

## Hari 25 - CI dan kualitas kode

- [ ] Menambahkan script `test`, `lint`, dan `format` ke `package.json`.
- [ ] Menambahkan pipeline CI untuk install, lint, dan test.
- [ ] Menetapkan pemeriksaan wajib sebelum merge.
- [ ] Mendokumentasikan command development di README.

## Hari 26 - Deployment

- [ ] Memilih platform deployment.
- [ ] Menambahkan konfigurasi start production.
- [ ] Mengatur environment variable dan port production.
- [ ] Melakukan deployment pertama.
- [ ] Menguji route, API, dan aset pada environment production.

## Hari 27 - Uji penerimaan pengguna

- [ ] Menyiapkan skenario penggunaan untuk KPR, zakat, dan kalkulator baru.
- [ ] Meminta minimal satu orang mencoba alur utama.
- [ ] Mencatat kebingungan pengguna dan error yang ditemukan.
- [ ] Memprioritaskan perbaikan berdasarkan dampak.

## Hari 28 - Perbaikan berdasarkan feedback

- [ ] Memperbaiki bug prioritas tinggi.
- [ ] Memperjelas copy, label, dan disclaimer.
- [ ] Menambahkan regression test untuk bug yang diperbaiki.
- [ ] Menjalankan ulang test manual dan otomatis.

## Hari 29 - Release candidate

- [ ] Membekukan scope release pertama.
- [ ] Memastikan README sesuai dengan fitur aktual.
- [ ] Menjalankan pemeriksaan keamanan dan dependency.
- [ ] Membuat checklist release dan rollback.
- [ ] Menandai versi release candidate.

## Hari 30 - Rilis dan evaluasi

- [ ] Merilis versi pertama ke production.
- [ ] Memantau error dan penggunaan pada hari pertama.
- [ ] Mendokumentasikan hasil dan masalah yang tersisa.
- [ ] Menyusun backlog versi berikutnya berdasarkan data penggunaan.

## Definition of Done

Sebuah item dianggap selesai jika:

- implementasinya sudah tersedia di aplikasi;
- validasi dan error handling yang relevan sudah ada;
- sudah diuji melalui test manual atau otomatis sesuai risikonya;
- dokumentasi terkait sudah diperbarui; dan
- tidak menimbulkan regresi pada kalkulator yang sudah tersedia.
