import { ROUTES } from '@/constants/routes';
import { KEYS } from '@/constants/storage';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalUrl = error.config?.url || '';

    const isLoginRequest = originalUrl.includes('/auth/login');

    if (
      !isLoginRequest &&
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      sessionStorage.removeItem(KEYS.ACCESS_TOKEN);
      window.location.href = ROUTES.LOGIN;
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
