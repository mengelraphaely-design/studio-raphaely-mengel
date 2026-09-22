import { Procedure, Client, Appointment, Feedback, Transaction, PortfolioItem, ScheduleSettings } from '../types';

export const initialProcedures: Procedure[] = [
  {
    id: 'proc-alongamento',
    name: 'Alongamento de Unhas',
    category: 'alongamento',
    description: 'Técnica para aumentar o comprimento das unhas naturais utilizando métodos como gel, tips ou fibra de vidro com acabamento natural e ultra resistente.',
    durationMinutes: 120,
    price: 130,
    maintenancePrice: 70,
    removalPrice: 30,
    nailReplacementPrice: 5,
    includesInfo: 'Inclui cutilagem, esmaltação em gel e um par de encapsuladas',
    benefits: [
      'Comprimento e formato sob medida (amendoada, quadrada, stiletto)',
      'Inclui cutilagem completa',
      'Inclui esmaltação em gel de alta durabilidade',
      'Inclui 1 par de unhas encapsuladas decoradas'
    ],
    imageUrl: '/portfolio/nail-1.jpg',
    isPopular: true,
    postCareTips: [
      'Não utilize as unhas como ferramentas (abrir latas, raspar superfícies).',
      'Use luvas para contato prolongado com produtos químicos de limpeza.',
      'Aplique óleo hidratante nas cutículas diariamente para nutrir a raiz.',
      'Realize a manutenção a cada 20 a 30 dias para garantir a saúde da lâmina natural.'
    ]
  },
  {
    id: 'proc-banho-gel',
    name: 'Banho de Gel',
    category: 'banho_gel',
    description: 'Técnica de fortalecimento das unhas naturais, que utiliza gel endurecido sob luz UV para proporcionar unhas mais firmes, duradouras e com brilho espelhado.',
    durationMinutes: 90,
    price: 80,
    maintenancePrice: 70,
    removalPrice: 30,
    includesInfo: 'Inclui cutilagem, esmaltação em gel e um par de encapsuladas',
    benefits: [
      'Protege unhas fracas e quebradiças',
      'Permite o crescimento natural sem quebras',
      'Inclui cutilagem e esmaltação em gel',
      'Inclui 1 par de encapsuladas'
    ],
    imageUrl: '/portfolio/nail-6.jpg',
    isPopular: true,
    postCareTips: [
      'Mantenha as mãos e cutículas sempre hidratadas.',
      'Evite bater as pontas das unhas em superfícies duras.',
      'Faça a manutenção regular a cada 20 a 30 dias.'
    ]
  },
  {
    id: 'proc-esmaltacao-gel',
    name: 'Esmaltação em Gel',
    category: 'esmaltacao',
    description: 'Durabilidade incomparável que proporciona unhas impecáveis por até 15 dias sem descamar, com secagem instantânea na cabine UV/LED.',
    durationMinutes: 60,
    price: 60,
    includesInfo: 'Inclui cutilagem completa. Não possui manutenção.',
    benefits: [
      'Brilho espelhado que não sai com o tempo',
      'Não descasca nas tarefas do dia a dia',
      'Secagem imediata na cabine UV/LED',
      'Inclui cutilagem russa/combinada'
    ],
    imageUrl: '/portfolio/nail-3.jpg',
    isPopular: false,
    postCareTips: [
      'Não remova o esmalte em gel puxando ou lascando com os dentes.',
      'A remoção deve ser feita no studio com produto específico para não ferir a unha.',
      'Use óleo de cutículas para prolongar o viço.'
    ]
  },
  {
    id: 'proc-manutencao',
    name: 'Manutenção de Alongamento / Banho',
    category: 'manutencao',
    description: 'Nivelamento da área de crescimento, reposição do gel, higienização, renovação do formato e nova esmaltação.',
    durationMinutes: 90,
    price: 70,
    includesInfo: 'Inclui cutilagem, esmaltação em gel e um par de encapsuladas',
    benefits: [
      'Reequilibra o ponto de tensão e evita quebras',
      'Renova a cor e a decoração da semana',
      'Inclui cutilagem e par de encapsuladas'
    ],
    imageUrl: '/portfolio/nail-2.jpg',
    isPopular: false,
    postCareTips: [
      'Agende sua próxima manutenção com 1 mês de antecedência para garantir seu horário.'
    ]
  }
];

export const initialRealPortfolio: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Alongamento Amendoado com Encapsulada & Ouro',
    category: 'encapsuladas',
    description: 'Tons terrosos mármore com detalhes tridimensionais e moldura em folha dourada.',
    imageUrl: '/portfolio/nail-1.jpg',
    tag: 'Encapsulada Luxo'
  },
  {
    id: 'port-2',
    title: 'Francesa Reversa com Borda Dourada & Glitter',
    category: 'encapsuladas',
    description: 'Stiletto sofisticada com acabamento cintilante e linha metálica fina.',
    imageUrl: '/portfolio/nail-2.jpg',
    tag: 'Francesa Reversa'
  },
  {
    id: 'port-3',
    title: 'Efeito Shimmer Glaze Rose Gold',
    category: 'veludo',
    description: 'Unhas quadradas com pó perolado cromado e brilho espelhado contínuo.',
    imageUrl: '/portfolio/nail-3.jpg',
    tag: 'Efeito Glaze'
  },
  {
    id: 'port-4',
    title: 'Nail Art Y2K / Cyber Estelar',
    category: 'nail_art',
    description: 'Olho centralizado, traços manuais góticos e pedrarias delicadas.',
    imageUrl: '/portfolio/nail-4.jpg',
    tag: 'Nail Art Criativa'
  },
  {
    id: 'port-5',
    title: 'Design Chrome Metálico Futurista com Piercing',
    category: 'nail_art',
    description: 'Degradê fumê, relevo cromado prata líquido e piercing de unha.',
    imageUrl: '/portfolio/nail-5.jpg',
    tag: 'Cromado & Piercing'
  },
  {
    id: 'port-6',
    title: 'Efeito Olho de Gato / Veludo Magnético Mauve',
    category: 'veludo',
    description: 'Movimento de luz magnética tridimensional nas unhas quadradas.',
    imageUrl: '/portfolio/nail-6.jpg',
    tag: 'Olho de Gato'
  },
  {
    id: 'port-7',
    title: 'Stiletto Nude com Traços Prata & Laço Delicado',
    category: 'encapsuladas',
    description: 'Glitter prateado refletivo, curvas finas e laço em relevo.',
    imageUrl: '/portfolio/nail-7.jpg',
    tag: 'Romântica & Glitter'
  },
  {
    id: 'port-8',
    title: 'Estrelas Douradas & Constelações Nude',
    category: 'encapsuladas',
    description: 'Amendoada com francesinha dourada fluida e estrelas cadentes pintadas à mão.',
    imageUrl: '/portfolio/nail-8.jpg',
    tag: 'Constelação'
  },
  {
    id: 'port-9',
    title: 'Galáxia Noturna com Estrelas & Ouro',
    category: 'nail_art',
    description: 'Base azul profunda cósmica com detalhes celestiais cintilantes.',
    imageUrl: '/portfolio/nail-9.jpg',
    tag: 'Galáxia Cósmica'
  },
  {
    id: 'port-10',
    title: 'Tartan / Xadrez Nobre & Coração Vinho',
    category: 'nail_art',
    description: 'Padrão xadrez alfaiataria em tons de bordô, preto e coração profundo.',
    imageUrl: '/portfolio/nail-10.jpg',
    tag: 'Xadrez & Vinho'
  },
  {
    id: 'port-11',
    title: 'Mix Outonal: Xadrez, Corações & Glitter Azul',
    category: 'nail_art',
    description: 'Combinação harmônica de verde oliva, tons terracota e degradê brilhante.',
    imageUrl: '/portfolio/nail-11.jpg',
    tag: 'Mix Autoral'
  },
  {
    id: 'port-12',
    title: 'Florais Mimosos & Francesa Marrom Suave',
    category: 'florais',
    description: 'Mini margaridas artesanais pintadas pétala por pétala com traço chocolate.',
    imageUrl: '/portfolio/nail-12.jpg',
    tag: 'Florais Delicados'
  },
  {
    id: 'port-13',
    title: 'Blue Sky com Margaridinhas Brancas',
    category: 'florais',
    description: 'Azul celeste cintilante com flores brancas e miolo dourado.',
    imageUrl: '/portfolio/nail-13.jpg',
    tag: 'Primavera'
  },
  {
    id: 'port-14',
    title: 'Amendoada Floral Terracota & Linhas Duplas',
    category: 'florais',
    description: 'Arte botânica delicada em tons quentes de nude e café.',
    imageUrl: '/portfolio/nail-14.jpg',
    tag: 'Botânica Nude'
  },
  {
    id: 'port-15',
    title: 'Ghostface & Hearts Rosa Chiclete',
    category: 'nail_art',
    description: 'Temática criativa estilizada com brilhos, gotas e corações.',
    imageUrl: '/portfolio/nail-15.jpg',
    tag: 'Temática Pop'
  }
];

// Base com clientes do Studio
export const initialClients: Client[] = [
  {
    id: 'cli-teste-rapha',
    name: 'Cliente Teste (Rapha)',
    phone: '(79) 99999-9999',
    birthDate: '2000-01-01',
    firstVisitDate: '2026-09-22',
    lastVisitDate: '2026-09-22',
    source: 'instagram',
    isNewClient: true,
    favoriteProcedures: ['Alongamento de Unhas'],
    skinNotes: 'Perfil exclusivo de teste para Raphaely experimentar a área da cliente e simular agendamentos.',
    totalAppointments: 0,
    totalSpent: 0,
    avatarUrl: '/portfolio/nail-1.jpg'
  },
  {
    id: 'cli-camila',
    name: 'Camila Rocha',
    phone: '(79) 99876-5432',
    birthDate: '1995-09-24', // Aniversário em 3 dias!
    firstVisitDate: '2026-03-10',
    lastVisitDate: '2026-08-25',
    source: 'instagram',
    isNewClient: false,
    favoriteProcedures: ['Alongamento de Unhas', 'Manutenção de Alongamento'],
    skinNotes: 'Cutículas finas. Prefere formato amendoado tamanho médio.',
    totalAppointments: 4,
    totalSpent: 730,
    avatarUrl: '/portfolio/nail-1.jpg'
  },
  {
    id: 'cli-aline',
    name: 'Aline Costa',
    phone: '(79) 99911-2233',
    birthDate: '1996-09-28', // Aniversário em 7 dias!
    firstVisitDate: '2026-05-10',
    lastVisitDate: '2026-08-15',
    source: 'indicacao',
    isNewClient: false,
    favoriteProcedures: ['Esmaltação em Gel'],
    skinNotes: 'Unhas curtas naturais, esmaltação em tons nudes.',
    totalAppointments: 2,
    totalSpent: 180,
    avatarUrl: '/portfolio/nail-3.jpg'
  },
  {
    id: 'cli-sabrina',
    name: 'Sabrina Rocha',
    phone: '(79) 99888-7766',
    birthDate: '1999-10-05', // Aniversário em 14 dias!
    firstVisitDate: '2026-06-20',
    lastVisitDate: '2026-08-22',
    source: 'instagram',
    isNewClient: false,
    favoriteProcedures: ['Banho de Gel'],
    skinNotes: 'Unhas compridas em crescimento.',
    totalAppointments: 3,
    totalSpent: 290,
    avatarUrl: '/portfolio/nail-6.jpg'
  },
  {
    id: 'cli-mariana-alves',
    name: 'Mariana Alves',
    phone: '(79) 99123-4567',
    birthDate: '1992-05-14',
    firstVisitDate: '2025-11-15',
    lastVisitDate: '2026-07-11', // Há 72 dias sem agendar!
    source: 'indicacao',
    isNewClient: false,
    favoriteProcedures: ['Alongamento de Unhas'],
    skinNotes: 'Cliente sumida há mais de 70 dias para reativação com mimo.',
    totalAppointments: 2,
    totalSpent: 260,
    avatarUrl: '/portfolio/nail-2.jpg'
  },
  {
    id: 'cli-juliana-prado',
    name: 'Juliana Prado',
    phone: '(79) 99345-6789',
    birthDate: '1997-09-24', // Aniversário em 3 dias!
    firstVisitDate: '2026-04-12',
    lastVisitDate: '2026-08-30',
    source: 'trafego_pago',
    isNewClient: false,
    favoriteProcedures: ['Nail Art Autoral'],
    skinNotes: 'Ama decorações cósmicas e francesinhas finas.',
    totalAppointments: 3,
    totalSpent: 350,
    avatarUrl: '/portfolio/nail-8.jpg'
  },
  {
    id: 'cli-bruna-tavares',
    name: 'Bruna Tavares',
    phone: '(79) 99444-5555',
    birthDate: '1994-09-22', // Aniversário Amanhã!
    firstVisitDate: '2026-06-01',
    lastVisitDate: '2026-09-02',
    source: 'instagram',
    isNewClient: false,
    favoriteProcedures: ['Alongamento de Unhas'],
    skinNotes: 'Prefere formato quadrado com bordas arredondadas.',
    totalAppointments: 2,
    totalSpent: 260,
    avatarUrl: '/portfolio/nail-4.jpg'
  },
  {
    id: 'cli-lua-mendonca',
    name: 'LUA MENDONÇA',
    phone: '(79) 99777-6655',
    birthDate: '1998-09-24',
    firstVisitDate: '2026-07-10',
    lastVisitDate: '2026-09-05',
    source: 'indicacao',
    isNewClient: false,
    favoriteProcedures: ['Banho de Gel'],
    skinNotes: 'Unhas amendoadas delicadas.',
    totalAppointments: 2,
    totalSpent: 210,
    avatarUrl: '/portfolio/nail-7.jpg'
  },
  {
    id: 'cli-renan-alves',
    name: 'Renan Alves',
    phone: '(79) 99111-0000',
    birthDate: '1993-09-29',
    firstVisitDate: '2026-01-10',
    lastVisitDate: '2026-09-10',
    source: 'outros',
    isNewClient: false,
    favoriteProcedures: ['Cutilagem Especial'],
    skinNotes: 'Apoiador número 1 do Studio Rapha!',
    totalAppointments: 4,
    totalSpent: 400,
    avatarUrl: ''
  },
  {
    id: 'cli-larissa',
    name: 'Larissa Albuquerque',
    phone: '(79) 99789-0123',
    birthDate: '2001-09-30',
    firstVisitDate: '2026-09-18',
    lastVisitDate: '2026-09-18',
    source: 'trafego_pago',
    isNewClient: true,
    favoriteProcedures: ['Alongamento de Unhas'],
    skinNotes: 'Nova cliente vinda de tráfego pago.',
    totalAppointments: 1,
    totalSpent: 130,
    avatarUrl: '/portfolio/nail-10.jpg'
  },
  {
    id: 'cli-rafaela-dias',
    name: 'Rafaela Dias',
    phone: '(79) 99555-4433',
    birthDate: '1994-11-12',
    firstVisitDate: '2026-08-10',
    lastVisitDate: '2026-09-20',
    source: 'instagram',
    isNewClient: true,
    favoriteProcedures: ['Manutenção de Alongamento'],
    skinNotes: 'Atendimento marcado para amanhã!',
    totalAppointments: 1,
    totalSpent: 70,
    avatarUrl: '/portfolio/nail-12.jpg'
  },
  {
    id: 'cli-beatriz',
    name: 'Beatriz Vasconcelos',
    phone: '(79) 99654-3210',
    birthDate: '1998-09-28',
    firstVisitDate: '2026-05-18',
    lastVisitDate: '2026-08-05',
    source: 'trafego_pago',
    isNewClient: false,
    favoriteProcedures: ['Banho de Gel'],
    skinNotes: 'Gosta de decorações florais.',
    totalAppointments: 3,
    totalSpent: 290,
    avatarUrl: '/portfolio/nail-13.jpg'
  },
  {
    id: 'cli-isabela',
    name: 'Isabela Dantas',
    phone: '(79) 99222-3344',
    birthDate: '1991-03-15',
    firstVisitDate: '2026-02-10',
    lastVisitDate: '2026-08-20',
    source: 'indicacao',
    isNewClient: false,
    favoriteProcedures: ['Alongamento de Unhas'],
    skinNotes: 'Stiletto com francesinha dourada.',
    totalAppointments: 3,
    totalSpent: 390,
    avatarUrl: '/portfolio/nail-14.jpg'
  },
  {
    id: 'cli-priscila',
    name: 'Priscila Fontes',
    phone: '(79) 99333-2211',
    birthDate: '1995-12-05',
    firstVisitDate: '2026-09-15',
    lastVisitDate: '2026-09-15',
    source: 'trafego_pago',
    isNewClient: true,
    favoriteProcedures: ['Alongamento de Unhas'],
    skinNotes: 'Nova cliente.',
    totalAppointments: 1,
    totalSpent: 130,
    avatarUrl: '/portfolio/nail-15.jpg'
  }
];

// Agenda começa em branco para uso real
export const initialAppointments: Appointment[] = [];

// Transações Financeiras (Faturamento R$ 1.250 | Despesas R$ 2.360 | Resultado -R$ 1.110)
export const initialTransactions: Transaction[] = [
  // Receitas (Total R$ 1.250)
  { id: 'tr-rec-1', type: 'receita', description: 'Alongamento em Gel - Camila Rocha', amount: 130, category: 'atendimento', date: '2026-09-02' },
  { id: 'tr-rec-2', type: 'receita', description: 'Banho de Gel - Sabrina Rocha', amount: 80, category: 'atendimento', date: '2026-09-05' },
  { id: 'tr-rec-3', type: 'receita', description: 'Alongamento + Nail Art - Bruna Tavares', amount: 170, category: 'atendimento', date: '2026-09-08' },
  { id: 'tr-rec-4', type: 'receita', description: 'Manutenção em Gel - Camila Rocha', amount: 70, category: 'atendimento', date: '2026-09-12' },
  { id: 'tr-rec-5', type: 'receita', description: 'Alongamento em Gel - Priscila Fontes', amount: 130, category: 'atendimento', date: '2026-09-15' },
  { id: 'tr-rec-6', type: 'receita', description: 'Esmaltação em Gel - Aline Costa', amount: 60, category: 'atendimento', date: '2026-09-16' },
  { id: 'tr-rec-7', type: 'receita', description: 'Alongamento Tips - Larissa Albuquerque', amount: 130, category: 'atendimento', date: '2026-09-18' },
  { id: 'tr-rec-8', type: 'receita', description: 'Atendimentos Anteriores do Mês', amount: 480, category: 'atendimento', date: '2026-09-10' },

  // Despesas (Total R$ 2.360)
  { id: 'tr-desp-1', type: 'despesa', description: 'Aluguel do Espaço / Studio', amount: 900, category: 'aluguel', date: '2026-09-05' },
  { id: 'tr-desp-2', type: 'despesa', description: 'Reposição de Géis, Tips, Lixas e Brocas', amount: 330, category: 'materiais', date: '2026-09-08' },
  { id: 'tr-desp-3', type: 'despesa', description: 'Energia Elétrica & Climatização', amount: 280, category: 'energia', date: '2026-09-10' },
  { id: 'tr-desp-4', type: 'despesa', description: 'Anúncios Instagram / Tráfego Pago', amount: 440, category: 'marketing', date: '2026-09-12' },
  { id: 'tr-desp-5', type: 'despesa', description: 'Taxas bancárias e outros custos', amount: 410, category: 'outros', date: '2026-09-15' }
];

// Feedbacks / Avaliações Reais
export const initialFeedbacks: Feedback[] = [
  {
    id: 'feed-1',
    clientId: 'cli-camila',
    clientName: 'Camila Rocha',
    procedureName: 'Manutenção de Alongamento',
    stars: 5,
    comment: 'A Rapha tem um capricho que nunca vi igual em Aracaju! Minhas unhas duram 30 dias sem quebrar ou soltar. O atendimento é maravilhoso!',
    createdAt: '2026-09-16T15:00:00.000Z',
    status: 'publicado',
    avatarUrl: '/portfolio/nail-1.jpg'
  },
  {
    id: 'feed-2',
    clientId: 'cli-sabrina',
    clientName: 'Sabrina Rocha',
    procedureName: 'Banho de Gel & Encapsulada',
    stars: 5,
    comment: 'O banho de gel salvou minhas unhas! Elas eram super frágeis e agora cresceram lindas e fortes. Recomendo de olhos fechados.',
    createdAt: '2026-09-10T18:30:00.000Z',
    status: 'publicado',
    avatarUrl: '/portfolio/nail-6.jpg'
  },
  {
    id: 'feed-3',
    clientId: 'cli-bruna-tavares',
    clientName: 'Bruna Tavares',
    procedureName: 'Alongamento em Gel com Nail Art',
    stars: 5,
    comment: 'Levei uma foto do Pinterest super detalhada e ela fez ainda mais bonita! Nota mil.',
    createdAt: '2026-09-09T14:20:00.000Z',
    status: 'publicado',
    avatarUrl: '/portfolio/nail-4.jpg'
  }
];

export const initialTestimonials = initialFeedbacks;

export const initialScheduleSettings: ScheduleSettings = {
  workingDays: [2, 3, 4, 5, 6], // Terça a Sábado
  defaultSlots: ['09:00', '11:00', '14:00', '16:00', '18:00'],
  vacationPeriods: [
    {
      id: 'vac-1',
      startDate: '2026-10-12',
      endDate: '2026-10-18',
      label: 'Recesso da Rapha (Semana da Criança)'
    }
  ],
  blockedDates: [],
  blockedShifts: [
    {
      id: 'shift-1',
      date: '2026-09-25',
      shift: 'manha',
      reason: 'Curso de Especialização Nail Art'
    }
  ],
  blockedSlots: [
    {
      id: 'slot-1',
      date: '2026-09-24',
      time: '18:00',
      reason: 'Compromisso Pessoal'
    }
  ]
};
