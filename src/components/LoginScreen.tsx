import React, { useState } from 'react';
import { Sun, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      onLogin(email);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900/0 to-slate-900/0" />
        <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-amber-500 p-3 rounded-xl text-white shadow-lg shadow-amber-500/30 mb-4">
              <Sun size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              SolarString<span className="text-amber-600">Pro</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2 text-center">
              Ferramenta Profissional de Dimensionamento
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 uppercase tracking-wider">Email Profissional</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seunome@empresa.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                "Acessando..."
              ) : (
                <>
                  Acessar Plataforma
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle size={14} className="text-emerald-500" />
                <span>Banco de Módulos</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle size={14} className="text-emerald-500" />
                <span>Leitura OCR</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle size={14} className="text-emerald-500" />
                <span>Relatórios PDF</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle size={14} className="text-emerald-500" />
                <span>Integração Drive</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            &copy; 2024 SolarString Pro. v2.1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
