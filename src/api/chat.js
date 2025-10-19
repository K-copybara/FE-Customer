import { client } from './client';

export const postChatSession = async (data) => {
  try {
    const res = await client.post(`/chatbot/api/customer/chat/session`, data);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const getChatList = async (sessionId) => {
  try {
    const res = await client.get(
      `/chatbot/api/customer/chat/session/${sessionId}/messages`,
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
