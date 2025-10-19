import { client } from './client';

export const postReview = async (orderId, data) => {
  try {
    const res = await client.post(
      `/order/api/customer/orders/${orderId}/reviews`,
      data,
    );

    return res.data.data;
  } catch (err) {
    throw err;
  }
};
