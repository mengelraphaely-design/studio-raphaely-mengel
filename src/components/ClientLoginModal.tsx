import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

interface ClientLoginModalProps {
  onClose: () => void;
}

export const ClientLoginModal: React.FC<ClientLoginModalProps> = ({ onClose }) => {
  const { loginClient, loginAsDemoClient } = useApp();
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Máscara simples para telefone brasileiro (XX) XXXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    setPhone(v);
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phone.trim() || !birthDate.trim()) {
      setErrorMessage('Por favor, informe seu telefone e data de nascimento.');
      return;
    }

    const result = loginClient(phone, birthDate);
    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.message || 'Dados não localizados. Tente o botão de demonstração.');
    }
  };

  const handleDemoClick = (clientId: string = 'cli-1') => {
    loginAsDemoClient(clientId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EFE4DE] relative">
        
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F4EAE6] to-[#EEDDCC] text-[#8B5A51] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Sparkles className="w-7 h-7 text-[#8B5A51]" />
          </div>
          <span className="text-[11px] font-bold text-[#8B5A51] uppercase tracking-widest">
            Acesso Rápido & Sem Senha
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C] mt-1">
            Meu Espaço no Studio
          </h3>
          <p className="text-xs sm:text-sm text-[#7E706B] mt-1.5">
            Acompanhe seu próximo horário agendado, orientações pós-procedimento e benefícios exclusivos.
          </p>
        </div>

        {/* Formulário de Acesso */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Telefone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E706B] mb-1.5">
              WhatsApp Cadastrado
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8B5A51] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(79) 99876-5432"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#EFE4DE] focus:outline-none focus:ring-2 focus:ring-[#8B5A51] text-sm text-[#2C201C]"
              />
            </div>
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E706B] mb-1.5">
              Data de Nascimento
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#8B5A51] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#EFE4DE] focus:outline-none focus:ring-2 focus:ring-[#8B5A51] text-sm text-[#2C201C]"
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Botão Entrar */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#8B5A51] hover:bg-[#73433a] text-white font-semibold text-sm shadow-md transition-colors transform active:scale-95"
          >
            Acessar Meus Agendamentos
          </button>
        </form>

        {/* Separador de Demonstração / 1-Click Test */}
        <div className="mt-6 pt-5 border-t border-[#EFE4DE]">
          <p className="text-[11px] font-semibold text-center text-[#8B5A51] uppercase tracking-wider mb-2.5">
            Testar Agora (1 Clique)
          </p>

          <button
            type="button"
            onClick={() => handleDemoClick('cli-1')}
            className="w-full p-3 rounded-2xl bg-[#FAF6F3] hover:bg-[#F4EAE6] border border-[#E8D1CB] text-left transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8B5A51] text-white flex items-center justify-center font-serif text-sm font-bold">
                C
              </div>
              <div>
                <p className="text-xs font-bold text-[#2C201C] group-hover:text-[#8B5A51]">
                  Entrar como Camila Rocha
                </p>
                <p className="text-[10px] text-[#7E706B]">
                  (79) 99876-5432 • Nasc: 24/09/1995 • Sessão amanhã!
                </p>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#8B5A51] opacity-60 group-hover:opacity-100" />
          </button>
        </div>

      </div>
    </div>
  );
};
