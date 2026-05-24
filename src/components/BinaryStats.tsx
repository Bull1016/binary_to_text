import React from 'react';
import { motion } from 'motion/react';
import { Hash, Activity, Percent, Layers } from 'lucide-react';

interface BinaryStatsProps {
  textLength: number;
  byteCount: number;
  binaryString: string;
}

export const BinaryStats: React.FC<BinaryStatsProps> = ({
  textLength,
  byteCount,
  binaryString,
}) => {
  // Count 1s and 0s
  const onesCount = (binaryString.match(/1/g) || []).length;
  const zerosCount = (binaryString.match(/0/g) || []).length;
  const totalBits = onesCount + zerosCount;
  
  const onesPercentage = totalBits > 0 ? Math.round((onesCount / totalBits) * 100) : 0;
  const zerosPercentage = totalBits > 0 ? 100 - onesPercentage : 0;

  return (
    <div 
      id="binary-stats-panel" 
      className="bg-black/60 border border-emerald-500/20 rounded-2xl p-5 shadow-md flex flex-col gap-4 font-mono"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          04 // Analyse Du Signal
        </h4>
        {byteCount > 0 && (
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">
            CONNECTÉ
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {/* Char count */}
        <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/10 flex flex-col gap-1">
          <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1 uppercase tracking-wider">
            Char
          </span>
          <span className="text-base font-mono font-bold text-slate-100">{textLength}</span>
        </div>

        {/* Byte count */}
        <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/10 flex flex-col gap-1">
          <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1 uppercase tracking-wider">
            Octets
          </span>
          <span className="text-base font-mono font-bold text-blue-400">{byteCount}</span>
        </div>

        {/* Bit count */}
        <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/10 flex flex-col gap-1">
          <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1 uppercase tracking-wider">
            Bits
          </span>
          <span className="text-base font-mono font-bold text-emerald-400">{totalBits}</span>
        </div>
      </div>

      {totalBits > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Actif (1) : {onesPercentage}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800 inline-block" />
              Vide (0) : {zerosPercentage}%
            </span>
          </div>

          {/* Graphical progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden flex">
            <motion.div 
              style={{ width: `${onesPercentage}%` }}
              className="h-full bg-emerald-500 rounded-l-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${onesPercentage}%` }}
              transition={{ duration: 0.4 }}
            />
            <div 
              style={{ width: `${zerosPercentage}%` }}
              className="h-full bg-slate-800"
            />
          </div>
          
          <p className="text-[10px] text-slate-400 tracking-tight leading-relaxed mt-0.5">
            {onesPercentage > 60 
              ? "> Flux de données dense avec une onde d'impulsion active élevée." 
              : onesPercentage < 40 
              ? "> Flux de données à basse densité (espace ou caractères spéciaux)." 
              : "> Flux équilibré d'impulsions binaires dans les registres."}
          </p>
        </div>
      ) : (
        <div className="text-center py-2 text-slate-500 text-[11px] italic">
          &gt; En attente d'impulsion...
        </div>
      )}
    </div>
  );
};
