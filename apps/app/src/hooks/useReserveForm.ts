import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useReserve } from './useReserve';

export const useReserveForm = (slotId?: string) => {
  const { slots, fetchSlots, createSlot, updateSlot, isLoading } = useReserve();

  const isNewSlot = slotId === '0' || !slotId;
  const numericSlotId = Number(slotId);

  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    availableTables: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNewSlot && slots.length === 0) {
      fetchSlots();
    }
  }, [isNewSlot, slots.length, fetchSlots]);

  useEffect(() => {
    if (isNewSlot) return;

    const existingSlot = slots.find((s) => s.id === numericSlotId);
    if (existingSlot) {
      setFormData({
        startTime: existingSlot.startTime,
        endTime: existingSlot.endTime,
        availableTables: existingSlot.availableTables.toString(), // 필드명 일치
      });
    }
  }, [slots, numericSlotId, isNewSlot]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveSlot = async () => {
    if (!formData.startTime || !formData.endTime || !formData.availableTables) {
      toast.error('모든 항목을 입력해주세요.');
      return false;
    }

    setIsSaving(true);
    try {
      const payload = {
        startTime: formData.startTime,
        endTime: formData.endTime,
        availableTables: Number(formData.availableTables),
      };

      if (isNewSlot) {
        await createSlot(payload);
        toast.success('예약 시간대가 추가되었습니다.');
      } else {
        if (!isNaN(numericSlotId)) {
          await updateSlot(numericSlotId, payload);
          toast.success('예약 시간대가 수정되었습니다.');
        }
      }
      return true;
    } catch (error) {
      console.error(error);
      toast.error('저장 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    isNewSlot,
    isLoading,
    isSaving,
    handleChange,
    saveSlot,
  };
};
