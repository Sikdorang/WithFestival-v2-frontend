import HeartIcon from '@/assets/icons/ic_heart.svg?react';
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
  const userData =
    location.state?.userData ||
    JSON.parse(sessionStorage.getItem('userData') || '{}');

  // 1. 유저 식별을 위해 Mock Data 구조를 변경 (ID 포함)
  const tables: TableData[] = [
    {
      id: 1,
      users: [
        { userId: 'u1', name: '벚꽃구경' },
        { userId: 'u2', name: '봄바람' },
      ],
    },
    { id: 2, users: [{ userId: userData.userId, name: nickname }], isMe: true },
    { id: 3, users: [{ userId: 'u3', name: '경희대빵' }] },
    { id: 4, users: [{ userId: 'u4', name: '축제최고' }] },
    {
      id: 5,
      users: [
        { userId: 'u5', name: '친구만들기' },
        { userId: 'u6', name: '같이놀아요' },
      ],
    },
    { id: 6, users: [] },
  ];

  // 2. 좋아요 클릭 핸들러
  const handleLikeUser = (targetUser: User, tableId: number) => {
    if (targetUser.name === nickname) {
      toast.error('자기 자신은 선택할 수 없어요!');
      return;
    }

    // TODO: 소켓이나 API를 통해 좋아요 이벤트 전송
    console.log(
      `Like sent to: ${targetUser.name} (ID: ${targetUser.userId}) at Table ${tableId}`,
    );
    toast.success(`${targetUser.name}님에게 마음을 보냈어요! 💖`);
  };

  return (
    <div className="flex flex-col gap-6 bg-[#FEFCE8] p-4">
      {/* 상단 프로필 섹션 */}
      <div className="flex items-center justify-between rounded-2xl bg-[#FFF9C4] p-6 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#F4C45A]">내 닉네임</span>
          <span className="text-xl font-bold text-gray-900">{nickname}</span>
          <span className="text-sm text-gray-500">
            테이블 {userData.tableId}번
          </span>
        </div>
        <div className="flex flex-col items-center">
          <HeartIcon className="h-10 w-10 text-[#F4C45A]" />
          <span className="text-sm font-bold text-gray-400">0개</span>
        </div>
      </div>

      {/* 실시간 현황 섹션 */}
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">부스 실시간 현황</h2>

        <div className="grid grid-cols-3 gap-y-12 py-8">
          {tables.map((table) => (
            <div key={table.id} className="flex flex-col items-center gap-2">
              {/* 닉네임 리스트 (개별 버튼) */}
              <div className="flex min-h-[48px] flex-col justify-end gap-1.5">
                {table.users.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => handleLikeUser(user, table.id)}
                    className={`rounded-full border px-3 py-1 text-[10px] font-medium whitespace-nowrap transition-all active:scale-95 ${
                      table.isMe
                        ? 'border-[#F4C45A] bg-[#FFFDE7] text-[#F4C45A]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-[#F4C45A] hover:text-[#F4C45A]'
                    }`}
                  >
                    {user.name}
                  </button>
                ))}
              </div>

              {/* 테이블 이미지 */}
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
