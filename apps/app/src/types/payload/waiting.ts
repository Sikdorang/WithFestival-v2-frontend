export interface WaitingDTO {
  name: string;
  phoneNumber: string;
  people: number;
  userId: number;
}

export interface CreateWaitingDTO {
  name: string;
  phoneNumber: string;
  partySize: number;
}

export interface UpdateWaitingStatusDTO {
  status: string;
}
