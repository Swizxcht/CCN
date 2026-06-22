import { Link } from "react-router-dom";

function About() {
  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            About CCN
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Local cable and broadband service with a community focus.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Celebrity Cable Network provides reliable internet and cable
            television services to homes, businesses, and communities through
            fast, affordable, and dependable technology.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-2xl font-black text-slate-950">
                Our Mission
              </h2>
              <ul className="mt-5 space-y-4 leading-7 text-slate-600">
                <li>Improve continuously and adopt enabling technologies.</li>
                <li>Expand service operations into more communities.</li>
                <li>
                  Provide customer service that keeps subscribers connected and
                  confident.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-2xl font-black text-slate-950">
                Our Vision
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                A progressive cable network system known for excellence in
                quality and affordable Cable TV and broadband internet services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                Company history
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Built from cable TV roots and expanded into broadband.
              </h2>
            </div>
            <p className="leading-8 text-slate-600">
              Celebrity Cable Network started with a mission to bring quality
              cable TV services to local communities. Through the years, the
              company expanded its services to include high-speed internet
              connectivity, helping thousands of customers stay connected.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black text-slate-950">
            Company achievements
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["20+", "Years of Service"],
              ["6000+", "Customers Served"],
              ["10+", "Coverage Areas"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <h3 className="text-4xl font-black text-cyan-700">{value}</h3>
                <p className="mt-2 font-semibold text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-black">Learn more about us</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-lg bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Contact Management
            </Link>
            <Link
              to="/coverage"
              className="rounded-lg border border-white/20 px-6 py-3 font-bold transition hover:bg-white/10"
            >
              View Coverage
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
