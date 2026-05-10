import {
  CreateReservationDTO,
  CreateReservationSlotDTO,
  UpdateReservationSlotDTO,
} from '@/types/payload/reservation';
import axiosInstance from '.';

export const reservationAPI = {
  // ------------------------------------------
  // [고객용 API]
  // ------------------------------------------

  // 예약자 생성 (고객)
  createCustomerReservation: async (
    storeId: number,
    data: CreateReservationDTO,
  ) => {
    const response = await axiosInstance.post(
      `/stores/${storeId}/reservations`,
      data,
    );
    return response.data;
  },

  // 예약 가능 시간대 목록 (고객)
  getCustomerReservationSlots: async (storeId: number) => {
    const response = await axiosInstance.get(
      `/stores/${storeId}/reservation-slots`,
    );
    return response.data;
  },

  // ------------------------------------------
  // [부스/관리자용 API]
  // ------------------------------------------

  // 예약 가능 시간대 생성 (부스)
  createReservationSlot: async (data: CreateReservationSlotDTO) => {
    const response = await axiosInstance.post('/reservation-slots', data);
    return response.data;
  },

  // 예약 가능 시간대 목록 (부스)
  getReservationSlots: async () => {
    const response = await axiosInstance.get('/reservation-slots');
    return response.data;
  },

  // 예약 가능 시간대 수정 (부스)
  updateReservationSlot: async (
    reservationSlotId: number,
    data: UpdateReservationSlotDTO,
  ) => {
    const response = await axiosInstance.patch(
      `/reservation-slots/${reservationSlotId}`,
      data,
    );
    return response.data;
  },

  // 예약 가능 시간대 삭제 (부스)
  deleteReservationSlot: async (reservationSlotId: number) => {
    const response = await axiosInstance.delete(
      `/reservation-slots/${reservationSlotId}`,
    );
    return response.data;
  },

  // 특정 시간대 예약자 목록 (부스)
  getReservationsBySlot: async (reservationSlotId: number) => {
    const response = await axiosInstance.get(
      `/reservation-slots/${reservationSlotId}/reservations`,
    );
    return response.data;
  },

  // 예약자 단건 조회 (부스)
  getReservationById: async (id: number) => {
    const response = await axiosInstance.get(`/reservations/${id}`);
    return response.data;
  },

  // 예약자 삭제 (부스, soft delete)
  deleteReservation: async (id: number) => {
    const response = await axiosInstance.delete(`/reservations/${id}`);
    return response.data;
  },

  // 예약자 생성 (부스)
  createBoothReservation: async (data: CreateReservationDTO) => {
    const response = await axiosInstance.post('/reservations', data);
    return response.data;
  },
};
