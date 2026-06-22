function SubmitButton({ text }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-slate-950 py-3 font-bold text-white transition hover:bg-slate-800"
    >
      {text}
    </button>
  );
}

export default SubmitButton;
