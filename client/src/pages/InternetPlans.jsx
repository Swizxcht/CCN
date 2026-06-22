import PlanCard from "../components/PlanCard";

const plans = [
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

function InternetPlans() {
  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Internet packages
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Internet plans for every household.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Choose a practical speed tier for browsing, streaming, online
            classes, work calls, and home entertainment.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
              Available packages
            </h2>
            <p className="mt-3 text-slate-600">
              Monthly pricing shown before location-specific installation
              requirements.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.name}
                name={plan.name}
                speed={plan.speed}
                price={plan.price}
                features={plan.features}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-950">
              Speed comparison
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-5 py-4">Plan</th>
                    <th className="px-5 py-4">Speed</th>
                    <th className="px-5 py-4">Monthly fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plans.map((plan) => (
                    <tr key={plan.name}>
                      <td className="px-5 py-4 font-semibold text-slate-950">
                        {plan.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{plan.speed}</td>
                      <td className="px-5 py-4 text-slate-600">
                        PHP {plan.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
              Why choose CCN Internet
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Local support, sensible speeds, and straightforward setup.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Standard installation starts at PHP 1,000 and may vary depending
              on location and service requirements.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              "Reliable speeds for streaming, gaming, and work.",
              "Packages for different home and business budgets.",
              "Dedicated assistance from a local service team.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <p className="leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default InternetPlans;
