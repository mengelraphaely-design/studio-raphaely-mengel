import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Sparkles, Send, Cake, Check, Heart, Calendar } from 'lucide-react';
import { openWhatsApp, getBirthdayBonusWhatsAppMessage } from '../utils/whatsapp';

export const AdminBirthdayRadar: React.FC = () => {
  const { birthdayAlerts } = useApp();
  const [selectedBonus, setSelectedBonus] = useState<string>('R$ 50 de bônus ou um Spa Labial de cortesia');
  const [sentClients, setSentClients] = useState<Record<string, boolean>>({});

  const bonusOptions = [
    'R$ 50 de bônus ou um Spa Labial de cortesia',
    '20% de desconto em qualquer protocolo facial',
    'Revitalização com Vitamina C como presente de aniversário',
    'Massagem Facial Relaxante gratuita no próximo agendamento'
  ];

  const handleSendBonus = (clientId: string, clientName: string, clientPhone: string) => {
    const msg = getBirthdayBonusWhatsAppMessage(clientName, selectedBonus);
    openWhatsApp(clientPhone, msg);
    setSentClients(prev => ({ ...prev, [clientId]: true }));
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-[#F4EAE6] via-white to-[#FAF6F3] p-6 rounded-3xl border border-[#E8D1CB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#8B5A51] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Cake className="w-7 h-7 text-[#EEDDCC]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B5A51] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B67]" />
              Fidelização & Encantamento
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C201C] mt-0.5">
              Radar de Aniversariantes ({birthdayAlerts.length})
            </h3>
            <p className="text-xs text-[#7E706B] mt-1">
              Clientes que fazem aniversário este mês ou nos próximos dias. Bonifique para trazer a cliente de volta!
            </p>
          </div>
        </div>

        {/* Seletor de Bonificação Atual */}
        <div className="w-full sm:w-auto bg-white p-3 rounded-2xl border border-[#EFE4DE] text-xs">
          <label className="block text-[10px] font-bold text-[#7E706B] uppercase tracking-wider mb-1">
            Presente / Bonificação do Mês:
          </label>
          <select
            value={selectedBonus}
            onChange={(e) => setSelectedBonus(e.target.value)}
            className="w-full bg-[#FAF6F3] px-3 py-1.5 rounded-xl border border-[#EFE4DE] text-[#2C201C] font-semibold focus:outline-none"
          >
            {bonusOptions.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Aniversariantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {birthdayAlerts.length > 0 ? (
          birthdayAlerts.map(({ client, daysUntil, formattedDate, isToday }) => {
            const hasSent = sentClients[client.id];
            
            return (
              <div
                key={client.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isToday
                    ? 'border-amber-400 shadow-md ring-2 ring-amber-300/40 bg-amber-50/20'
                    : 'border-[#EFE4DE] shadow-xs hover:border-[#8B5A51]/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-[#F4EAE6] flex items-center justify-center font-serif font-bold text-[#8B5A51] border border-[#E8D1CB]">
                        {client.avatarUrl ? (
                          <img src={client.avatarUrl} alt={client.name} className="w-full h-full object-cover" />
                        ) : (
                          client.name[0]
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#2C201C]">
                          {client.name}
                        </h4>
                        <p className="text-xs text-[#7E706B]">{client.phone}</p>
                      </div>
                    </div>

                    {/* Tag de Proximidade */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isToday
                        ? 'bg-amber-400 text-amber-950 animate-bounce'
                        : daysUntil <= 3
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-[#F4EAE6] text-[#8B5A51]'
                    }`}>
                      {isToday ? '🎂 É HOJE!' : `Em ${daysUntil} dias (${formattedDate})`}
                    </span>
                  </div>

                  {/* Detalhes da Cliente */}
                  <div className="bg-[#FAF6F3] rounded-2xl p-3.5 space-y-1.5 text-xs text-[#2C201C]">
                    <div className="flex justify-between">
                      <span className="text-[#7E706B]">Procedimento favorito:</span>
                      <span className="font-semibold text-right truncate max-w-[180px]">
                        {client.favoriteProcedures[0] || 'Limpeza de Pele'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7E706B]">Última visita:</span>
                      <span className="font-medium text-[#7E706B]">
                        {client.lastVisitDate.split('-').reverse().join('/')}
                      </span>
                    </div>
                    {client.skinNotes && (
                      <p className="text-[11px] text-[#7E706B] italic pt-1 border-t border-[#EFE4DE]">
                        "{client.skinNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Botão de Enviar Bonificação */}
                <div className="pt-4 mt-4 border-t border-[#EFE4DE]">
                  <button
                    onClick={() => handleSendBonus(client.id, client.name, client.phone)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
                      hasSent
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-[#8B5A51] hover:bg-[#73433a] text-white'
                    }`}
                  >
                    {hasSent ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Bonificação Enviada! Reenviar?</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Mandar Bonificação no WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white rounded-3xl p-10 text-center border border-[#EFE4DE] text-[#7E706B]">
            <Gift className="w-10 h-10 mx-auto text-[#8B5A51]/40 mb-2" />
            <p className="text-sm font-semibold text-[#2C201C]">Nenhum aniversário nos próximos 18 dias.</p>
            <p className="text-xs">Os aniversariantes aparecerão automaticamente aqui com contagem regressiva!</p>
          </div>
        )}
      </div>

    </div>
  );
};
