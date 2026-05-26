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
  const { addItem, decreaseItemQuantity, removeItem } = useOrderStore();

  return (
    <div className="rounded-lg bg-white">
      {items.map((item) => (
        <div key={item.id} className="relative pr-8">
          <MenuItem
            name={item.name}
            price={item.price}
            image={item.image}
            quantity={item.quantity}
            onIncrease={() => addItem({ ...item, quantity: 1 })}
            onDecrease={() => decreaseItemQuantity(item.id)}
          />

          <button
            onClick={() => removeItem(item.id)}
            className="absolute top-2 right-0 p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <CancelIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
