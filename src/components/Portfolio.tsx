import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Procedure } from '../types';
import { Clock, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, HelpCircle, MessageCircle } from 'lucide-react';
import { STUDIO_PHONE, openWhatsApp } from '../utils/whatsapp';

interface PortfolioProps {
  onSelectProcedure: (procedure: Procedure) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectProcedure }) => {
  const { procedures } = useApp();

  return (
    <section id="procedimentos" className="py-12 sm:py-16 bg-[#FAF6F3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Cabeçalho da Tabela Oficial */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EAE6] text-[#8B5A51] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B67]" />
            Tabela Oficial de Serviços
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C201C]">
            Procedimentos & Valores
          </h2>
          <p className="text-sm sm:text-base text-[#7E706B] mt-2 font-light">
            Valores transparentes com materiais importados de altíssima qualidade, máxima durabilidade e biossegurança.
          </p>
        </div>

        {/* Grid de Procedimentos Principais do PDF */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {procedures.map((proc) => (
            <div
              key={proc.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#EFE4DE] shadow-xs hover:shadow-xl hover:border-[#8B5A51]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Foto Real do Procedimento */}
                <div className="relative aspect-[16/11] overflow-hidden bg-[#EFE4DE]">
                  <img
                    src={proc.imageUrl}
                    alt={proc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {proc.isPopular && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#8B5A51] text-white text-[11px] font-semibold tracking-wide shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#EEDDCC]" />
                      <span>Mais Pedido</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full glass-panel text-[11px] font-medium text-[#2C201C] flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3 text-[#8B5A51]" />
                    <span>~{proc.durationMinutes} min</span>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5A51] bg-[#F4EAE6] px-2.5 py-0.5 rounded-full">
                        {proc.category === 'alongamento' ? 'Alongamento' : proc.category === 'banho_gel' ? 'Fortalecimento' : proc.category === 'esmaltacao' ? 'Esmaltação' : 'Manutenção'}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-[#2C201C] group-hover:text-[#8B5A51] transition-colors leading-tight">
                      {proc.name}
                    </h3>

                    <p className="text-xs text-[#7E706B] mt-2 leading-relaxed">
                      {proc.description}
                    </p>
                  </div>

                  {/* Preços e Observações do PDF */}
                  <div className="p-4 rounded-2xl bg-[#FAF6F3] border border-[#E8D1CB] space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-[#7E706B] font-semibold">Aplicação:</span>
                      <span className="font-serif text-2xl font-bold text-[#8B5A51]">
                        R$ {proc.price},00
                      </span>
                    </div>

                    {proc.maintenancePrice && (
                      <div className="flex items-baseline justify-between pt-1 border-t border-[#EFE4DE] text-xs">
                        <span className="text-[#7E706B]">Manutenção:</span>
                        <span className="font-bold text-[#2C201C]">R$ {proc.maintenancePrice},00</span>
                      </div>
                    )}

                    {proc.includesInfo && (
                      <p className="text-[11px] text-[#8B5A51] font-medium pt-1 border-t border-[#EFE4DE]">
                        ✨ {proc.includesInfo}
                      </p>
                    )}

                    {/* Observações Extras do PDF */}
                    {(proc.removalPrice || proc.nailReplacementPrice) && (
                      <div className="pt-2 text-[10px] text-[#7E706B] space-y-0.5 border-t border-[#EFE4DE]/70">
                        {proc.removalPrice && <p>• Remoção: <strong>R$ {proc.removalPrice},00</strong></p>}
                        {proc.nailReplacementPrice && <p>• Reposição de unha: <strong>R$ {proc.nailReplacementPrice},00 (cada)</strong></p>}
                      </div>
                    )}
                  </div>

                  {/* Benefícios */}
                  <div className="space-y-1.5 pt-1">
                    {proc.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#2C201C]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B67] flex-shrink-0" />
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão Agendar */}
              <div className="p-5 sm:p-6 pt-0">
                <button
                  onClick={() => onSelectProcedure(proc)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#8B5A51] hover:bg-[#73433a] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md"
                >
                  <span>Agendar este Procedimento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Card Especial: Outros Procedimentos & Nail Art Personalizada */}
          <div className="bg-gradient-to-br from-[#8B5A51] to-[#5a342d] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/15 text-[#EEDDCC] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>

              <span className="text-[10px] uppercase font-bold tracking-widest text-[#EEDDCC] bg-white/10 px-2.5 py-0.5 rounded-full">
                Personalização Total
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Outros Procedimentos & Nail Arts
              </h3>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
                Deseja um modelo temático, francesinha reversa, efeito veludo/olho de gato, pedrarias, aplicação de piercings ou restauração personalizada?
              </p>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-1">
                <p className="font-semibold text-[#EEDDCC]">Tire sua dúvida direto com a Rapha:</p>
                <p className="text-white/90">Envie a foto de referência e receba o orçamento na hora pelo WhatsApp!</p>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => openWhatsApp(STUDIO_PHONE, 'Olá, Rapha! Gostaria de consultar um procedimento personalizado / nail art com você.')}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-[#FAF6F3] text-[#8B5A51] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar no WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
