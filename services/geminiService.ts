// services/geminiService.ts

// SEM vlož adresu z cloudflared tunelu na tvém Raspberry Pi
const TUNNEL_URL = "https://creations-suspension-arms-tension.trycloudflare.com";

// Společná pomocná funkce pro volání Ollamy na RPi
const callOllama = async (prompt: string) => {
  try {
    const response = await fetch(`${TUNNEL_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2', // nebo jiný model stažený přes 'ollama pull'
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Raspberry Pi neodpovídá');
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("AI Error:", error);
    return "Omlouvám se, moje lokální AI je momentálně offline.";
  }
};

// 1. Funkce pro Chatbot.tsx (opraví chybu na screenshotu)
export const sendMessageToGemini = async (prompt: string) => {
  return await callOllama(prompt);
};

// 2. Funkce pro PodcastGenerator.tsx (opraví druhou chybu)
export const generateScriptFromMaterial = async (material: any) => {
  const prompt = `Vytvoř scénář pro podcast na základě tohoto materiálu: ${JSON.stringify(material)}`;
  return await callOllama(prompt);
};

// 3. Pokud tvoje aplikace vyžaduje i audio (PodcastGenerator)
export const generatePodcastAudio = async (text: string) => {
  console.log("Audio generování na RPi vyžaduje další setup (např. Piper), zatím vracím simulaci.");
  return "audio_url_placeholder";
};
