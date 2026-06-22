/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/admin/Pagination";
import AlertModal from "../../components/modals/AlertModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import {
  assignTechnician,
  getAllRequests,
  getTechnicians,
  updateRequestStatus,
} from "../../services/serviceRequestService";

const pageSize = 10;
const selectClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

const statusClass = (status) => {
  const styles = {
    Pending: "bg-amber-100 text-amber-800",
    Assigned: "bg-blue-100 text-blue-800",
    "On-going": "bg-orange-100 text-orange-800",
    Resolved: "bg-green-100 text-green-800",
  };

  return styles[status] || "bg-slate-100 text-slate-700";
};

function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [page, setPage] = useState(1);
  const [alert, setAlert] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchRequests = async () => {
    try {
      const data = await getAllRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const data = await getTechnicians();
      setTechnicians(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchTechnicians();
  }, []);

  const totalPages = Math.max(1, Math.ceil(requests.length / pageSize));
  const paginatedRequests = useMemo(
    () => requests.slice((page - 1) * pageSize, page * pageSize),
    [requests, page]
  );

  const updateStatus = (id, status) => {
    setConfirmAction({
      title: "Update Request Status",
      message: `Change this service request status to ${status}?`,
      confirmText: "Update",
      variant: "warning",
      run: async () => {
        try {
          await updateRequestStatus(id, status);
          setAlert({
            type: "success",
            title: "Status Updated",
            message: `Service request status changed to ${status}.`,
          });
          fetchRequests();
        } catch (err) {
          console.error(err);
          setAlert({
            type: "error",
            title: "Update Failed",
            message: "Unable to update service request status.",
          });
        }
      },
    });
  };

  const handleAssignTechnician = async (requestId, technicianId) => {
    if (!technicianId) return;

    try {
      await assignTechnician(requestId, technicianId);
      setAlert({
        type: "success",
        title: "Technician Assigned",
        message: "The technician was assigned to the request.",
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const runConfirmAction = async () => {
    const action = confirmAction;
    setConfirmAction(null);
    await action?.run();
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Operations
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Service Requests
        </h1>
        <p className="mt-2 text-slate-600">
          Assign technicians and track request progress from submission to
          resolution.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-245 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Job Order",
                  "Customer",
                  "Account",
                  "Issue",
                  "Status",
                  "Technician",
                  "Assign",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-500">
                    No service requests found.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-3 font-bold text-slate-950">
                      {request.job_order_no || `#${request.id}`}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-950">
                        {request.customer_name || request.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {request.customer_email || request.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {request.account_number || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">
                        {request.issue_type || "General"}
                      </p>
                      <p className="max-w-xs truncate text-xs text-slate-500">
                        {request.issue_description}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request.id, e.target.value)}
                        className={selectClass}
                      >
                        <option>Pending</option>
                        <option>Assigned</option>
                        <option>On-going</option>
                        <option>Resolved</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {request.technician_name || "Unassigned"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={request.technician_id || ""}
                        onChange={(e) =>
                          handleAssignTechnician(request.id, e.target.value)
                        }
                        className={selectClass}
                      >
                        <option value="">Assign technician</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
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

export default ServiceRequests;
