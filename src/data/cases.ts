export interface CaseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  videos?: string[];
  details: string;
  date: string;
  location: string;
  cargo: string;
  weight?: string;
  volume?: string;
}

export const casesData: CaseItem[] = [
  // Автоперевозки
  {
    id: 'auto-1',
    title: 'Международная перевозка оборудования',
    description: 'Доставка промышленного оборудования из Китая в Казахстан',
    category: 'auto',
    images: [
      '/assets/images/auto-case.jpg'
    ],
    videos: [
      '/assets/cases/auto/Перевозка автомобильным транспортом.mp4',
      '/assets/cases/auto/Перевозки автотранспортом.mp4',
      '/assets/cases/auto/Перевозки автотранспортом 2.mp4'
    ],
    details: 'Организовали полный цикл доставки промышленного оборудования из Шанхая в Алматы. Включал таможенное оформление, страхование и сопровождение груза.',
    date: '2024-06-15',
    location: 'Шанхай → Алматы',
    cargo: 'Промышленное оборудование',
    weight: '15 тонн',
    volume: '45 м³'
  },
  {
    id: 'auto-2',
    title: 'Перевозка сборных грузов',
    description: 'Консолидация и доставка малых партий из разных отправителей',
    category: 'auto',
    images: [
      '/assets/images/warehouse-case.jpg'
    ],
    videos: [
      '/assets/cases/container/Контейнерные перевозки автотранспортом.mp4'
    ],
    details: 'Успешно консолидировали 8 малых партий от разных отправителей в один контейнер. Оптимизировали маршрут и снизили стоимость для клиентов.',
    date: '2024-07-20',
    location: 'Гуанчжоу → Москва',
    cargo: 'Электроника, текстиль, игрушки',
    weight: '8 тонн',
    volume: '25 м³'
  },

  // ЖД перевозки
  {
    id: 'rail-1',
    title: 'Перевозка глины Казахстан-Россия',
    description: 'Регулярные перевозки по ТМТМ',
    category: 'rail',
    images: [
      '/assets/cases/rail/rail-case-1.png',
      '/assets/cases/rail/rail-case-2.png',
      '/assets/cases/rail/rail-case-3.png',
      '/assets/cases/rail/rail-case-4.png'
    ],
    videos: [
      '/assets/cases/rail/Перевозки жд транспортом.mp4',
      '/assets/cases/rail/Перевозки жд транспортом 2.mp4',
      '/assets/cases/rail/Перевозки жд транспортом 3.mp4',
      '/assets/cases/rail/Перевозки жд транспортом 4.mp4'
    ],
    details: 'Организовали регулярные перевозки глины по маршруту Казахстан-Россия через ТМТМ. Время в пути: 14 дней.',
    date: '2024-08-01',
    location: 'Казахстан → Россия',
    cargo: 'Глина',
    weight: '120 тонн',
    volume: '200 м³'
  },
  {
    id: 'rail-2',
    title: 'Перевозка негабаритного оборудования',
    description: 'Доставка крупногабаритного оборудования для нефтегазовой отрасли',
    category: 'oversize',
    images: [
      '/assets/cases/rail/rail-case-2.png',
      '/assets/cases/rail/rail-case-3.png',
      '/assets/cases/rail/rail-case-4.png'
    ],
    details: 'Специальная перевозка негабаритного оборудования для нефтегазовой отрасли. Разработали специальный маршрут с учетом габаритов.',
    date: '2024-07-10',
    location: 'Далянь → Новосибирск',
    cargo: 'Нефтегазовое оборудование',
    weight: '45 тонн',
    volume: '80 м³'
  },

  // Мультимодальные перевозки
  {
    id: 'multimodal-1',
    title: 'Комбинированная доставка из Китая',
    description: 'Морская + железнодорожная + автомобильная доставка',
    category: 'multimodal',
    images: [
      '/assets/images/multimodal-transport.jpg'
    ],
    videos: [
      '/assets/cases/oversize/Перевозка Негабаритных грузов.mp4'
    ],
    details: 'Организовали сложную мультимодальную перевозку: морем из Шанхая во Владивосток, затем по железной дороге до Екатеринбурга, и автомобилем до места назначения.',
    date: '2024-06-30',
    location: 'Шанхай → Екатеринбург',
    cargo: 'Промышленное оборудование',
    weight: '25 тонн',
    volume: '60 м³'
  },

  // Проектные перевозки
  {
    id: 'project-1',
    title: 'Перевозка строительной техники',
    description: 'Доставка крупногабаритной строительной техники',
    category: 'project',
    images: [
      '/assets/images/project-cargo.jpg'
    ],
    videos: [
      '/assets/cases/project/Проектная перевозка автомобильным транспортом.mp4'
    ],
    details: 'Специальная перевозка строительной техники для крупного инфраструктурного проекта. Включила разработку маршрута, получение разрешений и сопровождение.',
    date: '2024-08-15',
    location: 'Пекин → Астана',
    cargo: 'Строительная техника',
    weight: '35 тонн',
    volume: '90 м³'
  },

  // Контейнерные перевозки
  {
    id: 'container-1',
    title: 'Регулярные контейнерные перевозки',
    description: 'Еженедельные контейнерные рейсы между портами',
    category: 'container',
    images: [
      '/assets/cases/rail/Перевозки жд транспортом 4.jpeg'
    ],
    videos: [
      '/assets/cases/container/Контейнерные перевозки автотранспортом.mp4'
    ],
    details: 'Организовали регулярные контейнерные перевозки между китайскими и российскими портами. Стабильное расписание и конкурентные цены.',
    date: '2024-08-10',
    location: 'Циндао → Санкт-Петербург',
    cargo: 'Контейнеры 20GP, 40HC',
    weight: '80 тонн',
    volume: '150 м³'
  },

  // Опасные грузы
  {
    id: 'dangerous-1',
    title: 'Перевозка химических веществ',
    description: 'Безопасная транспортировка опасных химических материалов',
    category: 'customs',
    images: [
      '/assets/images/customs-new.jpg'
    ],
    videos: [
      '/assets/cases/customs/Таможенная перевозка автомобильным транспортом.mp4'
    ],
    details: 'Специальная перевозка опасных химических веществ с соблюдением всех международных стандартов безопасности. Включила специальную упаковку и сопровождение.',
    date: '2024-07-25',
    location: 'Нанкин → Екатеринбург',
    cargo: 'Химические вещества',
    weight: '12 тонн',
    volume: '30 м³'
  },

  // Дополнительные кейсы для ЖД
  {
    id: 'rail-3',
    title: 'Перевозка автомобилей по железной дороге',
    description: 'Массовая перевозка легковых автомобилей из Китая',
    category: 'rail',
    images: [
      '/assets/images/railway-case.jpg',
      '/assets/images/train-cargo.jpg',
      '/assets/images/auto-case.jpg'
    ],
    details: 'Организовали перевозку партии из 50 легковых автомобилей из Китая в Россию. Специальные вагоны-автомобилевозы обеспечили безопасность транспортировки.',
    date: '2024-07-05',
    location: 'Чанчунь → Москва',
    cargo: 'Легковые автомобили',
    weight: '75 тонн',
    volume: '120 м³'
  },

  // Дополнительные кейсы для автоперевозок
  {
    id: 'auto-3',
    title: 'Экспресс-доставка срочного груза',
    description: 'Срочная доставка важного оборудования',
    category: 'auto',
    images: [
      '/assets/images/auto-case.jpg',
      '/assets/images/truck-velta-trans.jpg',
      '/assets/images/warehouse-case.jpg'
    ],
    details: 'Выполнили срочную доставку критически важного оборудования для нефтеперерабатывающего завода. Время в пути: 72 часа вместо стандартных 7 дней.',
    date: '2024-08-20',
    location: 'Урумчи → Омск',
    cargo: 'Критическое оборудование',
    weight: '5 тонн',
    volume: '15 м³'
  }
];

export const getCasesByCategory = (category: string): CaseItem[] => {
  return casesData.filter(item => item.category === category);
};

export const getAllCases = (): CaseItem[] => {
  return casesData;
};

export const getCaseById = (id: string): CaseItem | undefined => {
  return casesData.find(item => item.id === id);
};

export const categories = [
  { id: 'auto', name: 'Автоперевозки', count: casesData.filter(c => c.category === 'auto').length },
  { id: 'rail', name: 'ЖД перевозки', count: casesData.filter(c => c.category === 'rail').length },
  { id: 'multimodal', name: 'Мультимодальные', count: casesData.filter(c => c.category === 'multimodal').length },
  { id: 'project', name: 'Проектные', count: casesData.filter(c => c.category === 'project').length },
  { id: 'container', name: 'Контейнерные', count: casesData.filter(c => c.category === 'container').length },
  { id: 'oversize', name: 'Негабаритные', count: casesData.filter(c => c.category === 'oversize').length },
  { id: 'customs', name: 'Таможенные', count: casesData.filter(c => c.category === 'customs').length }
];
