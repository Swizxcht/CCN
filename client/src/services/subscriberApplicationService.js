import api from "./api";

const getToken = () => localStorage.getItem("token");

export const applySubscription = async (data) => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  const response = await api.post(
    "/subscribers/apply",
    data,
    {
      headers,
    }
  );
  return response.data;
};

export const getPendingApplications = async () => {
  const response = await api.get(
    "/subscribers/pending-applications",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};

export const approveSubscriptionApplication = async (id, data) => {
  const response = await api.put(
    `/subscribers/pending-applications/${id}/approve`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};

export const declineSubscriptionApplication = async (id) => {
  const response = await api.put(
    `/subscribers/pending-applications/${id}/decline`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};

export const getPendingInstallations = async () => {
  const response = await api.get("/subscribers/technician/installations/pending");
  return response.data;
};

export const claimInstallation = async (id) => {
  const response = await api.put(
    `/subscribers/technician/installations/pending/${id}/claim`,
    {}
  );
  return response.data;
};

export const getAssignedInstallations = async () => {
  const response = await api.get("/subscribers/technician/installations/assigned");
  return response.data;
};

export const updateInstallationStatus = async (id, status) => {
  const response = await api.put(
    `/subscribers/technician/installations/assigned/${id}/status`,
    { status }
  );
  return response.data;
};
