using NumSharp;

namespace LexicalAnalysis;

/// <summary>
/// Кодирует слова в числовые NDArray-последовательности с помощью NumSharp.
/// </summary>
public static class CharEncoder
{
  public const string CharSet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя ";
  public const int MaxWordLength = 12;

  public static NDArray WordToNDArray(string word)
  {
    return NDArray.FromString(word.ToLowerInvariant());
  }

  public static float[] WordToFeatures(string word)
  {
    var normalized = word.ToLowerInvariant();
    var features = new float[MaxWordLength];

    for (var i = 0; i < MaxWordLength; i++)
    {
      features[i] = i < normalized.Length
        ? CharSet.IndexOf(normalized[i])
        : CharSet.Length - 1; // padding — пробел
    }

    return features;
  }

  public static NDArray BatchToNDArray(IEnumerable<string> words)
  {
    var matrix = words
      .Select(WordToFeatures)
      .SelectMany(f => f)
      .ToArray();

    return np.array(matrix).reshape(words.Count(), MaxWordLength);
  }
}
