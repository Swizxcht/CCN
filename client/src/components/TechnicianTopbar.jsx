import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TechnicianTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
            Field operations
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">
            Technician Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review job orders, service requests, and subscriber installations.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:justify-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Signed in as
            </p>
            <p className="text-sm font-bold text-slate-900">
              {user?.name || user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default TechnicianTopbar;
