namespace ProjectBAnk.Models;

/// <summary>
/// Простой банковский счёт: имя владельца и баланс.
/// </summary>
public class BankAccount
{
    private readonly List<OperationRecord> _history = new();

    public string OwnerName { get; }
    public decimal Balance { get; private set; }
    public IReadOnlyList<OperationRecord> History => _history;

    public BankAccount(string ownerName, decimal initialBalance = 0)
    {
        OwnerName = ownerName;
        Balance = initialBalance;
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Сумма должна быть больше нуля.");

        Balance += amount;
        _history.Add(new OperationRecord(DateTime.Now, amount, OperationKind.Deposit));
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Сумма должна быть больше нуля.");

        if (amount > Balance)
            throw new InvalidOperationException("Недостаточно средств на счёте.");

        Balance -= amount;
        _history.Add(new OperationRecord(DateTime.Now, amount, OperationKind.Withdraw));
    }

    public int GetTransactionsLastHour()
    {
        var hourAgo = DateTime.Now.AddHours(-1);
        return _history.Count(op => op.Time >= hourAgo);
    }

    public TransactionInput BuildTransactionInput(decimal amount, bool isWithdrawal)
    {
        var balanceBefore = Balance;
        var ratio = balanceBefore <= 0 ? 1f : (float)(amount / balanceBefore);

        return new TransactionInput
        {
            Amount = (float)amount,
            Hour = DateTime.Now.Hour,
            TransactionsLastHour = GetTransactionsLastHour(),
            IsWithdrawal = isWithdrawal ? 1f : 0f,
            BalanceRatio = Math.Min(ratio, 1f)
        };
    }
}
