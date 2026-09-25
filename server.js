// server.js
// Backend Express sederhana:
// 1. Menyajikan file frontend statis dari folder /public
// 2. Menyediakan endpoint API POST /api/kalkulator/kpr untuk menghitung cicilan KPR
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

// ---- ENDPOINT API ----
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
  const zakatPerBulan = wajibZakat ? pendapatanPerBulan * 0.025 : 0;

  return {
    wajibZakat,
    zakatPerBulan: Math.round(zakatPerBulan),
    nisabTahunan: Math.round(nisabTahunan),
    pendapatanTahunan: Math.round(pendapatanTahunan),
  };
}

app.post("/api/kalkulator/zakat", (req, res) => {
  const { pendapatanPerBulan, hargaEmasPerGram } = req.body;

  app.use("/api", (req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan." });
});

  if (!validateZakatInput({ pendapatanPerBulan, hargaEmasPerGram })) {
    return res.status(400).json({
      error:
        "Input tidak valid. Pastikan semua angka terisi, finite, dan berada dalam batas yang wajar.",
    });
  }

  const hasil = hitungZakatPenghasilan({ pendapatanPerBulan, hargaEmasPerGram });
  res.json(hasil);
});

app.use((req, res) => {
  res.status(404).json({
    error: "Halaman atau endpoint tidak ditemukan.",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Terjadi kesalahan server.",
  });
});

   app.use((err, req, res, next) => {
     console.error(err);
     if (NODE_ENV === "production") {
       res.status(500).json({ error: "Terjadi kesalahan pada server." });
     } else {
       res.status(500).json({ error: err.message, stack: err.stack });
     }
   });

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT} (mode: ${NODE_ENV})`); 
  });
}


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "pages", "404.html"));
});

module.exports = { app };