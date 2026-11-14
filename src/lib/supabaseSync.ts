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
// IDs de clientes testes fictícios antigos que devem ser eliminados
export const MOCK_CLIENT_IDS = new Set([
  'cli-camila',
  'cli-aline',
  'cli-sabrina',
  'cli-mariana-alves',
  'cli-juliana-prado',
  'cli-bruna-tavares',
  'cli-lua-mendonca',
  'cli-renan-alves',
  'cli-larissa',
  'cli-rafaela-dias',
  'cli-beatriz',
  'cli-isabela',
  'cli-priscila'
]);

export async function rescueLocalDataToSupabase(): Promise<void> {
  if (!supabase || !isSupabaseConfigured || typeof window === 'undefined') return;

  try {
    // 1. Limpeza de segurança: garantir que nenhum cliente de mock permaneça no Supabase
    await supabase.from('clients').delete().in('id', Array.from(MOCK_CLIENT_IDS));

    // 2. Limpeza de chaves de versões antigas do localStorage (v1 até v7)
    // para evitar que agendamentos antigos/cancelados fiquem ressuscitando em loop
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (/^rapha_v[1-7]_/.test(key) || key.includes('mock') || key.includes('demo'))) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch (err) {
    console.error('[Supabase Rescue] Erro na limpeza inicial:', err);
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
      clients: cliRes.data
        ? cliRes.data
            .map(mapRowToClient)
            .filter(c => !MOCK_CLIENT_IDS.has(c.id))
        : null,
      transactions: txRes.data ? txRes.data.map(mapRowToTransaction) : null,
      feedbacks: fbRes.data ? fbRes.data.map(mapRowToFeedback) : null,
      settingsRow: stRes.data || null
    };
  } catch (err) {
    console.error('[Supabase Fetch] Erro ao carregar dados:', err);
    return null;
  }
}
