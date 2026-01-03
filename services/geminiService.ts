// services/geminiService.ts

// DŮLEŽITÉ: Tuto URL vždy aktualizuj podle toho, co ti vypíše cloudflared v terminálu!
const TUNNEL_URL = "https://wma-alcohol-eyes-weekly.trycloudflare.com"; 

/**
 * Hlavní funkce pro chat (používá gemma3:4b nebo llama3.2)
 */
export const sendMessageToGemini = async (prompt: string, useSearch: boolean = false) => {
  try {
    // Pokud je useSearch zapnuto, můžeme v budoucnu změnit model na llama3.2
    const modelName = useSearch ? 'llama3.2' : 'gemma3:4b';

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
      throw new Error(`Server vrátil chybu: ${response.status}`);
    }

    const data = await response.json();
    console.log('Kompletní data z Ollamy:', data); 

    // Vracíme objekt se strukturou, kterou tvůj Chatbot.tsx vyžaduje
    return {
      text: data.response || "AI neodpověděla.",
      sources: [] 
    };
    
  } catch (error) {
    console.error('Chyba při volání AI:', error);
    return {
      text: "Chyba připojení k Raspberry Pi. Zkontroluj TUNNEL_URL a OLLAMA_ORIGINS.",
      sources: []
    };
  }
};

/**
 * OPRAVA PRO PODCASTY: Tato funkce generuje scénář z nahraných materiálů.
 * Vrací čistý string, aby neházelo chybu .trim()
 */
export const generateScriptFromMaterial = async (material: any) => {
  try {
    const prompt = `Jsi studijní asistent. Vytvoř strukturovaný scénář pro podcast z těchto materiálů: ${JSON.stringify(material)}`;
    
    // Použijeme naši hlavní funkci
    const result = await sendMessageToGemini(prompt);
    
    // Podcasty v tvém kódu očekávají přímo text, ne objekt
    return result.text;

  } catch (error) {
    console.error("Chyba v generateScriptFromMaterial:", error);
    return "Nepodařilo se vygenerovat scénář.";
  }
};

/**
 * Funkce pro generování audia (simulace pro úspěšný build)
 */
export const generatePodcastAudio = async (text: string) => {
  console.log("Generování audia pro:", text);
  // Vrátíme ukázkovou MP3, aby se přehrávač v aplikaci nezasekl
  return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 
};
