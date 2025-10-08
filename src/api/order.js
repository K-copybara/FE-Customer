import { client } from './client';

export const postRequest = async (data) => {
  try {
    const res = await client.post(`/api/customer/order-request`, data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getOrderHistory = async (customerKey) => {
  try {
    const res = await client.get(
      `/api/customer/orders?customerKey=${customerKey}`,
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const postPaymentConfirm = async (data) => {
  try {
    const res = await client.post(`/v1/payments/confirm`, data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const postPaymentPrepare = async (data) => {
  try {
    const res = await client.post(`/v1/payments/prepare`, data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
