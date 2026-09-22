import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import { 
  Heart, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  Star, 
  ExternalLink,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export const AdminPostCareMessages: React.FC = () => {
  const { appointments, markThankYouSent } = useApp();
  const [filter, setFilter] = useState<'todos' | 'pendentes' | 'enviados'>('todos');

  // Filtrar agendamentos concluídos ou recentes que necessitam de pós-atendimento
  const relevantAppointments = appointments.filter(a => a.status === 'concluido' || a.status === 'confirmado');

  const filtered = relevantAppointments.filter(a => {
    if (filter === 'pendentes') return !a.thankYouSent;
    if (filter === 'enviados') return !!a.thankYouSent;
    return true;
  });

  const totalConcluidos = relevantAppointments.length;
  const totalEnviados = relevantAppointments.filter(a => a.thankYouSent).length;
  const totalPendentes = totalConcluidos - totalEnviados;

  const handleSendThankYou = (app: Appointment) => {
    const firstName = app.clientName.split(' ')[0];
    const message = `Oi, ${firstName}! ✨ Passando para agradecer de coração pelo carinho da sua visita hoje no Studio Raphaely Mengel! Amei fazer seu(sua) ${app.procedureName}. Como estão suas unhas? Espero que esteja se sentindo maravilhosa! 💕\n\nSe você puder tirar 30 segundinhos para deixar uma rápida avaliação no nosso site, me ajuda imensamente a crescer:\n👉 https://esteticaraphaelymengel.com.br\n\nSe precisar de qualquer dica pós-procedimento, é só me chamar aqui! Um grande beijo! 💅`;
    
    openWhatsApp(app.clientPhone, message);
    markThankYouSent(app.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#8B5A51] uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#8B5A51]" />
            Pós-Atendimento & Fidelização
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#2C201C] mt-0.5">
            Mensagens de Agradecimento & Avaliação
          </h3>
          <p className="text-xs text-[#7E706B] mt-0.5">
            Envie com 1 clique no WhatsApp um agradecimento carinhoso e o link para a cliente deixar feedback no site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200">
            <Clock className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-900">{totalPendentes} pendentes</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">{totalEnviados} enviados</span>
          </div>
        </div>
      </div>

      {/* Modelo da Mensagem Automática */}
      <div className="p-5 rounded-3xl bg-[#FAF6F3] border border-[#E8D1CB] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B5A51] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C59B67]" />
            Modelo da Mensagem Personalizada
          </span>
          <span className="text-[11px] text-[#7E706B]">Enviada direto no WhatsApp da cliente</span>
        </div>
        <p className="text-xs sm:text-sm text-[#2C201C]/90 italic bg-white p-4 rounded-2xl border border-[#EFE4DE] leading-relaxed">
          "Oi, <strong>[Nome]</strong>! ✨ Passando para agradecer de coração pelo carinho da sua visita hoje no Studio Raphaely Mengel! Amei fazer seu <strong>[Procedimento]</strong>. Como estão suas unhas? Espero que esteja se sentindo maravilhosa! 💕 Se puder tirar 30 segundinhos para deixar sua avaliação no nosso site, me ajuda imensamente: https://esteticaraphaelymengel.com.br Qualquer dúvida com seus cuidados pós-procedimento, é só me chamar!"
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('todos')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            filter === 'todos' ? 'bg-[#8B5A51] text-white shadow-xs' : 'bg-white border border-[#EFE4DE] text-[#7E706B]'
          }`}
        >
          Todos ({relevantAppointments.length})
        </button>
        <button
          onClick={() => setFilter('pendentes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            filter === 'pendentes' ? 'bg-[#8B5A51] text-white shadow-xs' : 'bg-white border border-[#EFE4DE] text-[#7E706B]'
          }`}
        >
          Aguardando Envio ({totalPendentes})
        </button>
        <button
          onClick={() => setFilter('enviados')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            filter === 'enviados' ? 'bg-[#8B5A51] text-white shadow-xs' : 'bg-white border border-[#EFE4DE] text-[#7E706B]'
          }`}
        >
          Agradecimento Enviado ({totalEnviados})
        </button>
      </div>

      {/* Lista de Atendimentos */}
      <div className="space-y-3">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-3xl bg-white border border-[#EFE4DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF6F3] text-[#8B5A51] flex items-center justify-center font-serif font-bold text-lg border border-[#EFE4DE] flex-shrink-0">
                {app.clientName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-base font-bold text-[#2C201C]">{app.clientName}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    app.thankYouSent 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {app.thankYouSent ? 'Enviado ✓' : 'Pendente'}
                  </span>
                </div>
                <p className="text-xs text-[#8B5A51] font-semibold mt-0.5">
                  {app.procedureName} • R$ {app.price}
                </p>
                <p className="text-[11px] text-[#7E706B]">
                  Atendimento em: {app.date.split('-').reverse().join('/')} às {app.time} • Tel: {app.clientPhone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <button
                onClick={() => handleSendThankYou(app)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors ${
                  app.thankYouSent
                    ? 'bg-[#FAF6F3] hover:bg-[#F4EAE6] text-[#8B5A51] border border-[#E8D1CB]'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{app.thankYouSent ? 'Reenviar Agradecimento' : 'Enviar Agradecimento + Pedir Avaliação'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
