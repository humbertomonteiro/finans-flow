import { Transaction } from "../entities";
import { PaymentStatus, TransactionType, TransactionQueryType } from "../enums";

export default class TransactionQueryUseCase {
  constructor(
    private transactions: Transaction[],
    private year: number,
    private month: number,
  ) {}

  public getQueryResults(queryType: TransactionQueryType): Transaction[] {
    switch (queryType) {
      case TransactionQueryType.CURRENT_MONTH:
        return this.getTransactionsForMonth();
      case TransactionQueryType.UPCOMING:
        return this.getUpcomingTransactions();
      case TransactionQueryType.PENDING:
        return this.getPendingTransactionsForMonth();
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
    month: number = this.month,
  ): Transaction[] {
    const transactionUnique = this.getTransactionsUnique(year, month);

    const transactionInstallment = this.getTransactionsInstallments(
      year,
      month,
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
        (transaction) => !transaction.fixed && transaction.installments === 1,
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
    month: number,
  ): Transaction[] {
    return this.transactions
      .filter(
        (transaction) => !transaction.fixed && transaction.installments > 1,
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
            transaction.endDate.month,
          );
          if (startDate > endDate) return false;
        }

        if (transaction.deletedMonths) {
          const isDeleted = transaction.deletedMonths.some(
            (deleted) => deleted.year === year && deleted.month === month,
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
          },
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
      today.getMonth(),
    );

    return transactionMonth.filter((transaction) => {
      const dateTransaction = new Date(transaction.startDate).getDate();
      return (
        dateTransaction >= today.getDate() &&
        dateTransaction <= today.getDate() + 5
      );
    });
  }

  private getPendingTransactionsForMonth(): Transaction[] {
    const transactionsUniquesAndInstallments = this.transactions.filter(
      (transaction) => {
        if (!transaction.fixed) {
          return transaction.paymentHistory.some((payment) => {
            const paymentYear = new Date(payment.date).getFullYear();
            const paymentMonth = new Date(payment.date).getMonth();
            const paymentDay = new Date(payment.date).getDate();
            const today = new Date();

            if (payment.status === PaymentStatus.PAID) return false;

            if (
              paymentYear <= today.getFullYear() &&
              paymentMonth <= today.getMonth() &&
              paymentDay < today.getDate()
            ) {
              return true;
            } else return false;
          });
        }
      },
    );

    const transactionsFixeds = this.getTransactionsFixed(this.year, this.month)
      .filter((transaction) => {
        const hasPaidPaymentForSelectedMonth = transaction.paymentHistory.some(
          (payment) => {
            const paymentDate = new Date(payment.date);
            const today = new Date();

            return (
              paymentDate.getFullYear() === today.getFullYear() &&
              paymentDate.getMonth() === today.getMonth() &&
              payment.status === PaymentStatus.PAID
            );
          },
        );
        return !hasPaidPaymentForSelectedMonth;
      })
      .filter((transaction) => {
        const hasPaidPaymentForSelectedMonth = transaction.paymentHistory.some(
          (payment) => {
            const paymentDate = new Date(payment.date);
            const today = new Date();

            return (
              paymentDate.getFullYear() === today.getFullYear() &&
              paymentDate.getMonth() === today.getMonth() &&
              paymentDate.getDate() > today.getDate()
            );
          },
        );
        return !hasPaidPaymentForSelectedMonth;
      });

    return [...transactionsUniquesAndInstallments, ...transactionsFixeds];
  }

  private getIncomesTransactions(): Transaction[] {
    const transactionsMonth = this.getTransactionsForMonth();
    return transactionsMonth.filter(
      (transaction) => transaction.type === TransactionType.INCOME,
    );
  }

  private getExpensesTransactions(): Transaction[] {
    const transactionsMonth = this.getTransactionsForMonth();
    return transactionsMonth.filter(
      (transaction) => transaction.type === TransactionType.EXPENSE,
    );
  }
}
