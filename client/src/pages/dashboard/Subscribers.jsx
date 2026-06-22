/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import IconButton from "../../components/admin/IconButton";
import Pagination from "../../components/admin/Pagination";
import { PlusIcon, ViewIcon } from "../../components/icons";
import { getSubscribers } from "../../services/subscriberService";

const pageSize = 10;

function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const data = await getSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.max(1, Math.ceil(subscribers.length / pageSize));
  const paginatedSubscribers = useMemo(
    () => subscribers.slice((page - 1) * pageSize, page * pageSize),
    [subscribers, page]
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
            Accounts
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Subscribers
          </h1>
        </div>

        <Link
          to="/dashboard/subscribers/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          <PlusIcon />
          Add Subscriber
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-235 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Subscriber No",
                  "Name",
                  "Email",
                  "Status",
                  "Internet",
                  "Cable",
                  "Contact",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSubscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-4 py-3 font-bold text-slate-950">
                    {subscriber.subscriber_no}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {subscriber.full_name || subscriber.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {subscriber.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
                      {subscriber.account_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {subscriber.internet_plan || "None"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {subscriber.cable_plan || "None"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {subscriber.contact_number}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/dashboard/subscribers/${subscriber.id}`}>
                      <IconButton label="View subscriber" variant="primary">
                        <ViewIcon />
                      </IconButton>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default Subscribers;
