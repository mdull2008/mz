from task1_even import is_even


def test_is_even_for_even_numbers():
  assert is_even(0) is True
  assert is_even(2) is True
  assert is_even(-2) is True
  assert is_even(100) is True


def test_is_even_for_odd_numbers():
  assert is_even(1) is False
  assert is_even(-1) is False
  assert is_even(101) is False
