// zakat.js
const form = document.getElementById("form-zakat");
const tombolHitung = form.querySelector(".btn-hitung");
const hasilBox = document.getElementById("hasil");
const pesanError = document.getElementById("pesan-error");
const MAX_INPUT = 100_000_000_000;

// ---- Helper (dipakai kalau belum ada di file lain) ----
function nilaiTersedia(n) {
  return typeof n === "number" && Number.isFinite(n);
}

function angkaDalamRentang(n, min, max) {
  return n >= min && n <= max;
}

function pasangLoading(tombol, teks) {
  const teksAsli = tombol.textContent;
  tombol.disabled = true;
  tombol.textContent = teks;
  return () => {
    tombol.disabled = false;
    tombol.textContent = teksAsli;
  };
}

function formatRupiah(angka) {
  return "Rp" + Number(angka || 0).toLocaleString("id-ID");
}

function bersihkanAngkaBulat(teks) {
  const hanyaAngka = String(teks ?? "").replace(/[^0-9]/g, "");
  return hanyaAngka === "" ? NaN : Number(hanyaAngka);
}

function pasangFormatAngka(input) {
  input.addEventListener("input", () => {
    const angka = bersihkanAngkaBulat(input.value);
    input.value = Number.isFinite(angka) ? angka.toLocaleString("id-ID") : "";
  });
}

pasangFormatAngka(document.getElementById("pendapatan"));
pasangFormatAngka(document.getElementById("harga-emas"));

// ---- Tampilkan hasil ----
function tampilkanHasil(data) {
  const labelHasil = document.getElementById("hasil-label");
  const angkaHasil = document.getElementById("hasil-zakat");

  if (data.wajibZakat) {
    labelHasil.textContent = "Zakat per bulan";
    angkaHasil.textContent = formatRupiah(data.zakatPerBulan);
  } else {
    labelHasil.textContent = "Status";
    angkaHasil.textContent = "Belum wajib zakat";
  }

  document.getElementById("hasil-pendapatan-tahunan").textContent =
    formatRupiah(data.pendapatanTahunan);
  document.getElementById("hasil-nisab").textContent = formatRupiah(data.nisabTahunan);

  hasilBox.hidden = false;
  hasilBox.style.display = "block"; // jaga-jaga kalau CSS menyembunyikannya
  // paksa reflow agar transisi CSS (jika ada) berjalan
  void hasilBox.offsetWidth;
  hasilBox.classList.add("tampil");
  hasilBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  pesanError.hidden = true;
  hasilBox.hidden = true;
  hasilBox.classList.remove("tampil");

  const pendapatanPerBulan = bersihkanAngkaBulat(document.getElementById("pendapatan").value);
  const hargaEmasPerGram = bersihkanAngkaBulat(document.getElementById("harga-emas").value);

  const valid =
    nilaiTersedia(pendapatanPerBulan) &&
    nilaiTersedia(hargaEmasPerGram) &&
    angkaDalamRentang(pendapatanPerBulan, 1, MAX_INPUT) &&
    angkaDalamRentang(hargaEmasPerGram, 1, MAX_INPUT);

  if (!valid) {
    pesanError.textContent = "Pastikan pendapatan dan harga emas diisi dengan angka yang masuk akal.";
    pesanError.hidden = false;
    return;
  }

  const selesaiLoading = pasangLoading(tombolHitung, "Menghitung...");

  try {
    const response = await fetch("/api/kalkulator/zakat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendapatanPerBulan, hargaEmasPerGram }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Respons server tidak valid JSON");
    }

    if (!response.ok) {
      pesanError.textContent = data.error || "Terjadi kesalahan, coba lagi.";
      pesanError.hidden = false;
      return;
    }

    console.log("Respons zakat:", data); // cek nama field di Console (F12)
    tampilkanHasil(data);
  } catch (err) {
    console.error(err);
    pesanError.textContent = "Tidak bisa terhubung ke server, atau respons server tidak valid.";
    pesanError.hidden = false;
  } finally {
    selesaiLoading();
  }
});