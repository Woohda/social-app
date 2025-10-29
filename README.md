# 🌐 Social App

Полнофункциональное социальное веб-приложение, созданное на **Next.js 15**, с поддержкой **аутентификации (Lucia Auth)**, **реактивных данных (React Query)**, **редактирования постов (Tiptap)** и **чата (Stream Chat)**. Приложение адаптировано под современный стек разработки и готово к деплою на **Vercel**.

---

## 🚀 Технологии

| Категория               | Технологии                                      |
| ----------------------- | ----------------------------------------------- |
| **Фреймворк**           | Next.js 15 (App Router)                         |
| **Язык**                | TypeScript                                      |
| **UI / Компоненты**     | Shadcn/ui, Tailwind CSS, Radix UI, Lucide Icons |
| **Аутентификация**      | Lucia + Prisma                                  |
| **База данных**         | PostgreSQL (через Prisma ORM)                   |
| **API**                 | Next.js API Routes, Ky                          |
| **Формы**               | React Hook Form + Zod                           |
| **Редактор постов**     | Tiptap                                          |
| **Чат**                 | Stream Chat + stream-chat-react                 |
| **Файлы**               | UploadThing                                     |
| **Состояние и запросы** | React Query                                     |
| **Стили**               | Tailwind                                        |
| **Билд/линт**           | ESLint, Prettier, Prisma CLI                    |
| **Деплой**              | Versel                                          |
|                         |

## ⚙️ Установка и запуск

### 1. Клонируй репозиторий

```bash
git clone https://github.com/yourusername/social-app.git
cd social-app
```

### 2. Установи зависимости

```bash
npm install
```

### 3. Настрой .env

Создай файл .env в корне проекта и добавь переменные окружения:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/socialapp"
LUCIA_SECRET="your_lucia_secret"
STREAM_API_KEY="your_stream_api_key"
STREAM_API_SECRET="your_stream_api_secret"
UPLOADTHING_TOKEN="your_uploadthing_secret"
```

\*(при деплое на Vercel добавь эти переменные в Settings → Environment Variables)

### 4. Сгенерируй Prisma

```bash
npx prisma generate
```

### 5. Запусти приложение

Development:

```bash
npm run dev
```

Production:

```bash
npm run build && npm start
```

## 🧩 Основные фичи

- 🔐 Регистрация и вход через Lucia Auth

- 👤 Профиль пользователя с загрузкой аватара

- 📝 Создание и редактирование постов с Tiptap

- 💬 Чат в реальном времени (Stream Chat)

- 📂 Загрузка файлов и изображений через UploadThing

- 🌗 Темная и светлая темы

- ⚡ SSR + CSR гибридный рендеринг

- 🧠 Типизированные безопасные запросы через React Query и Zod

- 🧱 Компоненты из Shadcn/ui

---

## 🧱 Структура проекта

```
.
├── prisma/               # Схемы базы данных
├── public/               # Public files
├── src/
│   ├── app/              # App Router (страницы и layout)
│   ├── assets/           # Изображения, иконки, статические ассеты
│   ├── components/       # UI-компоненты (shared)
│   ├── features/         # Фичи (логические модули)
│   ├── hooks/            # Кастомные хуки
│   ├── lib/              # Вспомогательные утилиты (auth, db, ky, stream, types, utils)
│   ├── widgets           # Виджеты (составные части интерфейса)
│   ├── auth.ts           # Инициализация Lucia Auth
├── eslintrc.json         # Настройка линтера EsLint
├── next.config.js        # Конфигурация Next.js
├── tailwind.config.js    # Конфигурация TailwindCSS
├── tsconfig.json         # Конфигурация TypeScript
├── vercel.json           # Настройки деплоя на Vercel
└── package.json
```

## 🧪 Скрипты

| Скрипт            | Назначение                                         |
| ----------------- | -------------------------------------------------- |
| **npm run dev**   | Запуск локального сервера разработки               |
| **npm run build** | Билд приложения (генерация Prisma + Next.js build) |
| **npm start**     | Запуск production-сервера                          |
| **npm run lint**  | Проверка ESLint                                    |

## 🖥️ Деплой

1. Задеплой проект на Vercel.

2. Убедись, что все переменные окружения настроены.

3. Нажми “Deploy” — сборка произойдёт автоматически.

## 🧑‍💻 Автор

- Разработано на Next 15 и TypeScript.
- Автор: Vlad
- Stack: React.js, Next.js, TypeScript, Lucia, Prisma, Versel, Tailwind CSS...
