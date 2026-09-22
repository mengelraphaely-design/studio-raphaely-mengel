import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

interface AdminAuthScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAuthScreen: React.FC<AdminAuthScreenProps> = ({ onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsVerifying(true);

    setTimeout(() => {
      if (pin.trim() === '030512') {
        onSuccess();
      } else {
        setError(true);
        setIsVerifying(false);
      }
    }, 200);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-xl border border-[#EFE4DE] text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Monograma de Luxo */}
        <div className="relative mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-[#8B5A51] to-[#572f29] text-white flex items-center justify-center shadow-md mb-4">
          <span className="font-serif text-2xl font-bold tracking-wider text-[#EEDDCC]">RM</span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center border-2 border-white shadow-xs">
            <Lock className="w-3 h-3 stroke-[2.5]" />
          </div>
        </div>

        <span className="text-[10px] font-bold text-[#8B5A51] uppercase tracking-widest px-3 py-1 rounded-full bg-[#F4EAE6] inline-block mb-2">
          Área Restrita
        </span>

        <h3 className="font-serif text-2xl font-bold text-[#2C201C]">
          Gestão do Studio
        </h3>
        <p className="text-xs text-[#7E706B] mt-1 mb-6">
          Acesso exclusivo para Raphaely Mengel gerenciar agenda, clientes e finanças.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E706B] mb-2">
              Código de Acesso
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••••"
              className="w-full px-4 py-3 rounded-2xl border border-[#EFE4DE] focus:outline-none focus:ring-2 focus:ring-[#8B5A51] text-center tracking-[0.5em] text-2xl font-bold text-[#2C201C] bg-[#FAF6F3]"
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-600 mt-2 font-medium bg-rose-50 py-1.5 px-3 rounded-xl border border-rose-200">
                Código de acesso incorreto.
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isVerifying || pin.length === 0}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#8B5A51] hover:bg-[#73433a] disabled:opacity-50 text-white font-semibold text-sm shadow-md transition-colors"
            >
              {isVerifying ? 'Validando...' : 'Acessar Painel'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3 px-6 rounded-2xl text-xs font-medium text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3] transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Site</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
