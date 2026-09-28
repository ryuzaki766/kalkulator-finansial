// zakat.js
// Tugas file ini di sisi FRONTEND untuk kalkulator Zakat Penghasilan:
// 1. Ambil input dari form
// 2. Kirim ke backend (POST /api/kalkulator/zakat)
// 3. Tampilkan hasil yang dikirim balik oleh backend
// Fungsi bantu (format angka, animasi, dll) ada di common.js

const form = document.getElementById("form-zakat");
const tombolHitung = form.querySelector(".btn-hitung");
const hasilBox = document.getElementById("hasil");
const pesanError = document.getElementById("pesan-error");
const inputPendapatan = document.getElementById("pendapatan");
const labelPendapatan = document.getElementById("label-pendapatan");
const MAX_INPUT = 100_000_000_000;


const KONFIG_METODE = {
  bulanan: {
    labelInput: "Pendapatan per bulan (Rp)",
    placeholder: "8.000.000",
    fieldApi: "pendapatanPerBulan",
    fieldZakat: "zakatPerBulan",
    labelHasil: "Zakat per bulan",
    labelPendapatanTahunan: "Pendapatan setahun",
  },
  tahunan: {
    labelInput: "Total pendapatan setahun (Rp)",
    placeholder: "96.000.000",
    fieldApi: "pendapatanPerTahun",
    fieldZakat: "zakatPerTahun",
    labelHasil: "Zakat per tahun",
    labelPendapatanTahunan: "Total pendapatan setahun",
  },
};

function metodeTerpilih() {
  return form.querySelector('input[name="metode"]:checked').value;
}

function sesuaikanFormDenganMetode() {
  const config = KONFIG_METODE[metodeTerpilih()];
  labelPendapatan.textContent = config.labelInput;
  inputPendapatan.placeholder = config.placeholder;
  pesanError.hidden = true;
  sembunyikanHasil(hasilBox);
}

form.querySelectorAll('input[name="metode"]').forEach((radio) => {
  radio.addEventListener("change", sesuaikanFormDenganMetode);
});
// Live formatting titik ribuan untuk kedua kolom (sama-sama angka bulat).
pasangFormatOtomatis(document.getElementById("pendapatan"));
pasangFormatOtomatis(document.getElementById("harga-emas"));

// Isi dan tampilkan hasil zakat. Beda dari kalkulator lain karena labelnya
// berubah tergantung apakah pendapatan sudah wajib zakat atau belum.
function isiHasilZakat(data, config) {                       // ditambah parameter config
  labelHasil.textContent = config.labelHasil;              // dulu: "Zakat per bulan"
    angkaHasil.textContent = formatRupiah(data[config.fieldZakat]);  // dulu: data.zakatPerBulan
  document.getElementById("label-pendapatan-tahunan").textContent =   // baris baru
    config.labelPendapatanTahunan;

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

  tampilkanHasil(hasilBox);
  hasilBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  pesanError.hidden = true;
  sembunyikanHasil(hasilBox);
const metode = metodeTerpilih();
const config = KONFIG_METODE[metode];
const pendapatan = bersihkanAngkaBulat(inputPendapatan.value);   // dulu: pendapatanPerBulan

body:JSON.stringify({ metode, [config.fieldApi]: pendapatan, hargaEmasPerGram }),

isiHasilZakat(data, config);                                      // dulu: isiHasilZakat(data)
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

    isiHasilZakat(data);
  } catch (err) {
    pesanError.textContent = "Tidak bisa terhubung ke server, atau respons server tidak valid.";
    pesanError.hidden = false;
  } finally {
    selesaiLoading();
  }
});