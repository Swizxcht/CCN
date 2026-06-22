import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "./icons";

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-slate-950 transition hover:bg-slate-50"
      >
        <span>{question}</span>
        <span className="shrink-0 text-cyan-700">
          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      </button>

      {open && <div className="px-5 pb-5 leading-7 text-slate-600">{answer}</div>}
    </div>
  );
}

export default FAQItem;
