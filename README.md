# Лабораторная работа: Тестирование API с помощью Postman

Материалы для лабораторной работы по тестированию REST API с использованием Postman и JSONPlaceholder.

## Структура проекта

```
postman/
  Test-API.postman_collection.json      # Коллекция запросов (GET, POST, PUT, DELETE)
  Test-Environment.postman_environment.json  # Окружение с переменной baseUrl
  results/
    runner-results.json                 # Отчёт Collection Runner (JSON)
    runner-results.csv                  # Отчёт Collection Runner (CSV)
docs/
  lab-postman-api-testing.md            # Полный отчёт по лабораторной работе
```

## Быстрый старт

### Импорт в Postman

1. Откройте Postman → **File → Import**
2. Импортируйте `postman/Test-API.postman_collection.json`
3. Импортируйте `postman/Test-Environment.postman_environment.json`
4. Активируйте окружение **Test Environment** в правом верхнем углу
5. Выполняйте запросы и делайте скриншоты для отчёта

### Запуск тестов через Newman (CLI)

```bash
cd postman
npm install
npm test
```

## Тестовый API

[JSONPlaceholder](https://jsonplaceholder.typicode.com) — бесплатный фейковый REST API для тестирования.
