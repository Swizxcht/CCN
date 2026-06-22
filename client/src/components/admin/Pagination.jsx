function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-600">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
