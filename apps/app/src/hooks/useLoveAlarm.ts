import {
  loveAlarmAPI,
  StoreTableLikeResponse,
  TableLikePayload,
  TableLikeResponse,
} from '@/apis/LoveAlarm';
import { useCallback, useState } from 'react';

export const useLoveAlarm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [storeLikes, setStoreLikes] = useState<StoreTableLikeResponse[]>([]);
  const [myLikeData, setMyLikeData] = useState<TableLikeResponse | null>(null);

  const incrementLike = useCallback(async (payload: TableLikePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loveAlarmAPI.incrementLike(payload);
      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || '좋아요 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setNickname = useCallback(async (payload: TableLikePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loveAlarmAPI.setNickname(payload);
      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || '닉네임 설정 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStoreLikes = useCallback(async (storeId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loveAlarmAPI.getStoreLikes(storeId);
      setStoreLikes(result);
      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        '좋아요 목록 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMyLikes = useCallback(async (params?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loveAlarmAPI.getMyLikes(params);
      setMyLikeData(result);
      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || '내 좋아요 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    storeLikes,
    myLikeData,
    incrementLike,
    setNickname,
    fetchStoreLikes,
    fetchMyLikes,
  };
};
