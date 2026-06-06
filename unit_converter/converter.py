"""Модуль конвертации единиц измерения длины и веса."""


def _validate_positive(value: float, unit_name: str = "значение") -> None:
    """Проверяет, что величина неотрицательна."""
    if value < 0:
        raise ValueError(f"{unit_name} не может быть отрицательным: {value}")


# --- Длина: метры <-> другие единицы ---

def meters_to_kilometers(meters: float) -> float:
    """Переводит метры в километры."""
    _validate_positive(meters, "Метры")
    return meters / 1000


def kilometers_to_meters(kilometers: float) -> float:
    """Переводит километры в метры."""
    _validate_positive(kilometers, "Километры")
    return kilometers * 1000


def meters_to_centimeters(meters: float) -> float:
    """Переводит метры в сантиметры."""
    _validate_positive(meters, "Метры")
    return meters * 100


def centimeters_to_meters(centimeters: float) -> float:
    """Переводит сантиметры в метры."""
    _validate_positive(centimeters, "Сантиметры")
    return centimeters / 100


def meters_to_millimeters(meters: float) -> float:
    """Переводит метры в миллиметры."""
    _validate_positive(meters, "Метры")
    return meters * 1000


def millimeters_to_meters(millimeters: float) -> float:
    """Переводит миллиметры в метры."""
    _validate_positive(millimeters, "Миллиметры")
    return millimeters / 1000


# --- Вес: килограммы <-> граммы (дополнительное задание) ---

def kilograms_to_grams(kilograms: float) -> float:
    """Переводит килограммы в граммы."""
    _validate_positive(kilograms, "Килограммы")
    return kilograms * 1000


def grams_to_kilograms(grams: float) -> float:
    """Переводит граммы в килограммы."""
    _validate_positive(grams, "Граммы")
    return grams / 1000


# --- Время: часы <-> минуты <-> секунды (дополнительное задание) ---

def hours_to_minutes(hours: float) -> float:
    """Переводит часы в минуты."""
    _validate_positive(hours, "Часы")
    return hours * 60


def minutes_to_hours(minutes: float) -> float:
    """Переводит минуты в часы."""
    _validate_positive(minutes, "Минуты")
    return minutes / 60


def minutes_to_seconds(minutes: float) -> float:
    """Переводит минуты в секунды."""
    _validate_positive(minutes, "Минуты")
    return minutes * 60


def seconds_to_minutes(seconds: float) -> float:
    """Переводит секунды в минуты."""
    _validate_positive(seconds, "Секунды")
    return seconds / 60


def hours_to_seconds(hours: float) -> float:
    """Переводит часы в секунды."""
    _validate_positive(hours, "Часы")
    return hours * 3600


def seconds_to_hours(seconds: float) -> float:
    """Переводит секунды в часы."""
    _validate_positive(seconds, "Секунды")
    return seconds / 3600
