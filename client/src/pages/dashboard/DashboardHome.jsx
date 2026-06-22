import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BillIcon,
  NewsIcon,
  PaymentIcon,
  PendingIcon,
  RecordPaymentIcon,
  ServiceRequestIcon,
  SubscriberIcon,
  UserIcon,
} from "../../components/icons";
import { getAdminDashboard } from "../../services/adminService";

const formatMoney = (value) =>
  `PHP ${Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function SummaryCard({ title, value, description, to, icon: Icon }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
            {title}
          </p>
          <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-white">
          <Icon />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}

function DashboardHome() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getAdminDashboard()
      .then((data) => setSummary(data))
      .catch(console.error);
  }, []);

  const value = (key) => (summary ? summary[key] || 0 : "...");

  const cards = useMemo(
    () => [
      {
        title: "Users",
        value: value("users"),
        description: `${value("customers")} customers and ${value("technicians")} technicians registered.`,
        to: "/dashboard/customers",
        icon: UserIcon,
      },
      {
        title: "Subscribers",
        value: value("active_subscribers"),
        description: "Active subscriber accounts currently receiving service.",
        to: "/dashboard/subscribers",
        icon: SubscriberIcon,
      },
      {
        title: "Pending Applications",
        value: value("pending_applications"),
        description: "Subscription applications waiting for admin review.",
        to: "/dashboard/pending-applications",
        icon: PendingIcon,
      },
      {
        title: "Service Requests",
        value: value("service_requests"),
        description: `${value("pending_requests")} request(s) are still pending.`,
        to: "/dashboard/service-requests",
        icon: ServiceRequestIcon,
      },
      {
        title: "News",
        value: value("news"),
        description: "Published announcements, advisories, and promotions.",
        to: "/dashboard/news",
        icon: NewsIcon,
      },
      {
        title: "Bills",
        value: value("bills"),
        description: `${value("unpaid_bills")} bill(s) still unpaid or partially paid.`,
        to: "/dashboard/bills",
        icon: BillIcon,
      },
      {
        title: "Payments",
        value: value("payments"),
        description: `Outstanding balance: ${summary ? formatMoney(summary.outstanding_balance) : "..."}.`,
        to: "/dashboard/payments",
        icon: PaymentIcon,
      },
      {
        title: "Billing Console",
        value: "Monthly",
        description: "Generate billing cycles for active subscribers.",
        to: "/dashboard/billing-console",
        icon: RecordPaymentIcon,
      },
    ],
    [summary]
  );

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Admin overview
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Content Summary
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          A quick summary of every admin section. Open any card to manage that
          page.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}

export default DashboardHome;
