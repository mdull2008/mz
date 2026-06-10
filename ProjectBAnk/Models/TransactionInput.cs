using Microsoft.ML.Data;

namespace ProjectBAnk.Models;

/// <summary>
/// Данные одной операции для нейросети (ML.NET).
/// </summary>
public class TransactionInput
{
    public float Amount { get; set; }
    public float Hour { get; set; }
    public float TransactionsLastHour { get; set; }
    public float IsWithdrawal { get; set; }
    public float BalanceRatio { get; set; }
}

/// <summary>
/// То же самое + метка для обучения: мошенничество или нет.
/// </summary>
public class TransactionTrainingData : TransactionInput
{
    [LoadColumn(5)]
    public bool IsFraud { get; set; }
}

public class FraudPrediction
{
    [ColumnName("PredictedLabel")]
    public bool IsFraud { get; set; }

    public float Probability { get; set; }
    public float Score { get; set; }
}
