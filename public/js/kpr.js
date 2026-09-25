
// script.js
// Tugas file ini di sisi FRONTEND untuk kalkulator KPR:
// 1. Ambil input dari form
// 2. Kirim ke backend (POST /api/kalkulator/kpr)
// 3. Tampilkan hasil yang dikirim balik oleh backend
// Fungsi bantu (format angka, animasi, dll) ada di common.js

const form = document.getElementById("form-kpr");
const tombolHitung = form.querySelector(".btn-hitung");
const hasilBox = document.getElementById("hasil");
const pesanError = document.getElementById("pesan-error");
const MAX_PINJAMAN = 100_000_000_000;

// Live formatting: begitu user ngetik di kolom pinjaman/tenor, otomatis
// muncul titik ribuan. Kolom bunga dibiarkan apa adanya karena butuh desimal.
pasangFormatOtomatis(document.getElementById("pinjaman"));
pasangFormatOtomatis(document.getElementById("tenor"));

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  pesanError.hidden = true;
  sembunyikanHasil(hasilBox);

  const pinjaman = bersihkanAngkaBulat(document.getElementById("pinjaman").value);
  const bungaPersenPerTahun = bersihkanAngkaDesimal(document.getElementById("bunga").value);
  const tenorTahun = bersihkanAngkaBulat(document.getElementById("tenor").value);

  const valid =
    nilaiTersedia(pinjaman) &&
    nilaiTersedia(bungaPersenPerTahun) &&
    nilaiTersedia(tenorTahun) &&
    angkaDalamRentang(pinjaman, 1, MAX_PINJAMAN) &&
    angkaDalamRentang(bungaPersenPerTahun, 0, 1000) &&
    angkaDalamRentang(tenorTahun, 1, 100);

  if (!valid) {
    pesanError.textContent = "Pastikan pinjaman, bunga, dan tenor diisi dengan angka yang masuk akal.";
    pesanError.hidden = false;
    return;
  }

  const selesaiLoading = pasangLoading(tombolHitung, "Menghitung...");

  try {
    const response = await fetch("/api/kalkulator/kpr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinjaman, bungaPersenPerTahun, tenorTahun }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error("Respons server tidak valid JSON");
    }

    if (!response.ok) {
      pesanError.textContent = data.error || "Terjadi kesalahan, coba lagi.";
      pesanError.hidden = false;
      return;
    }

    animasiHitungNaik(document.getElementById("hasil-cicilan"), data.cicilanPerBulan);
    document.getElementById("hasil-bulan").textContent = `${data.jumlahBulan} bulan`;
    document.getElementById("hasil-bunga").textContent = formatRupiah(data.totalBunga);
    document.getElementById("hasil-total").textContent = formatRupiah(data.totalPembayaran);
    tampilkanHasil(hasilBox);
  } catch (err) {
    pesanError.textContent = "Tidak bisa terhubung ke server atau respons server tidak valid.";
    pesanError.hidden = false;
  } finally {
    selesaiLoading();
  }
});