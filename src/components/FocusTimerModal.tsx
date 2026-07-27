import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogFocusMinutes: (minutes: number) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  onLogFocusMinutes,
}) => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'whitenoise' | 'binaural'>('none');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Web Audio Context ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodeRef = useRef<AudioNode | null>(null);

  const presets = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      stopAmbientAudio();
      if (mode === 'focus') {
        onLogFocusMinutes(25);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const handleModeChange = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(presets[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(presets[mode]);
    setIsRunning(false);
  };

  // Web Audio Noise Generator
  const toggleAmbientAudio = (sound: 'none' | 'rain' | 'whitenoise' | 'binaural') => {
    stopAmbientAudio();
    if (sound === 'none') {
      setAmbientSound('none');
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (sound === 'whitenoise' || sound === 'rain') {
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (sound === 'rain') {
            // Brown/Pink noise filter for rain effect
            data[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // boost
          } else {
            data[i] = white * 0.1;
          }
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.15;

        noise.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
        audioNodeRef.current = noise;
      } else if (sound === 'binaural') {
        // Binaural Alpha Beats (200Hz & 210Hz)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();

        osc1.frequency.value = 200;
        osc2.frequency.value = 210;

        osc1.connect(merger, 0, 0); // left
        osc2.connect(merger, 0, 1); // right
        gain.gain.value = 0.1;

        merger.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        audioNodeRef.current = gain;
      }

      setAmbientSound(sound);
      setIsPlayingAudio(true);
    } catch (err) {
      console.error('Web Audio error:', err);
    }
  };

  const stopAmbientAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  if (!isOpen) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Pomodoro Focus Room</h2>
          </div>
          <button onClick={() => { stopAmbientAudio(); onClose(); }} className="text-slate-400 font-bold">
            ✕
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center justify-center p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => handleModeChange('focus')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'focus' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'shortBreak' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => handleModeChange('longBreak')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'longBreak' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Big Display Clock */}
        <div className="py-6 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-inner">
          <span className="text-5xl sm:text-6xl font-black tracking-widest font-mono">
            {formattedTime}
          </span>
          <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider mt-2">
            {mode === 'focus' ? '🎯 Stay Locked In' : '☕ Relax & Recharge'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-16 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sounds Generator */}
        <div className="pt-4 border-t space-y-2">
          <p className="text-xs font-bold text-slate-700 flex items-center justify-center space-x-1">
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Ambient Sound Generator</span>
          </p>

          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'none', label: 'Off' },
              { id: 'rain', label: '🌧️ Rain' },
              { id: 'whitenoise', label: '📻 White' },
              { id: 'binaural', label: '🎧 Alpha' },
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => toggleAmbientAudio(snd.id as any)}
                className={`py-2 rounded-xl text-[11px] font-bold border transition-all ${
                  ambientSound === snd.id
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {snd.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
