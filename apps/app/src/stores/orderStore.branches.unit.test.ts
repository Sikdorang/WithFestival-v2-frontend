import { useOrderStore } from '@/stores/orderStore';

describe('stores/orderStore quantity branches (unit)', () => {
  beforeEach(() => {
    useOrderStore.setState({ orderItems: [], depositorName: '' });
  });

  it('decreases quantity without removing when still above zero', () => {
    useOrderStore.getState().addItem({
      id: 1,
      name: '떡볶이',
      price: 4000,
      quantity: 3,
      image: 'a.png',
    });

    useOrderStore.getState().decreaseItemQuantity(1);

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

  it('leaves unrelated items unchanged when decreasing another id', () => {
    useOrderStore.getState().addItem({
      id: 1,
      name: 'A',
      price: 1,
      quantity: 2,
      image: 'a.png',
    });
    useOrderStore.getState().addItem({
      id: 2,
      name: 'B',
      price: 2,
      quantity: 1,
      image: 'b.png',
    });

    useOrderStore.getState().decreaseItemQuantity(1);

    expect(useOrderStore.getState().orderItems).toEqual([
      { id: 1, name: 'A', price: 1, quantity: 1, image: 'a.png' },
      { id: 2, name: 'B', price: 2, quantity: 1, image: 'b.png' },
    ]);
  });

  it('merges into one item while leaving siblings unchanged', () => {
    useOrderStore.getState().addItem({
      id: 1,
      name: 'A',
      price: 1,
      quantity: 1,
      image: 'a.png',
    });
    useOrderStore.getState().addItem({
      id: 2,
      name: 'B',
      price: 2,
      quantity: 1,
      image: 'b.png',
    });
    useOrderStore.getState().addItem({
      id: 1,
      name: 'A',
      price: 1,
      quantity: 2,
      image: 'a.png',
    });

    expect(useOrderStore.getState().orderItems).toEqual([
      { id: 1, name: 'A', price: 1, quantity: 3, image: 'a.png' },
      { id: 2, name: 'B', price: 2, quantity: 1, image: 'b.png' },
    ]);
  });
});
