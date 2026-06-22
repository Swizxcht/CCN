function IconButton({ label, children, variant = "neutral", ...props }) {
  const variants = {
    neutral: "border-slate-200 text-slate-700 hover:bg-slate-50",
    primary: "border-cyan-200 text-cyan-700 hover:bg-cyan-50",
    danger: "border-red-200 text-red-700 hover:bg-red-50",
    warning: "border-amber-200 text-amber-700 hover:bg-amber-50",
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`inline-grid h-9 w-9 place-items-center rounded-lg border transition ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
