import { Transaction } from "../entities";

export default interface TransactionCRUD {
  getTransaction(id: string): Promise<Transaction | null>;
  getAllTransactionsByUser(uid: string): Promise<Transaction[]>;
  createTransaction(transaction: Transaction): Promise<string | null>;
  updateTransaction(transaction: Transaction): Promise<boolean>;
  deleteTransaction(id: string): Promise<boolean>;
}
