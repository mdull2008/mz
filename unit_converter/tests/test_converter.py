"""Тесты модуля converter с использованием PyTest."""

import pytest

from unit_converter import converter


# --- meters_to_kilometers ---

def test_meters_to_kilometers_correct():
    assert converter.meters_to_kilometers(1000) == 1.0
    assert converter.meters_to_kilometers(500) == 0.5


def test_meters_to_kilometers_negative_raises():
    with pytest.raises(ValueError, match="не может быть отрицательным"):
        converter.meters_to_kilometers(-10)


# --- kilometers_to_meters ---

def test_kilometers_to_meters_correct():
    assert converter.kilometers_to_meters(1) == 1000
    assert converter.kilometers_to_meters(2.5) == 2500


def test_kilometers_to_meters_negative_raises():
    with pytest.raises(ValueError):
        converter.kilometers_to_meters(-1)


# --- meters_to_centimeters ---

def test_meters_to_centimeters_correct():
    assert converter.meters_to_centimeters(1) == 100
    assert converter.meters_to_centimeters(0.5) == 50


def test_meters_to_centimeters_negative_raises():
    with pytest.raises(ValueError):
        converter.meters_to_centimeters(-5)


# --- centimeters_to_meters ---

def test_centimeters_to_meters_correct():
    assert converter.centimeters_to_meters(100) == 1.0
    assert converter.centimeters_to_meters(250) == 2.5


def test_centimeters_to_meters_negative_raises():
    with pytest.raises(ValueError):
        converter.centimeters_to_meters(-100)


# --- meters_to_millimeters ---

def test_meters_to_millimeters_correct():
    assert converter.meters_to_millimeters(1) == 1000
    assert converter.meters_to_millimeters(0.001) == 1


def test_meters_to_millimeters_negative_raises():
    with pytest.raises(ValueError):
        converter.meters_to_millimeters(-1)


# --- millimeters_to_meters ---

def test_millimeters_to_meters_correct():
    assert converter.millimeters_to_meters(1000) == 1.0
    assert converter.millimeters_to_meters(500) == 0.5


def test_millimeters_to_meters_negative_raises():
    with pytest.raises(ValueError):
        converter.millimeters_to_meters(-500)


# --- Граничный случай: ноль ---

@pytest.mark.parametrize(
    "func,expected",
    [
        (converter.meters_to_kilometers, 0.0),
        (converter.kilometers_to_meters, 0.0),
        (converter.meters_to_centimeters, 0.0),
        (converter.centimeters_to_meters, 0.0),
        (converter.meters_to_millimeters, 0.0),
        (converter.millimeters_to_meters, 0.0),
    ],
)
def test_length_conversions_zero(func, expected):
    assert func(0) == expected


# --- Дополнительное задание: вес ---

def test_kilograms_to_grams_correct():
    assert converter.kilograms_to_grams(1) == 1000
    assert converter.kilograms_to_grams(2.5) == 2500


def test_kilograms_to_grams_negative_raises():
    with pytest.raises(ValueError):
        converter.kilograms_to_grams(-1)


def test_grams_to_kilograms_correct():
    assert converter.grams_to_kilograms(1000) == 1.0
    assert converter.grams_to_kilograms(500) == 0.5


def test_grams_to_kilograms_negative_raises():
    with pytest.raises(ValueError):
        converter.grams_to_kilograms(-100)


# --- Дополнительное задание: время ---

def test_hours_to_minutes_correct():
    assert converter.hours_to_minutes(1) == 60
    assert converter.hours_to_minutes(2) == 120


def test_hours_to_minutes_negative_raises():
    with pytest.raises(ValueError):
        converter.hours_to_minutes(-1)


def test_minutes_to_hours_correct():
    assert converter.minutes_to_hours(60) == 1.0
    assert converter.minutes_to_hours(30) == 0.5


def test_minutes_to_hours_negative_raises():
    with pytest.raises(ValueError):
        converter.minutes_to_hours(-60)


def test_minutes_to_seconds_correct():
    assert converter.minutes_to_seconds(1) == 60
    assert converter.minutes_to_seconds(5) == 300


def test_seconds_to_minutes_correct():
    assert converter.seconds_to_minutes(60) == 1.0
    assert converter.seconds_to_minutes(120) == 2.0


def test_hours_to_seconds_correct():
    assert converter.hours_to_seconds(1) == 3600


def test_seconds_to_hours_correct():
    assert converter.seconds_to_hours(3600) == 1.0


def test_time_conversions_negative_raises():
    with pytest.raises(ValueError):
        converter.minutes_to_seconds(-1)
    with pytest.raises(ValueError):
        converter.seconds_to_minutes(-1)
    with pytest.raises(ValueError):
        converter.hours_to_seconds(-1)
    with pytest.raises(ValueError):
        converter.seconds_to_hours(-1)


# --- Дополнительное задание: обработка ошибок ввода в main ---

def test_parse_number_valid():
    from unit_converter.main import parse_number

    assert parse_number("10") == 10.0
    assert parse_number("3.14") == 3.14
    assert parse_number("2,5") == 2.5


def test_parse_number_invalid_string():
    from unit_converter.main import parse_number

    with pytest.raises(ValueError, match="Некорректный ввод"):
        parse_number("abc")

    with pytest.raises(ValueError):
        parse_number("")
