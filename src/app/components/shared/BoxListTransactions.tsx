import { Transaction } from "@/domain";
import ListTransactions from "./ListTransactions";

interface BoxListTransactionsProps {
  transactions: Transaction[];
  title: string;
}

export default function BoxListTransactions({
  transactions,
  title,
}: BoxListTransactionsProps) {
  return (
    <article className="flex-1 rounded-xl bg-background">
      <div className="flex justify-between items-center pt-4 pb-0 pl-2">
        <h2 className="text-md text-textSecondary">{title}</h2>
      </div>
      <div className=" w-full max-h-[350px] overflow-y-scroll rounded-xl">
        <ListTransactions
          transactions={transactions}
          yearSpecific={new Date().getFullYear()}
          monthSpecific={new Date().getMonth()}
          type={title}
        />
      </div>
    </article>
  );
}
