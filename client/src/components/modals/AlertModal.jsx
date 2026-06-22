const styles = {
  success: {
    title: "text-green-800",
    accent: "bg-green-100 text-green-800",
    button: "bg-green-600 hover:bg-green-700",
  },
  error: {
    title: "text-red-800",
    accent: "bg-red-100 text-red-800",
    button: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    title: "text-amber-800",
    accent: "bg-amber-100 text-amber-800",
    button: "bg-amber-600 hover:bg-amber-700",
  },
  info: {
    title: "text-[#3F48CC]",
    accent: "bg-[#3F48CC]/10 text-[#3F48CC]",
    button: "bg-[#3F48CC] hover:bg-[#3138a8]",
  },
};

function AlertModal({ open, type = "info", title, message, onClose }) {
  if (!open) return null;

  const theme = styles[type] || styles.info;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <div className={`mb-4 inline-flex rounded-full px-3 py-1 text-sm font-bold ${theme.accent}`}>
          {type}
        </div>
        <h2 className={`text-2xl font-black ${theme.title}`}>
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-700">
          {message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className={`mt-6 w-full rounded-md px-4 py-2 font-bold text-white transition ${theme.button}`}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default AlertModal;
