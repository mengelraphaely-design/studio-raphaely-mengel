import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart, Eye, ArrowRight, X, PhoneCall } from 'lucide-react';
import { PortfolioItem } from '../types';
import { STUDIO_PHONE, openWhatsApp } from '../utils/whatsapp';

interface RealPortfolioGalleryProps {
  onOpenBooking: () => void;
}

export const RealPortfolioGallery: React.FC<RealPortfolioGalleryProps> = ({ onOpenBooking }) => {
  const { realPortfolio } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'todas' | 'encapsuladas' | 'veludo' | 'nail_art' | 'florais'>('todas');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filters = [
    { id: 'todas', label: 'Todas as Criações (15)' },
    { id: 'encapsuladas', label: 'Encapsuladas & Ouro' },
    { id: 'veludo', label: 'Olho de Gato & Shimmer' },
    { id: 'nail_art', label: 'Nail Art Autoral' },
    { id: 'florais', label: 'Florais & Românticas' }
  ];

  const filteredItems = selectedFilter === 'todas'
    ? realPortfolio
    : realPortfolio.filter(item => item.category === selectedFilter);

  const handleWhatsAppWithReference = (item: PortfolioItem) => {
    const msg = `Olá, Rapha! ✨ Amei esse modelo do seu portfólio: *${item.title}* (${item.tag}). Gostaria de agendar um horário para fazer algo parecido! Como está sua agenda?`;
    openWhatsApp(STUDIO_PHONE, msg);
  };

  return (
    <section id="galeria" className="py-12 sm:py-20 bg-white border-y border-[#EFE4DE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4EAE6] text-[#8B5A51] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B67]" />
            Galeria de Trabalhos
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C201C]">
            Design de Unhas & Nail Art Autoral
          </h2>
          <p className="text-sm sm:text-base text-[#7E706B] mt-2 font-light">
            Cada conjunto é uma obra de arte única esculpida pela Rapha. Inspire-se para a sua próxima sessão.
          </p>

          {/* Filtros em Abas */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedFilter === f.id
                    ? 'bg-[#8B5A51] text-white shadow-sm'
                    : 'bg-[#FAF6F3] text-[#7E706B] hover:text-[#2C201C] border border-[#EFE4DE]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Visual de Fotos Reais */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-[#FAF6F3] border border-[#EFE4DE] cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Imagem Real */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Tag Superior */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-full glass-panel text-[10px] font-bold text-[#8B5A51] uppercase tracking-wider shadow-xs">
                  {item.tag}
                </span>
              </div>

              {/* Overlay Escuro ao Passar o Mouse / Toque */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C201C]/80 via-[#2C201C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <p className="font-serif text-sm font-bold line-clamp-2">
                  {item.title}
                </p>
                <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#EEDDCC]">
                  <span>Ver detalhes</span>
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Abaixo da Galeria */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#7E706B] mb-3">
            Gostou de algum modelo ou tem uma referência própria do Pinterest / Instagram?
          </p>
          <button
            onClick={() => openWhatsApp(STUDIO_PHONE, 'Olá, Rapha! Tenho uma referência de nail art que gostaria de fazer com você. Podemos agendar?')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#8B5A51] hover:bg-[#73433a] text-white font-medium text-sm shadow-md transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Enviar Minha Referência no WhatsApp</span>
          </button>
        </div>

      </div>

      {/* Modal de Zoom da Foto */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-[#EFE4DE] relative max-h-[92vh] flex flex-col">
            
            {/* Botão Fechar */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagem em Destaque */}
            <div className="relative aspect-[4/5] bg-black">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detalhes da Foto */}
            <div className="p-6 bg-white space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#8B5A51] uppercase tracking-wider bg-[#F4EAE6] px-2.5 py-1 rounded-full">
                  {selectedItem.tag}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2C201C] mt-2">
                  {selectedItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7E706B] mt-1">
                  {selectedItem.description}
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-3 rounded-xl bg-[#FAF6F3] text-xs font-semibold text-[#7E706B] hover:bg-[#EFE4DE] transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => {
                    handleWhatsAppWithReference(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Quero Esse Modelo!</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
