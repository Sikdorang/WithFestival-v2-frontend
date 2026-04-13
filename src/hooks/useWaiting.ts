import { handelError } from '@/apis/errorhandler';
import { waitingAPI } from '@/apis/waiting';
import { SUCCESS_MESSAGES } from '@/constants/message';
import { IWaitingListItem } from '@/types/global';
import { WaitingDTO } from '@/types/payload/waiting';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export const useWaiting = () => {
  const [waitingList, setWaitingList] = useState<IWaitingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const fetchWaiting = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await waitingAPI.getWaiting();
      setWaitingList(response.data);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getWaitingByUserId = async (userId: number) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await waitingAPI.getWaitingByUserId(userId);

      return response.data;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createWaiting = async (waiting: WaitingDTO) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await waitingAPI.createWaiting(waiting);
      toast.success(SUCCESS_MESSAGES.waitingCreateSuccess);
      return response.data;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWaiting = async (waitingId: string) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await waitingAPI.deleteWaiting(waitingId);
      toast.success(SUCCESS_MESSAGES.waitingCancelSuccess);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setWaitingProcessed = async (waitingId: number) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await waitingAPI.setWaitingProcessed(waitingId);
      await Promise.all([fetchWaiting()]);
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchWaiting,
    waitingList,
    createWaiting,
    setWaitingProcessed,
    deleteWaiting,
    getWaitingByUserId,
    isLoading,
    setIsLoading,
    loginError,
    setLoginError,
  };
};
