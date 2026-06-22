import { NavLink } from "react-router-dom";
import logo from "../assets/logo-ccn.png";
import {
  BillIcon,
  DashboardIcon,
  PaymentIcon,
  ProfileIcon,
  ServiceRequestIcon,
} from "./icons";

const navItems = [
  { to: "/portal", label: "Dashboard", icon: DashboardIcon, end: true },
  { to: "/portal/profile", label: "Profile", icon: ProfileIcon },
  { to: "/portal/bills", label: "Bills", icon: BillIcon },
  { to: "/portal/payments", label: "Payments", icon: PaymentIcon },
  {
    to: "/portal/service-requests",
    label: "Service Requests",
    icon: ServiceRequestIcon,
  },
  { to: "/portal/apply", label: "Apply Subscription", icon: ProfileIcon },
];

function SubscriberSidebar({ open = false, onClose = () => {} }) {
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
      isActive
        ? "bg-white text-slate-950"
        : "text-white hover:bg-white/15"
    }`;

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-950 text-white transition-transform lg:static lg:min-h-screen lg:shrink-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        <img src={logo} alt="CCN" className="h-12 w-12 rounded-lg bg-white object-contain p-1" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-white/80">
            Subscriber
          </p>
          <h2 className="mt-1 text-xl font-black">My Account</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-lg border border-white/15 px-2 py-1 text-sm font-bold lg:hidden"
        >
          Close
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={navClass}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
    </>
  );
}

export default SubscriberSidebar;
