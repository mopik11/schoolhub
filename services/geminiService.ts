const TUNNEL_URL = "https://clients-update-scientists-mouth.trycloudflare.com"; 

export const sendMessageToGemini = async (prompt: string) => {
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

    if (!response.ok) throw new Error(`Raspberry Pi vrátilo chybu: ${response.status}`);

    const data = await response.json();
    return data.response || "AI vrátila prázdnou odpověď.";
  } catch (error) {
    console.error('Chyba při volání AI:', error);
    throw error;
  }
};

// TYTO FUNKCE NESMÍ CHYBĚT, JINAK BUILD SPADNE:
export const generateScriptFromMaterial = async (material: any) => {
  const prompt = `Vytvoř studijní scénář z tohoto materiálu: ${JSON.stringify(material)}`;
  return await sendMessageToGemini(prompt);
};

export const generatePodcastAudio = async (text: string) => {
  // Zatím jen simulace, aby aplikace běžela
  console.log("Generuji audio pro:", text);
  return ""; 
};
