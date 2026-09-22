-- =========================================================
-- STUDIO RAPHAELY MENGEL - SCHEMA SUPABASE
-- Cole este script no SQL Editor do seu projeto Supabase e clique em RUN
-- =========================================================

-- 1. TABELA DE CLIENTES
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    birth_date DATE,
    first_visit_date DATE DEFAULT CURRENT_DATE,
    last_visit_date DATE DEFAULT CURRENT_DATE,
    source TEXT DEFAULT 'trafego_pago',
    is_new_client BOOLEAN DEFAULT true,
    favorite_procedures TEXT[] DEFAULT '{}',
    skin_notes TEXT,
    avatar_url TEXT,
    total_appointments INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE AGENDAMENTOS
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_birth_date DATE,
    procedure_id TEXT NOT NULL,
    procedure_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pendente', -- 'pendente', 'confirmado', 'concluido', 'cancelado'
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    thank_you_sent BOOLEAN DEFAULT false,
    approved_at TIMESTAMPTZ,
    has_feedback BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE TRANSAÇÕES FINANCEIRAS
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'receita' ou 'despesa'
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL, -- 'atendimento', 'aluguel', 'materiais', 'energia', 'marketing', 'outros'
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE FEEDBACKS / DEPOIMENTOS
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id TEXT PRIMARY KEY,
    client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    procedure_name TEXT NOT NULL,
    stars INTEGER DEFAULT 5,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'publicado', -- 'publicado', 'pendente', 'oculto'
    avatar_url TEXT,
    city TEXT DEFAULT 'Aracaju',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE CONFIGURAÇÕES DE HORÁRIOS & FÉRIAS
CREATE TABLE IF NOT EXISTS public.schedule_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    working_days INTEGER[] DEFAULT '{2, 3, 4, 5, 6}', -- Terça a Sábado
    default_slots TEXT[] DEFAULT '{"09:00", "11:00", "14:00", "16:00", "18:00"}',
    vacation_periods JSONB DEFAULT '[]',
    blocked_dates TEXT[] DEFAULT '{}',
    blocked_shifts JSONB DEFAULT '[]',
    blocked_slots JSONB DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HABILITAR RLS (Row Level Security) COM POLÍTICAS ABERTAS PARA A API ANON
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso Total Clientes" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Agendamentos" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Transações" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Feedbacks" ON public.feedbacks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Total Configurações" ON public.schedule_settings FOR ALL USING (true) WITH CHECK (true);
