import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Binary } from 'lucide-react';

export const TutorialCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Common characters lookup table
  const lookupTable = [
    { char: 'A', dec: 65, hex: '41', bin: '01000001', type: 'Majuscule' },
    { char: 'B', dec: 66, hex: '42', bin: '01000010', type: 'Majuscule' },
    { char: 'a', dec: 97, hex: '61', bin: '01100001', type: 'Minuscule' },
    { char: 'b', dec: 98, hex: '62', bin: '01100010', type: 'Minuscule' },
    { char: '0', dec: 48, hex: '30', bin: '00110000', type: 'Chiffre' },
    { char: '1', dec: 49, hex: '31', bin: '00110001', type: 'Chiffre' },
    { char: '!', dec: 33, hex: '21', bin: '00100001', type: 'Symbole' },
    { char: '[Espace]', dec: 32, hex: '20', bin: '00100000', type: 'Format' },
  ];

  return (
    <div id="tutorial-card-root" className="bg-black/60 border border-emerald-500/20 rounded-2xl p-5 shadow-lg transition-all font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-slate-100 font-bold">
              05 // Index ASCII & UTF-8
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 lowercase">
              {isOpen ? "Fermer la console d'apprentissage" : "Comprendre la logique d'encodage binaire"}
            </p>
          </div>
        </div>
        <div className="p-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition-colors">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-emerald-500/10 mt-4 space-y-4">
              <div className="text-[10px] text-slate-400 space-y-2 leading-relaxed">
                <p>
                  Les ordinateurs ne stockent que des flux électriques d'impulsion binaire représentés par <strong className="text-emerald-400">0</strong> et <strong className="text-emerald-400">1</strong>.
                </p>
                <p>
                  Afin de matérialiser du texte compréhensible, nous utilisons des dictionnaires d'encodage. 
                  L'<strong>ASCII</strong> mappe chaque lettre à un entier entre 0 et 127. 
                  L'extension universelle <strong>UTF-8</strong> permet de projeter l'ensemble des émojis du globe en empilant de 1 à 4 octets par symbole.
                </p>
              </div>

              {/* Lookup table */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block mb-2.5">Registre de Référence ASCII</span>
                <div id="ascii-lookup-table" className="overflow-x-auto rounded-lg border border-emerald-500/10 bg-black/45">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-emerald-950/25 border-b border-emerald-500/10 text-slate-500 font-mono">
                        <th className="p-2 py-1.5">Carac.</th>
                        <th className="p-2 py-1.5">Décimal</th>
                        <th className="p-2 py-1.5">Hex</th>
                        <th className="p-2 py-1.5">Binaire</th>
                        <th className="p-2 py-1.5 text-right">Groupe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/5">
                      {lookupTable.map((item, idx) => (
                        <tr 
                          key={idx} 
                          className="hover:bg-emerald-500/5 transition-colors font-mono text-slate-300"
                        >
                          <td className="p-2 py-2 font-mono font-semibold text-emerald-400">{item.char}</td>
                          <td className="p-2 py-2">{item.dec}</td>
                          <td className="p-2 py-2 text-amber-500">0x{item.hex}</td>
                          <td className="p-2 py-2 text-blue-400 font-semibold">{item.bin}</td>
                          <td className="p-2 py-2 text-right text-slate-500 text-[9px]">{item.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conversion explanation step formula */}
              <div className="bg-black/35 rounded-xl p-3 border border-emerald-500/10 text-[10px]">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <Binary className="w-3.5 h-3.5" />
                  Calcul de somme binaire :
                </span>
                <p className="text-slate-400 leading-relaxed text-[10px]">
                  Le bit n°n vaut $2^n$ s'il est actif. Exemple <strong className="text-slate-200 font-mono">01000001</strong> :<br />
                  <span className="font-mono text-emerald-400 mt-1 block bg-black/65 p-2 rounded border border-emerald-500/5 text-center">
                    64 + 1 = 65 ➔ 'A'
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
