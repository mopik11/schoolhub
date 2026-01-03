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
    
    // TENTO ŘÁDEK TI UKÁŽE DATA V KONZOLI (F12)
    console.log('Kompletní data z Ollamy:', data); 
    
    return data.response || "AI vrátila prázdnou odpověď.";
  } catch (error) {
    console.error('Chyba při volání AI:', error);
    throw error;
  }
};

export const generateScriptFromMaterial = async (material: any) => {
  const prompt = `Vytvoř studijní scénář z: ${JSON.stringify(material)}`;
  return await sendMessageToGemini(prompt);
};

export const generatePodcastAudio = async (text: string) => {
  return ""; 
};
