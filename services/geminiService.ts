// services/geminiService.ts

// VŽDY ZKONTROLUJ TU URL PODLE TERMINÁLU!
const TUNNEL_URL = "https://wma-alcohol-eyes-weekly.trycloudflare.com"; 

export const sendMessageToGemini = async (prompt: string, useSearch: boolean = false) => {
  try {
    const response = await fetch(`${TUNNEL_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:4b',
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) throw new Error(`Chyba: ${response.status}`);

    const data = await response.json();
    console.log('Data z Ollamy:', data); 

    // Úprava pro tvůj Chatbot.tsx: vracíme objekt s klíčem "text"
    return {
      text: data.response || "AI vrátila prázdnou odpověď.",
      sources: [] // Ollama zatím zdroje nepodporuje, tak vracíme prázdné pole
    };
    
  } catch (error) {
    console.error('Chyba při volání AI:', error);
    return {
      text: "Omlouvám se, spojení s Raspberry Pi selhalo. Zkontroluj tunel a Ollamu.",
      sources: []
    };
  }
};

// Funkce pro build na GitHubu
export const generateScriptFromMaterial = async (material: any) => {
  const prompt = `Vytvoř studijní scénář: ${JSON.stringify(material)}`;
  return await sendMessageToGemini(prompt);
};

export const generatePodcastAudio = async (text: string) => {
  return ""; 
};
