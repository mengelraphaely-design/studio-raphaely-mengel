export type ProcedureCategory = 'alongamento' | 'banho_gel' | 'esmaltacao' | 'nail_art' | 'manutencao';

export interface Procedure {
  id: string;
  name: string;
  category: ProcedureCategory;
  description: string;
  durationMinutes: number;
  price: number;
  maintenancePrice?: number;
  maintenanceOtherProPrice?: number;
  removalPrice?: number;
  nailReplacementPrice?: number;
  includesInfo?: string;
  benefits: string[];
  imageUrl: string;
  isPopular?: boolean;
  postCareTips: string[];
}

export type ClientSource = 'indicacao' | 'trafego_pago' | 'instagram' | 'outros';

export interface Client {
  id: string;
  name: string;
  phone: string; // formato (79) 99999-9999
  birthDate: string; // YYYY-MM-DD
  firstVisitDate: string; // YYYY-MM-DD
  lastVisitDate: string; // YYYY-MM-DD
  source: ClientSource;
  isNewClient?: boolean;
  favoriteProcedures: string[];
  skinNotes?: string;
  avatarUrl?: string;
  totalAppointments?: number;
  totalSpent?: number;
}

export type AppointmentStatus = 'confirmado' | 'pendente' | 'concluido' | 'cancelado';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientBirthDate?: string;
  procedureId: string;
  procedureName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  reminderSent?: boolean;
  thankYouSent?: boolean;
  approvedAt?: string;
  createdAt: string;
  hasFeedback?: boolean;
}

export interface Feedback {
  id: string;
  clientId: string;
  clientName: string;
  procedureName: string;
  stars: number;
  comment: string;
  createdAt: string;
  status: 'publicado' | 'pendente' | 'oculto';
  avatarUrl?: string;
  city?: string;
}

export type Testimonial = Feedback;

export type TransactionCategory = 'atendimento' | 'aluguel' | 'materiais' | 'energia' | 'marketing' | 'outros';

export interface Transaction {
  id: string;
  type: 'receita' | 'despesa';
  description: string;
  amount: number;
  category: TransactionCategory;
  date: string; // YYYY-MM-DD
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'encapsuladas' | 'veludo' | 'nail_art' | 'florais';
  description: string;
  imageUrl: string;
  tag: string;
}

export interface VacationPeriod {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  label: string;
}

export interface BlockedShift {
  id: string;
  date: string; // YYYY-MM-DD
  shift: 'manha' | 'tarde';
  reason?: string;
}

export interface BlockedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason?: string;
}

export interface ScheduleSettings {
  workingDays: number[]; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
  defaultSlots: string[];
  vacationPeriods: VacationPeriod[];
  blockedDates: string[]; // YYYY-MM-DD
  blockedShifts: BlockedShift[];
  blockedSlots: BlockedSlot[];
}

export type MainTab = 'portfolio' | 'procedimentos' | 'galeria' | 'cliente' | 'rapha';
