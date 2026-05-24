import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeftRight, 
  Copy, 
  Check, 
  Trash2, 
  Binary, 
  FileText, 
  ArrowDown, 
  ArrowUp,
  AlertTriangle,
  Flame,
  HelpCircle,
  Lightbulb,
  CornerDownRight
} from 'lucide-react';

import { ConversionMode, BinarySeparator, ByteRepresentation } from './types';
import { 
  textToBytes, 
  bytesToText, 
  bytesToBinary, 
  binaryToBytes, 
  getBytesDetails, 
  PRESET_SAMPLES 
} from './utils/binaryConverter';
import { InteractiveByte } from './components/InteractiveByte';
import { TutorialCard } from './components/TutorialCard';
import { BinaryStats } from './components/BinaryStats';

export default function App() {
  const [mode, setMode] = useState<ConversionMode>('TEXT_TO_BINARY');
  const [separator, setSeparator] = useState<BinarySeparator>(' ');
  
  // Real-time text inputs
  const [textInput, setTextInput] = useState<string>("Binaire est magique! ✨");
  const [binaryInput, setBinaryInput] = useState<string>("");

  const [selectedByteIndex, setSelectedByteIndex] = useState<number>(0);
  const [copiedType, setCopiedType] = useState<'input' | 'output' | null>(null);

  // Derive conversions
  let currentText = "";
  let currentBinary = "";
  let currentBytes = new Uint8Array();
  let binaryErrors: string[] = [];

  if (mode === 'TEXT_TO_BINARY') {
    currentText = textInput;
    currentBytes = textToBytes(textInput);
    currentBinary = bytesToBinary(currentBytes, separator);
  } else {
    currentBinary = binaryInput;
    const parsed = binaryToBytes(binaryInput);
    currentBytes = parsed.bytes;
    currentText = bytesToText(currentBytes);
    binaryErrors = parsed.errors;
  }

  // Generate detailed breakdown of bytes
  const bytesDetails = getBytesDetails(currentBytes);

  // Handle bit-toggling on specific index
  const handleByteChange = (newBinaryByteStr: string) => {
    if (bytesDetails.length === 0) return;
    
    // Convert 8-bit string to byte value
    const newByteVal = parseInt(newBinaryByteStr, 2);
    if (isNaN(newByteVal)) return;

    // Clone current bytes and replace at selected index
    const updatedBytes = new Uint8Array(currentBytes);
    const targetIndex = Math.min(selectedByteIndex, updatedBytes.length - 1);
    
    if (targetIndex >= 0 && targetIndex < updatedBytes.length) {
      updatedBytes[targetIndex] = newByteVal;
    }

    if (mode === 'TEXT_TO_BINARY') {
      const updatedText = bytesToText(updatedBytes);
      setTextInput(updatedText);
    } else {
      const updatedBinary = bytesToBinary(updatedBytes, separator);
      setBinaryInput(updatedBinary);
    }
  };

  // Keep selection within bounds if text shrinks
  useEffect(() => {
    if (bytesDetails.length === 0) {
      setSelectedByteIndex(0);
    } else if (selectedByteIndex >= bytesDetails.length) {
      setSelectedByteIndex(bytesDetails.length - 1);
    }
  }, [bytesDetails.length, selectedByteIndex]);

  // Sync initial binary input when switching modes to prevent empty states
  const toggleMode = () => {
    if (mode === 'TEXT_TO_BINARY') {
      setBinaryInput(currentBinary);
      setMode('BINARY_TO_TEXT');
    } else {
      setTextInput(currentText);
      setMode('TEXT_TO_BINARY');
    }
    setSelectedByteIndex(0);
  };

  // Clean-up inputs
  const clearAll = () => {
    setTextInput('');
    setBinaryInput('');
    setSelectedByteIndex(0);
  };

  // Copy functions
  const copyToClipboard = (text: string, type: 'input' | 'output') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Load sample preset
  const loadPreset = (presetText: string) => {
    if (mode === 'TEXT_TO_BINARY') {
      setTextInput(presetText);
    } else {
      const bytes = textToBytes(presetText);
      const formattedBin = bytesToBinary(bytes, separator);
      setBinaryInput(formattedBin);
    }
    setSelectedByteIndex(0);
  };

  // Get active byte string for interactive editor
  const activeByteData = bytesDetails[selectedByteIndex] || {
    binary: "00000000",
    char: "."
  };  return (
    <div id="main-app-container" className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-mono overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Immersive Terminal Header */}
      <header className="h-auto md:h-16 border-b border-emerald-500/20 flex flex-col md:flex-row items-center justify-between px-6 py-4 md:py-0 bg-black/40 backdrop-blur-md relative z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-emerald-400 flex items-center gap-2">
            BINARY_TRANSLATOR v4.0.2
            <span className="text-[9px] lowercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-normal">
              PROMPT_MODE
            </span>
          </h1>
        </div>

        {/* Console latency telemetry status */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[9px] tracking-[0.15em] opacity-80 uppercase text-emerald-500/70 font-mono">
          <span>Conn: <strong className="text-emerald-400">Secure</strong></span>
          <span className="hidden sm:inline">•</span>
          <span>Buffer: <strong className="text-emerald-400">Optimized</strong></span>
          <span className="hidden sm:inline">•</span>
          <span>Lat: <strong className="text-emerald-400">0.2ms</strong></span>
          <span className="px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-950/20 text-emerald-300">
            UTF-8 / ASCII
          </span>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left column (8 cols wide on LG) - Conversion Core */}
        <section className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
          
          {/* Mode Switcher Block */}
          <div className="bg-black/60 p-2.5 rounded-2xl border border-emerald-500/20 backdrop-blur-sm flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            
            {/* Primary Swap Tabs */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-emerald-500/10">
              <button
                onClick={() => { if (mode !== 'TEXT_TO_BINARY') toggleMode(); }}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-lg transition-all ${
                  mode === 'TEXT_TO_BINARY'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'text-emerald-400/60 hover:text-emerald-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Texte ➔ Binaire
              </button>
              <button
                onClick={() => { if (mode !== 'BINARY_TO_TEXT') toggleMode(); }}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-lg transition-all ${
                  mode === 'BINARY_TO_TEXT'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'text-emerald-400/60 hover:text-emerald-400'
                }`}
              >
                <Binary className="w-3.5 h-3.5" />
                Binaire ➔ Texte
              </button>
            </div>

            {/* Formatting details (Only shown in Text to Binary or Binary decoding spacing style) */}
            <div className="flex items-center justify-between sm:justify-end gap-3 px-1">
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Séparateur:</span>
              <div id="separator-options" className="flex bg-slate-950/80 p-0.5 rounded-md border border-emerald-500/10">
                {([' ', 'none', ',', '-'] as BinarySeparator[]).map((sep) => {
                  const label = sep === ' ' ? 'Espace' : sep === 'none' ? 'Aucun' : sep;
                  return (
                    <button
                      key={sep}
                      onClick={() => setSeparator(sep)}
                      className={`text-[9px] font-mono px-2 py-1 rounded transition-colors uppercase ${
                        separator === sep
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons Bar */}
          <div className="bg-black/40 border border-emerald-500/10 p-3 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <span className="text-[10px] text-emerald-500/65 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[ping_1.5s_infinite] inline-block" />
              01 // Consigner des presets :
            </span>
            <div className="flex gap-2 max-w-full overflow-x-auto">
              {PRESET_SAMPLES.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => loadPreset(preset.text)}
                  className="text-[10px] uppercase font-mono px-2.5 py-1 rounded border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-400 transition-colors shrink-0"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Textareas Converter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input Panel */}
            <div 
              id="input-card" 
              className="bg-black/60 border border-emerald-500/20 rounded-2xl p-5 shadow-lg flex flex-col gap-3 relative transition-all focus-within:border-emerald-500/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] inline-block" />
                  01 // Saisie naturelle ({mode === 'TEXT_TO_BINARY' ? 'Code source' : 'Registre binaire'})
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyToClipboard(mode === 'TEXT_TO_BINARY' ? textInput : binaryInput, 'input')}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors border border-transparent hover:border-emerald-500/10 text-xs flex items-center justify-center"
                    title="Copier l'entrée"
                    disabled={mode === 'TEXT_TO_BINARY' ? !textInput : !binaryInput}
                  >
                    {copiedType === 'input' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={clearAll}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-500/10 text-xs flex items-center justify-center"
                    title="Vider la boîte de saisie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text Input elements */}
              {mode === 'TEXT_TO_BINARY' ? (
                <div className="relative">
                  <textarea
                    id="text-input-field"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Écrivez le message à coder ici..."
                    className="w-full h-44 bg-black/60 border border-emerald-500/10 rounded-xl p-3.5 text-sm font-mono text-emerald-300 placeholder:text-emerald-900/60 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 resize-none transition-all leading-relaxed"
                  />
                  {textInput && (
                    <span className="absolute bottom-4 right-4 text-[9px] uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      ASCII_OK
                    </span>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    id="binary-input-field"
                    value={binaryInput}
                    onChange={(e) => setBinaryInput(e.target.value)}
                    placeholder="Ex: 01001000 01100101 01101100..."
                    className="w-full h-44 bg-black/60 border border-emerald-500/10 rounded-xl p-3.5 text-sm font-mono text-cyan-400 placeholder:text-slate-800 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 resize-none transition-all leading-relaxed"
                  />
                  {binaryErrors.length > 0 && (
                    <div id="binary-err-badge" className="absolute bottom-2.5 right-2.5 bg-red-950/90 text-red-400 border border-red-900/40 text-[9px] px-2 py-1 rounded-md flex items-center gap-1 max-w-[85%] truncate">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      Anomalie
                    </div>
                  )}
                </div>
              )}

              {/* Auxiliary length tags */}
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>
                  {mode === 'TEXT_TO_BINARY' 
                    ? `${textInput.length} octet(s)` 
                    : `${binaryInput.replace(/[\s,\-]+/g, '').length} bit(s)`}
                </span>
                <span className="text-[9px] font-mono text-emerald-500/50">INPUT_BUFFER</span>
              </div>
            </div>

            {/* Output Panel */}
            <div 
              id="output-card" 
              className="bg-[#05050a] border border-blue-500/20 rounded-2xl p-5 shadow-[0_0_30px_rgba(59,130,246,0.03)] flex flex-col gap-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)] inline-block" />
                  02 // Code machine ({mode === 'TEXT_TO_BINARY' ? 'Flux binaire' : 'Texte décodé'})
                </span>
                <button
                  onClick={() => copyToClipboard(mode === 'TEXT_TO_BINARY' ? currentBinary : currentText, 'output')}
                  className="p-1 px-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all border border-transparent hover:border-blue-500/10 text-[9px] uppercase font-mono flex items-center gap-1"
                  title="Copier le résultat"
                  disabled={mode === 'TEXT_TO_BINARY' ? !currentBinary : !currentText}
                >
                  {copiedType === 'output' ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold lowercase">
                      <Check className="w-3 h-3" /> copié
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> copier
                    </>
                  )}
                </button>
              </div>

              {/* Render translation output */}
              <div className="w-full h-44 bg-black/40 border border-blue-500/10 rounded-xl p-3.5 overflow-y-auto select-all selection:bg-blue-500/20 whitespace-pre-wrap relative">
                {mode === 'TEXT_TO_BINARY' ? (
                  currentBinary ? (
                    <div className="text-xs font-mono text-blue-400 tracking-widest break-all leading-relaxed">
                      {currentBinary}
                      <span className="inline-block w-1.5 h-3.5 bg-blue-500 animate-pulse ml-1 align-middle" />
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-600 block italic py-1 font-mono tracking-tight lowercase">{">"} en attente d'impulsion...</span>
                  )
                ) : (
                  currentText ? (
                    <div className="text-sm font-mono text-emerald-400 font-medium leading-relaxed block break-words">
                      {currentText}
                      <span className="inline-block w-1.5 h-3.5 bg-emerald-500 animate-pulse ml-1 align-middle" />
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-600 block italic py-1 font-mono tracking-tight lowercase">{">"} registre binaire vide...</span>
                  )
                )}
              </div>

              {/* Auxiliary details */}
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>
                  {mode === 'TEXT_TO_BINARY' 
                    ? `${currentBinary.replace(/[\s,\-]+/g, '').length} bits` 
                    : `${currentText.length} octets`}
                </span>
                <span className="text-[9px] font-mono text-blue-400/80">OUTPUT_REGISTRY</span>
              </div>
            </div>
          </div>

          {/* Binary Error Logs Stack (Dynamic rendering only if errors exist) */}
          <AnimatePresence>
            {binaryErrors.length > 0 && mode === 'BINARY_TO_TEXT' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex gap-3"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-xs text-red-300">Anomalies de décodage ({binaryErrors.length})</span>
                  <ul className="list-disc list-inside text-[11px] text-red-400/90 leading-relaxed font-mono">
                    {binaryErrors.slice(0, 3).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {binaryErrors.length > 3 && <li>Et {binaryErrors.length - 3} autre(s) anomalie(s)...</li>}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Visual Byte Chain Matrix */}
          <div className="bg-black/60 border border-emerald-500/20 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-mono uppercase font-semibold text-emerald-400 tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                02 // Séquence d'Octets Générée
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                La chaîne de caractères s’organise en registres d'octets distincts. Sélectionnez un bloc pour en moduler la tension binaire.
              </p>
            </div>

            {bytesDetails.length > 0 ? (
              <div 
                id="bytes-matrix-grid" 
                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-52 overflow-y-auto pr-1"
              >
                {bytesDetails.map((item, index) => {
                  const isSelected = index === selectedByteIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedByteIndex(index)}
                      className={`p-2.5 rounded-xl border text-left transition-all font-mono leading-tight ${
                        isSelected
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)] font-bold'
                          : 'bg-black/45 border-emerald-500/10 hover:border-emerald-500/25 text-emerald-400/80 hover:text-emerald-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[8px] font-mono uppercase tracking-wider ${isSelected ? 'text-black/60' : 'text-slate-500'}`}>
                          #{index + 1}
                        </span>
                        <span className={`text-[9px] px-1 rounded uppercase font-bold font-mono ${
                          isSelected ? 'bg-black/20 text-black border-none' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                        }`}>
                          {item.char.charAt(0) === ' ' ? '␣' : item.char.charAt(0)}
                        </span>
                      </div>
                      <div className="text-[10px] tracking-tight text-center truncate select-all selection:bg-slate-300/30">
                        {item.binary}
                      </div>
                      <div className={`flex justify-between text-[8px] font-mono mt-1 ${isSelected ? 'text-black/60' : 'text-slate-500'}`}>
                        <span>D:{item.decimal}</span>
                        <span>H:{item.hex}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-[11px] text-slate-500 bg-black/30 rounded-xl border border-dashed border-emerald-500/15">
                {">"} En attente d'impulsion binaire pour décomposer la matrice de registres...
              </div>
            )}
          </div>

        </section>

        {/* Right column (4 cols wide on LG) - Dynamic widgets for education and tactile simulator */}
        <section className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">

          {/* Interactive Byte Simulator Block (Tactile control widget) */}
          <InteractiveByte 
            binaryString={activeByteData.binary} 
            charLabel={activeByteData.char}
            onByteChange={handleByteChange}
          />

          {/* Binary live stats board */}
          <BinaryStats 
            textLength={currentText.length}
            byteCount={currentBytes.length}
            binaryString={currentBinary}
          />

          {/* Instructional Collapsible Cheat sheet */}
          <TutorialCard />

        </section>

      </main>

      {/* Immersive Terminal Footer */}
      <footer className="border-t border-emerald-500/20 bg-black/80 backdrop-blur-xl p-6 flex flex-col md:flex-row gap-6 relative z-10 font-mono">
        <div className="w-full md:w-1/4 border-r-0 md:border-r border-emerald-500/10 flex flex-col gap-2 pb-4 md:pb-0">
          <span className="text-[9px] text-emerald-500/50 uppercase tracking-widest mb-1 font-bold">// History_Log_Buffer</span>
          <div className="text-[10px] space-y-1.5">
            <div className="flex justify-between px-1"><span className="opacity-40">12:44:01</span><span className="text-blue-400">Text &gt; Bin // DONE</span></div>
            <div className="flex justify-between px-1 text-emerald-500/60"><span>12:43:55</span><span>Bin &gt; Text // SYNCED</span></div>
            <div className="flex justify-between px-1"><span className="opacity-40">12:42:12</span><span className="text-blue-400">Text &gt; Bin // REGS</span></div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="text-lg font-bold tracking-[0.4em] text-white">INTUITION_OS Terminal</div>
          <p className="text-[9px] text-slate-500 max-w-md uppercase mt-1">
            Moteur de décodage et filtre binaire en temps réel. Aucun registre n'est stocké à l'extérieur. Conception sans latence.
          </p>
        </div>

        <div className="w-full md:w-1/4 flex flex-col justify-between items-end gap-3">
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-[9px] text-slate-500 uppercase">SYS_BI_TOTAL_BITS</div>
              <div className="text-base font-bold text-emerald-400">
                {currentBinary.replace(/[^01]/g, '').length.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-500 uppercase">CHAR_COUNT</div>
              <div className="text-base font-bold text-blue-400">
                {currentText.length}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
            <div className="w-2 h-2 bg-emerald-500/40"></div>
            <div className="w-2 h-2 bg-emerald-500/10"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
