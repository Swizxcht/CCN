function ServiceCard({ title, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 h-1.5 w-14 rounded-full bg-cyan-400" />
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export default ServiceCard;
