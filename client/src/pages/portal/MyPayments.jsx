/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useState
} from "react";

import {
  getUnpaidBills,
  getMyPayments,
  recordPayment
} from "../../services/paymentService";
import DateTextField from "../../components/forms/DateTextField";
import { formatDate } from "../../utils/formatDate";

function MyPayments() {
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    bill_id: "",
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: "Cash",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUnpaidBills();
    loadPayments();
  }, []);

  const loadUnpaidBills = async () => {
    try {
      const data = await getUnpaidBills();
      setUnpaidBills(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadPayments = async () => {
    try {
      const data = await getMyPayments();
      setPayments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillChange = (e) => {
    const billId = e.target.value;
    const selectedBill = unpaidBills.find((bill) => bill.id.toString() === billId);
    setFormData((prev) => ({
      ...prev,
      bill_id: billId,
      amount: selectedBill ? selectedBill.remaining_balance : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bill_id) {
      setMessage("Please select a bill to pay.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setMessage("Payment amount must be greater than zero.");
      return;
    }

    try {
      const response = await recordPayment(formData);
      setMessage(`Payment recorded: ${response.data.receipt_no}`);
      setFormData({
        bill_id: "",
        amount: "",
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: "Cash",
      });
      loadUnpaidBills();
      loadPayments();
    } catch (error) {
      console.error(error);
      setMessage("Payment failed. Please check the details and try again.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Payments</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pay a Bill</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Unpaid Bill</label>
              <select
                name="bill_id"
                value={formData.bill_id}
                onChange={handleBillChange}
                className="border p-3 rounded w-full"
                required
              >
                <option value="">Choose a bill</option>
                {unpaidBills.map((bill) => (
                  <option key={bill.id} value={bill.id}>
                    {bill.billing_month} | ₱{bill.remaining_balance} | Due {formatDate(bill.due_date)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="border p-3 rounded w-full"
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
              className="border p-3 rounded w-full"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="border p-3 rounded w-full"
              >
                <option value="Cash">Cash</option>
                <option value="GCash">GCash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <button type="submit" className="bg-green-600 text-white px-5 py-3 rounded w-full">
              Submit Payment
            </button>
          </form>

          {message && (
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
              {message}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Unpaid Bills</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-sm text-gray-600">Bill</th>
                  <th className="p-3 text-sm text-gray-600">Amount</th>
                  <th className="p-3 text-sm text-gray-600">Paid</th>
                  <th className="p-3 text-sm text-gray-600">Remaining</th>
                  <th className="p-3 text-sm text-gray-600">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {unpaidBills.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-sm text-gray-500">
                      No unpaid bills found.
                    </td>
                  </tr>
                ) : unpaidBills.map((bill) => (
                  <tr key={bill.id} className="border-t">
                    <td className="p-3 text-sm">{bill.billing_month}</td>
                    <td className="p-3 text-sm">₱{bill.amount}</td>
                    <td className="p-3 text-sm">₱{bill.amount_paid}</td>
                    <td className="p-3 text-sm">₱{bill.remaining_balance}</td>
                    <td className="p-3 text-sm">{formatDate(bill.due_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-sm text-gray-600">Receipt</th>
                <th className="p-3 text-sm text-gray-600">Bill Month</th>
                <th className="p-3 text-sm text-gray-600">Amount</th>
                <th className="p-3 text-sm text-gray-600">Method</th>
                <th className="p-3 text-sm text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-sm text-gray-500">
                    No payment history available.
                  </td>
                </tr>
              ) : payments.map((payment) => (
                <tr key={payment.id} className="border-t">
                  <td className="p-3 text-sm">{payment.receipt_no}</td>
                  <td className="p-3 text-sm">{payment.billing_month}</td>
                  <td className="p-3 text-sm">₱{payment.amount}</td>
                  <td className="p-3 text-sm">{payment.payment_method}</td>
                  <td className="p-3 text-sm">{formatDate(payment.payment_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyPayments;
