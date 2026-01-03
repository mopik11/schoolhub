// services/geminiService.ts

// Adresa tvého tunelu z tvého screenshotu
const TUNNEL_URL = "https://clients-update-scientists-mouth.trycloudflare.com";

const callOllama = async (prompt: string) => {
  const response = await fetch(`${TUNNEL_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma3:4b', 
      prompt: prompt,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error('Raspberry Pi neodpovídá');
  }

  const data = await response.json();
  return data.response;
};

// EXPORTY, KTERÉ MUSÍ EXISTOVAT PRO ÚSPĚŠNÝ BUILD NA GITHUB PAGES:
export const sendMessageToGemini = async (prompt: string) => {
  return await callOllama(prompt);
};

export const generateScriptFromMaterial = async (material: any) => {
  const prompt = `Vytvoř studijní scénář z tohoto materiálu: ${JSON.stringify(material)}`;
  return await callOllama(prompt);
};

export const generatePodcastAudio = async (text: string) => {
  console.log("Audio generování zatím není na Raspberry Pi aktivní.");
  return ""; 
};
