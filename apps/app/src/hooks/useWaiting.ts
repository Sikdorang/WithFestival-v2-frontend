import { handelError } from '@/apis/errorhandler';
import { waitingAPI } from '@/apis/waiting';
import { SUCCESS_MESSAGES } from '@/constants/message';
import { IWaitingListItem } from '@/types/global';
import { CreateWaitingDTO } from '@/types/payload/waiting';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export const useWaiting = () => {
  const [waitingList, setWaitingList] = useState<IWaitingListItem[]>([]);
  const [activeWaitingCount, setActiveWaitingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 대기 팀 수 조회
  const fetchActiveWaitingCount = async (storeId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await waitingAPI.getActiveWaitingCount(storeId);
      setActiveWaitingCount(response.count);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 대기 목록 조회 (부스)
  const fetchWaitings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await waitingAPI.getWaitings();
      setWaitingList(response.data || response);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 대기 등록 (고객)
  const createWaiting = async (storeId: number, waiting: CreateWaitingDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await waitingAPI.createWaiting(storeId, waiting);
      toast.success(SUCCESS_MESSAGES.waitingCreateSuccess);
      return response.data || response;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 대기 상태 변경 (부스)
  const updateWaitingStatus = async (waitingId: number, status: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await waitingAPI.updateWaitingStatus(waitingId, { status });

      if (status === 'ENTERED') {
        toast.success('입장 처리되었습니다.');
      } else if (status === 'CANCELED') {
        toast.success(SUCCESS_MESSAGES.waitingCancelSuccess);
      }

      await fetchWaitings();
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchActiveWaitingCount,
    activeWaitingCount,
    waitingList,
    fetchWaitings,
    createWaiting,
    updateWaitingStatus,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
};
