import { client } from './client';

export const postCart = async (data) => {
  try {
    const res = await client.post(`/api/customer/cart`, data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getCartData = async () => {
  try {
    const res = await client.get(
      `/api/customer/cart?storeId=${storeId}&customerKey=${customerKey}`,
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const patchCart = async (data) => {
  try {
    const res = await client.patch(`/api/customer/cart/${cartItemId}`, data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const deleteCart = async () => {
  try {
    const res = await client.patch(`/api/customer/cart/${cartItemId}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
