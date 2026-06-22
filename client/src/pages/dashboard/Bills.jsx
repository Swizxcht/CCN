/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { getBills } from "../../services/billingService";
import { formatDate } from "../../utils/formatDate";

function Bills() {
  const [bills, setBills] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadBills(page);
  }, [page]);

  const money = (value) =>
    `PHP ${Number(value || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const loadBills = async (pageNumber = 1) => {
    try {
      const data = await getBills(pageNumber, limit);
      setBills(data.bills || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    }
  };

  const statusClass = (status) => {
    const styles = {
      Paid: "bg-green-100 text-green-800",
      Partial: "bg-amber-100 text-amber-800",
      Unpaid: "bg-red-100 text-red-800",
      Overdue: "bg-orange-100 text-orange-800",
      Pending: "bg-amber-100 text-amber-800",
    };

    return styles[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Billing
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Bills</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-230 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Subscriber Number",
                  "Subscriber",
                  "Month",
                  "Period",
                  "Amount",
                  "Penalty",
                  "Paid",
                  "Remaining",
                  "Due Date",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-slate-500">
                    No bills found.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="px-4 py-3 font-bold text-slate-950">
                      {bill.subscriber_no}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{bill.name}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {bill.billing_month}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {bill.billing_start_date && bill.billing_end_date
                        ? `${formatDate(bill.billing_start_date)} to ${formatDate(bill.billing_end_date)}`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {money(bill.amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {money(bill.penalty_amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {money(bill.amount_paid)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {money(bill.remaining_balance)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(bill.due_date)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-sm font-semibold text-slate-600">
            Page {page} of {totalPages}
          </div>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bills;
