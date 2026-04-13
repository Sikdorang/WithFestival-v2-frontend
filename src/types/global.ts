export interface Menu {
  id: number;
  menu: string;
  price: number;
  description: string;
  image: string;
  margin: number;
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
  people: number;
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

export interface orderUsers {
  id: number;
  menu: string;
  price: number;
  count: number;
  orderId: number;
  margin: number;
}

export interface OrderSummary {
  id: number;
  time: string;
  send: boolean;
  cooked: boolean;
  totalPrice: number;
  name: string;
  tableNumber: string;
  userid: number;
  orderUsers: orderUsers[];
}

export interface OrderListApiResponse {
  success: boolean;
  message: string;
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
  code: string;
  name: string;
  account: string;
}
