import api from "./api";

const getToken = () =>
localStorage.getItem(
"token"
);

export const getPayments =
async () => {

  const response =
  await api.get(
    "/payments",
    {
      headers: {
        Authorization:
        `Bearer ${getToken()}`
      }
    }
  );

  return response.data;

};

export const recordPayment =
async (data) => {

  return api.post(
    "/payments",
    data,
    {
      headers: {
        Authorization:
        `Bearer ${getToken()}`
      }
    }
  );

};

export const getUnpaidBills =
async () => {

  const response =
    await api.get(
      "/payments/unpaid-bills",
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;

};

export const getOutstandingBalance =
async (subscriberId) => {

  const response =
    await api.get(
      `/payments/balance/${subscriberId}`,
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;

};

export const getMyPayments =
async () => {
  const response =
    await api.get(
      "/payments/my-payments",
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;
};