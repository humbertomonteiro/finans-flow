import { OptionsAction, Transaction } from "@/domain";
import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";

import useTransaction from "@/app/data/hooks/useTransaction";

interface ModalDeleteTransactionProps {
  transaction: Transaction;
  year: number;
  month: number;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function ModalDeleteTransaction({
  transaction,
  year,
  month,
  setShow,
}: ModalDeleteTransactionProps) {
  const { deleteTransaction } = useTransaction();

  async function handleDeleteTransaction(option: OptionsAction) {
    try {
      await deleteTransaction(transaction, year, month, option);
      setShow(false);
    } catch (error) {
      console.error("Error ", error);
    }
  }

  return (
    <article className="fixed z-10 right-0 left-0 top-0 bottom-0 flex justify-center items-center bg-[#2929297a]">
      <div className="bg-background p-4 rounded-xl flex flex-col z-20 w-[90%] max-w-[400px]">
        <div className="flex justify-between items-center gap-4 text-xl">
          <h2 className="mb-1 p-0">Deletar transação</h2>
          <IoClose
            onClick={() => setShow(false)}
            className="cursor-pointer text-2xl"
          />
        </div>
        <p className="mb-2">Você quer apagar</p>
        {transaction.installments > 1 || transaction.fixed ? (
          <div className="flex flex-col justify-between gap-2 flex-wrap">
            <button
              onClick={() => handleDeleteTransaction(OptionsAction.CURRENT)}
              className="bg-secondary rounded-lg text-background flex-1 min-w text-sm py-1"
            >
              Apenas essa
            </button>
            <button
              onClick={() =>
                handleDeleteTransaction(OptionsAction.FROM_CURRENT)
              }
              className="bg-primary rounded-lg text-background flex-1 min-w text-sm py-1"
            >
              Dessa am diante
            </button>
            <button
              onClick={() => handleDeleteTransaction(OptionsAction.ALL)}
              className="bg-expense rounded-lg text-background flex-1 min-w text-sm py-1"
            >
              Todas
            </button>
          </div>
        ) : (
          <div className="flex justify-between gap-2">
            <button
              onClick={() => handleDeleteTransaction(OptionsAction.ALL)}
              className="bg-income rounded-lg text-background flex-1 text-sm py-1"
            >
              Sim
            </button>
            <button
              onClick={() => setShow(false)}
              className="bg-expense rounded-lg text-background flex-1 text-sm py-1"
            >
              Não
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
