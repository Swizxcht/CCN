import { Link } from "react-router-dom";
import CablePlanCard from "../components/CablePlanCard";
import CoverageCard from "../components/CoverageCard";
import FeeCard from "../components/FeeCard";
import PlanCard from "../components/PlanCard";
import coverageAreas from "../data/coverageAreas";

const internetPlans = [
  {
    name: "Internet 30 Mbps",
    speed: "30 Mbps",
    price: 500,
    features: ["Unlimited Internet", "24/7 Support", "Reliable Connection"],
  },
  {
    name: "Internet 50 Mbps",
    speed: "50 Mbps",
    price: 999,
    features: ["Unlimited Internet", "Fast Browsing", "HD Streaming"],
  },
  {
    name: "Internet 100 Mbps",
    speed: "100 Mbps",
    price: 1399,
    features: ["Unlimited Internet", "Multiple Devices", "Priority Support"],
  },
  {
    name: "Internet 200 Mbps",
    speed: "200 Mbps",
    price: 1599,
    features: ["Maximum Speed", "Heavy Streaming", "VIP Support"],
  },
];

const cablePlans = [
  { name: "Cable Plan", price: 380, channels: 100 },
];

const fees = [
  {
    title: "Cable Installation Only",
    amount: 1300,
    description: "Cable installation for new subscribers.",
  },
  {
    title: "Internet Installation",
    amount: 1800,
    description: "Internet setup for new subscribers.",
  },
  {
    title: "Relocation Fee",
    amount: 600,
    description: "Transfer your service to a new address.",
  },
  {
    title: "Reconnection Fee",
    amount: 220,
    description: "Restore disconnected service.",
  },
  
];



function Plans() {
  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Plans and services
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Compare internet, cable, installation, and coverage in one place.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Browse available packages, service charges, and covered locations
            before applying or contacting support.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ["Internet", "#internet"],
              ["Cable TV", "#cable"],
              ["Installation Fees", "#fees"],
              ["Coverage", "#coverage"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>


      <section id="internet" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
              Internet
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Internet packages
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Choose a speed tier for browsing, streaming, school, work, and
              home entertainment.
            </p>
            <Link
              to="/internet-plans"
              className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              View Internet Plans Page
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {internetPlans.map((plan) => (
              <PlanCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      <section id="cable" className="scroll-mt-24 bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
              Cable TV
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Cable packages
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Cable-only service for local shows, movies, news, sports, and
              family entertainment.
            </p>
            <Link
              to="/cable-plans"
              className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              View Cable TV Page
            </Link>
          </div>

          <div className="grid max-w-sm gap-6">
            {cablePlans.map((plan) => (
              <CablePlanCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      <section id="fees" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
              Fees
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Installation and service charges
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Fees may vary depending on location and service requirements.
            </p>
            <Link
              to="/installation-fees"
              className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              View Installation Fees Page
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {fees.map((fee) => (
              <FeeCard key={fee.title} {...fee} />
            ))}
          </div>
        </div>
      </section>

      <section id="coverage" className="scroll-mt-24 bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                Coverage
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Areas we serve
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Confirm availability with our office before installation.
              </p>
              <Link
                to="/coverage"
                className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
              >
                View Coverage Page
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {coverageAreas.map((area) => (
                <CoverageCard key={area} area={area} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Plans;
