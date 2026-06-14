# Развёртывание FicPulse

Инструкция для Visual Studio / локальной разработки и хостинга на сайте.

## Требования

- **Node.js** 20 или новее ([скачать](https://nodejs.org/))
- **npm** (идёт вместе с Node.js)
- Для Visual Studio: расширение **Node.js development** (опционально)

## Быстрый старт в Visual Studio

1. Распакуйте архив `ficpulse.zip` в удобную папку
2. Откройте папку проекта: **File → Open → Folder** (или через терминал)
3. Откройте встроенный терминал (**View → Terminal**)
4. Выполните команды:

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

5. Откройте в браузере: http://localhost:3000

## Демо-аккаунты

| Логин | Пароль |
|-------|--------|
| `anna_writer` | `demo123` |
| `max_reader` | `demo123` |

## Новые возможности

- **Обложки** — загрузка при создании фанфика или на странице истории (для автора)
- **Уведомления** — подписки, лайки, комментарии, новые главы, сообщения
- **Личные сообщения** — переписка между пользователями (`/messages`)

## Хостинг на Vercel (бесплатно)

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Установите Vercel CLI: `npm i -g vercel`
3. В папке проекта: `vercel`
4. Добавьте переменные окружения в панели Vercel:
   - `DATABASE_URL` — для SQLite на Vercel лучше использовать [Turso](https://turso.tech) (бесплатный облачный SQLite)
   - `JWT_SECRET` — случайная длинная строка

> **Важно:** На Vercel файловая система временная — загруженные обложки не сохраняются между деплоями. Для продакшена подключите [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) или S3.

## Хостинг на своём VPS / сервере

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run build
npm start
```

Сайт будет на порту 3000. Настройте nginx как reverse proxy:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

Папка `public/uploads/covers/` должна быть доступна для записи — туда сохраняются обложки.

## Переменные окружения

Скопируйте `.env.example` в `.env`:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="ваш-секретный-ключ"
```

## Структура проекта

```
ficpulse/
├── prisma/           # Схема БД и миграции
├── public/uploads/   # Загруженные обложки
├── src/
│   ├── app/          # Страницы Next.js
│   ├── components/   # UI-компоненты
│   └── lib/          # Логика, auth, actions
├── package.json
└── vercel.json       # Конфиг для Vercel
```

## Полезные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск для разработки |
| `npm run build` | Сборка для продакшена |
| `npm start` | Запуск собранного сайта |
| `npm run db:seed` | Заполнить демо-данными |
| `npm run db:migrate` | Применить миграции БД |
