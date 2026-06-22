/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  getAssignedRequests,
  updateAssignedRequestStatus,
} from "../../services/serviceRequestService";
import RequestDetailsModal from "../../components/technician/RequestDetailsModal";
import AlertModal from "../../components/modals/AlertModal";
import ConfirmModal from "../../components/modals/ConfirmModal";

const STATUS_OPTIONS = [
  "Pending",
  "Assigned",
  "On-going",
  "Resolved",
];

function summarize(text, length = 140) {
  if (!text) return "No description provided.";
  return text.length > length ? `${text.slice(0, length).trim()}...` : text;
}

function statusClass(status) {
  if (status === "Resolved") return "bg-green-100 text-green-800";
  if (status === "On-going") return "bg-orange-100 text-orange-800";
  if (status === "Assigned") return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-800";
}

function TechnicianDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [alert, setAlert] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAssignedRequests();
      setRequests(data);
      if (selectedRequest) {
        const refreshed = data.find((item) => item.id === selectedRequest.id);
        setSelectedRequest(refreshed || null);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load job orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = (id, status) => {
    setConfirmAction({
      title: "Update Job Order",
      message: `Change this job order status to ${status}?`,
      confirmText: "Update",
      variant: "warning",
      run: async () => {
        try {
          setError("");
          await updateAssignedRequestStatus(id, status);
          setAlert({
            type: "success",
            title: "Status Updated",
            message: `Job order status changed to ${status}.`,
          });
          await loadRequests();
        } catch (err) {
          console.error(err);
          setAlert({
            type: "error",
            title: "Update Failed",
            message: err.response?.data?.message || "Unable to update job status.",
          });
        }
      },
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
            Technician Workspace
          </p>
          <h1 className="text-3xl font-bold text-gray-950">
            Job Order
          </h1>
        </div>
        <span className="rounded-full bg-[#3F48CC]/10 px-4 py-2 text-sm font-semibold text-[#3F48CC]">
          {requests.length} job order{requests.length === 1 ? "" : "s"}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg bg-white p-6 text-gray-700 shadow">
          Loading job orders...
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-gray-700 shadow">
          You have no job orders assigned yet.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
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
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass(request.status)}`}>
                  {request.status}
                </span>
              </div>

              <p className="mb-4 text-sm leading-6 text-gray-700">
                {summarize(request.issue_description)}
              </p>

              <div className="grid gap-3 border-t border-gray-100 pt-4 text-sm md:grid-cols-2">
                <div>
                  <p className="font-semibold text-gray-500">Customer</p>
                  <p className="font-medium text-gray-950">
                    {request.subscriber_name || request.customer_name}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Contact</p>
                  <p className="font-medium text-gray-950">
                    {request.customer_contact || request.contact_number || "Not provided"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-semibold text-gray-500">Address</p>
                  <p className="font-medium text-gray-950">
                    {request.customer_address || request.address || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="rounded-md border border-[#3F48CC] px-4 py-2 text-sm font-semibold text-[#3F48CC] hover:bg-[#3F48CC]/10"
                  onClick={() => setSelectedRequest(request)}
                >
                  View Details
                </button>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  Status
                  <select
                    value={request.status}
                    onChange={(event) => handleStatusChange(request.id, event.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-950 focus:border-[#3F48CC] focus:outline-none focus:ring-2 focus:ring-[#3F48CC]/20"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
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
            <label className="block text-sm font-semibold text-gray-700">
              Update Status
              <select
                value={selectedRequest.status}
                onChange={(event) =>
                  handleStatusChange(selectedRequest.id, event.target.value)
                }
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-950 focus:border-[#3F48CC] focus:outline-none focus:ring-2 focus:ring-[#3F48CC]/20"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
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

export default TechnicianDashboard;
