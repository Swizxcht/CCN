import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo-ccn.png";

function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/plans", label: "Plans" },
    { to: "/news", label: "News" },
    { to: "/support", label: "Support" },
    { to: "/contact", label: "Contact" },
  ];

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-white text-slate-950"
        : "text-white hover:bg-white/15"
    }`;

  const dashboardLink =
    user?.role === "admin"
      ? { to: "/dashboard", label: "Dashboard" }
      : user?.role === "technician"
        ? { to: "/technician", label: "Technician" }
        : user?.role === "customer"
          ? { to: "/portal", label: "My Portal" }
          : { to: "/login", label: "Login" };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950 text-white shadow-lg shadow-slate-950/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Celebrity Cable Network"
              className="h-11 w-11 rounded-lg bg-white object-contain p-1"
            />
            <span className="leading-tight">
              <span className="block text-sm font-bold">
                Celebrity Cable Network
              </span>
              <span className="hidden text-xs text-white/80 sm:block">
                Internet and cable services
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white lg:hidden"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
          >
            Menu
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                end={item.to === "/"}
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              className="ml-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-white/90"
              to={dashboardLink.to}
            >
              {dashboardLink.label}
            </Link>
          </div>
        </div>

        {open && (
          <div className="border-t border-white/10 py-4 lg:hidden">
            <div className="grid gap-2">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={linkClass}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              <Link
                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950"
                to={dashboardLink.to}
                onClick={() => setOpen(false)}
              >
                {dashboardLink.label}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
