import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Procedure } from '../types';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  User, 
  Phone, 
  AlertCircle,
  BellRing
} from 'lucide-react';

interface BookingModalProps {
  initialProcedure?: Procedure | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ initialProcedure, onClose }) => {
  const { 
    procedures, 
    currentClient, 
    requestOnlineBooking, 
    getAvailableSlotsForDate, 
    isDateSelectable,
    setActiveTab 
  } = useApp();

  const [step, setStep] = useState<'procedure' | 'datetime' | 'client_info' | 'success'>('datetime');
  const [selectedProcId, setSelectedProcId] = useState<string>(
    initialProcedure?.id || procedures[0]?.id || ''
  );
  const [periodTab, setPeriodTab] = useState<'proximos' | 'mes_seguinte' | 'dois_meses' | 'personalizado'>('proximos');

  // Gerar dias com base no período selecionado (suporte a 1 mês ou mais de antecedência)
  const getDaysForPeriod = () => {
    const days = [];
    const base = new Date();
    
    let startOffset = 1;
    let endOffset = 14;

    if (periodTab === 'mes_seguinte') {
      startOffset = 25; // 25 a 45 dias à frente (~1 mês)
      endOffset = 45;
    } else if (periodTab === 'dois_meses') {
      startOffset = 46; // 46 a 75 dias à frente (~2 meses)
      endOffset = 75;
    }

    for (let i = startOffset; i <= endOffset; i++) {
      const d = new Date();
      d.setDate(base.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const check = isDateSelectable(dateStr);
      const reqDuration = procedures.find(p => p.id === selectedProcId)?.durationMinutes || 90;
      const dayAvailability = check.selectable ? getAvailableSlotsForDate(dateStr, reqDuration) : null;
      
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

      days.push({
        dateStr,
        dayOfWeek: dayNames[d.getDay()],
        dayNum: d.getDate().toString().padStart(2, '0'),
        monthName: monthNames[d.getMonth()],
        selectable: check.selectable && (dayAvailability?.available ?? false),
        reason: !check.selectable ? check.reason : (!dayAvailability?.available ? 'Lotado' : undefined),
        slotsCount: dayAvailability?.slots.length || 0
      });
    }
    return days;
  };

  const periodDays = getDaysForPeriod();
  const firstAvailableDay = periodDays.find(d => d.selectable)?.dateStr || periodDays[0]?.dateStr;

  const [selectedDate, setSelectedDate] = useState<string>(firstAvailableDay);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Atualizar data padrão se o período mudar
  const handlePeriodChange = (newPeriod: 'proximos' | 'mes_seguinte' | 'dois_meses' | 'personalizado') => {
    setPeriodTab(newPeriod);
    setSelectedTime('');
    const base = new Date();
    let offset = 1;
    if (newPeriod === 'mes_seguinte') offset = 30;
    if (newPeriod === 'dois_meses') offset = 60;
    base.setDate(base.getDate() + offset);
    setSelectedDate(base.toISOString().split('T')[0]);
  };

  // Dados da Cliente
  const [clientName, setClientName] = useState(currentClient?.name || '');
  const [clientPhone, setClientPhone] = useState(currentClient?.phone || '');
  const [clientBirthDate, setClientBirthDate] = useState(currentClient?.birthDate || '');
  const [notes, setNotes] = useState('');
  const [submittedAppointment, setSubmittedAppointment] = useState<any>(null);

  const selectedProcedure = procedures.find(p => p.id === selectedProcId) || procedures[0];

  // Obter horários disponíveis da data selecionada respeitando a duração do procedimento
  const dayAvailability = getAvailableSlotsForDate(selectedDate, selectedProcedure?.durationMinutes || 90);
  const availableSlots = dayAvailability.slots;

  // Máscara de telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    setClientPhone(v);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProcedure || !selectedDate || !selectedTime) return;

    const res = requestOnlineBooking({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientBirthDate: clientBirthDate.trim(),
      procedureId: selectedProcedure.id,
      date: selectedDate,
      time: selectedTime,
      notes: notes.trim()
    });

    if (res.success) {
      setSubmittedAppointment(res.appointment);
      setStep('success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl border border-[#EFE4DE] relative max-h-[92vh] overflow-y-auto">
        
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#7E706B] hover:text-[#2C201C] hover:bg-[#FAF6F3] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TELA DE SUCESSO */}
        {step === 'success' && submittedAppointment ? (
          <div className="py-4 text-center space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <BellRing className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Solicitação Enviada com Sucesso!
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C] mt-2">
                Horário Pré-Agendado! ✨
              </h3>
              <p className="text-xs sm:text-sm text-[#7E706B] mt-1 max-w-sm mx-auto leading-relaxed">
                A Rapha já recebeu uma notificação no painel do Studio para aceitar o seu horário. Você não precisa se preocupar em ficar mandando mensagens!
              </p>
            </div>

            {/* Resumo da Marcação */}
            <div className="bg-[#FAF6F3] rounded-2xl p-4 border border-[#EFE4DE] text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7E706B]">Procedimento:</span>
                <span className="font-bold text-[#2C201C]">{submittedAppointment.procedureName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E706B]">Data & Horário:</span>
                <span className="font-bold text-[#8B5A51]">
                  {submittedAppointment.date.split('-').reverse().join('/')} às {submittedAppointment.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E706B]">Cliente:</span>
                <span className="font-semibold text-[#2C201C]">{submittedAppointment.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E706B]">Status:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                  Aguardando Confirmação da Rapha
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('cliente');
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#8B5A51] hover:bg-[#73433a] text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
              >
                Acompanhar no Meu Painel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cabeçalho */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#F4EAE6] text-[#8B5A51] flex items-center justify-center mx-auto mb-2.5">
                <CalendarIcon className="w-6 h-6 text-[#8B5A51]" />
              </div>
              <span className="text-[10px] font-bold text-[#8B5A51] uppercase tracking-widest">
                Agendamento Online Inteligente
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C201C] mt-0.5">
                Escolha seu Horário
              </h3>
              <p className="text-xs text-[#7E706B] mt-1">
                Sem esperar no WhatsApp: escolha a data e o horário disponível em tempo real!
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-5">
              
              {/* Seleção do Procedimento */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E706B] mb-1.5">
                  1. Procedimento Desejado
                </label>
                <select
                  value={selectedProcId}
                  onChange={(e) => setSelectedProcId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EFE4DE] bg-[#FAF6F3]/60 focus:outline-none focus:ring-2 focus:ring-[#8B5A51] text-xs sm:text-sm text-[#2C201C] font-semibold"
                >
                  {procedures.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — R$ {p.price},00 ({p.durationMinutes} min)
                    </option>
                  ))}
                </select>
                {selectedProcedure?.includesInfo && (
                  <p className="text-[11px] text-[#8B5A51] font-medium mt-1">
                    ✨ {selectedProcedure.includesInfo}
                  </p>
                )}
              </div>

              {/* Seleção da Data com Abas de Antecedência (1 mês ou mais) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E706B]">
                    2. Escolha o Dia de Atendimento
                  </label>
                  <span className="text-[10px] text-[#8B5A51] font-semibold">
                    ⭐ Agende com até 2 meses de antecedência
                  </span>
                </div>

                {/* Abas de Período */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FAF6F3] rounded-2xl border border-[#EFE4DE] mb-3">
                  <button
                    type="button"
                    onClick={() => handlePeriodChange('proximos')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-colors ${
                      periodTab === 'proximos'
                        ? 'bg-[#8B5A51] text-white shadow-xs'
                        : 'text-[#7E706B] hover:text-[#2C201C]'
                    }`}
                  >
                    Próximos Dias
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePeriodChange('mes_seguinte')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-colors ${
                      periodTab === 'mes_seguinte'
                        ? 'bg-[#8B5A51] text-white shadow-xs'
                        : 'text-[#7E706B] hover:text-[#2C201C]'
                    }`}
                  >
                    Próximo Mês (+30d)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePeriodChange('dois_meses')}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-colors ${
                      periodTab === 'dois_meses'
                        ? 'bg-[#8B5A51] text-white shadow-xs'
                        : 'text-[#7E706B] hover:text-[#2C201C]'
                    }`}
                  >
                    +2 Meses (+60d)
                  </button>
                </div>

                {/* Carrossel de Dias */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {periodDays.map((d) => {
                    const isSelected = selectedDate === d.dateStr;
                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        disabled={!d.selectable}
                        onClick={() => {
                          setSelectedDate(d.dateStr);
                          setSelectedTime(''); // reseta horário ao trocar dia
                        }}
                        className={`flex-shrink-0 w-18 py-3 px-1 rounded-2xl flex flex-col items-center justify-center border transition-all text-center ${
                          isSelected
                            ? 'bg-[#8B5A51] text-white border-[#8B5A51] shadow-md scale-105'
                            : d.selectable
                            ? 'bg-[#FAF6F3] text-[#2C201C] border-[#EFE4DE] hover:border-[#8B5A51]'
                            : 'bg-zinc-100 text-zinc-400 border-zinc-200 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-[#EEDDCC]' : 'text-[#7E706B]'}`}>
                          {d.dayOfWeek}
                        </span>
                        <span className="font-serif text-xl font-bold my-0.5">
                          {d.dayNum}
                        </span>
                        <span className="text-[9px] font-medium">
                          {d.monthName}
                        </span>

                        {!d.selectable && (
                          <span className="text-[8px] font-bold uppercase text-zinc-500 mt-1">
                            {d.reason?.includes('Não há') ? 'Fechado' : d.reason?.includes('recesso') ? 'Férias' : 'Lotado'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Ou escolha data manual */}
                <div className="mt-2 flex items-center justify-between text-xs text-[#7E706B]">
                  <span>Ou escolha outra data no calendário:</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(e.target.value);
                        setSelectedTime('');
                      }
                    }}
                    className="px-2.5 py-1 text-xs border border-[#EFE4DE] rounded-lg bg-white focus:outline-hidden focus:border-[#8B5A51]"
                  />
                </div>
              </div>

              {/* Seleção do Horário */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E706B] mb-2">
                  3. Escolha o Horário Disponível
                </label>

                {dayAvailability.available && availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-[#8B5A51] text-white border-[#8B5A51] shadow-sm ring-2 ring-[#8B5A51]/30'
                              : 'bg-white text-[#2C201C] border-[#EFE4DE] hover:border-[#8B5A51] hover:bg-[#FAF6F3]'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center">
                    <p className="font-semibold">Nenhum horário disponível para esta data.</p>
                    <p className="text-[11px] mt-0.5">
                      {dayAvailability.reason || 'Por favor, selecione outro dia no calendário acima.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Dados da Cliente */}
              <div className="pt-2 border-t border-[#EFE4DE] space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7E706B]">
                  4. Seus Dados para Confirmação
                </label>

                <div>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Seu Nome Completo"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-xs sm:text-sm text-[#2C201C] focus:outline-none focus:ring-1 focus:ring-[#8B5A51]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={handlePhoneChange}
                    placeholder="WhatsApp (79) 99999-9999"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-xs sm:text-sm text-[#2C201C] focus:outline-none focus:ring-1 focus:ring-[#8B5A51]"
                  />

                  <input
                    type="date"
                    required
                    value={clientBirthDate}
                    onChange={(e) => setClientBirthDate(e.target.value)}
                    title="Data de Nascimento (para seu login sem senha e mimos)"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-xs sm:text-sm text-[#2C201C] focus:outline-none focus:ring-1 focus:ring-[#8B5A51]"
                  />
                </div>
              </div>

              {/* Botão de Envio */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!selectedTime}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    selectedTime
                      ? 'bg-[#8B5A51] hover:bg-[#73433a] text-white transform active:scale-95'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {selectedTime 
                      ? `Solicitar Agendamento (${selectedDate.split('-').reverse().join('/')} às ${selectedTime})`
                      : 'Selecione um horário para continuar'}
                  </span>
                </button>
                <p className="text-[11px] text-center text-[#7E706B] mt-2">
                  A Rapha receberá sua solicitação imediatamente no painel para aprovação.
                </p>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
};
