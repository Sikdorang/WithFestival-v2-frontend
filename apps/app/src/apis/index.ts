import axios from 'axios';
import { ROUTES } from '../constants/routes';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.location.href = ROUTES.LOGIN;
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
