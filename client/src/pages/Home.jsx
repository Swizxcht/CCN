import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ServiceCard from "../components/ServiceCard";

const services = [
  {
    title: "Internet Service",
    description:
      "Stable home and office internet plans built for streaming, school, work, and everyday browsing.",
  },
  {
    title: "Cable TV",
    description:
      "Local favorites, news, entertainment, sports, and family channels in clear cable packages.",
  },
  {
    title: "Plan Selection",
    description:
      "Choose internet-only speed tiers or the cable-only plan that fits your household.",
  },
];

const quickActions = [
  { label: "Apply Now", to: "/contact" },
  { label: "View Plans", to: "/plans" },
  { label: "Check Availability", to: "/plans#coverage" },
  { label: "Contact Us", to: "/contact" },
  { label: "Get Support", to: "/support" },
];

function Home() {
  return (
    <>
      <Hero />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
              What we provide
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Plans and support for everyday connection.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* <section className="bg-slate-100 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
              Current offers
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Better value when you connect more at home.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Ask about free installation promos and bundle discounts for
              qualifying internet and cable subscriptions.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-950">
                Free Installation
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Apply during active promotions and reduce your upfront setup
                cost.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-950">
                Bundle Discount
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Save more when internet and cable are installed under one
                household plan.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                Coverage
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Serving nearby communities and expanding.
              </h2>
              <Link
                to="/coverage"
                className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
              >
                Check your area
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["Tanauan City", "Santo Tomas", "Lipa City", "Malvar", "Tagkawayan", "Mindoro"].map(
                (area) => (
                  <div
                    key={area}
                    className="rounded-xl border border-cyan-100 bg-cyan-50 p-5 font-bold text-slate-900"
                  >
                    {area}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
              Start here
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Quick actions
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-center font-bold transition hover:border-cyan-300/60 hover:bg-cyan-300 hover:text-slate-950"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
