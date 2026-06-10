using System;
using System.Collections.Generic;
using NumSharp;
using Microsoft.ML;
using Microsoft.ML.Data;

// класс для слова
public class TokenData
{
    public string Word { get; set; }
    public string PartOfSpeech { get; set; }
}

// класс для ответа модели
public class TokenPrediction : TokenData
{
    public string PredictedLabel { get; set; }
}

class Program
{
    static void Main(string[] args)
    {
        // наше предложение
        string text = "как посеешь так и пожнешь";
        string[] slova = text.Split(' ');

        Console.WriteLine("Лексический разбор предложения");
        Console.WriteLine("Предложение: " + text);
        Console.WriteLine();

        // словарь букв (номер буквы в строке)
        string bukvy = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя ";

        // показываем как NumSharp хранит слова
        Console.WriteLine("Кодирование слов через NumSharp:");
        for (int i = 0; i < slova.Length; i++)
        {
            NDArray massiv = NDArray.FromString(slova[i]);
            Console.Write(slova[i] + " -> буквы: ");
            for (int j = 0; j < slova[i].Length; j++)
            {
                Console.Write(bukvy.IndexOf(slova[i][j]) + " ");
            }
            Console.WriteLine();
        }
        Console.WriteLine();

        // создаем ML
        MLContext ml = new MLContext();

        // учим модель на примерах
        List<TokenData> data = new List<TokenData>();
        data.Add(new TokenData { Word = "мама", PartOfSpeech = "СУЩЕСТВИТЕЛЬНОЕ" });
        data.Add(new TokenData { Word = "мыла", PartOfSpeech = "ГЛАГОЛ" });
        data.Add(new TokenData { Word = "раму", PartOfSpeech = "СУЩЕСТВИТЕЛЬНОЕ" });
        data.Add(new TokenData { Word = "читала", PartOfSpeech = "ГЛАГОЛ" });
        data.Add(new TokenData { Word = "дом", PartOfSpeech = "СУЩЕСТВИТЕЛЬНОЕ" });
        data.Add(new TokenData { Word = "идет", PartOfSpeech = "ГЛАГОЛ" });
        data.Add(new TokenData { Word = "как", PartOfSpeech = "НАРЕЧИЕ" });
        data.Add(new TokenData { Word = "так", PartOfSpeech = "НАРЕЧИЕ" });
        data.Add(new TokenData { Word = "и", PartOfSpeech = "СОЮЗ" });
        data.Add(new TokenData { Word = "но", PartOfSpeech = "СОЮЗ" });
        data.Add(new TokenData { Word = "очень", PartOfSpeech = "НАРЕЧИЕ" });
        data.Add(new TokenData { Word = "быстро", PartOfSpeech = "НАРЕЧИЕ" });
        data.Add(new TokenData { Word = "посеешь", PartOfSpeech = "ГЛАГОЛ" });
        data.Add(new TokenData { Word = "пожнешь", PartOfSpeech = "ГЛАГОЛ" });
        data.Add(new TokenData { Word = "сеять", PartOfSpeech = "ГЛАГОЛ" });
        data.Add(new TokenData { Word = "пожинать", PartOfSpeech = "ГЛАГОЛ" });
        data.Add(new TokenData { Word = "книга", PartOfSpeech = "СУЩЕСТВИТЕЛЬНОЕ" });
        data.Add(new TokenData { Word = "стол", PartOfSpeech = "СУЩЕСТВИТЕЛЬНОЕ" });
        data.Add(new TokenData { Word = "красивый", PartOfSpeech = "ПРИЛАГАТЕЛЬНОЕ" });
        data.Add(new TokenData { Word = "большой", PartOfSpeech = "ПРИЛАГАТЕЛЬНОЕ" });
        data.Add(new TokenData { Word = "он", PartOfSpeech = "МЕСТОИМЕНИЕ" });
        data.Add(new TokenData { Word = "она", PartOfSpeech = "МЕСТОИМЕНИЕ" });

        IDataView dataView = ml.Data.LoadFromEnumerable(data);

        // настраиваем обучение
        var ucheba = ml.Transforms.Text.FeaturizeText(
                outputColumnName: "WordFeaturized",
                inputColumnName: "Word")
            .Append(ml.Transforms.Conversion.MapValueToKey(
                outputColumnName: "Label",
                inputColumnName: "PartOfSpeech"))
            .Append(ml.MulticlassClassification.Trainers.SdcaMaximumEntropy(
                featureColumnName: "WordFeaturized",
                labelColumnName: "Label"))
            .Append(ml.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

        Console.WriteLine("Обучение модели...");
        var model = ucheba.Fit(dataView);
        Console.WriteLine("Готово!");
        Console.WriteLine();

        // разбираем каждое слово
        var engine = ml.Model.CreatePredictionEngine<TokenData, TokenPrediction>(model);

        Console.WriteLine("Результат:");
        for (int i = 0; i < slova.Length; i++)
        {
            TokenData slovo = new TokenData();
            slovo.Word = slova[i];

            TokenPrediction otvet = engine.Predict(slovo);
            Console.WriteLine(slova[i] + " - " + otvet.PredictedLabel);
        }

    }
}
