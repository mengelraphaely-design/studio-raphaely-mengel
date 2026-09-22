import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomTabBar } from './components/BottomTabBar';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { RealPortfolioGallery } from './components/RealPortfolioGallery';
import { Testimonials } from './components/Testimonials';
import { AboutRapha } from './components/AboutRapha';
import { LocationHours } from './components/LocationHours';
import { BookingModal } from './components/BookingModal';
import { ClientLoginModal } from './components/ClientLoginModal';
import { ClientDashboard } from './components/ClientDashboard';
import { RaphaDashboard } from './components/RaphaDashboard';
import { Procedure } from './types';
import { PhoneCall, Sparkles, User } from 'lucide-react';
import { STUDIO_PHONE, openWhatsApp } from './utils/whatsapp';

export function App() {
  const { activeTab, setActiveTab, currentClient, loginAsDemoClient } = useApp();
  
  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedProcedureForBooking, setSelectedProcedureForBooking] = useState<Procedure | null>(null);

  const handleOpenBookingWithProcedure = (proc: Procedure) => {
    setSelectedProcedureForBooking(proc);
    setIsBookingOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    setSelectedProcedureForBooking(null);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F3] text-[#2C201C] pb-safe">
      
      {/* Top Navbar */}
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {activeTab === 'portfolio' && (
          <>
            <Hero 
              onOpenBooking={handleOpenGeneralBooking} 
              onOpenLogin={() => setIsLoginOpen(true)} 
            />
            {/* Galeria de Fotos Reais */}
            <RealPortfolioGallery onOpenBooking={handleOpenGeneralBooking} />
            {/* Tabela de Valores Oficial do PDF */}
            <Portfolio onSelectProcedure={handleOpenBookingWithProcedure} />
            <Testimonials />
            <AboutRapha />
            <LocationHours />
          </>
        )}

        {activeTab === 'galeria' && (
          <div className="pt-4 pb-12">
            <RealPortfolioGallery onOpenBooking={handleOpenGeneralBooking} />
            <LocationHours />
          </div>
        )}

        {activeTab === 'procedimentos' && (
          <div className="pt-4 pb-12">
            <Portfolio onSelectProcedure={handleOpenBookingWithProcedure} />
            <LocationHours />
          </div>
        )}

        {activeTab === 'cliente' && (
          <>
            {currentClient ? (
              <ClientDashboard onOpenBooking={handleOpenGeneralBooking} />
            ) : (
              <div className="py-16 px-4 max-w-md mx-auto text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-[#F4EAE6] text-[#8B5A51] flex items-center justify-center mx-auto shadow-inner">
                  <User className="w-8 h-8 text-[#8B5A51]" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#2C201C]">
                  Meu Espaço no Studio
                </h3>
                <p className="text-sm text-[#7E706B] leading-relaxed">
                  Para acompanhar seu próximo horário de manutenção, entre com seu telefone cadastrado e data de nascimento.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#8B5A51] hover:bg-[#73433a] text-white font-semibold text-sm shadow-md transition-colors"
                  >
                    Fazer Login Sem Senha
                  </button>

                  <button
                    onClick={() => loginAsDemoClient('cli-1')}
                    className="w-full py-3 px-6 rounded-2xl bg-white hover:bg-[#FAF6F3] text-[#8B5A51] border border-[#E8D1CB] font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Entrar como Cliente Demo (Camila Rocha)</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'rapha' && (
          <RaphaDashboard />
        )}
      </main>

      {/* Floating Action Button (WhatsApp) no Mobile */}
      {activeTab === 'portfolio' && (
        <button
          onClick={() => openWhatsApp(STUDIO_PHONE, 'Olá, Rapha! Vi o seu site e gostaria de tirar uma dúvida sobre alongamento de unhas.')}
          className="fixed bottom-22 right-4 z-30 p-3.5 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 active:scale-95 transition-all md:hidden flex items-center justify-center"
          title="Falar no WhatsApp"
        >
          <PhoneCall className="w-5 h-5 fill-current" />
        </button>
      )}

      {/* Bottom Tab Bar (Mobile PWA Navigation) */}
      <BottomTabBar onOpenLogin={() => setIsLoginOpen(true)} />

      {/* Modais Globais */}
      {isBookingOpen && (
        <BookingModal
          initialProcedure={selectedProcedureForBooking}
          onClose={() => setIsBookingOpen(false)}
        />
      )}

      {isLoginOpen && (
        <ClientLoginModal
          onClose={() => setIsLoginOpen(false)}
        />
      )}

    </div>
  );
}
export default App;
