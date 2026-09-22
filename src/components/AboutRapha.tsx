import React from 'react';
import { Award, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';

export const AboutRapha: React.FC = () => {
  return (
    <section id="sobre" className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Foto / Criação Real da Rapha */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-xl border-4 border-white bg-[#EFE4DE]">
                <img
                  src="/rapha.jpg"
                  alt="Raphaely Mengel - Estética e Nail Designer em Aracaju"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Box de Assinatura */}
              <div className="absolute -bottom-5 -right-3 sm:-right-6 p-4 rounded-2xl glass-panel shadow-lg border border-white max-w-[220px] text-center">
                <span className="font-serif text-lg font-bold text-[#8B5A51] block italic">
                  Raphaely Mengel
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#7E706B] font-semibold">
                  Nail Designer & Estética
                </span>
                <span className="text-[10px] text-[#8B5A51] font-bold block mt-0.5">
                  @esteticaraphaelymengel
                </span>
              </div>
            </div>
          </div>

          {/* Texto Sobre */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EAE6] text-[#8B5A51] text-xs font-semibold uppercase tracking-wider mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B67]" />
              Conheça a Rapha
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C201C] leading-tight">
              Suas unhas cuidadas como verdadeiras <span className="text-[#8B5A51] italic font-normal">joias</span> exclusivas.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#7E706B] leading-relaxed font-light">
              <p>
                Olá! Sou Raphaely Mengel, especialista em design de unhas, alongamentos em gel e decorações autorais. Meu compromisso é entregar unhas com acabamento refinado, curvatura elegante e que permaneçam perfeitas durante toda a sua rotina.
              </p>
              <p>
                Acredito que fazer as unhas não é apenas estética; é um momento de pausa, carinho e autoestima. Por isso, utilizo técnicas que preservam a integridade da sua lâmina natural, evitando agressões e garantindo saúde e beleza prolongada.
              </p>
              <p>
                Desde uma esmaltação em gel clássica até composições complexas com encapsuladas, veludo magnético ou ilustrações manuais, cada detalhe é feito com paciência e amor.
              </p>
            </div>

            {/* Pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
              <div className="p-4 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE]">
                <Award className="w-6 h-6 text-[#8B5A51] mb-2" />
                <h4 className="text-xs font-bold text-[#2C201C] uppercase tracking-wider">Técnicas Avançadas</h4>
                <p className="text-[11px] text-[#7E706B] mt-1">Gel, fibra e tips com curvatura anatômica e ponto de tensão correto.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE]">
                <HeartHandshake className="w-6 h-6 text-[#8B5A51] mb-2" />
                <h4 className="text-xs font-bold text-[#2C201C] uppercase tracking-wider">Arte Personalizada</h4>
                <p className="text-[11px] text-[#7E706B] mt-1">Reprodução de referências do Pinterest e designs exclusivos.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE]">
                <ShieldCheck className="w-6 h-6 text-[#8B5A51] mb-2" />
                <h4 className="text-xs font-bold text-[#2C201C] uppercase tracking-wider">Higiene Absoluta</h4>
                <p className="text-[11px] text-[#7E706B] mt-1">Instrumentais esterilizados e lixas/palitos descartáveis.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
