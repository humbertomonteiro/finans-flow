import { Transaction } from "../entities";
import { PaymentStatus, TransactionType, TransactionQueryType } from "../enums";

export default class TransactionQueryUseCase {
  constructor(
    private transactions: Transaction[],
    private year: number,
    private month: number
  ) {}

  public getQueryResults(queryType: TransactionQueryType): Transaction[] {
    switch (queryType) {
      case TransactionQueryType.CURRENT_MONTH:
        return this.getTransactionsForMonth();
      case TransactionQueryType.UPCOMING:
        return this.getUpcomingTransactions();
      case TransactionQueryType.OVERDUE:
        return this.getOverduesTransactions();
      case TransactionQueryType.INCOME:
        return this.getIncomesTransactions();
      case TransactionQueryType.EXPENSE:
        return this.getExpensesTransactions();
      default:
        return [];
    }
  }

  private getTransactionsForMonth(
    year: number = this.year,
    month: number = this.month
  ): Transaction[] {
    const transactionUnique = this.getTransactionsUnique(year, month);

    const transactionInstallment = this.getTransactionsInstallments(
      year,
      month
    );

    const transactionFixed = this.getTransactionsFixed(year, month);

    return [
      ...transactionUnique,
      ...transactionInstallment,
      ...transactionFixed,
    ];
  }

  private getTransactionsUnique(year: number, month: number): Transaction[] {
    return this.transactions
      .filter(
        (transaction) => !transaction.fixed && transaction.installments === 1
      )
      .filter((transaction) => {
        return (
          new Date(transaction.startDate).getFullYear() === year &&
          new Date(transaction.startDate).getMonth() === month
        );
      });
  }

  private getTransactionsInstallments(
    year: number,
    month: number
  ): Transaction[] {
    return this.transactions
      .filter(
        (transaction) => !transaction.fixed && transaction.installments > 1
      )
      .filter((transaction) => {
        return transaction.paymentHistory.some((payment) => {
          return (
            new Date(payment.date).getFullYear() === year &&
            new Date(payment.date).getMonth() === month
          );
        });
      });
  }

  private getTransactionsFixed(year: number, month: number): Transaction[] {
    const startDate = new Date(year, month);

    return this.transactions
      .filter((transaction) => transaction.fixed)
      .filter((transaction) => {
        if (transaction.endDate) {
          const endDate = new Date(
            transaction.endDate.year,
            transaction.endDate.month
          );
          if (startDate > endDate) return false;
        }

        if (transaction.deletedMonths) {
          const isDeleted = transaction.deletedMonths.some(
            (deleted) => deleted.year === year && deleted.month === month
          );
          if (isDeleted) return false;
        }

        const hasPaymentForMonth = transaction.paymentHistory.some(
          (payment) => {
            const paymentDate = new Date(payment.date);
            return (
              paymentDate.getFullYear() === year &&
              paymentDate.getMonth() === month
            );
          }
        );

        return (
          new Date(transaction.startDate) <= startDate || hasPaymentForMonth
        );
      });
  }

  private getUpcomingTransactions(): Transaction[] {
    const today = new Date();

    const transactionMonth = this.getTransactionsForMonth(
      today.getFullYear(),
      today.getMonth()
    );

    return transactionMonth.filter((transaction) => {
      const dateTransaction = new Date(transaction.startDate).getDate();
      return (
        dateTransaction >= today.getDate() &&
        dateTransaction <= today.getDate() + 5
      );
    });
  }

  private getOverduesTransactions(): Transaction[] {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return this.transactions.filter((transaction) => {
      if (transaction.fixed) {
        const isDeletedForCurrentMonth = transaction.deletedMonths?.some(
          (deleted) =>
            deleted.year === currentYear && deleted.month === currentMonth
        );

        if (isDeletedForCurrentMonth) return false;

        const hasPaymentAndAsPending = transaction.paymentHistory.some(
          (payment) => {
            const paymentDate = new Date(payment.date);

            return (
              payment.status === PaymentStatus.PENDING &&
              paymentDate < new Date()
            );
          }
        );

        const hasCurrentPayment = transaction.paymentHistory.some((payment) => {
          const paymentDate = new Date(payment.date);
          return (
            paymentDate.getFullYear() === currentYear &&
            paymentDate.getMonth() === currentMonth
          );
        });

        return (
          (!hasCurrentPayment && new Date(transaction.startDate) < today) ||
          hasPaymentAndAsPending
        );
      } else {
        return transaction.paymentHistory.some((payment) => {
          const paymentDate = new Date(payment.date);

          return (
            payment.status === PaymentStatus.PENDING && paymentDate < new Date()
          );
        });
      }
    });
  }

  private getIncomesTransactions(): Transaction[] {
    const transactionsMonth = this.getTransactionsForMonth();
    return transactionsMonth.filter(
      (transaction) => transaction.type === TransactionType.INCOME
    );
  }

  private getExpensesTransactions(): Transaction[] {
    const transactionsMonth = this.getTransactionsForMonth();
    return transactionsMonth.filter(
      (transaction) => transaction.type === TransactionType.EXPENSE
    );
  }
}
