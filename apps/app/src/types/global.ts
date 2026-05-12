export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  marginRate: number;
  isSoldOut: boolean;
}

export interface Order {
  id: number;
  menu: string;
  price: number;
  description: string;
  image: string;
}

export interface WaitingDTO {
  name: string;
  phoneNumber: string;
  partySize: number;
}

export interface IWaitingListItem extends WaitingDTO {
  id: number;
  time: string;
  processed: boolean;
  userId: number;
}

export interface StoreInfo {
  name: string;
  account: string;
}

export interface OrderedListItem {
  id: number;
  menu: string;
  price: number;
  count: number;
  orderId: number;
}

export interface OrderItemSummary {
  id: number;
  orderId: number;
  menuId: number;
  quantity: number;
  price: number;
  name?: string;
  margin?: number;
}

export interface OrderSummary {
  id: number;
  storeId: number;
  tableId: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  customerName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemSummary[];
}

export interface OrderListApiResponse {
  success?: boolean;
  message?: string;
  data: OrderSummary[];
  count: number;
}

export interface IMessage {
  id: number;
  message: string;
  tableNumber: string;
  time: string;
  check: boolean;
}

export interface IUser {
  id: number;
  name: string;
  accountNumber: string;
  notice: string;
  event: string;
  reservationEnabled: boolean;
  missionsEnabled: boolean;
  waitingsEnabled: boolean;
  createdAt: string;
}

export interface Mission {
  id: number;
  storeId: number;
  missionName: string;
  description?: string;
  reward: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
