import { handelError } from '@/apis/errorhandler';
import { missionAPI } from '@/apis/mission';
import { Mission } from '@/types/global';
import { MissionCreateDTO, MissionUpdateDTO } from '@/types/payload/mission';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const MISSION_SUCCESS_MESSAGES = {
  createMissionSuccess: '미션이 성공적으로 생성되었습니다.',
  updateMissionSuccess: '미션 정보가 수정되었습니다.',
  deleteMissionSuccess: '미션이 삭제되었습니다.',
  toggleActiveSuccess: '미션 상태가 변경되었습니다.',
};

export const useMission = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. 미션 목록 조회
  const fetchMissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await missionAPI.getMissions();
      setMissions(response);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMissionsByStoreId = useCallback(async (storeId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await missionAPI.getMissionsByStoreId(storeId);
      setMissions(response);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. 미션 단건 조회
  const fetchMissionById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await missionAPI.getMissionById(id);
      setCurrentMission(response.data);
      return response.data;
    } catch (err) {
      handelError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. 미션 생성
  const createMission = useCallback(async (missionData: MissionCreateDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await missionAPI.createMission(missionData);
      setMissions((prev) => [...prev, response.data]);
      toast.success(MISSION_SUCCESS_MESSAGES.createMissionSuccess);
      return response.data;
    } catch (err) {
      handelError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 4. 미션 정보 수정
  const updateMission = useCallback(
    async (id: number, missionData: MissionUpdateDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await missionAPI.updateMission(id, missionData);
        setMissions((prev) =>
          prev.map((mission) => (mission.id === id ? response.data : mission)),
        );
        toast.success(MISSION_SUCCESS_MESSAGES.updateMissionSuccess);
        return response.data;
      } catch (err) {
        handelError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // 5. 미션 삭제
  const deleteMission = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await missionAPI.deleteMission(id);
      setMissions((prev) => prev.filter((mission) => mission.id !== id));
      toast.success(MISSION_SUCCESS_MESSAGES.deleteMissionSuccess);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 6. 미션 활성화 토글
  const toggleMissionActive = useCallback(
    async (id: number, isActive: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await missionAPI.toggleMissionActive(id, isActive);
        setMissions((prev) =>
          prev.map((mission) => (mission.id === id ? response : mission)),
        );
        toast.success(MISSION_SUCCESS_MESSAGES.toggleActiveSuccess);
        return true;
      } catch (err) {
        handelError(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    missions,
    currentMission,
    isLoading,
    error,
    fetchMissions,
    fetchMissionById,
    createMission,
    updateMission,
    deleteMission,
    toggleMissionActive,
    setMissions,
    fetchMissionsByStoreId,
  };
};
