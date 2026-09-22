import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, User, PhoneCall, Image as ImageIcon } from 'lucide-react';
import { STUDIO_PHONE, openWhatsApp } from '../utils/whatsapp';

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const { currentClient, isAdminLoggedIn, activeTab, setActiveTab } = useApp();

  const handleAdminClick = () => {
    setActiveTab('rapha');
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
    </>
  );
};
