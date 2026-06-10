using Microsoft.ML;
using Microsoft.ML.Data;
using ProjectBAnk.Models;

namespace ProjectBAnk.Services;

/// <summary>
/// Нейросеть (ML.NET), которая проверяет операции на мошенничество.
/// </summary>
public class FraudDetector
{
    private readonly MLContext _ml = new(seed: 0);
    private PredictionEngine<TransactionInput, FraudPrediction>? _engine;
    private readonly string _modelPath;

    public FraudDetector()
    {
        _modelPath = Path.Combine(AppContext.BaseDirectory, "fraud-model.zip");
        LoadOrTrainModel();
    }

    public FraudCheckResult Check(TransactionInput input)
    {
        var prediction = _engine!.Predict(input);
        var percent = (int)Math.Round(prediction.Probability * 100);

        return new FraudCheckResult(prediction.IsFraud, percent, BuildReason(input, prediction.IsFraud));
    }

    private void LoadOrTrainModel()
    {
        if (File.Exists(_modelPath))
        {
            var loadedModel = _ml.Model.Load(_modelPath, out _);
            _engine = _ml.Model.CreatePredictionEngine<TransactionInput, FraudPrediction>(loadedModel);
            return;
        }

        var trainingData = BuildTrainingData();
        var data = _ml.Data.LoadFromEnumerable(trainingData);

        var pipeline = _ml.Transforms.Concatenate(
                "Features",
                nameof(TransactionInput.Amount),
                nameof(TransactionInput.Hour),
                nameof(TransactionInput.TransactionsLastHour),
                nameof(TransactionInput.IsWithdrawal),
                nameof(TransactionInput.BalanceRatio))
            .Append(_ml.BinaryClassification.Trainers.FastTree(
                labelColumnName: nameof(TransactionTrainingData.IsFraud),
                featureColumnName: "Features"));

        var model = pipeline.Fit(data);
        _ml.Model.Save(model, data.Schema, _modelPath);
        _engine = _ml.Model.CreatePredictionEngine<TransactionInput, FraudPrediction>(model);
    }

    private static List<TransactionTrainingData> BuildTrainingData()
    {
        var random = new Random(42);
        var data = new List<TransactionTrainingData>();

        for (var i = 0; i < 300; i++)
        {
            var amount = (float)random.Next(100, 50000);
            var hour = (float)random.Next(0, 24);
            var txCount = (float)random.Next(0, 8);
            var isWithdrawal = random.Next(0, 2);
            var balanceRatio = (float)Math.Round(random.NextDouble(), 2);

            var isFraud = IsFraudPattern(amount, hour, txCount, isWithdrawal, balanceRatio);
            data.Add(new TransactionTrainingData
            {
                Amount = amount,
                Hour = hour,
                TransactionsLastHour = txCount,
                IsWithdrawal = isWithdrawal,
                BalanceRatio = balanceRatio,
                IsFraud = isFraud
            });
        }

        // Явные примеры, чтобы модель точно училась на понятных случаях.
        data.AddRange(new[]
        {
            MakeSample(500, 14, 1, 0, 0.1f, false),
            MakeSample(1000, 10, 2, 0, 0.2f, false),
            MakeSample(50000, 3, 7, 1, 0.95f, true),
            MakeSample(30000, 2, 6, 1, 0.9f, true),
            MakeSample(15000, 4, 5, 1, 0.85f, true),
            MakeSample(2000, 15, 1, 1, 0.3f, false),
        });

        return data;
    }

    private static TransactionTrainingData MakeSample(
        float amount, float hour, float txCount, float isWithdrawal, float balanceRatio, bool isFraud) =>
        new()
        {
            Amount = amount,
            Hour = hour,
            TransactionsLastHour = txCount,
            IsWithdrawal = isWithdrawal,
            BalanceRatio = balanceRatio,
            IsFraud = isFraud
        };

    private static bool IsFraudPattern(
        float amount, float hour, float txCount, float isWithdrawal, float balanceRatio)
    {
        if (txCount >= 5) return true;
        if (isWithdrawal >= 1 && balanceRatio > 0.8f && hour is >= 0 and <= 5) return true;
        if (amount > 20000 && hour is >= 0 and <= 5) return true;
        if (isWithdrawal >= 1 && amount > 15000 && balanceRatio > 0.7f) return true;
        return false;
    }

    private static string BuildReason(TransactionInput input, bool isFraud)
    {
        if (!isFraud)
            return "Операция выглядит нормально.";

        var reasons = new List<string>();

        if (input.TransactionsLastHour >= 5)
            reasons.Add("слишком много операций за последний час");

        if (input.Hour is >= 0 and <= 5)
            reasons.Add("операция ночью");

        if (input.BalanceRatio > 0.8f && input.IsWithdrawal >= 1)
            reasons.Add("снимается почти весь баланс");

        if (input.Amount > 20000)
            reasons.Add("очень большая сумма");

        return reasons.Count > 0
            ? "Подозрение: " + string.Join(", ", reasons) + "."
            : "Модель заметила необычный шаблон операции.";
    }
}

public record FraudCheckResult(bool IsFraud, int RiskPercent, string Reason);
