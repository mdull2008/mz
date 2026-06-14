namespace ProjectBAnk.Models;

public enum OperationKind
{
    Deposit,
    Withdraw
}

public record OperationRecord(DateTime Time, decimal Amount, OperationKind Kind);
