function generateTaggedLyrics() {
  const lyrics = document.getElementById("lyricsInput").value;

  const sectionStyles = {};
  document.querySelectorAll(".structure-row").forEach(row => {
    const section = row.querySelector(".section-name").value.trim();
    const select = row.querySelector(".section-style");
    const selectedOptions = Array.from(select.selectedOptions).map(opt => opt.value);
    if (section && selectedOptions.length > 0) {
      sectionStyles[section.toLowerCase()] = selectedOptions;
    }
  });

  const output = lyrics.replace(/\[(.*?)\]/g, (match, tag) => {
    const sectionName = tag.trim().toLowerCase();
    const styles = sectionStyles[sectionName];
    return styles ? `[${tag} - ${styles.join(", ")}]` : match;
  });

  document.getElementById("outputText").textContent = output;
  localStorage.setItem("savedStyles", JSON.stringify(sectionStyles));
}

function copyOutput() {
  const outputText = document.getElementById("outputText").textContent;
  navigator.clipboard.writeText(outputText).then(() => {
    alert("✅ Output berhasil disalin ke clipboard!");
  }).catch(err => {
    alert("❌ Gagal menyalin: " + err);
  });
}

function createDropdownTemplate() {
  const select = document.createElement("select");
  select.className = "section-style";
  select.multiple = true;
  select.innerHTML = `
    <optgroup label="Mood">
      <option>Rebellious</option>
      <option>Bittersweet</option>
      <option>Hopeful</option>
      <option>Dark</option>
      <option>Nostalgic</option>
      <option>Energetic</option>
      <option>Melancholy</option>
    </optgroup>
    <optgroup label="Instruments">
      <option>Distorted Guitar</option>
      <option>Skank Guitar</option>
      <option>Trumpet Section</option>
      <option>808 Bass</option>
      <option>Analog Synth</option>
      <option>Drum Machine</option>
      <option>Lo-fi Piano</option>
    </optgroup>
    <optgroup label="Vocal Style">
      <option>Clean</option>
      <option>Screamed</option>
      <option>Spoken Word</option>
      <option>Falsetto</option>
      <option>Gang Vocals</option>
    </optgroup>
    <optgroup label="Production Style">
      <option>Raw</option>
      <option>Lo-fi Tape</option>
      <option>High-gloss Radio Pop</option>
      <option>Garage Recording</option>
      <option>Wall of Sound</option>
    </optgroup>
  `;
  return select;
}

function createStructureRow(label) {
  const row = document.createElement("div");
  row.className = "structure-row";

  const input = document.createElement("input");
  input.className = "section-name";
  input.type = "text";
  input.value = label;
  input.readOnly = true;

  const select = createDropdownTemplate();

  row.appendChild(input);
  row.appendChild(select);
  return row;
}

function importStyleFromJSON(json) {
  try {
    const data = JSON.parse(json);
    document.querySelectorAll(".structure-row").forEach(row => {
      const section = row.querySelector(".section-name").value.trim().toLowerCase();
      const select = row.querySelector(".section-style");
      if (data[section] && Array.isArray(data[section])) {
        Array.from(select.options).forEach(option => {
          option.selected = data[section].includes(option.value);
        });
      }
    });
    alert("✅ Style berhasil diimpor dari JSON!");
  } catch (err) {
    alert("❌ Format JSON tidak valid!");
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

window.addEventListener("DOMContentLoaded", () => {
  const structure = [
    "Intro", "Verse 1", "Verse 2", "Verse 3",
    "Pre-Chorus 1", "Pre-Chorus 2",
    "Chorus 1", "Chorus 2",
    "Breakdown", "Final Chorus", "Outro"
  ];

  const container = document.getElementById("structureInputs");
  container.innerHTML = "";
  structure.forEach(label => {
    container.appendChild(createStructureRow(label));
  });

  const importBtn = document.createElement("button");
  importBtn.textContent = "Import Style via JSON";
  importBtn.onclick = () => {
    const input = prompt("Tempelkan JSON Style di sini:");
    if (input) importStyleFromJSON(input);
  };
  container.parentElement.appendChild(importBtn);

  const toggleModeBtn = document.createElement("button");
  toggleModeBtn.textContent = "Toggle Dark Mode";
  toggleModeBtn.onclick = toggleDarkMode;
  container.parentElement.appendChild(toggleModeBtn);

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  const saved = localStorage.getItem("savedStyles");
  if (saved) {
    importStyleFromJSON(saved);
  }
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});