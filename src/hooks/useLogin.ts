import { authAPI } from '@/apis/auth';
import { handelError } from '@/apis/errorhandler';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/message';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (code: string) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await authAPI.login(code);

      if (!response.success) {
        toast.error(ERROR_MESSAGES.invalidCodeError);
        return false;
      }

      toast.success(SUCCESS_MESSAGES.loginSuccess);
      navigate(ROUTES.MANAGE_WAITING);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    setIsLoading,
    loginError,
    setLoginError,
  };
};
