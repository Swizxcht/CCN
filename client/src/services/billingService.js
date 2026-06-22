import api from "./api";

const getToken = () =>
localStorage.getItem(
  "token"
);

export const getBills =
async (page = 1, limit = 10) => {

  const response =
    await api.get(
      "/bills",
      {
        headers: {
          Authorization:
          `Bearer ${getToken()}`
        },
        params: {
          page,
          limit,
        },
      }
    );

  return response.data;

};

export const generateBill =
async (data) => {

  return api.post(
    "/bills/generate",
    data,
    {
      headers: {
        Authorization:
        `Bearer ${getToken()}`
      }
    }
  );

};

export const generateAllBills =
async (data) => {

  return api.post(
    "/bills/generate-all",
    data,
    {
      headers: {
        Authorization:
        `Bearer ${getToken()}`
      }
    }
  );

};