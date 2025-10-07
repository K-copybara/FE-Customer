import { client } from './client';

export const getStoreInfo = async () => {
  try {
    const res = await client.get(
      `/api/customer/store/${storeId}?tableId=${tableId}`,
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getCategoryInfo = async () => {
  try {
    const res = await client.get(`/api/customer/store/${storeId}/categories`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getMenuDetail = async (menuId) => {
  try {
    const res = await client.get(
      `/api/customer/store/${storeId}/menus/${menuId}`,
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getMenuAll = async () => {
  try {
    const res = await client.get(`/api/customer/store/${storeId}/menus`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
