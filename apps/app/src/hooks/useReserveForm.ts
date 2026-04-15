import { useEffect, useState } from 'react';
import { useReserve } from './useReserve';

export const useReserveForm = (slotId?: string) => {
  const { slots, fetchSlots, createSlot, updateSlot } = useReserve();
  const isNewSlot = slotId === '0' || !slotId;

  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    maxTables: '',
  });

  useEffect(() => {
    if (!isNewSlot && slots.length === 0) {
      fetchSlots();
    }
  }, [isNewSlot, slots.length, fetchSlots]);

  useEffect(() => {
    if (isNewSlot) return;

    const existingSlot = slots.find((s) => s.id === slotId);
    if (existingSlot) {
      setFormData({
        startTime: existingSlot.startTime,
        endTime: existingSlot.endTime,
        maxTables: existingSlot.maxTables.toString(),
      });
    }
  }, [slots, slotId, isNewSlot]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveSlot = async (isNew: boolean) => {
    const payload = {
      startTime: formData.startTime,
      endTime: formData.endTime,
      maxTables: Number(formData.maxTables),
    };

    if (isNew) {
      await createSlot(payload);
    } else {
      if (slotId) await updateSlot(slotId, payload);
    }
  };

  return {
    formData,
    handleChange,
    saveSlot,
  };
};
