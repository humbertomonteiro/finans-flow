import { Transaction } from "../entities";
import { PaymentStatus, TransactionType } from "../enums";
import { Formater } from "./utils";

export default class TransactionManagerUseCase {
  private formater: Formater;

  public totalCurrentValue: string;
  public totalBalanceTotal: string;
  public totalIncomeMonth: string;
  public totalExpenseMonth: string;
  public totalBalanceMonth: string;

  constructor(
    private transactions: Transaction[],
    private year: number,
    private month: number
  ) {
    this.formater = new Formater();

    this.totalCurrentValue = this.formater.execute(this.getCurrentValue());
    this.totalBalanceTotal = this.formater.execute(this.getBalanceTotal());
    this.totalIncomeMonth = this.formater.execute(this.getTotalIncomesMonth());
    this.totalExpenseMonth = this.formater.execute(
      this.getTotalExpensesMonth()
    );
    this.totalBalanceMonth = this.formater.execute(this.getTotalBalanceMonth());
  }

  private getCurrentValue(): number {
    return (
      this.getValueTotalStatusPaid(this.transactionIncomes()) -
      this.getValueTotalStatusPaid(this.transactionExpenses())
    );
  }

  private getBalanceTotal(): number {
    const balanceTotal = this.getCurrentValue() + this.getTotalBalanceMonth();
    return balanceTotal;
  }

  private getTotalIncomesMonth(): number {
    return this.getPaymentHistoryCurrent(this.transactionIncomes());
  }

  private getTotalExpensesMonth(): number {
    return this.getPaymentHistoryCurrent(this.transactionExpenses());
  }

  private getTotalBalanceMonth(): number {
    return this.getTotalIncomesMonth() - this.getTotalExpensesMonth();
  }

  private transactionIncomes(): Transaction[] {
    return this.transactions.filter(
      (transaction) => transaction.type === TransactionType.INCOME
    );
  }

  private transactionExpenses(): Transaction[] {
    return this.transactions.filter(
      (transaction) => transaction.type === TransactionType.EXPENSE
    );
  }

  private getValueTotalStatusPaid(transactions: Transaction[]): number {
    return transactions.reduce((total, transaction) => {
      const paidPayment = transaction.paymentHistory.filter(
        (payment) => payment.status === PaymentStatus.PAID
      );
      const totalPaid = paidPayment.reduce(
        (sum, payment) => sum + payment.value,
        0
      );

      return total + totalPaid;
    }, 0);
  }

  private getPaymentHistoryCurrent(transactions: Transaction[]): number {
    const transactionsPaymentHistoryByMonth = transactions.flatMap(
      (transaction) => {
        if (transaction.fixed) {
          const yearTransaction = new Date(transaction.startDate).getFullYear();
          const monthTransaction = new Date(transaction.startDate).getMonth();
          if (
            yearTransaction < this.year ||
            (yearTransaction === this.year && monthTransaction <= this.month)
          ) {
            return [{ value: transaction.value }];
          } else {
            return [];
          }
        } else {
          return transaction.paymentHistory
            .filter((payment) => {
              const yearTransaction = new Date(payment.date).getFullYear();
              const monthTransaction = new Date(payment.date).getMonth();
              return (
                yearTransaction === this.year && monthTransaction === this.month
              );
            })
            .map((payment) => ({ value: payment.value }));
        }
      }
    );

    const transactionPaymentTotalType =
      transactionsPaymentHistoryByMonth.reduce((acc, payment) => {
        return acc + (payment?.value ?? 0);
      }, 0);

    return transactionPaymentTotalType;
  }
}
