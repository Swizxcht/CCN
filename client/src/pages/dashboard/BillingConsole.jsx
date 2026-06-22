import { useState } from "react";
import DateTextField from "../../components/forms/DateTextField";
import { generateAllBills } from "../../services/billingService";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

function BillingConsole() {
  const [billingMonth, setBillingMonth] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await generateAllBills({
        billing_month: billingMonth,
        due_date: dueDate,
      });

      if (response.data.generated !== undefined) {
        setMessage(
          `Generated ${response.data.generated} bill(s). Skipped ${response.data.skipped} existing bill(s).`
        );
      } else {
        setMessage(response.data.message || "Billing completed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Billing failed. Check the month and due date, then try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Billing
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Billing Console
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Generate 30-day billing records for active subscribers. Existing bills
          for the same subscriber and billing period are skipped to prevent
          duplicates.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Generate Monthly Bills
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Billing Month
              </label>
              <input
                type="text"
                placeholder="July 2026"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                className={inputClass}
              />
            </div>

            <DateTextField
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !billingMonth || !dueDate}
              className="w-full rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Bills"}
            </button>
          </div>

          {message && (
            <div className="mt-5 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm font-semibold text-cyan-800">
              {message}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">How it works</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
            <p>
              This console is a batch tool. It creates a bill for every active
              subscriber for the month you enter. The billing period is counted
              as 30 days ending on the due date.
            </p>
            <p>
              New subscriber first bills are generated automatically when the
              technician resolves the installation. This console is for regular
              succeeding billing cycles.
            </p>
            <p>
              Late penalties are recalculated safely from the due date at PHP 20
              per overdue day, so penalties are not duplicated when pages are
              opened repeatedly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingConsole;
