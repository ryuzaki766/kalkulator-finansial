// server.js
// Backend Express sederhana:
// 1. Menyajikan file frontend statis dari folder /public
// 2. Menyediakan endpoint API untuk kalkulator KPR, Zakat, dan Diskon
// 3. Baca konfigurasi (PORT, NODE_ENV) dari file .env lewat dotenv

require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const MAX_SAFE_NUMBER = 100_000_000_000;

function isValidFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validateKprInput({ pinjaman, bungaPersenPerTahun, tenorTahun }) {
  if (
    !isValidFiniteNumber(pinjaman) ||
    !isValidFiniteNumber(bungaPersenPerTahun) ||
    !isValidFiniteNumber(tenorTahun)
  ) {
    return false;
  }

  if (
    pinjaman <= 0 ||
    pinjaman > MAX_SAFE_NUMBER ||
    bungaPersenPerTahun < 0 ||
    bungaPersenPerTahun > 1000 ||
    tenorTahun <= 0 ||
    tenorTahun > 100
  ) {
    return false;
  }

  return true;
}

function validateZakatInput({ pendapatanPerBulan, hargaEmasPerGram }) {
  if (
    !isValidFiniteNumber(pendapatanPerBulan) ||
    !isValidFiniteNumber(hargaEmasPerGram)
  ) {
    return false;
  }

  if (
    pendapatanPerBulan <= 0 ||
    pendapatanPerBulan > MAX_SAFE_NUMBER ||
    hargaEmasPerGram <= 0 ||
    hargaEmasPerGram > MAX_SAFE_NUMBER
  ) {
    return false;
  }

  return true;
}
// Metode perhitungan zakat penghasilan yang didukung:
// - bulanan: penghasilan dicek & dizakati tiap bulan (perilaku lama, jadi default)
// - tahunan: penghasilan setahun dikumpulkan, dicek & dizakati sekali
const METODE_ZAKAT = ["bulanan", "tahunan"];
const GRAM_NISAB = 85; // Fatwa MUI No. 3 Tahun 2003 & BAZNAS
const KADAR_ZAKAT = 0.025; // 2,5%

function validateZakatTahunanInput({ pendapatanPerTahun, hargaEmasPerGram }) {
  if (
    !isValidFiniteNumber(pendapatanPerTahun) ||
    !isValidFiniteNumber(hargaEmasPerGram)
  ) {
    return false;
  }

  if (
    pendapatanPerTahun <= 0 ||
    pendapatanPerTahun > MAX_SAFE_NUMBER ||
    hargaEmasPerGram <= 0 ||
    hargaEmasPerGram > MAX_SAFE_NUMBER
  ) {
    return false;
  }

  return true;
}


function validateDiskonInput({ hargaAwal, persenDiskon }) {
  if (!isValidFiniteNumber(hargaAwal) || !isValidFiniteNumber(persenDiskon)) {
    return false;
  }

  if (
    hargaAwal <= 0 ||
    hargaAwal > MAX_SAFE_NUMBER ||
    persenDiskon < 0 ||
    persenDiskon > 100
  ) {
    return false;
  }

  return true;
}

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json({ limit: "1mb" }));

// Sajikan halaman dan aset statis dari folder public.
app.use(express.static(path.join(__dirname, "public")));

// URL halaman yang mudah dibaca, sementara file HTML tetap terorganisasi di public/pages.
app.get("/kpr", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "kpr.html"));
});

app.get("/zakat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "zakat.html"));
});

app.get("/diskon", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "diskon.html"));
});

// ---- LOGIKA PERHITUNGAN KPR ----
// Rumus anuitas: cicilan bulanan tetap dari pinjaman dengan bunga tetap per bulan
function hitungCicilanKPR({ pinjaman, bungaPersenPerTahun, tenorTahun }) {
  const bungaBulanan = bungaPersenPerTahun / 100 / 12;
  const jumlahBulan = tenorTahun * 12;

  let cicilanPerBulan;
  if (bungaBulanan === 0) {
    // Kalau bunga 0%, cicilan = pinjaman dibagi rata per bulan
    cicilanPerBulan = pinjaman / jumlahBulan;
  } else {
    const faktor = Math.pow(1 + bungaBulanan, jumlahBulan);
    cicilanPerBulan = (pinjaman * bungaBulanan * faktor) / (faktor - 1);
  }

  const totalPembayaran = cicilanPerBulan * jumlahBulan;
  const totalBunga = totalPembayaran - pinjaman;

  return {
    cicilanPerBulan: Math.round(cicilanPerBulan),
    totalPembayaran: Math.round(totalPembayaran),
    totalBunga: Math.round(totalBunga),
    jumlahBulan,
  };
}

// ---- ENDPOINT API KPR ----
app.post("/api/kalkulator/kpr", (req, res) => {
  const { pinjaman, bungaPersenPerTahun, tenorTahun } = req.body;

  if (!validateKprInput({ pinjaman, bungaPersenPerTahun, tenorTahun })) {
    return res.status(400).json({
      error:
        "Input tidak valid. Pastikan semua angka terisi, finite, dan berada dalam batas yang wajar.",
    });
  }

  const hasil = hitungCicilanKPR({ pinjaman, bungaPersenPerTahun, tenorTahun });
  res.json(hasil);
});

// ---- LOGIKA PERHITUNGAN ZAKAT PENGHASILAN ----
// Aturan umum: nisab = harga 85 gram emas. Kalau pendapatan setahun mencapai
// nisab itu, wajib zakat 2.5% dari pendapatan.
function hitungZakatPenghasilan({ pendapatanPerBulan, hargaEmasPerGram }) {
  const GRAM_NISAB = 85;
  const nisabTahunan = GRAM_NISAB * hargaEmasPerGram;
  const pendapatanTahunan = pendapatanPerBulan * 12;
  const wajibZakat = pendapatanTahunan >= nisabTahunan;
  const zakatPerBulan = wajibZakat ? pendapatanPerBulan * KADAR_ZAKAT: 0;

  return {
    wajibZakat,
    zakatPerBulan: Math.round(zakatPerBulan),
    nisabTahunan: Math.round(nisabTahunan),
    pendapatanTahunan: Math.round(pendapatanTahunan),
  };
}

function hitungZakatTahunan({ pendapatanPerTahun, hargaEmasPerGram }) {
  const nisabTahunan = GRAM_NISAB * hargaEmasPerGram;
  const wajibZakat = pendapatanPerTahun >= nisabTahunan;
  const zakatPerTahun = wajibZakat ? pendapatanPerTahun * KADAR_ZAKAT : 0;

  return {
    wajibZakat,
    zakatPerTahun: Math.round(zakatPerTahun),
    nisabTahunan: Math.round(nisabTahunan),
    pendapatanTahunan: Math.round(pendapatanPerTahun),
  };
}


// ---- ENDPOINT API ZAKAT ----
app.post("/api/kalkulator/zakat", (req, res) => {
  const { metode = "bulanan" } = req.body;

  if (!METODE_ZAKAT.includes(metode)) {
    return res.status(400).json({
      error: "Metode tidak valid. Pilih 'bulanan' atau 'tahunan'.",
    });
  }

  // ---- METODE TAHUNAN ----
  // Penghasilan setahun dikumpulkan dulu, lalu dicek terhadap nisab sekali.
  if (metode === "tahunan") {
    const { pendapatanPerTahun, hargaEmasPerGram } = req.body;

    if (!validateZakatTahunanInput({ pendapatanPerTahun, hargaEmasPerGram })) {
      return res.status(400).json({
        error:
          "Input tidak valid. Pastikan semua angka terisi, finite, dan berada dalam batas yang wajar.",
      });
    }

    const hasil = hitungZakatTahunan({ pendapatanPerTahun, hargaEmasPerGram });
    return res.json({ metode, ...hasil });
  }

  // ---- METODE BULANAN ----
  // Penghasilan dicek dan dizakati tiap bulan.
  const { pendapatanPerBulan, hargaEmasPerGram } = req.body;

  if (!validateZakatInput({ pendapatanPerBulan, hargaEmasPerGram })) {
    return res.status(400).json({
      error:
        "Input tidak valid. Pastikan semua angka terisi, finite, dan berada dalam batas yang wajar.",
    });
  }

  const hasil = hitungZakatPenghasilan({ pendapatanPerBulan, hargaEmasPerGram });
  return res.json({ metode, ...hasil });
});


// ---- LOGIKA PERHITUNGAN DISKON ----
// Diskon persen dari harga awal, hasilnya potongan harga dan harga akhir setelah diskon.
function hitungDiskon({ hargaAwal, persenDiskon }) {
  const potongan = hargaAwal * (persenDiskon / 100);
  const hargaAkhir = hargaAwal - potongan;

  return {
    potongan: Math.round(potongan),
    hargaAkhir: Math.round(hargaAkhir),
  };
}

// ---- ENDPOINT API DISKON ----
app.post("/api/kalkulator/diskon", (req, res) => {
  const { hargaAwal, persenDiskon } = req.body;

  if (!validateDiskonInput({ hargaAwal, persenDiskon })) {
    return res.status(400).json({
      error:
        "Input tidak valid. Harga harus lebih dari 0 dan persen diskon antara 0-100.",
    });
  }

  const hasil = hitungDiskon({ hargaAwal, persenDiskon });
  res.json(hasil);
});

// ---- CATCH-ALL UNTUK /api YANG SALAH KETIK (harus balas JSON, bukan HTML) ----
// Ditaruh SETELAH semua route /api di atas, SEBELUM catch-all umum.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan." });
});

// ---- CATCH-ALL UNTUK HALAMAN YANG SALAH KETIK ----
// Ditaruh PALING BAWAH dari semua route, sebelum error handler.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "pages", "404.html"));
});

// ---- ERROR HANDLER (beda perilaku development vs production) ----
// Middleware 4-argumen ini menangkap error yang dilempar lewat next(err).
// HARUS jadi app.use() paling terakhir yang didaftarkan.
app.use((err, req, res, next) => {
  console.error(err);

  if (NODE_ENV === "production") {
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// require.main === module: server hanya benar-benar "nyala" (listen) kalau
// file ini dijalankan langsung (node server.js / npm run dev), BUKAN saat
// di-import oleh file test (supaya test bisa pakai `app` tanpa buka port).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT} (mode: ${NODE_ENV})`);
  });
}

module.exports = { app };