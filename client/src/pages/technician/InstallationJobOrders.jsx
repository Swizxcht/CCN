import { useEffect, useState } from "react";
import InstallationDetailsModal from "../../components/technician/InstallationDetailsModal";
import {
  getAssignedInstallations,
  updateInstallationStatus,
} from "../../services/subscriberApplicationService";
import AlertModal from "../../components/modals/AlertModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { formatDate } from "../../utils/formatDate";

const STATUS_OPTIONS = ["Pending", "Assigned", "On-going", "Resolved"];

function statusClass(status) {
  if (status === "Resolved") return "bg-green-100 text-green-800";
  if (status === "On-going") return "bg-orange-100 text-orange-800";
  if (status === "Assigned") return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-800";
}

function InstallationJobOrders() {
  const [installations, setInstallations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const loadInstallations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAssignedInstallations();
      setInstallations(data);
      if (selected) {
        setSelected(data.find((item) => item.id === selected.id) || null);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load installation job orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstallations();
  }, []);

  const handleStatusChange = (id, status) => {
    setConfirmAction({
      title: "Update Installation",
      message: `Change this installation job order status to ${status}?`,
      confirmText: "Update",
      variant: "warning",
      run: async () => {
        try {
          setError("");
          await updateInstallationStatus(id, status);
          setAlert({
            type: "success",
            title: "Status Updated",
            message:
              status === "Resolved"
                ? "Installation resolved and subscriber activated."
                : `Installation status changed to ${status}.`,
          });
          await loadInstallations();
        } catch (err) {
          console.error(err);
          setAlert({
            type: "error",
            title: "Update Failed",
            message: err.response?.data?.message || "Unable to update installation status.",
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
            Installation Work
          </p>
          <h1 className="text-3xl font-bold text-gray-950">
            Installation Job Orders
          </h1>
        </div>
        <span className="rounded-full bg-[#3F48CC]/10 px-4 py-2 text-sm font-semibold text-[#3F48CC]">
          {installations.length} assigned installation{installations.length === 1 ? "" : "s"}
        </span>
      </div>

      {error && <div className="mb-4 rounded bg-red-100 p-4 text-red-800">{error}</div>}

      {loading ? (
        <div className="rounded-lg bg-white p-6 text-gray-700 shadow">
          Loading installation job orders...
        </div>
      ) : installations.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-gray-700 shadow">
          You have no assigned installation job orders yet.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {installations.map((installation) => (
            <article key={installation.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#3F48CC]">
                    {installation.subscriber_no}
                  </p>
                  <h2 className="text-xl font-bold text-gray-950">
                    {installation.full_name || installation.name}
                  </h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass(installation.installation_status)}`}>
                  {installation.installation_status}
                </span>
              </div>

              <div className="grid gap-3 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-gray-500">Contact</p>
                  <p className="font-medium text-gray-950">{installation.contact_number || "Not provided"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Requested Date</p>
                  <p className="font-medium text-gray-950">{formatDate(installation.requested_date)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-semibold text-gray-500">Address</p>
                  <p className="font-medium text-gray-950">{installation.address || "Not provided"}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="rounded-md border border-[#3F48CC] px-4 py-2 text-sm font-semibold text-[#3F48CC] hover:bg-[#3F48CC]/10"
                  onClick={() => setSelected(installation)}
                >
                  View Details
                </button>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  Status
                  <select
                    value={installation.installation_status}
                    onChange={(event) => handleStatusChange(installation.id, event.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-950 focus:border-[#3F48CC] focus:outline-none focus:ring-2 focus:ring-[#3F48CC]/20"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}

      <InstallationDetailsModal
        installation={selected}
        onClose={() => setSelected(null)}
        actions={
          selected ? (
            <label className="block text-sm font-semibold text-gray-700">
              Update Status
              <select
                value={selected.installation_status}
                onChange={(event) => handleStatusChange(selected.id, event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-950 focus:border-[#3F48CC] focus:outline-none focus:ring-2 focus:ring-[#3F48CC]/20"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
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

export default InstallationJobOrders;
