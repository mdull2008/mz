using LexicalAnalysis;
using Microsoft.ML;
using Microsoft.ML.Data;
using NumSharp;

var mlContext = new MLContext(seed: 42);
const string sentence = "как посеешь так и пожнешь";
var tokens = sentence.Split(' ', StringSplitOptions.RemoveEmptyEntries);

Console.WriteLine("=== Лексический разбор предложения ===");
Console.WriteLine($"Предложение: «{sentence}»");
Console.WriteLine();

// 1. NumSharp: представляем слова как NDArray-последовательности символов
Console.WriteLine("--- NumSharp: кодирование слов в NDArray ---");
var batchMatrix = CharEncoder.BatchToNDArray(tokens);
Console.WriteLine($"Матрица признаков (форма {batchMatrix.shape}):");
Console.WriteLine(batchMatrix.ToString());
Console.WriteLine();

foreach (var token in tokens)
{
  var charArray = CharEncoder.WordToNDArray(token);
  var features = CharEncoder.WordToFeatures(token);
  var chars = NDArray.AsString(charArray);
  Console.WriteLine($"  {token,-10} → NDArray{charArray.shape} = \"{chars}\"");
  Console.WriteLine($"  {"",-10}   признаки = [{string.Join(", ", features.Select(f => f.ToString("0")))}]");
}

Console.WriteLine();

// 2. Подготовка обучающей выборки
var trainingData = TrainingData.Create();
IDataView dataView = mlContext.Data.LoadFromEnumerable(trainingData);

// 3. Пайплайн ML.NET: признаки NumSharp + текстовые n-граммы
var pipeline = mlContext.Transforms.Text.FeaturizeText(
    outputColumnName: "WordFeaturized",
    inputColumnName: nameof(TokenData.Word))
  .Append(mlContext.Transforms.Concatenate(
    "Features",
    nameof(TokenData.CharFeatures),
    "WordFeaturized"))
  .Append(mlContext.Transforms.Conversion.MapValueToKey(
    outputColumnName: "Label",
    inputColumnName: nameof(TokenData.PartOfSpeech)))
  .Append(mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy())
  .Append(mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

Console.WriteLine("--- Обучение модели ML.NET ---");
var model = pipeline.Fit(dataView);
Console.WriteLine("Модель обучена!");
Console.WriteLine();

// 4. Лексический разбор каждого слова предложения
var predictionEngine = mlContext.Model.CreatePredictionEngine<TokenData, TokenPrediction>(model);

Console.WriteLine("--- Результат лексического разбора ---");
Console.WriteLine($"{"Слово",-12} {"Часть речи",-18} {"Уверенность"}");
Console.WriteLine(new string('-', 45));

foreach (var token in tokens)
{
  var input = new TokenData
  {
    Word = token,
    CharFeatures = CharEncoder.WordToFeatures(token),
  };

  var prediction = predictionEngine.Predict(input);
  var confidence = prediction.Scores.Length > 0 ? prediction.Scores.Max() : 0f;

  Console.WriteLine($"{token,-12} {prediction.PredictedLabel,-18} {confidence:P1}");
}

Console.WriteLine();
Console.WriteLine("Полный разбор:");
Console.WriteLine(string.Join(" | ", tokens.Select(t =>
{
  var p = predictionEngine.Predict(new TokenData
  {
    Word = t,
    CharFeatures = CharEncoder.WordToFeatures(t),
  });
  return $"{t} ({p.PredictedLabel})";
})));
