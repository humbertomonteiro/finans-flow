import { Transaction, PaymentHistory } from "../entities";
import { PaymentStatus, OptionsAction } from "../enums";

export default class TransactionActionsUseCase {
  public create(transaction: Transaction): Transaction {
    if (transaction.installments > 0) {
      const paymentHistory: PaymentHistory[] = [];

      for (let i = 0; i < transaction.installments; i++) {
        const paymentDate = new Date(transaction.startDate);
        paymentDate.setMonth(paymentDate.getMonth() + i);

        paymentHistory.push({
          date: paymentDate,
          value: transaction.value / transaction.installments,
          status: PaymentStatus.PENDING,
        });
      }

      transaction.paymentHistory = paymentHistory;
    }
    return transaction;
  }

  public handleStatus(
    transaction: Transaction,
    year: number,
    month: number
  ): Transaction {
    const { paymentHistory } = transaction;
    const getPayment = paymentHistory.find((payment) => {
      return (
        new Date(payment.date).getFullYear() === year &&
        new Date(payment.date).getMonth() === month
      );
    });

    if (getPayment) {
      getPayment.status =
        getPayment.status === PaymentStatus.PAID
          ? PaymentStatus.PENDING
          : PaymentStatus.PAID;

      return transaction;
    } else {
      transaction.paymentHistory.push({
        date: new Date(year, month, 1),
        status: PaymentStatus.PAID,
        value: transaction.value,
      });

      return transaction;
    }
  }

  public delete(
    transaction: Transaction,
    year: number,
    month: number,
    option: OptionsAction
  ): Transaction {
    switch (option) {
      case OptionsAction.CURRENT:
        if (transaction.fixed) {
          if (
            new Date(transaction.startDate).getFullYear() === year &&
            new Date(transaction.startDate).getMonth() === month
          ) {
            const originalDate = new Date(transaction.startDate);
            const originalDay = originalDate.getDate();

            const newStartDate = new Date(year, month + 1, originalDay);

            transaction.startDate = newStartDate;
          } else {
            transaction.deletedMonths = transaction.deletedMonths || [];
            transaction.deletedMonths.push({ year, month });
          }
        } else {
          transaction.paymentHistory = transaction.paymentHistory.filter(
            (payment) => {
              return !(
                new Date(payment.date).getFullYear() === year &&
                new Date(payment.date).getMonth() === month
              );
            }
          );
        }
        return transaction;

      case OptionsAction.FROM_CURRENT:
        if (transaction.fixed) {
          transaction.endDate = {
            year: month === 0 ? year - 1 : year,
            month: month === 0 ? 11 : month - 1,
          };
        } else {
          transaction.paymentHistory = transaction.paymentHistory.filter(
            (payment) => {
              return (
                new Date(payment.date).getFullYear() < year ||
                (new Date(payment.date).getFullYear() === year &&
                  new Date(payment.date).getMonth() < month)
              );
            }
          );
        }
        return transaction;

      case OptionsAction.ALL:
        transaction.paymentHistory = [];
        return transaction;
    }
  }

  public update(
    transaction: Transaction,
    newValue: number,
    newName: string,
    newCategory: string
  ): Transaction {
    transaction.value = newValue;
    transaction.name = newName;
    transaction.category = newCategory;

    let { paymentHistory } = transaction;

    paymentHistory.forEach(
      (payment) => (payment.value = newValue / transaction.installments)
    );

    return transaction;
  }
}
