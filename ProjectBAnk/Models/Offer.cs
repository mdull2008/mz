using System.Text.Json.Serialization;

namespace ProjectBAnk.Models;

/// <summary>
/// Предложение (товар) из JSON API.
/// </summary>
public class Offer
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Category { get; set; } = "";
    public double Price { get; set; }

    [JsonPropertyName("discountPercentage")]
    public double DiscountPercentage { get; set; }

    public double Rating { get; set; }
    public int Stock { get; set; }

    // Заполняется нейросетью после анализа
    public string? AnalysisResult { get; set; }
}

public class OfferApiResponse
{
    public List<Offer> Products { get; set; } = new();
    public int Total { get; set; }
}

/// <summary>
/// Входные данные для нейросети (анализ предложения).
/// </summary>
public class OfferInput
{
    public float Price { get; set; }
    public float Rating { get; set; }
    public float Discount { get; set; }
    public float Stock { get; set; }
}

public class OfferTrainingData : OfferInput
{
    public bool IsGoodOffer { get; set; }
}

public class OfferPrediction
{
    public bool PredictedLabel { get; set; }
    public float Probability { get; set; }
}
