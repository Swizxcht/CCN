/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useState } from "react";
import IconButton from "../../components/admin/IconButton";
import Pagination from "../../components/admin/Pagination";
import PasswordField from "../../components/forms/PasswordField";
import AlertModal from "../../components/modals/AlertModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import CustomerModal from "../../components/modals/CustomerModal";
import {
  DeleteIcon,
  PlusIcon,
  ToggleIcon,
  ViewIcon,
} from "../../components/icons";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomerStatus,
} from "../../services/customerService";

const pageSize = 10;
const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    status: "Active",
  });
  const [creating, setCreating] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.email.toLowerCase().includes(search.toLowerCase())
      ),
    [customers, search]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      await createCustomer(newUser);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "customer",
        status: "Active",
      });
      setShowCreateModal(false);
      setAlert({
        type: "success",
        title: "User Created",
        message: "The user account was created successfully.",
      });
      loadCustomers();
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        title: "Create User Failed",
        message: error.response?.data?.message || "Failed to create user",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirmAction({
      title: "Delete User",
      message: "This will permanently delete the selected user account.",
      confirmText: "Delete",
      variant: "danger",
      run: async () => {
        try {
          await deleteCustomer(id);
          setAlert({
            type: "success",
            title: "User Deleted",
            message: "The user account was deleted.",
          });
          loadCustomers();
        } catch (error) {
          console.error(error);
          setAlert({
            type: "error",
            title: "Delete Failed",
            message: "Unable to delete the user account.",
          });
        }
      },
    });
  };

  const confirmToggleStatus = (customer) => {
    const nextStatus = customer.status === "Active" ? "Inactive" : "Active";
    setConfirmAction({
      title: `${nextStatus} User`,
      message: `Set ${customer.name}'s account status to ${nextStatus}?`,
      confirmText: "Update Status",
      variant: "warning",
      run: async () => {
        try {
          await updateCustomerStatus(customer.id, nextStatus);
          setAlert({
            type: "success",
            title: "Status Updated",
            message: `User status changed to ${nextStatus}.`,
          });
          loadCustomers();
        } catch (error) {
          console.error(error);
          setAlert({
            type: "error",
            title: "Update Failed",
            message: "Unable to update user status.",
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

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            User Management
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          <PlusIcon />
          Add User
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={inputClass}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["ID", "Name", "Email", "Role", "Status", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {customer.id}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-950">
                    {customer.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{customer.email}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        customer.status === "Active"
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
                          : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"
                      }
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <IconButton
                        label="View user"
                        variant="primary"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        label={
                          customer.status === "Active"
                            ? "Disable user"
                            : "Enable user"
                        }
                        variant="warning"
                        onClick={() => confirmToggleStatus(customer)}
                      >
                        <ToggleIcon />
                      </IconButton>
                      <IconButton
                        label="Delete user"
                        variant="danger"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Create New User
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Add customer, technician, or admin access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-slate-300 px-3 py-2 font-bold text-slate-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className={inputClass}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className={inputClass}
                required
              />
              <PasswordField
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className={inputClass}
              >
                <option value="customer">Customer</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={newUser.status}
                onChange={(e) =>
                  setNewUser({ ...newUser, status: e.target.value })
                }
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNewUser({
                      name: "",
                      email: "",
                      password: "",
                      role: "customer",
                      status: "Active",
                    })
                  }
                  className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CustomerModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
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

export default Customers;
