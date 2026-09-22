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
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  rescueLocalDataToSupabase, 
  fetchInitialSupabaseData,
  MOCK_CLIENT_IDS,
  mapAppointmentToRow,
  mapRowToAppointment,
  mapClientToRow,
  mapRowToClient,
  mapTransactionToRow,
  mapRowToTransaction,
  mapFeedbackToRow,
  mapRowToFeedback,
  mapSettingsToRow,
  mapRowToSettings
} from '../lib/supabaseSync';
import { 
  playNotificationBell, 
  showBrowserNotification, 
  requestBrowserNotificationPermission 
} from '../utils/notifications';

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
  // Notificações
  triggerBellNotification: () => void;
  enableBrowserNotifications: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const STORAGE_KEY_PREFIX = 'rapha_v8_cloud_sync';

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_clients`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(c => !MOCK_CLIENT_IDS.has(c.id));
        }
      }
      return initialClients;
    } catch {
      return initialClients;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_appointments`);
      return saved ? JSON.parse(saved) : initialAppointments;
    } catch {
      return initialAppointments;
    }
  });

  const [procedures, setProcedures] = useState<Procedure[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_procedures`);
      return saved ? JSON.parse(saved) : initialProcedures;
    } catch {
      return initialProcedures;
    }
  });

  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_schedule_settings`);
      return saved ? JSON.parse(saved) : initialScheduleSettings;
    } catch {
      return initialScheduleSettings;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_transactions`);
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_feedbacks`);
      return saved ? JSON.parse(saved) : initialFeedbacks;
    } catch {
      return initialFeedbacks;
    }
  });

  const [currentClient, setCurrentClient] = useState<Client | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_current_client`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_is_admin`);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<MainTab>('portfolio');

  // Sincronizar com localStorage para resiliência offline imediata
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

  // =========================================================================
  // SINCRONIZAÇÃO NUVEM SUPABASE + TEMPO REAL + RESGATE DE DADOS LOCAIS DA RAPHA
  // =========================================================================
  useEffect(() => {
    let isMounted = true;

    async function initSupabaseCloud() {
      // 1. PRIMEIRO: Resgata qualquer agendamento ou cliente criado no iPhone da Rapha e sobe pro Supabase
      await rescueLocalDataToSupabase();

      // 2. SEGUNDO: Baixa o estado mais recente do Supabase (para todos os celulares sincronizarem)
      const cloudData = await fetchInitialSupabaseData();
      if (cloudData && isMounted) {
        if (cloudData.appointments) {
          setAppointments(prev => {
            // Mesclar evitando duplicatas
            const merged = [...cloudData.appointments!];
            for (const local of prev) {
              if (!merged.some(m => m.id === local.id)) {
                merged.push(local);
              }
            }
            return merged;
          });
        }

        // Limpeza de cache local antigo
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('clients')) {
              const val = localStorage.getItem(key);
              if (val) {
                const arr = JSON.parse(val);
                if (Array.isArray(arr)) {
                  const cleaned = arr.filter((c: any) => !MOCK_CLIENT_IDS.has(c.id));
                  localStorage.setItem(key, JSON.stringify(cleaned));
                }
              }
            }
          }
        } catch {}

        if (cloudData.clients) {
          setClients(prev => {
            const filteredCloud = cloudData.clients!.filter(c => !MOCK_CLIENT_IDS.has(c.id));
            const cloudIds = new Set(filteredCloud.map(c => c.id));
            const localOnly = prev.filter(c => !cloudIds.has(c.id) && !MOCK_CLIENT_IDS.has(c.id));
            return [...filteredCloud, ...localOnly];
          });
        }

        if (cloudData.transactions) {
          setTransactions(cloudData.transactions);
        }

        if (cloudData.feedbacks) {
          setFeedbacks(cloudData.feedbacks);
        }

        if (cloudData.settingsRow) {
          setScheduleSettings(prev => mapRowToSettings(cloudData.settingsRow, prev));
        }
      }
    }

    initSupabaseCloud();

    // 3. TERCEIRO: Conectar WebSocket Realtime do Supabase
    if (supabase && isSupabaseConfigured) {
      const channel = supabase
        .channel('studio-realtime-sync')
        // Agendamentos em Tempo Real
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, payload => {
          if (!isMounted) return;
          if (payload.eventType === 'INSERT') {
            const newApp = mapRowToAppointment(payload.new);
            setAppointments(prev => {
              if (prev.some(a => a.id === newApp.id)) return prev;
              return [newApp, ...prev];
            });

            // Toca o sininho e dispara notificação no celular
            playNotificationBell();
            showBrowserNotification(
              'Studio Raphaely Mengel 🔔',
              `Novo agendamento de ${newApp.clientName} (${newApp.procedureName}) para ${newApp.date} às ${newApp.time}!`
            );
          } else if (payload.eventType === 'UPDATE') {
            const updatedApp = mapRowToAppointment(payload.new);
            setAppointments(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
          } else if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as any)?.id;
            if (oldId) {
              setAppointments(prev => prev.filter(a => a.id !== oldId));
            }
          }
        })
        // Clientes em Tempo Real
        .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, payload => {
          if (!isMounted) return;
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const updatedCli = mapRowToClient(payload.new);
            if (!MOCK_CLIENT_IDS.has(updatedCli.id)) {
              setClients(prev => {
                const exists = prev.some(c => c.id === updatedCli.id);
                return exists ? prev.map(c => c.id === updatedCli.id ? updatedCli : c) : [updatedCli, ...prev];
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as any)?.id;
            if (oldId) {
              setClients(prev => prev.filter(c => c.id !== oldId));
            }
          }
        })
        // Transações em Tempo Real
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, payload => {
          if (!isMounted) return;
          if (payload.eventType === 'INSERT') {
            const newTx = mapRowToTransaction(payload.new);
            setTransactions(prev => prev.some(t => t.id === newTx.id) ? prev : [newTx, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as any)?.id;
            if (oldId) setTransactions(prev => prev.filter(t => t.id !== oldId));
          }
        })
        // Feedbacks em Tempo Real
        .on('postgres_changes', { event: '*', schema: 'public', table: 'feedbacks' }, payload => {
          if (!isMounted) return;
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const updatedFb = mapRowToFeedback(payload.new);
            setFeedbacks(prev => {
              const exists = prev.some(f => f.id === updatedFb.id);
              return exists ? prev.map(f => f.id === updatedFb.id ? updatedFb : f) : [updatedFb, ...prev];
            });
          }
        })
        .subscribe();

      return () => {
        isMounted = false;
        supabase?.removeChannel(channel);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Notificações Utilitários
  const triggerBellNotification = () => {
    playNotificationBell();
  };

  const enableBrowserNotifications = async () => {
    return await requestBrowserNotificationPermission();
  };

  // Login de Cliente
  const loginClient = (phone: string, birthDate: string): { success: boolean; message?: string } => {
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanSearch = cleanPhone.slice(-8);

    const client = clients.find(c => {
      const cPhone = c.phone.replace(/\D/g, '');
      return cPhone.endsWith(cleanSearch) && c.birthDate === birthDate;
    });

    if (client) {
      setCurrentClient(client);
      setActiveTab('cliente');
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Cadastro não localizado. Verifique se o telefone e a data de nascimento estão corretos.' 
    };
  };

  const loginAsDemoClient = (clientId: string = 'cli-teste-rapha') => {
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

  // 1. Adicionar Cliente (Local + Nuvem Supabase)
  const addClient = (newClientData: Omit<Client, 'id'>): Client => {
    const newClient: Client = {
      ...newClientData,
      id: `cli-${Date.now()}`
    };
    setClients(prev => [newClient, ...prev]);

    if (supabase && isSupabaseConfigured) {
      supabase.from('clients').insert([mapClientToRow(newClient)]).then(({ error }) => {
        if (error) console.error('[Supabase Insert Client Error]:', error);
      });
    }

    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        if (supabase && isSupabaseConfigured) {
          supabase.from('clients').update(mapClientToRow(updated)).eq('id', id).then();
        }
        return updated;
      }
      return c;
    }));

    // Se alterou nome, telefone ou nascimento, atualiza os agendamentos correspondentes
    if (updates.name || updates.phone || updates.birthDate) {
      setAppointments(prev => prev.map(app => {
        if (app.clientId === id || (updates.phone && app.clientPhone && app.clientPhone.replace(/\D/g, '') === updates.phone.replace(/\D/g, ''))) {
          const appUpdates: Partial<Appointment> = {};
          if (updates.name) appUpdates.clientName = updates.name;
          if (updates.phone) appUpdates.clientPhone = updates.phone;
          if (updates.birthDate) appUpdates.clientBirthDate = updates.birthDate;
          const updatedApp = { ...app, ...appUpdates };
          if (supabase && isSupabaseConfigured) {
            supabase.from('appointments').update(mapAppointmentToRow(updatedApp)).eq('id', app.id).then();
          }
          return updatedApp;
        }
        return app;
      }));
    }

    if (currentClient && currentClient.id === id) {
      setCurrentClient(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const updateClientAvatar = (clientId: string, avatarUrl: string) => {
    updateClient(clientId, { avatarUrl });
  };

  // 2. Transações Financeiras (Local + Nuvem Supabase)
  const addTransaction = (transactionData: Omit<Transaction, 'id'>): Transaction => {
    const newTx: Transaction = {
      ...transactionData,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);

    if (supabase && isSupabaseConfigured) {
      supabase.from('transactions').insert([mapTransactionToRow(newTx)]).then();
    }

    return newTx;
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));

    if (supabase && isSupabaseConfigured) {
      supabase.from('transactions').delete().eq('id', id).then();
    }
  };

  // 3. Feedbacks (Local + Nuvem Supabase)
  const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt'>): Feedback => {
    const newFb: Feedback = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setFeedbacks(prev => [newFb, ...prev]);

    if (supabase && isSupabaseConfigured) {
      supabase.from('feedbacks').insert([mapFeedbackToRow(newFb)]).then();
    }

    return newFb;
  };

  const updateFeedbackStatus = (id: string, status: 'publicado' | 'pendente' | 'oculto') => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === id) {
        const updated = { ...f, status };
        if (supabase && isSupabaseConfigured) {
          supabase.from('feedbacks').update({ status }).eq('id', id).then();
        }
        return updated;
      }
      return f;
    }));
  };

  // Motor de Verificação de Disponibilidade de Datas
  const isDateSelectable = (dateStr: string): { selectable: boolean; reason?: string } => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0 = Domingo, 1 = Segunda, etc.

    if (!scheduleSettings.workingDays.includes(dayOfWeek)) {
      const dayNames = ['Domingos', 'Segundas-feiras', 'Terças-feiras', 'Quartas-feiras', 'Quintas-feiras', 'Sextas-feiras', 'Sábados'];
      return { selectable: false, reason: `Não há atendimento aos ${dayNames[dayOfWeek]}` };
    }

    for (const vac of scheduleSettings.vacationPeriods) {
      if (dateStr >= vac.startDate && dateStr <= vac.endDate) {
        return { selectable: false, reason: `Período de recesso/férias: ${vac.label}` };
      }
    }

    if (scheduleSettings.blockedDates.includes(dateStr)) {
      return { selectable: false, reason: 'Agenda fechada nesta data' };
    }

    return { selectable: true };
  };

  const timeStringToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // Motor Inteligente de Horários Livres (Elimina sobreposições com base na duração real)
  const getAvailableSlotsForDate = (dateStr: string, procedureDurationMinutes: number = 90): DayAvailability => {
    const dateCheck = isDateSelectable(dateStr);
    if (!dateCheck.selectable) {
      return {
        available: false,
        reason: dateCheck.reason,
        slots: []
      };
    }

    let candidateSlots = [...scheduleSettings.defaultSlots];

    // Bloqueios de horários avulsos
    const blockedSlotsForDate = scheduleSettings.blockedSlots.filter(s => s.date === dateStr);
    if (blockedSlotsForDate.length > 0) {
      const blockedTimes = blockedSlotsForDate.map(s => s.time);
      candidateSlots = candidateSlots.filter(s => !blockedTimes.includes(s));
    }

    // Bloqueio de turno
    const blockedShiftForDate = scheduleSettings.blockedShifts.find(s => s.date === dateStr);
    if (blockedShiftForDate) {
      if (blockedShiftForDate.shift === 'manha') {
        candidateSlots = candidateSlots.filter(s => timeStringToMinutes(s) >= 720);
      } else if (blockedShiftForDate.shift === 'tarde') {
        candidateSlots = candidateSlots.filter(s => timeStringToMinutes(s) < 720);
      }
    }

    // Agendamentos ativos da data (confirmados ou pendentes)
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

    candidateSlots = candidateSlots.filter(slot => {
      const slotStart = timeStringToMinutes(slot);
      const slotEnd = slotStart + procedureDurationMinutes;

      const startsDuringApp = activeAppointments.some(
        app => slotStart >= app.startMin && slotStart < app.endMin
      );
      if (startsDuringApp) return false;

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

  // 4. Solicitação de Agendamento Online Direto (Local + Nuvem Supabase)
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
      status: 'pendente',
      notes: bookingData.notes || 'Solicitado online pelo site',
      reminderSent: false,
      thankYouSent: false,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newApp, ...prev]);

    // Enviar imediatamente para o Supabase
    if (supabase && isSupabaseConfigured) {
      supabase.from('appointments').insert([mapAppointmentToRow(newApp)]).then(({ error }) => {
        if (error) console.error('[Supabase Insert Appointment Error]:', error);
      });
    }

    if (!currentClient) {
      setCurrentClient(clientMatch);
    }

    return { success: true, appointment: newApp };
  };

  // 5. Adicionar Agendamento Manual (Local + Nuvem Supabase)
  const addAppointment = (newAppData: Omit<Appointment, 'id'>): Appointment => {
    const newApp: Appointment = {
      ...newAppData,
      id: `app-${Date.now()}`
    };
    setAppointments(prev => [newApp, ...prev]);

    if (supabase && isSupabaseConfigured) {
      supabase.from('appointments').insert([mapAppointmentToRow(newApp)]).then(({ error }) => {
        if (error) console.error('[Supabase Manual Appointment Error]:', error);
      });
    }

    return newApp;
  };

  // 6. Rapha Aprova Agendamento (Local + Nuvem Supabase)
  const approveAppointment = (id: string) => {
    const approvedAt = new Date().toISOString();
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: 'confirmado', approvedAt };
      }
      return a;
    }));

    if (supabase && isSupabaseConfigured) {
      supabase.from('appointments').update({ status: 'confirmado', approved_at: approvedAt }).eq('id', id).then();
    }
  };

  // 7. Rapha Recusa Agendamento (Local + Nuvem Supabase)
  const rejectAppointment = (id: string, reason?: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const notes = reason ? `${a.notes || ''} (Recusado: ${reason})` : a.notes;
        return { ...a, status: 'cancelado', notes };
      }
      return a;
    }));

    if (supabase && isSupabaseConfigured) {
      supabase.from('appointments').update({ status: 'cancelado' }).eq('id', id).then();
    }
  };

  // 8. Atualizar Status (Local + Nuvem Supabase)
  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));

    if (supabase && isSupabaseConfigured) {
      supabase.from('appointments').update({ status }).eq('id', id).then();
    }
  };

  const markReminderSent = (id: string) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, reminderSent: true } : a)));

    if (supabase && isSupabaseConfigured) {
      supabase.from('appointments').update({ reminder_sent: true }).eq('id', id).then();
    }
  };

  const markThankYouSent = (appointmentId: string) => {
    setAppointments(prev => prev.map(a => (a.id === appointmentId ? { ...a, thankYouSent: true } : a)));

    if (supabase && isSupabaseConfigured) {
      supabase.from('appointments').update({ thank_you_sent: true }).eq('id', appointmentId).then();
    }
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

  // 9. Gestão de Horários & Férias (Local + Nuvem Supabase)
  const saveScheduleSettingsToCloud = (newSettings: ScheduleSettings) => {
    if (supabase && isSupabaseConfigured) {
      supabase.from('schedule_settings').upsert([mapSettingsToRow(newSettings)], { onConflict: 'id' }).then();
    }
  };

  const toggleWorkingDay = (dayIndex: number) => {
    setScheduleSettings(prev => {
      const isWorking = prev.workingDays.includes(dayIndex);
      const nextDays = isWorking 
        ? prev.workingDays.filter(d => d !== dayIndex)
        : [...prev.workingDays, dayIndex].sort();
      const updated = { ...prev, workingDays: nextDays };
      saveScheduleSettingsToCloud(updated);
      return updated;
    });
  };

  const addVacationPeriod = (vacation: Omit<VacationPeriod, 'id'>) => {
    const newVac: VacationPeriod = { ...vacation, id: `vac-${Date.now()}` };
    setScheduleSettings(prev => {
      const updated = { ...prev, vacationPeriods: [...prev.vacationPeriods, newVac] };
      saveScheduleSettingsToCloud(updated);
      return updated;
    });
  };

  const removeVacationPeriod = (id: string) => {
    setScheduleSettings(prev => {
      const updated = { ...prev, vacationPeriods: prev.vacationPeriods.filter(v => v.id !== id) };
      saveScheduleSettingsToCloud(updated);
      return updated;
    });
  };

  const toggleBlockedDate = (dateStr: string) => {
    setScheduleSettings(prev => {
      const isBlocked = prev.blockedDates.includes(dateStr);
      const nextDates = isBlocked 
        ? prev.blockedDates.filter(d => d !== dateStr)
        : [...prev.blockedDates, dateStr];
      const updated = { ...prev, blockedDates: nextDates };
      saveScheduleSettingsToCloud(updated);
      return updated;
    });
  };

  const addBlockedShift = (shift: Omit<BlockedShift, 'id'>) => {
    const newShift: BlockedShift = { ...shift, id: `shift-${Date.now()}` };
    setScheduleSettings(prev => {
      const updated = { ...prev, blockedShifts: [...prev.blockedShifts, newShift] };
      saveScheduleSettingsToCloud(updated);
      return updated;
    });
  };

  const removeBlockedShift = (id: string) => {
    setScheduleSettings(prev => {
      const updated = { ...prev, blockedShifts: prev.blockedShifts.filter(s => s.id !== id) };
      saveScheduleSettingsToCloud(updated);
      return updated;
    });
  };

  const addBlockedSlot = (slot: Omit<BlockedSlot, 'id'>) => {
    const newSlot: BlockedSlot = { ...slot, id: `slot-${Date.now()}` };
    setScheduleSettings(prev => {
      const updated = { ...prev, blockedSlots: [...prev.blockedSlots, newSlot] };
      saveScheduleSettingsToCloud(updated);
      return updated;
    });
  };

  const removeBlockedSlot = (id: string) => {
    setScheduleSettings(prev => {
      const updated = { ...prev, blockedSlots: prev.blockedSlots.filter(s => s.id !== id) };
      saveScheduleSettingsToCloud(updated);
      return updated;
    });
  };

  const updateDefaultSlots = (slots: string[]) => {
    setScheduleSettings(prev => {
      const updated = { ...prev, defaultSlots: slots };
      saveScheduleSettingsToCloud(updated);
      return updated;
    });
  };

  // Solicitações que necessitam de aprovação da Rapha
  const pendingAppointments = appointments.filter(a => a.status === 'pendente');

  // Alertas de Aniversariantes Dinâmicos
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

  // Alertas de Retenção Dinâmicos
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
        resetDataToDefault,
        triggerBellNotification,
        enableBrowserNotifications
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
