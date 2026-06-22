const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:3001";

function resolveUploadUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function RequestDetailsModal({ request, onClose, actions }) {
  if (!request) return null;

  const customerName = request.subscriber_name || request.customer_name;
  const contactNumber = request.customer_contact || request.contact_number;
  const address = request.customer_address || request.address;
  const accountNumber = request.account_number || request.subscriber_no;
  const houseImageUrl = resolveUploadUrl(request.house_image);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#3F48CC]">
              {request.job_order_no || `Request #${request.id}`}
            </p>
            <h2 className="text-2xl font-bold text-gray-950">
              Service Request Details
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
                    Request Summary
                  </h3>
                  <p className="text-sm text-gray-600">
                    {request.issue_type || "General service concern"}
                  </p>
                </div>
                <span className="rounded-full bg-[#3F48CC]/10 px-3 py-1 text-sm font-semibold text-[#3F48CC]">
                  {request.status}
                </span>
              </div>
              <p className="whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm leading-6 text-gray-800">
                {request.issue_description || "No description provided."}
              </p>
            </section>

            <section className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-4 text-lg font-bold text-gray-950">
                Customer Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem label="Full Name" value={customerName} />
                <InfoItem label="Account Number" value={accountNumber} />
                <InfoItem label="Contact Number" value={contactNumber} />
                <InfoItem label="Email Address" value={request.customer_email} />
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-4 text-lg font-bold text-gray-950">
                Location Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <InfoItem label="Service Address" value={address} />
                </div>
                <InfoItem label="Street / House No." value={request.street} />
                <InfoItem label="Barangay" value={request.barangay} />
                <InfoItem label="City / Municipality" value={request.city} />
                <InfoItem label="Province" value={request.province} />
                <InfoItem label="Postal Code" value={request.postal_code} />
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 text-lg font-bold text-gray-950">
                House Picture
              </h3>
              {houseImageUrl ? (
                <a href={houseImageUrl} target="_blank" rel="noreferrer">
                  <img
                    src={houseImageUrl}
                    alt="Customer house"
                    className="h-72 w-full rounded-md border border-gray-200 object-cover"
                  />
                </a>
              ) : (
                <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-center text-sm text-gray-500">
                  No house picture uploaded.
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

export default RequestDetailsModal;
