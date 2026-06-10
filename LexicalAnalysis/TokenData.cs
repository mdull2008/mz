using Microsoft.ML.Data;

namespace LexicalAnalysis;

public class TokenData
{
    public string Word { get; set; } = string.Empty;
    public string PartOfSpeech { get; set; } = string.Empty;

    [VectorType(12)]
    public float[] CharFeatures { get; set; } = Array.Empty<float>();
}

public class TokenPrediction : TokenData
{
    public string PredictedLabel { get; set; } = string.Empty;

    [ColumnName("Score")]
    public float[] Scores { get; set; } = Array.Empty<float>();
}
