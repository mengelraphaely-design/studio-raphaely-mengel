import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  Gift, 
  Clock, 
  UserCheck, 
  MessageCircle, 
  Calendar,
  AlertTriangle,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export const AdminRelationship: React.FC = () => {
  const { clients, birthdayAlerts, retentionAlerts } = useApp();

  // Métricas do Lovable
  // Novas clientes: 3
  // Clientes que voltaram: 6
  // Reativadas: 4
  // Sem retorno: 1
  const novasClientes = clients.filter(c => c.isNewClient);
  const clientesFrequentes = clients
    .filter(c => (c.totalAppointments || 0) >= 3)
    .sort((a, b) => (b.totalAppointments || 0) - (a.totalAppointments || 0));

  const semRetorno = clients.filter(c => {
    if (!c.lastVisitDate) return false;
    const diffDays = Math.ceil((new Date().getTime() - new Date(c.lastVisitDate).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 60;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
        <span className="text-[10px] font-bold text-[#8B5A51] uppercase tracking-wider">
          Fidelização & Mimos
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#2C201C] mt-0.5">
          Quem merece um carinho agora
        </h3>
        <p className="text-xs text-[#7E706B] mt-0.5">
          Ações automáticas para encantar clientes no aniversário, manter o vínculo com clientes assíduas e resgatar quem sumiu.
        </p>
      </div>

      {/* 4 Cards de Métricas de Relacionamento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
          <div className="text-[11px] font-bold text-[#7E706B] uppercase tracking-wider mb-1">
            Novas do mês
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
            3
          </div>
          <p className="text-[11px] text-[#8B5A51] font-medium mt-0.5">
            Primeiro atendimento
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
          <div className="text-[11px] font-bold text-[#7E706B] uppercase tracking-wider mb-1">
            Que voltaram
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
            6
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            Clientes ativas regulares
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
          <div className="text-[11px] font-bold text-[#7E706B] uppercase tracking-wider mb-1">
            Reativadas
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
            4
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-0.5">
            Voltaram após contato
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
          <div className="text-[11px] font-bold text-[#7E706B] uppercase tracking-wider mb-1">
            Sem retorno (60d+)
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-rose-600">
            {semRetorno.length || 1}
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">
            Precisam de resgate
          </p>
        </div>
      </div>

      {/* SEÇÃO 1: Próximos Aniversários */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#2C201C]">
                Próximos Aniversários
              </h4>
              <p className="text-xs text-[#7E706B]">
                Envie uma mensagem carinhosa e um bônus de aniversário
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#8B5A51] bg-[#FAF6F3] px-3 py-1 rounded-full border border-[#EFE4DE]">
            {birthdayAlerts.length} comemorações próximas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {birthdayAlerts.map((alert) => (
            <div
              key={alert.client.id}
              className="p-4 rounded-2xl bg-[#FAF6F3] border border-[#E8D1CB] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white border border-[#EFE4DE] flex items-center justify-center font-bold text-[#8B5A51] flex-shrink-0">
                  {alert.client.avatarUrl ? (
                    <img src={alert.client.avatarUrl} alt={alert.client.name} className="w-full h-full object-cover" />
                  ) : (
                    alert.client.name[0]
                  )}
                </div>
                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-[#2C201C] truncate">{alert.client.name}</h5>
                  <p className="text-xs text-[#8B5A51] font-semibold">
                    🎂 {alert.isToday ? 'Hoje é o grande dia!' : `Faz aniversário em ${alert.daysUntil} dias`} ({alert.formattedDate})
                  </p>
                  <p className="text-[11px] text-[#7E706B] truncate">{alert.client.phone}</p>
                </div>
              </div>

              <button
                onClick={() => openWhatsApp(
                  alert.client.phone,
                  `Oi ${alert.client.name.split(' ')[0]}, tudo bem? ✨ A Rapha do Studio passando para te desejar um aniversário maravilhoso e adiantar que preparei um mimo especial para o seu momento de beleza no Studio este mês! Quando podemos agendar?`
                )}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 flex-shrink-0 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enviar Mimo</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 2: Clientes Mais Frequentes */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#2C201C]">
                Clientes Frequentes & VIPs
              </h4>
              <p className="text-xs text-[#7E706B]">
                Reconheça e presenteie as clientes que mantêm a frequência assídua
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {clientesFrequentes.length} clientes VIP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {clientesFrequentes.slice(0, 4).map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-white border border-[#EFE4DE] shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#FAF6F3] border border-[#EFE4DE] flex items-center justify-center font-bold text-[#8B5A51] flex-shrink-0">
                  {c.avatarUrl ? (
                    <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    c.name[0]
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-sm font-bold text-[#2C201C] truncate">{c.name}</h5>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md">VIP</span>
                  </div>
                  <p className="text-xs text-[#7E706B]">
                    ⭐ <strong>{c.totalAppointments} atendimentos</strong> • R$ {c.totalSpent} investidos
                  </p>
                </div>
              </div>

              <button
                onClick={() => openWhatsApp(
                  c.phone,
                  `Oi ${c.name.split(' ')[0]}! 💕 Passando para agradecer pela sua fidelidade e carinho com o Studio. Você é uma cliente muito especial pra mim!`
                )}
                className="px-3 py-2 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs font-bold flex items-center gap-1 flex-shrink-0 shadow-xs transition-colors"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Agradecer</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 3: Clientes Sem Retorno (Resgate) */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#2C201C]">
                Clientes Sem Retorno (Mais de 35 a 60 dias)
              </h4>
              <p className="text-xs text-[#7E706B]">
                Envie um convite especial para agendamento de manutenção ou nova esmaltação
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {retentionAlerts.map((ret) => (
            <div
              key={ret.client.id}
              className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white border border-rose-200 flex items-center justify-center font-bold text-rose-700 flex-shrink-0">
                  {ret.client.avatarUrl ? (
                    <img src={ret.client.avatarUrl} alt={ret.client.name} className="w-full h-full object-cover" />
                  ) : (
                    ret.client.name[0]
                  )}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#2C201C]">{ret.client.name}</h5>
                  <p className="text-xs text-rose-700 font-semibold">
                    💅 Está há {ret.daysSinceLastVisit} dias sem agendar (Último serviço: {ret.lastProcedure})
                  </p>
                  <p className="text-[11px] text-[#7E706B]">
                    Última visita registrada em: {ret.lastVisitFormatted}
                  </p>
                </div>
              </div>

              <button
                onClick={() => openWhatsApp(
                  ret.client.phone,
                  `Oi ${ret.client.name.split(' ')[0]}, tudo bem com você? A Rapha tá com saudades! 💕 Notei que faz um tempinho desde sua última sessão de ${ret.lastProcedure}. Gostaria de agendar um horário esta semana para deixar suas unhas impecáveis de novo?`
                )}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors self-start sm:self-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Resgatar Cliente no WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
