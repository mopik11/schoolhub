import React, { useState, useEffect, useRef } from 'react';
import { generatePodcastAudio, generateScriptFromMaterial } from '../services/geminiService';

interface PodcastGeneratorProps {
    selectedMaterial: { title: string, content: string } | null;
}

const PodcastGenerator: React.FC<PodcastGeneratorProps> = ({ selectedMaterial }) => {
  // Audio Generation State
  const [inputText, setInputText] = useState('');
  const [isScriptGenerating, setIsScriptGenerating] = useState(false);
  const [isAudioGenerating, setIsAudioGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Visualization State
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  useEffect(() => {
    if (selectedMaterial) {
        setIsScriptGenerating(true);
        // Automatically generate script when material is selected
        generateScriptFromMaterial(selectedMaterial.content)
            .then(script => {
                setInputText(script);
                setIsScriptGenerating(false);
            })
            .catch(() => setIsScriptGenerating(false));
    }
  }, [selectedMaterial]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioContext) {
             try { audioContext.close(); } catch(e) {}
        }
    };
  }, [audioContext]);

  const handleGenerateAudio = async () => {
    if (!inputText.trim()) return;
    
    setIsAudioGenerating(true);
    if (audioSource) {
      try { audioSource.stop(); } catch (e) {}
    }

    const buffer = await generatePodcastAudio(inputText);
    
    if (buffer) {
        playAudio(buffer);
    }
    
    setIsAudioGenerating(false);
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    // Set canvas resolution matches display size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvasCtx.scale(dpr, dpr);

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
        if (!analyserRef.current) return; 
        
        // Check if playback finished (backup check)
        if (audioContext && audioContext.state === 'closed') {
             return;
        }

        analyser.getByteTimeDomainData(dataArray);

        // Update Progress
        if (audioContext && startTimeRef.current && durationRef.current > 0) {
             const elapsed = audioContext.currentTime - startTimeRef.current;
             const p = Math.min((elapsed / durationRef.current) * 100, 100);
             setProgress(p);
        }

        // Draw Canvas
        canvasCtx.clearRect(0, 0, rect.width, rect.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = '#7c3aed'; // violet-600

        canvasCtx.beginPath();

        const sliceWidth = (rect.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * rect.height) / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(rect.width, rect.height / 2);
        canvasCtx.stroke();

        animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const playAudio = (buffer: AudioBuffer) => {
    // Close existing context if any
    if (audioContext) {
        try { audioContext.close(); } catch(e) {}
    }

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    setAudioContext(ctx);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    durationRef.current = buffer.duration;
    
    source.connect(analyser);
    analyser.connect(ctx.destination);
    
    source.onended = () => {
        setIsPlaying(false);
        setProgress(100); // Ensure full bar at end
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        // Reset progress after a brief delay for UX
        setTimeout(() => setProgress(0), 1000);
    };
    
    source.start();
    startTimeRef.current = ctx.currentTime;
    
    setAudioSource(source);
    setIsPlaying(true);
    setProgress(0);
    
    // Start visualization
    requestAnimationFrame(drawWaveform);
  };

  const handleStop = () => {
    if (audioSource) {
      try {
        audioSource.stop();
      } catch (e) {
        console.error("Error stopping audio", e);
      }
    }
    setIsPlaying(false);
    setProgress(0);
    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 bg-gradient-to-r from-violet-600 to-purple-700 text-white flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-3 text-3xl">🎙️</span> 
              Generátor Studijních Podcastů
            </h2>
            <p className="mt-1 text-purple-100 opacity-90">
              Vytváření audia z vybraných studijních materiálů.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Source Material Preview (if any) */}
        {selectedMaterial ? (
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <h4 className="text-xs font-bold text-purple-600 uppercase mb-1">Zdrojový materiál</h4>
                <h3 className="font-semibold text-purple-900 mb-1">{selectedMaterial.title}</h3>
                <p className="text-sm text-purple-800 opacity-75 line-clamp-2">{selectedMaterial.content}</p>
            </div>
        ) : (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-amber-800 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                Pro vygenerování podcastu prosím vyberte materiál (Úkol, Poznámku nebo Zprávu) v záložce <strong>Materiály</strong>.
            </div>
        )}

        {/* Script Editor & Audio */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1">
           <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Vygenerovaný Scénář</h3>
              <div className="text-xs text-slate-500">
                {isScriptGenerating ? 'Vytvářím návrh...' : `${inputText.length} znaků`}
              </div>
           </div>
           
           <div className="p-4 flex-1 flex flex-col space-y-4 overflow-hidden relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={selectedMaterial ? "Generuji scénář..." : "Není vybrán žádný materiál."}
                disabled={!selectedMaterial}
                className={`flex-1 w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none text-slate-700 leading-relaxed text-base shadow-inner bg-slate-50 transition-all ${isPlaying ? 'pb-32' : ''}`}
              />

              {/* Visualizer & Progress Overlay / Container */}
              {isPlaying && (
                <div className="absolute bottom-20 left-6 right-6 h-24 bg-white/90 backdrop-blur-sm rounded-xl border border-violet-100 shadow-lg flex flex-col p-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Canvas for Waveform */}
                    <div className="flex-1 relative w-full h-full overflow-hidden">
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-violet-600 rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={handleGenerateAudio}
                  disabled={isAudioGenerating || !inputText.trim() || isScriptGenerating || isPlaying}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center
                    ${(isAudioGenerating || isScriptGenerating || isPlaying)
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-violet-600 hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                >
                  {isAudioGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Vytvářím Audio...
                    </>
                  ) : isScriptGenerating ? (
                     "Píšu Scénář..."
                  ) : isPlaying ? (
                    "Přehrávám..."
                  ) : (
                    <>
                      <span className="mr-2">✨</span> Vygenerovat & Přehrát Audio
                    </>
                  )}
                </button>

                {isPlaying && (
                  <button
                    onClick={handleStop}
                    className="px-6 py-3 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors flex items-center shadow-sm"
                  >
                    <span className="mr-2">⏹</span> Stop
                  </button>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastGenerator;