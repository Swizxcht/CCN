/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { getMyBills } from "../../services/portalService";
import { formatDate } from "../../utils/formatDate";

function MyBills() {
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState({
    pending_total: 0,
    pending_count: 0,
    next_due_date: null,
  });

  const money = (value) =>
    `PHP ${Number(value || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const loadBills = async () => {
    try {
      const data = await getMyBills();

      setBills(data.bills || []);
      setSummary({
        pending_total: data.pending_total || 0,
        pending_count: data.pending_count || 0,
        next_due_date: data.next_due_date || null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">My Bills</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Pending Total</div>
          <div className="text-2xl font-semibold">
            {money(summary.pending_total)}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Pending Bills</div>
          <div className="text-2xl font-semibold">{summary.pending_count}</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Next Due Date</div>
          <div className="text-2xl font-semibold">
            {formatDate(summary.next_due_date)}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-220 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Month</th>
                <th className="p-3">Period</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Penalty</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Remaining</th>
                <th className="p-3">Status</th>
                <th className="p-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center">
                    No bills found.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id} className="border-t">
                    <td className="p-3">{bill.billing_month}</td>
                    <td className="p-3">
                      {bill.billing_start_date && bill.billing_end_date
                        ? `${formatDate(bill.billing_start_date)} to ${formatDate(bill.billing_end_date)}`
                        : "N/A"}
                    </td>
                    <td className="p-3">{money(bill.amount)}</td>
                    <td className="p-3">{money(bill.penalty_amount)}</td>
                    <td className="p-3">{money(bill.amount_paid)}</td>
                    <td className="p-3">{money(bill.remaining_balance)}</td>
                    <td className="p-3">{bill.status}</td>
                    <td className="p-3">{formatDate(bill.due_date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyBills;
