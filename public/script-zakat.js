// script-zakat.js
console.log("SCRIPT ZAKAT BERHASIL DIMUAT");
const form = document.getElementById("form-zakat");
const hasilBox = document.getElementById("hasil");
const pesanError = document.getElementById("pesan-error");

function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

function bersihkanAngkaBulat(teks) {
  const hanyaAngka = teks.replace(/[^0-9]/g, "");
  return hanyaAngka === "" ? NaN : Number(hanyaAngka);
}

function pasangFormatAngka(input) {
  input.addEventListener("input", () => {
    const angka = bersihkanAngkaBulat(input.value);
    input.value = isNaN(angka) ? "" : angka.toLocaleString("id-ID");
  });
}

pasangFormatAngka(document.getElementById("pendapatan"));
pasangFormatAngka(document.getElementById("harga-emas"));

form.addEventListener("submit", async (event) => {
  console.log("TOMBOL HITUNG DIKLIK");

  event.preventDefault();

  pesanError.hidden = true;
  hasilBox.hidden = true;
  hasilBox.classList.remove("tampil");

  const pendapatanPerBulan = bersihkanAngkaBulat(
    document.getElementById("pendapatan").value
  );

  const hargaEmasPerGram = bersihkanAngkaBulat(
    document.getElementById("harga-emas").value
  );

  if (
    isNaN(pendapatanPerBulan) ||
    isNaN(hargaEmasPerGram)
  ) {
    pesanError.textContent =
      "Pastikan kedua kolom diisi dengan angka yang benar.";

    pesanError.hidden = false;
    return;
  }

  try {
    const response = await fetch("/api/kalkulator/zakat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        pendapatanPerBulan,
        hargaEmasPerGram
      })
    });

    const data = await response.json();

    if (!response.ok) {
      pesanError.textContent =
        data.error || "Terjadi kesalahan, coba lagi.";

      pesanError.hidden = false;
      return;
    }

    const labelHasil =
      document.getElementById("hasil-label");

    const angkaHasil =
      document.getElementById("hasil-zakat");

    if (data.wajibZakat) {
      labelHasil.textContent = "Zakat per bulan";

      angkaHasil.textContent =
        formatRupiah(data.zakatPerBulan);
    } else {
      labelHasil.textContent = "Status";

      angkaHasil.textContent =
        "Belum wajib zakat";
    }

    document.getElementById(
      "hasil-pendapatan-tahunan"
    ).textContent =
      formatRupiah(data.pendapatanTahunan);

    document.getElementById(
      "hasil-nisab"
    ).textContent =
      formatRupiah(data.nisabTahunan);

    hasilBox.hidden = false;
    hasilBox.classList.add("tampil");

  } catch (err) {

    console.error(err);

    pesanError.textContent =
      "Tidak bisa terhubung ke server, atau respons server tidak valid.";

    pesanError.hidden = false;
  }
});