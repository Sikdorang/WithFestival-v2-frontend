import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useMission } from './useMission';

export const useMissionForm = (missionId: number) => {
  const {
    missions,
    updateMission,
    updateMissionImage,
    createMission,
    fetchMissions,
  } = useMission();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isNewMission = missionId === 0;

  // 1. 미션 전용 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
  });

  // 2. 이미지 처리 상태
  const [imageState, setImageState] = useState<{
    original: string | null;
    preview: string | null;
    file: File | null;
  }>({
    original: null,
    preview: null,
    file: null,
  });

  // 초기 데이터 로딩 (목록이 없을 경우)
  useEffect(() => {
    if (!isNewMission && missions.length === 0) {
      fetchMissions();
    }
  }, [isNewMission, missions.length, fetchMissions]);

  // 수정 모드일 때 기존 데이터 채워넣기
  useEffect(() => {
    if (isNewMission) return;

    const existingMission = missions.find((m) => m.id === missionId);

    if (existingMission) {
      setFormData({
        title: existingMission.title || '',
        description: existingMission.description || '',
        reward: existingMission.reward || '',
      });
      setImageState((prev) => ({
        ...prev,
        original: existingMission.image || null,
      }));
    }
  }, [missions, missionId, isNewMission]);

  // 입력값 변경 핸들러
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 이미지 선택 핸들러
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImageState((prev) => ({
          ...prev,
          file,
          preview: reader.result as string,
        }));
      reader.readAsDataURL(file);
    }
  };

  // 이미지 초기화
  const clearImage = () => {
    setImageState({ original: null, preview: null, file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 데이터 저장 로직
  const saveMission = async (isNew: boolean) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      reward: formData.reward,
      isActive: true, // 신규 생성 시 기본값
    };

    if (isNew) {
      // 추가 모드
      const newMission = await createMission(payload);
      // 미션 생성 후 이미지가 있다면 업로드
      if (newMission && imageState.file) {
        await updateMissionImage(newMission.id, imageState.file);
      }
    } else {
      // 수정 모드
      await updateMission(missionId, payload);
      // 새 이미지가 선택된 경우에만 업로드 API 호출
      if (imageState.file) {
        await updateMissionImage(missionId, imageState.file);
      }
      await fetchMissions(); // 최신 데이터 갱신
    }
  };

  return {
    formData,
    imageState,
    fileInputRef,
    handleChange,
    handleImageChange,
    clearImage,
    saveMission,
  };
};
