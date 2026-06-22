/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import AddressFields from "../../components/forms/AddressFields";
import DateTextField from "../../components/forms/DateTextField";
import {
  createSubscriber,
  getAvailableUsers,
  getCablePlans,
  getInternetPlans,
} from "../../services/subscriberService";

const initialForm = {
  user_id: "",
  full_name: "",
  street: "",
  barangay: "",
  city: "",
  province: "",
  postal_code: "",
  birthday: "",
  spouse: "",
  wedding_anniversary: "",
  contact_number: "",
  email: "",
  installation_date: "",
  internet_plan_id: "",
  cable_plan_id: "",
  id_image: null,
};

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

function CreateSubscriber() {
  const [users, setUsers] = useState([]);
  const [internetPlans, setInternetPlans] = useState([]);
  const [cablePlans, setCablePlans] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, internetData, cableData] = await Promise.all([
        getAvailableUsers(),
        getInternetPlans(),
        getCablePlans(),
      ]);

      setUsers(usersData);
      setInternetPlans(internetData);
      setCablePlans(cableData);
    } catch (err) {
      console.error(err);
      setError("Unable to load users and plans.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "user_id") {
      const selectedUser = users.find((user) => String(user.id) === value);
      setFormData({
        ...formData,
        user_id: value,
        full_name: selectedUser?.name || "",
        email: selectedUser?.email || "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const buildPayload = () => {
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        payload.append(key, value);
      }
    });

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!formData.internet_plan_id && !formData.cable_plan_id) {
      setError("Choose at least one internet or cable plan.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await createSubscriber(buildPayload());

      setMessage(`Subscriber created: ${response.data.subscriber_no}`);
      setFormData(initialForm);
      loadData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create subscriber.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Subscriber management
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Create Subscriber
        </h1>
        <p className="mt-2 text-slate-600">
          Add subscriber profile details, upload an ID image, and assign at
          least one internet or cable plan.
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

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-slate-700">
              Customer Account
            </label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Customer</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Full Name</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <DateTextField
            label="Birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />

          <div>
            <label className="text-sm font-bold text-slate-700">
              Spouse
            </label>
            <input
              name="spouse"
              value={formData.spouse}
              onChange={handleChange}
              className={inputClass}
              placeholder="Leave blank if not applicable"
            />
          </div>

          <DateTextField
            label="Wedding Anniversary"
            name="wedding_anniversary"
            value={formData.wedding_anniversary}
            onChange={handleChange}
          />

          <div>
            <label className="text-sm font-bold text-slate-700">
              Contact Number
            </label>
            <input
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="md:col-span-2">
            <h2 className="text-lg font-black text-slate-950">
              Service Address
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Enter each part of the subscriber address.
            </p>
          </div>
          <AddressFields values={formData} onChange={handleChange} />

          <DateTextField
            label="Installation Date"
            name="installation_date"
            value={formData.installation_date}
            onChange={handleChange}
            required
          />

          <div>
            <label className="text-sm font-bold text-slate-700">
              Valid ID Image
            </label>
            <input
              type="file"
              name="id_image"
              accept="image/*"
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Internet Plan
            </label>
            <select
              name="internet_plan_id"
              value={formData.internet_plan_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">No internet plan</option>
              {internetPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.plan_name} - {plan.speed} - PHP {plan.monthly_fee}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Cable Plan</label>
            <select
              name="cable_plan_id"
              value={formData.cable_plan_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">No cable plan</option>
              {cablePlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.plan_name} - PHP {plan.monthly_fee}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Subscriber"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSubscriber;
