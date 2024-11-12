"use client";

import { Transaction, TransactionType } from "@/domain";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { IoClose } from "react-icons/io5";

import useAuth from "@/app/data/hooks/useAuth";
import useTransaction from "@/app/data/hooks/useTransaction";

import {
  incomesCategories,
  expensesCategories,
} from "@/app/data/constants/categories";

interface ModalUpdateTransactionProps {
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function ModalAddTransaction({
  setShow,
}: ModalUpdateTransactionProps) {
  const { createTransaction } = useTransaction();
  const { user } = useAuth();

  const [value, setValue] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [installments, setInstallments] = useState<string>("1");
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [fixed, setFixed] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function handleAddTransaction(formEvent: FormEvent) {
    formEvent.preventDefault();

    if (+installments < 0) {
      setError("Valor de parcelas não é permitido");
      return;
    }
    if (+installments > 1 && fixed) {
      setError("Não é permitido tem parcelas em transações fixas.");
      return;
    }

    try {
      const dataTransaction: Transaction = {
        category,
        fixed,
        installments: +installments,
        name,
        startDate: new Date(`${date}T12:00:00`),
        type,
        user: user?.uid!,
        value: +value,
        paymentHistory: [],
      };

      setError("");
      console.log(dataTransaction);
      createTransaction(dataTransaction);
      setShow(false);
    } catch (error) {
      console.error("Error ", error);
    }
  }
  return (
    <article className="fixed z-10 right-0 left-0 top-0 bottom-0 flex justify-center items-center bg-[#1b1b1be1]">
      <div className="bg-background p-4 rounded-xl flex flex-col z-20 w-[90%] max-w-[450px]">
        <div className="flex justify-between items-center gap-4 text-xl">
          <h2 className="mb-1 p-0">Adicionar transação</h2>
          <IoClose
            onClick={() => setShow(false)}
            className="cursor-pointer text-2xl"
          />
        </div>
        <p className="mb-2">Preencha os campos abaixo</p>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setType(TransactionType.INCOME)}
            className="button bg-income"
          >
            Receita
          </button>
          <button
            onClick={() => setType(TransactionType.EXPENSE)}
            className="button bg-expense"
          >
            Despesa
          </button>
        </div>

        <form onSubmit={handleAddTransaction} className="flex flex-col gap-4">
          <label>
            <p className="text-[0.7rem]">Nome</p>
            <input
              type="text"
              className="input"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </label>
          <label>
            <p className="text-[0.7rem]">Valor</p>
            <input
              type="number"
              className="input"
              onChange={(e) => setValue(e.target.value)}
              value={value}
              required
            />
          </label>
          <label>
            <p className="text-[0.7rem]">Categoria</p>
            <select
              className="input"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
            >
              <option value="">Escolha uma categoria</option>
              {type === TransactionType.INCOME ? (
                <>
                  {incomesCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </>
              ) : (
                <>
                  {expensesCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>
          <label>
            <p className="text-[0.7rem]">Data</p>
            <input
              type="date"
              className="input"
              onChange={(e) => setDate(e.target.value)}
              value={date}
              required
            />
          </label>
          <label>
            <p className="text-[0.7rem]">Parcelada?</p>
            <input
              type="number"
              className="input"
              onChange={(e) => setInstallments(e.target.value)}
              value={installments}
              required
            />
          </label>
          <label className={`flex gap-4 cursor-pointer`}>
            <p className="text-[0.7rem]">Fixa?</p>
            <input
              type="checkbox"
              className="w-5 h-5 "
              onChange={(e) => setFixed(!fixed)}
              checked={fixed}
            />
          </label>
          <div className="text-expense">{error}</div>
          <button className={`button bg-${type}`}>
            Adicionar {type === TransactionType.INCOME ? "Receita" : "Despesa"}
          </button>
        </form>
      </div>
    </article>
  );
}
