import { formatDate } from "../../utils/formatDate";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:3001";

function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-950">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function InstallationDetailsModal({ installation, onClose, actions }) {
  if (!installation) return null;

  const fullName = installation.full_name || installation.name;
  const email = installation.application_email || installation.email;
  const idImage = imageUrl(installation.id_image);
  const houseImage = imageUrl(installation.house_image);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#3F48CC]">
              {installation.subscriber_no}
            </p>
            <h2 className="text-2xl font-bold text-gray-950">
              Installation Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-lg border border-gray-200 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-950">
                    Subscriber Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    New subscriber installation request
                  </p>
                </div>
                <span className="rounded-full bg-[#3F48CC]/10 px-3 py-1 text-sm font-semibold text-[#3F48CC]">
                  {installation.installation_status}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Full Name" value={fullName} />
                <Detail label="Subscriber No." value={installation.subscriber_no} />
                <Detail label="Contact Number" value={installation.contact_number} />
                <Detail label="Email Address" value={email} />
                <Detail label="Birthday" value={formatDate(installation.birthday)} />
                <Detail label="Spouse" value={installation.spouse} />
                <Detail
                  label="Wedding Anniversary"
                  value={formatDate(installation.wedding_anniversary)}
                />
                <Detail label="Requested Date" value={formatDate(installation.requested_date)} />
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-4 text-lg font-bold text-gray-950">
                Selected Plans
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Detail
                  label="Internet Plan"
                  value={
                    installation.internet_plan
                      ? `${installation.internet_plan}${installation.speed ? ` - ${installation.speed}` : ""}`
                      : "No internet plan"
                  }
                />
                <Detail
                  label="Cable Plan"
                  value={installation.cable_plan || "No cable plan"}
                />
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-4 text-lg font-bold text-gray-950">
                Location Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Detail label="Complete Address" value={installation.address} />
                </div>
                <Detail label="Street / House No." value={installation.street} />
                <Detail label="Barangay" value={installation.barangay} />
                <Detail label="City / Municipality" value={installation.city} />
                <Detail label="Province" value={installation.province} />
                <Detail label="Postal Code" value={installation.postal_code} />
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 text-lg font-bold text-gray-950">
                House Picture
              </h3>
              {houseImage ? (
                <img
                  src={houseImage}
                  alt="Subscriber house"
                  className="h-56 w-full rounded-md border border-gray-200 object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-center text-sm text-gray-500">
                  No house picture uploaded.
                </div>
              )}
            </section>

            <section className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 text-lg font-bold text-gray-950">
                Valid ID
              </h3>
              {idImage ? (
                <img
                  src={idImage}
                  alt="Subscriber valid ID"
                  className="h-48 w-full rounded-md border border-gray-200 object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-center text-sm text-gray-500">
                  No ID image uploaded.
                </div>
              )}
            </section>

            {actions && (
              <section className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-3 text-lg font-bold text-gray-950">
                  Actions
                </h3>
                {actions}
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default InstallationDetailsModal;
