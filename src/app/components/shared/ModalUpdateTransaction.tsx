import { Transaction } from "@/domain";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { IoClose } from "react-icons/io5";

import useTransaction from "@/app/data/hooks/useTransaction";

interface ModalUpdateTransactionProps {
  transaction: Transaction;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function ModalUpdateTransaction({
  transaction,
  setShow,
}: ModalUpdateTransactionProps) {
  const { updateTransaction } = useTransaction();

  const [name, setName] = useState(transaction.name);
  const [value, setValue] = useState(`${transaction.value}`);
  const [category, setCategory] = useState(transaction.category);

  async function handleUpdateTransaction(formEvent: FormEvent) {
    formEvent.preventDefault();
    try {
      updateTransaction(transaction, +value, name, category);
    } catch (error) {
      console.error("Error ", error);
    }
    setShow(false);
  }
  return (
    <article className="fixed z-10 right-0 left-0 top-0 bottom-0 flex justify-center items-center bg-[#2929297a]">
      <div className="bg-background p-4 rounded-xl flex flex-col z-20 w-[90%] max-w-[450px]">
        <div className="flex justify-between items-center gap-4 text-xl">
          <h2 className="mb-1 p-0">Editar transação</h2>
          <IoClose
            onClick={() => setShow(false)}
            className="cursor-pointer text-2xl"
          />
        </div>
        <p className="mb-2">Altere os campos abaixo</p>

        <form
          onSubmit={handleUpdateTransaction}
          className="flex flex-col gap-4"
        >
          <label htmlFor="">
            <p className="text-[0.7rem]">Nome</p>
            <input
              type="text"
              className="input"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </label>
          <label htmlFor="">
            <p className="text-[0.7rem]">Valor</p>
            <input
              type="text"
              className="input"
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          </label>
          <label htmlFor="">
            <p className="text-[0.7rem]">Categoria</p>
            <input
              type="text"
              className="input"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />
          </label>
          <button className="button">Editar</button>
        </form>
      </div>
    </article>
  );
}
