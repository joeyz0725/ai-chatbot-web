export default {
  common: {
    add: 'Добавить',
    addSuccess: 'Успешно добавлено',
    edit: 'Изменить',
    editSuccess: 'Успешно изменено',
    delete: 'Удалить',
    deleteSuccess: 'Успешно удалено',
    save: 'Сохранить',
    saveSuccess: 'Успешно сохранено',
    reset: 'Сбросить',
    action: 'Действие',
    export: 'Экспорт',
    exportSuccess: 'Успешно экспортировано',
    import: 'Импорт',
    importSuccess: 'Успешно импортировано',
    clear: 'Очистить',
    clearSuccess: 'Успешно очищено',
    yes: 'Да',
    no: 'Нет',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    download: 'Скачать',
    noData: 'Данные отсутствуют',
    wrong: 'Что-то пошло не так. Пожалуйста, попробуйте позже.',
    success: 'Успешно',
    failed: 'Не удалось выполнить',
    verify: 'Подтвердить',
    unauthorizedTips: 'Не авторизовано. Пожалуйста, сначала выполните проверку.',
    stopResponding: 'Прекратить ответ',
  },
  chat: {
    newChatTitle: 'Новый разговор',
    newChatButton: 'Начать новый чат',
    placeholder: 'Общайтесь с ChatGPT...',
    placeholderMobile: 'Общайтесь с ChatGPT...',
    copy: 'Копировать',
    copied: 'Успешно скопировано',
    copyCode: 'Копировать код',
    clearChat: 'Очистить чат',
    clearChatConfirm: 'Вы уверены, что хотите очистить весь текущий чат?',
    exportImage: 'Сохранить чат в изображение',
    exportImageConfirm: 'Хотите сохранить чат в изображение?',
    exportSuccess: 'Успешно сохранено',
    exportFailed: 'Ошибка сохранения',
    usingContext: 'Режим контекста',
    turnOnContext: 'В этом режиме отправка сообщений будет содержать предыдущие записи чата',
    turnOffContext: 'В этом режиме отправка сообщений не будет содержать предыдущие записи чата',
    deleteMessage: 'Удалить сообщение',
    deleteMessageConfirm: 'Вы уверены, что хотите удалить это сообщение?',
    deleteHistoryConfirm: 'Удалить запись об этом чате?',
    clearHistoryConfirm: 'Удалить все сообщения в чате?',
    preview: 'Предварительный просмотр',
    showRawText: 'Показать исходный текст',
    whatToSay: 'Что бы вы хотели сказать ChatGPT сегодня?',
    footerDeclaration: 'Содержание создано с использованием оригинального API OpenAI',
    botInThinking: 'ChatGPT обдумывает...',
  },
  Prompts: {
    Prompt1: 'Он поможет вам составить план',
    content1: 'Самостоятельное путешествие из Гуанчжоу в Пекин, 3 дня и 2 ночи, с конкретными временными метками',
    Prompt2: 'Он может создавать статьи',
    content2: 'Напишите статью о реальных сценариях применения метавселенной',
    Prompt3: 'Он может читать и писать код',
    content3: 'Напишите сценарий на Python для автоматической отправки ежедневных электронных отчетов',
    Prompt4: 'Он может ответить на разнообразные вопросы',
    content4: 'Почему у кошек и собак разная форма зрачков?',
  },
  list: {
    editChat: 'Изменить название чата',
    deleteChat: 'Удалить из списка чатов',
    confirmDelete: 'Вы уверены, что хотите удалить из списка чатов?',
    deleteTitle: 'Подтвердить удаление',
    visitor: 'Посетитель',
    upgrade: 'Обновить',
    upgradeDescription: 'Бессрочное использование без ограничений, возможность сохранения записей чата',
  },
  setting: {
    setting: 'Настройки',
    general: 'Общие',
    advanced: 'Дополнительно',
    config: 'Настройки',
    avatar: 'Аватар',
    name: 'Никнейм',
    description: 'Описание',
    role: 'Роль',
    temperature: 'Температура',
    top_p: 'Top_p',
    resetUserInfo: 'Сбросить информацию о пользователе',
    chatHistory: 'История чата',
    theme: 'Тема',
    language: 'Язык',
    api: 'API',
    reverseProxy: 'Обратный прокси',
    timeout: 'Таймаут',
    socks: 'Socks',
    httpsProxy: 'HTTPS Proxy',
    balance: 'Баланс API',
    monthlyUsage: 'Использование в месяц',
    modifyProfile: 'Редактировать профиль',
    profileTitle: 'Профиль',
    namePlaceholder: 'Введите никнейм',
    dscriptionPlaceholder: 'Введите описание',
    nameEmptywarning: 'Введите никнейм',
    nameExceedwarning: 'Никнейм не может содержать более 15 символов',
    dscriptionExceedwarning: 'Описание не может содержать более 200 символов',
    systemAutoTheme: 'Система (автоматически)',
    lightTheme: 'Светлая тема',
    darkTheme: 'Темная тема',
    logout: 'Выйти',
  },
  store: {
    siderButton: 'Магазин подсказок',
    local: 'Локальные',
    online: 'Онлайн',
    title: 'Заголовок',
    description: 'Описание',
    clearStoreConfirm: 'Вы уверены, что хотите очистить данные?',
    importPlaceholder: 'Вставьте JSON данные сюда',
    addRepeatTitleTips: 'Повторяющийся заголовок. Пожалуйста, введите заново.',
    addRepeatContentTips: 'Повторяющееся содержание: {msg}. Пожалуйста, введите заново.',
    editRepeatTitleTips: 'Конфликт заголовков. Пожалуйста, измените заново.',
    editRepeatContentTips: 'Конфликт содержания: {msg}. Пожалуйста, измените заново.',
    importError: 'Не совпадение ключей',
    importRepeatTitle: 'Повторяющийся заголовок. Пропуск: {msg}',
    importRepeatContent: 'Повторяющееся содержание. Пропуск: {msg}',
    onlineImportWarning: 'Внимание: проверьте источник JSON файла!',
    downloadError: 'Проверьте состояние сети и валидность JSON файла',
  },
}
