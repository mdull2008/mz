using ProjectBAnk.Models;
using ProjectBAnk.Services;

namespace ProjectBAnk;

public partial class OffersForm : Form
{
    private readonly OfferApiClient _api = new();
    private readonly OfferAnalyzer _analyzer = new();
    private List<Offer> _offers = new();

    public OffersForm()
    {
        InitializeComponent();
    }

    private async void btnLoad_Click(object sender, EventArgs e)
    {
        btnLoad.Enabled = false;
        btnAnalyze.Enabled = false;
        lblStatus.Text = "Подключение к сайту...";
        txtResult.Clear();
        dgvOffers.Rows.Clear();

        try
        {
            _offers = await _api.LoadOffersAsync(txtUrl.Text.Trim());
            lblStatus.Text = $"Загружено {_offers.Count} предложений (JSON)";

            foreach (var offer in _offers)
            {
                dgvOffers.Rows.Add(
                    offer.Title,
                    $"{offer.Price:F0} ₽",
                    offer.Rating.ToString("F1"),
                    offer.Category,
                    offer.DiscountPercentage.ToString("F0") + "%");
            }

            _analyzer.Train(_offers);
            btnAnalyze.Enabled = true;
            txtResult.AppendText($"[{DateTime.Now:HH:mm:ss}] JSON прочитан. Нейросеть обучена на {_offers.Count} предложениях.{Environment.NewLine}");
        }
        catch (Exception ex)
        {
            lblStatus.Text = "Ошибка загрузки";
            MessageBox.Show($"Не удалось получить JSON:\n{ex.Message}", "Ошибка",
                MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        finally
        {
            btnLoad.Enabled = true;
        }
    }

    private void btnAnalyze_Click(object sender, EventArgs e)
    {
        if (_offers.Count == 0) return;

        txtResult.AppendText($"{Environment.NewLine}--- Анализ нейросетью ---{Environment.NewLine}");

        var results = _analyzer.AnalyzeAll(_offers);
        var goodCount = 0;

        for (var i = 0; i < _offers.Count; i++)
        {
            var result = results[i];
            _offers[i].AnalysisResult = result.Text;
            dgvOffers.Rows[i].Cells[5].Value = result.IsGood ? "✓ Выгодно" : "✗ Невыгодно";

            txtResult.AppendText(result.Text + Environment.NewLine);
            if (result.IsGood) goodCount++;
        }

        txtResult.AppendText($"{Environment.NewLine}Итого: {goodCount} выгодных из {_offers.Count}{Environment.NewLine}");
        lblStatus.Text = $"Анализ готов: {goodCount} выгодных предложений";
    }
}
