// services/geminiService.ts

// Tvoje aktuální funkční adresa tunelu
const TUNNEL_URL = "https://creations-suspension-arms-tension.trycloudflare.com";

const callOllama = async (prompt: string) => {
  const response = await fetch(`${TUNNEL_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2', 
      prompt: prompt,
      stream: false
    })
  });

  if (!response.ok) throw new Error('Raspberry Pi neodpovídá');
  const data = await response.json();
  return data.response;
};

// EXPORTY PRO OPRAVU BUILDU (přesně podle tvých chybových hlášení)
export const sendMessageToGemini = async (prompt: string) => {
  return await callOllama(prompt);
};

export const generateScriptFromMaterial = async (material: any) => {
  const prompt = `Vytvoř scénář z tohoto materiálu: ${JSON.stringify(material)}`;
  return await callOllama(prompt);
};

export const generatePodcastAudio = async (text: string) => {
  console.log("Audio zatím není na RPi podporováno.");
  return ""; 
};
