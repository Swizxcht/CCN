function CoverageCard({ area }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <h3 className="text-lg font-black text-slate-950">{area}</h3>
      <p className="mt-2 text-sm font-bold text-cyan-700">Service Available</p>
    </div>
  );
}

export default CoverageCard;
