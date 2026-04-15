import { useCallback, useState } from 'react';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxTables: number;
  bookedTables: number;
}

const MOCK_SLOTS: TimeSlot[] = [
  {
    id: '1',
    startTime: '17:00',
    endTime: '18:00',
    maxTables: 5,
    bookedTables: 3,
  },
  {
    id: '2',
    startTime: '18:00',
    endTime: '19:00',
    maxTables: 5,
    bookedTables: 5,
  },
];

export const useReserve = () => {
  const [slots, setSlots] = useState<TimeSlot[]>(MOCK_SLOTS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSlots(MOCK_SLOTS);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSlot = async (payload: Omit<TimeSlot, 'id' | 'bookedTables'>) => {
    // 실제 환경에서는 POST 요청을 수행합니다.
    const newSlot: TimeSlot = {
      ...payload,
      id: Date.now().toString(),
      bookedTables: 0,
    };
    setSlots((prev) => [...prev, newSlot]);
    return newSlot;
  };

  const updateSlot = async (
    id: string,
    payload: Omit<TimeSlot, 'id' | 'bookedTables'>,
  ) => {
    // 실제 환경에서는 PUT/PATCH 요청을 수행합니다.
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, ...payload } : slot)),
    );
  };

  const deleteSlot = async (id: string) => {
    // 실제 환경에서는 DELETE 요청을 수행합니다.
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  return {
    slots,
    isLoading,
    fetchSlots,
    createSlot,
    updateSlot,
    deleteSlot,
  };
};
