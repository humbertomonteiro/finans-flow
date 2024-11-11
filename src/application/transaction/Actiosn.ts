import { OptionsAction, Transaction } from "@/domain";
import { FirebaseTransactionRepository } from "@/infrastructure";
import { TransactionActionsUseCase } from "@/domain";

export default class Actions {
  private repository: FirebaseTransactionRepository;
  private transactionActions: TransactionActionsUseCase;

  constructor(private uid: string) {
    this.repository = new FirebaseTransactionRepository(uid);
    this.transactionActions = new TransactionActionsUseCase();
  }

  async createTransaction(
    transaction: Transaction
  ): Promise<Transaction | null> {
    try {
      const transactionUseCase = this.transactionActions.create({
        ...transaction,
      });

      const transactionId = await this.repository.createTransaction(
        transactionUseCase
      );

      if (!transactionId) {
        return null;
      }

      return { ...transactionUseCase, id: transactionId };
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
  }

  async handleStatus(
    transaction: Transaction,
    year: number,
    month: number
  ): Promise<boolean> {
    const updateTransaction = this.transactionActions.handleStatus(
      transaction,
      year,
      month
    );
    return await this.repository.updateTransaction(updateTransaction);
  }

  async deleteTransaction(
    transaction: Transaction,
    year: number,
    month: number,
    option: OptionsAction
  ): Promise<void> {
    const updatedTransaction = this.transactionActions.delete(
      transaction,
      year,
      month,
      option
    );

    if (option === OptionsAction.ALL) {
      await this.repository.deleteTransaction(transaction.id!);
    } else {
      await this.repository.updateTransaction(updatedTransaction);
    }
  }

  async updateTransaction(
    transaction: Transaction,
    newValue: number,
    newName: string,
    newCategory: string
  ): Promise<boolean> {
    const updatedTransaction = this.transactionActions.update(
      transaction,
      newValue,
      newName,
      newCategory
    );
    return await this.repository.updateTransaction(updatedTransaction);
  }
}
