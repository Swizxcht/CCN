const variantClass = {
  danger: "bg-red-600 hover:bg-red-700",
  warning: "bg-amber-600 hover:bg-amber-700",
  primary: "bg-[#3F48CC] hover:bg-[#3138a8]",
  success: "bg-green-600 hover:bg-green-700",
};

function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-black text-gray-950">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-700">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 font-bold text-white transition ${variantClass[variant] || variantClass.primary}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
