# Kalkulator Finansial

Website fullstack sederhana untuk menghitung KPR dan zakat penghasilan.
Frontend HTML/CSS/JavaScript mengirim data ke backend Node.js + Express,
backend menghitung, lalu hasilnya ditampilkan kembali di halaman.

## Struktur folder

```text
kalkulator-finansial/
├── package.json           <- dependency dan script npm
├── server.js              <- backend, route halaman, dan API kalkulator
└── public/
    ├── index.html         <- halaman beranda
    ├── pages/
    │   ├── kpr.html       <- halaman kalkulator KPR
    │   └── zakat.html     <- halaman kalkulator zakat
    ├── css/
    │   ├── base.css       <- token, layout, navigasi, elemen global
    │   ├── home.css       <- gaya khusus halaman beranda
    │   └── calculator.css <- gaya form dan hasil kalkulator
    └── js/
        ├── common.js      <- helper JavaScript bersama
        ├── kpr.js         <- perilaku kalkulator KPR
        └── zakat.js       <- perilaku kalkulator zakat
```

## Cara menjalankan

1. Pastikan Node.js sudah terinstall: `node -v`.
2. Install dependency: `npm install`.
3. Jalankan server: `npm start`.
4. Buka salah satu URL berikut:
   - http://localhost:3000/
   - http://localhost:3000/kpr
   - http://localhost:3000/zakat

Setiap perubahan pada `server.js` membutuhkan restart server. Perubahan pada
HTML, CSS, atau JavaScript cukup diuji dengan refresh browser.

## Cara kerja

1. User membuka halaman `/kpr` atau `/zakat` dan mengisi form.
2. Script frontend mengambil input dan mengirimnya lewat `fetch()` ke API.
3. `server.js` memvalidasi data, menghitung hasil, lalu mengirim JSON.
4. Script halaman menerima hasil dari backend dan menampilkannya.

Endpoint yang tersedia:

- `POST /api/kalkulator/kpr`
- `POST /api/kalkulator/zakat`

## Catatan

- Angka rupiah pada input diformat otomatis dengan pemisah titik.
- Logika perhitungan berada di backend agar hasil konsisten.
- API menerima angka JSON, bukan string dengan format rupiah.
