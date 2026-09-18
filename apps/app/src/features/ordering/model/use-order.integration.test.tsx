import MockAdapter from 'axios-mock-adapter';
import { useOrder, useOrderStore } from '@/features/ordering';
import axiosInstance from '@/shared/api/instance';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => {
  const toast = {
    error: jest.fn(),
    success: jest.fn(),
  };
  return {
    __esModule: true,
    default: toast,
    toast,
  };
});

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/ordering',
          state: { userData: { userId: 5, tableId: 2 } },
        },
      ]}
    >
      {children}
    </MemoryRouter>
  );
}

describe('features/ordering useOrder (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
    useOrderStore.setState({ orderItems: [], depositorName: '' });
  });

  afterEach(() => {
    mock.restore();
  });

  it('blocks createOrder when cart is empty', async () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    let ok = true;
    await act(async () => {
      ok = await result.current.createOrder('Kim', '010-0000-0000');
    });

    expect(ok).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('주문할 메뉴가 없습니다.');
  });

  it('creates order payload and clears cart', async () => {
    useOrderStore.getState().addItem({
      id: 11,
      name: '김밥',
      price: 3000,
      quantity: 2,
      image: 'k.png',
    });

    mock.onPost('/orders').reply((config) => {
      const body = JSON.parse(config.data as string);
      const headers = config.headers as Record<string, string>;
      expect(
        headers?.['Idempotency-Key'] || headers?.['idempotency-key'],
      ).toMatch(/^order_/);
      expect(body).toMatchObject({
        storeId: 5,
        boothId: 5,
        tableId: 2,
        totalPrice: 6000,
        depositorName: 'Kim',
        phoneNumber: '010-1111-2222',
        items: [{ menuId: 11, price: 3000, quantity: 2 }],
      });
      return [201, { id: 1 }];
    });

    const { result } = renderHook(() => useOrder(), { wrapper });

    let ok = false;
    await act(async () => {
      ok = await result.current.createOrder('Kim', '010-1111-2222');
    });

    expect(ok).toBe(true);
    expect(useOrderStore.getState().orderItems).toHaveLength(0);
  });

  it('rejects overlapping createOrder calls', async () => {
    useOrderStore.getState().addItem({
      id: 11,
      name: '김밥',
      price: 3000,
      quantity: 1,
      image: 'k.png',
    });

    let resolvePost: (value: [number, object]) => void = () => undefined;
    mock.onPost('/orders').reply(
      () =>
        new Promise((resolve) => {
          resolvePost = resolve;
        }),
    );

    const { result } = renderHook(() => useOrder(), { wrapper });

    let first: Promise<boolean> | undefined;
    let second = true;
    await act(async () => {
      first = result.current.createOrder('Kim', '010-1111-2222');
      second = await result.current.createOrder('Kim', '010-1111-2222');
    });

    expect(second).toBe(false);
    expect(mock.history.post).toHaveLength(1);

    await act(async () => {
      resolvePost([201, { id: 1 }]);
      await first;
    });
  });

  it('loads orders and updates payment status', async () => {
    mock.onGet('/orders/all').reply(200, { data: [{ id: 1 }] });
    mock.onPatch('/orders/1/payment/paid').reply(200, { ok: true });
    mock
      .onGet('/orders', { params: { paid: true } })
      .reply(200, { data: [{ id: 1, paid: true }] });

    const { result } = renderHook(() => useOrder(), { wrapper });

    await act(async () => {
      await result.current.getOrders();
    });

    await waitFor(() =>
      expect(result.current.allOrders).toEqual({ data: [{ id: 1 }] }),
    );

    await act(async () => {
      await result.current.setPaymentPaid(1, true);
    });

    await waitFor(() =>
      expect(result.current.allOrders).toEqual({
        data: [{ id: 1, paid: true }],
      }),
    );
  });

  it('omits tableId when invalid and reads userData from sessionStorage', async () => {
    sessionStorage.setItem(
      'userData',
      JSON.stringify({ userId: 8, tableId: 0 }),
    );
    useOrderStore.getState().addItem({
      id: 1,
      name: 'A',
      price: 1000,
      quantity: 1,
      image: 'a.png',
    });

    const sessionWrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[{ pathname: '/ordering' }]}>
        {children}
      </MemoryRouter>
    );

    mock.onPost('/orders').reply((config) => {
      const body = JSON.parse(config.data as string);
      expect(body.storeId).toBe(8);
      expect(body.tableId).toBeUndefined();
      return [201, { id: 2 }];
    });

    const { result } = renderHook(() => useOrder(), {
      wrapper: sessionWrapper,
    });

    let ok = false;
    await act(async () => {
      ok = await result.current.createOrder('Lee', '010-2222-3333');
    });
    expect(ok).toBe(true);
  });

  it('surfaces createOrder API errors', async () => {
    useOrderStore.getState().addItem({
      id: 1,
      name: 'A',
      price: 1000,
      quantity: 1,
      image: 'a.png',
    });
    mock.onPost('/orders').reply(400, { message: '주문 실패' });

    const { result } = renderHook(() => useOrder(), { wrapper });

    let ok = true;
    await act(async () => {
      ok = await result.current.createOrder('Kim', '010-0000-0000');
    });

    expect(ok).toBe(false);
    expect(result.current.error).toBe('주문 실패');
    expect(toast.error).toHaveBeenCalledWith('주문 실패');
  });

  it('handles payment failed, cancel, complete and item toggle', async () => {
    mock.onGet('/orders/all').reply(200, { data: [] });
    mock.onGet('/orders', { params: { paid: false } }).reply(200, {
      data: [{ id: 9 }],
    });
    mock.onPatch('/orders/9/payment/failed').reply(200, { ok: true });
    mock.onPatch('/orders/9/status/cancelled').reply(200, { ok: true });
    mock.onPatch('/orders/9/status/completed').reply(200, { ok: true });
    mock.onPatch('/orders/items/3/toggle-completed').reply(200, { ok: true });

    const { result } = renderHook(() => useOrder(), { wrapper });

    await act(async () => {
      await result.current.setPaymentFailed(9, false);
      await result.current.setOrderCancelled(9, false);
      await result.current.setOrderCompleted(9, false);
      await result.current.toggleItemCompleted(3, false);
    });

    expect(toast.success).toHaveBeenCalled();
  });

  it('handles getOrders and mutation failures via handelError', async () => {
    mock.onGet('/orders/all').reply(500);
    mock.onPatch('/orders/1/payment/paid').reply(500);
    mock.onPatch('/orders/1/payment/failed').reply(500);
    mock.onPatch('/orders/1/status/cancelled').reply(500);
    mock.onPatch('/orders/1/status/completed').reply(500);
    mock.onPatch('/orders/items/1/toggle-completed').reply(500);

    const { result } = renderHook(() => useOrder(), { wrapper });

    await act(async () => {
      await result.current.getOrders();
      await result.current.setPaymentPaid(1);
      await result.current.setPaymentFailed(1);
      await result.current.setOrderCancelled(1);
      await result.current.setOrderCompleted(1);
      await result.current.toggleItemCompleted(1, true);
    });

    expect(toast.error).toHaveBeenCalled();
  });

  it('uses default createOrder error message when API omits message', async () => {
    useOrderStore.getState().addItem({
      id: 1,
      name: 'A',
      price: 1000,
      quantity: 1,
      image: 'a.png',
    });
    mock.onPost('/orders').reply(500, {});

    const { result } = renderHook(() => useOrder(), { wrapper });

    await act(async () => {
      await result.current.createOrder('Kim', '010-0000-0000');
    });

    expect(result.current.error).toBe('주문 중 오류가 발생했습니다.');
  });

  it('maps menuId from cart items that already use menuId', async () => {
    useOrderStore.setState({
      orderItems: [
        {
          id: 0,
          name: 'X',
          price: 500,
          quantity: 1,
          image: '',
          // runtime cart may carry menuId
          ...({ menuId: 99 } as object),
        } as never,
      ],
      depositorName: '',
    });

    mock.onPost('/orders').reply((config) => {
      const body = JSON.parse(config.data as string);
      expect(body.items[0].menuId).toBe(99);
      return [201, { id: 3 }];
    });

    const { result } = renderHook(() => useOrder(), { wrapper });
    await act(async () => {
      await result.current.createOrder('Park', '010-9999-8888');
    });
  });

  it('ignores sessionStorage userData when the value is the string undefined', async () => {
    sessionStorage.setItem('userData', 'undefined');
    const sessionWrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[{ pathname: '/ordering' }]}>
        {children}
      </MemoryRouter>
    );

    useOrderStore.getState().addItem({
      id: 1,
      name: 'A',
      price: 1000,
      quantity: 1,
      image: 'a.png',
    });

    mock.onPost('/orders').reply((config) => {
      const body = JSON.parse(config.data as string);
      expect(Number.isNaN(body.storeId)).toBe(true);
      return [201, { id: 4 }];
    });

    const { result } = renderHook(() => useOrder(), {
      wrapper: sessionWrapper,
    });

    await act(async () => {
      await result.current.createOrder('NoUser', '010-0000-0000');
    });
  });

  it('parses valid sessionStorage userData when router state is empty', async () => {
    sessionStorage.setItem(
      'userData',
      JSON.stringify({ userId: 11, tableId: 3 }),
    );
    const sessionWrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[{ pathname: '/ordering' }]}>
        {children}
      </MemoryRouter>
    );

    useOrderStore.getState().addItem({
      id: 1,
      name: 'A',
      price: 1000,
      quantity: 1,
      image: 'a.png',
    });

    mock.onPost('/orders').reply((config) => {
      const body = JSON.parse(config.data as string);
      expect(body.storeId).toBe(11);
      expect(body.tableId).toBe(3);
      return [201, { id: 5 }];
    });

    const { result } = renderHook(() => useOrder(), {
      wrapper: sessionWrapper,
    });

    await act(async () => {
      await result.current.createOrder('Stored', '010-0000-0000');
    });
  });

  it('falls back when sessionStorage userData JSON is invalid', async () => {
    sessionStorage.setItem('userData', '{not-json');
    const sessionWrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[{ pathname: '/ordering' }]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useOrder(), {
      wrapper: sessionWrapper,
    });
    expect(result.current.error).toBeNull();
  });
});
