// 예약 가능 시간대 생성 (관리자/부스)
export interface CreateReservationSlotDTO {
  startTime: string;
  endTime: string;
  availableTables: number;
}

// 예약 가능 시간대 수정 (관리자/부스)
export interface UpdateReservationSlotDTO {
  startTime?: string;
  endTime?: string;
  availableTables?: number;
}

// 예약자 생성 (고객 및 부스 공통 구조)
export interface CreateReservationDTO {
  reservationSlotId: number;
  reserverName: string;
  phoneNumber: string;
  partySize: number;
}

export interface TimeSlot {
  id: number;
  storeId: number;
  startTime: string;
  endTime: string;
  availableTables: number;
  createdAt: string;
  updatedAt: string;
  bookedTables?: number;
}

export interface ReservationInfo {
  id: number;
  reservationSlotId: number;
  reserverName: string;
  phoneNumber: string;
  partySize: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
