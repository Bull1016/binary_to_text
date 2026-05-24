import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<'suggestion' | 'bug'>('suggestion');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, description }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la suggestion');
      }

      setSubmitted(true);
      setDescription('');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-[#020617] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-emerald-500/10 bg-emerald-500/5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Envoyer une suggestion
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-emerald-400 font-bold mb-2 uppercase tracking-wide">Merci !</h4>
                  <p className="text-xs text-slate-400">Votre retour a été enregistré avec succès.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Type Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Type de retour</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setType('suggestion')}
                        className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                          type === 'suggestion'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-black/40 text-emerald-400/60 border-emerald-500/20 hover:border-emerald-500/40'
                        }`}
                      >
                        Suggestion
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('bug')}
                        className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                          type === 'bug'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                            : 'bg-black/40 text-emerald-400/60 border-emerald-500/20 hover:border-emerald-500/40'
                        }`}
                      >
                        Bug
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Détaillez votre idée ou le problème rencontré..."
                      className="w-full h-32 bg-black/60 border border-emerald-500/20 rounded-xl p-4 text-sm font-mono text-emerald-300 placeholder:text-emerald-900/60 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 resize-none transition-all"
                      required
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !description.trim()}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-slate-950 font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Footer decoration */}
            <div className="px-6 py-4 bg-black/40 border-t border-emerald-500/10 flex justify-between items-center">
              <span className="text-[9px] text-emerald-500/40 font-mono">ENCRYPTED_SUBMISSION_V1</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500/40" />
                <div className="w-1.5 h-1.5 bg-emerald-500/20" />
                <div className="w-1.5 h-1.5 bg-emerald-500/10" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
