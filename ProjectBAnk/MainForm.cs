using ProjectBAnk.Models;

namespace ProjectBAnk;

public partial class MainForm : Form
{
    private BankAccount? _account;

    public MainForm()
    {
        InitializeComponent();
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

        try
        {
            _account!.Deposit(amount);
            UpdateBalance();
            txtLog.AppendText($"[{DateTime.Now:HH:mm:ss}] +{amount:F2} ₽ (пополнение){Environment.NewLine}");
        }
        catch (Exception ex)
        {
            MessageBox.Show(ex.Message, "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }

    private void btnWithdraw_Click(object sender, EventArgs e)
    {
        if (!TryGetAmount(out var amount)) return;

        try
        {
            _account!.Withdraw(amount);
            UpdateBalance();
            txtLog.AppendText($"[{DateTime.Now:HH:mm:ss}] -{amount:F2} ₽ (снятие){Environment.NewLine}");
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
}
