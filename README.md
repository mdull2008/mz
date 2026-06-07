# Python Unit Converter + PyTest

Лабораторная работа: конвертер единиц измерения на Python с тестированием PyTest.

## Структура

```
unit_converter/
├── __init__.py
├── converter.py
├── main.py
└── tests/
    ├── __init__.py
    └── test_converter.py
docs/
└── Отчет_Студента.md
requirements.txt
```

## Запуск

```bash
pip install -r requirements.txt

# Консольное приложение
python3 -m unit_converter.main

# Тесты
python3 -m pytest unit_converter/tests/ -v
```

## Функции конвертации

**Длина:** метры ↔ километры, сантиметры, миллиметры

**Дополнительно:** вес (кг ↔ г), время (часы, минуты, секунды)

## Отчёт

Шаблон отчёта: `docs/Отчет_Студента.md` — переименуйте в `Отчет_ВашаФамилия.md` перед сдачей.
