# Kalkulator Finansial — Kalkulator KPR

Website fullstack sederhana. Frontend (HTML/CSS/JS) mengirim data ke backend
(Node.js + Express), backend menghitung, lalu hasilnya dikirim balik dan
ditampilkan di halaman.

## Struktur folder

```
kalkulator-finansial/
├── package.json      <- daftar dependency (Express)
├── server.js         <- backend: server + logika hitung KPR
└── public/
    ├── index.html     <- struktur halaman
    ├── style.css      <- tampilan
    └── script.js      <- frontend: kirim data ke backend, tampilkan hasil
```

## Cara menjalankan di VS Code

1. Buka folder `kalkulator-finansial` ini di VS Code (File > Open Folder).
2. Buka Terminal di VS Code (Terminal > New Terminal).
3. Pastikan Node.js sudah terinstall. Cek dengan:
   ```
   node -v
   ```
   Kalau belum ada, download dulu di https://nodejs.org (pilih versi LTS).
4. Install dependency:
   ```
   npm install
   ```
5. Jalankan server:
   ```
   npm start
   ```
6. Buka browser, akses: http://localhost:3000

Setiap kamu ubah kode di `server.js`, kamu perlu stop server (Ctrl+C di
terminal) lalu `npm start` lagi. Untuk file di dalam `public/` (HTML/CSS/JS),
cukup refresh browser.

## Cara kerja alurnya (fullstack flow)

1. User isi form di `index.html` lalu klik "Hitung cicilan".
2. `script.js` (frontend) mengambil isian form dan mengirimnya lewat
   `fetch()` ke `POST /api/kalkulator/kpr`.
3. `server.js` (backend) menerima data itu, menghitung cicilan pakai
   rumus anuitas, lalu mengirim hasilnya balik dalam format JSON.
4. `script.js` menerima hasil itu dan menampilkannya di halaman.

Ini pola dasar yang akan kamu pakai lagi untuk kalkulator lain
(zakat, bunga tabungan, dst) — cukup tambah endpoint baru di server.js
dan form baru di frontend.

## Langkah selanjutnya (kalau mau lanjut)

- Tambah kalkulator kedua (misal Zakat) dengan pola yang sama.
- Tambah halaman terpisah per kalkulator untuk SEO (`/kalkulator-zakat`, dst).
- Deploy ke Vercel atau Railway supaya bisa diakses publik.
- Baru daftar Google AdSense setelah situs online dan ada pengunjung.
