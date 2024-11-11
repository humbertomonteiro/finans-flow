import { ReactElement } from "react";
import { IconType } from "react-icons";
import { PiPiggyBank } from "react-icons/pi";
interface BoxManagerProps {
  value: number | string;
  title: string;
  icon: ReactElement<any, any>;
  type: "main" | "default" | "income" | "expense";
  grid?: boolean;
}

export default function BoxManager({
  value,
  title,
  icon,
  type,
  grid,
}: BoxManagerProps) {
  return (
    <article
      className={`${type === "main" && "bg-primary"} ${
        grid && "col-span-2"
      } flex-1 bg-foreground py-2 px-4 rounded-xl border border-neutral-900`}
    >
      <span
        className={`${
          type === "income"
            ? "text-income"
            : type === "expense"
            ? "text-expense"
            : "text-zinc-00"
        } flex justify-between items-center text-sm mb-4`}
      >
        {title} {icon}
      </span>
      <p className="text-xl md:text-3xl font-bold">
        <span className="text-sm">R$ </span>
        {value}
      </p>
    </article>
  );
}
