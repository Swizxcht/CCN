import { Link } from "react-router-dom";
import heroImage from "../assets/home-hero.jpg";

function Hero() {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            Local connectivity for homes and businesses
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Fast internet and reliable cable TV without the fuss.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Celebrity Cable Network keeps households, offices, and communities
            connected with practical plans, local support, and dependable
            installation service.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/plans"
              className="rounded-lg bg-cyan-400 px-6 py-3 text-center font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
            >
              View Plans
            </Link>

            <Link
              to="/plans#coverage"
              className="rounded-lg border border-white/20 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Check Coverage
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-2xl bg-cyan-400/20 blur-3xl" />
          <img
            src={heroImage}
            alt="Celebrity Cable Network service installation"
            className="relative aspect-4/3 w-full rounded-2xl object-cover shadow-2xl shadow-slate-950/50"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
