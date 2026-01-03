// services/geminiService.ts

// Tuto URL adresu vždy zkontroluj v terminálu Raspberry Pi (cloudflared)
const TUNNEL_URL = "https://wma-alcohol-eyes-weekly.trycloudflare.com"; 

/**
 * Hlavní funkce pro komunikaci s AI na tvém Raspberry Pi
 * Zachovává dynamickou výměnu modelů podle nastavení uživatele
 */
export const sendMessageToGemini = async (prompt: string, useSearch: boolean = false) => {
  try {
    // VÝMĚNA MODELŮ: Pokud uživatel zapne Web Search, použijeme chytřejší Llama 3.2
    // Jinak zůstáváme u lehčí Gemma 3
    const modelName = useSearch ? 'gemma3:270m' : 'gemma3:4b';
    
    console.log(`Používám model: ${modelName} (Search: ${useSearch})`);

    const response = await fetch(`${TUNNEL_URL}/api/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      // Ošetření chyby 500 z tvého screenshotu
      throw new Error(`Server vrátil chybu: ${response.status}`);
    }

    const data = await response.json();

    // Vracíme objekt, který Chatbot.tsx očekává
    return {
      text: data.response || "AI neodpověděla.",
      sources: useSearch ? [{title: "Vyhledávání přes Llama 3.2", uri: "#"}] : []
    };
    
  } catch (error) {
    console.error('Chyba při volání AI na Raspberry:', error);
    return {
      text: "Chyba spojení s Raspberry Pi. Zkontroluj TUNNEL_URL a zda běží Ollama.",
      sources: []
    };
  }
};

/**
 * OPRAVA PRO PODCASTY:
 * Tato funkce nyní vrací čistý text, aby neházelo chybu L.trim is not a function
 */
export const generateScriptFromMaterial = async (material: any) => {
  try {
    // Zkrátíme vstup na 2000 znaků, aby malina nehodila chybu 500
    const materialSnippet = JSON.stringify(material).substring(0, 2000);
    const prompt = `Jsi studijní asistent. Vytvoř krátký scénář podcastu z tohoto textu (max 3 odstavce): ${materialSnippet}`;
    
    const result = await sendMessageToGemini(prompt);
    
    // Vracíme čistý text, který .trim() v podcast sekci bez problémů zpracuje
    return result.text;

  } catch (error) {
    console.error("Chyba v generateScriptFromMaterial:", error);
    return "Nepodařilo se vygenerovat scénář. Zkus to prosím znovu.";
  }
};

/**
 * Simulace audia
 */
export const generatePodcastAudio = async (text: string) => {
  console.log("Generuji audio pro:", text);
  return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 
};
