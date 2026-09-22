import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Sun, 
  Sunset, 
  Palmtree, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const AdminScheduleSettings: React.FC = () => {
  const { 
    scheduleSettings, 
    toggleWorkingDay, 
    addVacationPeriod, 
    removeVacationPeriod, 
    toggleBlockedDate, 
    addBlockedShift, 
    removeBlockedShift, 
    addBlockedSlot, 
    removeBlockedSlot,
    updateDefaultSlots 
  } = useApp();

  // Estados dos modais/formulários
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [vacStart, setVacStart] = useState('');
  const [vacEnd, setVacEnd] = useState('');
  const [vacLabel, setVacLabel] = useState('');

  // Bloqueio de turno
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [shiftType, setShiftType] = useState<'manha' | 'tarde'>('manha');
  const [shiftReason, setShiftReason] = useState('');

  // Bloqueio de horário individual
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotDate, setSlotDate] = useState(new Date().toISOString().split('T')[0]);
  const [slotTime, setSlotTime] = useState('14:00');
  const [slotReason, setSlotReason] = useState('');

  // Bloqueio de dia avulso
  const [blockDateInput, setBlockDateInput] = useState('');

  const daysOfWeek = [
    { index: 0, label: 'Domingo' },
    { index: 1, label: 'Segunda' },
    { index: 2, label: 'Terça' },
    { index: 3, label: 'Quarta' },
    { index: 4, label: 'Quinta' },
    { index: 5, label: 'Sexta' },
    { index: 6, label: 'Sábado' }
  ];

  const handleAddVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacStart || !vacEnd || !vacLabel) return;
    addVacationPeriod({
      startDate: vacStart,
      endDate: vacEnd,
      label: vacLabel.trim()
    });
    setShowVacationModal(false);
    setVacStart('');
    setVacEnd('');
    setVacLabel('');
  };

  const handleAddShiftBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftDate) return;
    addBlockedShift({
      date: shiftDate,
      shift: shiftType,
      reason: shiftReason.trim() || 'Indisponibilidade pessoal'
    });
    setShowShiftModal(false);
    setShiftReason('');
  };

  const handleAddSlotBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotDate || !slotTime) return;
    addBlockedSlot({
      date: slotDate,
      time: slotTime,
      reason: slotReason.trim() || 'Horário reservado'
    });
    setShowSlotModal(false);
    setSlotReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner de Explicação */}
      <div className="bg-gradient-to-r from-[#FAF6F3] via-white to-[#F4EAE6] p-6 rounded-3xl border border-[#E8D1CB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B5A51] uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#C59B67]" />
            Autonomia Total de Agenda
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#2C201C] mt-0.5">
            Controle de Disponibilidade, Férias & Bloqueios
          </h3>
          <p className="text-xs text-[#7E706B] mt-1">
            Defina os dias em que atende, programe férias e bloqueie horários ou turnos para o site não liberar vagas nesses momentos.
          </p>
        </div>
      </div>

      {/* SEÇÃO 1: Dias da Semana que Atende */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-xl font-bold text-[#2C201C]">
              1. Dias da Semana de Atendimento
            </h4>
            <p className="text-xs text-[#7E706B]">
              Selecione os dias em que o Studio fica aberto. Dias desmarcados ficam automaticamente fechados para agendamento.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
          {daysOfWeek.map(d => {
            const isActive = scheduleSettings.workingDays.includes(d.index);
            return (
              <button
                key={d.index}
                type="button"
                onClick={() => toggleWorkingDay(d.index)}
                className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-[#8B5A51] text-white border-[#8B5A51] shadow-xs'
                    : 'bg-[#FAF6F3] text-zinc-400 border-[#EFE4DE] hover:border-zinc-300'
                }`}
              >
                <span className="text-xs font-bold">{d.label}</span>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-[#EEDDCC]' : 'bg-zinc-200 text-zinc-500'
                }`}>
                  {isActive ? 'Atende' : 'Folga'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 2: Períodos de Férias & Recessos */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Palmtree className="w-5 h-5 text-[#8B5A51]" />
              <h4 className="font-serif text-xl font-bold text-[#2C201C]">
                2. Férias & Recessos Programados
              </h4>
            </div>
            <p className="text-xs text-[#7E706B] mt-0.5">
              Defina um intervalo de datas para fechar a agenda inteira (ex: férias, viagens, reformas).
            </p>
          </div>

          <button
            onClick={() => setShowVacationModal(true)}
            className="px-4 py-2 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Férias</span>
          </button>
        </div>

        {scheduleSettings.vacationPeriods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {scheduleSettings.vacationPeriods.map(vac => (
              <div
                key={vac.id}
                className="p-4 rounded-2xl bg-[#FAF6F3] border border-[#E8D1CB] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#2C201C]">{vac.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5A51] text-white">
                      Férias Ativas
                    </span>
                  </div>
                  <p className="text-xs text-[#8B5A51] font-semibold mt-1">
                    🗓 De {vac.startDate.split('-').reverse().join('/')} até {vac.endDate.split('-').reverse().join('/')}
                  </p>
                </div>

                <button
                  onClick={() => removeVacationPeriod(vac.id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remover período de férias"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#7E706B] italic pt-2">
            Nenhum recesso ou período de férias programado no momento.
          </p>
        )}
      </div>

      {/* SEÇÃO 3: Bloqueio de Turnos (Manhã / Tarde) & Horários Específicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bloqueio de Turnos */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#2C201C]">
                3. Bloquear Turno (Manhã / Tarde)
              </h4>
              <p className="text-xs text-[#7E706B]">
                Bloqueie um turno inteiro em uma data específica.
              </p>
            </div>
            <button
              onClick={() => setShowShiftModal(true)}
              className="p-2 rounded-xl bg-[#FAF6F3] text-[#8B5A51] hover:bg-[#8B5A51] hover:text-white transition-colors"
              title="Adicionar bloqueio de turno"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {scheduleSettings.blockedShifts.length > 0 ? (
            <div className="space-y-2">
              {scheduleSettings.blockedShifts.map(s => (
                <div key={s.id} className="p-3 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2C201C]">
                        {s.date.split('-').reverse().join('/')}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {s.shift === 'manha' ? 'Turno Manhã' : 'Turno Tarde'}
                      </span>
                    </div>
                    {s.reason && <p className="text-[11px] text-[#7E706B] mt-0.5">{s.reason}</p>}
                  </div>
                  <button
                    onClick={() => removeBlockedShift(s.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7E706B] italic">Nenhum turno bloqueado.</p>
          )}
        </div>

        {/* Bloqueio de Horários Individuais */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#2C201C]">
                4. Bloquear Horário Específico
              </h4>
              <p className="text-xs text-[#7E706B]">
                Tire um horário isolado da disponibilidade.
              </p>
            </div>
            <button
              onClick={() => setShowSlotModal(true)}
              className="p-2 rounded-xl bg-[#FAF6F3] text-[#8B5A51] hover:bg-[#8B5A51] hover:text-white transition-colors"
              title="Bloquear horário"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {scheduleSettings.blockedSlots.length > 0 ? (
            <div className="space-y-2">
              {scheduleSettings.blockedSlots.map(slot => (
                <div key={slot.id} className="p-3 rounded-2xl bg-[#FAF6F3] border border-[#EFE4DE] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2C201C]">
                        {slot.date.split('-').reverse().join('/')} às {slot.time}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        Bloqueado
                      </span>
                    </div>
                    {slot.reason && <p className="text-[11px] text-[#7E706B] mt-0.5">{slot.reason}</p>}
                  </div>
                  <button
                    onClick={() => removeBlockedSlot(slot.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7E706B] italic">Nenhum horário isolado bloqueado.</p>
          )}
        </div>

      </div>

      {/* SEÇÃO 4: Bloqueio Rápido de Data Avulsa */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE4DE] shadow-xs space-y-4">
        <h4 className="font-serif text-xl font-bold text-[#2C201C]">
          5. Bloquear Data Avulsa (Dia Inteiro)
        </h4>
        <p className="text-xs text-[#7E706B]">
          Feche a agenda de um dia inteiro específico com facilidade.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={blockDateInput}
            onChange={(e) => setBlockDateInput(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#EFE4DE] text-xs text-[#2C201C]"
          />
          <button
            onClick={() => {
              if (!blockDateInput) return;
              toggleBlockedDate(blockDateInput);
              setBlockDateInput('');
            }}
            className="px-4 py-2 rounded-xl bg-[#8B5A51] hover:bg-[#73433a] text-white text-xs font-semibold"
          >
            Bloquear / Liberar Data
          </button>
        </div>

        {scheduleSettings.blockedDates.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {scheduleSettings.blockedDates.map(d => (
              <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                <span>{d.split('-').reverse().join('/')} (Fechado)</span>
                <button onClick={() => toggleBlockedDate(d)}>
                  <X className="w-3.5 h-3.5 hover:scale-110" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FÉRIAS */}
      {showVacationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EFE4DE] relative">
            <button onClick={() => setShowVacationModal(false)} className="absolute top-5 right-5 p-2 text-[#7E706B]">
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-serif text-2xl font-bold text-[#2C201C] mb-4">
              Programar Férias / Recesso
            </h4>

            <form onSubmit={handleAddVacation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                  Nome / Descrição
                </label>
                <input
                  type="text"
                  required
                  value={vacLabel}
                  onChange={(e) => setVacLabel(e.target.value)}
                  placeholder="Ex: Férias de Outubro / Viagem"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DE] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                    Data Início
                  </label>
                  <input
                    type="date"
                    required
                    value={vacStart}
                    onChange={(e) => setVacStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EFE4DE] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">
                    Data Término
                  </label>
                  <input
                    type="date"
                    required
                    value={vacEnd}
                    onChange={(e) => setVacEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EFE4DE] text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVacationModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#FAF6F3] text-xs font-semibold text-[#7E706B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#8B5A51] text-white text-xs font-semibold shadow-xs"
                >
                  Salvar Férias
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TURNO */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#EFE4DE] relative">
            <button onClick={() => setShowShiftModal(false)} className="absolute top-5 right-5 p-2 text-[#7E706B]">
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-serif text-xl font-bold text-[#2C201C] mb-4">
              Bloquear Turno
            </h4>
            <form onSubmit={handleAddShiftBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">Data</label>
                <input
                  type="date"
                  required
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE4DE] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">Turno</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShiftType('manha')}
                    className={`py-2 rounded-xl border text-xs font-bold ${shiftType === 'manha' ? 'bg-[#8B5A51] text-white' : 'bg-[#FAF6F3]'}`}
                  >
                    Manhã
                  </button>
                  <button
                    type="button"
                    onClick={() => setShiftType('tarde')}
                    className={`py-2 rounded-xl border text-xs font-bold ${shiftType === 'tarde' ? 'bg-[#8B5A51] text-white' : 'bg-[#FAF6F3]'}`}
                  >
                    Tarde
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">Motivo (Opcional)</label>
                <input
                  type="text"
                  value={shiftReason}
                  onChange={(e) => setShiftReason(e.target.value)}
                  placeholder="Ex: Consulta médica"
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE4DE] text-xs"
                />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#8B5A51] text-white text-xs font-bold">
                Confirmar Bloqueio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HORÁRIO INDIVIDUAL */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#EFE4DE] relative">
            <button onClick={() => setShowSlotModal(false)} className="absolute top-5 right-5 p-2 text-[#7E706B]">
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-serif text-xl font-bold text-[#2C201C] mb-4">
              Bloquear Horário Específico
            </h4>
            <form onSubmit={handleAddSlotBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">Data</label>
                <input
                  type="date"
                  required
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE4DE] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">Horário</label>
                <select
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE4DE] text-xs"
                >
                  {scheduleSettings.defaultSlots.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#7E706B] mb-1">Motivo (Opcional)</label>
                <input
                  type="text"
                  value={slotReason}
                  onChange={(e) => setSlotReason(e.target.value)}
                  placeholder="Ex: Encaixe presencial"
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE4DE] text-xs"
                />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#8B5A51] text-white text-xs font-bold">
                Bloquear Horário
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
