import MockAdapter from 'axios-mock-adapter';
import { orderAPI } from '@/entities/order';
import axiosInstance from '@/shared/api/instance';

describe('entities/order api (integration)', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('creates an order with Idempotency-Key', async () => {
    const payload = {
      storeId: 1,
      boothId: 1,
      items: [{ menuId: 10, price: 4000, quantity: 2 }],
      totalPrice: 8000,
      depositorName: 'Kim',
      phoneNumber: '010-1234-5678',
    };

    mock.onPost('/orders').reply((config) => {
      expect(config.headers?.['Idempotency-Key'] || config.headers?.['idempotency-key']).toBeTruthy();
      expect(JSON.parse(config.data)).toEqual(payload);
      return [201, { id: 99 }];
    });

    await expect(
      orderAPI.createOrder(payload, { idempotencyKey: 'order_test-key' }),
    ).resolves.toEqual({ id: 99 });
  });

  it('fetches paid and all orders', async () => {
    mock.onGet('/orders', { params: { paid: true } }).reply(200, { data: [] });
    mock.onGet('/orders/all').reply(200, { data: [{ id: 1 }] });

    await expect(orderAPI.getOrders(true)).resolves.toEqual({ data: [] });
    await expect(orderAPI.getAllOrders()).resolves.toEqual({
      data: [{ id: 1 }],
    });
  });

  it('patches payment and status endpoints', async () => {
    mock.onPatch('/orders/5/payment/paid').reply(200, { ok: true });
    mock.onPatch('/orders/5/payment/failed').reply(200, { ok: true });
    mock.onPatch('/orders/5/status/cancelled').reply(200, { ok: true });
    mock.onPatch('/orders/5/status/completed').reply(200, { ok: true });
    mock.onPatch('/orders/items/8/toggle-completed').reply(200, { ok: true });

    await expect(orderAPI.setPaymentPaid(5)).resolves.toEqual({ ok: true });
    await expect(orderAPI.setPaymentFailed(5)).resolves.toEqual({ ok: true });
    await expect(orderAPI.setOrderCancelled(5)).resolves.toEqual({ ok: true });
    await expect(orderAPI.setOrderCompleted(5)).resolves.toEqual({ ok: true });
    await expect(orderAPI.toggleOrderItemCompleted(8)).resolves.toEqual({
      ok: true,
    });
  });
});
