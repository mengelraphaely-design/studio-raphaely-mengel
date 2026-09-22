import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Quote, Heart } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { feedbacks } = useApp();
  const publishedFeedbacks = feedbacks.filter(f => f.status === 'publicado');

  if (publishedFeedbacks.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#FAF6F3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EAE6] text-[#8B5A51] text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-[#C59B67]" />
            Depoimentos Reais
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C201C]">
            O carinho de quem já viveu a experiência
          </h2>
          <p className="text-sm sm:text-base text-[#7E706B] mt-2">
            Veja o que nossas clientes dizem sobre o cuidado e a dedicação da Rapha.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedFeedbacks.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE4DE] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#F4EAE6] -z-0" />

              <div className="relative z-10">
                {/* 5 Estrelas */}
                <div className="flex text-amber-400 gap-1 mb-3">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Comentário */}
                <p className="text-xs sm:text-sm text-[#2C201C]/90 italic leading-relaxed mb-6">
                  "{test.comment}"
                </p>
              </div>

              {/* Autora */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#EFE4DE] relative z-10">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#F4EAE6] flex-shrink-0 border border-[#E8D1CB]">
                  <img
                    src={test.avatarUrl}
                    alt={test.clientName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#2C201C] truncate">{test.clientName}</h4>
                  <p className="text-[11px] text-[#8B5A51] font-medium truncate">{test.procedureName}</p>
                  <p className="text-[10px] text-[#7E706B]">{test.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
