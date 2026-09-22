import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Clock, Phone, Sparkles } from 'lucide-react';
import { STUDIO_PHONE, openWhatsApp } from '../utils/whatsapp';

export const LocationHours: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <section className="py-12 sm:py-16 bg-[#FAF6F3] border-t border-[#EFE4DE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Card de Localização & Horários */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE4DE] shadow-xs space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EAE6] text-[#8B5A51] text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#C59B67]" />
              Atendimento Exclusivo
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
              Estética Raphaely Mengel em Aracaju
            </h3>

            <p className="text-sm text-[#7E706B] leading-relaxed">
              Atendimento com hora marcada em ambiente acolhedor, climatizado e confortável para você relaxar enquanto cuida da beleza das suas unhas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE]/70 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A51] uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Localização</span>
                </div>
                <p className="text-xs font-semibold text-[#2C201C]">Aracaju, Sergipe</p>
                <p className="text-[11px] text-[#7E706B]">Local de fácil acesso, tranquilo e com estacionamento.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE]/70 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A51] uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>Horários de Atendimento</span>
                </div>
                <p className="text-xs font-semibold text-[#2C201C]">Segunda a Sábado</p>
                <p className="text-[11px] text-[#7E706B]">Horários flexíveis conforme disponibilidade na agenda.</p>
              </div>
            </div>

            {/* Ações de Contato */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => openWhatsApp(STUDIO_PHONE, 'Olá, Rapha! Gostaria de agendar meu horário para fazer as unhas.')}
                className="px-5 py-2.5 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </button>

              <a
                href="https://instagram.com/esteticaraphaelymengel"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6F3] text-[#2C201C] border border-[#EFE4DE] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-[#8B5A51]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@esteticaraphaelymengel</span>
              </a>
            </div>
          </div>

          {/* Destaque Estético / PWA Dica */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#8B5A51] to-[#5a3832] rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#EEDDCC]">
              <Sparkles className="w-6 h-6" />
            </div>

            <h4 className="font-serif text-2xl font-bold text-white leading-tight">
              Instale o App na sua tela inicial
            </h4>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              Tenha o Studio Raphaely Mengel no seu celular como um app! Acompanhe seu próximo horário de manutenção, consulte suas orientações de cuidados e receba mimos de aniversário com 1 toque.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white/90">
              <p className="font-semibold text-[#EEDDCC] mb-1">Como instalar em 5 segundos:</p>
              <p>No iPhone (Safari), toque em <strong>Compartilhar → Adicionar à Tela de Início</strong>. No Android (Chrome), toque no menu <strong>⋮ → Instalar Aplicativo</strong>.</p>
            </div>
          </div>

        </div>

        {/* Rodapé Final */}
        <div className="mt-12 pt-6 border-t border-[#EFE4DE] text-center text-xs text-[#7E706B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Estética Raphaely Mengel • @esteticaraphaelymengel. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Design de unhas & estética avançada</span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('rapha')}
              className="text-[#7E706B]/60 hover:text-[#8B5A51] transition-colors"
            >
              Acesso Studio
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
