import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Feedback } from '../types';
import { 
  Star, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  MessageSquareHeart, 
  ShieldCheck, 
  Heart,
  Clock
} from 'lucide-react';

export const AdminFeedback: React.FC = () => {
  const { feedbacks, updateFeedbackStatus } = useApp();
  const [filter, setFilter] = useState<'todos' | 'publicado' | 'pendente' | 'oculto'>('todos');

  const filteredFeedbacks = feedbacks.filter(f => {
    if (filter === 'todos') return true;
    return f.status === filter;
  });

  const publishedCount = feedbacks.filter(f => f.status === 'publicado').length;
  const averageStars = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.stars, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-[#8B5A51] uppercase tracking-wider">
            Avaliações & Prova Social
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#2C201C] mt-0.5">
            Depoimentos & Feedbacks
          </h3>
          <p className="text-xs text-[#7E706B] mt-0.5">
            Modere as avaliações deixadas pelas clientes após os atendimentos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="text-xs font-bold text-amber-900">{averageStars} / 5.0</span>
            <span className="text-[11px] text-amber-700 font-medium">({feedbacks.length} avaliações)</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">{publishedCount} no ar</span>
          </div>
        </div>
      </div>

      {/* Aviso */}
      <div className="p-4 rounded-2xl bg-[#FAF6F3] border border-[#E8D1CB] text-xs text-[#2C201C] flex items-center gap-3">
        <Heart className="w-5 h-5 text-[#8B5A51] flex-shrink-0" />
        <p>
          Os depoimentos com status <strong>Publicado</strong> são exibidos automaticamente na vitrine da página inicial para novas clientes que vêm de indicação ou tráfego pago.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {(['todos', 'publicado', 'pendente', 'oculto'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filter === st 
                ? 'bg-[#8B5A51] text-white shadow-xs' 
                : 'bg-white border border-[#EFE4DE] text-[#7E706B] hover:text-[#2C201C]'
            }`}
          >
            {st === 'todos' ? 'Todas' : st === 'publicado' ? 'Publicadas no Site' : st === 'pendente' ? 'Pendentes' : 'Ocultas'}
          </button>
        ))}
      </div>

      {/* Grid de Feedbacks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeedbacks.map((fb) => (
          <div
            key={fb.id}
            className="bg-white rounded-3xl p-5 border border-[#EFE4DE] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#FAF6F3] border border-[#EFE4DE] flex items-center justify-center font-bold text-sm text-[#8B5A51] flex-shrink-0">
                    {fb.avatarUrl ? (
                      <img src={fb.avatarUrl} alt={fb.clientName} className="w-full h-full object-cover" />
                    ) : (
                      fb.clientName[0]
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2C201C]">{fb.clientName}</h4>
                    <p className="text-[11px] text-[#8B5A51] font-medium">{fb.procedureName}</p>
                    <p className="text-[10px] text-[#7E706B] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDate(fb.createdAt)}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  fb.status === 'publicado'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : fb.status === 'pendente'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                }`}>
                  {fb.status}
                </span>
              </div>

              {/* Estrelas */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(fb.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Comentário */}
              <p className="text-xs text-[#2C201C]/90 italic leading-relaxed bg-[#FAF6F3] p-3 rounded-2xl border border-[#EFE4DE]/70">
                "{fb.comment}"
              </p>
            </div>

            {/* Ações de Moderação */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFE4DE]">
              {fb.status !== 'publicado' && (
                <button
                  onClick={() => updateFeedbackStatus(fb.id, 'publicado')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Publicar no Site</span>
                </button>
              )}

              {fb.status === 'publicado' && (
                <button
                  onClick={() => updateFeedbackStatus(fb.id, 'oculto')}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Ocultar do Site</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
