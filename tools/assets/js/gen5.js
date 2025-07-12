document.getElementById("promptForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const judul = document.getElementById("judul").value.trim();
  const penulis = document.getElementById("penulis").value.trim();
  const jurnal = document.getElementById("jurnal").value.trim();
  const volume = document.getElementById("volume").value.trim();
  const tahun = document.getElementById("tahun").value.trim();
  const doi = document.getElementById("doi").value.trim();

  const prompt =
    `Saya ingin mencari dan mendapatkan tautan langsung (direct download link) untuk karya akademik berikut:\n` +
    `- Judul     : ${judul}\n` +
    `- Penulis   : ${penulis}\n` +
    (jurnal ? `- Jurnal/Buku: ${jurnal}\n` : "") +
    (volume ? `- Volume/Edisi: ${volume}\n` : "") +
    `- Tahun     : ${tahun}\n` +
    (doi ? `- DOI/ISBN  : ${doi}\n` : "") +
    `\nTolong temukan versi **accepted manuscript** (jika jurnal) atau **preview/full-text PDF** (jika buku tersedia secara legal), dan berikan **tautan langsung** untuk download tanpa perlu login, paywall, atau langganan. Jika tidak tersedia versi PDF lengkap, mohon informasikan alternatif akses legal lainnya.`;

  document.getElementById("result").textContent = prompt;
  document.getElementById("actionButtons").style.display = "flex";

  document.getElementById(
    "scholarLink"
  ).href = `https://scholar.google.com/scholar?q=${encodeURIComponent(judul)}`;
  document.getElementById(
    "arxivLink"
  ).href = `https://arxiv.org/search/?query=${encodeURIComponent(
    judul
  )}&searchtype=all`;
  document.getElementById("doiLink").href = doi
    ? `https://doi.org/${doi}`
    : "https://doi.org/";
});

function copyPrompt() {
  const text = document.getElementById("result").textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Prompt berhasil disalin!");
  });
}
