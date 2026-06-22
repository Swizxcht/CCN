import api from "./api";

const getToken = () =>
localStorage.getItem(
"token"
);

export const getSubscribers =
async () => {

  const response =
  await api.get(
    "/subscribers",
    {
      headers: {
        Authorization:
        `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};

export const getAvailableUsers =
async () => {

  const response =
    await api.get(
      "/subscribers/available-users",
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;
};

export const createSubscriber =
async (data) => {

  const headers = {
    Authorization:
      `Bearer ${getToken()}`
  };

  return api.post(
    "/subscribers",
    data,
    {
      headers
    }
  );

};

export const getInternetPlans =
async () => {

  const response =
    await api.get(
      "/subscribers/internet-plans",
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;
};

export const getCablePlans =
async () => {

  const response =
    await api.get(
      "/subscribers/cable-plans",
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;
};

export const assignPlans =
async (data) => {

  return api.post(
    "/subscribers/assign-plans",
    data,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );

};

export const getSubscriber =
async (id) => {

  const response =
    await api.get(
      `/subscribers/${id}`,
      {
        headers: {
          Authorization:
          `Bearer ${getToken()}`
        }
      }
    );

  return response.data;

};
