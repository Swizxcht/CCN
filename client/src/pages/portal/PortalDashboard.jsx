/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDashboardSummary,
  getMyProfile,
} from "../../services/portalService";

const formatMoney = (value) =>
  `PHP ${Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
    {hint && <p className="mt-2 text-sm text-slate-600">{hint}</p>}
  </div>
);

function PortalDashboard() {
  const [summary, setSummary] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const summaryData = await getDashboardSummary();
      setSummary(summaryData);

      if (summaryData.isSubscriber !== false) {
        const profileData = await getMyProfile();
        setProfile(profileData);
      }
    } catch (err) {
      console.error("Dashboard Error:", err.response?.data || err);
      setError("Unable to load your portal overview.");
    }
  };

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 font-semibold text-red-800">
        {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
        Loading portal overview...
      </div>
    );
  }

  if (summary.isSubscriber === false) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Welcome
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Start your CCN subscription
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          You do not have an active subscriber account yet. Submit an
          application so the CCN team can review your details and preferred
          plan.
        </p>
        <Link
          to="/portal/apply"
          className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          Apply for Plan
        </Link>
      </div>
    );
  }

  const displayName = profile?.full_name || profile?.name || "Subscriber";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
              Portal overview
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Welcome, {displayName}
            </h1>
            <p className="mt-2 text-slate-600">
              Account {profile?.subscriber_no || "N/A"} is currently{" "}
              <span className="font-bold text-slate-950">
                {summary.account_status}
              </span>
              .
            </p>
          </div>

          <Link
            to="/portal/service-requests"
            className="rounded-lg bg-cyan-400 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Submit Service Request
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Outstanding Balance"
          value={formatMoney(summary.outstanding_balance)}
          hint="Remaining unpaid amount"
        />
        <StatCard
          label="Total Bills"
          value={summary.total_bills || 0}
          hint="Bills generated"
        />
        <StatCard
          label="Total Payments"
          value={summary.total_payments || 0}
          hint="Recorded payments"
        />
        <StatCard
          label="Account Status"
          value={summary.account_status || "N/A"}
          hint="Current subscription state"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Current Subscription
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
                Internet
              </p>
              <p className="mt-2 text-lg font-black text-slate-950">
                {profile?.internet_plan || "No internet plan"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {profile?.speed || "Speed not set"}
              </p>
              <p className="mt-3 font-bold text-slate-950">
                {profile?.internet_fee
                  ? formatMoney(profile.internet_fee)
                  : "No fee"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
                Cable
              </p>
              <p className="mt-2 text-lg font-black text-slate-950">
                {profile?.cable_plan || "No cable plan"}
              </p>
              <p className="mt-3 font-bold text-slate-950">
                {profile?.cable_fee ? formatMoney(profile.cable_fee) : "No fee"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Contact Details
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-bold text-slate-500">Email</dt>
              <dd className="mt-1 text-slate-950">{profile?.email || "N/A"}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Contact Number</dt>
              <dd className="mt-1 text-slate-950">
                {profile?.contact_number || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Address</dt>
              <dd className="mt-1 text-slate-950">
                {profile?.address || "N/A"}
              </dd>
            </div>
          </dl>
          <Link
            to="/portal/profile"
            className="mt-6 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-500"
          >
            View Full Profile
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          to="/portal/bills"
          className="rounded-xl border border-slate-200 bg-white p-5 font-bold text-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          View Bills
          <p className="mt-2 text-sm font-normal text-slate-600">
            Review balances and due dates.
          </p>
        </Link>
        <Link
          to="/portal/payments"
          className="rounded-xl border border-slate-200 bg-white p-5 font-bold text-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          View Payments
          <p className="mt-2 text-sm font-normal text-slate-600">
            Pay bills and review receipts.
          </p>
        </Link>
        <Link
          to="/portal/service-requests"
          className="rounded-xl border border-slate-200 bg-white p-5 font-bold text-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          Service Requests
          <p className="mt-2 text-sm font-normal text-slate-600">
            Submit and track support concerns.
          </p>
        </Link>
      </section>
    </div>
  );
}

export default PortalDashboard;
