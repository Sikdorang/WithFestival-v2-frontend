import axiosInstance from '.';

export const authAPI = {
  login: async (authCode: string) => {
    const response = await axiosInstance.post('/auth/login', { authCode });
    return response.data;
  },

  me: async () => {
    const response = await axiosInstance.get('/auth/userId');
    return response.data;
  },
};
