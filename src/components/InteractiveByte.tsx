import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Info, HelpCircle } from 'lucide-react';

interface InteractiveByteProps {
  binaryString: string; // Length 8, e.g. "01000001"
  charLabel?: string;
  onByteChange: (newBinaryString: string) => void;
}

export const InteractiveByte: React.FC<InteractiveByteProps> = ({
  binaryString = "01000001",
  charLabel = "A",
  onByteChange,
}) => {
  // Pad if somehow less than 8
  const paddedBinary = binaryString.padEnd(8, '0').substring(0, 8);
  const bits = paddedBinary.split('').map(b => b === '1');

  // Positional values of 8-bit integer indices (from left to right: 2^7 down to 2^0)
  const posValues = [128, 64, 32, 16, 8, 4, 2, 1];

  const handleBitToggle = (index: number) => {
    const newBits = [...bits];
    newBits[index] = !newBits[index];
    const newBinaryString = newBits.map(b => (b ? '1' : '0')).join('');
    onByteChange(newBinaryString);
  };

  const decimalValue = bits.reduce((sum, bit, idx) => (bit ? sum + posValues[idx] : sum), 0);
  const hexValue = decimalValue.toString(16).toUpperCase().padStart(2, '0');

  // Interpret standard printable characters
  let decodedChar = '';
  if (decimalValue >= 32 && decimalValue <= 126) {
    decodedChar = String.fromCharCode(decimalValue);
  } else if (decimalValue >= 160 && decimalValue <= 255) {
    decodedChar = String.fromCharCode(decimalValue);
  } else if (decimalValue === 10) {
    decodedChar = "↵ (Saut de ligne)";
  } else if (decimalValue === 32) {
    decodedChar = "␣ (Espace)";
  } else {
    decodedChar = "Non imprimable";
  }

  // Quick preset actions for learning
  const applyPreset = (presetBinary: string) => {
    onByteChange(presetBinary);
  };

  return (
    <div 
      id="interactive-byte-builder"
      className="bg-black/60 border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all hover:shadow-emerald-950/25 hover:border-emerald-500/30 font-mono"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm uppercase tracking-widest text-emerald-400 flex items-center gap-2 font-bold">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
              <Sparkles id="sparkles-icon" className="w-3.5 h-3.5" />
            </span>
            03 // Simulateur Tactile d'Octets
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 lowercase">
            Cliquez sur les interrupteurs pour moduler les bits en direct.
          </p>
        </div>

        {/* Learning Quick Actions */}
        <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-lg border border-emerald-500/15">
          <button
            onClick={() => applyPreset("01000001")}
            className="text-[9px] font-mono px-2 py-1 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors uppercase border border-transparent hover:border-emerald-500/20"
            title="Lettre majuscule A (65)"
          >
            A (ASCII 65)
          </button>
          <button
            onClick={() => applyPreset("01100001")}
            className="text-[9px] font-mono px-2 py-1 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors uppercase border border-transparent hover:border-emerald-500/20"
            title="Lettre minuscule a (97)"
          >
            a (ASCII 97)
          </button>
          <button
            onClick={() => applyPreset("00110000")}
            className="text-[9px] font-mono px-2 py-1 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors uppercase border border-transparent hover:border-emerald-500/20"
            title="Numéro 0 (48)"
          >
            0 (ASCII 48)
          </button>
          <button
            onClick={() => applyPreset("00000000")}
            className="text-[9px] font-mono px-2 py-1 text-red-400/80 hover:bg-red-950/20 rounded transition-colors uppercase border border-transparent hover:border-red-500/20"
          >
            Vider
          </button>
        </div>
      </div>

      {/* Grid of 8 Switches representing individual bits */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-6">
        {bits.map((isOn, index) => {
          const powerValue = posValues[index];
          return (
            <div
              key={index}
              id={`bit-container-${index}`}
              className={`flex flex-col items-center p-2 rounded-xl transition-all border ${
                isOn
                  ? 'bg-emerald-950/25 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                  : 'bg-black/35 border-emerald-500/5'
              }`}
            >
              {/* Positional Heading math representation */}
              <span className="text-[9px] font-mono text-slate-500 mb-1" title={`2^${7 - index}`}>
                2^{7 - index}
              </span>
              
              <span className="text-[10px] font-mono text-slate-400 mb-2">
                {powerValue}
              </span>

              {/* Interactive Tactile Toggle Switch */}
              <button
                id={`bit-toggle-${index}`}
                onClick={() => handleBitToggle(index)}
                className={`w-full py-2.5 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all outline-none focus:ring-1 focus:ring-emerald-500 ${
                  isOn
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)] font-bold scale-[1.02]'
                    : 'bg-slate-900 border border-emerald-500/5 hover:border-emerald-500/25 text-slate-400'
                }`}
              >
                <span className="text-sm font-mono">{isOn ? '1' : '0'}</span>
                <span className="text-[8px] uppercase tracking-wider opacity-60 font-mono">
                  {isOn ? 'on' : 'off'}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Numerical and Character results representing the current octet state */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-black/40 border border-emerald-500/10">
        <div id="result-bin-val" className="flex flex-col gap-1">
          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Binaire</span>
          <span className="text-xs font-mono font-bold text-blue-400">{paddedBinary}</span>
        </div>
        <div id="result-dec-val" className="flex flex-col gap-1">
          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Décimal</span>
          <span className="text-xs font-mono font-bold text-emerald-400">{decimalValue}</span>
        </div>
        <div id="result-hex-val" className="flex flex-col gap-1">
          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Hexadécimal</span>
          <span className="text-xs font-mono font-bold text-amber-500">0x{hexValue}</span>
        </div>
        <div id="result-char-val" className="flex flex-col gap-1">
          <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Caractère</span>
          <span className="text-xs font-mono font-bold text-emerald-300 truncate">
            {charLabel && charLabel !== '.' ? charLabel : decodedChar}
          </span>
        </div>
      </div>

      {/* Mini Educational Tip */}
      <div className="mt-4 flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed font-mono">
        <Info className="w-3 h-3 text-emerald-500/60 mt-0.5 shrink-0" />
        <p>
          L'activation des bits additionne leurs puissances de 2 respectives pour générer le code UTF-8.
        </p>
      </div>
    </div>
  );
};
