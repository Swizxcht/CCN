import api from "./api";

const getToken = () =>
  localStorage.getItem(
    "token"
  );

export const getMyProfile =
async () => {

  const response =
    await api.get(
      "/subscribers/me/profile",
      {
        headers: {
          Authorization:
          `Bearer ${getToken()}`
        }
      }
    );

  return response.data;

};

export const getMyBills =
async () => {

  const response =
    await api.get(
      "/bills/my-bills",
      {
        headers: {
          Authorization:
          `Bearer ${getToken()}`
        }
      }
    );

  return response.data;

};

export const getDashboardSummary =
async () => {

  const response =
    await api.get(
      "/subscribers/me/dashboard",
      {
        headers: {
          Authorization:
          `Bearer ${getToken()}`
        }
      }
    );

  return response.data;

};

export const getMySubscriber =
async () => {

  const response =
    await api.get(
      "/subscribers/me",
      {
        headers: {
          Authorization:
          `Bearer ${getToken()}`
        }
      }
    );

  return response.data;

};

export const updateMyAddressInfo =
async (data) => {

  const response =
    await api.put(
      "/subscribers/me/address",
      data,
      {
        headers: {
          Authorization:
          `Bearer ${getToken()}`
        }
      }
    );

  return response.data;

};
