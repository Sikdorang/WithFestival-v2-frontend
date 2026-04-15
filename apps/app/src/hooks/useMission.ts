import { Mission } from '@/types/global';
import { useCallback, useState } from 'react';

const MOCK_MISSIONS: Mission[] = [
  {
    id: 1,
    title: '스태프와 가위바위보 이기기',
    description: '부스 입구 스태프를 찾아가 가위바위보를 해서 이기세요!',
    reward: '탄산음료 1캔 무료 증정',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: '인스타그램 팔로우 이벤트',
    description: '부스 공식 계정을 팔로우하고 스태프에게 인증하세요.',
    reward: '꽝 없는 랜덤 뽑기 1회권',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: '친구와 함께 방문 인증',
    description: '친구 3명과 함께 방문하여 단체 사진을 찍어주세요.',
    reward: '사이드 안주 50% 할인권',
    isActive: false,
    createdAt: new Date().toISOString(),
  },
];

export const useMission = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. 미션 목록 조회
  const fetchMissions = useCallback(async () => {
    setIsLoading(true);
    try {
      // 0.8초 지연 후 모킹 데이터 반환
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMissions(MOCK_MISSIONS);
    } catch (err) {
      console.error('Failed to fetch missions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. 미션 활성화 상태 토글 (Optimistic UI 적용)
  const toggleMissionStatus = useCallback((missionId: number) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId ? { ...m, isActive: !m.isActive } : m,
      ),
    );
  }, []);

  return {
    missions,
    isLoading,
    error,
    fetchMissions,
    toggleMissionStatus,
  };
};
