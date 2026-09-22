import { supabase, isSupabaseConfigured } from './supabase';
import { Appointment, Client, Transaction, Feedback, ScheduleSettings } from '../types';

// ==========================================
// MAPPERS: TypeScript Models <-> Supabase DB
// ==========================================

export const mapAppointmentToRow = (app: Appointment) => ({
  id: app.id,
  client_id: app.clientId || null,
  client_name: app.clientName,
  client_phone: app.clientPhone,
  client_birth_date: app.clientBirthDate || null,
  procedure_id: app.procedureId,
  procedure_name: app.procedureName,
  date: app.date,
  time: app.time,
  duration_minutes: app.durationMinutes || 90,
  price: Number(app.price) || 0,
  status: app.status || 'pendente',
  notes: app.notes || null,
  reminder_sent: Boolean(app.reminderSent),
  thank_you_sent: Boolean(app.thankYouSent),
  approved_at: app.approvedAt || null,
  has_feedback: Boolean(app.hasFeedback),
  created_at: app.createdAt || new Date().toISOString()
});

export const mapRowToAppointment = (row: any): Appointment => ({
  id: row.id,
  clientId: row.client_id || '',
  clientName: row.client_name,
  clientPhone: row.client_phone,
  clientBirthDate: row.client_birth_date || undefined,
  procedureId: row.procedure_id,
  procedureName: row.procedure_name,
  date: row.date,
  time: row.time,
  durationMinutes: Number(row.duration_minutes) || 90,
  price: Number(row.price) || 0,
  status: row.status as any,
  notes: row.notes || undefined,
  reminderSent: Boolean(row.reminder_sent),
  thankYouSent: Boolean(row.thank_you_sent),
  approvedAt: row.approved_at || undefined,
  hasFeedback: Boolean(row.has_feedback),
  createdAt: row.created_at || new Date().toISOString()
});

export const mapClientToRow = (c: Client) => ({
  id: c.id,
  name: c.name,
  phone: c.phone,
  birth_date: c.birthDate || null,
  first_visit_date: c.firstVisitDate || null,
  last_visit_date: c.lastVisitDate || null,
  source: c.source || 'outros',
  is_new_client: c.isNewClient !== undefined ? c.isNewClient : true,
  favorite_procedures: c.favoriteProcedures || [],
  skin_notes: c.skinNotes || null,
  avatar_url: c.avatarUrl || null,
  total_appointments: Number(c.totalAppointments) || 0,
  total_spent: Number(c.totalSpent) || 0
});

export const mapRowToClient = (row: any): Client => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  birthDate: row.birth_date || '',
  firstVisitDate: row.first_visit_date || '',
  lastVisitDate: row.last_visit_date || '',
  source: row.source || 'outros',
  isNewClient: Boolean(row.is_new_client),
  favoriteProcedures: row.favorite_procedures || [],
  skinNotes: row.skin_notes || undefined,
  avatarUrl: row.avatar_url || undefined,
  totalAppointments: Number(row.total_appointments) || 0,
  totalSpent: Number(row.total_spent) || 0
});

export const mapTransactionToRow = (tx: Transaction) => ({
  id: tx.id,
  type: tx.type,
  description: tx.description,
  amount: Number(tx.amount) || 0,
  category: tx.category,
  date: tx.date,
  created_at: new Date().toISOString()
});

export const mapRowToTransaction = (row: any): Transaction => ({
  id: row.id,
  type: row.type as any,
  description: row.description,
  amount: Number(row.amount) || 0,
  category: row.category as any,
  date: row.date
});

export const mapFeedbackToRow = (fb: Feedback) => ({
  id: fb.id,
  client_id: fb.clientId || null,
  client_name: fb.clientName,
  procedure_name: fb.procedureName,
  stars: Number(fb.stars) || 5,
  comment: fb.comment,
  status: fb.status || 'publicado',
  avatar_url: fb.avatarUrl || null,
  city: fb.city || 'Aracaju',
  created_at: fb.createdAt || new Date().toISOString()
});

export const mapRowToFeedback = (row: any): Feedback => ({
  id: row.id,
  clientId: row.client_id || '',
  clientName: row.client_name,
  procedureName: row.procedure_name,
  stars: Number(row.stars) || 5,
  comment: row.comment,
  status: row.status as any,
  avatarUrl: row.avatar_url || undefined,
  city: row.city || 'Aracaju',
  createdAt: row.created_at || new Date().toISOString()
});

export const mapSettingsToRow = (st: ScheduleSettings) => ({
  id: 'default_settings',
  working_days: st.workingDays,
  default_slots: st.defaultSlots,
  vacation_periods: st.vacationPeriods,
  blocked_dates: st.blockedDates,
  blocked_shifts: st.blockedShifts,
  blocked_slots: st.blockedSlots,
  updated_at: new Date().toISOString()
});

export const mapRowToSettings = (row: any, fallback: ScheduleSettings): ScheduleSettings => ({
  workingDays: row.working_days || fallback.workingDays,
  defaultSlots: row.default_slots || fallback.defaultSlots,
  vacationPeriods: row.vacation_periods || fallback.vacationPeriods,
  blockedDates: row.blocked_dates || fallback.blockedDates,
  blockedShifts: row.blocked_shifts || fallback.blockedShifts,
  blockedSlots: row.blocked_slots || fallback.blockedSlots
});

// =========================================================================
// SALVAGUARDA DE RESGATE: Mapeia e envia QUALQUER dado local para o Supabase
// (Garante que se a Rapha já salvou no celular dela, sobe pro Supabase na hora)
// =========================================================================
export async function rescueLocalDataToSupabase(): Promise<void> {
  if (!supabase || !isSupabaseConfigured || typeof window === 'undefined') return;

  try {
    const localAppointments: Appointment[] = [];
    const localClients: Client[] = [];
    const localTransactions: Transaction[] = [];
    const localFeedbacks: Feedback[] = [];

    // Vasculhar TODAS as chaves de localStorage que já existiram
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      try {
        const itemVal = localStorage.getItem(key);
        if (!itemVal) continue;
        const parsed = JSON.parse(itemVal);

        if (Array.isArray(parsed)) {
          if (key.includes('appointments')) {
            for (const app of parsed) {
              if (app && app.id && app.clientName && !localAppointments.some(a => a.id === app.id)) {
                // Não migrar dados fictícios do mock inicial antigo
                if (app.id !== 'app-1' && app.id !== 'app-2' && app.id !== 'app-3' && app.id !== 'app-4') {
                  localAppointments.push(app);
                } else if (app.notes && app.notes.includes('manual')) {
                  localAppointments.push(app);
                }
              }
            }
          } else if (key.includes('clients')) {
            for (const cli of parsed) {
              if (cli && cli.id && cli.name && !localClients.some(c => c.id === cli.id)) {
                if (cli.id !== 'cli-camila' && cli.id !== 'cli-aline' && cli.id !== 'cli-sabrina') {
                  localClients.push(cli);
                }
              }
            }
          } else if (key.includes('transactions')) {
            for (const tx of parsed) {
              if (tx && tx.id && tx.amount && !localTransactions.some(t => t.id === tx.id)) {
                if (!tx.id.startsWith('tr-rec-') && !tx.id.startsWith('tr-desp-')) {
                  localTransactions.push(tx);
                }
              }
            }
          } else if (key.includes('feedbacks')) {
            for (const fb of parsed) {
              if (fb && fb.id && fb.comment && !localFeedbacks.some(f => f.id === fb.id)) {
                if (!fb.id.startsWith('feed-')) {
                  localFeedbacks.push(fb);
                }
              }
            }
          }
        }
      } catch {
        // ignora chaves que não sejam json
      }
    }

    // Se encontrou dados locais (ex: os atendimentos manuais que a Rapha acabou de salvar no iPhone dela):
    if (localClients.length > 0) {
      console.log(`[Supabase Rescue] Enviando ${localClients.length} cliente(s) locais para a nuvem...`);
      const clientRows = localClients.map(mapClientToRow);
      await supabase.from('clients').upsert(clientRows, { onConflict: 'id' });
    }

    if (localAppointments.length > 0) {
      console.log(`[Supabase Rescue] Enviando ${localAppointments.length} agendamento(s) locais da Rapha para a nuvem...`);
      const appRows = localAppointments.map(mapAppointmentToRow);
      await supabase.from('appointments').upsert(appRows, { onConflict: 'id' });
    }

    if (localTransactions.length > 0) {
      const txRows = localTransactions.map(mapTransactionToRow);
      await supabase.from('transactions').upsert(txRows, { onConflict: 'id' });
    }

    if (localFeedbacks.length > 0) {
      const fbRows = localFeedbacks.map(mapFeedbackToRow);
      await supabase.from('feedbacks').upsert(fbRows, { onConflict: 'id' });
    }
  } catch (err) {
    console.error('[Supabase Rescue] Erro ao sincronizar dados locais:', err);
  }
}

// ==========================================
// BUSCA INICIAL DE DADOS DA NUVEM (SUPABASE)
// ==========================================
export async function fetchInitialSupabaseData() {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    const [appRes, cliRes, txRes, fbRes, stRes] = await Promise.all([
      supabase.from('appointments').select('*').order('date', { ascending: true }),
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').order('date', { ascending: false }),
      supabase.from('feedbacks').select('*').order('created_at', { ascending: false }),
      supabase.from('schedule_settings').select('*').eq('id', 'default_settings').maybeSingle()
    ]);

    return {
      appointments: appRes.data ? appRes.data.map(mapRowToAppointment) : null,
      clients: cliRes.data ? cliRes.data.map(mapRowToClient) : null,
      transactions: txRes.data ? txRes.data.map(mapRowToTransaction) : null,
      feedbacks: fbRes.data ? fbRes.data.map(mapRowToFeedback) : null,
      settingsRow: stRes.data || null
    };
  } catch (err) {
    console.error('[Supabase Fetch] Erro ao carregar dados:', err);
    return null;
  }
}
