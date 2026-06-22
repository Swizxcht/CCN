const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

const fields = [
  ["street", "Street / House No."],
  ["barangay", "Barangay"],
  ["city", "City / Municipality"],
  ["province", "Province"],
  ["postal_code", "Postal Code"],
];

function AddressFields({ values, onChange, required = true }) {
  return (
    <>
      {fields.map(([name, label]) => (
        <div key={name}>
          <label className="text-sm font-bold text-slate-700">{label}</label>
          <input
            name={name}
            value={values[name] || ""}
            onChange={onChange}
            required={required && name !== "postal_code"}
            className={inputClass}
          />
        </div>
      ))}
    </>
  );
}

export default AddressFields;
