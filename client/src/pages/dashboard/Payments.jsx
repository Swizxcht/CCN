/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/admin/Pagination";
import { getPayments } from "../../services/paymentService";
import { formatDate } from "../../utils/formatDate";

const pageSize = 10;

function Payments() {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPayments();
  }, []);

  const money = (value) =>
    `PHP ${Number(value || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.max(1, Math.ceil(payments.length / pageSize));
  const paginatedPayments = useMemo(
    () => payments.slice((page - 1) * pageSize, page * pageSize),
    [payments, page]
  );

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Billing
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Payments</h1>
        <p className="mt-2 text-slate-600">
          Review recorded customer payments and receipt history.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Receipt", "Customer", "Month", "Amount", "Method", "Date"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 font-bold text-slate-950">
                      {payment.receipt_no}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{payment.name}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {payment.billing_month}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-950">
                      {money(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {payment.payment_method}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(payment.payment_date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default Payments;
