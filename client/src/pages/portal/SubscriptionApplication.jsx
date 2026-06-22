/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressFields from "../../components/forms/AddressFields";
import DateTextField from "../../components/forms/DateTextField";
import { applySubscription } from "../../services/subscriberApplicationService";
import { getCablePlans, getInternetPlans } from "../../services/subscriberService";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
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

function SubscriptionApplication() {
  const { user } = useAuth();
  const [internetPlans, setInternetPlans] = useState([]);
  const [cablePlans, setCablePlans] = useState([]);
  const [form, setForm] = useState({
    ...initialForm,
    full_name: user?.name || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const [internetData, cableData] = await Promise.all([
        getInternetPlans(),
        getCablePlans(),
      ]);
      setInternetPlans(internetData);
      setCablePlans(cableData);
    } catch (err) {
      console.error(err);
      setError("Unable to load available plans.");
    }
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const buildPayload = () => {
    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        payload.append(key, value);
      }
    });

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!form.internet_plan_id && !form.cable_plan_id) {
      setError("Choose at least one internet or cable plan.");
      setLoading(false);
      return;
    }

    try {
      await applySubscription(buildPayload());

      setMessage("Your application has been submitted. An admin will review it shortly.");
      setForm({
        ...initialForm,
        full_name: user?.name || "",
        email: user?.email || "",
      });
      navigate("/portal");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Subscription application
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Apply for Subscription
        </h1>
        <p className="mt-2 text-slate-600">
          Complete your personal information, upload a valid ID image, and
          choose at least one plan.
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
          <div>
            <label className="text-sm font-bold text-slate-700">Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <DateTextField
            label="Birthday"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            required
          />

          <div>
            <label className="text-sm font-bold text-slate-700">
              Spouse
            </label>
            <input
              name="spouse"
              value={form.spouse}
              onChange={handleChange}
              className={inputClass}
              placeholder="Leave blank if not applicable"
            />
          </div>

          <DateTextField
            label="Wedding Anniversary"
            name="wedding_anniversary"
            value={form.wedding_anniversary}
            onChange={handleChange}
          />

          <div>
            <label className="text-sm font-bold text-slate-700">
              Contact Number
            </label>
            <input
              name="contact_number"
              value={form.contact_number}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <h2 className="text-lg font-black text-slate-950">
              Service Address
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Enter each part of the address for accurate installation records.
            </p>
          </div>
          <AddressFields values={form} onChange={handleChange} />

          <DateTextField
            label="Preferred Installation Date"
            name="installation_date"
            value={form.installation_date}
            onChange={handleChange}
            required
          />

          <div>
            <label className="text-sm font-bold text-slate-700">
              Upload Valid ID
            </label>
            <input
              type="file"
              name="id_image"
              accept="image/*"
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Internet Plan
            </label>
            <select
              name="internet_plan_id"
              value={form.internet_plan_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">No internet plan</option>
              {internetPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.plan_name} - PHP {plan.monthly_fee}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Cable Plan</label>
            <select
              name="cable_plan_id"
              value={form.cable_plan_id}
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

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/portal")}
            className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:border-slate-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubscriptionApplication;
