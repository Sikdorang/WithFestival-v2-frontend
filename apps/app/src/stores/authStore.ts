import { authAPI } from '@/apis/auth';
import { handelError } from '@/apis/errorhandler';
import { storeAPI } from '@/apis/store';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/message';
import { KEYS } from '@/constants/storage';
import { IUser } from '@/types/global';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

interface AuthState {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<IUser | void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  login: async (code: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authAPI.login(code);

      if (!response.accessToken) {
        toast.error(ERROR_MESSAGES.invalidCodeError);
        set({ isLoading: false, error: ERROR_MESSAGES.invalidCodeError });
        return false;
      }

      sessionStorage.setItem(KEYS.ACCESS_TOKEN, response.accessToken);

      try {
        // 로그인 성공 직후 내 스토어 정보를 가져와 상태 동기화
        await get().checkAuthStatus();
      } catch (error) {
        sessionStorage.removeItem(KEYS.ACCESS_TOKEN);
        throw new Error('스토어 정보를 불러오는데 실패했습니다.');
      }

      toast.success(SUCCESS_MESSAGES.loginSuccess);
      set({ isLoading: false });
      return true;
    } catch (error) {
      handelError(error);
      set({
        isLoading: false,
        error: '로그인 중 오류가 발생했습니다.',
        isLoggedIn: false,
        user: null,
      });
      return false;
    }
  },

  logout: () => {
    sessionStorage.removeItem(KEYS.ACCESS_TOKEN);
    set({ user: null, isLoggedIn: false });
  },

  checkAuthStatus: async () => {
    const token = sessionStorage.getItem(KEYS.ACCESS_TOKEN);
    if (!token) {
      set({ user: null, isLoggedIn: false });
      throw new Error('No access token found');
    }

    try {
      const response = await storeAPI.getStoreMyInfo();

      if (response && response.id) {
        set({ user: response, isLoggedIn: true });
        return response;
      } else {
        throw new Error('Invalid store data');
      }
    } catch (error) {
      sessionStorage.removeItem(KEYS.ACCESS_TOKEN);
      set({ user: null, isLoggedIn: false });
      throw error;
    }
  },
}));
