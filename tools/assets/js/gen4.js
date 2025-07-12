function generatePrompt() {
    const category = document.getElementById('category').value;
    const style = document.getElementById('style').value;
    const keywords = document.getElementById('keywords').value;
    const language = document.getElementById('language').value;

    let prompt = '';

    if (language === 'id') {
      prompt = `Tulis satu lelucon lucu dalam bahasa Indonesia. Gunakan kategori '${category}', gaya humor '${style}', dan sertakan kata kunci '${keywords}'. Buat lelucon yang terasa manusiawi, natural, dan bisa dibayangkan dibawakan oleh stand-up comedian. Hindari terlalu kaku atau terlalu generik. Akhiri dengan punchline yang tidak terduga tapi tetap masuk akal.`;
    } else {
      prompt = `Write a funny joke in English. The joke should be in the category of '${category}', using a '${style}' humor style, and include the keywords '${keywords}'. Make it feel natural and human, as if told by a stand-up comedian. Avoid sounding too robotic or generic. End with an unexpected but believable punchline.`;
    }

    document.getElementById('result').innerText = prompt;

    // Update chat links
    const chatgptLink = `https://chat.openai.com/?model=gpt-4&prompt=${encodeURIComponent(prompt)}`;
    const deepseekLink = `https://chat.deepseek.com/?q=${encodeURIComponent(prompt)}`;

    document.getElementById('chatgpt-link').href = chatgptLink;
    document.getElementById('deepseek-link').href = deepseekLink;
    document.getElementById('link-box').style.display = 'block';
  }

  function copyToClipboard() {
    const text = document.getElementById('result').innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert('Prompt berhasil disalin ke clipboard!');
    });
  }