import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard,
  Calendar, 
  DollarSign, 
  Users, 
  Heart, 
  MessageSquareHeart, 
  Palmtree, 
  ArrowLeft, 
  RotateCcw,
  BellRing,
  Lock
} from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { AdminAgenda } from './AdminAgenda';
import { AdminFinancial } from './AdminFinancial';
import { AdminClients } from './AdminClients';
import { AdminRelationship } from './AdminRelationship';
import { AdminFeedback } from './AdminFeedback';
import { AdminScheduleSettings } from './AdminScheduleSettings';
import { AdminPostCareMessages } from './AdminPostCareMessages';

export type AdminTab = 
  | 'visao_geral' 
  | 'agenda' 
  | 'financeiro' 
  | 'clientes' 
  | 'relacionamento' 
  | 'pos_atendimento'
  | 'feedbacks' 
  | 'disponibilidade';

export const RaphaDashboard: React.FC = () => {
  const { 
    pendingAppointments, 
    birthdayAlerts, 
    setActiveTab, 
    resetDataToDefault,
    toggleAdminLogin 
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<AdminTab>('visao_geral');

  return (
    <div className="py-6 sm:py-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-6 pb-24">
      
      {/* Top Bar da Rapha com Atalhos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#8B5A51] text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
            RM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                Studio Raphaely Mengel
              </span>
              <span className="text-xs text-[#7E706B]">Painel Administrativo</span>
            </div>
            <h2 className="font-serif text-lg font-bold text-[#2C201C]">
              Gestão Exclusiva da Rapha
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => {
              toggleAdminLogin(false);
              setActiveTab('portfolio');
            }}
            title="Bloquear e sair do painel"
            className="px-3 py-2 rounded-xl bg-[#FAF6F3] hover:bg-rose-50 text-[#7E706B] hover:text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#EFE4DE]"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sair / Bloquear</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className="px-4 py-2 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Site</span>
          </button>
        </div>
      </div>

      {/* Navegação por Abas (Exata do Lovable) */}
      <div className="flex items-center gap-2 border-b border-[#EFE4DE] pb-2 overflow-x-auto scrollbar-none">
        
        {/* Visão Geral */}
        <button
          onClick={() => setActiveTabLocal('visao_geral')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'visao_geral'
              ? 'bg-[#8B5A51] text-white shadow-xs'
              : 'text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Visão geral</span>
        </button>

        {/* Agenda */}
        <button
          onClick={() => setActiveTabLocal('agenda')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 relative ${
            activeTab === 'agenda'
              ? 'bg-[#8B5A51] text-white shadow-xs'
              : 'text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Agenda</span>
          {pendingAppointments.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 font-bold text-[10px] rounded-full">
              {pendingAppointments.length}
            </span>
          )}
        </button>

        {/* Financeiro */}
        <button
          onClick={() => setActiveTabLocal('financeiro')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'financeiro'
              ? 'bg-[#8B5A51] text-white shadow-xs'
              : 'text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financeiro</span>
        </button>

        {/* Clientes */}
        <button
          onClick={() => setActiveTabLocal('clientes')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'clientes'
              ? 'bg-[#8B5A51] text-white shadow-xs'
              : 'text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clientes</span>
        </button>

        {/* Relacionamento */}
        <button
          onClick={() => setActiveTabLocal('relacionamento')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 relative ${
            activeTab === 'relacionamento'
              ? 'bg-[#8B5A51] text-white shadow-xs'
              : 'text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Relacionamento</span>
          {birthdayAlerts.length > 0 && (
            <span className="w-2 h-2 bg-pink-500 rounded-full" />
          )}
        </button>

        {/* Pós-Atendimento & Agradecimentos */}
        <button
          onClick={() => setActiveTabLocal('pos_atendimento')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'pos_atendimento'
              ? 'bg-[#8B5A51] text-white shadow-xs'
              : 'text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3]'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
          <span>Agradecimentos</span>
        </button>

        {/* Feedbacks */}
        <button
          onClick={() => setActiveTabLocal('feedbacks')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'feedbacks'
              ? 'bg-[#8B5A51] text-white shadow-xs'
              : 'text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3]'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>Feedbacks</span>
        </button>

        {/* Horários & Férias */}
        <button
          onClick={() => setActiveTabLocal('disponibilidade')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'disponibilidade'
              ? 'bg-[#8B5A51] text-white shadow-xs'
              : 'text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3]'
          }`}
        >
          <Palmtree className="w-4 h-4" />
          <span>Horários & Férias</span>
        </button>

      </div>

      {/* Conteúdo Dinâmico da Aba Selecionada */}
      <div className="transition-all duration-200">
        {activeTab === 'visao_geral' && (
          <AdminOverview 
            onNavigateTab={(tab) => {
              if (tab === 'disponibilidade') setActiveTabLocal('disponibilidade');
              else setActiveTabLocal(tab);
            }} 
          />
        )}
        {activeTab === 'agenda' && <AdminAgenda />}
        {activeTab === 'financeiro' && <AdminFinancial />}
        {activeTab === 'clientes' && <AdminClients />}
        {activeTab === 'relacionamento' && <AdminRelationship />}
        {activeTab === 'pos_atendimento' && <AdminPostCareMessages />}
        {activeTab === 'feedbacks' && <AdminFeedback />}
        {activeTab === 'disponibilidade' && <AdminScheduleSettings />}
      </div>

    </div>
  );
};
