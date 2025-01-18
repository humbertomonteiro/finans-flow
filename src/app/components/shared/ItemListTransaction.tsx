"use client";

import { useState } from "react";

import {
  PaymentHistory,
  Transaction,
  TransactionType,
  Formater,
} from "@/domain";

import { FiXCircle } from "react-icons/fi";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { GoCheckCircle } from "react-icons/go";

import useTransaction from "@/app/data/hooks/useTransaction";
import ModalDeleteTransaction from "./ModalDeleteTransaction";
import ModalUpdateTransaction from "./ModalUpdateTransaction";

interface ItemListProps {
  transaction: Transaction;
  year: number;
  month: number;
}

export default function ItemListTransaction({
  transaction,
  year,
  month,
}: ItemListProps) {
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const { handleStatusUpdate } = useTransaction();
  const formater = new Formater();

  const isInstallment = transaction.installments > 1;
  let currentInstallment = 0;
  let statusTransaction: "pending" | "paid" = "pending";

  if (isInstallment) {
    const startDate = new Date(transaction.startDate);
    const currentDate = new Date(year, month);

    const diffMonths =
      currentDate.getFullYear() * 12 +
      currentDate.getMonth() -
      (startDate.getFullYear() * 12 + startDate.getMonth());

    currentInstallment = diffMonths + 1;
  }

  const paymentStatusForMonth = transaction.paymentHistory.find(
    (payment: PaymentHistory) =>
      new Date(payment.date).getMonth() === month &&
      new Date(payment.date).getFullYear() === year,
  );

  if (paymentStatusForMonth) {
    statusTransaction = paymentStatusForMonth.status;
  }

  async function handleStatus(transaction: Transaction) {
    try {
      await handleStatusUpdate(transaction, year, month);
    } catch (error) {
      console.log("Error, " + error);
    }
  }

  return (
    <li
      className={`text-sm flex justify-between items-center gap-2 p-2 bg-foreground rounded-md border-l-2 ${
        transaction.type === TransactionType.EXPENSE
          ? "border-l-expense"
          : "border-l-income"
      }`}
      key={transaction.id}
    >
      <div className="text-[0.7rem] md:text-sm flex-1 overflow-hidden text-nowrap text-ellipsis">
        <div className="flex flex-col">
          <div>
            {transaction.name}{" "}
            {transaction.installments > 1 &&
              `(${currentInstallment}/${transaction.installments})`}
          </div>

          <div className="text-[0.6rem]">
            {transaction.category} {transaction.fixed && "(Fixa)"}
          </div>
        </div>
      </div>{" "}
      <div className="w-fit text-sm">
        R$ {formater.execute(transaction.value / transaction.installments)}{" "}
      </div>
      <div className="flex lg:gap-4 gap-2">
        <button onClick={() => setShowModalUpdate(!showModalUpdate)}>
          <MdOutlineEdit className="text-xl text-text" />{" "}
          <span className="hidden">Editar Transação</span>
        </button>

        <button onClick={() => setShowModalDelete(!showModalDelete)}>
          <MdDeleteOutline className="text-xl text-secondary" />{" "}
          <span className="hidden">Apagar Transação</span>
        </button>

        <button onClick={() => handleStatus(transaction)}>
          {statusTransaction === "paid" ? (
            <GoCheckCircle className="text-xl text-income" />
          ) : (
            <FiXCircle className="text-xl text-expense" />
          )}
          <span className="hidden">Resolver Transação</span>
        </button>
      </div>
      {showModalDelete && (
        <ModalDeleteTransaction
          transaction={transaction}
          year={year}
          month={month}
          setShow={setShowModalDelete}
        />
      )}
      {showModalUpdate && (
        <ModalUpdateTransaction
          transaction={transaction}
          setShow={setShowModalUpdate}
        />
      )}
    </li>
  );
}
