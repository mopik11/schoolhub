const TUNNEL_URL = "https://clients-update-scientists-mouth.trycloudflare.com"; // Zkontroluj, zda je tato URL stále aktuální!

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
      const errorText = await response.text();
      console.error('Chyba z Raspberry:', errorText);
      throw new Error(`Raspberry Pi vrátilo chybu: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data z Ollamy:', data); // Toto uvidíš v konzoli F12
    
    // Ollama vrací text v poli "response"
    return data.response || "AI vrátila prázdnou odpověď.";
    
  } catch (error) {
    console.error('Chyba při volání AI:', error);
    throw error;
  }
};
