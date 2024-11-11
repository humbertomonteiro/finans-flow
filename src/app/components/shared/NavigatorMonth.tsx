import {
  IoChevronBackCircleOutline,
  IoChevronForwardCircleOutline,
} from "react-icons/io5";
import useTransaction from "@/app/data/hooks/useTransaction";

export default function NavigatorMonth() {
  const { year, setYear, month, setMonth } = useTransaction();

  function changeMonth(direction: "prev" | "next") {
    if (direction === "prev") {
      if (month > 0) {
        setMonth(month - 1);
      } else {
        setMonth(11);
        setYear(year - 1);
      }
    } else if (direction === "next") {
      if (month < 11) {
        setMonth(month + 1);
      } else {
        setMonth(0);
        setYear(year + 1);
      }
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1;

    setYear(selectedYear);
    setMonth(selectedMonth);
  };
  return (
    <div className="flex gap-1">
      <button onClick={() => changeMonth("prev")}>
        <IoChevronBackCircleOutline className="text-2xl text-neutral-700 hover:text-zinc-200 transition-all" />
      </button>
      <input
        className="input w-fit text-[0.7rem] rounded-full px-2 py-1 border border-neutral-900"
        type="month"
        value={`${year}-${String(month + 1).padStart(2, "0")}`}
        onChange={handleDateChange}
      />
      <button onClick={() => changeMonth("next")}>
        <IoChevronForwardCircleOutline className="text-2xl text-neutral-700 hover:text-zinc-200 transition-all" />
      </button>
    </div>
  );
}
