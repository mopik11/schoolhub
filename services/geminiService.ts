// services/geminiService.ts

// VŽDY ZKONTROLUJ, ZDA TATO URL ODPOVÍDÁ TVÉMU TUNELU V TERMINÁLU!
const TUNNEL_URL = "https://clients-update-scientists-mouth.trycloudflare.com"; 

export const sendMessageToGemini = async (prompt: string) => {
  try {
    const response = await fetch(`${TUNNEL_URL}/api/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma3:4b',
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Raspberry Pi vrátilo chybu: ${response.status}`);
    }

    const data = await response.json();
    
    // Logování pro tvou kontrolu v konzoli (F12)
    console.log('Data z Ollamy:', data); 
    
    // Klíčové pro zobrazení v chatu: vracíme přímo textový řetězec
    return data.response; 
    
  } catch (error) {
    console.error('Chyba při volání AI:', error);
    return "Omlouvám se, spojení s Raspberry Pi selhalo. Zkontroluj, zda běží tunel a Ollama.";
  }
};

/**
 * Funkce pro generování scénáře z materiálů
 * Nutné pro úspěšný build na GitHubu
 */
export const generateScriptFromMaterial = async (material: any) => {
  const prompt = `Jsi studijní asistent. Vytvoř strukturovaný studijní scénář z tohoto materiálu: ${JSON.stringify(material)}`;
  return await sendMessageToGemini(prompt);
};

/**
 * Funkce pro simulaci generování audia
 * Nutné pro úspěšný build na GitHubu
 */
export const generatePodcastAudio = async (text: string) => {
  console.log("Generování audia pro:", text);
  return ""; 
};
