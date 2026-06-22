import api from "./api";

const getToken = () =>
  localStorage.getItem(
    "token"
  );

export const getCustomers = async () => {
  const response = await api.get("/customers", {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

export const createCustomer = async (data) => {
  const response = await api.post(
    "/customers",
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return response.data;
};

export const deleteCustomer = async (id) => {

  const response =
    await api.delete(
      `/customers/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;
};

export const updateCustomerStatus =
async ( id, status ) => {

  return api.put(
    `/customers/status/${id}`,
    { status },
    {
      headers: {
        Authorization:
        `Bearer ${getToken()}`
      }
    }
  );

};