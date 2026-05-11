export interface OrderItem {
  menuId: number;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  storeId: number;
  boothId: number;
  tableId: number | string;
  items: OrderItem[];
  totalPrice: number;
  depositorName: string;
}
