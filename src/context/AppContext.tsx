import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Client, 
  Appointment, 
  Procedure, 
  Testimonial, 
  PortfolioItem, 
  MainTab,
  AppointmentStatus,
  ScheduleSettings,
  VacationPeriod,
  BlockedShift,
  BlockedSlot,
  Transaction,
  Feedback
} from '../types';
import { 
  initialClients, 
  initialAppointments, 
  initialProcedures, 
  initialTestimonials, 
  initialRealPortfolio,
  initialScheduleSettings,
  initialTransactions,
  initialFeedbacks
} from '../data/initialData';

interface BirthdayAlert {
  client: Client;
  daysUntil: number;
  formattedDate: string;
  isToday: boolean;
}

interface RetentionAlert {
  client: Client;
  daysSinceLastVisit: number;
  lastVisitFormatted: string;
  lastProcedure: string;
}

export interface DayAvailability {
  available: boolean;
  reason?: string;
  slots: string[];
}

interface AppContextType {
  clients: Client[];
  appointments: Appointment[];
  procedures: Procedure[];
  testimonials: Testimonial[];
  realPortfolio: PortfolioItem[];
  scheduleSettings: ScheduleSettings;
  transactions: Transaction[];
  feedbacks: Feedback[];
  currentClient: Client | null;
  isAdminLoggedIn: boolean;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  loginClient: (phone: string, birthDate: string) => { success: boolean; message?: string };
  loginAsDemoClient: (clientId?: string) => void;
  logoutClient: () => void;
  toggleAdminLogin: (login?: boolean) => void;
  addClient: (client: Omit<Client, 'id'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  updateClientAvatar: (clientId: string, avatarUrl: string) => void;
  requestOnlineBooking: (bookingData: {
    clientName: string;
    clientPhone: string;
    clientBirthDate?: string;
    procedureId: string;
    date: string;
    time: string;
    notes?: string;
  }) => { success: boolean; appointment: Appointment };
  approveAppointment: (id: string) => void;
  rejectAppointment: (id: string, reason?: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  markReminderSent: (id: string) => void;
  getUpcomingAppointmentForClient: (clientId: string) => Appointment | null;
  getClientHistory: (clientId: string) => Appointment[];
  getAvailableSlotsForDate: (dateStr: string, procedureDurationMinutes?: number) => DayAvailability;
  isDateSelectable: (dateStr: string) => { selectable: boolean; reason?: string };
  markThankYouSent: (appointmentId: string) => void;
  // Financial Transactions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Transaction;
  deleteTransaction: (id: string) => void;
  // Feedbacks
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => Feedback;
  updateFeedbackStatus: (id: string, status: 'publicado' | 'pendente' | 'oculto') => void;
  // Schedule Settings Mutators
  toggleWorkingDay: (dayIndex: number) => void;
  addVacationPeriod: (vacation: Omit<VacationPeriod, 'id'>) => void;
  removeVacationPeriod: (id: string) => void;
  toggleBlockedDate: (dateStr: string) => void;
  addBlockedShift: (shift: Omit<BlockedShift, 'id'>) => void;
  removeBlockedShift: (id: string) => void;
  addBlockedSlot: (slot: Omit<BlockedSlot, 'id'>) => void;
  removeBlockedSlot: (id: string) => void;
  updateDefaultSlots: (slots: string[]) => void;
  // Alerts & Lists
  pendingAppointments: Appointment[];
  birthdayAlerts: BirthdayAlert[];
  retentionAlerts: RetentionAlert[];
  newClients: Client[];
  resetDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const STORAGE_KEY_PREFIX = 'rapha_prod_clean_v1';

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_clients`);
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_appointments`);
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [procedures, setProcedures] = useState<Procedure[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_procedures`);
    return saved ? JSON.parse(saved) : initialProcedures;
  });

  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_schedule_settings`);
    return saved ? JSON.parse(saved) : initialScheduleSettings;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_transactions`);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_feedbacks`);
    return saved ? JSON.parse(saved) : initialFeedbacks;
  });

  const [currentClient, setCurrentClient] = useState<Client | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_current_client`);
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_is_admin`);
    return saved ? JSON.parse(saved) : false;
  });

  const [activeTab, setActiveTab] = useState<MainTab>('portfolio');

  // Sincronizar com localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_clients`, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_procedures`, JSON.stringify(procedures));
  }, [procedures]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_schedule_settings`, JSON.stringify(scheduleSettings));
  }, [scheduleSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_feedbacks`, JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    if (currentClient) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_current_client`, JSON.stringify(currentClient));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}_current_client`);
    }
  }, [currentClient]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_is_admin`, JSON.stringify(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  // Login da cliente por Telefone + Data de Nascimento
  const loginClient = (phoneInput: string, birthDateInput: string) => {
    const cleanInputPhone = phoneInput.replace(/\D/g, '');
    let normalizedBirth = birthDateInput.trim();
    if (normalizedBirth.includes('/')) {
      const parts = normalizedBirth.split('/');
      if (parts.length === 3) {
        normalizedBirth = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    const found = clients.find(c => {
      const cPhone = c.phone.replace(/\D/g, '');
      const phoneMatches = cPhone.endsWith(cleanInputPhone.slice(-8)) || cleanInputPhone.endsWith(cPhone.slice(-8));
      const birthMatches = c.birthDate === normalizedBirth;
      return phoneMatches && birthMatches;
    });

    if (found) {
      setCurrentClient(found);
      setActiveTab('cliente');
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Telefone ou data de nascimento não encontrados. Verifique seus dados ou agende uma nova sessão.' 
    };
  };

  const loginAsDemoClient = (clientId: string = 'cli-1') => {
    const demo = clients.find(c => c.id === clientId) || clients[0];
    if (demo) {
      setCurrentClient(demo);
      setActiveTab('cliente');
    }
  };

  const logoutClient = () => {
    setCurrentClient(null);
    if (activeTab === 'cliente') {
      setActiveTab('portfolio');
    }
  };

  const toggleAdminLogin = (status?: boolean) => {
    const nextStatus = status !== undefined ? status : !isAdminLoggedIn;
    setIsAdminLoggedIn(nextStatus);
    if (nextStatus) {
      setActiveTab('rapha');
    }
  };

  const addClient = (newClientData: Omit<Client, 'id'>): Client => {
    const newClient: Client = {
      ...newClientData,
      id: `cli-${Date.now()}`
    };
    setClients(prev => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    if (currentClient && currentClient.id === id) {
      setCurrentClient(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const updateClientAvatar = (clientId: string, avatarUrl: string) => {
    updateClient(clientId, { avatarUrl });
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>): Transaction => {
    const newTx: Transaction = {
      ...transactionData,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt'>): Feedback => {
    const newFb: Feedback = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setFeedbacks(prev => [newFb, ...prev]);
    return newFb;
  };

  const updateFeedbackStatus = (id: string, status: 'publicado' | 'pendente' | 'oculto') => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  // Motor de Verificação de Disponibilidade de Datas
  const isDateSelectable = (dateStr: string): { selectable: boolean; reason?: string } => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0 = Domingo, 1 = Segunda, etc.

    // 1. Dia da semana que a Rapha não atende
    if (!scheduleSettings.workingDays.includes(dayOfWeek)) {
      const dayNames = ['Domingos', 'Segundas-feiras', 'Terças-feiras', 'Quartas-feiras', 'Quintas-feiras', 'Sextas-feiras', 'Sábados'];
      return { selectable: false, reason: `Não há atendimento aos ${dayNames[dayOfWeek]}` };
    }

    // 2. Férias / Recesso
    for (const vac of scheduleSettings.vacationPeriods) {
      if (dateStr >= vac.startDate && dateStr <= vac.endDate) {
        return { selectable: false, reason: `Período de recesso/férias: ${vac.label}` };
      }
    }

    // 3. Dia avulso bloqueado
    if (scheduleSettings.blockedDates.includes(dateStr)) {
      return { selectable: false, reason: 'Agenda fechada nesta data' };
    }

    return { selectable: true };
  };

  // Conversão de horário HH:mm para minutos desde a meia-noite
  const timeStringToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // Motor Inteligente de Cálculo de Horários Livres (Elimina sobreposições com base na duração real)
  const getAvailableSlotsForDate = (dateStr: string, procedureDurationMinutes: number = 90): DayAvailability => {
    const dateCheck = isDateSelectable(dateStr);
    if (!dateCheck.selectable) {
      return {
        available: false,
        reason: dateCheck.reason,
        slots: []
      };
    }

    // Base de horários padrão
    let candidateSlots = [...scheduleSettings.defaultSlots];

    // Verificar bloqueios de turnos nesta data
    const blockedShiftToday = scheduleSettings.blockedShifts.find(bs => bs.date === dateStr);
    if (blockedShiftToday) {
      if (blockedShiftToday.shift === 'manha') {
        // Manhã bloqueada: remove horários antes de 12:30
        candidateSlots = candidateSlots.filter(t => parseInt(t.replace(':', ''), 10) >= 1230);
      } else if (blockedShiftToday.shift === 'tarde') {
        // Tarde bloqueada: remove horários após 12:30
        candidateSlots = candidateSlots.filter(t => parseInt(t.replace(':', ''), 10) < 1230);
      }
    }

    // Remover horários individuais bloqueados pela Rapha nesta data
    const blockedSlotsToday = scheduleSettings.blockedSlots
      .filter(bs => bs.date === dateStr)
      .map(bs => bs.time);
    candidateSlots = candidateSlots.filter(t => !blockedSlotsToday.includes(t));

    // Motor Inteligente de Agendamento:
    // Analisa todos os agendamentos confirmados e pendentes do dia com suas durações reais.
    // Ex: Alongamento às 14:00 com duração de 120min ocupa das 14:00 até as 16:00.
    const activeAppointments = appointments
      .filter(a => a.date === dateStr && (a.status === 'confirmado' || a.status === 'pendente'))
      .map(a => {
        const startMin = timeStringToMinutes(a.time);
        const duration = a.durationMinutes || 90;
        return {
          startMin,
          endMin: startMin + duration,
          time: a.time,
          duration,
          procedureName: a.procedureName
        };
      });

    // Filtra os horários candidatos garantindo que:
    // 1) O novo atendimento não comece dentro de um atendimento existente.
    // 2) A duração do novo procedimento não colida com outro atendimento já agendado.
    candidateSlots = candidateSlots.filter(slot => {
      const slotStart = timeStringToMinutes(slot);
      const slotEnd = slotStart + procedureDurationMinutes;

      // O horário candidato inicia durante um atendimento existente?
      const startsDuringApp = activeAppointments.some(
        app => slotStart >= app.startMin && slotStart < app.endMin
      );
      if (startsDuringApp) return false;

      // O intervalo do novo atendimento colide com algum atendimento existente?
      const overlapsExisting = activeAppointments.some(
        app => slotStart < app.endMin && slotEnd > app.startMin
      );
      if (overlapsExisting) return false;

      return true;
    });

    if (candidateSlots.length === 0) {
      return {
        available: false,
        reason: 'Todos os horários deste dia já foram preenchidos ou não comportam o tempo do procedimento.',
        slots: []
      };
    }

    return {
      available: true,
      slots: candidateSlots
    };
  };

  // Solicitação de Agendamento Online Direto (Entra como PENDENTE para a Rapha aceitar)
  const requestOnlineBooking = (bookingData: {
    clientName: string;
    clientPhone: string;
    clientBirthDate?: string;
    procedureId: string;
    date: string;
    time: string;
    notes?: string;
  }): { success: boolean; appointment: Appointment } => {
    const selectedProc = procedures.find(p => p.id === bookingData.procedureId) || procedures[0];

    // Verificar se já existe ou cadastra cliente
    let clientMatch = clients.find(c => {
      const cPhone = c.phone.replace(/\D/g, '');
      const inputPhone = bookingData.clientPhone.replace(/\D/g, '');
      return cPhone.endsWith(inputPhone.slice(-8));
    });

    if (!clientMatch) {
      clientMatch = addClient({
        name: bookingData.clientName,
        phone: bookingData.clientPhone,
        birthDate: bookingData.clientBirthDate || '1995-01-01',
        firstVisitDate: bookingData.date,
        lastVisitDate: bookingData.date,
        source: 'trafego_pago',
        isNewClient: true,
        favoriteProcedures: [selectedProc.name],
        avatarUrl: '/portfolio/nail-1.jpg',
        totalAppointments: 0,
        totalSpent: 0
      });
    }

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      clientId: clientMatch.id,
      clientName: bookingData.clientName,
      clientPhone: bookingData.clientPhone,
      clientBirthDate: bookingData.clientBirthDate,
      procedureId: selectedProc.id,
      procedureName: selectedProc.name,
      date: bookingData.date,
      time: bookingData.time,
      durationMinutes: selectedProc.durationMinutes,
      price: selectedProc.price,
      status: 'pendente', // Aguarda aprovação da Rapha no painel!
      notes: bookingData.notes || 'Solicitado online pelo site',
      reminderSent: false,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newApp, ...prev]);

    // Logar automaticamente a cliente se não estiver logada
    if (!currentClient) {
      setCurrentClient(clientMatch);
    }

    return { success: true, appointment: newApp };
  };

  const addAppointment = (newAppData: Omit<Appointment, 'id'>): Appointment => {
    const newApp: Appointment = {
      ...newAppData,
      id: `app-${Date.now()}`
    };
    setAppointments(prev => [newApp, ...prev]);
    return newApp;
  };

  // Rapha Aprova Agendamento
  const approveAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'confirmado',
          approvedAt: new Date().toISOString()
        };
      }
      return a;
    }));
  };

  // Rapha Recusa Agendamento
  const rejectAppointment = (id: string, reason?: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'cancelado',
          notes: reason ? `${a.notes || ''} (Recusado: ${reason})` : a.notes
        };
      }
      return a;
    }));
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const markReminderSent = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, reminderSent: true } : a));
  };

  const markThankYouSent = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, thankYouSent: true } : a));
  };

  const getUpcomingAppointmentForClient = (clientId: string): Appointment | null => {
    const clientApps = appointments
      .filter(a => a.clientId === clientId && (a.status === 'confirmado' || a.status === 'pendente'))
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    return clientApps[0] || null;
  };

  const getClientHistory = (clientId: string): Appointment[] => {
    return appointments
      .filter(a => a.clientId === clientId)
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  };

  // Funções de Gestão de Agenda da Rapha
  const toggleWorkingDay = (dayIndex: number) => {
    setScheduleSettings(prev => {
      const isWorking = prev.workingDays.includes(dayIndex);
      const nextDays = isWorking 
        ? prev.workingDays.filter(d => d !== dayIndex)
        : [...prev.workingDays, dayIndex].sort();
      return { ...prev, workingDays: nextDays };
    });
  };

  const addVacationPeriod = (vacation: Omit<VacationPeriod, 'id'>) => {
    const newVac: VacationPeriod = { ...vacation, id: `vac-${Date.now()}` };
    setScheduleSettings(prev => ({
      ...prev,
      vacationPeriods: [...prev.vacationPeriods, newVac]
    }));
  };

  const removeVacationPeriod = (id: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      vacationPeriods: prev.vacationPeriods.filter(v => v.id !== id)
    }));
  };

  const toggleBlockedDate = (dateStr: string) => {
    setScheduleSettings(prev => {
      const isBlocked = prev.blockedDates.includes(dateStr);
      const nextDates = isBlocked 
        ? prev.blockedDates.filter(d => d !== dateStr)
        : [...prev.blockedDates, dateStr];
      return { ...prev, blockedDates: nextDates };
    });
  };

  const addBlockedShift = (shift: Omit<BlockedShift, 'id'>) => {
    const newShift: BlockedShift = { ...shift, id: `shift-${Date.now()}` };
    setScheduleSettings(prev => ({
      ...prev,
      blockedShifts: [...prev.blockedShifts, newShift]
    }));
  };

  const removeBlockedShift = (id: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      blockedShifts: prev.blockedShifts.filter(s => s.id !== id)
    }));
  };

  const addBlockedSlot = (slot: Omit<BlockedSlot, 'id'>) => {
    const newSlot: BlockedSlot = { ...slot, id: `slot-${Date.now()}` };
    setScheduleSettings(prev => ({
      ...prev,
      blockedSlots: [...prev.blockedSlots, newSlot]
    }));
  };

  const removeBlockedSlot = (id: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      blockedSlots: prev.blockedSlots.filter(s => s.id !== id)
    }));
  };

  const updateDefaultSlots = (slots: string[]) => {
    setScheduleSettings(prev => ({ ...prev, defaultSlots: slots }));
  };

  // Solicitações que necessitam de aprovação da Rapha
  const pendingAppointments = appointments.filter(a => a.status === 'pendente');

  // Alertas de Aniversariantes
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const birthdayAlerts: BirthdayAlert[] = clients
    .map(client => {
      if (!client.birthDate) return null;
      const parts = client.birthDate.split('-');
      if (parts.length < 3) return null;
      const birthMonth = parseInt(parts[1], 10);
      const birthDay = parseInt(parts[2], 10);

      let daysUntil = 999;
      if (birthMonth === currentMonth) {
        daysUntil = birthDay - currentDay;
      } else if (birthMonth === (currentMonth % 12) + 1 && currentDay > 20) {
        daysUntil = (30 - currentDay) + birthDay;
      }

      if (daysUntil >= 0 && daysUntil <= 18) {
        return {
          client,
          daysUntil,
          formattedDate: `${birthDay.toString().padStart(2, '0')}/${birthMonth.toString().padStart(2, '0')}`,
          isToday: daysUntil === 0
        };
      }
      return null;
    })
    .filter((alert): alert is BirthdayAlert => alert !== null)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  // Alertas de Retenção
  const retentionAlerts: RetentionAlert[] = clients
    .map(client => {
      if (!client.lastVisitDate) return null;
      const lastVisit = new Date(client.lastVisitDate);
      const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 35) {
        const lastApp = appointments
          .filter(a => a.clientId === client.id)
          .sort((a, b) => b.date.localeCompare(a.date))[0];
        const lastProcedure = lastApp?.procedureName || client.favoriteProcedures[0] || 'Alongamento de Unhas';

        const [y, m, d] = client.lastVisitDate.split('-');
        return {
          client,
          daysSinceLastVisit: diffDays,
          lastVisitFormatted: `${d}/${m}/${y}`,
          lastProcedure
        };
      }
      return null;
    })
    .filter((alert): alert is RetentionAlert => alert !== null)
    .sort((a, b) => b.daysSinceLastVisit - a.daysSinceLastVisit);

  const newClients = clients.filter(c => c.isNewClient || c.source === 'trafego_pago');

  const resetDataToDefault = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_clients`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_appointments`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_procedures`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_schedule_settings`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_transactions`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_feedbacks`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_current_client`);
    setClients(initialClients);
    setAppointments(initialAppointments);
    setProcedures(initialProcedures);
    setScheduleSettings(initialScheduleSettings);
    setTransactions(initialTransactions);
    setFeedbacks(initialFeedbacks);
    setCurrentClient(null);
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        appointments,
        procedures,
        testimonials: initialTestimonials,
        realPortfolio: initialRealPortfolio,
        scheduleSettings,
        transactions,
        feedbacks,
        currentClient,
        isAdminLoggedIn,
        activeTab,
        setActiveTab,
        loginClient,
        loginAsDemoClient,
        logoutClient,
        toggleAdminLogin,
        addClient,
        updateClient,
        updateClientAvatar,
        requestOnlineBooking,
        addAppointment,
        approveAppointment,
        rejectAppointment,
        updateAppointmentStatus,
        markReminderSent,
        markThankYouSent,
        getUpcomingAppointmentForClient,
        getClientHistory,
        getAvailableSlotsForDate,
        isDateSelectable,
        addTransaction,
        deleteTransaction,
        addFeedback,
        updateFeedbackStatus,
        toggleWorkingDay,
        addVacationPeriod,
        removeVacationPeriod,
        toggleBlockedDate,
        addBlockedShift,
        removeBlockedShift,
        addBlockedSlot,
        removeBlockedSlot,
        updateDefaultSlots,
        pendingAppointments,
        birthdayAlerts,
        retentionAlerts,
        newClients,
        resetDataToDefault
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
