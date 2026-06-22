/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  claimRequest,
  getPendingRequests,
} from "../../services/serviceRequestService";
import RequestDetailsModal from "../../components/technician/RequestDetailsModal";
import AlertModal from "../../components/modals/AlertModal";
import ConfirmModal from "../../components/modals/ConfirmModal";

function summarize(text, length = 150) {
  if (!text) return "No description provided.";
  return text.length > length ? `${text.slice(0, length).trim()}...` : text;
}

function PendingServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [alert, setAlert] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load pending requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const claimSelectedRequest = async (id) => {
    try {
      await claimRequest(id);
      setSelectedRequest(null);
      setAlert({
        type: "success",
        title: "Request Claimed",
        message: "Request moved to your job orders.",
      });
      loadRequests();
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        title: "Claim Failed",
        message: err.response?.data?.message || "Failed to claim request.",
      });
    }
  };

  const handleClaim = (id) => {
    setError(null);
    setSuccessMessage(null);
    setConfirmAction({
      title: "Claim Request",
      message: "Claim this service request and move it into your job orders?",
      confirmText: "Claim",
      variant: "primary",
      run: () => claimSelectedRequest(id),
    });
  };

  const runConfirmAction = async () => {
    const action = confirmAction;
    setConfirmAction(null);
    await action?.run();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#3F48CC]">
            Technician Queue
          </p>
          <h1 className="text-3xl font-bold text-gray-950">
            Pending Service Requests
          </h1>
        </div>
        <span className="rounded-full bg-[#3F48CC]/10 px-4 py-2 text-sm font-semibold text-[#3F48CC]">
          {requests.length} open request{requests.length === 1 ? "" : "s"}
        </span>
      </div>

      {successMessage && (
        <div className="mb-4 rounded bg-green-100 p-4 text-green-800">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg bg-white p-6 text-gray-700 shadow">
          Loading pending requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-gray-700 shadow">
          No pending requests available.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#3F48CC]">
                    {request.job_order_no || `Request #${request.id}`}
                  </p>
                  <h2 className="text-xl font-bold text-gray-950">
                    {request.issue_type || "Service Request"}
                  </h2>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                  {request.status}
                </span>
              </div>

              <p className="mb-4 text-sm leading-6 text-gray-700">
                {summarize(request.issue_description)}
              </p>

              <div className="grid gap-3 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-gray-500">Customer</p>
                  <p className="font-medium text-gray-950">
                    {request.subscriber_name || request.customer_name}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Account No.</p>
                  <p className="font-medium text-gray-950">
                    {request.account_number || request.subscriber_no || "Not provided"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-semibold text-gray-500">Address</p>
                  <p className="font-medium text-gray-950">
                    {request.customer_address || request.address || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-md border border-[#3F48CC] px-4 py-2 text-sm font-semibold text-[#3F48CC] hover:bg-[#3F48CC]/10"
                  onClick={() => setSelectedRequest(request)}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="rounded-md bg-[#3F48CC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3138a8]"
                  onClick={() => handleClaim(request.id)}
                >
                  Claim Request
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <RequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        actions={
          selectedRequest ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Claim this request to move it into your job orders.
              </p>
              <button
                type="button"
                className="w-full rounded-md bg-[#3F48CC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3138a8]"
                onClick={() => handleClaim(selectedRequest.id)}
              >
                Claim Request
              </button>
            </div>
          ) : null
        }
      />
      <ConfirmModal
        open={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.confirmText}
        variant={confirmAction?.variant}
        onConfirm={runConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />
      <AlertModal
        open={Boolean(alert)}
        type={alert?.type}
        title={alert?.title}
        message={alert?.message}
        onClose={() => setAlert(null)}
      />
    </div>
  );
}

export default PendingServiceRequests;
