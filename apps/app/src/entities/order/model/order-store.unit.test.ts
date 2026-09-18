import { useOrderStore } from '@/entities/order';

describe('entities/order model (unit)', () => {
  beforeEach(() => {
    useOrderStore.setState({ orderItems: [], depositorName: '' });
  });

  it('adds a new item', () => {
    useOrderStore.getState().addItem({
      id: 1,
      name: '떡볶이',
      price: 4000,
      quantity: 2,
      image: 'a.png',
    });

    expect(useOrderStore.getState().orderItems).toEqual([
      {
        id: 1,
        name: '떡볶이',
        price: 4000,
        quantity: 2,
        image: 'a.png',
      },
    ]);
  });

  it('merges quantity for the same item id', () => {
    const { addItem } = useOrderStore.getState();
    addItem({
      id: 1,
      name: '떡볶이',
      price: 4000,
      quantity: 1,
      image: 'a.png',
    });
    addItem({
      id: 1,
      name: '떡볶이',
      price: 4000,
      quantity: 3,
      image: 'a.png',
    });

    expect(useOrderStore.getState().orderItems[0].quantity).toBe(4);
  });

  it('decreases quantity and removes when zero', () => {
    useOrderStore.getState().addItem({
      id: 2,
      name: '순대',
      price: 3000,
      quantity: 1,
      image: 'b.png',
    });

    useOrderStore.getState().decreaseItemQuantity(2);
    expect(useOrderStore.getState().orderItems).toHaveLength(0);
  });

  it('removes and clears items and sets depositor', () => {
    useOrderStore.getState().addItem({
      id: 3,
      name: '튀',
      price: 2000,
      quantity: 1,
      image: 'c.png',
    });
    useOrderStore.getState().setDepositorName('홍길동');
    useOrderStore.getState().removeItem(3);
    useOrderStore.getState().clearOrder();

    expect(useOrderStore.getState().orderItems).toEqual([]);
    expect(useOrderStore.getState().depositorName).toBe('홍길동');
  });
});
