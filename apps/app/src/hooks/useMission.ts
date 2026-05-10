import { handelError } from '@/apis/errorhandler';
import { missionAPI } from '@/apis/mission';
import { Mission } from '@/types/global';
import { MissionCreateDTO, MissionUpdateDTO } from '@/types/payload/mission';
import { useState } from 'react';
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
  const fetchMissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await missionAPI.getMissions();
      setMissions(response.data);
      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 미션 단건 조회
  const fetchMissionById = async (id: number) => {
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
  };

  // 3. 미션 생성
  const createMission = async (missionData: MissionCreateDTO) => {
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
  };

  // 4. 미션 정보 수정
  const updateMission = async (id: number, missionData: MissionUpdateDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await missionAPI.updateMission(id, missionData);

      // 상태 업데이트: 기존 목록에서 해당 id의 미션 데이터를 교체
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
  };

  // 5. 미션 삭제
  const deleteMission = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await missionAPI.deleteMission(id);

      // 상태 업데이트: 삭제된 미션을 목록에서 제거
      setMissions((prev) => prev.filter((mission) => mission.id !== id));
      toast.success(MISSION_SUCCESS_MESSAGES.deleteMissionSuccess);

      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 6. 미션 활성화 토글
  const toggleMissionActive = async (id: number, isActive: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await missionAPI.toggleMissionActive(id, isActive);

      // 상태 업데이트: 변경된 활성화 상태 반영
      setMissions((prev) =>
        prev.map((mission) => (mission.id === id ? response.data : mission)),
      );
      toast.success(MISSION_SUCCESS_MESSAGES.toggleActiveSuccess);

      return true;
    } catch (err) {
      handelError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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
    setMissions, // 필요한 경우 직접 제어하기 위해 노출
  };
};
