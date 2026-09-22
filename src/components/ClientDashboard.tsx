import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Phone, 
  CalendarPlus, 
  ShieldCheck, 
  Camera,
  Star,
  MessageSquareHeart,
  X,
  Repeat
} from 'lucide-react';
import { STUDIO_PHONE, openWhatsApp } from '../utils/whatsapp';

interface ClientDashboardProps {
  onOpenBooking: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onOpenBooking }) => {
  const { 
    currentClient, 
    logoutClient, 
    getUpcomingAppointmentForClient, 
    getClientHistory, 
    procedures,
    updateClientAvatar,
    addFeedback,
    feedbacks
  } = useApp();

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  
  // Modal de Avaliação pós-serviço
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppToReview, setSelectedAppToReview] = useState<{ id: string; procName: string } | null>(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!currentClient) return null;

  const upcomingApp = getUpcomingAppointmentForClient(currentClient.id);
  const history = getClientHistory(currentClient.id);

  // Buscar orientações pós-cuidado com base no procedimento agendado ou histórico
  const activeProcName = upcomingApp?.procedureName || history[0]?.procedureName;
  const matchedProcedure = procedures.find(p => p.name.toLowerCase() === activeProcName?.toLowerCase()) || procedures[0];

  // Adicionar ao Google Agenda
  const handleAddToCalendar = () => {
    if (!upcomingApp) return;
    const title = encodeURIComponent(`Studio Raphaely Mengel: ${upcomingApp.procedureName}`);
    const details = encodeURIComponent(`Atendimento estético personalizado com Raphaely Mengel.\nProcedimento: ${upcomingApp.procedureName}`);
    const location = encodeURIComponent('Studio Raphaely Mengel - Aracaju, SE');
    
    // Formato YYYYMMDDTHHMMSS
    const dateFormatted = upcomingApp.date.replace(/-/g, '');
    const timeClean = upcomingApp.time.replace(':', '');
    const startTime = `${dateFormatted}T${timeClean}00`;
    
    const endTime = `${dateFormatted}T${(parseInt(timeClean) + 130).toString().padStart(4, '0')}00`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  // Formatar data em português
  const formatAppDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${day} de ${months[parseInt(month) - 1]}`;
  };

  const handleSelectPresetAvatar = (url: string) => {
    updateClientAvatar(currentClient.id, url);
    setShowAvatarModal(false);
  };

  const handleSaveCustomAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      updateClientAvatar(currentClient.id, customAvatarUrl.trim());
      setCustomAvatarUrl('');
      setShowAvatarModal(false);
    }
  };

  const openReviewModal = (appId: string, procName: string) => {
    setSelectedAppToReview({ id: appId, procName });
    setReviewStars(5);
    setReviewComment('');
    setReviewSuccess(false);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppToReview || !reviewComment.trim()) return;

    addFeedback({
      clientId: currentClient.id,
      clientName: currentClient.name,
      procedureName: selectedAppToReview.procName,
      stars: reviewStars,
      comment: reviewComment.trim(),
      status: 'publicado',
      avatarUrl: currentClient.avatarUrl || '/portfolio/nail-1.jpg',
      city: 'Aracaju'
    });

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewModalOpen(false);
      setReviewSuccess(false);
    }, 1600);
  };

  // Checar se já deixou feedback para determinado serviço
  const clientFeedbacks = feedbacks.filter(f => f.clientId === currentClient.id);

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pb-24">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-[#8B5A51] to-[#673f38] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            {/* Foto de Perfil com Botão de Alterar */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 border-2 border-white/50 flex items-center justify-center text-xl font-serif font-bold text-white shadow-md">
                {currentClient.avatarUrl ? (
                  <img src={currentClient.avatarUrl} alt={currentClient.name} className="w-full h-full object-cover" />
                ) : (
                  currentClient.name[0]
                )}
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                title="Mudar foto de perfil"
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white text-[#8B5A51] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-[#EEDDCC]">
                  Cliente Studio Raphaely Mengel
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Olá, {currentClient.name.split(' ')[0]}! ✨
              </h2>
              <p className="text-xs text-white/80">
                {currentClient.phone}
              </p>
            </div>
          </div>

          <button
            onClick={logoutClient}
            title="Sair do meu espaço"
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CARD 1: Próximo Horário Agendado */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE4DE] shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE4DE]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A51] uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-[#8B5A51]" />
            <span>Seu Próximo Horário</span>
          </div>

          {upcomingApp && (
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              upcomingApp.status === 'confirmado'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {upcomingApp.status === 'confirmado' ? '● Confirmado' : '● Aguardando Aprovação da Rapha'}
            </span>
          )}
        </div>

        {upcomingApp ? (
          <div className="pt-5 space-y-5">
            {upcomingApp.status === 'pendente' && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Solicitação enviada com sucesso!</strong> A Rapha recebeu a notificação e está confirmando seu horário. Assim que aprovado, seu status mudará para confirmado aqui.
                </p>
              </div>
            )}

            <div>
              <span className="text-xs text-[#7E706B] font-medium">Procedimento agendado:</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C] mt-0.5">
                {upcomingApp.procedureName}
              </h3>
            </div>

            {/* Grid com Data, Hora e Local */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-[#8B5A51] flex items-center justify-center shadow-xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#7E706B] uppercase font-bold">Data</p>
                  <p className="text-xs sm:text-sm font-bold text-[#2C201C]">
                    {formatAppDate(upcomingApp.date)}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-[#8B5A51] flex items-center justify-center shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#7E706B] uppercase font-bold">Horário</p>
                  <p className="text-xs sm:text-sm font-bold text-[#8B5A51]">
                    {upcomingApp.time} ({upcomingApp.durationMinutes} min)
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white text-[#8B5A51] flex items-center justify-center shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#7E706B] uppercase font-bold">Local</p>
                  <p className="text-xs sm:text-sm font-bold text-[#2C201C] truncate">
                    Aracaju, SE
                  </p>
                </div>
              </div>
            </div>

            {/* Ações Rápidas da Cliente */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={handleAddToCalendar}
                className="flex-1 min-w-[170px] py-3 px-4 rounded-xl bg-[#FAF6F3] hover:bg-[#EFE4DE] text-[#2C201C] font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-[#EFE4DE]"
              >
                <CalendarPlus className="w-4 h-4 text-[#8B5A51]" />
                <span>Salvar no Calendário</span>
              </button>

              <button
                onClick={() => openWhatsApp(
                  STUDIO_PHONE, 
                  `Olá, Rapha! Sou a ${currentClient.name}. Gostaria de confirmar meu horário agendado de ${upcomingApp.procedureName} no dia ${formatAppDate(upcomingApp.date)} às ${upcomingApp.time}.`
                )}
                className="flex-1 min-w-[170px] py-3 px-4 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Falar com a Rapha</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF6F3] text-[#8B5A51] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#2C201C]">
              Nenhum horário futuro agendado no momento
            </h4>
            <p className="text-xs text-[#7E706B] max-w-sm mx-auto">
              Garanta seu horário com antecedência! As vagas costumam preencher rápido para o próximo mês.
            </p>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-[#8B5A51] text-white text-xs font-semibold shadow-xs hover:bg-[#73433a] transition-colors inline-flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Agendar Agora</span>
            </button>
          </div>
        )}
      </div>

      {/* CARD 2: Mimo de Aniversário & Agendamento de Manutenção a Longo Prazo (Substituiu os Pontos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Mimo de Aniversário */}
        <div className="p-5 rounded-3xl bg-[#FAF6F3] border border-[#E8D1CB] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5A51] text-[#FAF6F3] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Gift className="w-6 h-6 text-[#EEDDCC]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8B5A51] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#C59B67]" />
              Mimo de Aniversário
            </div>
            <h4 className="font-bold text-sm text-[#2C201C]">Seu Mês Especial</h4>
            <p className="text-[11px] text-[#7E706B] mt-0.5">
              Nasc: {currentClient.birthDate.split('-').reverse().join('/')} • Você tem direito a um presente especial de aniversário no Studio!
            </p>
          </div>
        </div>

        {/* Agendamento de Manutenção com 1 Mês de Antecedência */}
        <div className="p-5 rounded-3xl bg-white border border-[#EFE4DE] flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EAE6] text-[#8B5A51] flex items-center justify-center flex-shrink-0">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8B5A51] uppercase tracking-wider">
                Próxima Manutenção
              </span>
              <h4 className="font-bold text-sm text-[#2C201C]">
                Agendar com 1 Mês de Antecedência
              </h4>
            </div>
          </div>
          <p className="text-[11px] text-[#7E706B] mb-3">
            Garanta sua data daqui a 20 a 30 dias para manter o acabamento perfeito sem correr risco de agenda lotada.
          </p>
          <button
            onClick={onOpenBooking}
            className="w-full py-2 px-3 rounded-xl bg-[#8B5A51]/10 hover:bg-[#8B5A51] text-[#8B5A51] hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Escolher Data para o Próximo Mês</span>
          </button>
        </div>

      </div>

      {/* CARD 3: Orientações de Cuidados com as Unhas (Home Care) */}
      {matchedProcedure && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE4DE] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A51] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#8B5A51]" />
            <span>Orientações da Rapha para a Saúde das Unhas</span>
          </div>

          <p className="text-xs text-[#7E706B]">
            Recomendações especiais pós-{matchedProcedure.name}:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedProcedure.postCareTips.map((tip, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE]/70 flex items-start gap-2.5 text-xs text-[#2C201C]">
                <CheckCircle2 className="w-4 h-4 text-[#8B5A51] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARD 4: Histórico & Deixar Feedback do Serviço Concluído */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE4DE] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-xl font-bold text-[#2C201C]">
            Histórico de Atendimentos
          </h4>
          <span className="text-xs text-[#7E706B]">
            {history.length} sessões registradas
          </span>
        </div>

        {history.length > 0 ? (
          <div className="divide-y divide-[#EFE4DE]">
            {history.map((app) => {
              const hasGivenFeedback = clientFeedbacks.some(f => f.procedureName === app.procedureName);

              return (
                <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-bold text-[#2C201C]">{app.procedureName}</h5>
                    <p className="text-xs text-[#7E706B] mt-0.5">
                      {formatAppDate(app.date)} às {app.time} • R$ {app.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      app.status === 'concluido' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-[#FAF6F3] text-[#7E706B] border border-[#EFE4DE]'
                    }`}>
                      {app.status}
                    </span>

                    {/* Botão de Avaliar para Atendimento Concluído */}
                    {app.status === 'concluido' && (
                      <button
                        onClick={() => openReviewModal(app.id, app.procedureName)}
                        className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{hasGivenFeedback ? 'Avaliado' : 'Deixar Avaliação'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#7E706B]">Nenhum histórico anterior registrado.</p>
        )}
      </div>

      {/* MODAL: Escolher Foto de Perfil */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DE]">
              <h3 className="font-serif text-lg font-bold text-[#2C201C]">
                Foto do Perfil
              </h3>
              <button 
                onClick={() => setShowAvatarModal(false)}
                className="p-1 rounded-full text-[#7E706B] hover:bg-[#FAF6F3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#7E706B]">
              Selecione uma foto da galeria do Studio para seu avatar ou cole o link de uma imagem sua:
            </p>

            {/* Grid de 15 Fotos de Unhas do Studio */}
            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: 15 }).map((_, idx) => {
                const url = `/portfolio/nail-${idx + 1}.jpg`;
                const isSelected = currentClient.avatarUrl === url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(url)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative ${
                      isSelected ? 'border-[#8B5A51] ring-2 ring-[#8B5A51]/30 scale-95' : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <img src={url} alt={`Nail ${idx + 1}`} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#8B5A51]/40 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Inserir URL Externa */}
            <form onSubmit={handleSaveCustomAvatar} className="pt-3 border-t border-[#EFE4DE] space-y-2">
              <label className="block text-[11px] font-bold text-[#2C201C] uppercase tracking-wider">
                Ou cole o link de uma foto sua:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#EFE4DE] focus:outline-hidden focus:border-[#8B5A51]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8B5A51] text-white text-xs font-semibold hover:bg-[#73433a] transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Deixar Avaliação do Atendimento */}
      {reviewModalOpen && selectedAppToReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE4DE]">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-[#8B5A51]" />
                <h3 className="font-serif text-lg font-bold text-[#2C201C]">
                  Avaliar Atendimento
                </h3>
              </div>
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="p-1 rounded-full text-[#7E706B] hover:bg-[#FAF6F3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[#2C201C] text-base">Muito obrigado pelo carinho!</h4>
                <p className="text-xs text-[#7E706B]">Seu feedback foi publicado e já aparece no site da Rapha.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <p className="text-xs text-[#7E706B] mb-1">Procedimento:</p>
                  <p className="text-sm font-bold text-[#2C201C]">{selectedAppToReview.procName}</p>
                </div>

                {/* Selecionar Estrelas */}
                <div>
                  <label className="block text-xs font-bold text-[#2C201C] mb-1.5">
                    Como foi sua experiência?
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewStars(star)}
                        className="p-1 text-2xl transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star 
                          className={`w-7 h-7 ${
                            star <= reviewStars 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-neutral-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comentário */}
                <div>
                  <label className="block text-xs font-bold text-[#2C201C] mb-1.5">
                    Seu depoimento:
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Conte como ficaram suas unhas, a durabilidade, o atendimento da Rapha..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#EFE4DE] focus:outline-hidden focus:border-[#8B5A51] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#EFE4DE] text-xs font-semibold text-[#7E706B] hover:bg-[#FAF6F3]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs font-semibold shadow-xs"
                  >
                    Enviar Avaliação
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
