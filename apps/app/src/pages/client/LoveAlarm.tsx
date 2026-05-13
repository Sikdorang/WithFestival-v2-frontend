import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import Navigator from '@/components/common/layouts/Navigator';
import LoveAlarmTableboard from '@/components/pages/loveAlarm/LoveAlarmTableboard';
import NicknameSetup from '@/components/pages/loveAlarm/NicknameSetup';
import { useLoveAlarm } from '@/hooks/useLoveAlarm'; // 💡 훅 임포트
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function LoveAlarm() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { setNickname: setApiNickname, isLoading } = useLoveAlarm();

  const userData = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('userData');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    const savedNickname = localStorage.getItem('user_nickname');
    setNickname(savedNickname);
    setIsLoaded(true);
  }, []);

  const handleNicknameSubmit = async (newNickname: string) => {
    const storeId = Number(userData?.userId);
    const tableId = Number(userData?.tableId);

    if (!storeId || !tableId) {
      toast.error('유효한 부스 또는 테이블 정보가 없습니다.');
      return;
    }

    try {
      const response = await setApiNickname({
        nickname: newNickname,
        storeId,
        tableId,
      });

      localStorage.setItem('user_nickname', newNickname);
      if (response?.tokenUuid) {
        localStorage.setItem('user_token_uuid', response.tokenUuid);
      }

      setNickname(newNickname);
    } catch (error) {
      console.error('닉네임 설정 실패:', error);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigator
        left={<GoBackIcon />}
        center={nickname ? '좋아하면 울리는' : '닉네임 설정'}
        onLeftPress={() => navigate(-1)}
      />

      <main className="flex flex-1 flex-col">
        {nickname ? (
          <LoveAlarmTableboard nickname={nickname} />
        ) : (
          <NicknameSetup
            onSubmit={handleNicknameSubmit}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
