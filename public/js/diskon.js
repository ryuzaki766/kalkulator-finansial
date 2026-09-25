// diskon.js
// Tugas file ini di sisi FRONTEND untuk kalkulator Diskon:
// 1. Ambil input dari form
// 2. Kirim ke backend (POST /api/kalkulator/diskon)
// 3. Tampilkan hasil yang dikirim balik oleh backend
// Fungsi bantu (format angka, animasi, dll) ada di common.js

const form = document.getElementById("form-diskon");
const tombolHitung = form.querySelector(".btn-hitung");
const hasilBox = document.getElementById("hasil");
const pesanError = document.getElementById("pesan-error");
const MAX_HARGA = 100_000_000_000;

// Live formatting: begitu user ngetik di kolom harga awal, otomatis muncul
// titik ribuan. Kolom persen diskon dibiarkan apa adanya karena butuh desimal
// (mis. 12.5%), sama seperti kolom bunga di kpr.js.
pasangFormatOtomatis(document.getElementById("harga-awal"));

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  pesanError.hidden = true;
  sembunyikanHasil(hasilBox);

  const hargaAwal = bersihkanAngkaBulat(document.getElementById("harga-awal").value);
  const persenDiskon = bersihkanAngkaDesimal(document.getElementById("persen-diskon").value);

  const valid =
    nilaiTersedia(hargaAwal) &&
    nilaiTersedia(persenDiskon) &&
    angkaDalamRentang(hargaAwal, 1, MAX_HARGA) &&
    angkaDalamRentang(persenDiskon, 0, 100);

  if (!valid) {
    pesanError.textContent = "Pastikan harga awal dan persen diskon diisi dengan angka yang masuk akal.";
    pesanError.hidden = false;
    return;
  }

  const selesaiLoading = pasangLoading(tombolHitung, "Menghitung...");

  try {
    const response = await fetch("/api/kalkulator/diskon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hargaAwal, persenDiskon }),
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

    animasiHitungNaik(document.getElementById("hasil-harga-akhir"), data.hargaAkhir);
    document.getElementById("hasil-potongan").textContent = formatRupiah(data.potongan);
    tampilkanHasil(hasilBox);
  } catch (err) {
    pesanError.textContent = "Tidak bisa terhubung ke server atau respons server tidak valid.";
    pesanError.hidden = false;
  } finally {
    selesaiLoading();
  }
});