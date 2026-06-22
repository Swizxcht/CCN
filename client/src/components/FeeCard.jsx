function FeeCard({ title, amount, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <h3 className="text-xl font-black text-slate-950">{title}</h3>
      <p className="mt-4 text-4xl font-black text-cyan-700">PHP {amount}</p>
      <p className="mt-4 leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export default FeeCard;
