import { handelError } from '@/apis/errorhandler';
import { storeAPI } from '@/apis/store';
import { SUCCESS_MESSAGES } from '@/constants/message';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export const useStore = () => {
  const [storeId, setStoreId] = useState<number | undefined>(undefined);
  const [name, setName] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const [event, setEvent] = useState<string>('');
  const [waitingsEnabled, setWaitingsEnabled] = useState<boolean>(false);
  const [reservationEnabled, setReservationEnabled] = useState<boolean>(false);
  const [missionsEnabled, setMissionsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 내 스토어 정보 조회 (관리자용)
  const getMyStoreInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await storeAPI.getStoreMyInfo();
      setStoreId(response.id);
      setName(response.name);
      setAccount(response.accountNumber);
      setNotice(response.notice);
      setEvent(response.event);
      setWaitingsEnabled(response.waitingsEnabled);
      setReservationEnabled(response.reservationEnabled);
      setMissionsEnabled(response.missionsEnabled);
      return response;
    } catch (err) {
      handelError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 스토어 공개 정보 조회 (고객용)
  const getStorePublicInfo = async (storeId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await storeAPI.getStorePublicInfo(storeId);
      setStoreId(storeId);
      setName(response.name);
      setAccount(response.accountNumber);
      setNotice(response.notice);
      setEvent(response.event);
      setWaitingsEnabled(response.waitingsEnabled);
      setReservationEnabled(response.reservationEnabled);
      setMissionsEnabled(response.missionsEnabled);
      return response;
    } catch (err) {
      handelError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 계좌 번호 수정
  const updateStoreAccount = async (accountNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await storeAPI.updateStoreInfo(accountNumber);
      setAccount(accountNumber);
      toast.success(SUCCESS_MESSAGES.storeAccountUpdateSuccess);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 이름 수정
  const updateStoreName = async (newName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await storeAPI.updateStoreName(newName);
      setName(newName);
      toast.success(SUCCESS_MESSAGES.storeNameUpdateSuccess);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 공지 수정
  const updateStoreNotice = async (newNotice: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await storeAPI.updateStoreNotice(newNotice);
      setNotice(newNotice);
      toast.success(SUCCESS_MESSAGES.storeNoticeUpdateSuccess);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 이벤트 수정
  const updateStoreEvent = async (newEvent: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await storeAPI.updateStoreEvent(newEvent);
      setEvent(newEvent);
      toast.success(SUCCESS_MESSAGES.storeEventUpdateSuccess);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 기능(예약/미션/웨이팅) 활성화 상태 토글
  const updateStoreStatus = async (
    type: 'reservation' | 'mission' | 'waiting',
    enabled: boolean,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      if (type === 'reservation') {
        await storeAPI.updateStoreReservationEnabled(enabled);
        setReservationEnabled(enabled);
      } else if (type === 'mission') {
        await storeAPI.updateStoreMissionsEnabled(enabled);
        setMissionsEnabled(enabled);
      } else if (type === 'waiting') {
        await storeAPI.updateStoreWaitingsEnabled(enabled);
        setWaitingsEnabled(enabled);
      }
      toast.success('설정이 변경되었습니다.');
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    storeId,
    name,
    account,
    notice,
    event,
    waitingsEnabled,
    reservationEnabled,
    missionsEnabled,
    getMyStoreInfo,
    getStorePublicInfo,
    updateStoreAccount,
    updateStoreName,
    updateStoreNotice,
    updateStoreEvent,
    updateStoreStatus,
    isLoading,
    error,
  };
};
