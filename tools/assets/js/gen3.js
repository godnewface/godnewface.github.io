let prompts = {};

window.onload = async () => {
  const res = await fetch("assets/json/gen3.json");
  prompts = await res.json();
};

function generatePrompt() {
  const kategori = document.getElementById("kategori").value;
  const list = prompts[kategori];
  const result = list[Math.floor(Math.random() * list.length)];
  document.getElementById("promptOutput").innerText = result;
}
