using ProjectBAnk.Models;
using ProjectBAnk.Services;

namespace ProjectBAnk;

public partial class MainForm : Form
{
    private BankAccount? _account;
    private readonly FraudDetector _fraudDetector = new();

    public MainForm()
    {
        InitializeComponent();
        txtLog.AppendText($"[{DateTime.Now:HH:mm:ss}] Нейросеть ML.NET загружена. Проверка мошенничества включена.{Environment.NewLine}");
    }

    private void btnCreate_Click(object sender, EventArgs e)
    {
        var name = txtName.Text.Trim();
        if (string.IsNullOrEmpty(name))
        {
            MessageBox.Show("Введите имя владельца счёта.", "Ошибка",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        if (!decimal.TryParse(txtInitialBalance.Text, out var balance) || balance < 0)
        {
            MessageBox.Show("Начальный баланс должен быть числом ≥ 0.", "Ошибка",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        _account = new BankAccount(name, balance);
        lblBalance.Text = $"Баланс: {_account.Balance:F2} ₽";
        lblOwner.Text = $"Счёт: {_account.OwnerName}";
        grpOperations.Enabled = true;
        txtLog.AppendText($"[{DateTime.Now:HH:mm:ss}] Создан счёт «{name}», баланс {balance:F2} ₽{Environment.NewLine}");
    }

    private void btnDeposit_Click(object sender, EventArgs e)
    {
        if (!TryGetAmount(out var amount)) return;
        ProcessOperation(amount, isWithdrawal: false);
    }

    private void btnWithdraw_Click(object sender, EventArgs e)
    {
        if (!TryGetAmount(out var amount)) return;
        ProcessOperation(amount, isWithdrawal: true);
    }

    private void ProcessOperation(decimal amount, bool isWithdrawal)
    {
        try
        {
            var input = _account!.BuildTransactionInput(amount, isWithdrawal);
            var check = _fraudDetector.Check(input);

            if (check.IsFraud)
            {
                var action = isWithdrawal ? "снятие" : "пополнение";
                var answer = MessageBox.Show(
                    $"⚠ Подозрительная операция ({action})!\n\n" +
                    $"Риск мошенничества: {check.RiskPercent}%\n" +
                    $"{check.Reason}\n\n" +
                    "Всё равно выполнить операцию?",
                    "Проверка ML.NET",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Warning);

                if (answer == DialogResult.No)
                {
                    txtLog.AppendText($"[{DateTime.Now:HH:mm:ss}] Операция отменена (риск {check.RiskPercent}%){Environment.NewLine}");
                    return;
                }
            }

            if (isWithdrawal)
                _account.Withdraw(amount);
            else
                _account.Deposit(amount);

            UpdateBalance();

            var sign = isWithdrawal ? "-" : "+";
            var label = isWithdrawal ? "снятие" : "пополнение";
            var riskInfo = check.IsFraud ? $" [риск {check.RiskPercent}%]" : " [ок]";
            txtLog.AppendText($"[{DateTime.Now:HH:mm:ss}] {sign}{amount:F2} ₽ ({label}){riskInfo}{Environment.NewLine}");
        }
        catch (Exception ex)
        {
            MessageBox.Show(ex.Message, "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }

    private bool TryGetAmount(out decimal amount)
    {
        if (_account is null)
        {
            MessageBox.Show("Сначала создайте счёт.", "Ошибка",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            amount = 0;
            return false;
        }

        if (!decimal.TryParse(txtAmount.Text, out amount) || amount <= 0)
        {
            MessageBox.Show("Введите сумму больше нуля.", "Ошибка",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return false;
        }

        return true;
    }

    private void UpdateBalance()
    {
        lblBalance.Text = $"Баланс: {_account!.Balance:F2} ₽";
    }

    private void btnOffers_Click(object sender, EventArgs e)
    {
        using var form = new OffersForm();
        form.ShowDialog();
    }
}
