import { client } from './client';

export const postChatSession = async (data) => {
  try {
    const res = await client.post(`/api/customer/chat/session`, data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getChatList = async () => {
  try {
    const res = await client.get(
      `/api/customer/chat/session/${sessionId}/messages`,
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
