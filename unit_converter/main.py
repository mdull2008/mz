"""Консольное приложение — конвертер единиц измерения."""

from unit_converter import converter


def parse_number(value: str) -> float:
    """Преобразует строку в число с обработкой ошибок ввода."""
    try:
        return float(value.replace(",", "."))
    except ValueError as exc:
        raise ValueError(f"Некорректный ввод: '{value}'. Введите число.") from exc


def print_menu() -> None:
    """Выводит главное меню приложения."""
    print("\n=== Конвертер единиц измерения ===")
    print("--- Длина ---")
    print("1. Метры → Километры")
    print("2. Километры → Метры")
    print("3. Метры → Сантиметры")
    print("4. Сантиметры → Метры")
    print("5. Метры → Миллиметры")
    print("6. Миллиметры → Метры")
    print("--- Вес (доп.) ---")
    print("7. Килограммы → Граммы")
    print("8. Граммы → Килограммы")
    print("--- Время (доп.) ---")
    print("9. Часы → Минуты")
    print("10. Минуты → Часы")
    print("11. Минуты → Секунды")
    print("12. Секунды → Минуты")
    print("0. Выход")


OPERATIONS = {
    "1": ("Метры → Километры", converter.meters_to_kilometers, "м"),
    "2": ("Километры → Метры", converter.kilometers_to_meters, "км"),
    "3": ("Метры → Сантиметры", converter.meters_to_centimeters, "м"),
    "4": ("Сантиметры → Метры", converter.centimeters_to_meters, "см"),
    "5": ("Метры → Миллиметры", converter.meters_to_millimeters, "м"),
    "6": ("Миллиметры → Метры", converter.millimeters_to_meters, "мм"),
    "7": ("Килограммы → Граммы", converter.kilograms_to_grams, "кг"),
    "8": ("Граммы → Килограммы", converter.grams_to_kilograms, "г"),
    "9": ("Часы → Минуты", converter.hours_to_minutes, "ч"),
    "10": ("Минуты → Часы", converter.minutes_to_hours, "мин"),
    "11": ("Минуты → Секунды", converter.minutes_to_seconds, "мин"),
    "12": ("Секунды → Минуты", converter.seconds_to_minutes, "с"),
}


def run() -> None:
    """Запускает интерактивное меню конвертера."""
    while True:
        print_menu()
        choice = input("Выберите операцию: ").strip()

        if choice == "0":
            print("До свидания!")
            break

        if choice not in OPERATIONS:
            print("Ошибка: выберите пункт из меню (0–12).")
            continue

        title, func, unit = OPERATIONS[choice]
        raw_value = input(f"Введите значение ({unit}): ").strip()

        try:
            value = parse_number(raw_value)
            result = func(value)
            print(f"Результат ({title}): {result}")
        except ValueError as error:
            print(f"Ошибка: {error}")


if __name__ == "__main__":
    run()
