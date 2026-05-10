import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useMission } from './useMission';

export const useMissionForm = (missionId: number) => {
  const { missions, updateMission, createMission, fetchMissions } =
    useMission();

  const isNewMission = missionId === 0;

  const [formData, setFormData] = useState({
    missionName: '',
    description: '',
    reward: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNewMission && missions.length === 0) {
      fetchMissions();
    }
  }, [isNewMission, missions.length, fetchMissions]);

  useEffect(() => {
    if (isNewMission) return;

    const existingMission = missions.find((m) => m.id === missionId);

    if (existingMission) {
      setFormData({
        missionName: existingMission.missionName || '', // title -> missionName
        description: existingMission.description || '',
        reward: existingMission.reward || '',
      });
    }
  }, [missions, missionId, isNewMission]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveMission = async (): Promise<boolean> => {
    if (!formData.missionName) {
      toast.error('미션 이름은 필수입니다.');
      return false;
    }

    setIsSaving(true);

    try {
      const payload = {
        missionName: formData.missionName,
        description: formData.description,
        reward: formData.reward,
      };

      if (isNewMission) {
        await createMission(payload);
      } else {
        await updateMission(missionId, payload);
        await fetchMissions();
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    isNewMission,
    isSaving,
    handleChange,
    saveMission,
  };
};
