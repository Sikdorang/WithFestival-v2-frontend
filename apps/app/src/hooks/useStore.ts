import { handelError } from '@/apis/errorhandler';
import { storeAPI } from '@/apis/store';
import { SUCCESS_MESSAGES } from '@/constants/message';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

export const useStore = () => {
  const [storeId, setStoreId] = useState<number | undefined>(undefined);
  const [name, setName] = useState<string>('');
  const [account, setAccount] = useState<string>('');

  const [notice, setNotice] = useState<string>('');
  const [noticeEn, setNoticeEn] = useState<string>('');
  const [noticeZh, setNoticeZh] = useState<string>('');
  const [noticeJa, setNoticeJa] = useState<string>('');

  const [event, setEvent] = useState<string>('');
  const [waitingsEnabled, setWaitingsEnabled] = useState<boolean>(false);
  const [reservationEnabled, setReservationEnabled] = useState<boolean>(false);
  const [missionsEnabled, setMissionsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 내 스토어 정보 조회 (관리자용)
  // useCallback: 페이지 effect 의존성에 들어가므로 참조가 고정돼야 무한 요청이 안 생긴다.
  const getMyStoreInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await storeAPI.getStoreMyInfo();
      setStoreId(response.id);
      setName(response.name);
      setAccount(response.accountNumber);

      setNotice(response.notice);
      setNoticeEn(response.noticeEn);
      setNoticeZh(response.noticeZh);
      setNoticeJa(response.noticeJa);

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
  }, []);

  // 스토어 공개 정보 조회 (고객용)
  const getStorePublicInfo = useCallback(async (storeId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await storeAPI.getStorePublicInfo(storeId);
      setStoreId(storeId);
      setName(response.name);
      setAccount(response.accountNumber);

      setNotice(response.notice);
      setNoticeEn(response.noticeEn);
      setNoticeZh(response.noticeZh);
      setNoticeJa(response.noticeJa);

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
  }, []);

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
  // 서버가 공지 저장 중 다국어 번역까지 처리해 응답이 느리므로 화면에는 먼저 반영한다.
  const updateStoreNotice = async (newNotice: string) => {
    const previousNotice = notice;
    setNotice(newNotice);
    setIsLoading(true);
    setError(null);

    try {
      await storeAPI.updateStoreNotice(newNotice);
      toast.success(SUCCESS_MESSAGES.storeNoticeUpdateSuccess);
      return true;
    } catch (err) {
      // 그 사이 다른 값으로 다시 저장했다면 그 값을 덮어쓰지 않는다.
      setNotice((current) =>
        current === newNotice ? previousNotice : current,
      );
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
    noticeEn,
    noticeZh,
    noticeJa,
    event,
    waitingsEnabled,
    reservationEnabled,
    setReservationEnabled,
    setWaitingsEnabled,
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
