/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { getMySubscriber } from "../../services/portalService";
import {
  createRequest,
  getMyRequests,
} from "../../services/serviceRequestService";
import { formatDateTime } from "../../utils/formatDate";

const initialForm = {
  issue_type: "No Internet",
  account_number: "",
  contact_number: "",
  address: "",
  issue_description: "",
};

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

function MyServiceRequests() {
  const [form, setForm] = useState(initialForm);
  const [subscriber, setSubscriber] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loadSubscriber = async () => {
    try {
      const data = await getMySubscriber();
      setSubscriber(data);

      if (data) {
        setForm((current) => ({
          ...current,
          account_number: data.subscriber_no || "",
          contact_number: data.contact_number || current.contact_number,
          address: data.address || current.address,
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load your subscriber account.");
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getMyRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load service requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriber();
    loadRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSubmitting(true);

    try {
      await createRequest(form);
      setMessage("Request submitted successfully.");
      setForm({
        ...initialForm,
        account_number: subscriber?.subscriber_no || form.account_number,
        contact_number: subscriber?.contact_number || "",
        address: subscriber?.address || "",
      });
      loadRequests();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Support
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Service Requests
        </h1>
        <p className="mt-2 text-slate-600">
          Submit a concern using your fixed CCN subscriber account number.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 font-semibold text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 font-semibold text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">
          Submit Service Request
        </h2>

        {!subscriber ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            No active subscriber account was found. Service requests require an
            active subscription.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Issue Type
              </label>
              <select
                name="issue_type"
                value={form.issue_type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="No Internet">No Internet</option>
                <option value="Slow Internet">Slow Internet</option>
                <option value="Cable Issue">Cable Issue</option>
                <option value="Relocation">Relocation</option>
                <option value="New Installation">New Installation</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Account Number
              </label>
              <input
                name="account_number"
                value={form.account_number}
                readOnly
                className={`${inputClass} bg-slate-100 font-bold text-slate-600`}
              />
              <p className="mt-2 text-xs font-semibold text-slate-500">
                This is fixed from your subscriber number.
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Contact Number
              </label>
              <input
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-bold text-slate-700">
                Issue Description
              </label>
              <textarea
                name="issue_description"
                value={form.issue_description}
                onChange={handleChange}
                rows="4"
                className={inputClass}
                placeholder="Describe the issue and include useful details."
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">My Requests</h2>

        {loading ? (
          <p className="mt-4 text-slate-600">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-slate-600">No requests found yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Job Order",
                    "Account Number",
                    "Issue Type",
                    "Status",
                    "Assigned Technician",
                    "Created At",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {request.job_order_no || `#${request.id}`}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {request.account_number || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {request.issue_type || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {request.status}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {request.technician_name || "Unassigned"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDateTime(request.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyServiceRequests;
