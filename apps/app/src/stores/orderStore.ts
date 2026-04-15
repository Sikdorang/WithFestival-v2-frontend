import { create } from 'zustand';

type NewOrderItem = Omit<OrderItem, 'quantity'>;

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderState {
  orderItems: OrderItem[];
  depositorName: string;
  addItem: (newItem: NewOrderItem) => void;
  removeItem: (itemId: number) => void;
  decreaseItemQuantity: (itemId: number) => void;
  clearOrder: () => void;
  setDepositorName: (name: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orderItems: [],
  depositorName: '',

  addItem: (newItem) =>
    set((state) => {
      const existingItem = state.orderItems.find(
        (item) => item.id === newItem.id,
      );

      if (existingItem) {
        return {
          orderItems: state.orderItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      } else {
        return {
          orderItems: [...state.orderItems, { ...newItem, quantity: 1 }],
        };
      }
    }),

  decreaseItemQuantity: (itemId: number) =>
    set((state) => ({
      orderItems: state.orderItems
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    })),

  removeItem: (itemId) =>
    set((state) => ({
      orderItems: state.orderItems.filter((item) => item.id !== itemId),
    })),

  clearOrder: () => set({ orderItems: [] }),

  setDepositorName: (name) => set({ depositorName: name }),
}));
