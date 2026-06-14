using Microsoft.ML;
using ProjectBAnk.Models;

namespace ProjectBAnk.Services;

/// <summary>
/// Нейросеть ML.NET для разбора предложений с сайта.
/// Определяет: выгодное предложение или нет.
/// </summary>
public class OfferAnalyzer
{
    private readonly MLContext _ml = new(seed: 0);
    private Microsoft.ML.ITransformer? _model;

    public void Train(IReadOnlyList<Offer> offers)
    {
        var trainingData = offers.Select(o => new OfferTrainingData
        {
            Price = (float)o.Price,
            Rating = (float)o.Rating,
            Discount = (float)o.DiscountPercentage,
            Stock = o.Stock,
            IsGoodOffer = IsGoodOfferRule(o)
        }).ToList();

        var data = _ml.Data.LoadFromEnumerable(trainingData);

        var pipeline = _ml.Transforms.Concatenate("Features",
                nameof(OfferInput.Price),
                nameof(OfferInput.Rating),
                nameof(OfferInput.Discount),
                nameof(OfferInput.Stock))
            .Append(_ml.BinaryClassification.Trainers.FastTree(
                labelColumnName: nameof(OfferTrainingData.IsGoodOffer)));

        _model = pipeline.Fit(data);
    }

    public OfferAnalysisResult Analyze(Offer offer)
    {
        if (_model is null)
            throw new InvalidOperationException("Сначала обучите модель (загрузите данные с сайта).");

        var engine = _ml.Model.CreatePredictionEngine<OfferInput, OfferPrediction>(_model);
        var input = new OfferInput
        {
            Price = (float)offer.Price,
            Rating = (float)offer.Rating,
            Discount = (float)offer.DiscountPercentage,
            Stock = offer.Stock
        };

        var prediction = engine.Predict(input);
        var percent = (int)Math.Round(prediction.Probability * 100);

        var verdict = prediction.PredictedLabel ? "ВЫГОДНОЕ" : "НЕВЫГОДНОЕ";
        var text = $"{verdict} ({percent}%) — {offer.Title} | цена {offer.Price:F0} ₽, " +
                   $"рейтинг {offer.Rating:F1}, скидка {offer.DiscountPercentage:F0}%";

        return new OfferAnalysisResult(prediction.PredictedLabel, percent, text);
    }

    public List<OfferAnalysisResult> AnalyzeAll(IReadOnlyList<Offer> offers)
    {
        return offers.Select(Analyze).ToList();
    }

    private static bool IsGoodOfferRule(Offer o) =>
        o.Rating >= 3.5 && o.DiscountPercentage >= 5 && o.Stock > 10 && o.Price <= 500;
}

public record OfferAnalysisResult(bool IsGood, int ScorePercent, string Text);
