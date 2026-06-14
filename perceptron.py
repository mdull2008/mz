"""Линейный перцептрон — бинарный классификатор с пороговой функцией активации."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Sequence


@dataclass
class LinearPerceptron:
    """Перцептрон Розенблатта для линейно разделимых данных.

    Метки классов: 0 и 1.
    """

    learning_rate: float = 0.1
    max_epochs: int = 1000

    weights: list[float] | None = None
    bias: float = 0.0
    epochs_trained: int = 0

    def fit(self, X: Sequence[Sequence[float]], y: Sequence[int]) -> LinearPerceptron:
        if len(X) != len(y):
            raise ValueError("X и y должны иметь одинаковую длину")
        if not X:
            raise ValueError("X не может быть пустым")

        n_features = len(X[0])
        if any(len(row) != n_features for row in X):
            raise ValueError("Все объекты в X должны иметь одинаковую размерность")
        if any(label not in (0, 1) for label in y):
            raise ValueError("Метки классов должны быть 0 или 1")

        self.weights = [0.0] * n_features
        self.bias = 0.0
        self.epochs_trained = 0

        for epoch in range(1, self.max_epochs + 1):
            errors = 0
            for features, target in zip(X, y):
                prediction = self._activation(features)
                if prediction != target:
                    error = target - prediction
                    for j in range(n_features):
                        self.weights[j] += self.learning_rate * error * features[j]
                    self.bias += self.learning_rate * error
                    errors += 1

            self.epochs_trained = epoch
            if errors == 0:
                break

        return self

    def _activation(self, features: Sequence[float]) -> int:
        if self.weights is None:
            raise RuntimeError("Модель не обучена. Вызовите fit() перед predict().")

        score = sum(w * x for w, x in zip(self.weights, features)) + self.bias
        return 1 if score >= 0 else 0

    def predict(self, X: Iterable[Sequence[float]]) -> list[int]:
        return [self._activation(features) for features in X]

    def score(self, X: Sequence[Sequence[float]], y: Sequence[int]) -> float:
        predictions = self.predict(X)
        correct = sum(pred == label for pred, label in zip(predictions, y))
        return correct / len(y)


def _demo() -> None:
    # Логическая функция AND — линейно разделима
    X = [
        [0.0, 0.0],
        [0.0, 1.0],
        [1.0, 0.0],
        [1.0, 1.0],
    ]
    y = [0, 0, 0, 1]

    model = LinearPerceptron(learning_rate=0.1).fit(X, y)

    print("Веса:", model.weights)
    print("Смещение:", model.bias)
    print("Эпох обучения:", model.epochs_trained)
    print("Предсказания:", model.predict(X))
    print("Точность:", model.score(X, y))


if __name__ == "__main__":
    _demo()
