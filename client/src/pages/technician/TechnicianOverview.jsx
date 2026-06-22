import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAssignedRequests,
  getPendingRequests,
} from "../../services/serviceRequestService";
import {
  getAssignedInstallations,
  getPendingInstallations,
} from "../../services/subscriberApplicationService";

function StatCard({ label, value, description, to }) {
  return (
    <Link
      to={to}
      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#3F48CC] hover:shadow-md"
    >
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-3 text-4xl font-black text-[#3F48CC]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
    </Link>
  );
}

function TechnicianOverview() {
  const [summary, setSummary] = useState({
    jobOrders: 0,
    pendingRequests: 0,
    installationJobs: 0,
    pendingInstallations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [
          jobOrders,
          pendingRequests,
          installationJobs,
          pendingInstallations,
        ] = await Promise.all([
          getAssignedRequests(),
          getPendingRequests(),
          getAssignedInstallations(),
          getPendingInstallations(),
        ]);

        setSummary({
          jobOrders: jobOrders.length,
          pendingRequests: pendingRequests.length,
          installationJobs: installationJobs.length,
          pendingInstallations: pendingInstallations.length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#3F48CC]">
          Field Operations
        </p>
        <h1 className="text-3xl font-bold text-gray-950">
          Technician Overview
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
          Monitor service job orders and new subscriber installations from one
          workspace.
        </p>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-6 text-gray-700 shadow">
          Loading overview...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Job Order"
            value={summary.jobOrders}
            description="Service requests currently assigned to you."
            to="/technician/job-orders"
          />
          <StatCard
            label="Pending Requests"
            value={summary.pendingRequests}
            description="Open service requests available to claim."
            to="/technician/pending"
          />
          <StatCard
            label="Installation Job Orders"
            value={summary.installationJobs}
            description="New subscriber installations assigned to you."
            to="/technician/installations/job-orders"
          />
          <StatCard
            label="Pending Installations"
            value={summary.pendingInstallations}
            description="New subscriber installations available to claim."
            to="/technician/installations/pending"
          />
        </div>
      )}
    </div>
  );
}

export default TechnicianOverview;
