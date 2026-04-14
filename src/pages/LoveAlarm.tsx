import GoBackIcon from '@/assets/icons/ic_arrow_left.svg?react';
import Navigator from '@/components/common/layouts/Navigator';
import LoveAlarmTableboard from '@/components/pages/loveAlarm/LoveAlarmTableboard';
import NicknameSetup from '@/components/pages/loveAlarm/NicknameSetup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoveAlarm() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedNickname = localStorage.getItem('user_nickname');
    setNickname(savedNickname);
    setIsLoaded(true);
  }, []);

  const handleNicknameSubmit = (newNickname: string) => {
    localStorage.setItem('user_nickname', newNickname);
    setNickname(newNickname);
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
          <NicknameSetup onSubmit={handleNicknameSubmit} />
        )}
      </main>
    </div>
  );
}
