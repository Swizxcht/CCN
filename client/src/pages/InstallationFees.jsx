import { Link } from "react-router-dom";
import FeeCard from "../components/FeeCard";

const fees = [
  {
    title: "New Installation",
    amount: 1000,
    description: "Standard installation for new subscribers.",
  },
  {
    title: "Relocation Fee",
    amount: 500,
    description: "Transfer your service to a new address.",
  },
  {
    title: "Reconnection Fee",
    amount: 300,
    description: "Restore disconnected service.",
  },
];

function InstallationFees() {
  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Service fees
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Installation and service charges.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Review common setup, relocation, reconnection, and application
            requirements before subscribing.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-950">
              Service charges
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {fees.map((fee) => (
              <FeeCard
                key={fee.title}
                title={fee.title}
                amount={fee.amount}
                description={fee.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black text-slate-950">
            Required documents
          </h2>
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <ul className="grid gap-4 text-slate-700 sm:grid-cols-2">
              {[
                "Valid Government ID",
                "Proof of Billing",
                "Completed Application Form",
                "Proof of Residency",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-cyan-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-black">Ready to get connected?</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-lg bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Apply for Installation
            </Link>
            <a
              href="/requirements.pdf"
              download
              className="rounded-lg border border-white/20 px-6 py-3 font-bold transition hover:bg-white/10"
            >
              Download Requirements
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default InstallationFees;
