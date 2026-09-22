import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, User, Lock, PhoneCall, Image as ImageIcon } from 'lucide-react';
import { STUDIO_PHONE, openWhatsApp } from '../utils/whatsapp';

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const { currentClient, isAdminLoggedIn, toggleAdminLogin, activeTab, setActiveTab } = useApp();
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setActiveTab('rapha');
    } else {
      setShowAdminPinModal(true);
      setPinError(false);
      setAdminPin('');
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin === 'rapha' || adminPin === '') {
      toggleAdminLogin(true);
      setShowAdminPinModal(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#EFE4DE] transition-all duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Logo Brand Oficial */}
          <div className="flex items-center gap-3 text-left">
            {/* Monograma RM com clique discreto para acesso da Rapha */}
            <button 
              onClick={handleAdminClick}
              title="Studio Raphaely Mengel"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5A51] to-[#6d453e] flex items-center justify-center text-[#FAF6F3] shadow-md hover:scale-105 active:scale-95 transition-transform border border-[#E8D1CB] focus:outline-hidden"
            >
              <span className="font-serif text-sm font-bold tracking-wider text-[#EEDDCC]">RM</span>
            </button>

            <button 
              onClick={() => setActiveTab('portfolio')}
              className="text-left focus:outline-hidden group"
            >
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#8B5A51] font-bold">Estética & Nails</span>
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#2C201C] -mt-1 group-hover:text-[#8B5A51] transition-colors">
                Raphaely Mengel
              </h1>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#7E706B]">
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`transition-colors hover:text-[#8B5A51] ${activeTab === 'portfolio' ? 'text-[#8B5A51] font-semibold' : ''}`}
            >
              Início
            </button>
            <button 
              onClick={() => setActiveTab('procedimentos')}
              className={`transition-colors hover:text-[#8B5A51] ${activeTab === 'procedimentos' ? 'text-[#8B5A51] font-semibold' : ''}`}
            >
              Tabela de Valores
            </button>
            <button 
              onClick={() => setActiveTab('galeria')}
              className={`transition-colors hover:text-[#8B5A51] ${activeTab === 'galeria' ? 'text-[#8B5A51] font-semibold' : ''}`}
            >
              Galeria
            </button>
            <a 
              href="#sobre" 
              onClick={() => { if (activeTab !== 'portfolio') setActiveTab('portfolio'); }}
              className="transition-colors hover:text-[#8B5A51]"
            >
              Sobre a Rapha
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Direct */}
            <button
              onClick={() => openWhatsApp(STUDIO_PHONE, 'Olá, Rapha! Vi a tabela de valores no site e gostaria de tirar uma dúvida.')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8B5A51] bg-[#F4EAE6] hover:bg-[#ebdcd6] rounded-full transition-colors"
              title="Falar no WhatsApp"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Client Area Button */}
            {currentClient ? (
              <button
                onClick={() => setActiveTab('cliente')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all border ${
                  activeTab === 'cliente'
                    ? 'bg-[#8B5A51] text-white border-[#8B5A51] shadow-sm'
                    : 'bg-white text-[#2C201C] border-[#EFE4DE] hover:border-[#8B5A51]'
                }`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-[#8B5A51]/10 flex items-center justify-center">
                  {currentClient.avatarUrl ? (
                    <img src={currentClient.avatarUrl} alt={currentClient.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-3 h-3 text-[#8B5A51]" />
                  )}
                </div>
                <span className="max-w-[90px] sm:max-w-[120px] truncate">{currentClient.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#2C201C] bg-white hover:bg-[#FAF6F3] border border-[#EFE4DE] rounded-full transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-[#8B5A51]" />
                <span>Área da Cliente</span>
              </button>
            )}

            {/* Apenas exibe atalho Studio se a Rapha já estiver logada */}
            {isAdminLoggedIn && (
              <button
                onClick={handleAdminClick}
                title="Painel da Rapha (Conectada)"
                className="px-3 py-1.5 rounded-full bg-[#8B5A51] text-white text-xs font-semibold flex items-center gap-1 shadow-xs hover:bg-[#73433a] transition-colors"
              >
                <span>Studio</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modal de PIN para Painel da Rapha */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-[#EFE4DE] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EAE6] text-[#8B5A51] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-center text-[#2C201C]">Painel da Rapha</h3>
            <p className="text-xs text-center text-[#7E706B] mt-1 mb-6">
              Área de controle de agenda, aniversariantes e retenção de clientes.
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E706B] mb-1.5">
                  Código de Acesso
                </label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Digite 1234 ou deixe em branco"
                  className="w-full px-4 py-3 rounded-xl border border-[#EFE4DE] focus:outline-none focus:ring-2 focus:ring-[#8B5A51] text-center tracking-widest text-lg"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-600 mt-1 text-center font-medium">
                    Código incorreto. Dica: use 1234 para testar.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPinModal(false)}
                  className="flex-1 py-3 text-sm font-medium text-[#7E706B] bg-[#FAF6F3] hover:bg-[#EFE4DE] rounded-xl transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-sm font-semibold text-white bg-[#8B5A51] hover:bg-[#784c44] rounded-xl shadow-md transition-colors"
                >
                  Entrar no Painel
                </button>
              </div>

              <p className="text-[11px] text-center text-[#7E706B]/80 pt-2">
                * Modo protótipo: basta clicar em Entrar ou usar 1234
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
