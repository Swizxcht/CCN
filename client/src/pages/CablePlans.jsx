import CablePlanCard from "../components/CablePlanCard";

const cablePlans = [
  {
    name: "Cable Plan",
    price: 380,
    channels: 100,
  },
];

const popularChannels = [
  "GMA",
  "TV5",
  "HBO",
  "Discovery Channel",
  "National Geographic",
  "Cartoon Network",
  "Nickelodeon",
  "CNN",
];

const premiumChannels = ["HBO HD", "Cinemax", "Fox Movies", "NBA TV"];

function CablePlans() {
  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Cable TV packages
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Clear entertainment packages for the whole family.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Enjoy local and international channels with affordable monthly cable
            TV plans.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
              Cable packages
            </h2>
          </div>

          <div className="mx-auto grid max-w-sm gap-6">
            {cablePlans.map((plan) => (
              <CablePlanCard
                key={plan.name}
                name={plan.name}
                price={plan.price}
                channels={plan.channels}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                Channel lineup
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Favorites, news, learning, sports, and kids' entertainment.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popularChannels.map((channel) => (
                <div
                  key={channel}
                  className="rounded-lg border border-slate-200 bg-white p-4 font-semibold text-slate-800 shadow-sm"
                >
                  {channel}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-950">
              Premium channels
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {premiumChannels.map((channel) => (
              <div
                key={channel}
                className="rounded-xl border border-cyan-100 bg-cyan-50 p-6 text-center font-bold text-slate-950"
              >
                {channel}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black">
            Why choose CCN Cable TV?
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Entertainment", "Channels for news, movies, sports, and kids."],
              ["HD Quality", "Clear viewing for supported channel packages."],
              ["Affordable Packages", "Flexible options for every household."],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CablePlans;
