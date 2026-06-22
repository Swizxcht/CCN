/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyAddressInfo,
} from "../../services/portalService";
import AddressFields from "../../components/forms/AddressFields";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { formatDate } from "../../utils/formatDate";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

const formatMoney = (value) =>
  `PHP ${Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const DetailItem = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4">
    <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
    </dt>
    <dd className="mt-2 font-semibold text-slate-950">{value || "Not set"}</dd>
  </div>
);

function Profile() {
  const [profile, setProfile] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    barangay: "",
    city: "",
    province: "",
    postal_code: "",
    house_image: null,
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
      setAddressForm({
        street: data.street || "",
        barangay: data.barangay || "",
        city: data.city || "",
        province: data.province || "",
        postal_code: data.postal_code || "",
        house_image: null,
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load your profile.");
    }
  };

  const handleAddressChange = (event) => {
    const { name, value, files } = event.target;
    setAddressForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    setConfirmSave(true);
  };

  const saveResidenceInfo = async () => {
    setConfirmSave(false);
    setSaving(true);
    setMessage(null);
    setError(null);

    const payload = new FormData();
    Object.entries(addressForm).forEach(([key, value]) => {
      if (value) {
        payload.append(key, value);
      }
    });

    try {
      await updateMyAddressInfo(payload);
      setMessage("Address information updated.");
      loadProfile();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update address.");
    } finally {
      setSaving(false);
    }
  };

  const imageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http")
      ? path
      : `${import.meta.env.VITE_API_URL || "http://localhost:3001"}${path}`;
  };

  if (error && !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 font-semibold text-red-800">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
        Loading profile...
      </div>
    );
  }

  const displayName = profile.full_name || profile.name;
  const houseImage = imageUrl(profile.house_image);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Account profile
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          My Profile
        </h1>
        <p className="mt-2 text-slate-600">
          Keep your subscriber and address information accurate for admin and
          technician visits.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 font-semibold text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 font-semibold text-red-800">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Subscriber No.
            </p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">
              {profile.subscriber_no}
            </h2>
            <p className="mt-2 text-slate-600">{displayName}</p>
          </div>

          <span className="inline-flex w-fit rounded-full bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-800">
            {profile.account_status}
          </span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Personal Details
          </h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailItem label="Full Name" value={displayName} />
            <DetailItem label="Email" value={profile.email} />
            <DetailItem label="Birthday" value={formatDate(profile.birthday)} />
            <DetailItem label="Spouse" value={profile.spouse} />
            <DetailItem
              label="Wedding Anniversary"
              value={formatDate(profile.wedding_anniversary)}
            />
            <DetailItem label="Contact Number" value={profile.contact_number} />
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Plan Summary</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
                Internet Plan
              </p>
              <p className="mt-2 text-lg font-black text-slate-950">
                {profile.internet_plan || "No internet plan"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {profile.speed || "Speed not set"}
              </p>
              <p className="mt-3 font-bold text-slate-950">
                {profile.internet_fee ? formatMoney(profile.internet_fee) : "No fee"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
                Cable Plan
              </p>
              <p className="mt-2 text-lg font-black text-slate-950">
                {profile.cable_plan || "No cable plan"}
              </p>
              <p className="mt-3 font-bold text-slate-950">
                {profile.cable_fee ? formatMoney(profile.cable_fee) : "No fee"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-950">
            Address and Location Details
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Address is required. A house or residency photo is recommended to
            help technicians verify your location.
          </p>
        </div>

        <form onSubmit={handleAddressSubmit} className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <h3 className="text-lg font-black text-slate-950">
                Residence Information
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Update each address part and house photo in one place.
              </p>
            </div>
            <AddressFields values={addressForm} onChange={handleAddressChange} />
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-slate-700">
                House / Residency Picture
              </label>
              <input
                type="file"
                name="house_image"
                accept="image/*"
                onChange={handleAddressChange}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Address Details"}
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">
              Current House / Residency Picture
            </p>
            {houseImage ? (
              <a href={houseImage} target="_blank" rel="noreferrer">
                <img
                  src={houseImage}
                  alt="House location"
                  className="aspect-4/3 w-full rounded-xl border border-slate-200 object-cover"
                />
              </a>
            ) : (
              <div className="grid aspect-4/3 place-items-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500">
                No house picture uploaded
              </div>
            )}
          </div>
        </form>
      </section>
      <ConfirmModal
        open={confirmSave}
        title="Update Residence Information"
        message="Are you sure you want to update your address and house/residency information?"
        confirmText="Update"
        variant="warning"
        onConfirm={saveResidenceInfo}
        onCancel={() => setConfirmSave(false)}
      />
    </div>
  );
}

export default Profile;
