"use client";

import { Transaction } from "@/domain";
import useTransaction from "@/app/data/hooks/useTransaction";
import ItemListTransaction from "./ItemListTransaction";
import { useMemo } from "react";

interface BoxTransactionsProps {
  transactions: Transaction[];
  yearSpecific?: number;
  monthSpecific?: number;
  type?: string;
}

export default function ListTransactions({
  transactions,
  yearSpecific,
  monthSpecific,
  type,
}: BoxTransactionsProps) {
  const { getUniqueDays, year, month } = useTransaction();

  const uniqueDays = useMemo(() => getUniqueDays(transactions), [transactions]);

  const transactionsByDay = useMemo(
    () =>
      uniqueDays.map((day) => ({
        day,
        transactions: transactions.filter(
          (transaction) => new Date(transaction.startDate).getDate() === day
        ),
      })),
    [uniqueDays, transactions]
  );

  return (
    <ul className="flex flex-col gap-4 py-4">
      {transactionsByDay.length > 0 ? (
        <>
          {transactionsByDay.map(({ day, transactions }) => (
            <li key={day}>
              <p className="ml-4 text-zinc-500">Dia {day}</p>
              <ul className="flex flex-col gap-2 p-2">
                {transactions.map((transaction) => (
                  <ItemListTransaction
                    key={transaction.id}
                    transaction={transaction}
                    year={yearSpecific ? yearSpecific : year}
                    month={monthSpecific ? monthSpecific : month}
                  />
                ))}
              </ul>
            </li>
          ))}
        </>
      ) : (
        <li className="mx-auto text-xl text-textSecondary">
          Não há {type ? type : "transações"} para exibir
        </li>
      )}
    </ul>
  );
}
