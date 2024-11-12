"use client";

import { useState } from "react";

import useTransaction from "@/app/data/hooks/useTransaction";
import NavigatorMonth from "@/app/components/shared/NavigatorMonth";
import BoxManager from "@/app/components/shared/BoxManager";
import ModalAddTransaction from "@/app/components/shared/ModalAddTransaction";
import BoxListTransactions from "@/app/components/shared/BoxListTransactions";

import { PiPiggyBank } from "react-icons/pi";
import { LuTrendingUp, LuTrendingDown } from "react-icons/lu";
import { MdBalance } from "react-icons/md";
import { TbArrowsExchange } from "react-icons/tb";

import Image from "next/image";

export default function Dashboard() {
  const {
    currentValue,
    balanceTotal,
    incomeMonth,
    expenseMonth,
    balanceMonth,
    transactionsOverdues,
    transactionsUpcoming,
  } = useTransaction();

  const [handleListTransactions, setHandleListTransactions] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);

  return (
    <div className="flex flex-col">
      <section className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between">
              <button
                className="button w-fit px-4 text-2xl rounded-xl"
                onClick={() => setShowModalAdd(!showModalAdd)}
              >
                <span className="text-sm hidden lg:block">
                  Adicinar transação
                </span>
                +
              </button>
              <NavigatorMonth />
            </div>
            <BoxManager
              value={currentValue}
              title="Saldo atual"
              icon={<PiPiggyBank className="text-2xl" />}
              type="main"
            />
            <BoxManager
              value={balanceTotal}
              title="Balanço total"
              icon={<MdBalance className="text-2xl" />}
              type="default"
            />
          </div>
          <div className="flex-1 md:flex justify-center hidden">
            <Image
              src="/imgs/img-money.jpg"
              alt="imagem ilustração dinheiro"
              width={300}
              height={300}
              className="rounded-full"
            />
          </div>
        </div>

        <h2 className="text-lg md:text-xl mb-[-2rem] text-textSecondary">
          Resumo do mês
        </h2>
        <div className="grid grid-cols-2 md:flex md:flex-row gap-4">
          <BoxManager
            value={incomeMonth}
            title="Receitas"
            icon={<LuTrendingUp className="text-2xl" />}
            type="income"
          />
          <BoxManager
            value={expenseMonth}
            title="Despesas"
            icon={<LuTrendingDown className="text-2xl" />}
            type="expense"
          />
          <BoxManager
            value={balanceMonth}
            title="Balanço mensal"
            icon={<MdBalance className="text-2xl" />}
            type="default"
            grid={true}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12 sm:grid sm:grid-cols-2 sm:gap-4">
        <div className="bg-foreground p-4 rounded-xl">
          <div className="flex justify-between items-center text-lg mb-4">
            <h2>Transações</h2>
            <TbArrowsExchange
              className="cursor-pointer text-2xl"
              onClick={() => setHandleListTransactions(!handleListTransactions)}
            />
          </div>
          {handleListTransactions ? (
            <BoxListTransactions
              transactions={transactionsUpcoming}
              title="Próximas transações"
            />
          ) : (
            <BoxListTransactions
              transactions={transactionsOverdues}
              title="Transações atrasadas"
            />
          )}
        </div>
      </section>
      {showModalAdd && <ModalAddTransaction setShow={setShowModalAdd} />}
    </div>
  );
}
