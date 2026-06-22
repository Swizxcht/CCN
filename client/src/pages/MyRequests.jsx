/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useState,
} from "react";

import {
  getMyRequests,
} from "../services/serviceRequestService";

function MyRequests() {

  const [
    requests,
    setRequests
  ] = useState([]);

  useEffect(() => {

    loadRequests();

  }, []);

  const loadRequests =
  async () => {

    try {

      const data =
        await getMyRequests();

      setRequests(data);

    } catch (
      error
    ) {

      console.error(error);

    }

  };

  return (

    <div className="max-w-6xl mx-auto py-10">

      <h1 className="text-3xl font-bold mb-6">
        My Requests
      </h1>

      <table className="w-full border">

        <thead>

          <tr>

            <th>ID</th>
            <th>Status</th>
            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {requests.map(
            (request) => (

            <tr key={request.id}>

              <td>
                {request.id}
              </td>

              <td>
                {request.status}
              </td>

              <td>
                {
                  request.created_at
                }
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default MyRequests;