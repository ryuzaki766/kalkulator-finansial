// common.js
// Fungsi-fungsi yang dipakai bersama oleh semua kalkulator di situs ini.
// Ditaruh di sini biar kalkulator baru nanti tinggal pakai ulang, ga perlu tulis lagi.

// Format angka jadi Rupiah, misal 4635062 -> "Rp4.635.062"
function formatRupiah(angka) {
  return "Rp" + Math.round(angka).toLocaleString("id-ID");
}

// Angka bulat (rupiah, tahun) - titik/koma dianggap pemisah ribuan, dibuang semua
function bersihkanAngkaBulat(teks) {
  const hanyaAngka = teks.replace(/[^0-9]/g, "");
  return hanyaAngka === "" ? NaN : Number(hanyaAngka);
}

// Angka desimal (persen bunga) - titik/koma terakhir dianggap tanda desimal
function bersihkanAngkaDesimal(teks) {
  const dibersihkan = teks.replace(/[^0-9.,]/g, "").replace(",", ".");
  return dibersihkan === "" ? NaN : Number(dibersihkan);
}

// Pasang "live formatting": begitu user ngetik angka di sebuah input,
// otomatis muncul titik ribuan. Contoh: ketik "5000000" jadi "5.000.000".
function pasangFormatOtomatis(inputEl) {
  inputEl.addEventListener("input", () => {
    const angka = bersihkanAngkaBulat(inputEl.value);
    inputEl.value = isNaN(angka) ? "" : angka.toLocaleString("id-ID");
  });
}

// Animasi "ngitung naik" dari 0 ke angka hasil akhir, biar hasil kerasa hidup.
// Otomatis dimatikan kalau user mengaktifkan "reduce motion" di sistemnya.
function animasiHitungNaik(elemen, nilaiAkhir, durasiMs = 600) {
  const kurangiGerakan = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (kurangiGerakan) {
    elemen.textContent = formatRupiah(nilaiAkhir);
    return;
  }

  const waktuMulai = performance.now();

  function frame(waktuSekarang) {
    const progres = Math.min((waktuSekarang - waktuMulai) / durasiMs, 1);
    const nilaiSekarang = nilaiAkhir * progres;
    elemen.textContent = formatRupiah(nilaiSekarang);
    if (progres < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// Tampilkan kotak hasil dengan animasi fade + slide-up yang halus
function tampilkanHasil(kotakHasil) {
  kotakHasil.hidden = false;
  // requestAnimationFrame supaya browser sempat "sadar" elemen ini baru muncul
  // sebelum transisi CSS-nya dijalankan (kalau tidak, animasinya tidak kelihatan)
  requestAnimationFrame(() => {
    kotakHasil.classList.add("tampil");
  });
}

function sembunyikanHasil(kotakHasil) {
  kotakHasil.hidden = true;
  kotakHasil.classList.remove("tampil");
}

// Ubah tombol jadi status "loading" - disable + ganti teks
function pasangLoading(tombol, teksLoading) {
  const teksAsli = tombol.textContent;
  tombol.disabled = true;
  tombol.textContent = teksLoading;
  return () => {
    tombol.disabled = false;
    tombol.textContent = teksAsli;
  };
}