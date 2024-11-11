import { PaymentStatus } from "../enums";

export default interface PaymentHistory {
  date: Date;
  value: number;
  status: PaymentStatus;
}
