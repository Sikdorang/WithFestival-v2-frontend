import { handelError } from '@/apis/errorhandler';
import { storeAPI } from '@/apis/store';
import { SUCCESS_MESSAGES } from '@/constants/message';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export const useStore = () => {
  const [name, setName] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const [event, setEvent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const getUserInfo = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await storeAPI.getUserInfo();
      setName(response.data.name);
      setAccount(response.data.account);
      setNotice(response.data.notice);
      setEvent(response.data.event);
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInfoByUserId = async (userId: number) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const response = await storeAPI.getUserInfoByUserId(userId);
      setName(response.data.name);
      setAccount(response.data.account);
      setNotice(response.data.notice);
      setEvent(response.data.event);
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStoreAccount = async (account: string) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await storeAPI.updateStoreInfo(account);
      setAccount(account);
      toast.success(SUCCESS_MESSAGES.storeAccountUpdateSuccess);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStoreName = async (name: string) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await storeAPI.updateStoreName(name);
      setName(name);
      toast.success(SUCCESS_MESSAGES.storeNameUpdateSuccess);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStoreNotice = async (notice: string) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await storeAPI.updateStoreNotice(notice);
      setNotice(notice);
      toast.success(SUCCESS_MESSAGES.storeNoticeUpdateSuccess);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStoreEvent = async (event: string) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      await storeAPI.updateStoreEvent(event);
      setEvent(event);
      toast.success(SUCCESS_MESSAGES.storeEventUpdateSuccess);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    account,
    notice,
    event,
    getUserInfo,
    getUserInfoByUserId,
    updateStoreAccount,
    updateStoreName,
    updateStoreNotice,
    updateStoreEvent,
    isLoading,
    loginError,
  };
};
