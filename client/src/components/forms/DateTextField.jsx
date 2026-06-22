function DateTextField({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder = "YYYY-MM-DD",
  className = "",
}) {
  const inputClass =
    className ||
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

  return (
    <div>
      {label && <label className="text-sm font-bold text-slate-700">{label}</label>}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        inputMode="numeric"
        pattern="\\d{4}-\\d{2}-\\d{2}"
        title="Use YYYY-MM-DD format, for example 2026-06-23."
        className={inputClass}
      />
    </div>
  );
}

export default DateTextField;
