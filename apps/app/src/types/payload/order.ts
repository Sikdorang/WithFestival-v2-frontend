export interface OrderItem {
  menuId: number;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  totalPrice: number;
  depositorName: string;
}
