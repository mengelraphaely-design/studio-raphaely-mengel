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

// Base inicial de clientes do Studio (Começa limpa com 1 cliente teste para Rapha)
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
  }
];

// Agenda começa em branco para uso real
export const initialAppointments: Appointment[] = [];

// Transações Financeiras começam em branco (R$ 0)
export const initialTransactions: Transaction[] = [];

// Feedbacks / Avaliações Reais
// Feedbacks começam em branco para receber depoimentos reais das clientes
export const initialFeedbacks: Feedback[] = [];

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
