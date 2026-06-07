def max_of_three(a: int, b: int, c: int) -> int:
  """Возвращает максимальное из трёх целых чисел."""
  return max(a, b, c)


def sign(x: int) -> int:
  """Возвращает -1, 0 или 1 в зависимости от знака числа."""
  if x < 0:
    return -1
  if x == 0:
    return 0
  return 1


if __name__ == "__main__":
  # max_of_three
  assert max_of_three(1, 2, 3) == 3
  assert max_of_three(3, 2, 1) == 3
  assert max_of_three(2, 3, 1) == 3
  assert max_of_three(5, 5, 5) == 5
  assert max_of_three(-1, -5, -3) == -1

  # sign
  assert sign(-5) == -1
  assert sign(1) == 1
  assert sign(0) == 0
  assert sign(-10) == -1
  assert sign(15) == 1

  print("Все проверки для max_of_three() и sign() пройдены успешно.")
