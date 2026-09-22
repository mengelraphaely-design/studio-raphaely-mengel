import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Sparkles, User, LayoutDashboard, Image as ImageIcon } from 'lucide-react';

interface BottomTabBarProps {
  onOpenLogin: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ onOpenLogin }) => {
  const { activeTab, setActiveTab, currentClient, birthdayAlerts, retentionAlerts, isAdminLoggedIn } = useApp();

  const handleClientTabClick = () => {
    if (!currentClient) {
      onOpenLogin();
    } else {
      setActiveTab('cliente');
    }
  };

  const totalAdminAlerts = birthdayAlerts.length + retentionAlerts.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EFE4DE] py-2 px-2 pb-safe md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Tab 1: Início */}
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all ${
            activeTab === 'portfolio' ? 'text-[#8B5A51]' : 'text-[#7E706B] hover:text-[#2C201C]'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'portfolio' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className="text-[9px] font-medium mt-1">Início</span>
        </button>

        {/* Tab 2: Tabela de Valores */}
        <button
          onClick={() => setActiveTab('procedimentos')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all ${
            activeTab === 'procedimentos' ? 'text-[#8B5A51]' : 'text-[#7E706B] hover:text-[#2C201C]'
          }`}
        >
          <Sparkles className={`w-5 h-5 transition-transform ${activeTab === 'procedimentos' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className="text-[9px] font-medium mt-1">Valores</span>
        </button>

        {/* Tab 3: Galeria */}
        <button
          onClick={() => setActiveTab('galeria')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all ${
            activeTab === 'galeria' ? 'text-[#8B5A51]' : 'text-[#7E706B] hover:text-[#2C201C]'
          }`}
        >
          <ImageIcon className={`w-5 h-5 transition-transform ${activeTab === 'galeria' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className="text-[9px] font-medium mt-1">Galeria</span>
        </button>

        {/* Tab 4: Área da Cliente */}
        <button
          onClick={handleClientTabClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl relative transition-all ${
            activeTab === 'cliente' ? 'text-[#8B5A51]' : 'text-[#7E706B] hover:text-[#2C201C]'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 transition-transform ${activeTab === 'cliente' ? 'scale-110 stroke-[2.5]' : ''}`} />
            {currentClient && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
          <span className="text-[9px] font-medium mt-1">
            {currentClient ? 'Meu Espaço' : 'Entrar'}
          </span>
        </button>

        {/* Tab 5: Painel da Rapha (Apenas exibido quando ela está conectada) */}
        {isAdminLoggedIn && (
          <button
            onClick={() => setActiveTab('rapha')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl relative transition-all ${
              activeTab === 'rapha' ? 'text-[#8B5A51]' : 'text-[#7E706B] hover:text-[#2C201C]'
            }`}
          >
            <div className="relative">
              <LayoutDashboard className={`w-5 h-5 transition-transform ${activeTab === 'rapha' ? 'scale-110 stroke-[2.5]' : ''}`} />
              {totalAdminAlerts > 0 && (
                <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 bg-[#8B5A51] text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalAdminAlerts}
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium mt-1">Painel</span>
          </button>
        )}

      </div>
    </div>
  );
};
