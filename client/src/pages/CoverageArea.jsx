import { useState } from "react";
import CoverageCard from "../components/CoverageCard";
import AlertModal from "../components/modals/AlertModal";
import coverageAreas from "../data/coverageAreas";

function CoverageArea() {
  const [location, setLocation] = useState("");
  const [result, setResult] = useState("");
  const [requestArea, setRequestArea] = useState("");
  const [alert, setAlert] = useState(null);

  const checkAvailability = () => {
    if (
      coverageAreas.some(
        (area) => area.toLowerCase() === location.trim().toLowerCase()
      )
    ) {
      setResult("Service is available in this area.");
    } else {
      setResult("Service is not available in this area yet.");
    }
  };

  const handleCoverageRequest = (e) => {
    e.preventDefault();
    setAlert({
      type: "success",
      title: "Coverage Request Submitted",
      message: `Coverage request submitted for ${requestArea}.`,
    });
    setRequestArea("");
  };

  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Coverage areas
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Check if CCN services are available near you.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Search your area, browse served locations, and request coverage for
            communities we have not reached yet.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                Areas we serve
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Available service locations
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {coverageAreas.map((area) => (
                <CoverageCard key={area} area={area} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Check availability
            </h2>
            <input
              type="text"
              placeholder="Enter your city or municipality"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-6 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
            <button
              onClick={checkAvailability}
              className="mt-4 w-full rounded-lg bg-slate-950 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              Check Availability
            </button>
            {result && (
              <p className="mt-4 rounded-lg bg-slate-50 p-4 text-center font-bold text-slate-700">
                {result}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Expansion updates
            </h2>
            <ul className="mt-6 space-y-4 text-slate-700">
              <li>Q3 2026 - Expansion to San Jose</li>
              <li>Q4 2026 - Expansion to Ibaan</li>
              <li>Q1 2027 - Expansion to Padre Garcia</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black">Request coverage</h2>
            <p className="mt-3 text-slate-300">
              Tell us where you would like CCN service next.
            </p>
          </div>

          <form
            onSubmit={handleCoverageRequest}
            className="mt-8 rounded-xl border border-white/10 bg-white p-6"
          >
            <input
              type="text"
              placeholder="Enter your location"
              value={requestArea}
              onChange={(e) => setRequestArea(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-cyan-400 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Request Coverage
            </button>
          </form>
        </div>
      </section>
      <AlertModal
        open={Boolean(alert)}
        type={alert?.type}
        title={alert?.title}
        message={alert?.message}
        onClose={() => setAlert(null)}
      />
    </>
  );
}

export default CoverageArea;
