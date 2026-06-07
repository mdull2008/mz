from task2_funcs import max_of_three, sign


def test_max_of_three_basic():
  assert max_of_three(1, 2, 3) == 3
  assert max_of_three(3, 2, 1) == 3
  assert max_of_three(2, 3, 1) == 3


def test_max_of_three_equal_numbers():
  assert max_of_three(5, 5, 5) == 5


def test_max_of_three_negative_numbers():
  assert max_of_three(-1, -5, -3) == -1


def test_max_of_three_most_negative_is_max():
  assert max_of_three(-2, -10, -7) == -2


def test_sign_negative():
  assert sign(-10) == -1
  assert sign(-1) == -1


def test_sign_zero():
  assert sign(0) == 0


def test_sign_positive():
  assert sign(1) == 1
  assert sign(15) == 1


def test_sign_large_numbers():
  assert sign(1_000_000) == 1
  assert sign(-1_000_000) == -1
