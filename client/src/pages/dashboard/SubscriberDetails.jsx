/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSubscriber } from "../../services/subscriberService";
import { formatDate } from "../../utils/formatDate";

const formatMoney = (value) =>
  `PHP ${Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const imageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_URL || "http://localhost:3001"}${path}`;
};

const DetailItem = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4">
    <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
    </dt>
    <dd className="mt-2 font-semibold text-slate-950">{value || "Not set"}</dd>
  </div>
);

const ImagePanel = ({ title, src, alt }) => (
  <div>
    <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
      {title}
    </h3>
    {src ? (
      <a href={src} target="_blank" rel="noreferrer">
        <img
          src={src}
          alt={alt}
          className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
        />
      </a>
    ) : (
      <div className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500">
        No image uploaded
      </div>
    )}
  </div>
);

function SubscriberDetails() {
  const { id } = useParams();
  const [subscriber, setSubscriber] = useState(null);

  useEffect(() => {
    loadSubscriber();
  }, []);

  const loadSubscriber = async () => {
    try {
      const data = await getSubscriber(id);
      setSubscriber(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!subscriber) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
        Loading subscriber details...
      </div>
    );
  }

  const displayName = subscriber.full_name || subscriber.name;
  const validIdImage = imageUrl(subscriber.id_image);
  const houseImage = imageUrl(subscriber.house_image);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Subscriber account
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Subscriber Details
        </h1>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Subscriber No.
            </p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">
              {subscriber.subscriber_no}
            </h2>
            <p className="mt-2 text-slate-600">{displayName}</p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-800">
            {subscriber.account_status}
          </span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Account Information
          </h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailItem label="Name" value={displayName} />
            <DetailItem label="Email" value={subscriber.email} />
            <DetailItem label="Birthday" value={formatDate(subscriber.birthday)} />
            <DetailItem label="Spouse" value={subscriber.spouse} />
            <DetailItem
              label="Wedding Anniversary"
              value={formatDate(subscriber.wedding_anniversary)}
            />
            <DetailItem label="Contact" value={subscriber.contact_number} />
            <DetailItem label="Installation" value={formatDate(subscriber.installation_date)} />
            <DetailItem label="Status" value={subscriber.account_status} />
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Plan Information
          </h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
                Internet
              </p>
              <p className="mt-2 font-black text-slate-950">
                {subscriber.internet_plan || "No internet plan"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {subscriber.speed || "Speed not set"}
              </p>
              <p className="mt-3 font-bold text-slate-950">
                {subscriber.internet_fee
                  ? formatMoney(subscriber.internet_fee)
                  : "No fee"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">
                Cable
              </p>
              <p className="mt-2 font-black text-slate-950">
                {subscriber.cable_plan || "No cable plan"}
              </p>
              <p className="mt-3 font-bold text-slate-950">
                {subscriber.cable_fee ? formatMoney(subscriber.cable_fee) : "No fee"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">
          Full Address and Location
        </h2>
        <dl className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <DetailItem label="Complete Address" value={subscriber.address} />
          </div>
          <DetailItem label="Street / House No." value={subscriber.street} />
          <DetailItem label="Barangay" value={subscriber.barangay} />
          <DetailItem label="City / Municipality" value={subscriber.city} />
          <DetailItem label="Province" value={subscriber.province} />
          <DetailItem label="Postal Code" value={subscriber.postal_code} />
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <ImagePanel
            title="Valid ID Image"
            src={validIdImage}
            alt="Subscriber valid ID"
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <ImagePanel
            title="House Picture"
            src={houseImage}
            alt="Subscriber house"
          />
        </div>
      </section>
    </div>
  );
}

export default SubscriberDetails;
