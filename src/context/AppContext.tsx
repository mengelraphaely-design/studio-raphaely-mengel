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

const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
  setCurrentClient: (client: Client | null) => void;
  loginClient: (phone: string, birthDate: string) => { success: boolean; message?: string };
  loginAsDemoClient: (clientId?: string) => void;
  logoutClient: () => void;
  toggleAdminLogin: (login?: boolean) => void;
  // Métodos de Clientes
  addClient: (client: Omit<Client, 'id'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  updateClientAvatar: (clientId: string, avatarUrl: string) => void;
  // Métodos de Agendamentos
  requestOnlineBooking: (bookingData: {
    clientName: string;
    clientPhone: string;
    clientBirthDate?: string;
    procedureId: string;
    date: string;
    time: string;
    notes?: string;
  }) => Promise<{ success: boolean; appointment: Appointment }>;
  approveAppointment: (id: string) => Promise<void>;
  rejectAppointment: (id: string, reason?: string) => Promise<void>;
  syncFromCloud: () => Promise<void>;
  isSyncing: boolean;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (
    id: string, 
    status: AppointmentStatus, 
    customPrice?: number, 
    paymentDate?: string, 
    paymentNotes?: string
  ) => void;
  markReminderSent: (id: string) => void;
  getUpcomingAppointmentForClient: (clientId: string) => Appointment | null;
  getClientHistory: (clientId: string) => Appointment[];
  getAvailableSlotsForDate: (dateStr: string, procedureDurationMinutes?: number) => DayAvailability;
  isDateSelectable: (dateStr: string) => { selectable: boolean; reason?: string };
  markThankYouSent: (appointmentId: string) => void;
  // Financial Transactions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
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
  // SINCRONIZAÇÃO NUVEM SUPABASE + TEMPO REAL + AUTO-POLLING ROBUSTO
  // =========================================================================
  const [isSyncing, setIsSyncing] = useState(false);

  // Sincronização centralizada com o Supabase (para web, mobile Safari e PWA)
  const syncFromCloud = async () => {
    if (!supabase || !isSupabaseConfigured) return;
    setIsSyncing(true);

    try {
      const cloudData = await fetchInitialSupabaseData();
      if (cloudData) {
        if (cloudData.appointments) {
          setAppointments(prev => {
            const cloudMap = new Map(cloudData.appointments!.map(a => [a.id, a]));
            
            // Detectar se chegaram novos agendamentos pendentes pela nuvem
            const prevPendingIds = new Set(prev.filter(a => a.status === 'pendente').map(a => a.id));
            const newPendings = cloudData.appointments!.filter(
              a => a.status === 'pendente' && !prevPendingIds.has(a.id)
            );
            if (newPendings.length > 0) {
              playNotificationBell();
              const latest = newPendings[0];
              showBrowserNotification(
                'Studio Raphaely Mengel 🔔',
                `Nova solicitação de ${latest.clientName} (${latest.procedureName})!`
              );
            }

            // Atualiza status e campos de todos os agendamentos conforme a nuvem
            const merged = cloudData.appointments!.map(cloudApp => {
              return cloudApp;
            });

            // Preserva itens locais se existirem
            for (const local of prev) {
              if (!cloudMap.has(local.id)) {
                merged.push(local);
              }
            }
            return merged;
          });
        }

        // Limpeza de cache local de clientes de mock antigos
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
          const cloudTxList = [...cloudData.transactions];
          const existingTxIds = new Set(cloudTxList.map(t => t.id));

          // Auto-reconciliação de qualquer agendamento já concluído sem transação
          if (cloudData.appointments) {
            for (const app of cloudData.appointments) {
              if (app.status === 'concluido') {
                const expectedTxId = `tx-app-${app.id}`;
                const hasTx = existingTxIds.has(expectedTxId) || cloudTxList.some(t => t.id === expectedTxId || (t.type === 'receita' && t.description.includes(app.clientName) && t.date === app.date));
                if (!hasTx) {
                  const autoTx: Transaction = {
                    id: expectedTxId,
                    type: 'receita',
                    description: `${app.procedureName} - ${app.clientName}`,
                    amount: app.price,
                    category: 'atendimento',
                    date: app.date || getLocalDateStr()
                  };
                  cloudTxList.unshift(autoTx);
                  existingTxIds.add(expectedTxId);
                  if (supabase && isSupabaseConfigured) {
                    supabase.from('transactions').upsert([mapTransactionToRow(autoTx)], { onConflict: 'id' }).then();
                  }
                }
              }
            }
          }
          setTransactions(cloudTxList);
        }

        if (cloudData.feedbacks) {
          setFeedbacks(cloudData.feedbacks);
        }

        if (cloudData.settingsRow) {
          setScheduleSettings(prev => mapRowToSettings(cloudData.settingsRow, prev));
        }
      }
    } catch (err) {
      console.error('[Cloud Sync Error]:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initialBootstrap() {
      // 1. Resgata atendimentos e clientes locais no primeiro carregamento
      await rescueLocalDataToSupabase();
      // 2. Busca o estado mais recente do Supabase
      if (isMounted) {
        await syncFromCloud();
      }
    }

    initialBootstrap();

    // 3. Polling em segundo plano a cada 8 segundos (garante sincronia total no iPhone/PC)
    const pollInterval = setInterval(() => {
      if (isMounted && typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncFromCloud();
      }
    }, 8000);

    // 4. Ao desbloquear o celular, voltar para a aba ou trocar de aplicativo
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncFromCloud();
      }
    };
    const handleFocus = () => {
      syncFromCloud();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('focus', handleFocus);
    }

    // 5. Conectar WebSocket Realtime do Supabase
    let channel: any = null;
    if (supabase && isSupabaseConfigured) {
      channel = supabase
        .channel('studio-realtime-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
          if (!isMounted) return;
          syncFromCloud();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
          if (!isMounted) return;
          syncFromCloud();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
          if (!isMounted) return;
          syncFromCloud();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'feedbacks' }, () => {
          if (!isMounted) return;
          syncFromCloud();
        })
        .subscribe();
    }

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('focus', handleFocus);
      }
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
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
      supabase.from('transactions').upsert([mapTransactionToRow(newTx)], { onConflict: 'id' }).then();
    }

    return newTx;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    let updatedTx: Transaction | undefined;
    setTransactions(prev => prev.map(tx => {
      if (tx.id === id) {
        updatedTx = { ...tx, ...updates };
        return updatedTx;
      }
      return tx;
    }));

    if (supabase && isSupabaseConfigured && updatedTx) {
      supabase.from('transactions').update({
        type: updatedTx.type,
        description: updatedTx.description,
        amount: Number(updatedTx.amount) || 0,
        category: updatedTx.category,
        date: updatedTx.date
      }).eq('id', id).then();
    }
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
  const requestOnlineBooking = async (bookingData: {
    clientName: string;
    clientPhone: string;
    clientBirthDate?: string;
    procedureId: string;
    date: string;
    time: string;
    notes?: string;
  }): Promise<{ success: boolean; appointment: Appointment }> => {
    const selectedProc = procedures.find(p => p.id === bookingData.procedureId) || procedures[0];

    let clientMatch = clients.find(c => {
      const cPhone = c.phone.replace(/\D/g, '');
      const inputPhone = bookingData.clientPhone.replace(/\D/g, '');
      return cPhone.endsWith(inputPhone.slice(-8));
    });

    if (!clientMatch) {
      clientMatch = {
        id: `cli-${Date.now()}`,
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
      };
      setClients(prev => [clientMatch!, ...prev]);

      // CRÍTICO: Inserir e AGUARDAR o cliente no Supabase ANTES do agendamento
      // para não violar a foreign key constraint "appointments_client_id_fkey"
      if (supabase && isSupabaseConfigured) {
        try {
          const { error: cliErr } = await supabase.from('clients').upsert(mapClientToRow(clientMatch));
          if (cliErr) {
            console.error('[Supabase Insert Client Error]:', cliErr);
          }
        } catch (e) {
          console.error('[Supabase Client Upsert Exception]:', e);
        }
      }
    } else if (bookingData.clientBirthDate && (!clientMatch.birthDate || clientMatch.birthDate.startsWith('202'))) {
      updateClient(clientMatch.id, { birthDate: bookingData.clientBirthDate });
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

    // Enviar para o Supabase e aguardar confirmação
    if (supabase && isSupabaseConfigured) {
      try {
        const { error: appErr } = await supabase.from('appointments').upsert(mapAppointmentToRow(newApp));
        if (appErr) {
          console.error('[Supabase Insert Appointment Error]:', appErr);
          // Fallback de segurança se houver conflito de foreign key
          if (appErr.code === '23503') {
            await supabase.from('appointments').upsert({
              ...mapAppointmentToRow(newApp),
              client_id: null
            });
          }
        }
      } catch (e) {
        console.error('[Supabase Appointment Upsert Exception]:', e);
      }
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
      supabase.from('appointments').upsert(mapAppointmentToRow(newApp)).then(({ error }) => {
        if (error) console.error('[Supabase Manual Appointment Error]:', error);
      });
    }

    return newApp;
  };

  // 6. Rapha Aprova Agendamento (Local + Nuvem Supabase)
  const approveAppointment = async (id: string) => {
    const approvedAt = new Date().toISOString();
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: 'confirmado', approvedAt };
      }
      return a;
    }));

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status: 'confirmado', approved_at: approvedAt })
          .eq('id', id);
        if (error) {
          console.error('[Supabase Approve Error]:', error);
        }
      } catch (e) {
        console.error('[Supabase Approve Exception]:', e);
      }
    }
  };

  // 7. Rapha Recusa Agendamento (Local + Nuvem Supabase)
  const rejectAppointment = async (id: string, reason?: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const notes = reason ? `${a.notes || ''} (Recusado: ${reason})` : a.notes;
        return { ...a, status: 'cancelado', notes };
      }
      return a;
    }));

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status: 'cancelado' })
          .eq('id', id);
        if (error) {
          console.error('[Supabase Reject Error]:', error);
        }
      } catch (e) {
        console.error('[Supabase Reject Exception]:', e);
      }
    }
  };

  // 8. Atualizar Status (Local + Nuvem Supabase)
  const updateAppointmentStatus = (
    id: string, 
    status: AppointmentStatus, 
    customPrice?: number, 
    paymentDate?: string, 
    paymentNotes?: string
  ) => {
    let targetApp: Appointment | undefined;
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        targetApp = { 
          ...a, 
          status, 
          price: customPrice !== undefined ? customPrice : a.price,
          notes: paymentNotes ? (a.notes ? `${a.notes} | ${paymentNotes}` : paymentNotes) : a.notes
        };
        return targetApp;
      }
      return a;
    }));

    if (supabase && isSupabaseConfigured) {
      const updatePayload: any = { status };
      if (customPrice !== undefined) updatePayload.price = customPrice;
      if (paymentNotes) updatePayload.notes = paymentNotes;
      supabase.from('appointments').update(updatePayload).eq('id', id).then();
    }

    if (status === 'concluido') {
      const app = targetApp || appointments.find(a => a.id === id);
      if (app) {
        const finalPrice = customPrice !== undefined ? customPrice : app.price;
        const finalDate = paymentDate || app.date || getLocalDateStr();
        const txId = `tx-app-${id}`;
        const txDesc = `${app.procedureName} - ${app.clientName}${paymentNotes ? ` (${paymentNotes})` : ''}`;

        const newTx: Transaction = {
          id: txId,
          type: 'receita',
          description: txDesc,
          amount: finalPrice,
          category: 'atendimento',
          date: finalDate
        };

        setTransactions(prev => {
          const filtered = prev.filter(t => t.id !== txId);
          return [newTx, ...filtered];
        });

        if (supabase && isSupabaseConfigured) {
          supabase.from('transactions').upsert([mapTransactionToRow(newTx)], { onConflict: 'id' }).then();
        }

        // Atualizar estatísticas da cliente (totalAppointments e totalSpent)
        if (app.clientId) {
          setClients(prev => prev.map(c => {
            if (c.id === app.clientId) {
              const updated = {
                ...c,
                totalAppointments: (c.totalAppointments || 0) + 1,
                totalSpent: (c.totalSpent || 0) + finalPrice,
                lastVisitDate: finalDate
              };
              if (supabase && isSupabaseConfigured) {
                supabase.from('clients').update({
                  total_appointments: updated.totalAppointments,
                  total_spent: updated.totalSpent,
                  last_visit_date: updated.lastVisitDate
                }).eq('id', c.id).then();
              }
              return updated;
            }
            return c;
          }));
        }
      }
    } else if (status === 'cancelado') {
      const txId = `tx-app-${id}`;
      setTransactions(prev => prev.filter(t => t.id !== txId));
      if (supabase && isSupabaseConfigured) {
        supabase.from('transactions').delete().eq('id', txId).then();
      }
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
        setCurrentClient,
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
        updateTransaction,
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
        enableBrowserNotifications,
        syncFromCloud,
        isSyncing
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
