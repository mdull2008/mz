using System.Net.Http.Json;
using ProjectBAnk.Models;

namespace ProjectBAnk.Services;

/// <summary>
/// Подключение к сайту и получение JSON с предложениями.
/// API: https://dummyjson.com/products
/// </summary>
public class OfferApiClient
{
    private static readonly HttpClient Http = new()
    {
        Timeout = TimeSpan.FromSeconds(15)
    };

    public const string DefaultUrl = "https://dummyjson.com/products?limit=20";

    public async Task<List<Offer>> LoadOffersAsync(string? url = null)
    {
        var apiUrl = url ?? DefaultUrl;
        var response = await Http.GetFromJsonAsync<OfferApiResponse>(apiUrl)
            ?? throw new InvalidOperationException("Сайт вернул пустой ответ.");

        if (response.Products.Count == 0)
            throw new InvalidOperationException("В JSON нет предложений.");

        return response.Products;
    }
}
