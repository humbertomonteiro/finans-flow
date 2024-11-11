import { Transaction } from "../../entities";

export default class UniqueDays {
  constructor(private transactions: Transaction[]) {}

  execute(): number[] {
    const days = this.transactions.map((transaction) => {
      const date = new Date(transaction.startDate);
      return date.getDate();
    });

    return Array.from(new Set(days)).sort((a, b) => b - a);
  }
}
