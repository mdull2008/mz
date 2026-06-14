namespace Mz;

/// <summary>
/// Перцептрон Розенблатта для линейно разделимых данных. Метки классов: 0 и 1.
/// </summary>
public sealed class LinearPerceptron
{
    public double LearningRate { get; }
    public int MaxEpochs { get; }

    public double[]? Weights { get; private set; }
    public double Bias { get; private set; }
    public int EpochsTrained { get; private set; }

    public LinearPerceptron(double learningRate = 0.1, int maxEpochs = 1000)
    {
        LearningRate = learningRate;
        MaxEpochs = maxEpochs;
    }

    public LinearPerceptron Fit(double[][] x, int[] y)
    {
        if (x.Length != y.Length)
            throw new ArgumentException("X и y должны иметь одинаковую длину.");
        if (x.Length == 0)
            throw new ArgumentException("X не может быть пустым.");

        var featureCount = x[0].Length;
        if (x.Any(row => row.Length != featureCount))
            throw new ArgumentException("Все объекты в X должны иметь одинаковую размерность.");
        if (y.Any(label => label is not (0 or 1)))
            throw new ArgumentException("Метки классов должны быть 0 или 1.");

        Weights = new double[featureCount];
        Bias = 0;
        EpochsTrained = 0;

        for (var epoch = 1; epoch <= MaxEpochs; epoch++)
        {
            var errors = 0;

            for (var i = 0; i < x.Length; i++)
            {
                var prediction = Activation(x[i]);
                if (prediction == y[i])
                    continue;

                var error = y[i] - prediction;
                for (var j = 0; j < featureCount; j++)
                    Weights[j] += LearningRate * error * x[i][j];

                Bias += LearningRate * error;
                errors++;
            }

            EpochsTrained = epoch;
            if (errors == 0)
                break;
        }

        return this;
    }

    public int[] Predict(IEnumerable<double[]> x) =>
        x.Select(Activation).ToArray();

    public double Score(double[][] x, int[] y)
    {
        var predictions = Predict(x);
        var correct = predictions.Zip(y, (prediction, label) => prediction == label).Count(match => match);
        return (double)correct / y.Length;
    }

    private int Activation(double[] features)
    {
        if (Weights is null)
            throw new InvalidOperationException("Модель не обучена. Вызовите Fit() перед Predict().");

        var score = features.Zip(Weights, (value, weight) => value * weight).Sum() + Bias;
        return score >= 0 ? 1 : 0;
    }
}
