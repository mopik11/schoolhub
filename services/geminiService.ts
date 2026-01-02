// services/aiService.ts

// Tady vlož tu adresu, kterou ti vypsal cloudflared tunnel
const TUNNEL_URL = "https://message-organisms-pierce-construction.trycloudflare.com"; 

export const generateAIResponse = async (prompt: string) => {
  try {
    const response = await fetch(`${TUNNEL_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: prompt,
        stream: false // Pro začátek vypneme streamování pro jednodušší kód
      })
    });

    if (!response.ok) throw new Error('AI na Raspberry neodpovídá');

    const data = await response.json();
    return data.response; // Ollama vrací text v poli 'response'
  } catch (error) {
    console.error("Chyba při volání lokálního AI:", error);
    return "Omlouvám se, moje Raspberry Pi je momentálně offline.";
  }
};
