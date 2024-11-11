"use client";

import useTransaction from "@/app/data/hooks/useTransaction";
import ListTransactions from "@/app/components/shared/ListTransactions";
import NavigatorMonth from "@/app/components/shared/NavigatorMonth";

export default function Transactions() {
  const { transactionsByMonth } = useTransaction();
  return (
    <div className="flex flex-col gap-6">
      <div className="ml-2 mt-2 flex justify-between items-center ">
        <h1 className="text-xl text-zinc-500">TRANSAÇÕES</h1>
        <NavigatorMonth />
      </div>
      <ListTransactions transactions={transactionsByMonth} />
    </div>
  );
}
