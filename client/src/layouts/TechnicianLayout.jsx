import { useState } from "react";
import { Outlet } from "react-router-dom";
import TechnicianSidebar from "../components/TechnicianSidebar";
import TechnicianTopbar from "../components/TechnicianTopbar";

function TechnicianLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white lg:flex">
      <TechnicianSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white"
          >
            Menu
          </button>
        </div>
        <TechnicianTopbar />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TechnicianLayout;
