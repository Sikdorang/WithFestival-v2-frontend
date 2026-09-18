import {
  createIdempotencyKey,
  createInFlightLock,
  IDEMPOTENCY_HEADER,
  idempotencyHeaders,
  LEADING_SUBMIT_OPTIONS,
  SUBMIT_GUARD_MS,
} from './idempotency';

describe('shared/lib/idempotency', () => {
  it('exposes a short leading submit guard window', () => {
    expect(SUBMIT_GUARD_MS).toBe(200);
    expect(LEADING_SUBMIT_OPTIONS).toEqual({
      leading: true,
      trailing: false,
    });
  });

  it('creates scoped UUID keys', () => {
    const a = createIdempotencyKey('order');
    const b = createIdempotencyKey('order');

    expect(a).toMatch(/^order_/);
    expect(b).toMatch(/^order_/);
    expect(a).not.toBe(b);
  });

  it('builds Idempotency-Key headers', () => {
    expect(idempotencyHeaders('abc')).toEqual({
      [IDEMPOTENCY_HEADER]: 'abc',
    });
  });

  it('blocks overlapping acquires until release', () => {
    const lock = createInFlightLock();

    expect(lock.tryAcquire()).toBe(true);
    expect(lock.isLocked).toBe(true);
    expect(lock.tryAcquire()).toBe(false);

    lock.release();
    expect(lock.isLocked).toBe(false);
    expect(lock.tryAcquire()).toBe(true);
  });
});
