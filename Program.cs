using Mz;

// Логическая функция AND — линейно разделима
var x = new[]
{
    new[] { 0.0, 0.0 },
    new[] { 0.0, 1.0 },
    new[] { 1.0, 0.0 },
    new[] { 1.0, 1.0 },
};
var y = new[] { 0, 0, 0, 1 };

var model = new LinearPerceptron(learningRate: 0.1).Fit(x, y);

Console.WriteLine($"Веса: [{string.Join(", ", model.Weights!)}]");
Console.WriteLine($"Смещение: {model.Bias}");
Console.WriteLine($"Эпох обучения: {model.EpochsTrained}");
Console.WriteLine($"Предсказания: [{string.Join(", ", model.Predict(x))}]");
Console.WriteLine($"Точность: {model.Score(x, y)}");
