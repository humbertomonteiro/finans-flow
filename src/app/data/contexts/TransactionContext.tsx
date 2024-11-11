"use client";

import {
  OptionsAction,
  Transaction,
  TransactionManagerUseCase,
} from "@/domain";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Query, Actions } from "@/application";

interface TransactionContextProps {
  transactions: Transaction[];
  transactionsByMonth: Transaction[];
  transactionsOverdues: Transaction[];
  transactionsUpcoming: Transaction[];
  currentValue: string;
  balanceTotal: string;
  incomeMonth: string;
  expenseMonth: string;
  balanceMonth: string;
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
  getUniqueDays(transactions: Transaction[]): number[];
  actions: Actions;
  handleStatusUpdate(
    transaction: Transaction,
    year: number,
    month: number
  ): Promise<void>;
  deleteTransaction(
    transaction: Transaction,
    year: number,
    month: number,
    option: OptionsAction
  ): Promise<void>;
  updateTransaction(
    transaction: Transaction,
    newValue: number,
    newName: string,
    newCategory: string
  ): Promise<void>;
  createTransaction(transaction: Transaction): Promise<void>;
}

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionContext = createContext<TransactionContextProps>(
  {} as any
);

export default function TransactionProvider({
  children,
}: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsByMonth, setTransactionsByMonth] = useState<Transaction[]>(
    []
  );
  const [transactionsOverdues, setTransactionsOverdues] = useState<
    Transaction[]
  >([]);
  const [transactionsUpcoming, setTransactionsUpcoming] = useState<
    Transaction[]
  >([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [currentValue, setCurrentValue] = useState("0");
  const [balanceTotal, setBalanceTotal] = useState("0");
  const [incomeMonth, setIncomeMonth] = useState("0");
  const [expenseMonth, setExpenseMonth] = useState("0");
  const [balanceMonth, setBalanceMonth] = useState("0");

  const query = new Query("hZ43IWdDoYQ2wITWALAGPlpVyWq1", year, month);
  const actions = new Actions("hZ43IWdDoYQ2wITWALAGPlpVyWq1");

  useEffect(() => {
    loadTransactions();
  }, [year, month]);

  useEffect(() => {
    const manager = new TransactionManagerUseCase(transactions, year, month);
    setCurrentValue(manager.totalCurrentValue);
    setBalanceTotal(manager.totalBalanceTotal);
    setIncomeMonth(manager.totalIncomeMonth);
    setExpenseMonth(manager.totalExpenseMonth);
    setBalanceMonth(manager.totalBalanceMonth);
  }, [transactions, year, month]);

  async function loadTransactions() {
    try {
      const allTransactionsUser = await query.fetchAllTransactionsByUser();

      setTransactions(allTransactionsUser || []);
      setTransactionsByMonth((await query.getCurrentMonthTransactions()) || []);
      setTransactionsOverdues((await query.getOverdueTransactions()) || []);
      setTransactionsUpcoming((await query.getUpcomingTransactions()) || []);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  }

  function getUniqueDays(transactions: Transaction[]): number[] {
    const days = transactions.map((transaction) => {
      const date = new Date(transaction.startDate);
      return date.getDate();
    });

    return Array.from(new Set(days)).sort((a, b) => a - b);
  }

  async function handleStatusUpdate(
    transaction: Transaction,
    year: number,
    month: number
  ) {
    try {
      await actions.handleStatus(transaction, year, month);
      await loadTransactions();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  async function deleteTransaction(
    transaction: Transaction,
    year: number,
    month: number,
    option: OptionsAction
  ): Promise<void> {
    try {
      await actions.deleteTransaction(transaction, year, month, option);
      await loadTransactions();
    } catch (error) {
      console.error("Error delete Payment:", error);
    }
  }

  async function updateTransaction(
    transaction: Transaction,
    newValue: number,
    newName: string,
    newCategory: string
  ): Promise<void> {
    try {
      await actions.updateTransaction(
        transaction,
        newValue,
        newName,
        newCategory
      );
      await loadTransactions();
    } catch (error) {
      console.error("Error update Payment:", error);
    }
  }

  async function createTransaction(transaction: Transaction): Promise<void> {
    try {
      await actions.createTransaction(transaction);
      await loadTransactions();
    } catch (error) {
      console.error("Error update Payment:", error);
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        transactionsByMonth,
        transactionsOverdues,
        transactionsUpcoming,
        currentValue,
        balanceTotal,
        incomeMonth,
        expenseMonth,
        balanceMonth,
        year,
        setYear,
        month,
        setMonth,
        getUniqueDays,
        actions,
        handleStatusUpdate,
        deleteTransaction,
        updateTransaction,
        createTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
