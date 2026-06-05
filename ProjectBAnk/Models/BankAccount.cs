namespace ProjectBAnk.Models;

/// <summary>
/// Простой банковский счёт: имя владельца и баланс.
/// </summary>
public class BankAccount
{
    public string OwnerName { get; }
    public decimal Balance { get; private set; }

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
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Сумма должна быть больше нуля.");

        if (amount > Balance)
            throw new InvalidOperationException("Недостаточно средств на счёте.");

        Balance -= amount;
    }
}
