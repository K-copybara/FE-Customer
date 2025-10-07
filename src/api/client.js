import axios from 'axios';

export const client = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getCustomerKey = async () => {
  try {
    const res = await client.get('url');
    return res.data.data;
  } catch (err) {
    console.error(err);
  }
};
