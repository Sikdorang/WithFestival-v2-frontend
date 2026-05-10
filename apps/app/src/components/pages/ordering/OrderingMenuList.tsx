import CancelIcon from '@/assets/icons/ic_cancel.svg?react';
import { useOrderStore } from '@/stores/orderStore';
import MenuItem from './MenuItem';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderingMenuListProps {
  items: OrderItem[];
}

export default function OrderingMenuList({ items }: OrderingMenuListProps) {
  const { decreaseItemQuantity } = useOrderStore();

  return (
    <div className="rounded-lg bg-white">
      {items.map((item) => (
        <div key={item.id} className="relative pr-10">
          <MenuItem
            name={item.name}
            price={item.price}
            image={item.image}
            quantity={item.quantity}
          />
          <button
            onClick={() => decreaseItemQuantity(item.id)}
            className="absolute top-5 right-2"
          >
            <CancelIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
