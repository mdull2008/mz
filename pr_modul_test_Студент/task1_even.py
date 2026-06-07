def is_even(n: int) -> bool:
  """Возвращает True, если число чётное, иначе False."""
  return n % 2 == 0


if __name__ == "__main__":
  # Позитивные тесты
  assert is_even(0) is True
  assert is_even(2) is True
  assert is_even(-2) is True

  # Негативные тесты
  assert is_even(1) is False
  assert is_even(-1) is False
  assert is_even(101) is False

  print("Все проверки для is_even() пройдены успешно.")
