import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Sparkles, Send, Clock, Check, Heart, MessageCircleHeart } from 'lucide-react';
import { openWhatsApp, getRetentionMimoWhatsAppMessage } from '../utils/whatsapp';

export const AdminRetentionRadar: React.FC = () => {
  const { retentionAlerts } = useApp();
  const [sentReactivation, setSentReactivation] = useState<Record<string, boolean>>({});

  const handleSendMimo = (clientId: string, clientName: string, clientPhone: string, lastProc: string, daysAgo: number) => {
    const msg = getRetentionMimoWhatsAppMessage(clientName, lastProc, daysAgo);
    openWhatsApp(clientPhone, msg);
    setSentReactivation(prev => ({ ...prev, [clientId]: true }));
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Explicativo */}
      <div className="bg-gradient-to-r from-[#FAF6F3] via-white to-[#F4EAE6] p-6 rounded-3xl border border-[#E8D1CB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#8B5A51] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <MessageCircleHeart className="w-7 h-7 text-[#EEDDCC]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B5A51] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B67]" />
              Reativação & Retenção de Clientes
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C201C] mt-0.5">
              Clientes que Não Voltam há +35 Dias ({retentionAlerts.length})
            </h3>
            <p className="text-xs text-[#7E706B] mt-1">
              Recupere clientes antigas com uma mensagem carinhosa oferecendo um mimo de retorno no WhatsApp.
            </p>
          </div>
        </div>

        <div className="bg-[#FAF6F3] px-4 py-2.5 rounded-2xl border border-[#EFE4DE] text-xs text-[#8B5A51] font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Manutenção da pele indicada a cada 30-45 dias</span>
        </div>
      </div>

      {/* Lista de Clientes Ausentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {retentionAlerts.length > 0 ? (
          retentionAlerts.map(({ client, daysSinceLastVisit, lastVisitFormatted, lastProcedure }) => {
            const hasSent = sentReactivation[client.id];

            return (
              <div
                key={client.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE4DE] shadow-xs hover:border-[#8B5A51]/40 transition-all flex flex-col justify-between"
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

                    {/* Badge de dias ausente */}
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-amber-100 text-amber-900 border border-amber-200">
                      {daysSinceLastVisit} dias sem vir
                    </span>
                  </div>

                  {/* Informações da última visita */}
                  <div className="bg-[#FAF6F3] rounded-2xl p-3.5 space-y-1.5 text-xs text-[#2C201C]">
                    <div className="flex justify-between">
                      <span className="text-[#7E706B]">Último procedimento:</span>
                      <span className="font-semibold text-[#8B5A51] truncate max-w-[170px]">
                        {lastProcedure}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7E706B]">Data da última sessão:</span>
                      <span className="font-medium">{lastVisitFormatted}</span>
                    </div>
                    {client.skinNotes && (
                      <p className="text-[11px] text-[#7E706B] italic pt-1 border-t border-[#EFE4DE]">
                        "{client.skinNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Botão de Disparo do Mimo */}
                <div className="pt-4 mt-4 border-t border-[#EFE4DE]">
                  <button
                    onClick={() => handleSendMimo(client.id, client.name, client.phone, lastProcedure, daysSinceLastVisit)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
                      hasSent
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-[#8B5A51] hover:bg-[#73433a] text-white'
                    }`}
                  >
                    {hasSent ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Mimo Enviado! Deseja Reenviar?</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Mimo de Saudade no WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white rounded-3xl p-10 text-center border border-[#EFE4DE] text-[#7E706B]">
            <Heart className="w-10 h-10 mx-auto text-[#8B5A51]/40 mb-2" />
            <p className="text-sm font-semibold text-[#2C201C]">Todas as clientes estão com visitas recentes em dia!</p>
            <p className="text-xs">Quando alguém passar de 35 dias sem vir, ela aparecerá aqui automaticamente.</p>
          </div>
        )}
      </div>

    </div>
  );
};
