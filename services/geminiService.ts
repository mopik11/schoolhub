import { GoogleGenAI, Modality } from "@google/genai";
import { MOCK_HOMEWORK, MOCK_NOTES, MOCK_TEAMS_MESSAGES } from "../constants";

// Helper to decode Base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode Audio Data
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Construct context from mock data
const getSchoolContext = () => {
  return `
    Data uživatele:
    Domácí úkoly (Bakaláři/Teams): ${JSON.stringify(MOCK_HOMEWORK)}
    Poznámky: ${JSON.stringify(MOCK_NOTES)}
    Nedávné zprávy z Teams: ${JSON.stringify(MOCK_TEAMS_MESSAGES)}
  `;
};

export const sendMessageToGemini = async (
  message: string,
  useSearch: boolean
): Promise<{ text: string; sources?: { uri: string; title: string }[] }> => {
  try {
    const context = getSchoolContext();
    
    // Choose model based on search requirement
    // Search Grounding: gemini-3-flash-preview
    // Deep reasoning on context: gemini-3-pro-preview
    
    const model = useSearch ? 'gemini-3-flash-preview' : 'gemini-3-pro-preview';
    
    const config: any = {
      systemInstruction: `Jsi EduHub AI, nápomocný školní asistent pro české studenty. 
      Máš přístup k domácím úkolům, poznámkám a zprávám studenta. Odpovídej vždy česky.
      
      KONTEXT UŽIVATELE:
      ${context}

      INSTRUKCE:
      ${useSearch 
        ? 'WEB SEARCH ZAPNUTÝ: Uživatel povolil vyhledávání na webu. Pokud dotaz vyžaduje externí informace (fakta, novinky, extra učivo), použij nástroj Google Search. Shrň nalezené informace do jasné a stručné odpovědi v češtině.' 
        : 'WEB SEARCH VYPNUTÝ: Odpovídej POUZE na základě poskytnutých školních materiálů (Kontext). Nevymýšlej si externí informace.'}
      `,
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: message,
      config: config,
    });

    const text = response.text || "Nemohu vygenerovat odpověď.";
    let sources: { uri: string; title: string }[] = [];

    // Extract sources if search was used
    if (useSearch && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    return { text, sources };

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return { text: "Omlouvám se, při zpracování požadavku došlo k chybě." };
  }
};

export const generateScriptFromMaterial = async (materialContent: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Převeď následující studijní materiál na poutavý, krátký scénář podcastu (monolog). Udržuj to pod 200 slov. Ať to zní přirozeně, jako přátelský učitel vysvětlující látku. Piš výhradně v ČEŠTINĚ.
            
            MATERIÁL:
            ${materialContent}`,
            config: {
                systemInstruction: "Jsi expert na psaní scénářů pro vzdělávací podcasty v českém jazyce.",
            }
        });
        return response.text || "Nepodařilo se vygenerovat scénář.";
    } catch (e) {
        console.error("Script gen error", e);
        return "Chyba při generování scénáře.";
    }
}

export const generatePodcastAudio = async (text: string): Promise<AudioBuffer | null> => {
  try {
    // TTS Model: gemini-2.5-flash-preview-tts
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck usually handles multi-lingual fairly well, mostly accent-wise
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received");
    }

    const outputAudioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)({sampleRate: 24000});
      
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );

    return audioBuffer;

  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};