function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium">
        {label}
      </label>

      <textarea
  name={name}
  rows="5"
  value={value}
  onChange={onChange}
  placeholder={placeholder}
  className="w-full border rounded-lg p-3"
/>
    </div>
  );
}

export default TextAreaField;