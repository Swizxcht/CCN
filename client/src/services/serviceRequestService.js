import api from "./api";

const getToken = () =>
  localStorage.getItem(
    "token"
  );

export const createRequest = async (data) => {

  const res = await api.post(
    "/service-requests",
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};

export const submitRequest =
async (data) => {

  return api.post(
    "/service-requests",
    data,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );

};

export const getMyRequests = async () => {
  const response = await api.get("/service-requests/my");
  return response.data;
};

export const getAssignedRequests = async () => {
  const response = await api.get("/service-requests/assigned");
  return response.data;
};

export const getPendingRequests = async () => {
  const response = await api.get("/service-requests/pending");
  return response.data;
};

export const claimRequest = async (id) => {
  const response = await api.put(
    `/service-requests/pending/${id}/claim`,
    {}
  );
  return response.data;
};

export const getAllRequests = async () => {
  const response = await api.get("/service-requests");
  return response.data;
};

export const getTechnicians =
async () => {
  const response = await api.get(
    "/service-requests/technicians",
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );
  return response.data;
};

export const assignTechnician = async (request_id, technician_id) => {
  const response = await api.put(
    "/service-requests/assign",
    { request_id, technician_id },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return response.data;
};

export const updateRequestStatus = async (id, status) => {
  const response = await api.put(
    `/service-requests/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return response.data;
};

export const updateAssignedRequestStatus = async (id, status) => {
  const response = await api.put(
    `/service-requests/assigned/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return response.data;
};

