# Лабораторная работа: Тестирование API с помощью Postman

**Цель работы:** освоить основные функции Postman для тестирования API: отправка запросов, работа с параметрами, заголовками, телом запроса, тестированием, коллекциями, переменными окружения и написанием автоматизированных тестов.

**Тестовый API:** [JSONPlaceholder](https://jsonplaceholder.typicode.com) — публичный REST API для тестирования.

**Файлы проекта:**
- `postman/Test-API.postman_collection.json` — коллекция запросов
- `postman/Test-Environment.postman_environment.json` — окружение с переменной `baseUrl`
- `postman/results/runner-results.json` — отчёт Collection Runner (JSON)
- `postman/results/runner-results.csv` — отчёт Collection Runner (CSV)

---

## 1. Установка и настройка Postman

1. Скачайте и установите Postman с официального сайта: https://www.postman.com/downloads/
2. Запустите Postman и зарегистрируйтесь или войдите в систему.
3. Ознакомьтесь с интерфейсом:
   - **History** — хранит историю выполненных запросов
   - **Collections** — организация и хранение запросов
   - **New Request** — создание нового запроса
   - **Console** — подробные логи выполнения запросов

> **ВСТАВИТЬ СКРИНШОТ:** главное окно Postman с панелями History, Collections и кнопкой New Request.

**Импорт готовой коллекции:** File → Import → выберите файлы `Test-API.postman_collection.json` и `Test-Environment.postman_environment.json`.

---

## 2. Отправка GET-запроса

1. Создан новый запрос с методом **GET**
2. URL: `https://jsonplaceholder.typicode.com/posts/1`
3. Нажата кнопка **Send**

### Результат

| Параметр | Значение |
|----------|----------|
| Статус-код | **200 OK** |
| Content-Type | `application/json; charset=utf-8` |
| Время ответа | ~58 мс |

**Тело ответа (JSON):**

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
```

> **ВСТАВИТЬ СКРИНШОТ:** GET-запрос с ответом 200 OK и телом JSON.

### Анализ ответа сервера

**Заголовки ответа (основные):**

| Заголовок | Значение |
|-----------|----------|
| content-type | application/json; charset=utf-8 |
| server | cloudflare |
| x-powered-by | Express |
| cache-control | max-age=43200 |

**Body:** объект поста с полями `userId`, `id`, `title`, `body`.

> **ВСТАВИТЬ СКРИНШОТ:** вкладки Headers и Body ответа.

---

## 3. Работа с параметрами запроса

1. URL изменён на: `https://jsonplaceholder.typicode.com/posts`
2. На вкладке **Params** добавлен параметр: `userId = 1`
3. Итоговый URL: `https://jsonplaceholder.typicode.com/posts?userId=1`

### Результат

| Параметр | Значение |
|----------|----------|
| Статус-код | **200 OK** |
| Формат ответа | Массив JSON-объектов |

Сервер вернул **10 постов**, принадлежащих пользователю с `userId = 1`. Каждый объект содержит поля: `userId`, `id`, `title`, `body`.

Пример первого элемента массива:

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "..."
}
```

На вкладке **Preview** данные отображаются в удобном древовидном формате.

> **ВСТАВИТЬ СКРИНШОТ:** вкладка Params с параметром userId и ответ в Preview.

---

## 4. Отправка POST-запроса

1. Метод: **POST**
2. URL: `https://jsonplaceholder.typicode.com/posts`
3. Body → raw → JSON:

```json
{
  "title": "Postman Test",
  "body": "Testing API via Postman",
  "userId": 1
}
```

### Результат

| Параметр | Значение |
|----------|----------|
| Статус-код | **201 Created** |
| Content-Type | `application/json; charset=utf-8` |

**Тело ответа:**

```json
{
  "title": "Postman Test",
  "body": "Testing API via Postman",
  "userId": 1,
  "id": 101
}
```

Сервер вернул объект с **ID нового поста** (`id: 101`). JSONPlaceholder — тестовый API, данные фактически не сохраняются на сервере, но ответ имитирует успешное создание ресурса.

> **ВСТАВИТЬ СКРИНШОТ:** POST-запрос с телом JSON и ответом 201 Created.

---

## 5. Отправка PUT и DELETE запросов

### PUT-запрос (изменение данных)

1. Метод: **PUT**
2. URL: `https://jsonplaceholder.typicode.com/posts/1`
3. Body → raw → JSON:

```json
{
  "id": 1,
  "title": "Updated Title",
  "body": "Updated Body",
  "userId": 1
}
```

**Результат:** статус **200 OK**, данные обновлены:

```json
{
  "id": 1,
  "title": "Updated Title",
  "body": "Updated Body",
  "userId": 1
}
```

> **ВСТАВИТЬ СКРИНШОТ:** PUT-запрос с обновлёнными данными.

### DELETE-запрос (удаление данных)

1. Метод: **DELETE**
2. URL: `https://jsonplaceholder.typicode.com/posts/1`

**Результат:** статус **200 OK**, тело ответа — пустой объект `{}`.

> **ВСТАВИТЬ СКРИНШОТ:** DELETE-запрос со статусом 200 OK.

---

## 6. Использование коллекций и окружений

### Создание коллекции

1. Создана коллекция **«Test API»** с 5 запросами:
   - GET Post by ID
   - GET Posts with userId param
   - POST Create Post
   - PUT Update Post
   - DELETE Post

> **ВСТАВИТЬ СКРИНШОТ:** коллекция Test API со всеми запросами.

### Создание окружения и переменных

1. Создано окружение **«Test Environment»**
2. Добавлена переменная:

| Variable | Value |
|----------|-------|
| baseUrl | https://jsonplaceholder.typicode.com |

3. В запросах URL заменён на формат: `{{baseUrl}}/posts/1`
4. Окружение активировано в правом верхнем углу Postman

> **ВСТАВИТЬ СКРИНШОТ:** окружение Test Environment с переменной baseUrl.

### Collection Runner

Запуск коллекции через **Runner** дал следующие результаты:

| Запрос | Метод | Статус | Тесты |
|--------|-------|--------|-------|
| GET Post by ID | GET | 200 | 3/3 ✓ |
| GET Posts with userId param | GET | 200 | 3/3 ✓ |
| POST Create Post | POST | 201 | 4/4 ✓ |
| PUT Update Post | PUT | 200 | 3/3 ✓ |
| DELETE Post | DELETE | 200 | 1/1 ✓ |

**Итого:** 5 запросов, 14 проверок, 0 ошибок.

> **ВСТАВИТЬ СКРИНШОТ:** результаты Collection Runner.

Отчёт экспортирован в файлы `runner-results.json` и `runner-results.csv`.

---

## 7. Автоматизация тестирования в Postman

### Простой тест (проверка статус-кода)

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

### Дополнительные тесты

**Проверка структуры JSON:**

```javascript
pm.test("Response should contain userId", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("userId");
});
```

**Проверка заголовков:**

```javascript
pm.test("Content-Type is application/json", function () {
    pm.response.to.have.header("Content-Type", "application/json; charset=utf-8");
});
```

**Проверка значений JSON:**

```javascript
pm.test("Title should be Postman Test", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.title).to.eql("Postman Test");
});
```

Все тесты успешно прошли при выполнении запросов (см. раздел Test Results в Postman).

> **ВСТАВИТЬ СКРИНШОТЫ:** вкладка Tests со скриптами и раздел Test Results с зелёными галочками.

---

## 8. Работа с Postman Collection Runner

1. Открыт **Collection Runner**
2. Выбрана коллекция **Test API**
3. Запущено выполнение всех тестов
4. Результаты экспортированы:
   - `postman/results/runner-results.json`
   - `postman/results/runner-results.csv`

### Сводка выполнения (Newman CLI)

```
┌─────────────────────────┬───────────────────┬──────────────────┐
│                         │          executed │           failed │
├─────────────────────────┼───────────────────┼──────────────────┤
│              iterations │                 1 │                0 │
│                requests │                 5 │                0 │
│            test-scripts │                 5 │                0 │
│              assertions │                14 │                0 │
└─────────────────────────┴───────────────────┴──────────────────┘
```

> **ВСТАВИТЬ СКРИНШОТ:** Collection Runner с результатами и кнопкой Export Results.

### Запуск через Newman (альтернатива GUI Runner)

```bash
cd postman
npm install
npx newman run Test-API.postman_collection.json \
  -e Test-Environment.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results/runner-results.json
```

---

## Заключение

В ходе выполнения лабораторной работы были освоены основные возможности Postman для тестирования REST API.

**Основные результаты:**

1. **HTTP-методы.** Изучены и применены на практике все основные методы REST API: GET (получение данных), POST (создание), PUT (обновление) и DELETE (удаление). Каждый метод возвращает соответствующий статус-код (200, 201), что подтверждает корректность взаимодействия с сервером.

2. **Параметры и тело запроса.** Освоена работа с query-параметрами (фильтрация постов по `userId`) и телом запроса в формате JSON для POST и PUT операций. Понятна разница между передачей данных в URL и в теле запроса.

3. **Анализ ответов.** Научились анализировать статус-коды, заголовки ответа (Content-Type, Server) и тело ответа в формате JSON. Это позволяет быстро диагностировать проблемы при тестировании API.

4. **Коллекции и окружения.** Создана коллекция «Test API» для организации запросов и окружение «Test Environment» с переменной `baseUrl`. Использование переменных `{{baseUrl}}` упрощает переключение между средами (dev, staging, production) без изменения каждого запроса.

5. **Автоматизированное тестирование.** Написаны скрипты на JavaScript с использованием библиотеки Chai (pm.test, pm.expect) для автоматической проверки статус-кодов, структуры JSON, заголовков и значений полей. Все 14 автоматических проверок успешно пройдены.

6. **Collection Runner.** Запуск коллекции через Runner позволяет выполнить все тесты одним нажатием и получить сводный отчёт. Результаты экспортированы в JSON и CSV для передачи преподавателю.

**Вывод:** Postman является мощным и удобным инструментом для ручного и автоматизированного тестирования API. Он объединяет отправку запросов, организацию тестов в коллекции, управление окружениями и написание автоматических проверок в едином интерфейсе. Полученные навыки применимы при разработке и тестировании реальных веб-приложений и микросервисов.
