function toggleMetodeInputs() {
  const metode = document.getElementById("metode").value;
  document.getElementById("tambahanKualitatif").classList.add("hidden");
  document.getElementById("tambahanKuantitatif").classList.add("hidden");

  if (metode === "kualitatif" || metode === "studi kasus") {
    document.getElementById("tambahanKualitatif").classList.remove("hidden");
  } else if (metode === "kuantitatif") {
    document.getElementById("tambahanKuantitatif").classList.remove("hidden");
  }
}

function generatePrompt() {
  const judul = document.getElementById("judul").value.trim();
  const metode = document.getElementById("metode").value;
  const teori = document.getElementById("teori").value.trim();
  const strategi = document.getElementById("strategi").value.trim();
  let metodeDetail = "";

  if (!judul || !metode || !teori || !strategi) {
    alert("Harap isi semua kolom input utama.");
    return;
  }

  if (metode === "kualitatif" || metode === "studi kasus") {
    const tambahan = document.getElementById("tambahan").value.trim();
    if (!tambahan) {
      alert("Silakan lengkapi metode tambahan untuk metode kualitatif atau studi kasus.");
      return;
    }
    metodeDetail = `${metode} (${tambahan})`;
  } else if (metode === "kuantitatif") {
    const variabel = document.getElementById("variabel").value.trim();
    const sampel = document.getElementById("sampel").value.trim();
    const jumlah = document.getElementById("jumlah").value.trim();
    if (!variabel || !sampel || !jumlah) {
      alert("Silakan lengkapi data variabel, sampel, dan jumlah sampel untuk kuantitatif.");
      return;
    }
    metodeDetail = `${metode} (variabel: ${variabel}, sampel: ${sampel}, jumlah: ${jumlah})`;
  }

  const prompt = `Buat artikel ilmiah IMRaD Bahasa Indonesia yang formal namun tetap mengalir dan alami seperti ditulis manusia berjudul “${judul}”, metode ${metodeDetail}.\n` +
                 `Gunakan literatur ≥2015 dari jurnal Scopus/SINTA dan teori internasional (${teori}).\n` +
                 `Bahas strategi: ${strategi}.\n` +
                 `Akhiri dengan kesimpulan & rekomendasi. Sertakan ≥5 referensi ilmiah.`;

  document.getElementById("output").textContent = prompt;
}

function copyToClipboard() {
  const text = document.getElementById("output").textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Prompt berhasil disalin ke clipboard!");
  }, () => {
    alert("Gagal menyalin prompt.");
  });
}

// === Theme Toggle ===
const toggle = document.getElementById("themeToggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");

// Apply theme on load
document.body.classList.add(savedTheme || (prefersDark ? "dark" : "light"));
toggle.checked = document.body.classList.contains("dark");

// Handle toggle
toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", toggle.checked);
  document.body.classList.toggle("light", !toggle.checked);
  localStorage.setItem("theme", toggle.checked ? "dark" : "light");
});
