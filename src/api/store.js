import { client } from './client';

export const getStoreInfo = async (storeId, tableId) => {
  try {
    const res = await client.get(
      `/api/customer/store/${storeId}?tableId=${tableId}`,
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getCategoryInfo = async (storeId) => {
  try {
    const res = await client.get(`/api/customer/store/${storeId}/categories`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getMenuDetail = async (storeId, menuId) => {
  try {
    const res = await client.get(
      `/api/customer/store/${storeId}/menus/${menuId}`,
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getMenuAll = async (storeId) => {
  try {
    const res = await client.get(`/api/customer/store/${storeId}/menus`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
