import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Send, 
  Check, 
  X, 
  Plus, 
  Phone, 
  Filter, 
  Sparkles,
  AlertCircle,
  CalendarDays,
  BellRing,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  RefreshCw,
  Edit3,
  CheckCircle2
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types';
import { openWhatsApp, getReminderWhatsAppMessage, STUDIO_NAME } from '../utils/whatsapp';

export const AdminAgenda: React.FC = () => {
  const { 
    appointments, 
    updateAppointment,
    updateAppointmentStatus, 
    approveAppointment, 
    rejectAppointment, 
    markReminderSent, 
    markThankYouSent,
    addAppointment, 
    clients, 
    procedures,
    pendingAppointments,
    syncFromCloud,
    isSyncing
  } = useApp();
  
  const [selectedDateFilter, setSelectedDateFilter] = useState<'hoje' | 'amanha' | 'todos'>('todos');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'todos'>('todos');
  const [showNewModal, setShowNewModal] = useState(false);
  const [approvedNotification, setApprovedNotification] = useState<Appointment | null>(null);

  // Modal de Concluir Atendimento & Ajuste de Valor/Financeiro
  const [concludingApp, setConcludingApp] = useState<Appointment | null>(null);
  const [concludePrice, setConcludePrice] = useState<string>('');
  const [concludeDate, setConcludeDate] = useState<string>('');
  const [concludeNotes, setConcludeNotes] = useState<string>('');

  // Modal de Editar Agendamento (Serviço, Data, Horário, Valor, etc.)
  const [editingApp, setEditingApp] = useState<Appointment | null>(null);
  const [editProcedureId, setEditProcedureId] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editTime, setEditTime] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editStatus, setEditStatus] = useState<AppointmentStatus>('confirmado');
  const [editNotes, setEditNotes] = useState<string>('');

  const handleStartEditApp = (app: Appointment) => {
    setEditingApp(app);
    setEditProcedureId(app.procedureId);
    setEditDate(app.date);
    setEditTime(app.time);
    setEditPrice(String(app.price));
    setEditStatus(app.status);
    setEditNotes(app.notes || '');
  };

  const handleProcedureChange = (newProcId: string) => {
    setEditProcedureId(newProcId);
    const proc = procedures.find(p => p.id === newProcId);
    if (proc) {
      setEditPrice(String(proc.price));
    }
  };

  const handleSaveEditApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    const proc = procedures.find(p => p.id === editProcedureId);
    const procName = proc ? proc.name : editingApp.procedureName;
    const duration = proc ? proc.durationMinutes : editingApp.durationMinutes;
    const finalPrice = parseFloat(editPrice) || (proc ? proc.price : editingApp.price);

    updateAppointment(editingApp.id, {
      procedureId: editProcedureId,
      procedureName: procName,
      date: editDate,
      time: editTime,
      durationMinutes: duration,
      price: finalPrice,
      status: editStatus,
      notes: editNotes.trim() || undefined
    });

    setEditingApp(null);
  };

  // Formulário de novo agendamento manual
  const [newClientId, setNewClientId] = useState(clients[0]?.id || '');
  const [newProcedureId, setNewProcedureId] = useState(procedures[0]?.id || '');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('14:00');
  const [newNotes, setNewNotes] = useState('');

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, '0')}-${String(tomorrowDate.getDate()).padStart(2, '0')}`;

  // Filtragem de agendamentos
  const filteredAppointments = appointments.filter(app => {
    if (selectedDateFilter === 'hoje' && app.date !== todayStr) return false;
    if (selectedDateFilter === 'amanha' && app.date !== tomorrowStr) return false;
    if (statusFilter !== 'todos' && app.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  // Disparar lembrete 24h via WhatsApp
  const handleSendReminder = (app: Appointment) => {
    const [y, m, d] = app.date.split('-');
    const dateFormatted = `${d}/${m}/${y}`;
    const msg = getReminderWhatsAppMessage(app.clientName, app.procedureName, dateFormatted, app.time);
    
    openWhatsApp(app.clientPhone, msg);
    markReminderSent(app.id);
  };

  // Rapha aceita a marcação
  const handleApprove = (app: Appointment) => {
    approveAppointment(app.id);
    setApprovedNotification(app);
  };

  // Enviar mensagem de confirmação de aprovação para a cliente
  const handleSendApprovalConfirmation = (app: Appointment) => {
    const [y, m, d] = app.date.split('-');
    const dateFormatted = `${d}/${m}/${y}`;
    const msg = `Olá, ${app.clientName}! ✨ Aqui é a Rapha do Studio Raphaely Mengel.\n\nSua solicitação de agendamento foi *APROVADA* com sucesso! 💅✨\n\n🗓 *Data:* ${dateFormatted}\n⏰ *Horário:* ${app.time}\n💅 *Procedimento:* ${app.procedureName}\n📍 *Local:* Aracaju, SE\n\nSeu horário já está reservado com exclusividade. Te esperamos! 💕`;
    openWhatsApp(app.clientPhone, msg);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find(c => c.id === newClientId);
    const selectedProc = procedures.find(p => p.id === newProcedureId);

    if (!selectedClient || !selectedProc) return;

    addAppointment({
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientPhone: selectedClient.phone,
      procedureId: selectedProc.id,
      procedureName: selectedProc.name,
      date: newDate,
      time: newTime,
      durationMinutes: selectedProc.durationMinutes,
      price: selectedProc.price,
      status: 'confirmado',
      notes: newNotes,
      reminderSent: false,
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    });

    setShowNewModal(false);
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* 🔴 CARD DE NOTIFICAÇÕES: Solicitações Aguardando Aprovação da Rapha */}
      {pendingAppointments.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C201C]">
                  Solicitações Aguardando Sua Aprovação ({pendingAppointments.length})
                </h3>
                <p className="text-xs text-[#7E706B]">
                  Clientes que escolheram dia e horário pelo site. Clique em "Aceitar" para confirmar e fechar a vaga!
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-400 text-amber-950 uppercase tracking-wider animate-pulse hidden sm:inline">
              Ação Necessária
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {pendingAppointments.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-4 border border-amber-300 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#2C201C]">{app.clientName}</h4>
                      <p className="text-xs text-[#7E706B]">{app.clientPhone}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      Pendente
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#8B5A51] pt-1">
                    {app.procedureName} • R$ {app.price},00
                  </p>

                  <div className="p-2 rounded-xl bg-[#FAF6F3] border border-[#EFE4DE] text-xs flex items-center justify-between">
                    <span className="text-[#7E706B]">Horário Solicitado:</span>
                    <span className="font-bold text-[#2C201C]">
                      🗓 {app.date.split('-').reverse().join('/')} às {app.time}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#EFE4DE]">
                  <button
                    onClick={() => handleApprove(app)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Aceitar</span>
                  </button>

                  <button
                    onClick={() => handleStartEditApp(app)}
                    className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8B5A51] border border-amber-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    title="Editar Serviço ou Horário antes de aceitar"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => rejectAppointment(app.id, 'Horário indisponível')}
                    className="py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-rose-50 hover:text-rose-600 text-zinc-600 text-xs font-semibold transition-colors"
                    title="Recusar"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notificação pós-aprovação */}
      {approvedNotification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Horário de {approvedNotification.clientName} aprovado com sucesso!</p>
              <p className="text-[11px] text-emerald-700">A vaga já está bloqueada na sua agenda.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleSendApprovalConfirmation(approvedNotification)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Avisar Cliente no WhatsApp</span>
            </button>
            <button
              onClick={() => setApprovedNotification(null)}
              className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Bar da Agenda */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EFE4DE] shadow-xs">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#2C201C]">
            Agenda & Atendimentos
          </h3>
          <p className="text-xs text-[#7E706B] mt-0.5">
            Visualize os atendimentos agendados e envie confirmações de 24h em 1 clique.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => syncFromCloud()}
            disabled={isSyncing}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-[#8B5A51] border border-amber-200 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            title="Sincronizar com o banco de dados na nuvem"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Atualizando...' : 'Atualizar 🔄'}</span>
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Encaixe</span>
          </button>
        </div>
      </div>

      {/* Filtros de Data e Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF6F3] p-3 rounded-2xl border border-[#EFE4DE]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedDateFilter('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedDateFilter === 'todos'
                ? 'bg-[#8B5A51] text-white shadow-xs'
                : 'bg-white text-[#7E706B] border border-[#EFE4DE]'
            }`}
          >
            Todos os Dias
          </button>
          <button
            onClick={() => setSelectedDateFilter('hoje')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedDateFilter === 'hoje'
                ? 'bg-[#8B5A51] text-white shadow-xs'
                : 'bg-white text-[#7E706B] border border-[#EFE4DE]'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setSelectedDateFilter('amanha')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedDateFilter === 'amanha'
                ? 'bg-[#8B5A51] text-white shadow-xs'
                : 'bg-white text-[#7E706B] border border-[#EFE4DE]'
            }`}
          >
            Amanhã
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#7E706B] hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#EFE4DE] text-xs text-[#2C201C] font-medium focus:outline-none focus:ring-1 focus:ring-[#8B5A51]"
          >
            <option value="todos">Todos os Status</option>
            <option value="confirmado">Confirmados</option>
            <option value="pendente">Pendentes</option>
            <option value="concluido">Concluídos</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Lista de Atendimentos */}
      <div className="space-y-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE4DE] shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Informações do Agendamento */}
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#F4EAE6] text-[#8B5A51] flex flex-col items-center justify-center flex-shrink-0 font-bold">
                  <span className="text-xs">{app.time}</span>
                  <span className="text-[9px] uppercase text-[#7E706B]">{app.date.split('-')[2]}/{app.date.split('-')[1]}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-lg font-bold text-[#2C201C]">{app.clientName}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      app.status === 'confirmado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'pendente'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'concluido'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {app.status === 'pendente' ? 'Aguardando Aprovação' : app.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#8B5A51]">
                    {app.procedureName} • R$ {app.price},00 ({app.durationMinutes} min)
                  </p>

                  <p className="text-[11px] text-[#7E706B] flex items-center gap-2">
                    <span>{app.clientPhone}</span>
                    {app.notes && <span>• Obs: {app.notes}</span>}
                  </p>
                </div>
              </div>

              {/* Ações Rápidas (Aprovar / WhatsApp / Concluir) */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#EFE4DE]">
                
                {/* Se estiver pendente, botão de aceitar direto aqui também */}
                {app.status === 'pendente' && (
                  <button
                    onClick={() => handleApprove(app)}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Aceitar</span>
                  </button>
                )}

                {/* Botão de Enviar Lembrete 24h no WhatsApp */}
                {app.status === 'confirmado' && (
                  <button
                    onClick={() => handleSendReminder(app)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                      app.reminderSent
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-[#8B5A51] text-white hover:bg-[#73433a]'
                    }`}
                    title="Abre o WhatsApp com a mensagem personalizada pronta para envio"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{app.reminderSent ? 'Lembrete Enviado' : 'Enviar Lembrete 24h'}</span>
                  </button>
                )}

                {/* Concluir Atendimento */}
                {app.status === 'confirmado' && (
                  <button
                    onClick={() => {
                      setConcludingApp(app);
                      setConcludePrice(String(app.price));
                      setConcludeDate(app.date || todayStr);
                      setConcludeNotes('');
                    }}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors shadow-xs"
                    title="Marcar como Concluído e Lançar no Financeiro"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}

                {/* Enviar Agradecimento Pós-Sessão no WhatsApp */}
                {app.status === 'concluido' && (
                  <button
                    onClick={() => {
                      const firstName = app.clientName.split(' ')[0];
                      const msg = `Oi, ${firstName}! ✨ Passando para agradecer de coração pelo carinho da sua visita hoje no Studio Raphaely Mengel! Amei fazer seu(sua) ${app.procedureName}. Como estão suas unhas? Espero que tenha amado! 💕\n\nSe você puder tirar 30 segundinhos para deixar uma rápida avaliação no nosso site, me ajuda demais:\n👉 https://studioraphaelymengel.site\n\nQualquer dúvida, estou à disposição!`;
                      openWhatsApp(app.clientPhone, msg);
                      markThankYouSent(app.id);
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      app.thankYouSent 
                        ? 'bg-[#FAF6F3] text-[#7E706B] border border-[#EFE4DE]'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                    title="Enviar Agradecimento e Pedir Avaliação no WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{app.thankYouSent ? 'Agradecido ✓' : 'Agradecer & Pedir Feedback'}</span>
                  </button>
                )}

                {/* Editar Serviço / Horário / Data */}
                <button
                  onClick={() => handleStartEditApp(app)}
                  className="p-2.5 rounded-xl bg-[#FAF6F3] hover:bg-[#EFE4DE] text-[#8B5A51] border border-[#EFE4DE] transition-colors"
                  title="Editar Serviço, Data, Horário ou Observações"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Cancelar */}
                {app.status !== 'cancelado' && (
                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'cancelado')}
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                    title="Cancelar Agendamento"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#EFE4DE] text-[#7E706B] space-y-2">
            <CalendarDays className="w-10 h-10 mx-auto text-[#8B5A51]/40" />
            <p className="text-sm font-semibold text-[#2C201C]">Nenhum agendamento encontrado para este filtro.</p>
          </div>
        )}
      </div>

      {/* Modal de Novo Encaixe Manual */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EFE4DE] relative">
            <button
              onClick={() => setShowNewModal(false)}
              className="absolute top-5 right-5 p-2 text-[#7E706B] hover:text-[#2C201C] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-serif text-2xl font-bold text-[#2C201C] mb-4">
              Novo Encaixe na Agenda
            </h4>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Cliente
                </label>
                <select
                  value={newClientId}
                  onChange={(e) => setNewClientId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Procedimento
                </label>
                <select
                  value={newProcedureId}
                  onChange={(e) => setNewProcedureId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                >
                  {procedures.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (R$ {p.price})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Observações (Opcional)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ex: Encaixe presencial"
                  className="w-full px-4 py-3 rounded-xl border border-[#EFE4DE] text-sm text-[#2C201C]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#FAF6F3] text-xs font-semibold text-[#7E706B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-xs font-semibold text-white shadow-xs"
                >
                  Salvar Horário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Concluir Atendimento & Lançar Receita */}
      {concludingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#EFE4DE] relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DE]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2C201C]">
                    Concluir Atendimento
                  </h3>
                  <p className="text-xs text-[#7E706B]">
                    Lançar receita direto no caixa e financeiro
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConcludingApp(null)}
                className="p-1.5 rounded-full text-[#7E706B] hover:bg-[#FAF6F3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF6F3] p-3.5 rounded-2xl border border-[#EFE4DE] space-y-1">
              <p className="text-xs font-bold text-[#2C201C]">{concludingApp.clientName}</p>
              <p className="text-xs text-[#7E706B]">{concludingApp.procedureName} • {concludingApp.time}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const finalPrice = parseFloat(concludePrice) || concludingApp.price;
                updateAppointmentStatus(
                  concludingApp.id, 
                  'concluido', 
                  finalPrice, 
                  concludeDate, 
                  concludeNotes.trim()
                );
                setConcludingApp(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                  Valor Cobrado / Recebido (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7E706B]">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={concludePrice}
                    onChange={(e) => setConcludePrice(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm font-bold text-emerald-800 rounded-xl border border-[#EFE4DE] bg-white focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <span className="text-[10px] text-[#7E706B] mt-0.5 block">
                  Padrão do serviço: R$ {concludingApp.price} (ajuste se deu desconto ou adicionais)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                  Data do Recebimento
                </label>
                <input
                  type="date"
                  required
                  value={concludeDate}
                  onChange={(e) => setConcludeDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EFE4DE] focus:outline-hidden focus:border-[#8B5A51]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                  Forma de Pagamento / Observações (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pix, Dinheiro, Cartão, + Nail art..."
                  value={concludeNotes}
                  onChange={(e) => setConcludeNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EFE4DE] text-xs text-[#2C201C] focus:outline-hidden focus:border-[#8B5A51]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConcludingApp(null)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-[#EFE4DE] text-[#7E706B] hover:bg-[#FAF6F3]"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar & Lançar no Saldo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Editar Agendamento (Serviço, Data, Horário, Valor, etc.) */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#EFE4DE] relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DE]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#8B5A51] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2C201C]">
                    Editar Agendamento
                  </h3>
                  <p className="text-xs text-[#7E706B]">
                    Ajuste serviço, data, horário ou detalhes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingApp(null)}
                className="p-1.5 rounded-full text-[#7E706B] hover:bg-[#FAF6F3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Informações da Cliente */}
            <div className="bg-[#FAF6F3] p-3.5 rounded-2xl border border-[#EFE4DE]">
              <p className="text-xs font-bold text-[#2C201C]">{editingApp.clientName}</p>
              <p className="text-[11px] text-[#7E706B]">{editingApp.clientPhone}</p>
            </div>

            <form onSubmit={handleSaveEditApp} className="space-y-4">
              
              {/* Seleção de Procedimento/Serviço */}
              <div>
                <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                  Procedimento / Serviço Escolhido
                </label>
                <select
                  value={editProcedureId}
                  onChange={(e) => handleProcedureChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EFE4DE] bg-white text-xs font-semibold text-[#2C201C] focus:outline-hidden focus:border-[#8B5A51]"
                >
                  {procedures.map((proc) => (
                    <option key={proc.id} value={proc.id}>
                      {proc.name} — R$ {proc.price},00 ({proc.durationMinutes} min)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#7E706B] mt-0.5 block">
                  Altere aqui caso a cliente tenha selecionado o serviço errado.
                </span>
              </div>

              {/* Data e Horário */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EFE4DE] focus:outline-hidden focus:border-[#8B5A51]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EFE4DE] focus:outline-hidden focus:border-[#8B5A51]"
                  />
                </div>
              </div>

              {/* Valor e Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                    Valor Cobrado (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#7E706B] font-bold">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs font-bold text-[#2C201C] rounded-xl border border-[#EFE4DE] focus:outline-hidden focus:border-[#8B5A51]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as AppointmentStatus)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EFE4DE] bg-white text-[#2C201C] font-semibold focus:outline-hidden focus:border-[#8B5A51]"
                  >
                    <option value="confirmado">Confirmado</option>
                    <option value="pendente">Pendente</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-semibold text-[#2C201C] mb-1">
                  Observações (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cliente trocou de alongamento para manutenção"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EFE4DE] text-[#2C201C] focus:outline-hidden focus:border-[#8B5A51]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-[#EFE4DE] text-[#7E706B] hover:bg-[#FAF6F3]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
