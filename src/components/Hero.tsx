import React from 'react';
import { Sparkles, Calendar, ShieldCheck, Heart, Star, ArrowRight, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenLogin }) => {
  const { currentClient, setActiveTab } = useApp();

  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-20">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#F4EAE6] to-[#EEDDCC]/50 blur-3xl -z-10 pointer-events-none opacity-80" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 rounded-full bg-gradient-to-tr from-[#EFE4DE] to-[#F4EAE6]/60 blur-3xl -z-10 pointer-events-none opacity-70" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Banner de Boas-vindas se estiver logada */}
        {currentClient && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#F4EAE6] to-[#EFE4DE] border border-[#E8D1CB] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8B5A51] text-white flex items-center justify-center font-serif text-lg font-bold">
                {currentClient.name[0]}
              </div>
              <div>
                <p className="text-xs text-[#8B5A51] font-semibold uppercase tracking-wider">Cliente VIP</p>
                <p className="text-sm font-bold text-[#2C201C]">Olá, {currentClient.name}! ✨</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('cliente')}
              className="text-xs font-semibold px-3 py-1.5 bg-white text-[#8B5A51] rounded-full border border-[#8B5A51]/30 shadow-xs hover:bg-[#8B5A51] hover:text-white transition-colors"
            >
              Ver Meu Próximo Horário →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Coluna Texto Principal */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Tag Instagram Oficial */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4EAE6] border border-[#E8D1CB] text-[#8B5A51] text-xs font-medium tracking-wide mx-auto lg:mx-0 shadow-xs">
              <img src="/rapha.jpg" alt="Raphaely Mengel" className="w-5 h-5 rounded-full object-cover object-top border border-[#8B5A51]/40" />
              <span>@esteticaraphaelymengel • Nail Designer em Aracaju</span>
            </div>

            {/* Headline Principal de Alta Conversão */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C201C] tracking-tight leading-[1.12]">
              Unhas impecáveis, resistentes e com <span className="italic text-[#8B5A51] font-normal">nail art autoral</span> que dura semanas.
            </h1>

            {/* Descrição Acolhedora */}
            <p className="text-base sm:text-lg text-[#7E706B] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Alongamentos em gel, banho de fortalecimento, esmaltação em gel e decorações encapsuladas exclusivas. Cuidados com a saúde da sua unha natural e acabamento de alto padrão.
            </p>

            {/* Ações Mobile & Desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-[#8B5A51] to-[#73433a] hover:from-[#784c44] hover:to-[#60352e] text-white font-medium text-base shadow-lg shadow-[#8B5A51]/25 hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2.5"
              >
                <Calendar className="w-5 h-5 text-[#EEDDCC]" />
                <span>Agendar Horário no Studio</span>
              </button>

              <button
                onClick={() => {
                  if (currentClient) {
                    setActiveTab('cliente');
                  } else {
                    onOpenLogin();
                  }
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-[#FAF6F3] text-[#2C201C] border border-[#EFE4DE] hover:border-[#8B5A51]/40 font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-[#8B5A51]" />
                <span>{currentClient ? 'Acessar Meu Painel' : 'Já sou Cliente (Acessar)'}</span>
              </button>
            </div>

            {/* Prova Social & Diferenciais */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 border-t border-[#EFE4DE]/80">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#2C201C] ml-1">5.0</span>
                <span className="text-xs text-[#7E706B]">(+800 unhas feitas)</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#7E706B]">
                <ShieldCheck className="w-4 h-4 text-[#8B5A51]" />
                <span>Materiais Esterilizados & Descartáveis</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#7E706B]">
                <Heart className="w-4 h-4 text-[#8B5A51]" />
                <span>Inclui Par de Encapsuladas</span>
              </div>
            </div>

          </div>

          {/* Coluna Visual Hero / Foto Real da Rapha */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Moldura de Luxo com Foto Real do Portfólio */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border-4 border-white/80 bg-[#EFE4DE]">
                <img
                  src="/portfolio/nail-1.jpg"
                  alt="Nail Art e Alongamento por Raphaely Mengel"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C201C]/60 via-transparent to-transparent pointer-events-none" />

                {/* Badge Inferior com Procedimento em Alta */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl glass-panel text-[#2C201C] flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] font-bold text-[#8B5A51] uppercase tracking-wider">Trabalho Real da Rapha</span>
                    <h3 className="font-serif text-base font-bold text-[#2C201C]">Alongamento com Encapsulada</h3>
                    <p className="text-[11px] text-[#8B5A51] font-semibold">A partir de R$ 130,00 (cutilagem inclusa)</p>
                  </div>
                  <button
                    onClick={onOpenBooking}
                    className="p-2.5 rounded-xl bg-[#8B5A51] text-white hover:bg-[#73433a] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Flutuante de Avaliação com Foto Real */}
              <div className="absolute -top-4 -left-4 sm:-left-6 p-3 rounded-2xl glass-panel shadow-lg border border-white max-w-[190px] hidden sm:block">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-rose-100 flex-shrink-0">
                    <img 
                      src="/portfolio/nail-2.jpg" 
                      alt="Cliente Unhas" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#2C201C]">Durabilidade ✨</p>
                    <p className="text-[9px] text-[#7E706B]">"Mais de 25 dias intacta sem soltar!"</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
