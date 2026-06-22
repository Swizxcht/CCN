import { useState } from "react";
import { EyeOffIcon, ViewIcon } from "../icons";

function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-950 outline-none transition focus:border-[#3F48CC] focus:ring-4 focus:ring-[#3F48CC]/15"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#3F48CC] hover:bg-[#3F48CC]/10"
        >
          {visible ? <EyeOffIcon /> : <ViewIcon />}
        </button>
      </div>
    </div>
  );
}

export default PasswordField;
