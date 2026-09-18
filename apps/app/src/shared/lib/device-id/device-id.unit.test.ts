import { getOrCreateDeviceId } from '@/shared/lib/device-id';

describe('shared/lib/device-id (unit)', () => {
  it('creates and persists a new device id', () => {
    const id = getOrCreateDeviceId();

    expect(id).toEqual(expect.any(String));
    expect(id.length).toBeGreaterThan(0);
    expect(localStorage.getItem('device_id')).toBe(id);
  });

  it('reuses an existing device id', () => {
    localStorage.setItem('device_id', 'fixed-device-id');

    expect(getOrCreateDeviceId()).toBe('fixed-device-id');
    expect(getOrCreateDeviceId()).toBe('fixed-device-id');
  });
});
