def average_grade(grades: list[int]) -> float:
  """Средний балл по списку оценок (2-5). Пустой список -> ValueError."""
  if not grades:
    raise ValueError("Список оценок пуст")
  return sum(grades) / len(grades)


def is_passed(grade: int) -> bool:
  """True, если оценка >= 3 (сдал)."""
  return grade >= 3


def to_ects(grade: int) -> str:
  """Перевод 5-балльной оценки в буквенную шкалу."""
  mapping = {5: "A", 4: "B", 3: "C", 2: "F"}
  if grade not in mapping:
    raise ValueError(f"Некорректная оценка: {grade}")
  return mapping[grade]
