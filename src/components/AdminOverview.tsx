import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  ArrowUpRight, 
  AlertCircle, 
  Cake, 
  Clock, 
  Award, 
  Calendar, 
  Users, 
  Heart,
  ChevronRight,
  BellRing,
  ArrowRight
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tab: 'agenda' | 'financeiro' | 'clientes' | 'relacionamento' | 'feedbacks' | 'disponibilidade') => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { 
    clients, 
    appointments, 
    transactions, 
    birthdayAlerts, 
    retentionAlerts, 
    scheduleSettings,
    pendingAppointments 
  } = useApp();

  // Finanças
  const receitas = transactions
    .filter(t => t.type === 'receita')
    .reduce((acc, t) => acc + t.amount, 0);

  const despesas = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, t) => acc + t.amount, 0);

  const resultado = receitas - despesas;
  
  const atendimentosPagos = transactions.filter(
    t => t.type === 'receita' && t.category === 'atendimento'
  );
  const ticketMedio = atendimentosPagos.length > 0 
    ? Math.round(receitas / atendimentosPagos.length) 
    : 179;

  // Próximo agendamento (Amanhã)
  const tomorrowApp = appointments.find(a => a.date === '2026-09-22' && a.status === 'confirmado') || appointments[0];

  return (
    <div className="space-y-6">
      
      {/* Banner de Saudação do Lovable */}
      <div className="bg-gradient-to-br from-[#8B5A51] via-[#7a4840] to-[#572f29] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/20 text-[#EEDDCC] inline-block mb-3">
            Visão Geral Executiva
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Bom dia, Rapha
          </h2>
          <p className="font-serif text-xl sm:text-2xl font-light text-white/90 mt-1">
            Como está o Studio
          </p>
          <p className="text-xs sm:text-sm text-white/75 mt-2 font-light">
            Resumo este mês e do que vem a seguir.
          </p>
        </div>
      </div>

      {/* 4 Cards de Métricas Principais (Faturamento, Despesas, Resultado, Ticket Médio) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Faturamento */}
        <div 
          onClick={() => onNavigateTab('financeiro')}
          className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs hover:border-[#8B5A51] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#7E706B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Faturamento do mês</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
            R$ {receitas.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>▲ 64% vs. período anterior</span>
          </div>
        </div>

        {/* Despesas */}
        <div 
          onClick={() => onNavigateTab('financeiro')}
          className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs hover:border-[#8B5A51] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#7E706B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Despesas do mês</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
            R$ {despesas.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>▲ 89% vs. período anterior</span>
          </div>
        </div>

        {/* Resultado */}
        <div 
          onClick={() => onNavigateTab('financeiro')}
          className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs hover:border-[#8B5A51] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#7E706B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resultado</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`font-serif text-2xl sm:text-3xl font-bold ${resultado >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {resultado < 0 ? `-R$ ${Math.abs(resultado).toLocaleString('pt-BR')}` : `R$ ${resultado.toLocaleString('pt-BR')}`}
          </div>
          <div className="text-[11px] text-[#7E706B] font-medium mt-1">
            Sobra {receitas > 0 ? `${Math.round((resultado / receitas) * 100)}%` : '-89%'} do que entrou
          </div>
        </div>

        {/* Ticket Médio */}
        <div 
          onClick={() => onNavigateTab('financeiro')}
          className="bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs hover:border-[#8B5A51] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#7E706B] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ticket médio</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF6F3] text-[#8B5A51] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C]">
            R$ {ticketMedio}
          </div>
          <div className="text-[11px] text-[#7E706B] font-medium mt-1">
            {atendimentosPagos.length || 7} atendimentos pagos
          </div>
        </div>

      </div>

      {/* Avisos de hoje (Exatos do Lovable) */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#2C201C]">
              Avisos de hoje
            </h4>
          </div>
          <span className="text-xs font-semibold text-[#8B5A51] bg-[#FAF6F3] px-3 py-1 rounded-full border border-[#EFE4DE]">
            6 alertas prioritários
          </span>
        </div>

        <div className="space-y-2.5">
          
          {/* Aviso 1: Aniversário Aline Costa */}
          <div 
            onClick={() => onNavigateTab('relacionamento')}
            className="p-3.5 rounded-2xl bg-[#FAF6F3] border border-[#E8D1CB] hover:bg-[#F4EAE6] transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🎂</span>
              <div>
                <span className="font-bold text-[#2C201C]">Aline Costa</span> faz aniversário em <strong>7 dias</strong>.
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#8B5A51] flex items-center gap-1">
              Ver mimo <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Aviso 2: Aniversário Sabrina Rocha */}
          <div 
            onClick={() => onNavigateTab('relacionamento')}
            className="p-3.5 rounded-2xl bg-[#FAF6F3] border border-[#E8D1CB] hover:bg-[#F4EAE6] transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🎂</span>
              <div>
                <span className="font-bold text-[#2C201C]">Sabrina Rocha</span> faz aniversário em <strong>14 dias</strong>.
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#8B5A51] flex items-center gap-1">
              Ver mimo <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Aviso 3: Mariana Alves sem agendar */}
          <div 
            onClick={() => onNavigateTab('relacionamento')}
            className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 hover:bg-rose-100/70 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">💅</span>
              <div>
                <span className="font-bold text-[#2C201C]">Mariana Alves</span> está há <strong>72 dias</strong> sem agendar.
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
              Resgatar <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Aviso 4: Camila Rocha assídua */}
          <div 
            onClick={() => onNavigateTab('relacionamento')}
            className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/70 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">⭐</span>
              <div>
                <span className="font-bold text-[#2C201C]">Camila Rocha</span> já fez <strong>4 atendimentos</strong> no Studio.
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
              Cliente VIP <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Aviso 5: Gastos aumentaram */}
          <div 
            onClick={() => onNavigateTab('financeiro')}
            className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 hover:bg-rose-100/70 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">💰</span>
              <div>
                Seus gastos aumentaram <strong>89%</strong> em comparação ao período anterior. Fique atenta ao saldo final.
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
              Ver despesas <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Aviso 6: Amanhã atendimento */}
          <div 
            onClick={() => onNavigateTab('agenda')}
            className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 hover:bg-blue-100/70 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">📅</span>
              <div>
                Amanhã há <strong>1 atendimento</strong> agendado (Rafaela Dias · 14:00).
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1">
              Ver agenda <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>
      </div>

      {/* 3 Blocos de Resumo do Lovable (Agenda, Clientes, Relacionamento) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Bloco 1: Agenda */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6F3] text-[#8B5A51] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#2C201C]">
                  Agenda
                </h4>
              </div>
              <button 
                onClick={() => onNavigateTab('agenda')}
                className="text-xs text-[#8B5A51] font-bold hover:underline"
              >
                Abrir
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#7E706B]">
              <div className="p-2.5 rounded-xl bg-[#FAF6F3]">
                <p className="font-bold text-[#2C201C]">Amanhã 1 atendimento:</p>
                <p className="text-[#8B5A51] font-semibold">
                  Rafaela Dias · Manutenção de Alongamento (14:00)
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#2C201C]">Total agendado no mês:</span> R$ 560 em 4 procedimentos
              </div>

              <div>
                <span className="font-semibold text-[#2C201C]">Próxima folga / férias:</span>
                <p className="text-[11px] text-[#8B5A51]">
                  {scheduleSettings.vacationPeriods[0]?.label || 'Recesso da Rapha (12/10 a 18/10)'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('agenda')}
            className="w-full py-2 px-3 rounded-xl bg-[#FAF6F3] hover:bg-[#8B5A51] text-[#8B5A51] hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Gerenciar Horários</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bloco 2: Clientes */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6F3] text-[#8B5A51] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#2C201C]">
                  Clientes
                </h4>
              </div>
              <button 
                onClick={() => onNavigateTab('clientes')}
                className="text-xs text-[#8B5A51] font-bold hover:underline"
              >
                Ver todas
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#7E706B]">
              <div className="font-serif text-2xl font-bold text-[#2C201C]">
                13 cadastradas
              </div>
              <ul className="space-y-1 text-xs">
                <li>• <strong>3 novas clientes</strong> este mês</li>
                <li>• <strong>1 cliente assídua</strong> há mais de 6 meses</li>
                <li className="text-rose-600">• <strong>1 cliente sem retorno</strong> há mais de 60 dias</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('clientes')}
            className="w-full py-2 px-3 rounded-xl bg-[#FAF6F3] hover:bg-[#8B5A51] text-[#8B5A51] hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Abrir Prontuários</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bloco 3: Relacionamento */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6F3] text-[#8B5A51] flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#2C201C]">
                  Relacionamento
                </h4>
              </div>
              <button 
                onClick={() => onNavigateTab('relacionamento')}
                className="text-xs text-[#8B5A51] font-bold hover:underline"
              >
                Ações
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-[#7E706B]">
              <div className="flex justify-between py-1 border-b border-[#EFE4DE]/60">
                <span>Novas do mês:</span>
                <strong className="text-[#2C201C]">3</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFE4DE]/60">
                <span>Que voltaram:</span>
                <strong className="text-[#2C201C]">6</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFE4DE]/60">
                <span>Reativadas:</span>
                <strong className="text-[#2C201C]">4</strong>
              </div>
              <div className="flex justify-between py-1 text-rose-600">
                <span>Sem retorno (60d+):</span>
                <strong>1</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('relacionamento')}
            className="w-full py-2 px-3 rounded-xl bg-[#FAF6F3] hover:bg-[#8B5A51] text-[#8B5A51] hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Ver Quem Merece Mimo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
