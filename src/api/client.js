import axios from 'axios';

export const client = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getCustomerKey = async (storeId, tableId) => {
  try {
    const res = await client.post('api/customer/session', { storeId, tableId });
    return res.data.data;
  } catch (err) {
    console.error(err);
  }
};

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      return Promise.reject(err);
    }

    return Promise.reject(error);
  },
);
