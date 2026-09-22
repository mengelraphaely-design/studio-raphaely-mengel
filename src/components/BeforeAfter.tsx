import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Eye, Layers } from 'lucide-react';

export const BeforeAfter: React.FC = () => {
  const { beforeAfterList } = useApp();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'both' | 'after' | 'before'>('both');

  const current = beforeAfterList[activeItemIndex];

  return (
    <section id="resultados" className="py-12 sm:py-16 bg-white border-y border-[#EFE4DE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EAE6] text-[#8B5A51] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B67]" />
            Resultados Reais
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C201C]">
            Evoluções & Transformações
          </h2>
          <p className="text-sm sm:text-base text-[#7E706B] mt-2">
            Resultados progressivos e seguros com protocolos desenvolvidos exclusivamente pela Rapha.
          </p>
        </div>

        {/* Seletor de Casos */}
        <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {beforeAfterList.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveItemIndex(index)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                activeItemIndex === index
                  ? 'bg-[#8B5A51] text-white shadow-sm'
                  : 'bg-[#FAF6F3] text-[#7E706B] hover:text-[#2C201C] border border-[#EFE4DE]'
              }`}
            >
              {item.procedure}
            </button>
          ))}
        </div>

        {/* Display do Caso Selecionado */}
        {current && (
          <div className="bg-[#FAF6F3] rounded-3xl p-6 sm:p-8 border border-[#EFE4DE] shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              
              {/* Fotos Comparativas Antes & Depois */}
              <div className="w-full md:w-3/5 grid grid-cols-2 gap-3 sm:gap-4">
                
                {/* Foto ANTES */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#E8D1CB] border-2 border-white shadow-xs">
                  <img
                    src={current.beforeImg}
                    alt={`${current.title} - Antes`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                    Antes
                  </div>
                </div>

                {/* Foto DEPOIS */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#E8D1CB] border-2 border-[#8B5A51]/40 shadow-sm">
                  <img
                    src={current.afterImg}
                    alt={`${current.title} - Depois`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#8B5A51] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Depois</span>
                  </div>
                </div>

              </div>

              {/* Descrição & Detalhes do Caso */}
              <div className="w-full md:w-2/5 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EFE4DE] text-[#8B5A51] text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{current.sessionsCount} {current.sessionsCount === 1 ? 'Sessão Realizada' : 'Sessões Realizadas'}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#2C201C] leading-snug">
                  {current.title}
                </h3>

                <p className="text-sm text-[#7E706B] leading-relaxed">
                  {current.description}
                </p>

                <div className="pt-2 border-t border-[#EFE4DE]">
                  <p className="text-xs text-[#8B5A51] font-medium flex items-center justify-center md:justify-start gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Registro fotográfico autorizado pela cliente</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
