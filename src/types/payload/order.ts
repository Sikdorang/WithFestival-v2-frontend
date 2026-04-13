export interface OrderItemDto {
  menu: string;
  price: number;
  count: number;
  totalprice: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  name: string;
  tableNumber: string;
  totalPrice: number;
}
