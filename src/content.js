// Add a public business email to enable the "Open in email" action.
// Keep passwords, SMTP credentials and other secrets out of frontend code.
export const profile = {
  name: 'Максим',
  email: '',
  github: 'https://github.com/maxx52',
  githubLabel: 'github.com/maxx52',
}

export const projects = [
  {
    id: 'daric', title: 'DaricKeyboard', category: 'Android', type: 'Клавиатура для Android',
    symbol: 'D', artwork: 'keyboard', tags: ['Kotlin', 'Jetpack Compose', 'Android'],
    description: 'Клавиатура, которую можно настроить под себя: темы, подсказки, GIF и удобная работа с текстом.',
    task: 'Собрать в одном приложении повседневный ввод текста и возможность сделать общение ярче.',
    features: ['Подсказки и автоматическая пунктуация', 'Темы, фоны и ряд цифр', 'GIF, эмодзи и меню знаков препинания', 'Удержание клавиши для непрерывного удаления'],
    link: 'https://www.rustore.ru/catalog/app/ru.maxx52.daric', linkText: 'Посмотреть в RuStore',
  },
  {
    id: 'pulse', title: 'PulsePlayer', category: 'Android', type: 'Музыкальный плеер',
    symbol: 'P', artwork: 'player', tags: ['Kotlin', 'Android', 'Локальная музыка'],
    description: 'Плеер для музыки на телефоне. Поиск треков, личные плейлисты и управление воспроизведением с экрана блокировки.',
    task: 'Сделать удобный способ слушать собственную музыкальную библиотеку на Android.',
    features: ['Поиск и воспроизведение файлов на телефоне', 'Плейлисты и избранные композиции', 'Управление с экрана блокировки'],
    link: 'https://github.com/maxx52/PulsePlayer', linkText: 'Посмотреть на GitHub',
  },
  {
    id: 'holy', title: 'HolyPresenter', category: 'Desktop', type: 'Программа для презентаций',
    symbol: 'H', artwork: 'presenter', tags: ['Kotlin', 'Compose Desktop', 'Windows'],
    description: 'Программа для управления материалами на проекторе: тексты, песни, Библия, изображения, видео и таймер.',
    task: 'Объединить подготовку материалов и управление их выводом во время церковного служения.',
    features: ['Окна управления и проектора', 'Предпросмотр и планировщик', 'Вывод стихов и диапазонов из Библии', 'Таймер, текст, изображения и видео', 'Подключаемые модули и настройки оформления'],
    link: 'https://github.com/maxx52', linkText: 'Профиль разработчика на GitHub',
  },
]

export const services = [
  {number: '01', title: 'Веб-сайты', label: 'ВАШ БИЗНЕС В ИНТЕРНЕТЕ', description: 'Лендинги, корпоративные сайты и веб-сервисы. Адаптивный интерфейс и понятный путь к целевому действию.', items: ['Vue.js', 'Адаптивная верстка', 'Интерактивные интерфейсы']},
  {number: '02', title: 'Android', label: 'ИДЕЯ В ВАШЕМ КАРМАНЕ', description: 'Приложения для повседневных задач и бизнеса. От структуры экранов до готового приложения.', items: ['Kotlin', 'Jetpack Compose', 'Работа с данными']},
  {number: '03', title: 'Desktop', label: 'ИНСТРУМЕНТЫ ДЛЯ РАБОТЫ', description: 'Программы для компьютера: автоматизация процессов, управление контентом и специализированные инструменты.', items: ['Compose Desktop', 'Windows', 'Индивидуальная логика']},
]
