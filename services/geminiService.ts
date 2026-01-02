// Název funkce MUSÍ být sendMessageToGemini, protože ho tak hledá Chatbot.tsx
export const sendMessageToGemini = async (prompt: string) => {
  // SEM vlož aktuální adresu z terminálu Raspberry Pi (.trycloudflare.com)
  const TUNNEL_URL = "https://tvuj-nahodny-nazev.trycloudflare.com"; 

  try {
    const response = await fetch(`${TUNNEL_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2', 
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Raspberry Pi neodpovídá');

    const data = await response.json();
    // Ollama vrací text v poli 'response', vracíme ho jako prostý string
    return data.response; 
  } catch (error) {
    console.error("Chyba lokální AI:", error);
    return "Momentálně jsem offline. Raspberry Pi nebo tunel neběží.";
  }
};
