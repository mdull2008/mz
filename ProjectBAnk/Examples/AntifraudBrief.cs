using Microsoft.ML;
using Microsoft.ML.Data;

namespace ProjectBAnk.Examples;

/// <summary>
/// Краткий пример антифрод-системы на ML.NET для демонстрации.
/// Признаки: блок счёта, сумма, известность адресата, цель платежа, периодичность.
/// </summary>
public static class AntifraudBrief
{
    // --- Вход: один платёж ---
    public class PaymentInput
    {
        public float IsAccountBlocked { get; set; }  // 1 = счёт заблокирован
        public float Amount { get; set; }            // сумма перевода
        public float IsRecipientKnown { get; set; }  // 1 = адресат известен (в контактах)
        public float PaymentPurpose { get; set; }    // 0=другое, 1=коммуналка, 2=перевод
        public float PeriodicityDays { get; set; }   // дней с прошлого похожего платежа
    }

    // --- Для обучения: платёж + метка ---
    public class PaymentTraining : PaymentInput
    {
        public bool IsFraud { get; set; }            // true = мошенничество
    }

    // --- Выход нейросети ---
    public class FraudOutput
    {
        public bool PredictedLabel { get; set; }
        public float Probability { get; set; }
    }

    public static string CheckPayment(PaymentInput payment)
    {
        var ml = new MLContext(seed: 1);

        // Примеры для обучения (в реальном банке — тысячи записей из БД)
        var trainingData = new[]
        {
            new PaymentTraining { IsAccountBlocked=0, Amount=1500,  IsRecipientKnown=1, PaymentPurpose=1, PeriodicityDays=30, IsFraud=false },
            new PaymentTraining { IsAccountBlocked=0, Amount=3000,  IsRecipientKnown=1, PaymentPurpose=2, PeriodicityDays=14, IsFraud=false },
            new PaymentTraining { IsAccountBlocked=0, Amount=500,   IsRecipientKnown=1, PaymentPurpose=1, PeriodicityDays=28, IsFraud=false },
            new PaymentTraining { IsAccountBlocked=1, Amount=50000, IsRecipientKnown=0, PaymentPurpose=2, PeriodicityDays=0,  IsFraud=true  },
            new PaymentTraining { IsAccountBlocked=0, Amount=99000, IsRecipientKnown=0, PaymentPurpose=0, PeriodicityDays=0,  IsFraud=true  },
            new PaymentTraining { IsAccountBlocked=0, Amount=75000, IsRecipientKnown=0, PaymentPurpose=2, PeriodicityDays=1,  IsFraud=true  },
        };

        var data = ml.Data.LoadFromEnumerable(trainingData);

        // Конвейер: 5 признаков → классификатор
        var pipeline = ml.Transforms.Concatenate("Features",
                nameof(PaymentInput.IsAccountBlocked),
                nameof(PaymentInput.Amount),
                nameof(PaymentInput.IsRecipientKnown),
                nameof(PaymentInput.PaymentPurpose),
                nameof(PaymentInput.PeriodicityDays))
            .Append(ml.BinaryClassification.Trainers.SdcaLogisticRegression(
                labelColumnName: nameof(PaymentTraining.IsFraud)));

        var model = pipeline.Fit(data);
        var engine = ml.Model.CreatePredictionEngine<PaymentInput, FraudOutput>(model);

        var result = engine.Predict(payment);
        var risk = (int)(result.Probability * 100);

        return result.PredictedLabel
            ? $"⚠ МОШЕННИЧЕСТВО (риск {risk}%)"
            : $"✓ Операция разрешена (риск {risk}%)";
    }
}
