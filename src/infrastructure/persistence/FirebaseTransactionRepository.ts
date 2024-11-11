import { Transaction, TransactionCRUD } from "@/domain/transaction";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export default class FirebaseTransactionRepository implements TransactionCRUD {
  constructor(private uid: string) {}

  private fromFirestoreFormat(transaction: Transaction): Transaction {
    return {
      ...transaction,
      startDate:
        transaction.startDate instanceof Timestamp
          ? transaction.startDate.toDate()
          : transaction.startDate,
      paymentHistory: transaction.paymentHistory.map((payment) => ({
        ...payment,
        date:
          payment.date instanceof Timestamp
            ? payment.date.toDate()
            : payment.date,
      })),
    };
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    try {
      const transactionRef = doc(db, "transactions", id);
      const transactionSnap = await getDoc(transactionRef);

      if (transactionSnap.exists()) {
        return this.fromFirestoreFormat(transactionSnap.data() as Transaction);
      } else {
        this.logError(`Transaction not found for ID: ${id}`);
        return null;
      }
    } catch (error) {
      this.logError("Error fetching transaction from Firebase:", error);
      return null;
    }
  }

  async getAllTransactionsByUser(): Promise<Transaction[]> {
    try {
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("user", "==", this.uid));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) =>
        this.fromFirestoreFormat({ id: doc.id, ...doc.data() } as Transaction)
      ) as Transaction[];
    } catch (error) {
      this.logError("Error fetching transactions from Firebase:", error);
      return [];
    }
  }

  async createTransaction(transaction: Transaction): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, "transactions"), transaction);
      return docRef.id;
    } catch (error) {
      this.logError("Error adding transaction to Firebase:", error);
      return null;
    }
  }

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      const transactionRef = doc(db, "transactions", id);
      await deleteDoc(transactionRef);
      return true;
    } catch (error) {
      this.logError("Error deleting transaction from Firebase:", error);
      return false;
    }
  }

  async updateTransaction(transaction: Transaction): Promise<boolean> {
    if (!transaction.id) {
      this.logError("Transaction ID is required to update the transaction.");
      return false;
    }
    try {
      const transactionRef = doc(db, "transactions", transaction.id);
      await updateDoc(transactionRef, { ...transaction });
      return true;
    } catch (error) {
      this.logError("Error updating transaction in Firebase:", error);
      return false;
    }
  }

  private logError(message: string, error?: unknown) {
    // Implementar um serviço de log centralizado
    console.error(message, error);
  }
}
