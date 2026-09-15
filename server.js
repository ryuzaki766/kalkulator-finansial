// server.js
// Backend Express sederhana:
// 1. Menyajikan file frontend statis dari folder /public
// 2. Menyediakan endpoint API POST /api/kalkulator/kpr untuk menghitung cicilan KPR

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Supaya server bisa membaca JSON yang dikirim dari frontend
app.use(express.json());

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

  // Validasi input dasar - jangan percaya input dari user begitu saja
  if (
    typeof pinjaman !== "number" ||
    typeof bungaPersenPerTahun !== "number" ||
    typeof tenorTahun !== "number" ||
    pinjaman <= 0 ||
    bungaPersenPerTahun < 0 ||
    tenorTahun <= 0
  ) {
    return res.status(400).json({
      error: "Input tidak valid. Pastikan semua angka terisi dan lebih dari 0.",
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

  if (
    typeof pendapatanPerBulan !== "number" ||
    typeof hargaEmasPerGram !== "number" ||
    pendapatanPerBulan <= 0 ||
    hargaEmasPerGram <= 0
  ) {
    return res.status(400).json({
      error: "Input tidak valid. Pastikan semua angka terisi dan lebih dari 0.",
    });
  }

  const hasil = hitungZakatPenghasilan({ pendapatanPerBulan, hargaEmasPerGram });
  res.json(hasil);
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});