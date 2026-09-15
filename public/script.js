
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

// Live formatting: begitu user ngetik di kolom pinjaman/tenor, otomatis
// muncul titik ribuan. Kolom bunga dibiarkan apa adanya karena butuh desimal.
pasangFormatOtomatis(document.getElementById("pinjaman"));
pasangFormatOtomatis(document.getElementById("tenor"));

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Cegah form reload halaman (perilaku default browser)

  pesanError.hidden = true;
  sembunyikanHasil(hasilBox);

  const pinjaman = bersihkanAngkaBulat(document.getElementById("pinjaman").value);
  const bungaPersenPerTahun = bersihkanAngkaDesimal(document.getElementById("bunga").value);
  const tenorTahun = bersihkanAngkaBulat(document.getElementById("tenor").value);

  // Cek dulu di frontend supaya pesan errornya lebih jelas ketimbang cuma
  // "input tidak valid" generik dari backend
  if (isNaN(pinjaman) || isNaN(bungaPersenPerTahun) || isNaN(tenorTahun)) {
    pesanError.textContent = "Pastikan ketiga kolom diisi dengan angka yang benar.";
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

    const data = await response.json();

    if (!response.ok) {
      // Backend menolak input (misal angka negatif atau kosong)
      pesanError.textContent = data.error || "Terjadi kesalahan, coba lagi.";
      pesanError.hidden = false;
      return;
    }

    // Tampilkan hasil perhitungan dari backend ke halaman, dengan animasi
    // "ngitung naik" khusus untuk angka utama (cicilan per bulan)
    animasiHitungNaik(document.getElementById("hasil-cicilan"), data.cicilanPerBulan);
    document.getElementById("hasil-bulan").textContent = `${data.jumlahBulan} bulan`;
    document.getElementById("hasil-bunga").textContent = formatRupiah(data.totalBunga);
    document.getElementById("hasil-total").textContent = formatRupiah(data.totalPembayaran);
    tampilkanHasil(hasilBox);

  } catch (err) {
    pesanError.textContent = "Tidak bisa terhubung ke server. Pastikan server sedang berjalan.";
    pesanError.hidden = false;
  } finally {
    selesaiLoading();
  }
});