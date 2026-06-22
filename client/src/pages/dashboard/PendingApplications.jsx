import { useEffect, useState } from "react";
import {
  approveSubscriptionApplication,
  declineSubscriptionApplication,
  getPendingApplications,
} from "../../services/subscriberApplicationService";
import AlertModal from "../../components/modals/AlertModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import DateTextField from "../../components/forms/DateTextField";
import { formatDate } from "../../utils/formatDate";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

function PendingApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [appointment, setAppointment] = useState({
    appointment_date: "",
    appointment_time: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await getPendingApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load pending applications.");
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (applicationId) => {
    try {
      await approveSubscriptionApplication(applicationId, appointment);
      setAlert({
        type: "success",
        title: "Application Accepted",
        message: "Application moved to pending installation.",
      });
      setSelected(null);
      setAppointment({ appointment_date: "", appointment_time: "" });
      loadApplications();
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        title: "Accept Failed",
        message: err.response?.data?.message || "Failed to approve application.",
      });
    }
  };

  const handleApprove = (applicationId) => {
    setConfirmAction({
      title: "Accept Application",
      message: "Move this customer application to the technician pending installation queue?",
      confirmText: "Accept",
      variant: "success",
      run: () => approveApplication(applicationId),
    });
  };

  const handleDecline = (applicationId) => {
    setConfirmAction({
      title: "Decline Application",
      message: "Decline this subscription application?",
      confirmText: "Decline",
      variant: "danger",
      run: async () => {
        try {
          await declineSubscriptionApplication(applicationId);
          setAlert({
            type: "success",
            title: "Application Declined",
            message: "The application was declined.",
          });
          loadApplications();
        } catch (err) {
          console.error(err);
          setAlert({
            type: "error",
            title: "Decline Failed",
            message: err.response?.data?.message || "Failed to decline application.",
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

  const handleAppointmentChange = (event) => {
    const { name, value } = event.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const imageUrl = (path) => {
    if (!path) {
      return null;
    }

    return path.startsWith("http")
      ? path
      : `${import.meta.env.VITE_API_URL || "http://localhost:3001"}${path}`;
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Applications
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Pending Applications
        </h1>
        <p className="mt-2 text-slate-600">
          Review customer details, selected plans, and accept applications for
          technician installation.
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

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          Loading pending applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          No pending applications found.
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((application) => {
            const idImage = imageUrl(application.id_image);

            return (
              <div
                key={application.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
                  <div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="text-xl font-black text-slate-950">
                          {application.full_name || application.name}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {application.application_email || application.email}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => setSelected(application.id)}
                          className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                        >
                          Accept for Installation
                        </button>
                        <button
                          onClick={() => handleDecline(application.id)}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                        >
                          Decline
                        </button>
                      </div>
                    </div>

                    <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
                      <div>
                        <dt className="font-bold text-slate-500">Birthday</dt>
                        <dd className="mt-1 text-slate-900">
                          {formatDate(application.birthday)}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-500">Spouse</dt>
                        <dd className="mt-1 text-slate-900">
                          {application.spouse || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-500">
                          Wedding Anniversary
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {formatDate(application.wedding_anniversary)}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-500">
                          Requested Date
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {formatDate(application.requested_date)}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-500">Contact</dt>
                        <dd className="mt-1 text-slate-900">
                          {application.contact_number}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-500">Plans</dt>
                        <dd className="mt-1 text-slate-900">
                          {application.internet_plan || "No internet"} /{" "}
                          {application.cable_plan || "No cable"}
                        </dd>
                      </div>
                      <div className="md:col-span-2">
                        <dt className="font-bold text-slate-500">Address</dt>
                        <dd className="mt-1 text-slate-900">
                          {application.address}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-500">Street</dt>
                        <dd className="mt-1 text-slate-900">
                          {application.street || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-500">Barangay</dt>
                        <dd className="mt-1 text-slate-900">
                          {application.barangay || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-500">City</dt>
                        <dd className="mt-1 text-slate-900">
                          {application.city || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-slate-500">Province</dt>
                        <dd className="mt-1 text-slate-900">
                          {application.province || "Not provided"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-bold text-slate-500">
                      Valid ID Image
                    </p>
                    {idImage ? (
                      <a href={idImage} target="_blank" rel="noreferrer">
                        <img
                          src={idImage}
                          alt="Submitted valid ID"
                          className="aspect-[4/3] w-full rounded-lg border border-slate-200 object-cover"
                        />
                      </a>
                    ) : (
                      <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500">
                        No image uploaded
                      </div>
                    )}
                  </div>
                </div>

                {selected === application.id && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-lg font-black text-slate-950">
                      Appointment Details
                    </h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <DateTextField
                        label="Installation Date"
                        name="appointment_date"
                        value={appointment.appointment_date}
                        onChange={handleAppointmentChange}
                      />
                      <div>
                        <label className="text-sm font-bold text-slate-700">
                          Installation Time
                        </label>
                        <input
                          type="time"
                          name="appointment_time"
                          value={appointment.appointment_time}
                          onChange={handleAppointmentChange}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => handleApprove(application.id)}
                        className="rounded-lg bg-[#3F48CC] px-4 py-2 font-bold text-white transition hover:bg-[#3138a8]"
                      >
                        Move to Pending Installation
                      </button>
                      <button
                        onClick={() => setSelected(null)}
                        className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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

export default PendingApplications;
