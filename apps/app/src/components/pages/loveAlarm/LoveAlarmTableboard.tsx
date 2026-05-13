import HeartIcon from '@/assets/icons/ic_heart.svg?react';
import { useLoveAlarm } from '@/hooks/useLoveAlarm';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

interface User {
  userId: string;
  name: string;
}

interface TableData {
  id: number;
  users: User[];
  isMe?: boolean;
}

export default function LoveAlarmTableboard({
  nickname,
}: {
  nickname: string;
}) {
  const location = useLocation();
  const userData = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('userData');
      return (
        location.state?.userData ||
        (stored && stored !== 'undefined' ? JSON.parse(stored) : {})
      );
    } catch {
      return {};
    }
  }, [location.state?.userData]);

  const storeId = Number(userData?.userId || userData?.id);
  const myTableId = Number(userData?.tableId);

  const {
    storeLikes,
    myLikeData,
    fetchStoreLikes,
    fetchMyLikes,
    incrementLike,
  } = useLoveAlarm();

  useEffect(() => {
    if (!storeId) return;

    const tokenUuid = localStorage.getItem('user_token_uuid');

    fetchStoreLikes(storeId);

    if (tokenUuid) {
      fetchMyLikes({ tokenUuid });
    }

    const interval = setInterval(() => {
      fetchStoreLikes(storeId);
      if (tokenUuid) {
        fetchMyLikes({ tokenUuid });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [storeId, fetchStoreLikes, fetchMyLikes]);

  const tables = useMemo(() => {
    const tablesMap = new Map<number, TableData>();

    if (myTableId) {
      tablesMap.set(myTableId, { id: myTableId, users: [], isMe: true });
    }

    storeLikes.forEach((tableGroup) => {
      const tId = tableGroup.tableId;

      const mappedUsers = tableGroup.likes.map((like, index) => ({
        userId: `${tId}-${like.nickname}-${index}`,
        name: like.nickname,
      }));

      tablesMap.set(tId, {
        id: tId,
        users: mappedUsers,
        isMe: tId === myTableId,
      });
    });
    const maxTable = Math.max(6, ...Array.from(tablesMap.keys()));
    for (let i = 1; i <= maxTable; i++) {
      if (!tablesMap.has(i)) {
        tablesMap.set(i, { id: i, users: [], isMe: i === myTableId });
      }
    }

    return Array.from(tablesMap.values()).sort((a, b) => a.id - b.id);
  }, [storeLikes, myTableId]);

  const handleLikeUser = async (targetUser: User, targetTableId: number) => {
    const tokenUuid = localStorage.getItem('user_token_uuid');

    if (targetUser.name === nickname && targetTableId === myTableId) {
      toast.error('자기 자신은 선택할 수 없어요!');
      return;
    }

    if (!tokenUuid) {
      toast.error('닉네임 설정 후 다시 시도해주세요.');
      return;
    }

    try {
      await incrementLike({
        nickname: targetUser.name,
        storeId,
        tableId: targetTableId,
        tokenUuid,
      });

      toast.success(`${targetUser.name}님에게 마음을 보냈어요! 💖`);
      fetchStoreLikes(storeId);
    } catch (error) {}
  };

  return (
    <div className="flex flex-col gap-6 bg-[#FEFCE8] p-4">
      {/* 상단 프로필 섹션 */}
      <div className="flex items-center justify-between rounded-2xl bg-[#FFF9C4] p-6 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#F4C45A]">내 닉네임</span>
          <span className="text-xl font-bold text-gray-900">{nickname}</span>
          <span className="text-sm text-gray-500">테이블 {myTableId}번</span>
        </div>
        <div className="flex flex-col items-center">
          <HeartIcon className="h-10 w-10 text-[#F4C45A]" />
          <span className="text-sm font-bold text-gray-400">
            {myLikeData?.likeCount || 0}개
          </span>
        </div>
      </div>

      {/* 실시간 현황 섹션 */}
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">부스 실시간 현황</h2>

        <div className="grid grid-cols-3 gap-y-12 py-8">
          {tables.map((table) => (
            <div
              key={`table-${table.id}`}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex min-h-[48px] flex-col justify-end gap-1.5">
                {table.users.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => handleLikeUser(user, table.id)}
                    className={`rounded-full border px-3 py-1 text-[10px] font-medium whitespace-nowrap transition-all active:scale-95 ${
                      table.isMe && user.name === nickname
                        ? 'border-[#F4C45A] bg-[#FFFDE7] text-[#F4C45A]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-[#F4C45A] hover:text-[#F4C45A]'
                    }`}
                  >
                    {user.name}
                  </button>
                ))}
              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full text-sm font-bold shadow-lg transition-transform ${
                  table.isMe
                    ? 'bg-[#F4C45A] text-white'
                    : 'bg-[#F2F4F6] text-gray-400'
                }`}
              >
                Table <br /> {table.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white/50 p-4 text-[11px] text-gray-400">
        <p className="font-bold">💡 사용 방법</p>
        <p>• 닉네임을 탭하면 해당 사람에게 마음(좋아요)을 보낼 수 있어요</p>
        <p>• 누군가 나를 좋아하면 종소리가 울려요!</p>
      </div>
    </div>
  );
}
