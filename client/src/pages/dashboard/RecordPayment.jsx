/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useState } from "react";
import DateTextField from "../../components/forms/DateTextField";
import { getUnpaidBills, recordPayment } from "../../services/paymentService";
import { formatDate } from "../../utils/formatDate";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

function RecordPayment() {
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [formData, setFormData] = useState({
    bill_id: "",
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: "Cash",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBills();
  }, []);

  const money = (value) =>
    `PHP ${Number(value || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const selectedBill = useMemo(
    () => unpaidBills.find((bill) => String(bill.id) === String(formData.bill_id)),
    [unpaidBills, formData.bill_id]
  );

  const loadBills = async () => {
    try {
      const data = await getUnpaidBills();
      setUnpaidBills(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load unpaid bills.");
    }
  };

  const handleBillChange = (event) => {
    const billId = event.target.value;
    const bill = unpaidBills.find((item) => String(item.id) === billId);

    setFormData({
      bill_id: billId,
      amount: bill ? bill.remaining_balance : "",
      payment_date: new Date().toISOString().slice(0, 10),
      payment_method: "Cash",
    });
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await recordPayment(formData);
      setMessage(`Payment recorded: ${response.data.receipt_no}`);
      loadBills();
      setFormData({
        bill_id: "",
        amount: "",
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: "Cash",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Billing
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Record Payment
        </h1>
        <p className="mt-2 text-slate-600">
          Select an unpaid bill to automatically fill the remaining balance and
          payment date.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 font-semibold text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 font-semibold text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Select Bill
              </label>
              <select
                name="bill_id"
                value={formData.bill_id}
                onChange={handleBillChange}
                className={inputClass}
                required
              >
                <option value="">Select Bill</option>
                {unpaidBills.map((bill) => (
                  <option key={bill.id} value={bill.id}>
                    {bill.subscriber_no} | {bill.name} | {bill.billing_month} |{" "}
                    {money(bill.remaining_balance)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={inputClass}
                min="0"
                step="0.01"
                required
              />
            </div>

            <DateTextField
              label="Payment Date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className={inputClass}
              required
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Payment Method
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Cash</option>
                <option>GCash</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              {submitting ? "Recording..." : "Record Payment"}
            </button>
          </div>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Bill Preview</h2>
          {selectedBill ? (
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-bold text-slate-500">Subscriber</dt>
                <dd className="mt-1 text-slate-950">
                  {selectedBill.subscriber_no} - {selectedBill.name}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Billing Month</dt>
                <dd className="mt-1 text-slate-950">
                  {selectedBill.billing_month}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Original Amount</dt>
                <dd className="mt-1 text-slate-950">
                  {money(selectedBill.amount)}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Already Paid</dt>
                <dd className="mt-1 text-slate-950">
                  {money(selectedBill.amount_paid)}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Remaining Balance</dt>
                <dd className="mt-1 text-xl font-black text-slate-950">
                  {money(selectedBill.remaining_balance)}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Due Date</dt>
                <dd className="mt-1 text-slate-950">{formatDate(selectedBill.due_date)}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-5 text-slate-600">
              Select a bill to see its balance details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecordPayment;
