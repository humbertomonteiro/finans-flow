"use client";

import Link from "next/link";
import { useState } from "react";

import { HiCurrencyDollar } from "react-icons/hi2";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoList, IoSettingsOutline } from "react-icons/io5";
import { LuTrendingUp } from "react-icons/lu";

import ModalAddTransaction from "../shared/ModalAddTransaction";

export default function Header() {
  const [showModalAdd, setShowModalAdd] = useState(false);
  return (
    <header className="bg-foreground px-4 flex justify-between items-center">
      <Link
        className="py-6 text-xl font-bold flex items-center gap-1"
        href="/dashboard"
      >
        Finans Flow <HiCurrencyDollar className="text-2xl " />
      </Link>

      <nav className="fixed bottom-0 left-0 right-0 bg-foreground p-4 md:p-0 md:static flex justify-between gap-4">
        <Link
          className="text-[0.65rem] flex-1 text-center flex-col md:flex-row flex justify-between items-center gap-1 md:text-sm"
          href="/dashboard"
        >
          <MdOutlineSpaceDashboard className="text-xl " /> Dashboard
        </Link>
        <Link
          className="text-[0.65rem] flex-1 text-center flex-col md:flex-row flex justify-between items-center gap-1 md:text-sm"
          href="/transactions"
        >
          <IoList className="text-xl " /> Transações
        </Link>
        <button
          onClick={() => setShowModalAdd(!showModalAdd)}
          className="text-2xl button p-0 h-[55px] w-[55px] rounded-full fixed bottom-[45px] left-[44%] md:top-[80px] md:right-4 md:left-auto md:rounded-xl md:h-[40px] md:w-[60px]"
        >
          +
        </button>
        <Link
          className="text-[0.65rem] flex-1 text-center flex-col md:flex-row flex justify-between items-center gap-1 md:text-sm"
          href="/transactions"
        >
          <LuTrendingUp className="text-xl " /> Performance
        </Link>
        <Link
          className="text-[0.65rem] flex-1 text-center flex-col md:flex-row flex justify-between items-center gap-1 md:text-sm"
          href="/settings"
        >
          <IoSettingsOutline className="text-xl " /> Configurações
        </Link>
      </nav>
      <button className="button w-fit text-2xl hidden md:static">
        <span className="text-sm hidden lg:block">Adicinar transação</span>+
      </button>
      {showModalAdd && <ModalAddTransaction setShow={setShowModalAdd} />}
    </header>
  );
}
