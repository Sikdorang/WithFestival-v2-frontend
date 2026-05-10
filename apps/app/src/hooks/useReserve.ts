import { handelError } from '@/apis/errorhandler';
import { reservationAPI } from '@/apis/reservation';
import {
  CreateReservationSlotDTO,
  ReservationInfo,
  TimeSlot,
  UpdateReservationSlotDTO,
} from '@/types/payload/reservation';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export const useReserve = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // [부스/관리자용] 예약 가능 시간대 목록 조회
  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await reservationAPI.getReservationSlots();
      setSlots(response.data || response);
    } catch (error) {
      handelError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // [고객용] 특정 부스의 예약 가능 시간대 목록 조회
  const fetchCustomerSlots = useCallback(async (storeId: number) => {
    setIsLoading(true);
    try {
      const response =
        await reservationAPI.getCustomerReservationSlots(storeId);
      setSlots(response.data || response);
    } catch (error) {
      handelError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // [부스/관리자용] 예약 가능 시간대 생성
  const createSlot = async (payload: CreateReservationSlotDTO) => {
    setIsLoading(true);
    try {
      await reservationAPI.createReservationSlot(payload);
      await fetchSlots();
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // [부스/관리자용] 특정 시간대(Slot)의 예약자 목록 조회
  const fetchReservationsBySlot = useCallback(async (slotId: number) => {
    setIsLoading(true);
    try {
      const response = await reservationAPI.getReservationsBySlot(slotId);
      const rawData = response.data || response;

      const cleanedData: ReservationInfo[] = rawData.map((res: any) => ({
        id: res.id,
        reservationSlotId: res.reservationSlotId,
        reserverName: res.reserverName,
        phoneNumber: res.phoneNumber,
        partySize: res.partySize,
        deleted: res.deleted,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      }));

      setReservations(cleanedData);
      return cleanedData;
    } catch (error) {
      handelError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // [부스/관리자용] 예약 가능 시간대 수정
  const updateSlot = async (id: number, payload: UpdateReservationSlotDTO) => {
    setIsLoading(true);
    try {
      await reservationAPI.updateReservationSlot(id, payload);
      await fetchSlots();
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // [부스/관리자용] 예약 가능 시간대 삭제
  const deleteSlot = async (id: number) => {
    setIsLoading(true);
    try {
      await reservationAPI.deleteReservationSlot(id);
      await fetchSlots();
      toast.success('예약 시간대가 삭제되었습니다.');
      return true;
    } catch (error) {
      handelError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    slots,
    reservations,
    isLoading,
    fetchSlots,
    fetchCustomerSlots,
    fetchReservationsBySlot,
    createSlot,
    updateSlot,
    deleteSlot,
  };
};
