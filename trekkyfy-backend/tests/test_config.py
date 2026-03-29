import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import config


def test_as_bool_true_values():
    assert config._as_bool("true", default=False) is True
    assert config._as_bool("YES", default=False) is True


def test_as_bool_false_values_and_default():
    assert config._as_bool("no", default=True) is False
    assert config._as_bool(None, default=True) is True


def test_as_int_parsing_and_default():
    assert config._as_int("42", default=1) == 42
    assert config._as_int("abc", default=7) == 7
    assert config._as_int(None, default=9) == 9
