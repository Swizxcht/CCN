import { Link } from "react-router-dom";

function PlanCard({ name, speed, price, features }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex-1">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          {speed}
        </p>
        <h3 className="mt-2 text-2xl font-black text-slate-950">{name}</h3>

        <p className="mt-5 text-4xl font-black text-slate-950">
          PHP {price}
          <span className="text-sm font-semibold text-slate-500"> / month</span>
        </p>

        <ul className="mt-6 space-y-3 text-sm text-slate-600">
          {features.map((feature, index) => (
            <li key={index} className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          to="/contact"
          className="rounded-lg bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Apply
        </Link>

        <Link
          to="/contact"
          className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-800 transition hover:border-cyan-400 hover:text-cyan-700"
        >
          Inquire
        </Link>
      </div>
    </div>
  );
}

export default PlanCard;
