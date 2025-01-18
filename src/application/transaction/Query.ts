import { TransactionQueryType, TransactionQueryUseCase } from "@/domain";
import { FirebaseTransactionRepository } from "@/infrastructure";

export default class Query {
  private repository: FirebaseTransactionRepository;
  private transactionQuery?: TransactionQueryUseCase;

  constructor(
    private uid: string,
    private year: number,
    private month: number
  ) {
    this.repository = new FirebaseTransactionRepository(uid);
  }

  async fetchAllTransactionsByUser() {
    const allTransactions = await this.repository.getAllTransactionsByUser();
    this.transactionQuery = new TransactionQueryUseCase(
      allTransactions,
      this.year,
      this.month
    );

    return allTransactions;
  }

  private ensureQueryInitialized() {
    if (!this.transactionQuery) {
      throw new Error(
        "TransactionQuery has not been initialized. Call fetchAllTransactionsByUser() first."
      );
    }
  }

  async getCurrentMonthTransactions() {
    this.ensureQueryInitialized();
    return await this.transactionQuery?.getQueryResults(
      TransactionQueryType.CURRENT_MONTH
    );
  }

  async getPendingTransactions() {
    this.ensureQueryInitialized();
    return await this.transactionQuery?.getQueryResults(
      TransactionQueryType.PENDING
    );
  }

  async getUpcomingTransactions() {
    this.ensureQueryInitialized();
    return await this.transactionQuery?.getQueryResults(
      TransactionQueryType.UPCOMING
    );
  }

  async getIncomeTransactions() {
    this.ensureQueryInitialized();
    return await this.transactionQuery?.getQueryResults(
      TransactionQueryType.INCOME
    );
  }

  async getExpenseTransactions() {
    this.ensureQueryInitialized();
    return await this.transactionQuery?.getQueryResults(
      TransactionQueryType.EXPENSE
    );
  }
}
