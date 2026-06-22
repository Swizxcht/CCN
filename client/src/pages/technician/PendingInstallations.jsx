import { useEffect, useState } from "react";
import InstallationDetailsModal from "../../components/technician/InstallationDetailsModal";
import AlertModal from "../../components/modals/AlertModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { formatDate } from "../../utils/formatDate";
import {
  claimInstallation,
  getPendingInstallations,
} from "../../services/subscriberApplicationService";

function PendingInstallations() {
  const [installations, setInstallations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const loadInstallations = async () => {
    setLoading(true);
    setError("");
    try {
      setInstallations(await getPendingInstallations());
    } catch (err) {
      console.error(err);
      setError("Unable to load pending installations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstallations();
  }, []);

  const claimSelectedInstallation = async (id) => {
    try {
      await claimInstallation(id);
      setSelected(null);
      setAlert({
        type: "success",
        title: "Installation Claimed",
        message: "Installation moved to your installation job orders.",
      });
      loadInstallations();
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        title: "Claim Failed",
        message: err.response?.data?.message || "Failed to claim installation.",
      });
    }
  };

  const handleClaim = (id) => {
    setMessage("");
    setError("");
    setConfirmAction({
      title: "Claim Installation",
      message: "Claim this new subscriber installation?",
      confirmText: "Claim",
      variant: "primary",
      run: () => claimSelectedInstallation(id),
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
            Installation Queue
          </p>
          <h1 className="text-3xl font-bold text-gray-950">
            Pending Installations
          </h1>
        </div>
        <span className="rounded-full bg-[#3F48CC]/10 px-4 py-2 text-sm font-semibold text-[#3F48CC]">
          {installations.length} open installation{installations.length === 1 ? "" : "s"}
        </span>
      </div>

      {message && <div className="mb-4 rounded bg-green-100 p-4 text-green-800">{message}</div>}
      {error && <div className="mb-4 rounded bg-red-100 p-4 text-red-800">{error}</div>}

      {loading ? (
        <div className="rounded-lg bg-white p-6 text-gray-700 shadow">
          Loading pending installations...
        </div>
      ) : installations.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-gray-700 shadow">
          No pending installations available.
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
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
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
                <div className="sm:col-span-2">
                  <p className="font-semibold text-gray-500">Plan</p>
                  <p className="font-medium text-gray-950">
                    {installation.internet_plan || "No internet"} / {installation.cable_plan || "No cable"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-md border border-[#3F48CC] px-4 py-2 text-sm font-semibold text-[#3F48CC] hover:bg-[#3F48CC]/10"
                  onClick={() => setSelected(installation)}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="rounded-md bg-[#3F48CC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3138a8]"
                  onClick={() => handleClaim(installation.id)}
                >
                  Claim Installation
                </button>
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
            <button
              type="button"
              className="w-full rounded-md bg-[#3F48CC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3138a8]"
              onClick={() => handleClaim(selected.id)}
            >
              Claim Installation
            </button>
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

export default PendingInstallations;
