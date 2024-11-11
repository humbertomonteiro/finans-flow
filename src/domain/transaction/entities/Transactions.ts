import { Timestamp } from "firebase/firestore";
import { TransactionType } from "../enums";
import PaymentHistory from "./PaymentHistory";

export default interface Transaction {
  id?: string;
  value: number;
  name: string;
  category: string;
  installments: number;
  paymentHistory: PaymentHistory[];
  startDate: Date;
  type: TransactionType;
  fixed: boolean;
  user: string;
  deletedMonths?: { year: number; month: number }[];
  endDate?: { year: number; month: number };
}
