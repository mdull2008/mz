import pytest

from student_utils import average_grade, is_passed, to_ects


def test_average_grade_basic():
  assert average_grade([5, 4, 3]) == pytest.approx(4.0)
  assert average_grade([3, 3, 3]) == pytest.approx(3.0)


def test_average_grade_single_value():
  assert average_grade([5]) == pytest.approx(5.0)


def test_average_grade_empty_list_raises():
  with pytest.raises(ValueError):
    average_grade([])


def test_is_passed_true():
  assert is_passed(3) is True
  assert is_passed(4) is True
  assert is_passed(5) is True


def test_is_passed_false():
  assert is_passed(2) is False


def test_is_passed_boundary():
  assert is_passed(3) is True


def test_to_ects_valid():
  assert to_ects(5) == "A"
  assert to_ects(4) == "B"
  assert to_ects(3) == "C"
  assert to_ects(2) == "F"


def test_to_ects_invalid_raises():
  with pytest.raises(ValueError):
    to_ects(1)
